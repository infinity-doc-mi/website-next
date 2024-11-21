import type { Operation } from './operation.ts'
import type { Procedure } from './procedure.ts'

export interface UseCase<Infra extends any[] = any[], Output = any> {
  execute(...args: Infra): Output
}

export namespace UseCase {
  export type infra<C extends UseCase> =
    C extends UseCase<infer I, any> ? I : never
  export type output<C extends UseCase> =
    C extends UseCase<any, infer O> ? O : never

  export type fromProcedure<P extends Procedure> = UseCase<
    any[],
    Procedure.output<P>
  >

  export function nameOf<C extends UseCase>(c: C) {
    return c.constructor.name
  }

  export function toString<C extends UseCase>(c: C) {
    return `${nameOf(c)} ${JSON.stringify(c, null, 2)}`
  }

  export function toHumanString<C extends UseCase>(c: C) {
    const trm = Object.entries(c)
      .filter(isNotAMethod)
      .filter(isNotUndefined)
      .map(([k, v]) => `${k}: ${ellipsis(JSON.stringify(v), 80)}`)
      .map(s => '  ' + s)
      .join(', ')

    return `${nameOf(c)}\n${trm}`
  }
}

export type InputOf<O extends Operation> =
  O extends Operation<infer Input> ? Input : never

export type InfraOf<C extends UseCase> =
  C extends UseCase<infer Infra> ? Infra : never

export type OutputOf<C extends UseCase> =
  C extends UseCase<any, infer Output> ? Output : never

function isNotAMethod(
  entry: [string, any]
): entry is [string, object | string | number | boolean] {
  return typeof entry[1] !== 'function'
}

function isNotUndefined(
  entry: [string, any]
): entry is [string, object | string | number | boolean] {
  return entry[1] !== undefined
}

function ellipsis(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 3) + '...' : s
}
