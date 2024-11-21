import Fuse from 'fuse.js'
import { castDraft, type Immutable, produce } from 'immer'
import type { GetState, SetState } from '../../model/igea.ts'
import type { Operators } from '../../model/query-builder.ts'

export class InMemQuery<T> {
  constructor(
    private readonly filters: Immutable<Filter<T>[][]> = [[() => true]],
    private readonly sorts: Immutable<Sort<T>[][]> = [],
    private readonly limit: number = Infinity,
    private readonly prefix = '',
    private readonly skip: number = 0,
  ) {}

  and(f: Filter<T>): InMemQuery<T> {
    return new InMemQuery<T>(
      produce(this.filters, (s) => {
        s[s.length - 1].push(f)
      }),
      this.sorts,
      this.limit,
      this.prefix,
      this.skip,
    )
  }

  or(f: Filter<T>): InMemQuery<T> {
    return new InMemQuery<T>(
      produce(this.filters, (s) => {
        s.push([f])
      }),
      this.sorts,
      this.limit,
      this.prefix,
      this.skip,
    )
  }

  setLimit(amount: number): InMemQuery<T> {
    return new InMemQuery<T>(this.filters, this.sorts, amount, this.prefix)
  }

  setPrefix(prefix: string) {
    return new InMemQuery<T>(this.filters, this.sorts, this.limit, prefix)
  }

  setSkip(amount: number): InMemQuery<T> {
    return new InMemQuery<T>(
      this.filters,
      this.sorts,
      this.limit,
      this.prefix,
      amount,
    )
  }

  addSort(sort: Sort<T>): InMemQuery<T> {
    return new InMemQuery<T>(
      this.filters,
      produce(this.sorts, (s) => {
        s.push([sort])
      }),
      this.limit,
      this.prefix,
    )
  }

  private makeFilter() {
    const filters = this.filters
    return (doc: T) => {
      return filters.some((f) => f.every((ff) => ff(doc)))
    }
  }

  private makeSorter() {
    const sorts = this.sorts

    return (a: T, b: T) => {
      return sorts.reduce((acc, sort) => {
        if (acc != 0) return acc
        return sort.reduce((acc, s) => {
          if (acc != 0) return acc
          return s(a, b)
        }, 0)
      }, 0)
    }
  }

  list(get: GetState<Record<string, T[]>>): T[] {
    const flt = this.makeFilter()
    const srt = this.makeSorter()
    const docs = get()[this.prefix] || []

    return docs
      .filter(flt)
      .sort(srt)
      .slice(this.skip, this.skip + this.limit)
  }

  delete(set: SetState<Record<string, T[]>>): void {
    const flt = this.makeFilter()
    set(
      produce((s) => {
        s[this.prefix] = (s[this.prefix] || []).filter((d) => !flt(d as T))
      }),
    )
  }

  insert(set: SetState<Record<string, T[]>>, docs: T[]): void {
    set(
      produce((s) => {
        s[this.prefix] = (s[this.prefix] || []).concat(castDraft(docs))
      }),
    )
  }

  update(
    get: GetState<Record<string, T[]>>,
    set: SetState<Record<string, T[]>>,
    patch: Partial<T>,
    upsert: boolean,
  ): void {
    const docs = this.list(get)

    if (docs.length == 0 && !upsert) return

    if (docs.length == 0 && upsert) {
      this.insert(set, [patch as T])
      return
    }

    const flt = this.makeFilter()

    set(
      produce((s) => {
        s[this.prefix] = (s[this.prefix] || []).map((d) => {
          if (flt(d as T)) {
            return { ...d, ...patch }
          }
          return d
        })
      }),
    )
  }

  count(get: GetState<Record<string, T[]>>): number {
    return this.list(get).length
  }

  static operator<T>(op: Operators): Operator<T> {
    switch (op) {
      case '==':
        return (field, value) => (doc) => doc[field] == value
      case '!=':
        return (field, value) => (doc) => doc[field] != value
      case 'in':
        return (field, value) => (doc) => value.includes(doc[field])
      case 'like':
        return (field, value) => (doc) =>
          new Fuse([doc], { keys: [String(field)] }).search(value).length > 0
      case 'starts-with':
        return (field, value) => (doc) => String(doc[field]).startsWith(value)
      case '<':
        return (field, value) => (doc) => doc[field] < value
      case '<=':
        return (field, value) => (doc) => doc[field] <= value
      case '>':
        return (field, value) => (doc) => doc[field] > value
      case '>=':
        return (field, value) => (doc) => doc[field] >= value
      default:
        throw new Error('unsupported operator' + op)
    }
  }
}

interface Operator<T> {
  (field: keyof T, value: any): Filter<T>
}

interface Filter<T> {
  (doc: T): boolean
}

interface Sort<T> {
  (a: T, b: T): number
}
