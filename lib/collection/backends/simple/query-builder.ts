import type { DataStructure } from '../../model/data-structure.ts'
import type { GetState, SetState } from '../../model/igea.ts'
import type {
  OperationFactory,
  Operators,
  QueryBuilder,
} from '../../model/query-builder.ts'
import { InMemQuery } from './query.ts'

export interface StateAccessor<T> {
  get: GetState<Record<string, T[]>>
  set: SetState<Record<string, T[]>>
}

export interface ListStateAccessor<T> {
  get: GetState<T[]>
  set: SetState<T[]>
}

export class SimpleQueryBuilder<P = any, T extends DataStructure = any>
  implements QueryBuilder<P, T>, OperationFactory<T> {
  constructor(private storage: ListStateAccessor<T>) {}

  private query = new InMemQuery<T>()
  private isNextWhereInOr = false

  where(field: keyof T, op: Operators, value: any): QueryBuilder<P, T> {
    const flt = InMemQuery.operator<T>(op)(field, value)
    ;(this.isNextWhereInOr && (this.query = this.query.or(flt))) ||
      (this.query = this.query.and(flt))

    this.isNextWhereInOr = false

    return this
  }

  get or(): QueryBuilder<P, T> {
    this.isNextWhereInOr = true
    return this
  }

  limit(amount: number): QueryBuilder<P, T> {
    this.query = this.query.setLimit(amount)
    return this
  }

  collection() {
    return this
  }

  skip(amount: number): QueryBuilder<P, T> {
    this.query = this.query.setSkip(amount)
    return this
  }

  sort(field: keyof T, dir: 'asc' | 'desc'): QueryBuilder<P, T> {
    this.query = this.query.addSort((a, b) => {
      // @ts-ignore -
      if (a[field] < b[field]) return dir == 'asc' ? -1 : 1
      // @ts-ignore -
      if (a[field] > b[field]) return dir == 'asc' ? 1 : -1
      return 0
    })

    return this
  }

  make_delete() {
    return () =>
      new Promise<void>((res) => res(this.query.delete(this.storage.set)))
  }

  make_insert() {
    return (docs: T[]) =>
      new Promise<void>((res) => res(this.query.insert(this.storage.set, docs)))
  }

  make_update(upsert: boolean) {
    return (patch: Partial<T>) =>
      new Promise<void>((res) =>
        res(
          this.query.update(this.storage.get, this.storage.set, patch, upsert),
        )
      )
  }

  make_list() {
    return () =>
      new Promise<T[]>((res) => res(this.query.list(this.storage.get)))
  }

  make_count() {
    return () =>
      new Promise<number>((res) => res(this.query.count(this.storage.get)))
  }
}
