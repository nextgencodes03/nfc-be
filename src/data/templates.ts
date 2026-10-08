import type { TemplateDefinition, TemplateId } from '@/types'

export const templates: TemplateDefinition[] = [
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Clean, calm, credible.',
    description:
      'A restrained layout that puts your name, role and contact actions first. Built for developers, employees, consultants and corporate professionals who want to look sharp without looking loud.',
    bestFor: ['Developers', 'Employees', 'Consultants', 'Corporate'],
    accentPreview: ['#5b3fe9', '#11c5bd'],
    demoUsername: 'krishna',
    minPlan: 'basic',
    defaults: {
      primaryColor: '#5b3fe9',
      secondaryColor: '#11c5bd',
      buttonStyle: 'rounded',
      font: 'jakarta',
      background: 'light',
      logoUrl: '',
    },
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Built to convert a tap into a call.',
    description:
      'Leads with your business identity, opening hours and services, then makes calling or messaging you a single tap. Ideal for business owners, salespeople, agents and entrepreneurs.',
    bestFor: ['Business owners', 'Sales', 'Agents', 'Entrepreneurs'],
    accentPreview: ['#0f172a', '#f59e0b'],
    demoUsername: 'meera',
    minPlan: 'basic',
    defaults: {
      primaryColor: '#0f766e',
      secondaryColor: '#f59e0b',
      buttonStyle: 'square',
      font: 'inter',
      background: 'light',
      logoUrl: '',
    },
  },
  {
    id: 'creative',
    name: 'Creative',
    tagline: 'Bold colour, big type, real personality.',
    description:
      'A vivid, editorial layout with oversized typography and a gradient canvas. Made for designers, photographers, content creators and freelancers who are the brand.',
    bestFor: ['Designers', 'Photographers', 'Creators', 'Freelancers'],
    accentPreview: ['#db2777', '#f97316'],
    demoUsername: 'aanya',
    minPlan: 'professional',
    defaults: {
      primaryColor: '#db2777',
      secondaryColor: '#f97316',
      buttonStyle: 'pill',
      font: 'fraunces',
      background: 'gradient',
      logoUrl: '',
    },
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    tagline: 'Your work, front and centre.',
    description:
      'A dark, focused layout where projects take the lead and contact details stay one tap away. For developers, mentors and consultants who win work by showing it.',
    bestFor: ['Developers', 'Mentors', 'Consultants', 'Studios'],
    accentPreview: ['#0b0b13', '#35e0d6'],
    demoUsername: 'rahul',
    minPlan: 'professional',
    defaults: {
      primaryColor: '#35e0d6',
      secondaryColor: '#8380fc',
      buttonStyle: 'rounded',
      font: 'space-grotesk',
      background: 'dark',
      logoUrl: '',
    },
  },
]

export const templateById = (id: TemplateId): TemplateDefinition =>
  templates.find((template) => template.id === id) ?? templates[0]

export const fontOptions = [
  { id: 'jakarta', label: 'Jakarta', stack: "'Plus Jakarta Sans', sans-serif" },
  { id: 'inter', label: 'Inter', stack: "'Inter', sans-serif" },
  { id: 'sora', label: 'Sora', stack: "'Sora', sans-serif" },
  { id: 'space-grotesk', label: 'Grotesk', stack: "'Space Grotesk', sans-serif" },
  { id: 'fraunces', label: 'Fraunces', stack: "'Fraunces', serif" },
] as const

/** Curated palettes keep customer profiles looking professional. */
export const colorPresets = [
  { name: 'Indigo', primary: '#5b3fe9', secondary: '#11c5bd' },
  { name: 'Midnight', primary: '#0f172a', secondary: '#38bdf8' },
  { name: 'Emerald', primary: '#0f766e', secondary: '#f59e0b' },
  { name: 'Sunset', primary: '#db2777', secondary: '#f97316' },
  { name: 'Royal', primary: '#1d4ed8', secondary: '#a855f7' },
  { name: 'Graphite', primary: '#3f3f46', secondary: '#84cc16' },
  { name: 'Crimson', primary: '#be123c', secondary: '#fb7185' },
  { name: 'Ocean', primary: '#0369a1', secondary: '#35e0d6' },
] as const

export const buttonStyleOptions = [
  { id: 'rounded', label: 'Rounded', radius: '0.875rem' },
  { id: 'pill', label: 'Pill', radius: '999px' },
  { id: 'square', label: 'Square', radius: '0.25rem' },
] as const

export const backgroundOptions = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'mesh', label: 'Mesh' },
] as const
