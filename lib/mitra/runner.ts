import type { Operation } from './operation.ts'
import type { InfraOf, InputOf, OutputOf } from './use-case.ts'
import { UseCase } from './use-case.ts'

export class Runner implements Executor, RecursiveExecutor, Auditable {
  private infra = new Map<Operation, any[]>()
  private reactions = new Map<Operation, (c: InstanceType<Operation>) => void>()
  private links = new Map<Operation, [Operation, Morph]>()
  private delegates = new Map<Operation, Executor>()

  private hideFromAudit = new Set<Operation>()

  // readonly errorLog = console.log.bind(console);
  // readonly executionLog = console.log.bind(console);
  // readonly resultLog = console.log.bind(console);

  readonly errorLog = (..._: any[]) => {}
  readonly executionLog = (..._: any[]) => {}
  readonly resultLog = (..._: any[]) => {}

  constructor() {
    this.mountAsDefault(ParallelBatch, [this])
    this.mountAsDefault(SequenceBatch, [this])
    this.mountAsDefault(TerminateWithError, [this.errorLog])
  }

  private mountAsDefault<O extends Operation>(
    opr: O,
    infra: InfraOf<InstanceType<O>>,
  ) {
    this.mount(opr, infra)
    this.hideFromAudit.add(opr)
    return this
  }

  mount<O extends Operation>(
    opr: O,
    infra: InfraOf<InstanceType<O>>,
    reaction?: (c: InstanceType<O>) => void,
  ) {
    this.infra.set(opr, infra)
    if (reaction) this.reactions.set(opr, reaction)
    this.hideFromAudit.delete(opr)
    return this
  }

  delegate<O extends Operation>(opr: O, exc: Executor) {
    this.delegates.set(opr, exc)
    return this
  }

  link<O extends Operation, Tr extends O>(
    opr: O,
    resolveTo: Tr,
    infra: InfraOf<InstanceType<Tr>>,
    trans: (f: InstanceType<O>) => InstanceType<Tr>,
  ) {
    this.links.set(opr, [resolveTo, trans])
    this.mount(resolveTo, infra)
    return this
  }

  resolve<C extends UseCase>(c: C): [Operation, Morph<Operation<any, C>>] {
    const cls = c.constructor as Operation
    const lnk = this.links.get(cls)
    if (lnk) return lnk
    return [cls, (o) => o]
  }

  private readonly name = this.constructor.name

  run<C extends UseCase>(c: C): OutputOf<C> {
    const [opr, mrf] = this.resolve(c)
    const dlg = this.delegates.get(opr)
    if (dlg) return dlg.run(c)

    const infra = this.infra.get(opr) as InfraOf<C> | null
    if (!infra) {
      this.errorLog('No infra for', c.constructor.name)
      throw new Error('No infra for ' + c.constructor.name)
    }
    const cse = mrf(c)

    const str = UseCase.toHumanString(cse)

    this.executionLog(`${this.name} » ${str})}`)
    const res = Runner.run(cse, infra)
    Promise.resolve(res).then((out) =>
      this.resultLog(`${this.name} « ${str} -> ${out}`)
    )

    const reaction = this.reactions.get(opr)
    if (reaction) reaction(c)

    return res
  }

  async recurse<C extends UseCase | null>(c: C | null): Promise<void> {
    let n: UseCase | null = c
    while (n) {
      n = await this.run(n)
    }
  }

  audit(excludes = [] as any[], indent = 0): string {
    const adt = (obj: any) =>
      Runner.audit(obj, new Set([...excludes, this]), indent)

    return `
    = Mounts
    ${this.auditInfra(adt)}

    = Delegates
    ${this.auditDelegates(adt)}
    `
      .split('\n')
      .map((s) => '| '.repeat(indent * 1).concat(s.trim()))
      .join('\n')
  }

  private auditDelegates(audit: (obj: any) => string) {
    const dgs = [...this.delegates.entries()]
    if (dgs.length === 0) return '(no delegates found).ts'
    return dgs.map(([k, v]) => `${k.name} to ${audit(v)}`).join('\n')
  }

  private auditInfra(audit: (obj: any) => string) {
    const inf = [...this.infra.entries()]
    if (inf.length === 0) return '(no infra).ts'
    return inf
      .filter(([k]) => !this.hideFromAudit.has(k))
      .map(([k, v]) => `${k.name} -> ${v.map(audit).join(', ')}`)
      .join('\n')
  }

  static isAuditable(obj: any): obj is Auditable {
    return typeof obj.audit === 'function'
  }

  static audit(obj: any, visited: Set<any>, indent: number): string {
    if (visited.has(obj)) return '@circular.ts'
    if (!Runner.isAuditable(obj)) return obj.constructor.name

    visited.add(obj)
    const excludes = [...visited.values()]
    return `Runner ${obj.audit(excludes, indent + 1)}`
  }

  static run<C extends UseCase>(c: C, inf: InfraOf<C>): OutputOf<C> {
    return c.execute(...inf)
  }

  static bind<O extends Operation>(opr: O, exc: Executor) {
    return new BoundedOperation(opr, exc)
  }

  static bindInfra<O extends Operation>(
    opr: O,
    inf: InfraOf<InstanceType<O>>,
  ): (...inp: InputOf<O>) => OutputOf<InstanceType<O>> {
    return (...inp) => {
      const u = new opr(...inf) as InstanceType<O>
      return u.execute(inp)
    }
  }

  static bindInput<Op extends Operation>(
    opr: Op,
    inp: InputOf<Op>,
  ): (...inf: InfraOf<InstanceType<Op>>) => OutputOf<InstanceType<Op>> {
    return (...inf) => {
      const u = new opr(...inp) as InstanceType<Op>
      return u.execute(...inf)
    }
  }

  static makeRun(
    rnn: Executor & RecursiveExecutor,
    supported: Operation[] = [],
  ) {
    return (c: UseCase) => {
      const cls = c.constructor as Operation
      if (!supported.includes(cls)) {
        throw new Error(`Unsupported use case ${cls.name}`)
      }
      return rnn.recurse(c)
    }
  }

  static makeInterpreter(prg: Executor, rnn: RecursiveExecutor) {
    return async (c: UseCase) => {
      const opr = await Promise.resolve(prg.run(c))
      return await rnn.recurse(opr)
    }
  }
}

export type Morph<O extends Operation = Operation> = (
  o: InstanceType<O>,
) => UseCase<any, OutputOf<InstanceType<O>>>

export interface Executor {
  run<U extends UseCase>(u: U): OutputOf<U>
}

export interface Auditable {
  audit(excludes?: any[], indent?: number): string
}

export interface RecursiveExecutor {
  recurse<C extends UseCase | null>(c: C | null): Promise<void>
}

export class Batch<U extends UseCase = UseCase> {
  constructor(readonly cases: U[] = []) {}

  append(c: UseCase) {
    return new Batch([...this.cases, c])
  }

  runInParallel(maxConcurrent: number = Infinity) {
    return new ParallelBatch<U>(this.cases).setMaxConcurrent(maxConcurrent)
  }

  runInSequence() {
    return new SequenceBatch(this.cases)
  }

  static fromList = () =>
    [<U extends UseCase>(b: Batch, u: U) => b.append(u), new Batch()] as const

  static of(cases: UseCase[]) {
    return new Batch(cases)
  }

  static from<O extends Operation>(opr: O, inp: InputOf<O>[]) {
    return Batch.of(inp.map((i) => new opr(...i)))
  }
}

export class ParallelBatch<U extends UseCase = UseCase> {
  constructor(readonly cases: U[] = [], readonly maxParallel = 10) {}

  setMaxConcurrent(n: number) {
    return new ParallelBatch(this.cases, n)
  }

  async execute(rnn: Executor) {
    const res = [] as OutputOf<U>[]
    const batches = this.splitIntoBatches()
    for (const b of batches) {
      res.push(...(await Promise.all(b.map((c) => rnn.run(c)))))
    }
    return res
  }

  private splitIntoBatches() {
    const batches = []
    for (let i = 0; i < this.cases.length; i += this.maxParallel) {
      batches.push(this.cases.slice(i, i + this.maxParallel))
    }
    return batches
  }
}

export class SequenceBatch {
  constructor(readonly cases: UseCase[] = []) {}

  async execute(rnn: Executor) {
    const res = []
    for (const c of this.cases) {
      res.push(await rnn.run(c))
    }
    return res
  }
}

export class TerminateWithError {
  readonly err: Error

  constructor(readonly reason: string = '') {
    this.err = new Error(reason)
  }

  execute(_ = console.log.bind(console)) {
    throw this.err
    //log(`Error: ${this.reason}\n${this.stack}`);
  }
}

export class BoundedOperation<
  O extends Operation,
  W extends Wrapper<O, Operation> = Wrapper<O, O>,
> {
  constructor(
    readonly op: O,
    readonly exc: Executor,
    readonly wrapper = new IdentityWrapper() as W,
  ) {}

  wrap<nW extends Wrapper<SpcOp<W>>>(wrapper: nW) {
    return new BoundedOperation(
      this.op,
      this.exc,
      BoundedOperation.composeWrapper(this.wrapper, wrapper),
    )
  }

  toProcedure() {
    return (...inp: InputOf<O>) => {
      const cse = new this.op(...inp)
      const spc = this.wrapper.specify(cse)
      const out = this.exc.run(spc)
      return this.wrapper.generalize(out)
    }
  }

  private static composeWrapper<A extends Wrapper, B extends Wrapper<SpcOp<A>>>(
    a: A,
    b: B,
  ): Wrapper<GenOp<A>, SpcOp<B>> {
    return {
      specify: (opr) => b.specify(a.specify(opr)),
      generalize: (out) => {
        return a.generalize(b.generalize(out)) as OutputOf<
          InstanceType<GenOp<A>>
        >
      },
    }
  }
}

interface Wrapper<
  G extends Operation = Operation,
  S extends Operation = Operation,
> {
  specify: (opr: InstanceType<G>) => InstanceType<S>
  generalize: (out: OutputOf<InstanceType<S>>) => OutputOf<InstanceType<G>>
}

type GenOp<W extends Wrapper> = W extends Wrapper<infer G, any> ? G : never
type SpcOp<W extends Wrapper> = W extends Wrapper<any, infer S> ? S : never

class IdentityWrapper<O extends Operation> implements Wrapper<O, O> {
  specify(opr: InstanceType<O>) {
    return opr
  }

  generalize(out: OutputOf<InstanceType<O>>) {
    return out
  }
}
