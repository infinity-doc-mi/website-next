import type {} from 'npm:@cloudflare/workers-types'

export type Bindings = {
  ASSETS: { fetch: typeof fetch }
  DB: D1Database
}
