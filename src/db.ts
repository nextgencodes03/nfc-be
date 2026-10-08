import type { NFCCard, Order, Profile, SupportTicket, User, VisitSource } from '@/types'
import { mockNFCCards } from '@/data/nfcCards'
import { mockOrders } from '@/data/orders'
import { mockProfiles } from '@/data/profiles'
import { mockTickets } from '@/data/support'
import { mockUsers } from '@/data/users'
import mongoose from 'mongoose'
import { CardModel, CredentialModel, OrderModel, ProfileModel, TicketModel, UserModel, VisitModel } from './models'
import { mongoCollection } from './mongoStore'
import { collection, type Collection } from './store'

export interface VisitEvent {
  profileId: string
  source: VisitSource
  at: string
}

export const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? 'demo1234'

export let usingMongo = false

export const db: {
  users: Collection<User>
  profiles: Collection<Profile>
  orders: Collection<Order>
  cards: Collection<NFCCard>
  tickets: Collection<SupportTicket>
} = {
  users: collection<User>(mockUsers),
  profiles: collection<Profile>(mockProfiles),
  orders: collection<Order>(mockOrders),
  cards: collection<NFCCard>(mockNFCCards),
  tickets: collection<SupportTicket>(mockTickets),
}

export const passwords = new Map<string, string>()
export const visits: VisitEvent[] = []

function isUsableUri(uri: string | undefined): uri is string {
  if (!uri?.trim()) return false
  return !uri.includes('<username>') && !uri.includes('<password>')
}

export async function connectDb(): Promise<void> {
  const uri = process.env.MONGODB_URI

  if (!isUsableUri(uri)) {
    console.warn(
      'MONGODB_URI is missing. Using in-memory data.\n' +
        'Paste the Atlas Node.js driver string into NFC-BE/.env — not Atlas SQL.',
    )
    return
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
  usingMongo = true

  db.users = mongoCollection<User>(UserModel)
  db.profiles = mongoCollection<Profile>(ProfileModel)
  db.orders = mongoCollection<Order>(OrderModel)
  db.cards = mongoCollection<NFCCard>(CardModel)
  db.tickets = mongoCollection<SupportTicket>(TicketModel)

  await db.users.load(mockUsers)
  await db.profiles.load(mockProfiles)
  await db.orders.load(mockOrders)
  await db.cards.load(mockNFCCards)
  await db.tickets.load(mockTickets)

  const creds = await CredentialModel.find().select('-_id -__v').lean()
  if (creds.length === 0) {
    const seed = mockUsers.map((user) => ({ userId: user.id, password: DEMO_PASSWORD }))
    await CredentialModel.insertMany(seed)
    for (const row of seed) passwords.set(row.userId, row.password)
  } else {
    for (const row of creds) passwords.set(row.userId, row.password)
  }

  const storedVisits = await VisitModel.find().sort({ at: -1 }).limit(400).select('-_id -__v').lean()
  visits.splice(0, visits.length, ...storedVisits.map((visit) => ({
    profileId: visit.profileId,
    source: visit.source as VisitSource,
    at: visit.at,
  })))

  const dbName = mongoose.connection.name
  console.log(`Connected to MongoDB Atlas (${dbName})`)
}

export function savePassword(userId: string, password: string): void {
  passwords.set(userId, password)
  if (!usingMongo) return
  void CredentialModel.updateOne({ userId }, { userId, password }, { upsert: true }).catch((error) => {
    console.error('[mongo] credential', error)
  })
}

export function recordVisit(event: VisitEvent): void {
  visits.unshift(event)
  if (visits.length > 400) visits.length = 400
  if (!usingMongo) return
  void VisitModel.create(event).catch((error) => {
    console.error('[mongo] visit', error)
  })
}
