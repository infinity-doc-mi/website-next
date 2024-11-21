import { type Carrier, CarrierOfHashMap, is_hash_map } from '../carrier.ts'
import type { ReadOnlyField } from '../field.ts'
import type { Transcriber } from '../transcriber.ts'

export const put = <T>(v: T): Transcriber<T> => {
  function put(_: Carrier, o: Carrier): void {
    o.set(v)
  }
  return put
}

export const head_at = (path: string[]): Transcriber => {
  function head_at(i: Carrier, o: Carrier): void {
    i.head(path)
    o.head(path)
  }
  return head_at
}

export const reset = (): Transcriber => {
  function reset(i: Carrier, o: Carrier): void {
    i.reset()
    o.reset()
  }
  return reset
}

export const convert_to = <T>(f: (v: any) => T): Transcriber<T | undefined> => {
  function convert_to(i: Carrier, o: Carrier): void {
    const v = i.get()
    const n = typeof v === 'undefined' ? undefined : f(v)
    o.set(n)
  }
  return convert_to
}

export const if_undefined = <T>(f: Transcriber<T>): Transcriber<T> => {
  function if_undefined(i: Carrier, o: Carrier): void {
    const v = i.get()
    if (typeof v === 'undefined') {
      f(i, o)
    }
  }
  return if_undefined
}

export const of_field = <T>(f: ReadOnlyField<T>): Transcriber<T> => {
  function of_field(i: Carrier, o: Carrier): void {
    const v = i.get()
    if (is_hash_map(v)) {
      o.set(f.r(v))
      return
    }
  }
  return of_field
}

export class pipeline<T = never> {
  constructor(private readonly ts: Transcriber<any>[]) {}

  static init<T>(t: Transcriber<T>) {
    return new pipeline([t]) as pipeline<T>
  }

  then<U>(t: Transcriber<U>): pipeline<U> {
    return new pipeline([...this.ts, t]) as pipeline<U>
  }

  done(): Transcriber<T> {
    const pipeline: Transcriber<T> = (i, o) => {
      for (const t of this.ts) {
        t(i, o)
      }
    }

    return pipeline
  }
}

export const join = (
  ts: Transcriber<string | number>[],
  sep: string,
): Transcriber<string> => {
  const ts_with_reset = ts.map((r) => pipeline.init(reset).then(r).done())

  function join(i: Carrier, o: Carrier): void {
    const values = ts_with_reset.map((t) => {
      const o = CarrierOfHashMap.of({})
      t(i, o)
      return o.get()
    })
    o.set(values.join(sep))
  }
  return join
}

export const at = <T>(key: string, f: (v: any) => T, def: T): Transcriber<T> =>
  pipeline
    .init(head_at([key]))
    .then(convert_to(f))
    .then(if_undefined(put(def)))
    .done()
