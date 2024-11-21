import type { Procedure } from './procedure.ts';
import type { UseCase } from './use-case.ts';

export interface Operation<
  Input extends any[] = any[],
  C extends UseCase = any // @question, why is this not UseCase?
> {
  new (...args: Input): C;
}

export namespace Operation {
  export type input<O extends Operation> = O extends Operation<infer I, any>
    ? I
    : never;
  export type output<O extends Operation> = O extends Operation
    ? UseCase.output<InstanceType<O>>
    : never;
  export type fromProcedure<P extends Procedure> = Operation<
    Procedure.input<P>,
    UseCase<any[], Procedure.output<P>>
  >;
}
