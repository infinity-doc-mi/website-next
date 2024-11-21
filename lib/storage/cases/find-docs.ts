import type { Runner } from '@duesabati/mitra'
import { SerializedQuery } from '../model/serialized-query.ts'
import { UseStoreBackend } from './use-store-backend.ts'
import hash from 'object-hash'
import type { ClassOf } from '../model/igea.ts'
import type { DataStructure } from '../model/data-structure.ts'

export class FindDocs<T extends DataStructure> {
  readonly key: string

  constructor(
    readonly cls: ClassOf<T>,
    readonly selector: SerializedQuery<T> = new SerializedQuery<T>(),
  ) {
    this.key = hash([this.cls.name, this.selector])
  }

  async execute(r: Runner): Promise<T[]> {
    const bkd = await r.run(new UseStoreBackend(this.cls))
    const bld = bkd.init_builder()
    SerializedQuery.apply(this.selector, bld)
    const v = await bkd.list(bld)
    return v
  }

  toString() {
    return `${this.cls.name} ${JSON.stringify(this.selector)}`
  }
}
