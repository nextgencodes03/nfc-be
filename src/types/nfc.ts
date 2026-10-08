export type NFCCardStatus = 'available' | 'assigned' | 'pending' | 'active' | 'blocked'

export interface NFCCard {
  id: string
  /** Human-readable ID printed on the physical card, e.g. NFC-1025. */
  cardId: string
  batch: string
  status: NFCCardStatus
  customerId?: string
  customerName?: string
  orderId?: string
  /** The only thing ever written to the tag. */
  profileUrl?: string
  /** Number of times the tag has been tapped. */
  taps: number
  assignedAt?: string
  activatedAt?: string
  createdAt: string
}
