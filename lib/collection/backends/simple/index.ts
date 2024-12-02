import { LocalStorageStateAccessor } from './accessors/local-storage.ts'
import { ListState } from './accessors/record.ts'
import { SimpleQueryBuilder } from './query-builder.ts'

export function memory(list: any[] = []) {
  const accessor = new ListState(list)
  return () => new SimpleQueryBuilder<any>(accessor)
}

export function local_storage(key: string) {
  return () => new SimpleQueryBuilder<any>(new LocalStorageStateAccessor(key))
}
