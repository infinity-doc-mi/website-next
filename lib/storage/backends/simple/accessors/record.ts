import { produce } from 'immer'
import type { Mutation } from '../../../model/igea.ts'
import type { StateAccessor } from '../query-builder.ts'

export class RecordStateAccessor implements StateAccessor<any> {
  constructor(private record: Record<string, any> = {}) {}

  get = () => this.record
  set = (m: Mutation<any>) => {
    this.record = produce(this.record, m)
  }
}
