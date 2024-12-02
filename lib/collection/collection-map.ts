import type { Collection } from './collection.ts'
import type { DataStructure } from './model/data-structure.ts'
import type { ClassOf } from './model/igea.ts'
import type { Reactive, ReactiveCollection } from './reactive.tsx'

export class CollectionMap {
  private collections = new Map()

  set<S extends ClassOf<DataStructure>, C extends Collection<InstanceType<S>>>(
    cls: S,
    col: C,
  ) {
    this.collections.set(cls, col)
    return this
  }

  get<S extends ClassOf<DataStructure>>(cls: S): Collection<InstanceType<S>> {
    const col = this.collections.get(cls)
    if (!col) {
      throw new Error(`Collection not found: ${cls.name}`)
    }
    return col
  }

  for_each(fn: (cls: ClassOf<DataStructure>, col: Collection<any>) => void) {
    this.collections.forEach((col, cls) => {
      fn(cls, col)
    })
  }
}

export class ReactiveCollectionMap {
  private collections = new Map()

  set<
    S extends ClassOf<DataStructure>,
    C extends ReactiveCollection<InstanceType<S>>,
  >(cls: S, col: C) {
    this.collections.set(cls, col)
    return this
  }

  get<S extends ClassOf<DataStructure>>(
    cls: S,
  ): ReactiveCollection<InstanceType<S>> {
    const col = this.collections.get(cls)
    if (!col) {
      throw new Error(`Collection not found: ${cls.name}`)
    }
    return col
  }

  for_each(
    fn: (cls: ClassOf<DataStructure>, col: ReactiveCollection<any>) => void,
  ) {
    this.collections.forEach((col, cls) => {
      fn(cls, col)
    })
  }

  static from_collection_map(map: CollectionMap, r: Reactive) {
    const rc_map = new ReactiveCollectionMap()
    map.for_each((cls, col) => {
      rc_map.set(cls, r.of(col))
    })
    return rc_map
  }
}
