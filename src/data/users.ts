import type { User } from '@/types'
import { avatarPlaceholder } from '@/utils/placeholder'

/** Seed accounts. Passwords are checked against DEMO_PASSWORD by the mock auth service. */
export const DEMO_PASSWORD = 'demo1234'

export const mockUsers: User[] = [
  {
    id: 'usr_1001',
    name: 'Krishnaraj Dheenappan',
    email: 'krishna@nexalabs.dev',
    phone: '+919000012345',
    role: 'customer',
    planId: 'professional',
    profileId: 'prof_1001',
    avatarUrl: avatarPlaceholder('Krishnaraj Dheenappan', 96),
    createdAt: '2026-06-12T09:15:00.000Z',
  },
  {
    id: 'usr_1002',
    name: 'Meera Krishnan',
    email: 'meera@vaaninteriors.in',
    phone: '+919812345670',
    role: 'customer',
    planId: 'business',
    profileId: 'prof_1002',
    avatarUrl: avatarPlaceholder('Meera Krishnan', 96),
    createdAt: '2026-05-02T09:15:00.000Z',
  },
  {
    id: 'usr_1003',
    name: 'Aanya Sharma',
    email: 'hello@studioaanya.com',
    phone: '+919745612300',
    role: 'customer',
    planId: 'professional',
    profileId: 'prof_1003',
    avatarUrl: avatarPlaceholder('Aanya Sharma', 96),
    createdAt: '2026-07-21T09:15:00.000Z',
  },
  {
    id: 'usr_1004',
    name: 'Rahul Verma',
    email: 'rahul@rahulverma.io',
    phone: '+919900887766',
    role: 'customer',
    planId: 'professional',
    profileId: 'prof_1004',
    avatarUrl: avatarPlaceholder('Rahul Verma', 96),
    createdAt: '2026-04-08T09:15:00.000Z',
  },
  {
    id: 'usr_1005',
    name: 'Divya Raman',
    email: 'divya.raman@gmail.com',
    phone: '+919445001122',
    role: 'customer',
    planId: 'basic',
    avatarUrl: avatarPlaceholder('Divya Raman', 96),
    createdAt: '2026-09-19T12:00:00.000Z',
  },
  {
    id: 'usr_1006',
    name: 'Imran Qureshi',
    email: 'imran@qgroup.co',
    phone: '+919812007733',
    role: 'customer',
    planId: 'basic',
    avatarUrl: avatarPlaceholder('Imran Qureshi', 96),
    createdAt: '2026-09-24T07:30:00.000Z',
  },
  {
    id: 'usr_0001',
    name: 'Platform Admin',
    email: 'admin@yourdomain.com',
    role: 'admin',
    planId: 'business',
    avatarUrl: avatarPlaceholder('Platform Admin', 96),
    createdAt: '2026-01-04T09:15:00.000Z',
  },
]

/** Shown on the login screen so the demo is one click away. */
export const demoCredentials = [
  { label: 'Customer', email: 'krishna@nexalabs.dev', password: DEMO_PASSWORD },
  { label: 'Admin', email: 'admin@yourdomain.com', password: DEMO_PASSWORD },
] as const
