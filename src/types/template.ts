import type { Customization } from './profile'

export type TemplateId = 'professional' | 'business' | 'creative' | 'portfolio'

export interface TemplateDefinition {
  id: TemplateId
  name: string
  tagline: string
  description: string
  /** Who this template is designed for — shown on the gallery card. */
  bestFor: string[]
  accentPreview: [string, string]
  /** Applied when a customer first selects the template. */
  defaults: Customization
  /** Demo profile username used by "View Demo". */
  demoUsername: string
  /** Lowest plan tier that unlocks this template. */
  minPlan: 'basic' | 'professional' | 'business'
}
