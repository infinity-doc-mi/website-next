import type { DataStructure } from './data-structure.ts'
import type { QueryBuilder, QueryFactory } from './query-builder.ts'

export class QueryFactoryComposer<T extends DataStructure> {
  private factories: QueryFactory<any, any>[] = []
  private params = {} as any

  compose = <P>(factory: QueryFactory<P, T>, p: P) => {
    this.factories.push(factory)
    Object.assign(this.params, p)
    return this
  }

  make = () => {
    return [
      (q: QueryBuilder<any, T>, p: any) => {
        this.factories.forEach((factory) => factory(q, p))
      },
      this.params,
    ] as const
  }
}
