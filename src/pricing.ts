import type { CheckoutPayload, Coupon } from '@/types'
import { coupons, planById, shippingFee, taxRatePercent } from '@/data/plans'

export interface PriceBreakdown {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  coupon?: Coupon
}

export function calculatePrice(
  planId: CheckoutPayload['planId'],
  quantity: number,
  couponCode?: string,
): PriceBreakdown {
  const plan = planById(planId)
  const subtotal = plan.price * Math.max(1, quantity)

  const coupon = couponCode
    ? coupons.find((candidate) => candidate.code.toUpperCase() === couponCode.trim().toUpperCase())
    : undefined

  let discount = 0
  if (coupon && subtotal >= (coupon.minSubtotal ?? 0)) {
    discount = coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : coupon.value
    discount = Math.min(discount, subtotal)
  }

  const taxable = subtotal - discount
  const tax = Math.round((taxable * taxRatePercent) / 100)

  return {
    subtotal,
    discount,
    shipping: shippingFee,
    tax,
    total: taxable + tax + shippingFee,
    coupon: discount > 0 ? coupon : undefined,
  }
}

export function validateCoupon(code: string, subtotal: number): { coupon: Coupon } | { error: string } {
  const coupon = coupons.find((candidate) => candidate.code.toUpperCase() === code.trim().toUpperCase())
  if (!coupon) return { error: 'That coupon code is not valid' }
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return { error: `Spend ₹${coupon.minSubtotal} or more to use this code` }
  }
  return { coupon }
}
