import type { NFCCard, Order, Profile, SupportTicket, User } from '@/types'
import { mockNFCCards } from '@/data/nfcCards'
import { mockOrders } from '@/data/orders'
import { mockProfiles } from '@/data/profiles'
import { mockTickets } from '@/data/support'
import { mockUsers } from '@/data/users'
import { collection } from './store'

export const db = {
  users: collection<User>(mockUsers),
  profiles: collection<Profile>(mockProfiles),
  orders: collection<Order>(mockOrders),
  cards: collection<NFCCard>(mockNFCCards),
  tickets: collection<SupportTicket>(mockTickets),
}

/** Seeded accounts share this password; sign-ups store their own. */
export const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? 'demo1234'
export const passwords = new Map<string, string>()
