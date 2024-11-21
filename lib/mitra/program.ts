import { Process } from './process.ts'
import type { ProcessStatusReporter } from './process-status-reporter.ts'
import { ProcessStep } from './process-step.ts'
import type { Runner } from './runner.ts'
import type { UseCase } from './use-case.ts'

export class Program {
  constructor(readonly steps: UseCase[]) {}

  async run(r: Runner, reporter: ProcessStatusReporter) {
    const prc = Program.makeProcess(this)
    for (const i in this.steps) {
      const step = this.steps[i]
      await r.run(step)
      prc.update(Number(i), 1).notifyProgressTo(reporter)
    }
  }

  static makeProcess(prg: Program) {
    return prg.steps
      .map(ProcessStep.fromUseCase)
      .reduce((prc, step) => prc.add(step), new Process())
  }
}
