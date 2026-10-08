import type { PlanId } from './user'

export interface PlanFeature {
  label: string
  included: boolean
}

export interface Plan {
  id: PlanId
  name: string
  tagline: string
  /** Stored in the smallest sensible unit of the display currency. */
  price: number
  compareAtPrice?: number
  currency: string
  currencySymbol: string
  /** e.g. "one-time", "per user / year" */
  billingNote: string
  highlighted: boolean
  badge?: string
  cardsIncluded: number
  features: PlanFeature[]
  cta: string
}

export interface Coupon {
  code: string
  label: string
  type: 'percent' | 'flat'
  value: number
  minSubtotal?: number
}
