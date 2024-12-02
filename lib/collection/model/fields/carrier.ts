import get from 'lodash.get'
import set from 'lodash.set'

export interface Carrier<T = unknown> {
  get(): T
  set(v: T): Carrier
  move(): Carrier
  head(path: string[]): Carrier
  reset(): Carrier
}

export class CarrierOfHashMap<T = unknown> implements Carrier<T> {
  constructor(readonly origin: HashMap) {
    if (typeof origin !== 'object') {
      throw new Error('origin is not an object, got', origin)
    }

    this.cursor = origin
  }

  private cursor: any
  private path: string[] = []

  get(): T {
    if (this.path.length === 0) {
      return this.cursor as T
    }

    return get(this.origin, this.path) as T
  }

  set(v: T): Carrier {
    if (this.path.length === 0) {
      this.cursor = v
      return this
    }

    set(this.cursor, this.path, v)
    return this
  }

  head(path: string[]): CarrierOfHashMap<T> {
    this.path = path
    return this
  }

  move(): CarrierOfHashMap<T> {
    if (this.path.length === 0) {
      return this
    }

    const cursor = get(this.cursor, this.path)

    this.cursor = cursor
    this.path = []

    return this
  }

  reset(): CarrierOfHashMap<T> {
    this.cursor = this.origin
    this.path = []
    return this
  }

  static of<T extends HashMap>(v: T): Carrier<T> {
    return new CarrierOfHashMap<T>(v)
  }
}

export interface HashMap extends Record<string, any> {}

export function is_hash_map(v: any): v is HashMap {
  return typeof v === 'object'
}
