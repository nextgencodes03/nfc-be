const domain = (process.env.PUBLIC_DOMAIN ?? 'localhost:5173').replace(/\/$/, '')

export const siteConfig = {
  domain,
} as const

function publicOrigin(): string {
  if (domain.startsWith('http://') || domain.startsWith('https://')) return domain
  if (domain.startsWith('localhost') || domain.startsWith('127.0.0.1')) return `http://${domain}`
  return `https://${domain}`
}

export function profileUrl(username: string): string {
  return `${publicOrigin()}/p/${username}`
}
