import type {
  Operators,
  QueryBuilder,
  QueryFactory,
  QueryParams,
  QueryResult,
} from './query-builder.ts'
import { SerializedQuery } from './serialized-query.ts'

export class QuerySerializer implements QueryBuilder<any, any> {
  private query: SerializedQuery<any> = new SerializedQuery()

  collection(name: string): QueryBuilder<any, any> {
    this.query.collection = name
    return this
  }

  where(field: string, op: Operators, value: any): QueryBuilder<any, any> {
    this.query.where![this.query.where!.length - 1].push({ field, op, value })
    return this
  }

  get or(): QueryBuilder<any, any> {
    this.query.where!.push([])
    return this
  }

  limit(amount: number): QueryBuilder<any, any> {
    this.query.limit = amount
    return this
  }

  skip(amount: number): QueryBuilder<any, any> {
    this.query.skip = amount
    return this
  }

  sort(field: string, dir: 'asc' | 'desc'): QueryBuilder<any, any> {
    this.query.sort!.push([field, dir])
    return this
  }

  to_query(): SerializedQuery<any> {
    return this.query
  }

  static serialize<F extends QueryFactory<any, any>>(
    q: F,
    p: QueryParams<F>,
  ): SerializedQuery<QueryResult<F>> {
    const serializer = new QuerySerializer()
    q(serializer, p)
    return serializer.to_query()
  }
}
