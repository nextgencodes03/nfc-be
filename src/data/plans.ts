import type { Coupon, Plan } from '@/types'

/**
 * Pricing lives here and nowhere else. Every page reads from this file,
 * so a price change is a one-line edit.
 */
export const currency = { code: 'INR', symbol: '₹' } as const

export const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Everything one person needs to stop handing out paper.',
    price: 999,
    compareAtPrice: 1499,
    currency: currency.code,
    currencySymbol: currency.symbol,
    billingNote: 'one-time · card included',
    highlighted: false,
    cardsIncluded: 1,
    cta: 'Get Basic',
    features: [
      { label: '1 printed NFC card', included: true },
      { label: 'Digital profile page', included: true },
      { label: 'QR code backup', included: true },
      { label: '1 template', included: true },
      { label: 'Save Contact (.vcf)', included: true },
      { label: 'Unlimited profile edits', included: true },
      { label: 'Custom colours & fonts', included: false },
      { label: 'Analytics dashboard', included: false },
      { label: 'Team management', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'For people who want the profile to look like their brand.',
    price: 1999,
    compareAtPrice: 2999,
    currency: currency.code,
    currencySymbol: currency.symbol,
    billingNote: 'one-time · card included',
    highlighted: true,
    badge: 'Most popular',
    cardsIncluded: 1,
    cta: 'Get Professional',
    features: [
      { label: '1 premium NFC card', included: true },
      { label: 'Digital profile page', included: true },
      { label: 'QR code backup', included: true },
      { label: 'All 4 templates', included: true },
      { label: 'Custom colours, fonts & buttons', included: true },
      { label: 'Unlimited social links', included: true },
      { label: 'Portfolio section', included: true },
      { label: 'Analytics dashboard', included: true },
      { label: 'Team management', included: false },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'One dashboard for the whole team, branded end to end.',
    price: 7999,
    currency: currency.code,
    currencySymbol: currency.symbol,
    billingNote: 'from · 5 cards included',
    highlighted: false,
    badge: 'Teams',
    cardsIncluded: 5,
    cta: 'Talk to sales',
    features: [
      { label: '5+ NFC cards', included: true },
      { label: 'Everything in Professional', included: true },
      { label: 'Team management', included: true },
      { label: 'Company branding on every card', included: true },
      { label: 'Company-wide analytics', included: true },
      { label: 'Custom domain support', included: true },
      { label: 'Bulk card assignment', included: true },
      { label: 'Priority support', included: true },
      { label: 'Dedicated account manager', included: true },
    ],
  },
]

export const planById = (id: Plan['id']): Plan =>
  plans.find((plan) => plan.id === id) ?? plans[0]

export const addOns = [
  { id: 'extra-card', name: 'Extra NFC card', price: 699, note: 'Same profile, second card' },
  { id: 'metal-card', name: 'Brushed metal card', price: 1499, note: 'Upgrade from PVC' },
  { id: 'rush', name: 'Rush production', price: 399, note: 'Ships within 24 hours' },
] as const

export const coupons: Coupon[] = [
  { code: 'LAUNCH20', label: '20% launch discount', type: 'percent', value: 20 },
  { code: 'FLAT200', label: '₹200 off orders above ₹1500', type: 'flat', value: 200, minSubtotal: 1500 },
]

export const shippingFee = 0
export const taxRatePercent = 18
