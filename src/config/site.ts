export const siteConfig = {
  domain: process.env.PUBLIC_DOMAIN ?? 'yourdomain.com',
} as const

export function profileUrl(username: string): string {
  return `https://${siteConfig.domain}/p/${username}`
}
