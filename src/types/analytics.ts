export type VisitSource = 'nfc' | 'qr' | 'link' | 'direct'

export interface AnalyticsPoint {
  date: string
  views: number
  nfcTaps: number
  qrScans: number
}

export interface TopAction {
  label: string
  count: number
}

export interface ProfileAnalytics {
  profileId: string
  totalViews: number
  nfcTaps: number
  qrScans: number
  linkClicks: number
  contactSaves: number
  shares: number
  lastVisitAt?: string
  lastVisitSource?: VisitSource
  /** Percentage change vs. the previous equivalent period. */
  viewsTrend: number
  series: AnalyticsPoint[]
  topActions: TopAction[]
  topLocations: { city: string; count: number }[]
  deviceSplit: { label: string; percent: number }[]
}

export interface PlatformAnalytics {
  totalCustomers: number
  activeCards: number
  pendingActivation: number
  monthlyRevenue: number
  revenueTrend: number
  ordersThisMonth: number
  profileViews: number
  series: AnalyticsPoint[]
  planSplit: { label: string; count: number }[]
}
