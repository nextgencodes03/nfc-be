export type UserRole = 'customer' | 'admin'

export type PlanId = 'basic' | 'professional' | 'business'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  planId: PlanId
  avatarUrl?: string
  /** The profile this account owns. Multi-profile accounts come later. */
  profileId?: string
  createdAt: string
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: string
}

export interface SignUpPayload {
  name: string
  email: string
  password: string
  phone?: string
  /** Set when the customer signs up straight after checkout. */
  orderId?: string
}

export interface LoginPayload {
  email: string
  password: string
}
