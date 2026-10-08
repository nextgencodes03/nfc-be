import { Schema, model } from 'mongoose'

const opts = { versionKey: false } as const

export const UserModel = model(
  'User',
  new Schema(
    {
      id: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true, lowercase: true },
      phone: String,
      role: { type: String, required: true },
      planId: { type: String, required: true },
      avatarUrl: String,
      profileId: String,
      createdAt: { type: String, required: true },
    },
    opts,
  ),
)

export const ProfileModel = model(
  'Profile',
  new Schema(
    {
      id: { type: String, required: true, unique: true },
      userId: { type: String, required: true, index: true },
      username: { type: String, required: true, unique: true, lowercase: true },
      status: { type: String, required: true },
      templateId: { type: String, required: true },
      personal: { type: Schema.Types.Mixed, required: true },
      contact: { type: Schema.Types.Mixed, required: true },
      socials: { type: [Schema.Types.Mixed], default: [] },
      business: { type: Schema.Types.Mixed, required: true },
      portfolio: { type: [Schema.Types.Mixed], default: [] },
      customization: { type: Schema.Types.Mixed, required: true },
      createdAt: { type: String, required: true },
      updatedAt: { type: String, required: true },
      publishedAt: String,
    },
    opts,
  ),
)

export const OrderModel = model(
  'Order',
  new Schema(
    {
      id: { type: String, required: true, unique: true },
      customerId: { type: String, default: '' },
      customerName: String,
      customerEmail: String,
      items: { type: [Schema.Types.Mixed], default: [] },
      templateId: String,
      subtotal: Number,
      discount: Number,
      shipping: Number,
      tax: Number,
      total: Number,
      currency: String,
      couponCode: String,
      paymentStatus: String,
      paymentReference: String,
      cardStatus: String,
      nfcCardId: String,
      profileUrl: String,
      shippingStatus: String,
      shippingAddress: Schema.Types.Mixed,
      trackingNumber: String,
      createdAt: String,
      updatedAt: String,
    },
    opts,
  ),
)

export const CardModel = model(
  'NfcCard',
  new Schema(
    {
      id: { type: String, required: true, unique: true },
      cardId: { type: String, required: true, unique: true },
      batch: String,
      status: String,
      customerId: String,
      customerName: String,
      orderId: String,
      profileUrl: String,
      taps: { type: Number, default: 0 },
      assignedAt: String,
      activatedAt: String,
      createdAt: String,
    },
    opts,
  ),
)

export const TicketModel = model(
  'SupportTicket',
  new Schema(
    {
      id: { type: String, required: true, unique: true },
      customerId: String,
      customerName: String,
      subject: String,
      message: String,
      category: String,
      status: String,
      priority: String,
      createdAt: String,
      updatedAt: String,
      replies: { type: [Schema.Types.Mixed], default: [] },
    },
    opts,
  ),
)

export const CredentialModel = model(
  'Credential',
  new Schema(
    {
      userId: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    },
    opts,
  ),
)

export const VisitModel = model(
  'Visit',
  new Schema(
    {
      profileId: { type: String, required: true, index: true },
      source: { type: String, required: true },
      at: { type: String, required: true },
    },
    opts,
  ),
)
