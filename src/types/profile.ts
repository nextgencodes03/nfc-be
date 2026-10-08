import type { TemplateId } from './template'

export type SocialPlatform =
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'github'
  | 'twitter'
  | 'behance'
  | 'dribbble'

export interface SocialLink {
  id: string
  platform: SocialPlatform
  /** Full URL or handle entered by the customer. */
  url: string
  /** Customers can keep a link saved but hidden from the public page. */
  enabled: boolean
}

export interface PortfolioProject {
  id: string
  title: string
  description: string
  /** Data URL or remote URL. Swap for cloud storage later. */
  imageUrl: string
  url: string
}

export interface BusinessHour {
  /** 0 = Sunday … 6 = Saturday */
  day: number
  open: string
  close: string
  closed: boolean
}

export interface BusinessService {
  id: string
  name: string
  description?: string
}

export interface PersonalInfo {
  fullName: string
  photoUrl: string
  jobTitle: string
  company: string
  about: string
  skills: string[]
}

export interface ContactInfo {
  phone: string
  whatsapp: string
  email: string
  website: string
}

export interface BusinessInfo {
  businessName: string
  address: string
  mapsUrl: string
  hours: BusinessHour[]
  services: BusinessService[]
}

export type ButtonStyle = 'rounded' | 'pill' | 'square'
export type BackgroundStyle = 'light' | 'dark' | 'gradient' | 'mesh'
export type FontChoice = 'jakarta' | 'inter' | 'sora' | 'space-grotesk' | 'fraunces'

export interface Customization {
  primaryColor: string
  secondaryColor: string
  buttonStyle: ButtonStyle
  font: FontChoice
  background: BackgroundStyle
  logoUrl: string
}

export type ProfileStatus = 'draft' | 'pending_review' | 'published' | 'suspended'

export interface Profile {
  id: string
  userId: string
  /** Powers the public URL: /p/:username — stable for the life of the NFC card. */
  username: string
  status: ProfileStatus
  templateId: TemplateId
  personal: PersonalInfo
  contact: ContactInfo
  socials: SocialLink[]
  business: BusinessInfo
  portfolio: PortfolioProject[]
  customization: Customization
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

/** Everything the builder edits — the profile minus server-owned fields. */
export type ProfileDraft = Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'publishedAt'>
