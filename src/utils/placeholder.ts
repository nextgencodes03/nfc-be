/**
 * Self-contained SVG placeholders so the app has no external image dependencies.
 * Swap these for cloud storage URLs when image uploads move to a backend.
 */

const PALETTES: [string, string][] = [
  ['#5b3fe9', '#11c5bd'],
  ['#db2777', '#f97316'],
  ['#0f766e', '#f59e0b'],
  ['#1d4ed8', '#a855f7'],
  ['#0b0b13', '#35e0d6'],
  ['#be123c', '#fb7185'],
]

function hash(seed: string): number {
  let value = 0
  for (let i = 0; i < seed.length; i += 1) {
    value = (value << 5) - value + seed.charCodeAt(i)
    value |= 0
  }
  return Math.abs(value)
}

function encode(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`
}

export function paletteFor(seed: string): [string, string] {
  return PALETTES[hash(seed) % PALETTES.length]
}

export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
}

/** Square avatar with the person's initials on a brand gradient. */
export function avatarPlaceholder(name: string, size = 320): string {
  const [from, to] = paletteFor(name)
  const initials = initialsOf(name) || '•'
  return encode(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 320 320">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${from}"/>
          <stop offset="100%" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <rect width="320" height="320" fill="url(#g)"/>
      <circle cx="248" cy="72" r="120" fill="#ffffff" opacity="0.12"/>
      <circle cx="60" cy="280" r="90" fill="#000000" opacity="0.10"/>
      <text x="160" y="160" fill="#ffffff" font-family="Plus Jakarta Sans, Inter, sans-serif"
        font-size="124" font-weight="700" text-anchor="middle" dominant-baseline="central"
        letter-spacing="2">${initials}</text>
    </svg>
  `)
}

/** Wide cover image used by portfolio project cards. */
export function coverPlaceholder(label: string, width = 800, height = 500): string {
  const [from, to] = paletteFor(label)
  return encode(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 800 500">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${from}"/>
          <stop offset="100%" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#g)"/>
      <g fill="#ffffff" opacity="0.14">
        <circle cx="660" cy="90" r="150"/>
        <circle cx="120" cy="430" r="110"/>
      </g>
      <g stroke="#ffffff" stroke-opacity="0.18" stroke-width="1.5" fill="none">
        <rect x="64" y="96" width="400" height="26" rx="13"/>
        <rect x="64" y="146" width="300" height="26" rx="13"/>
        <rect x="64" y="196" width="220" height="26" rx="13"/>
      </g>
      <text x="64" y="404" fill="#ffffff" font-family="Plus Jakarta Sans, Inter, sans-serif"
        font-size="40" font-weight="700" opacity="0.95">${escapeXml(label)}</text>
    </svg>
  `)
}

/** Small square logo mark built from a company name. */
export function logoPlaceholder(name: string): string {
  const [from, to] = paletteFor(`logo-${name}`)
  const initials = initialsOf(name) || 'T'
  return encode(`
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${from}"/>
          <stop offset="100%" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="30" fill="url(#g)"/>
      <text x="64" y="66" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif"
        font-size="52" font-weight="800" text-anchor="middle" dominant-baseline="central">${initials}</text>
    </svg>
  `)
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
