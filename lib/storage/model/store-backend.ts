import type { DataStructure } from './data-structure.ts'
import type { ClassOf } from './igea.ts'
import type { OperationFactory, QueryBuilder } from './query-builder.ts'

export interface ConsusBackend<T extends DataStructure, P = any>
  extends QueryBuilder<P, T>, OperationFactory<T> {}

export class StoreBackend<T extends DataStructure = any> {
  constructor(private cls: ClassOf<T>) {}

  private col: string = ''
  private dsc = {} as DataStructure

  async prepare() {
    // console.log('Preparing store backend')
  }

  make_builder = (): ConsusBackend<T> => {
    throw new Error('Not implemented')
  }

  set_collection(name: string) {
    this.col = name
    return this
  }

  set_discriminator(dsc: DataStructure) {
    this.dsc = dsc
    return this
  }

  init_builder(): ConsusBackend<T> {
    const bld = this.make_builder()
    bld.collection(this.col)
    Object.keys(this.dsc).forEach((k) => {
      bld.where(k, '==', this.dsc[k])
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
    return { ...doc, ...this.dsc }
  }
}
