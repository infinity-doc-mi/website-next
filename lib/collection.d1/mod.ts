import type {} from '@cloudflare/workers-types'

import type { DataStructure } from '@duesabati/collection'
import type { D1Table } from '@duesabati/simple-d1'
import { D1_Backend } from './src/backend.ts'

export function d1<C extends DataStructure>(col: D1Table) {
  return () => new D1_Backend<unknown, C>(col)
}
