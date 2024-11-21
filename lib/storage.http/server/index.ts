import {
  type Collection,
  type DataStructure,
  SerializedQuery,
} from '@duesabati/storage'

import type { MiddlewareHandler } from 'hono'

import type { Protocol_Request } from '../protocol/request.ts'

export const consus = <T extends DataStructure>(
  col: Collection<T>,
  events?: {
    after_insert?: (docs: T[]) => Promise<void>
  },
): MiddlewareHandler => {
  const after_insert = events?.after_insert || (() => {})

  return async (c) => {
    const body = await c.req.json<Protocol_Request>()

    const q = SerializedQuery.make_factory(body.query)
    const docs = body.attached_docs as T[]

    switch (body.op) {
      case 'insert':
        await col.insert(docs)

        await after_insert(docs)
        return c.body(null, 201)

      case 'delete':
        await col.remove(q, {})
        return c.body(null, 204)

      case 'update':
        await col.update(q, {}, docs[0])
        return c.body(null, 204)

      case 'upsert':
        await col.upsert(q, {}, docs[0])
        return c.body(null, 204)

      case 'list':
        return c.json(await col.find(q, {}))

      case 'count':
        return c.json(await col.count(q, {}), 200)

      default:
        return c.body(null, 400)
    }
  }
}
