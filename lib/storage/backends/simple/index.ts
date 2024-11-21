import { LocalStorageStateAccessor } from './accessors/local-storage.ts'
import { RecordStateAccessor } from './accessors/record.ts'
import { SimpleQueryBuilder } from './query-builder.ts'

export function memory(record: Record<string, any> = {}) {
  const accessor = new RecordStateAccessor(record)
  return () => new SimpleQueryBuilder<any>(accessor)
}

export function local_storage(key: string) {
  return () => new SimpleQueryBuilder<any>(new LocalStorageStateAccessor(key))
}
