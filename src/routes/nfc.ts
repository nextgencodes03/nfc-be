import { Router } from 'express'
import type { NFCCard, NFCCardStatus } from '@/types'
import { profileUrl } from '@/config/site'
import { nextSequentialId, uid } from '@/utils/id'
import { requireAdmin, requireAuth, type AuthedRequest } from '../auth'
import { db } from '../db'
import { HttpError, sendError } from '../http'

export const nfcRouter = Router()

nfcRouter.get('/', requireAuth, requireAdmin, (_req, res) => {
  res.json(db.cards.all())
})

nfcRouter.get('/mine', requireAuth, (req: AuthedRequest, res) => {
  res.json(db.cards.filter((card) => card.customerId === req.user!.id))
})

nfcRouter.get('/:cardId', requireAuth, (req, res) => {
  try {
    const card = db.cards.find((candidate) => candidate.cardId.toLowerCase() === req.params.cardId.toLowerCase())
    if (!card) throw new HttpError('Card not found', 404)
    res.json(card)
  } catch (error) {
    sendError(res, error)
  }
})

nfcRouter.post('/:cardId/assign', requireAuth, requireAdmin, (req, res) => {
  try {
    const { customerId, orderId } = req.body as { customerId: string; orderId?: string }
    const customer = db.users.find((user) => user.id === customerId)
    if (!customer) throw new HttpError('Customer not found', 404)
    const profile = db.profiles.find((candidate) => candidate.userId === customerId)

    const updated = db.cards.update(
      (card) => card.cardId === req.params.cardId,
      (card) => ({
        ...card,
        status: 'assigned',
        customerId,
        customerName: customer.name,
        orderId: orderId ?? card.orderId,
        profileUrl: profile ? profileUrl(profile.username) : undefined,
        assignedAt: new Date().toISOString(),
      }),
    )
    if (!updated) throw new HttpError('Card not found', 404)

    if (updated.orderId) {
      db.orders.update(
        (order) => order.id === updated.orderId,
        (order) => ({ ...order, nfcCardId: updated.cardId, updatedAt: new Date().toISOString() }),
      )
    }
    res.json(updated)
  } catch (error) {
    sendError(res, error)
  }
})

nfcRouter.patch('/:cardId/status', requireAuth, requireAdmin, (req, res) => {
  try {
    const { status } = req.body as { status: NFCCardStatus }
    const now = new Date().toISOString()
    const updated = db.cards.update(
      (card) => card.cardId === req.params.cardId,
      (card) => ({
        ...card,
        status,
        activatedAt: status === 'active' ? (card.activatedAt ?? now) : card.activatedAt,
        ...(status === 'available'
          ? { customerId: undefined, customerName: undefined, orderId: undefined, profileUrl: undefined }
          : {}),
      }),
    )
    if (!updated) throw new HttpError('Card not found', 404)

    if (updated.orderId) {
      db.orders.update(
        (order) => order.id === updated.orderId,
        (order) => ({
          ...order,
          cardStatus: status === 'active' ? 'active' : status === 'blocked' ? 'inactive' : 'ready_to_activate',
          updatedAt: now,
        }),
      )
    }
    res.json(updated)
  } catch (error) {
    sendError(res, error)
  }
})

nfcRouter.post('/batch', requireAuth, requireAdmin, (req, res) => {
  try {
    const { count, batch } = req.body as { count: number; batch: string }
    const created: NFCCard[] = []
    const existing = db.cards.all().map((card) => card.cardId)
    for (let i = 0; i < count; i += 1) {
      const cardId = nextSequentialId([...existing, ...created.map((card) => card.cardId)], 'NFC-', 4)
      const card: NFCCard = {
        id: uid('card'),
        cardId,
        batch,
        status: 'available',
        taps: 0,
        createdAt: new Date().toISOString(),
      }
      db.cards.insert(card)
      created.push(card)
    }
    res.status(201).json(created)
  } catch (error) {
    sendError(res, error)
  }
})
