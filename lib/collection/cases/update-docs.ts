import type { Runner } from '@duesabati/mitra'
import type { DataStructure } from '../model/data-structure.ts'
import type { ClassOf } from '../model/igea.ts'
import { SerializedQuery } from '../model/serialized-query.ts'
import { UseStoreBackend } from './use-store-backend.ts'

export class UpdateDocs<T extends DataStructure> {
  constructor(
    private cls: ClassOf<T>,
    private selector: SerializedQuery<T>,
    private patch: Partial<T>,
    private upsert: boolean = false,
  ) {}

  async execute(r: Runner) {
    const bkd = await r.run(new UseStoreBackend(this.cls))
    const bld = bkd.init_builder()
    SerializedQuery.apply(this.selector, bld)
    await bkd.update(bld, this.patch, this.upsert)
  }

  toString() {
    return (
      `${this.cls.name} ` +
      `${JSON.stringify(this.selector)} ` +
      ((this.upsert && '!') || '·') +
      `${JSON.stringify(this.patch)}`
    )
  }
}
