import type { Runner } from '@duesabati/mitra'
import type { DataStructure } from '../model/data-structure.ts'
import type { ClassOf } from '../model/igea.ts'
import { SerializedQuery } from '../model/serialized-query.ts'
import { UseStoreBackend } from './use-store-backend.ts'

export class FindOne<T extends DataStructure> {
  constructor(
    readonly cls: ClassOf<T>,
    readonly selector: SerializedQuery<T> = new SerializedQuery<T>(),
  ) {}

  async execute(r: Runner): Promise<T | undefined> {
    const bkd = await r.run(new UseStoreBackend(this.cls))
    const bld = bkd.init_builder()
    SerializedQuery.apply(this.selector, bld)
    bld.limit(1)
    const res = await bkd.list(bld)
    if (res[0]) return new this.cls(res[0])
    return undefined
  }

  toString() {
    return `${this.cls.name} ${JSON.stringify(this.selector)}`
  }
}
