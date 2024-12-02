import type { Runner, UseCase } from '@duesabati/mitra'

export class JoinDocs<T, P> {
  constructor(
    private readonly findA: UseCase<any, Promise<T[]>>,
    private readonly findB: UseCase<any, Promise<P[]>>,
    private readonly on: (a: T, b: P) => boolean,
  ) {}

  async execute(r: Runner) {
    const a = await r.run(this.findA)
    const b = await r.run(this.findB)
    return a.map((ia) => ({
      ...ia,
      ...(b.find((ib) => this.on(ia, ib)) || ({} as P)),
    }))
  }

  toString() {
    return `${String(this.findA)} + ${
      String(
        this.findB,
      )
    } on ${this.on.toString()}`
  }
}
