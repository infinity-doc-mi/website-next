import { CarrierOfHashMap, type HashMap } from './carrier.ts'
import type { Transcriber } from './transcriber.ts'
import { pipeline, put } from './transcribers/index.ts'

export const reader = <T>(t: Transcriber<T>): Reader<T> => {
  function reader(s: HashMap): T {
    const i = CarrierOfHashMap.of(s)
    const o = CarrierOfHashMap.of({}) as CarrierOfHashMap<T>
    t(i, o)
    return o.get()
  }
  return reader
}

export const writer = (t: Transcriber): Writer => {
  function writer(s: HashMap): void {
    const i = CarrierOfHashMap.of(s)
    const o = CarrierOfHashMap.of(s)
    t(i, o)
  }
  return writer
}

export interface Reader<T> {
  (s: HashMap): T
}

export interface Writer {
  (s: HashMap): void
}

export interface ReadOnlyField<T = unknown> {
  r: Reader<T>
}

export interface WritableField<T = unknown> extends ReadOnlyField<T> {
  w: (v: T) => Writer
}

export type Field<T = unknown> = ReadOnlyField<T> | WritableField<T>

export const field = <T>(
  vers: Transcriber<T>[],
  w: Transcriber = vers[0],
): WritableField<T> => {
  return {
    r: first_valid_version(vers.map(reader)),
    w: (v: T) => writer(pipeline.init(w).then(put(v)).done()),
  }
}

export const readonly_field = <T>(vers: Transcriber<T>[]): ReadOnlyField<T> => {
  return {
    r: first_valid_version(vers.map(reader)),
  }
}

const first_valid_version = <T>(readers: Reader<T>[]): Reader<T> => {
  function first_valid_version(s: HashMap): T {
    for (const r of readers) {
      const v = r(s)
      if (typeof v !== 'undefined') {
        return v
      }
    }

    throw new Error('No valid version found')
  }
  return first_valid_version
}

export function is_writeable_field<T>(f: Field<T>): f is WritableField<T> {
  return 'w' in f
}
