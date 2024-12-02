import { immerable, produce } from 'immer'
import type { DataStructure, Operators } from '@duesabati/collection'
import { ConditionStatement } from './condition-statement.ts'

type Filter<T> = {
  field: keyof T & string
  op: Operators
  value: any
}

/**
 * Create a SQL statement based on operations
 */
export class D1Query<T extends DataStructure> {
  [immerable] = true

  constructor(
    readonly filter = new ConditionStatement(),
    readonly limit: number = 0,
    readonly skip: number = 0,
    readonly table: string = '',
    readonly sort: Record<string, 1 | -1> = {},
  ) {}

  setFilter(statement: ConditionStatement): D1Query<T> {
    return produce(this, (s) => {
      s.filter = statement
    })
  }

  setLimit(amount: number): D1Query<T> {
    return produce(this, (s) => {
      s.limit = amount
    })
  }

  setSkip(amount: number): D1Query<T> {
    return produce(this, (s) => {
      s.skip = amount
    })
  }

  setSort(field: keyof T, dir: 'asc' | 'desc'): D1Query<T> {
    return produce(this, (s) => {
      s.sort[field as string] = dir === 'asc' ? 1 : -1
    })
  }

  setTable(table: string) {
    return produce(this, (s) => {
      s.table = table
    })
  }

  to_sql_statement(): string {
    const has_order_by = Object.keys(this.sort).length > 0
    const has_limit = this.limit > 0
    const has_skip = this.skip > 0

    return `
        WHERE ${this.filter.toSQLStatement()}
        ${has_order_by ? `ORDER BY ${this.make_order_by()}` : ''}
        ${has_limit ? `LIMIT ${this.limit}` : ''}
        ${has_skip ? `OFFSET ${this.skip}` : ''}
      `
  }

  private make_order_by() {
    Object.entries(this.sort).map(([key, dir]) =>
      `${key} ${dir === 1 ? 'DESC' : 'ASC'}`
    ).join(', ')
  }
}
