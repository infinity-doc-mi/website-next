import type {
  Collection,
  DataStructure,
  QueryFactory,
  QueryParams,
} from './mod.ts'

export class Reactive {
  constructor(
    private readonly client: QueryClient,
    private readonly useQuery: UseQuery,
  ) {}

  of<T extends DataStructure>(col: Collection<T>) {
    return new ReactiveCollection(col, this.client, this.useQuery)
  }
}

export class ReactiveCollection<T extends DataStructure> {
  insert: Insert<T>
  remove: Remove<T>
  update: Update<T>
  upsert: Upsert<T>

  constructor(
    private readonly col: Collection<T>,
    private readonly client: QueryClient,
    private readonly useQuery: UseQuery,
    private readonly key = col.name,
  ) {
    this.insert = this.call_and_invalidate(this.col.insert.bind(this.col))
    this.remove = this.call_and_invalidate(this.col.remove.bind(this.col))
    this.update = this.call_and_invalidate(this.col.update.bind(this.col))
    this.upsert = this.call_and_invalidate(this.col.upsert.bind(this.col))
  }

  private hash_params(params: Record<string, string>) {
    return Object.entries(params)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')
  }

  call_and_invalidate = <A extends any[]>(fn: Fn<A, Promise<void>>) => {
    return async (...args: A) => {
      await fn(...args)
      await this.invalidate()
    }
  }

  findOne<F extends QueryFactory<any, T>>(q: F, p: QueryParams<F>): LoadOne<T> {
    const res = this.useQuery({
      queryKey: [this.key, this.hash_params(p), 'one'],
      queryFn: () => this.col.findOne(q, p),
    })

    if (res.isLoading) return is_loading
    if (!res.data) return not_found
    return res.data
  }

  find<F extends QueryFactory<any, T>>(q: F, p: QueryParams<F>): LoadMany<T> {
    const res = this.useQuery({
      queryKey: [this.key, this.hash_params(p), 'many'],
      queryFn: () => this.col.find(q, p),
    })

    if (res.isLoading) return is_loading
    if (!res.data) return []
    return res.data
  }

  to_inert() {
    return this.col
  }

  private async invalidate() {
    await this.client.invalidateQueries({ queryKey: [this.key] })
  }
}

interface UseQuery {
  <T>(opts: { queryKey: any; queryFn: () => Promise<T> }): {
    isLoading: boolean
    data?: T
  }
}

interface QueryClient {
  invalidateQueries: (opts: { queryKey: any }) => Promise<void>
}

interface Insert<T extends DataStructure> {
  (docs: T[]): Promise<void>
}

interface Remove<T extends DataStructure> {
  <F extends QueryFactory<any, T>>(q: F, p: QueryParams<F>): Promise<void>
}

interface Update<T extends DataStructure> {
  <F extends QueryFactory<any, T>>(
    q: F,
    p: QueryParams<F>,
    doc: Partial<T>,
  ): Promise<void>
}

interface Upsert<T extends DataStructure> {
  <F extends QueryFactory<any, T>>(
    q: F,
    p: QueryParams<F>,
    doc: T,
  ): Promise<void>
}

interface Fn<A extends any[], R> {
  (...args: A): R
}

export const is_loading = Symbol()
export const not_found = Symbol()
export type LoadOne<T> = T | typeof not_found | typeof is_loading
export type LoadMany<T> = T[] | typeof is_loading
