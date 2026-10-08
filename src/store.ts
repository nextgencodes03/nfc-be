/**
 * In-memory document store seeded with the same mock data the UI used to keep locally.
 * Replace with PostgreSQL later without changing the route handlers.
 */

export function collection<T>(seed: T[]) {
  let items = [...seed]

  return {
    all(): T[] {
      return items
    },
    set(next: T[]): void {
      items = next
    },
    insert(item: T): T {
      items = [item, ...items]
      return item
    },
    update(predicate: (item: T) => boolean, patch: (item: T) => T): T | undefined {
      let updated: T | undefined
      items = items.map((item) => {
        if (!predicate(item)) return item
        updated = patch(item)
        return updated
      })
      return updated
    },
    find(predicate: (item: T) => boolean): T | undefined {
      return items.find(predicate)
    },
    filter(predicate: (item: T) => boolean): T[] {
      return items.filter(predicate)
    },
  }
}
