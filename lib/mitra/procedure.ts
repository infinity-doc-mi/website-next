import type { Operation } from './operation.ts';

export interface Procedure<I extends any[] = any[], O = any> {
  (...input: I): O;
}

export namespace Procedure {
  export type input<P extends Procedure> = P extends Procedure<infer I, any>
    ? I
    : never;
  export type output<P extends Procedure> = P extends Procedure<any, infer O>
    ? O
    : never;
  export type forOperation<O extends Operation> = Procedure<
    Operation.input<O>,
    Operation.output<O>
  >;
}
