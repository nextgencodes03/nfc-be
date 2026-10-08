export type TicketStatus = 'open' | 'in_progress' | 'resolved'
export type TicketPriority = 'low' | 'normal' | 'high'

export interface SupportTicket {
  id: string
  customerId: string
  customerName: string
  subject: string
  message: string
  category: 'card' | 'profile' | 'billing' | 'shipping' | 'other'
  status: TicketStatus
  priority: TicketPriority
  createdAt: string
  updatedAt: string
  replies: { id: string; author: 'customer' | 'support'; message: string; createdAt: string }[]
}
