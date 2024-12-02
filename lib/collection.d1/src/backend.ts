import type {
  DataStructure,
  Op_Count,
  Op_Delete,
  Op_Insert,
  Op_List,
  Op_Update,
  OperationFactory,
  Operators,
  QueryBuilder,
} from '@duesabati/collection'

import type { D1Table } from '@duesabati/simple-d1'

import type {} from '@cloudflare/workers-types'
import { D1Query, StatementBuilder } from './query/index.ts'
import { ConditionStatement } from './query/condition-statement.ts'

export class D1_Backend<P, T extends DataStructure>
  implements QueryBuilder<T>, OperationFactory<T> {
  constructor(private client: D1Table<T>) {}

  private query = new D1Query<T>()
  private filter = new StatementBuilder()

  where(
    field: keyof T & string,
    op: Operators,
    value: any,
  ): QueryBuilder<P, T> {
    const opr = { field, op, value }
    const exp = ConditionStatement.make(opr)

    this.filter.compose(exp)
    this.query = this.query.setFilter(this.filter.statement)
    return this
  }

  get or(): QueryBuilder<P, T> {
    this.filter.or()
    return this
  }

  limit(amount: number): QueryBuilder<P, T> {
    this.query = this.query.setLimit(amount)
    return this
  }

  collection(name: string) {
    this.query = this.query.setTable(name)
    return this
  }

  skip(amount: number): QueryBuilder<P, T> {
    this.query = this.query.setSkip(amount)
    return this
  }

  sort(field: keyof T, dir: 'asc' | 'desc'): QueryBuilder<P, T> {
    this.query = this.query.setSort(field, dir)
    return this
  }

  make_delete(): Op_Delete {
    return async () => {
      await this.client.delete(this.filter.statement.toSQLStatement())
    }
  }

  make_insert(): Op_Insert<T> {
    return async (d) => {
      await this.client.insert(d)
    }
  }

  make_update(_: boolean): Op_Update<T> {
    throw Error('Not implemented')
  }

  make_list(): Op_List<T> {
    return async () => {
      const propositions = this.filter.statement.toSQLStatement()

      return await this.client.select(propositions)
    }
  }

  make_count(): Op_Count {
    throw Error('Not implemented')
  }
}
