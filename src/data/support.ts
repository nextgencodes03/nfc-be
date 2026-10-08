import type { SupportTicket } from '@/types'

export const mockTickets: SupportTicket[] = [
  {
    id: 'TKT-4012',
    customerId: 'usr_1005',
    customerName: 'Divya Raman',
    subject: 'Card arrived but does not open my profile',
    message:
      'I received NFC-1029 yesterday. When I tap it nothing happens on my Pixel 7. The QR code works fine.',
    category: 'card',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2026-09-25T06:12:00.000Z',
    updatedAt: '2026-09-26T09:40:00.000Z',
    replies: [
      {
        id: 'rep_1',
        author: 'support',
        message:
          'Thanks Divya — your card is showing as Assigned, not Active, which is why the tag is blank. We are programming it today and will confirm within 4 hours.',
        createdAt: '2026-09-25T08:02:00.000Z',
      },
    ],
  },
  {
    id: 'TKT-4009',
    customerId: 'usr_1003',
    customerName: 'Aanya Sharma',
    subject: 'Can I use a custom domain?',
    message: 'I would like my profile to live on card.studioaanya.com instead. Is that possible on Professional?',
    category: 'profile',
    status: 'open',
    priority: 'normal',
    createdAt: '2026-09-23T11:30:00.000Z',
    updatedAt: '2026-09-23T11:30:00.000Z',
    replies: [],
  },
  {
    id: 'TKT-3998',
    customerId: 'usr_1002',
    customerName: 'Meera Krishnan',
    subject: 'Invoice for the team order',
    message: 'Please send a GST invoice for order NFC-0001026 to accounts@vaaninteriors.in.',
    category: 'billing',
    status: 'resolved',
    priority: 'low',
    createdAt: '2026-09-11T04:15:00.000Z',
    updatedAt: '2026-09-11T10:02:00.000Z',
    replies: [
      {
        id: 'rep_2',
        author: 'support',
        message: 'Invoice INV-2026-0912 has been emailed to accounts@vaaninteriors.in. Let us know if anything is off.',
        createdAt: '2026-09-11T10:02:00.000Z',
      },
    ],
  },
]

export const supportTopics = [
  {
    title: 'Activating your card',
    description: 'What Assigned, Pending and Active mean, and how long activation takes.',
  },
  {
    title: 'Editing your profile',
    description: 'How changes propagate to cards you have already handed out.',
  },
  {
    title: 'NFC not working',
    description: 'Phone settings, case thickness and where to tap on each handset.',
  },
  {
    title: 'Billing & invoices',
    description: 'GST invoices, refunds and upgrading your plan.',
  },
]
