import type { TemplateId } from './template'
import type { PlanId } from './user'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type CardStatus = 'not_assigned' | 'ready_to_activate' | 'active' | 'inactive'
export type ShippingStatus = 'not_shipped' | 'processing' | 'shipped' | 'delivered'

export interface OrderItem {
  planId: PlanId
  name: string
  quantity: number
  unitPrice: number
}

export interface ShippingAddress {
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  templateId: TemplateId
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  currency: string
  couponCode?: string
  paymentStatus: PaymentStatus
  paymentReference?: string
  cardStatus: CardStatus
  nfcCardId?: string
  profileUrl?: string
  shippingStatus: ShippingStatus
  shippingAddress?: ShippingAddress
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export interface CheckoutPayload {
  planId: PlanId
  templateId: TemplateId
  quantity: number
  couponCode?: string
  customerName: string
  customerEmail: string
  shippingAddress: ShippingAddress
}
