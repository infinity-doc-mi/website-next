import type { DataStructure } from './data-structure.ts'

export interface QueryBuilder<P = any, T extends DataStructure = any> {
  collection(name: string): QueryBuilder<P, T>

  where(field: keyof T & string, op: Operators, value: any): QueryBuilder<P, T>
  or: QueryBuilder<P, T>
  limit(amount: number): QueryBuilder<P, T>
  skip(amount: number): QueryBuilder<P, T>
  sort(field: keyof T & string, dir: 'asc' | 'desc'): QueryBuilder<P, T>
}

export interface OperationFactory<T extends DataStructure> {
  make_delete(): Op_Delete
  make_insert(): Op_Insert<T>
  make_update(upsert: boolean): Op_Update<T>
  make_list(): Op_List<T>
  make_count(): Op_Count
}

export interface QueryFactory<P, T extends DataStructure> {
  (q: QueryBuilder<P, T>, p: P): void
}

export type QueryParams<B> = B extends QueryBuilder<infer P, any> ? P
  : B extends QueryFactory<infer p, any> ? p
  : never

export type QueryResult<B> = B extends QueryBuilder<any, infer T> ? T
  : B extends QueryFactory<any, infer T> ? T
  : never

export type Operators =
  | '=='
  | '!='
  | '>'
  | '<'
  | '<='
  | '>='
  | 'in'
  | 'like'
  | 'starts-with'
  | 'contains'

export interface Op_Delete {
  (): Promise<void>
}

export interface Op_Insert<T> {
  (docs: T[]): Promise<void>
}

export interface Op_Update<T> {
  (patch: Partial<T>): Promise<void>
}

export interface Op_List<T> {
  (): Promise<T[]>
}

export interface Op_Count {
  (): Promise<number>
}
