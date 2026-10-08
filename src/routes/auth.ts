import { Router } from 'express'
import type { LoginPayload, SignUpPayload, User } from '@/types'
import { issueToken, requireAuth, type AuthedRequest } from '../auth'
import { db, DEMO_PASSWORD, passwords, savePassword } from '../db'
import { HttpError, sendError } from '../http'
import { uid } from '@/utils/id'

export const authRouter = Router()

authRouter.post('/login', (req, res) => {
  try {
    const { email, password } = (req.body ?? {}) as LoginPayload
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      throw new HttpError('Email and password are required', 400, 'invalid_payload')
    }
    const user = db.users.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase())
    if (!user) throw new HttpError('No account found with that email', 404, 'user_not_found')

    const expected = passwords.get(user.id) ?? DEMO_PASSWORD
    if (password !== expected) throw new HttpError('Incorrect password', 401, 'bad_credentials')

    const { token, expiresAt } = issueToken(user)
    res.json({ user, token, expiresAt })
  } catch (error) {
    sendError(res, error)
  }
})

authRouter.post('/signup', (req, res) => {
  try {
    const payload = req.body as SignUpPayload
    const email = payload.email.trim().toLowerCase()
    if (db.users.find((user) => user.email.toLowerCase() === email)) {
      throw new HttpError('An account with that email already exists', 409, 'email_taken')
    }

    const order = payload.orderId ? db.orders.find((candidate) => candidate.id === payload.orderId) : undefined

    const user: User = {
      id: uid('usr'),
      name: payload.name.trim(),
      email,
      phone: payload.phone,
      role: 'customer',
      planId: order?.items[0]?.planId ?? 'basic',
      createdAt: new Date().toISOString(),
    }
    db.users.insert(user)
    savePassword(user.id, payload.password)

    if (order) {
      db.orders.update(
        (candidate) => candidate.id === order.id,
        (candidate) => ({
          ...candidate,
          customerId: user.id,
          customerName: user.name,
          customerEmail: user.email,
          updatedAt: new Date().toISOString(),
        }),
      )
      db.cards.update(
        (card) => card.orderId === order.id,
        (card) => ({ ...card, customerId: user.id, customerName: user.name }),
      )
    }

    const { token, expiresAt } = issueToken(user)
    res.status(201).json({ user, token, expiresAt })
  } catch (error) {
    sendError(res, error)
  }
})

authRouter.post('/logout', (_req, res) => {
  res.status(204).end()
})

authRouter.get('/demo', (_req, res) => {
  res.json([
    { label: 'Customer', email: 'krishna@nexalabs.dev', password: DEMO_PASSWORD },
    { label: 'Admin', email: 'admin@yourdomain.com', password: DEMO_PASSWORD },
  ])
})

authRouter.post('/forgot-password', (req, res) => {
  const email = String((req.body as { email?: string }).email ?? '')
  const exists = db.users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase())
  res.json({ sent: Boolean(exists) || true })
})

authRouter.get('/me', requireAuth, (req: AuthedRequest, res) => {
  res.json(req.user)
})

const ACCOUNT_FIELDS = ['name', 'email', 'phone', 'avatarUrl'] as const

authRouter.patch('/me', requireAuth, (req: AuthedRequest, res) => {
  try {
    const body = (req.body ?? {}) as Partial<User>
    const patch: Partial<User> = {}
    for (const key of ACCOUNT_FIELDS) {
      if (key in body) patch[key] = body[key] as never
    }

    const updated = db.users.update(
      (user) => user.id === req.user!.id,
      (user) => ({ ...user, ...patch }),
    )
    if (!updated) throw new HttpError('Account not found', 404)

    if ('avatarUrl' in patch) {
      const photoUrl = typeof patch.avatarUrl === 'string' ? patch.avatarUrl : ''
      db.profiles.update(
        (profile) => profile.userId === updated.id,
        (profile) => ({
          ...profile,
          personal: { ...profile.personal, photoUrl },
          updatedAt: new Date().toISOString(),
        }),
      )
    }

    res.json(updated)
  } catch (error) {
    sendError(res, error)
  }
})

authRouter.post('/change-password', requireAuth, (req: AuthedRequest, res) => {
  try {
    const { current, next } = req.body as { current: string; next: string }
    const expected = passwords.get(req.user!.id) ?? DEMO_PASSWORD
    if (current !== expected) throw new HttpError('Current password is incorrect', 401)
    savePassword(req.user!.id, next)
    res.status(204).end()
  } catch (error) {
    sendError(res, error)
  }
})
