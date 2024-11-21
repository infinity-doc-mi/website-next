import type { ProcessStep } from './process-step.ts'

export interface ProcessStatusReporter {
  notifyProgress(steps: ProcessStep[]): void
}

export class NullProcessStatusReporter implements ProcessStatusReporter {
  notifyProgress(_: ProcessStep[]): void {}
}
