import type { NextFunction, Request, Response } from 'express'
import type { User } from '@/types'
import { db } from './db'
import { HttpError } from './http'

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7

export interface AuthedRequest extends Request {
  user?: User
}

export function issueToken(user: User): { token: string; expiresAt: string } {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString()
  const payload = Buffer.from(JSON.stringify({ id: user.id, exp: expiresAt }), 'utf8').toString('base64url')
  return { token: `nfc.${payload}`, expiresAt }
}

export function userFromToken(token: string | undefined): User | null {
  if (!token?.startsWith('nfc.')) return null
  try {
    const payload = JSON.parse(Buffer.from(token.slice(4), 'base64url').toString('utf8')) as {
      id: string
      exp: string
    }
    if (new Date(payload.exp).getTime() < Date.now()) return null
    return db.users.find((user) => user.id === payload.id) ?? null
  } catch {
    return null
  }
}

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined
  const user = userFromToken(token)
  if (!user) {
    next(new HttpError('Please sign in', 401, 'unauthenticated'))
    return
  }
  req.user = user
  next()
}

export function requireAdmin(req: AuthedRequest, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new HttpError('Please sign in', 401, 'unauthenticated'))
    return
  }
  if (req.user.role !== 'admin') {
    next(new HttpError('Admin access required', 403, 'forbidden'))
    return
  }
  next()
}

export function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined
  req.user = userFromToken(token) ?? undefined
  next()
}
