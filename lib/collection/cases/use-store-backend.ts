import type { DataStructure } from '../model/data-structure.ts'
import type { ClassOf } from '../model/igea.ts'
import type { StoreBackend } from '../model/store-backend.ts'

export class UseStoreBackend<T extends DataStructure> {
  constructor(private cls: ClassOf<T>) {}

  async execute(conf: Map<ClassOf<T>, StoreBackend<T>>) {
    const bkd = conf.get(this.cls)
    if (!bkd) throw new Error(`No backend for ${this.cls.name}`)
    await bkd.prepare()
    return bkd
  }

  toString() {
    return `${this.cls.name}`
  }
}
