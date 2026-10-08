import { Router } from 'express'
import type { CheckoutPayload, Order } from '@/types'
import { planById } from '@/data/plans'
import { nextSequentialId } from '@/utils/id'
import { requireAdmin, requireAuth, type AuthedRequest } from '../auth'
import { db } from '../db'
import { HttpError, sendError } from '../http'
import { calculatePrice, validateCoupon } from '../pricing'

export const ordersRouter = Router()

ordersRouter.post('/quote', (req, res) => {
  const { planId, quantity, couponCode } = req.body as CheckoutPayload
  res.json(calculatePrice(planId, quantity, couponCode))
})

ordersRouter.post('/coupon', (req, res) => {
  const { code, subtotal } = req.body as { code: string; subtotal: number }
  res.json(validateCoupon(code, subtotal))
})

ordersRouter.get('/', requireAuth, requireAdmin, (_req, res) => {
  res.json(db.orders.all())
})

ordersRouter.get('/mine', requireAuth, (req: AuthedRequest, res) => {
  res.json(db.orders.filter((order) => order.customerId === req.user!.id))
})

ordersRouter.get('/:orderId', (req, res) => {
  try {
    const order = db.orders.find((candidate) => candidate.id === req.params.orderId)
    if (!order) throw new HttpError('Order not found', 404)
    res.json(order)
  } catch (error) {
    sendError(res, error)
  }
})

ordersRouter.post('/', (req: AuthedRequest, res) => {
  try {
    const payload = req.body as CheckoutPayload
    const plan = planById(payload.planId)
    const price = calculatePrice(payload.planId, payload.quantity, payload.couponCode)
    const now = new Date().toISOString()
    const customerId = req.user?.id ?? ''

    const order: Order = {
      id: nextSequentialId(
        db.orders.all().map((item) => item.id),
        'NFC-',
        7,
      ),
      customerId,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      items: [
        {
          planId: plan.id,
          name: `${plan.name} — NFC card + profile`,
          quantity: payload.quantity,
          unitPrice: plan.price,
        },
      ],
      templateId: payload.templateId,
      subtotal: price.subtotal,
      discount: price.discount,
      shipping: price.shipping,
      tax: price.tax,
      total: price.total,
      currency: plan.currency,
      couponCode: price.coupon?.code,
      paymentStatus: 'pending',
      cardStatus: 'not_assigned',
      shippingStatus: 'not_shipped',
      shippingAddress: payload.shippingAddress,
      createdAt: now,
      updatedAt: now,
    }

    res.status(201).json(db.orders.insert(order))
  } catch (error) {
    sendError(res, error)
  }
})

ordersRouter.patch('/:orderId', requireAuth, requireAdmin, (req, res) => {
  try {
    const updated = db.orders.update(
      (order) => order.id === req.params.orderId,
      (order) => ({ ...order, ...req.body, updatedAt: new Date().toISOString() }),
    )
    if (!updated) throw new HttpError('Order not found', 404)
    res.json(updated)
  } catch (error) {
    sendError(res, error)
  }
})

ordersRouter.post('/:orderId/pay', (req, res) => {
  try {
    const method = ((req.body as { method?: string }).method ?? 'card') as 'card' | 'upi' | 'netbanking'
    const order = db.orders.find((candidate) => candidate.id === req.params.orderId)
    if (!order) throw new HttpError('Order not found', 404)

    const reference = `pay_${method.slice(0, 2).toUpperCase()}${Math.random().toString(36).slice(2, 12)}`
    const now = new Date().toISOString()

    const paid = db.orders.update(
      (candidate) => candidate.id === req.params.orderId,
      (candidate) => ({
        ...candidate,
        paymentStatus: 'paid' as const,
        paymentReference: reference,
        cardStatus: 'ready_to_activate' as const,
        shippingStatus: 'processing' as const,
        updatedAt: now,
      }),
    )
    if (!paid) throw new HttpError('Order not found', 404)

    const blank = db.cards.find((card) => card.status === 'available')
    const assigned = blank
      ? db.orders.update(
          (candidate) => candidate.id === paid.id,
          (candidate) => {
            db.cards.update(
              (card) => card.id === blank.id,
              (card) => ({
                ...card,
                status: 'assigned',
                customerId: paid.customerId,
                customerName: paid.customerName,
                orderId: paid.id,
                assignedAt: now,
              }),
            )
            return { ...candidate, nfcCardId: blank.cardId, updatedAt: now }
          },
        )
      : paid

    res.json({ order: assigned ?? paid, reference })
  } catch (error) {
    sendError(res, error)
  }
})
