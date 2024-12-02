import type { Runner } from '@duesabati/mitra'
import type { DataStructure } from '../model/data-structure.ts'
import type { ClassOf } from '../model/igea.ts'
import { UseStoreBackend } from './use-store-backend.ts'

export class InsertDocs<T extends DataStructure> {
  constructor(private cls: ClassOf<T>, private docs: T[]) {}

  async execute(r: Runner) {
    const bkd = await r.run(new UseStoreBackend(this.cls))
    const bld = bkd.init_builder()
    if (this.docs.length > 0) {
      await bkd.insert(bld, this.docs)
    }
  }

  toString() {
    return `${this.cls.name} ${JSON.stringify(this.docs)}`
  }
}
