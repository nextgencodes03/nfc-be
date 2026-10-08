export function uid(prefix = 'id'): string {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
      : Math.random().toString(36).slice(2, 12)
  return `${prefix}_${random}`
}

/** Sequential, human-readable identifiers like NFC-0001031. */
export function nextSequentialId(existing: string[], prefix: string, pad: number): string {
  const highest = existing.reduce((max, value) => {
    const match = value.match(/(\d+)$/)
    if (!match) return max
    return Math.max(max, Number(match[1]))
  }, 0)
  return `${prefix}${String(highest + 1).padStart(pad, '0')}`
}
