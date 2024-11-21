import type { DataStructure } from './data-structure.ts'
import type { Operators, QueryBuilder, QueryFactory } from './query-builder.ts'

export class SerializedQuery<T extends DataStructure> {
  collection: string = ''
  where: SelOperation<T>[][] = [[]]
  limit = Infinity
  skip = 0
  sort: [keyof T & string, 'asc' | 'desc'][] = []

  static apply<T extends DataStructure>(
    q: SerializedQuery<T>,
    bld: QueryBuilder<any, T>,
  ) {
    q.where &&
      q.where.forEach((or) => {
        or.forEach(({ field, op, value }) => {
          bld.where(field, op, value)
        })
        bld.or
      })

    q.sort &&
      q.sort.forEach(([field, dir]) => {
        bld.sort(field, dir)
      })

    q.limit && bld.limit(q.limit)
    q.skip && bld.skip(q.skip)
  }

  static make_factory<T extends DataStructure>(
    q: SerializedQuery<T>,
  ): QueryFactory<any, T> {
    return (builder) => {
      SerializedQuery.apply(q, builder)
    }
  }
}

export interface SelOperation<T = any> {
  field: keyof T & string
  op: Operators
  value: any
}
