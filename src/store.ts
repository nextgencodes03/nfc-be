/**
 * Document collection used by route handlers.
 * Backed by MongoDB Atlas when MONGODB_URI is set; otherwise in-memory seed data.
 */

export interface Collection<T> {
  load(seed: T[]): Promise<void>
  all(): T[]
  set(next: T[]): void
  insert(item: T): T
  update(predicate: (item: T) => boolean, patch: (item: T) => T): T | undefined
  find(predicate: (item: T) => boolean): T | undefined
  filter(predicate: (item: T) => boolean): T[]
}

export function collection<T>(seed: T[]): Collection<T> {
  let items = [...seed]

  return {
    async load(): Promise<void> {
      items = [...seed]
    },
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
