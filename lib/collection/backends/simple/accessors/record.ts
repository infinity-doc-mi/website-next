import { produce } from 'immer'
import type { Mutation } from '../../../model/igea.ts'
import type { ListStateAccessor } from '../query-builder.ts'
// import type { StateAccessor } from '../query-builder.ts'

// export class RecordStateAccessor implements StateAccessor<any> {
//   constructor(private record: Record<string, any> = {}) {}

//   get = () => this.record
//   set = (m: Mutation<any>) => {
//     this.record = produce(this.record, m)
//   }
// }

export class ListState implements ListStateAccessor<any> {
  constructor(private list: any[] = []) {}

  get = () => this.list
  set = (m: Mutation<any>) => {
    this.list = produce(this.list, m)
  }
}
