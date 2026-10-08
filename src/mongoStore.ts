import type { Collection } from './store'

type Predicate<T> = (item: T) => boolean

interface PersistModel {
  find: () => { select: (fields: string) => { lean: () => Promise<unknown> } }
  insertMany: (docs: unknown[]) => Promise<unknown>
  deleteMany: (filter: object) => Promise<unknown>
  updateOne: (filter: object, update: object, options?: object) => Promise<unknown>
}

function stripMongo<T>(doc: Record<string, unknown>): T {
  const rest = { ...doc }
  delete rest._id
  delete rest.__v
  return rest as T
}

/** In-memory collection that writes through to a Mongoose model. */
export function mongoCollection<T extends { id: string }>(model: PersistModel): Collection<T> {
  let items: T[] = []
  let queue: Promise<void> = Promise.resolve()

  const enqueue = (work: () => Promise<void>) => {
    queue = queue.then(work).catch((error) => {
      console.error('[mongo]', error)
    })
  }

  return {
    async load(seed: T[]): Promise<void> {
      const found = (await model.find().select('-_id -__v').lean()) as Record<string, unknown>[]
      if (found.length === 0 && seed.length > 0) {
        await model.insertMany(seed)
        items = [...seed]
        return
      }
      items = found.map((doc) => stripMongo<T>(doc))
    },
    all(): T[] {
      return items
    },
    set(next: T[]): void {
      items = next
      enqueue(async () => {
        await model.deleteMany({})
        if (next.length) await model.insertMany(next)
      })
    },
    insert(item: T): T {
      items = [item, ...items]
      enqueue(async () => {
        await model.updateOne({ id: item.id }, item, { upsert: true })
      })
      return item
    },
    update(predicate: Predicate<T>, patch: (item: T) => T): T | undefined {
      let updated: T | undefined
      const changed: T[] = []
      items = items.map((item) => {
        if (!predicate(item)) return item
        updated = patch(item)
        changed.push(updated)
        return updated
      })
      for (const doc of changed) {
        enqueue(async () => {
          await model.updateOne({ id: doc.id }, doc, { upsert: true })
        })
      }
      return updated
    },
    find(predicate: Predicate<T>): T | undefined {
      return items.find(predicate)
    },
    filter(predicate: Predicate<T>): T[] {
      return items.filter(predicate)
    },
  }
}
