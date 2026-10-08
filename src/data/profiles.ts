import type { BusinessHour, Profile } from '@/types'
import { avatarPlaceholder, coverPlaceholder, logoPlaceholder } from '@/utils/placeholder'

export const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function defaultBusinessHours(): BusinessHour[] {
  return DAY_LABELS.map((_, day) => ({
    day,
    open: '09:30',
    close: '18:30',
    closed: day === 0,
  }))
}

/**
 * Seed profiles. These double as the public demos linked from the marketing site,
 * so each one shows a different template with realistic content.
 */
export const mockProfiles: Profile[] = [
  {
    id: 'prof_1001',
    userId: 'usr_1001',
    username: 'krishna',
    status: 'published',
    templateId: 'professional',
    personal: {
      fullName: 'Krishnaraj Dheenappan',
      photoUrl: avatarPlaceholder('Krishnaraj Dheenappan'),
      jobTitle: 'Full Stack Developer',
      company: 'Nexa Labs',
      about:
        "I build web products end to end — from the database schema to the last pixel. Six years across fintech and SaaS, currently leading front-end architecture at Nexa Labs. Happy to talk shop about design systems, performance budgets or anything React.",
      skills: ['React', 'Angular', 'JavaScript', 'TypeScript', 'Node.js', 'PostgreSQL'],
    },
    contact: {
      phone: '+919000012345',
      whatsapp: '919000012345',
      email: 'krishna@nexalabs.dev',
      website: 'https://krishnaraj.dev',
    },
    socials: [
      { id: 'soc_1', platform: 'linkedin', url: 'https://linkedin.com/in/krishnaraj', enabled: true },
      { id: 'soc_2', platform: 'github', url: 'https://github.com/krishnaraj', enabled: true },
      { id: 'soc_3', platform: 'twitter', url: 'https://x.com/krishnaraj', enabled: true },
      { id: 'soc_4', platform: 'instagram', url: 'https://instagram.com/krishnaraj', enabled: false },
    ],
    business: {
      businessName: 'Nexa Labs',
      address: 'WorkHub, 4th Floor, Anna Salai, Chennai 600002',
      mapsUrl: 'https://maps.google.com/?q=Anna+Salai+Chennai',
      hours: defaultBusinessHours(),
      services: [
        { id: 'svc_1', name: 'Web application development', description: 'React / Next.js products from scratch' },
        { id: 'svc_2', name: 'Front-end architecture review', description: 'Performance, structure and design systems' },
        { id: 'svc_3', name: 'Technical mentoring', description: '1:1 sessions for engineers moving into senior roles' },
      ],
    },
    portfolio: [
      {
        id: 'prj_1',
        title: 'Ledgerly — Fintech Dashboard',
        description: 'Real-time reconciliation dashboard handling 40k transactions a day for a lending platform.',
        imageUrl: coverPlaceholder('Ledgerly'),
        url: 'https://example.com/ledgerly',
      },
      {
        id: 'prj_2',
        title: 'Atlas Design System',
        description: '60+ accessible React components shared across four product teams.',
        imageUrl: coverPlaceholder('Atlas DS'),
        url: 'https://example.com/atlas',
      },
      {
        id: 'prj_3',
        title: 'Shopfront Analytics',
        description: 'Angular analytics suite for a retail chain across 120 stores.',
        imageUrl: coverPlaceholder('Shopfront'),
        url: 'https://example.com/shopfront',
      },
    ],
    customization: {
      primaryColor: '#5b3fe9',
      secondaryColor: '#11c5bd',
      buttonStyle: 'rounded',
      font: 'jakarta',
      background: 'light',
      logoUrl: logoPlaceholder('Nexa Labs'),
    },
    createdAt: '2026-06-12T09:20:00.000Z',
    updatedAt: '2026-09-18T11:05:00.000Z',
    publishedAt: '2026-06-14T06:40:00.000Z',
  },
  {
    id: 'prof_1002',
    userId: 'usr_1002',
    username: 'meera',
    status: 'published',
    templateId: 'business',
    personal: {
      fullName: 'Meera Krishnan',
      photoUrl: avatarPlaceholder('Meera Krishnan'),
      jobTitle: 'Founder & Principal Consultant',
      company: 'Vaan Interiors',
      about:
        'Fifteen years of turning empty shells into spaces people actually want to spend time in. We handle turnkey residential and boutique retail interiors across Chennai and Bengaluru.',
      skills: ['Turnkey interiors', 'Space planning', 'Project management', 'Vendor sourcing'],
    },
    contact: {
      phone: '+919812345670',
      whatsapp: '919812345670',
      email: 'meera@vaaninteriors.in',
      website: 'https://vaaninteriors.in',
    },
    socials: [
      { id: 'soc_5', platform: 'instagram', url: 'https://instagram.com/vaaninteriors', enabled: true },
      { id: 'soc_6', platform: 'facebook', url: 'https://facebook.com/vaaninteriors', enabled: true },
      { id: 'soc_7', platform: 'linkedin', url: 'https://linkedin.com/in/meerakrishnan', enabled: true },
    ],
    business: {
      businessName: 'Vaan Interiors',
      address: '12 Kasturi Rangan Road, Alwarpet, Chennai 600018',
      mapsUrl: 'https://maps.google.com/?q=Alwarpet+Chennai',
      hours: defaultBusinessHours().map((hour) =>
        hour.day === 6 ? { ...hour, open: '10:00', close: '14:00' } : hour,
      ),
      services: [
        { id: 'svc_4', name: 'Turnkey home interiors', description: 'Design, execution and handover in 90 days' },
        { id: 'svc_5', name: 'Retail & café fit-outs', description: 'Brand-led spaces built for footfall' },
        { id: 'svc_6', name: 'Design consultation', description: 'One-off site visits and layout advice' },
      ],
    },
    portfolio: [
      {
        id: 'prj_4',
        title: 'Alwarpet Residence',
        description: '3,200 sq ft apartment, warm minimal palette, delivered in 11 weeks.',
        imageUrl: coverPlaceholder('Alwarpet'),
        url: 'https://example.com/alwarpet',
      },
      {
        id: 'prj_5',
        title: 'Cafe Nilaa',
        description: 'A 48-cover speciality coffee bar in Indiranagar.',
        imageUrl: coverPlaceholder('Cafe Nilaa'),
        url: 'https://example.com/nilaa',
      },
    ],
    customization: {
      primaryColor: '#0f766e',
      secondaryColor: '#f59e0b',
      buttonStyle: 'square',
      font: 'inter',
      background: 'light',
      logoUrl: logoPlaceholder('Vaan Interiors'),
    },
    createdAt: '2026-05-02T09:20:00.000Z',
    updatedAt: '2026-09-11T08:15:00.000Z',
    publishedAt: '2026-05-04T06:40:00.000Z',
  },
  {
    id: 'prof_1003',
    userId: 'usr_1003',
    username: 'aanya',
    status: 'published',
    templateId: 'creative',
    personal: {
      fullName: 'Aanya Sharma',
      photoUrl: avatarPlaceholder('Aanya Sharma'),
      jobTitle: 'Brand Designer & Photographer',
      company: 'Studio Aanya',
      about:
        'I make brands look like themselves. Identity systems, art direction and photography for founders who are tired of looking like everyone else in their category.',
      skills: ['Brand identity', 'Art direction', 'Photography', 'Packaging', 'Figma'],
    },
    contact: {
      phone: '+919745612300',
      whatsapp: '919745612300',
      email: 'hello@studioaanya.com',
      website: 'https://studioaanya.com',
    },
    socials: [
      { id: 'soc_8', platform: 'instagram', url: 'https://instagram.com/studioaanya', enabled: true },
      { id: 'soc_9', platform: 'behance', url: 'https://behance.net/studioaanya', enabled: true },
      { id: 'soc_10', platform: 'dribbble', url: 'https://dribbble.com/studioaanya', enabled: true },
      { id: 'soc_11', platform: 'youtube', url: 'https://youtube.com/@studioaanya', enabled: true },
    ],
    business: {
      businessName: 'Studio Aanya',
      address: 'Hauz Khas Village, New Delhi 110016',
      mapsUrl: 'https://maps.google.com/?q=Hauz+Khas+Village',
      hours: defaultBusinessHours(),
      services: [
        { id: 'svc_7', name: 'Brand identity', description: 'Naming, logo, type and full guidelines' },
        { id: 'svc_8', name: 'Product photography', description: 'Studio and lifestyle shoots' },
        { id: 'svc_9', name: 'Packaging design', description: 'Print-ready artwork and dielines' },
      ],
    },
    portfolio: [
      {
        id: 'prj_6',
        title: 'Kettle & Co.',
        description: 'Full identity and packaging for a single-origin tea label.',
        imageUrl: coverPlaceholder('Kettle & Co'),
        url: 'https://example.com/kettle',
      },
      {
        id: 'prj_7',
        title: 'Moonlit Skincare',
        description: 'Art direction and a 40-shot product library.',
        imageUrl: coverPlaceholder('Moonlit'),
        url: 'https://example.com/moonlit',
      },
      {
        id: 'prj_8',
        title: 'Forma Studio',
        description: 'Rebrand for an architecture practice, from mark to signage.',
        imageUrl: coverPlaceholder('Forma'),
        url: 'https://example.com/forma',
      },
    ],
    customization: {
      primaryColor: '#db2777',
      secondaryColor: '#f97316',
      buttonStyle: 'pill',
      font: 'fraunces',
      background: 'gradient',
      logoUrl: logoPlaceholder('Studio Aanya'),
    },
    createdAt: '2026-07-21T09:20:00.000Z',
    updatedAt: '2026-09-20T15:45:00.000Z',
    publishedAt: '2026-07-22T06:40:00.000Z',
  },
  {
    id: 'prof_1004',
    userId: 'usr_1004',
    username: 'rahul',
    status: 'published',
    templateId: 'portfolio',
    personal: {
      fullName: 'Rahul Verma',
      photoUrl: avatarPlaceholder('Rahul Verma'),
      jobTitle: 'Principal Engineer & Mentor',
      company: 'Independent',
      about:
        'I help teams ship infrastructure that does not wake them up at night. Previously staff engineer at two unicorns; now consulting on platform reliability and mentoring senior engineers.',
      skills: ['Go', 'Kubernetes', 'Distributed systems', 'Observability', 'AWS'],
    },
    contact: {
      phone: '+919900887766',
      whatsapp: '919900887766',
      email: 'rahul@rahulverma.io',
      website: 'https://rahulverma.io',
    },
    socials: [
      { id: 'soc_12', platform: 'github', url: 'https://github.com/rahulverma', enabled: true },
      { id: 'soc_13', platform: 'linkedin', url: 'https://linkedin.com/in/rahulverma', enabled: true },
      { id: 'soc_14', platform: 'twitter', url: 'https://x.com/rahulverma', enabled: true },
    ],
    business: {
      businessName: 'Verma Consulting',
      address: 'Koramangala 5th Block, Bengaluru 560095',
      mapsUrl: 'https://maps.google.com/?q=Koramangala+Bengaluru',
      hours: defaultBusinessHours(),
      services: [
        { id: 'svc_10', name: 'Platform reliability audit', description: 'Two-week deep dive with a written action plan' },
        { id: 'svc_11', name: 'Fractional platform lead', description: 'Two days a week with your infra team' },
        { id: 'svc_12', name: 'Engineering mentorship', description: 'Fortnightly 1:1s for senior ICs' },
      ],
    },
    portfolio: [
      {
        id: 'prj_9',
        title: 'Zero-downtime migration',
        description: 'Moved 240 services to a new Kubernetes fleet with no customer-facing downtime.',
        imageUrl: coverPlaceholder('K8s migration'),
        url: 'https://example.com/migration',
      },
      {
        id: 'prj_10',
        title: 'Observability rebuild',
        description: 'Cut mean time to recovery from 48 minutes to 9.',
        imageUrl: coverPlaceholder('Observability'),
        url: 'https://example.com/observability',
      },
      {
        id: 'prj_11',
        title: 'openqueue',
        description: 'Open-source Go job queue with 3.4k stars.',
        imageUrl: coverPlaceholder('openqueue'),
        url: 'https://example.com/openqueue',
      },
    ],
    customization: {
      primaryColor: '#35e0d6',
      secondaryColor: '#8380fc',
      buttonStyle: 'rounded',
      font: 'space-grotesk',
      background: 'dark',
      logoUrl: '',
    },
    createdAt: '2026-04-08T09:20:00.000Z',
    updatedAt: '2026-09-02T10:10:00.000Z',
    publishedAt: '2026-04-09T06:40:00.000Z',
  },
]
