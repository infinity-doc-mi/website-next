import type { DataStructure } from './data-structure.ts'
import type { ClassOf } from './igea.ts'
import type { OperationFactory, QueryBuilder } from './query-builder.ts'

export interface ConsusBackend<T extends DataStructure, P = any>
  extends QueryBuilder<P, T>, OperationFactory<T> {}

export class StoreBackend<T extends DataStructure = any> {
  private prepared = false

  constructor(
    private cls: ClassOf<T>,
    private config = new StoreBackendConfiguration<T>(),
  ) {}

  async prepare() {
    if (this.prepared) return

    await this.config.prepare(this.cls)
    this.prepared = true
  }

  make_builder = (): ConsusBackend<T> => {
    throw new Error(
      '«make_builder» not set, did you forget to call «store_in»?',
    )
  }

  init_builder(): ConsusBackend<T> {
    const bld = this.make_builder()
    bld.collection(this.config.col)
    Object.keys(this.config.dsc).forEach((k) => {
      bld.where(k, '==', this.config.dsc[k])
    })
    return bld
  }

  delete<T extends DataStructure>(q: OperationFactory<T>) {
    return q.make_delete()()
  }

  async list<T extends DataStructure>(q: OperationFactory<T>) {
    const docs = await q.make_list()()
    return docs.map((d) => new this.cls(d))
  }

  async insert<T extends DataStructure>(q: OperationFactory<T>, docs: T[]) {
    const docs_post_injection = docs.map((d) => this.apply_discriminators(d))
    await q.make_insert()(docs_post_injection)
  }

  update<T extends DataStructure>(
    q: OperationFactory<T>,
    patch: Partial<T>,
    upsert: boolean,
  ) {
    return q.make_update(upsert)(patch)
  }

  count<T extends DataStructure>(q: OperationFactory<T>) {
    return q.make_count()()
  }

  private apply_discriminators<T>(doc: T): T {
    return { ...doc, ...this.config.dsc }
  }
}

export class StoreBackendConfiguration<T> {
  constructor(
    readonly col: string = '',
    readonly dsc = {} as DataStructure,
    readonly prepare: (cls: ClassOf<T>) => Promise<void> = async () => {},
  ) {}

  set_collection(name: string) {
    return new StoreBackendConfiguration(name, this.dsc, this.prepare)
  }

  set_discriminator(dsc: DataStructure) {
    return new StoreBackendConfiguration(this.col, dsc, this.prepare)
  }

  set_prepare(fn: (cls: ClassOf<T>) => Promise<void>) {
    return new StoreBackendConfiguration(this.col, this.dsc, fn)
  }
}
