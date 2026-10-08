import { Router } from 'express'
import type { SupportTicket, TicketStatus, VisitSource } from '@/types'
import { mockPlatformAnalytics, mockProfileAnalytics } from '@/data/analytics'
import { plans } from '@/data/plans'
import { templates } from '@/data/templates'
import { uid } from '@/utils/id'
import { requireAdmin, requireAuth, type AuthedRequest } from '../auth'
import { db, recordVisit, visits } from '../db'
import { HttpError, sendError } from '../http'

function emptyAnalytics(profileId: string) {
  return {
    profileId,
    totalViews: 0,
    nfcTaps: 0,
    qrScans: 0,
    linkClicks: 0,
    contactSaves: 0,
    shares: 0,
    viewsTrend: 0,
    series: Array.from({ length: 30 }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - index))
      return { date: date.toISOString().slice(0, 10), views: 0, nfcTaps: 0, qrScans: 0 }
    }),
    topActions: [],
    topLocations: [],
    deviceSplit: [
      { label: 'Mobile', percent: 0 },
      { label: 'Desktop', percent: 0 },
      { label: 'Tablet', percent: 0 },
    ],
  }
}

function mergeLiveVisits(profileId: string) {
  const base = mockProfileAnalytics[profileId] ?? emptyAnalytics(profileId)
  const profileVisits = visits.filter((visit) => visit.profileId === profileId)
  if (!profileVisits.length) return base

  const latest = profileVisits[0]
  const today = new Date().toISOString().slice(0, 10)
  const nfcTaps = profileVisits.filter((visit) => visit.source === 'nfc').length
  const qrScans = profileVisits.filter((visit) => visit.source === 'qr').length

  return {
    ...base,
    totalViews: base.totalViews + profileVisits.length,
    nfcTaps: base.nfcTaps + nfcTaps,
    qrScans: base.qrScans + qrScans,
    lastVisitAt: latest.at,
    lastVisitSource: latest.source,
    series: base.series.map((point) =>
      point.date === today
        ? {
            ...point,
            views: point.views + profileVisits.filter((visit) => visit.at.slice(0, 10) === today).length,
            nfcTaps:
              point.nfcTaps +
              profileVisits.filter((visit) => visit.source === 'nfc' && visit.at.slice(0, 10) === today).length,
            qrScans:
              point.qrScans +
              profileVisits.filter((visit) => visit.source === 'qr' && visit.at.slice(0, 10) === today).length,
          }
        : point,
    ),
  }
}

export const catalogRouter = Router()
catalogRouter.get('/plans', (_req, res) => res.json(plans))
catalogRouter.get('/templates', (_req, res) => res.json(templates))

export const customersRouter = Router()
customersRouter.use(requireAuth, requireAdmin)

function customerRecord(userId: string) {
  const user = db.users.find((candidate) => candidate.id === userId)
  if (!user) return null
  const orders = db.orders.filter((order) => order.customerId === user.id)
  return {
    user,
    profile: db.profiles.find((profile) => profile.userId === user.id),
    orderCount: orders.length,
    cardIds: db.cards.filter((card) => card.customerId === user.id).map((card) => card.cardId),
    totalSpend: orders
      .filter((order) => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0),
  }
}

customersRouter.get('/', (_req, res) => {
  res.json(db.users.filter((user) => user.role === 'customer').map((user) => customerRecord(user.id)))
})

customersRouter.get('/:userId', (req, res) => {
  res.json(customerRecord(req.params.userId))
})

export const analyticsRouter = Router()

analyticsRouter.get('/platform', requireAuth, requireAdmin, (_req, res) => {
  res.json({
    ...mockPlatformAnalytics,
    totalCustomers: db.users.filter((user) => user.role === 'customer').length + 1278,
    activeCards: db.cards.filter((card) => card.status === 'active').length + 1138,
    pendingActivation: db.cards.filter((card) => card.status === 'pending' || card.status === 'assigned').length + 35,
  })
})

analyticsRouter.get('/profiles/:profileId', requireAuth, (req, res) => {
  res.json(mergeLiveVisits(String(req.params.profileId)))
})

analyticsRouter.post('/visits', (req, res) => {
  const { profileId, source } = req.body as { profileId: string; source: VisitSource }
  const profile = db.profiles.find((candidate) => candidate.id === profileId)
  if (!profile) {
    res.status(204).end()
    return
  }
  recordVisit({ profileId, source, at: new Date().toISOString() })
  if (source === 'nfc') {
    db.cards.update(
      (card) => card.customerId === profile.userId && card.status === 'active',
      (card) => ({ ...card, taps: card.taps + 1 }),
    )
  }
  res.status(204).end()
})

export const supportRouter = Router()

supportRouter.get('/', requireAuth, requireAdmin, (_req, res) => {
  res.json(db.tickets.all())
})

supportRouter.get('/mine', requireAuth, (req: AuthedRequest, res) => {
  res.json(db.tickets.filter((ticket) => ticket.customerId === req.user!.id))
})

supportRouter.post('/', requireAuth, (req: AuthedRequest, res) => {
  const payload = req.body as {
    subject: string
    message: string
    category: SupportTicket['category']
  }
  const now = new Date().toISOString()
  const existing = db.tickets.all().length + 4013
  const ticket: SupportTicket = {
    id: `TKT-${existing}`,
    customerId: req.user!.id,
    customerName: req.user!.name,
    subject: payload.subject,
    message: payload.message,
    category: payload.category,
    status: 'open',
    priority: 'normal',
    createdAt: now,
    updatedAt: now,
    replies: [],
  }
  res.status(201).json(db.tickets.insert(ticket))
})

supportRouter.post('/:ticketId/reply', requireAuth, (req: AuthedRequest, res) => {
  try {
    const { message } = req.body as { message: string }
    const author = req.user!.role === 'admin' ? 'support' : 'customer'
    const updated = db.tickets.update(
      (ticket) => ticket.id === req.params.ticketId,
      (ticket) => ({
        ...ticket,
        status: author === 'support' ? 'in_progress' : ticket.status,
        updatedAt: new Date().toISOString(),
        replies: [...ticket.replies, { id: uid('rep'), author, message, createdAt: new Date().toISOString() }],
      }),
    )
    if (!updated) throw new HttpError('Ticket not found', 404)
    res.json(updated)
  } catch (error) {
    sendError(res, error)
  }
})

supportRouter.patch('/:ticketId/status', requireAuth, requireAdmin, (req, res) => {
  try {
    const { status } = req.body as { status: TicketStatus }
    const updated = db.tickets.update(
      (ticket) => ticket.id === req.params.ticketId,
      (ticket) => ({ ...ticket, status, updatedAt: new Date().toISOString() }),
    )
    if (!updated) throw new HttpError('Ticket not found', 404)
    res.json(updated)
  } catch (error) {
    sendError(res, error)
  }
})
