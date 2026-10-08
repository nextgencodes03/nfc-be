import { Router } from 'express'
import type { Profile, ProfileDraft, ProfileStatus } from '@/types'
import { profileUrl } from '@/config/site'
import { defaultBusinessHours } from '@/data/profiles'
import { templateById } from '@/data/templates'
import { slugify } from '@/utils/format'
import { uid } from '@/utils/id'
import { requireAdmin, requireAuth, type AuthedRequest } from '../auth'
import { db } from '../db'
import { HttpError, sendError } from '../http'

const RESERVED = new Set(['admin', 'api', 'app', 'auth', 'dashboard', 'login', 'logout', 'p', 'pricing', 'signup', 'support', 'templates'])

export const profilesRouter = Router()

function syncProfileUrl(profile: Profile): void {
  const path = `/p/${profile.username}`
  db.orders.update(
    (order) => order.customerId === profile.userId,
    (order) => ({ ...order, profileUrl: path }),
  )
  db.cards.update(
    (card) => card.customerId === profile.userId && card.status !== 'available',
    (card) => ({ ...card, profileUrl: profileUrl(profile.username) }),
  )
}

export function emptyProfileDraft(templateId: Profile['templateId'] = 'professional'): ProfileDraft {
  return {
    username: '',
    status: 'draft',
    templateId,
    personal: { fullName: '', photoUrl: '', jobTitle: '', company: '', about: '', skills: [] },
    contact: { phone: '', whatsapp: '', email: '', website: '' },
    socials: [],
    business: { businessName: '', address: '', mapsUrl: '', hours: defaultBusinessHours(), services: [] },
    portfolio: [],
    customization: { ...templateById(templateId).defaults },
  }
}

profilesRouter.get('/username/:username', (req, res) => {
  try {
    const username = req.params.username
    const profile = db.profiles.find(
      (candidate) => candidate.username.toLowerCase() === username.trim().toLowerCase(),
    )
    if (!profile) throw new HttpError('Profile not found', 404, 'profile_not_found')
    if (profile.status === 'suspended') throw new HttpError('This profile is unavailable', 403, 'profile_suspended')
    res.json(profile)
  } catch (error) {
    sendError(res, error)
  }
})

profilesRouter.get('/username-available', (req, res) => {
  const username = String(req.query.username ?? '')
  const excludeProfileId = String(req.query.exclude ?? '')
  const normalized = username.trim().toLowerCase()
  if (RESERVED.has(normalized)) {
    res.json({ available: false })
    return
  }
  const taken = db.profiles.all().some(
    (profile) => profile.username.toLowerCase() === normalized && profile.id !== excludeProfileId,
  )
  res.json({ available: !taken })
})

profilesRouter.get('/suggest-username', (req, res) => {
  const fullName = String(req.query.name ?? '')
  const base = slugify(fullName.split(/\s+/)[0] ?? 'profile') || 'profile'
  const taken = new Set(db.profiles.all().map((profile) => profile.username.toLowerCase()))
  if (!taken.has(base) && !RESERVED.has(base)) {
    res.json({ username: base })
    return
  }
  let counter = 1
  while (taken.has(`${base}${counter}`)) counter += 1
  res.json({ username: `${base}${counter}` })
})

profilesRouter.get('/', requireAuth, requireAdmin, (_req, res) => {
  res.json(db.profiles.all())
})

profilesRouter.get('/id/:profileId', requireAuth, (req: AuthedRequest, res) => {
  const profile = db.profiles.find((candidate) => candidate.id === req.params.profileId) ?? null
  if (profile && req.user?.role !== 'admin' && profile.userId !== req.user?.id) {
    sendError(res, new HttpError('Forbidden', 403))
    return
  }
  res.json(profile)
})

profilesRouter.get('/me', requireAuth, (req: AuthedRequest, res) => {
  res.json(db.profiles.find((profile) => profile.userId === req.user!.id) ?? null)
})

profilesRouter.put('/', requireAuth, (req: AuthedRequest, res) => {
  try {
    const { draft, profileId } = req.body as { draft: ProfileDraft; profileId?: string }
    const now = new Date().toISOString()
    const userId = req.user!.id
    const existing = profileId
      ? db.profiles.find((profile) => profile.id === profileId)
      : db.profiles.find((profile) => profile.userId === userId)

    if (existing) {
      if (existing.userId !== userId && req.user!.role !== 'admin') {
        throw new HttpError('Forbidden', 403)
      }
      const updated = db.profiles.update(
        (profile) => profile.id === existing.id,
        (profile) => ({ ...profile, ...draft, updatedAt: now }),
      )
      if (!updated) throw new HttpError('Profile not found', 404)
      syncProfileUrl(updated)
      res.json(updated)
      return
    }

    const created: Profile = {
      ...draft,
      id: uid('prof'),
      userId,
      createdAt: now,
      updatedAt: now,
    }
    db.profiles.insert(created)
    db.users.update(
      (user) => user.id === userId,
      (user) => ({ ...user, profileId: created.id }),
    )
    syncProfileUrl(created)
    res.status(201).json(created)
  } catch (error) {
    sendError(res, error)
  }
})

profilesRouter.post('/:profileId/publish', requireAuth, (req: AuthedRequest, res) => {
  try {
    const existing = db.profiles.find((profile) => profile.id === req.params.profileId)
    if (!existing) throw new HttpError('Profile not found', 404)
    if (existing.userId !== req.user!.id && req.user!.role !== 'admin') throw new HttpError('Forbidden', 403)
    const now = new Date().toISOString()
    const updated = db.profiles.update(
      (profile) => profile.id === req.params.profileId,
      (profile) => ({ ...profile, status: 'published' as ProfileStatus, publishedAt: now, updatedAt: now }),
    )
    if (!updated) throw new HttpError('Profile not found', 404)
    syncProfileUrl(updated)
    res.json(updated)
  } catch (error) {
    sendError(res, error)
  }
})

profilesRouter.patch('/:profileId/status', requireAuth, requireAdmin, (req, res) => {
  try {
    const { status } = req.body as { status: ProfileStatus }
    const updated = db.profiles.update(
      (profile) => profile.id === req.params.profileId,
      (profile) => ({ ...profile, status, updatedAt: new Date().toISOString() }),
    )
    if (!updated) throw new HttpError('Profile not found', 404)
    res.json(updated)
  } catch (error) {
    sendError(res, error)
  }
})
