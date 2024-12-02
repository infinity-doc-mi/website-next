import type { Runner } from '@duesabati/mitra'
import { SerializedQuery } from '../model/serialized-query.ts'
import { UseStoreBackend } from './use-store-backend.ts'
import hash from 'object-hash'
import type { ClassOf } from '../model/igea.ts'
import type { DataStructure } from '../model/data-structure.ts'

export class CountDocs<T extends DataStructure> {
  readonly key: string

  constructor(
    readonly cls: ClassOf<T>,
    readonly selector: SerializedQuery<T> = new SerializedQuery<T>(),
  ) {
    this.key = hash([this.cls.name, this.selector])
  }

  async execute(r: Runner): Promise<number> {
    const prm = CountDocs.fetching.get(this.key)
    if (prm) return (await prm) as number

    const ftc = this.fetch(r)
    CountDocs.fetching.set(this.key, ftc)
    const v = await ftc
    CountDocs.fetching.delete(this.key)
    return v
  }

  private async fetch(r: Runner) {
    const bkd = await r.run(new UseStoreBackend(this.cls))
    const bld = bkd.init_builder()
    SerializedQuery.apply(this.selector, bld)
    const v = await bkd.count(bld)
    return v
  }

  toString() {
    return `${this.cls.name} ${JSON.stringify(this.selector)}`
  }

  private static fetching = new Map<string, Promise<any>>()
}
