import { Runner } from '@duesabati/mitra'
import { FindDocs } from './cases/find-docs.ts'
import { FindOne } from './cases/find-one.ts'
import { InsertDocs } from './cases/insert-docs.ts'
import { JoinDocs } from './cases/join-docs.ts'
import { RemoveDocs } from './cases/remove-docs.ts'
import { UpdateDocs } from './cases/update-docs.ts'
import { UseStoreBackend } from './cases/use-store-backend.ts'
import type { ClassOf } from './model/igea.ts'
import { type ConsusBackend, StoreBackend } from './model/store-backend.ts'
import { CountDocs } from './cases/count-docs.ts'
import type { SerializedQuery } from './model/serialized-query.ts'
import type { QueryFactory, QueryParams } from './model/query-builder.ts'
import { QuerySerializer } from './model/query-serializer.ts'
import type { DataStructure } from './model/data-structure.ts'
import { StoreBackendConfiguration } from './model/store-backend.ts'

export class Collection<T extends DataStructure> {
  private runner = new Runner()

  constructor(
    private cls: ClassOf<T>,
  ) {}

  get name() {
    return this.cls.name
  }

  store_in(
    fn: () => ConsusBackend<T>,
    options?: {
      configure_backend?: (conf: StoreBackendConfiguration<T>) => void
    },
  ) {
    /** this is clearly misplaced, please come back here after a while */
    const opts = options ?? {}
    const backend_config = new StoreBackendConfiguration<T>()
    opts.configure_backend?.(backend_config)
    const backend = new StoreBackend(this.cls, backend_config)

    backend.make_builder = fn
    const runner = new Runner()
    ConsusCases(runner, { backends: new Map([[this.cls, backend]]) })
    this.runner = runner
    return this
  }

  find<F extends QueryFactory<any, T>>(q: F, p: QueryParams<F>) {
    const sel = QuerySerializer.serialize(q, p) as SerializedQuery<T>
    return this.runner.run(new FindDocs(this.cls, sel))
  }

  findOne<F extends QueryFactory<any, T>>(q: F, p: QueryParams<F>) {
    const sel = QuerySerializer.serialize(q, p) as SerializedQuery<T>
    return this.runner.run(new FindOne(this.cls, sel))
  }

  count<F extends QueryFactory<any, T>>(q: F, p: QueryParams<F>) {
    const sel = QuerySerializer.serialize(q, p) as SerializedQuery<T>
    return this.runner.run(new CountDocs(this.cls, sel))
  }

  insert(docs: T[]) {
    return this.runner.run(new InsertDocs(this.cls, docs))
  }

  update<F extends QueryFactory<any, T>>(
    q: F,
    p: QueryParams<F>,
    doc: Partial<T>,
  ) {
    const sel = QuerySerializer.serialize(q, p) as SerializedQuery<T>
    return this.runner.run(new UpdateDocs(this.cls, sel, doc, false))
  }

  upsert<F extends QueryFactory<any, T>>(
    q: F,
    p: QueryParams<F>,
    doc: T,
  ) {
    const sel = QuerySerializer.serialize(q, p) as SerializedQuery<T>
    return this.runner.run(new UpdateDocs(this.cls, sel, doc, true))
  }

  remove<F extends QueryFactory<any, T>>(q: F, p: QueryParams<F>) {
    const sel = QuerySerializer.serialize(q, p) as SerializedQuery<T>
    return this.runner.run(new RemoveDocs(this.cls, sel))
  }

  static of<T extends DataStructure>(cls: ClassOf<T>) {
    return new Collection<T>(cls)
  }
}

export type { ClassOf } from './model/igea.ts'

const ConsusCases = (
  lnk: Runner,
  deps: {
    backends: Map<ClassOf<any>, StoreBackend<any>>
  },
) => {
  lnk.mount(UseStoreBackend, [deps.backends])
  lnk.mount(UpdateDocs, [lnk])
  lnk.mount(InsertDocs, [lnk])
  lnk.mount(RemoveDocs, [lnk])
  lnk.mount(FindDocs, [lnk])
  lnk.mount(CountDocs, [lnk])
  lnk.mount(FindOne, [lnk])
  lnk.mount(JoinDocs, [lnk])
}

export type WriteOnly_Collection<T extends DataStructure> = {
  insert(docs: T[]): Promise<void>
  update<F extends QueryFactory<any, T>>(
    q: F,
    p: QueryParams<F>,
    doc: Partial<T>,
  ): Promise<void>
  upsert<F extends QueryFactory<any, T>>(
    q: F,
    p: QueryParams<F>,
    doc: T,
  ): Promise<void>
  remove<F extends QueryFactory<any, T>>(q: F, p: QueryParams<F>): Promise<void>
}
