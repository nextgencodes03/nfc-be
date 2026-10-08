import type { AnalyticsPoint, PlatformAnalytics, ProfileAnalytics } from '@/types'

/** Deterministic pseudo-random series so the mock charts look the same on every reload. */
function series(days: number, seed: number, base: number): AnalyticsPoint[] {
  const points: AnalyticsPoint[] = []
  let state = seed
  const today = new Date()

  for (let i = days - 1; i >= 0; i -= 1) {
    state = (state * 1103515245 + 12345) % 2147483648
    const noise = (state / 2147483648) * 0.8 + 0.6
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const weekendDip = date.getDay() === 0 || date.getDay() === 6 ? 0.55 : 1
    const views = Math.round(base * noise * weekendDip)
    points.push({
      date: date.toISOString().slice(0, 10),
      views,
      nfcTaps: Math.round(views * 0.46),
      qrScans: Math.round(views * 0.27),
    })
  }
  return points
}

const profileSeries: Record<string, AnalyticsPoint[]> = {
  prof_1001: series(30, 7717, 42),
  prof_1002: series(30, 9931, 61),
  prof_1003: series(30, 4471, 88),
  prof_1004: series(30, 2203, 33),
}

export const mockProfileAnalytics: Record<string, ProfileAnalytics> = {
  prof_1001: {
    profileId: 'prof_1001',
    totalViews: 1284,
    nfcTaps: 412,
    qrScans: 268,
    linkClicks: 736,
    contactSaves: 189,
    shares: 74,
    lastVisitAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    lastVisitSource: 'nfc',
    viewsTrend: 18.4,
    series: profileSeries.prof_1001,
    topActions: [
      { label: 'Save Contact', count: 189 },
      { label: 'WhatsApp', count: 164 },
      { label: 'Call', count: 142 },
      { label: 'LinkedIn', count: 128 },
      { label: 'GitHub', count: 71 },
    ],
    topLocations: [
      { city: 'Chennai', count: 604 },
      { city: 'Bengaluru', count: 281 },
      { city: 'Hyderabad', count: 156 },
      { city: 'Mumbai', count: 118 },
      { city: 'Dubai', count: 47 },
    ],
    deviceSplit: [
      { label: 'Mobile', percent: 86 },
      { label: 'Desktop', percent: 10 },
      { label: 'Tablet', percent: 4 },
    ],
  },
  prof_1002: {
    profileId: 'prof_1002',
    totalViews: 2410,
    nfcTaps: 968,
    qrScans: 512,
    linkClicks: 1380,
    contactSaves: 402,
    shares: 143,
    lastVisitAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    lastVisitSource: 'qr',
    viewsTrend: 9.1,
    series: profileSeries.prof_1002,
    topActions: [
      { label: 'Call', count: 421 },
      { label: 'WhatsApp', count: 388 },
      { label: 'Directions', count: 244 },
      { label: 'Save Contact', count: 402 },
      { label: 'Instagram', count: 198 },
    ],
    topLocations: [
      { city: 'Chennai', count: 1320 },
      { city: 'Bengaluru', count: 505 },
      { city: 'Coimbatore', count: 240 },
    ],
    deviceSplit: [
      { label: 'Mobile', percent: 91 },
      { label: 'Desktop', percent: 6 },
      { label: 'Tablet', percent: 3 },
    ],
  },
  prof_1003: {
    profileId: 'prof_1003',
    totalViews: 3892,
    nfcTaps: 1345,
    qrScans: 901,
    linkClicks: 2411,
    contactSaves: 517,
    shares: 289,
    lastVisitAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    lastVisitSource: 'nfc',
    viewsTrend: 27.6,
    series: profileSeries.prof_1003,
    topActions: [
      { label: 'Instagram', count: 903 },
      { label: 'Portfolio', count: 611 },
      { label: 'Save Contact', count: 517 },
      { label: 'WhatsApp', count: 388 },
      { label: 'Behance', count: 312 },
    ],
    topLocations: [
      { city: 'New Delhi', count: 1811 },
      { city: 'Mumbai', count: 902 },
      { city: 'Goa', count: 388 },
    ],
    deviceSplit: [
      { label: 'Mobile', percent: 88 },
      { label: 'Desktop', percent: 9 },
      { label: 'Tablet', percent: 3 },
    ],
  },
  prof_1004: {
    profileId: 'prof_1004',
    totalViews: 1043,
    nfcTaps: 604,
    qrScans: 201,
    linkClicks: 588,
    contactSaves: 161,
    shares: 66,
    lastVisitAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    lastVisitSource: 'link',
    viewsTrend: -4.2,
    series: profileSeries.prof_1004,
    topActions: [
      { label: 'GitHub', count: 344 },
      { label: 'Save Contact', count: 161 },
      { label: 'LinkedIn', count: 152 },
      { label: 'Email', count: 121 },
    ],
    topLocations: [
      { city: 'Bengaluru', count: 611 },
      { city: 'Pune', count: 188 },
      { city: 'Singapore', count: 92 },
    ],
    deviceSplit: [
      { label: 'Mobile', percent: 74 },
      { label: 'Desktop', percent: 22 },
      { label: 'Tablet', percent: 4 },
    ],
  },
}

export const mockPlatformAnalytics: PlatformAnalytics = {
  totalCustomers: 1284,
  activeCards: 1142,
  pendingActivation: 37,
  monthlyRevenue: 486_300,
  revenueTrend: 14.2,
  ordersThisMonth: 213,
  profileViews: 84_211,
  series: series(30, 5501, 2800),
  planSplit: [
    { label: 'Basic', count: 612 },
    { label: 'Professional', count: 548 },
    { label: 'Business', count: 124 },
  ],
}
