import type { ProcessStatusReporter } from './process-status-reporter.ts'
import { ProcessStep } from './process-step.ts'

export class Process {
  readonly steps: ProcessStep[] = []

  add(step: ProcessStep) {
    this.steps.push(step)
    return this
  }

  update(index: number, progress: number) {
    const step = this.steps[index]
    this.steps[index] = new ProcessStep(step.name, step.description, progress)
    return this
  }

  notifyProgressTo(reporter: ProcessStatusReporter) {
    reporter.notifyProgress(this.steps.slice())
    return this
  }
}
