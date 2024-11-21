import { produce } from 'immer'
import type { Mutation } from '../../../model/igea.ts'
import type { StateAccessor } from '../query-builder.ts'

export class LocalStorageStateAccessor implements StateAccessor<any> {
  constructor(private readonly key: string) {}

  get = () => {
    const data = localStorage.getItem(this.key)
    if (data) {
      return JSON.parse(data)
    }
    return {}
  }
  set = (m: Mutation<any>) => {
    const data = produce(this.get(), m)
    localStorage.setItem(this.key, JSON.stringify(data))
  }
}
