import type { HashMap } from './carrier.ts'
import {
  type Field,
  field,
  is_writeable_field,
  readonly_field,
  type ReadOnlyField,
  type WritableField,
} from './field.ts'
import type { Transcriber } from './transcriber.ts'

export class struct<S extends AnyStruct = Struct> {
  private props = [] as Array<Field>

  constructor(private props_base: S['base']) {}

  f_rw<T>(
    vers: [Transcriber<T>, ...Transcriber<T>[]],
    w?: Transcriber,
  ): struct<Struct<[...S['props'], WritableField<T>], S['base']>> {
    this.props.push(field(vers, w || vers[0]))
    return this as any
  }

  f_ro<T>(
    vers: [Transcriber<T>, ...Transcriber<T>[]],
  ): struct<Struct<[...S['props'], ReadOnlyField<T>], S['base']>> {
    this.props.push(readonly_field(vers))
    return this as any
  }

  done(): S {
    const w_props = [
      ...this.props_base.values(),
      ...this.props.values(),
    ].filter(is_writeable_field)

    function init(target: HashMap, data: HashMap = {}): S['props'] {
      w_props.forEach((p) => {
        p.w(p.r(data))(target)
      })

      return target as any
    }

    return { init, props: this.props, base: this.props_base } as any
  }
  static from_scratch(): struct {
    return new struct([])
  }

  static from<S extends AnyStruct>(
    base: S,
  ): struct<Struct<[], [...S['base'], ...S['props']]>> {
    const s = new struct<S>([...base.base, ...base.props])
    return s as any
  }
}

interface Initializer {
  (target: HashMap, data?: HashMap): void
}

interface Struct<P extends Field[] = [], B extends Field[] = []> {
  init: Initializer
  props: P
  base: B
}

interface AnyStruct extends Struct<Field<any>[], Field<any>[]> {}

export class layer<S extends AnyStruct> {
  constructor(private layers: Layer<any, any>[]) {}

  static base<nS extends AnyStruct>(stage: Layer<Struct, nS>): layer<nS> {
    return new layer([stage])
  }

  extends<nS extends AnyStruct>(stage: Layer<S, nS>): layer<nS> {
    return new layer([...this.layers, stage])
  }

  done(): S {
    const base = struct.from_scratch() as struct<AnyStruct>
    return this.layers
      .reduce((b, layer) => {
        const b_s = b.done()
        const next = struct.from(b_s)
        const n_s = layer(next, b_s.props)
        return struct.from(n_s.done())
      }, base)
      .done() as S
  }
}

interface Layer<B extends AnyStruct, N extends AnyStruct> {
  (s: struct<B>, p: B['props']): struct<N>
}

export function data_structure_from<S extends AnyStruct>(s: S) {
  return class {
    constructor(p: HashMap = {}) {
      s.init(this, p)
    }
  }
}
