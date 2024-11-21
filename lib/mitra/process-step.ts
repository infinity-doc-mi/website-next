import { UseCase } from './use-case.ts'

export class ProcessStep {
  static isCompleted = (step: ProcessStep) => step.progress >= 1
  static isInProgress = (step: ProcessStep) =>
    step.progress > 0 && step.progress < 1
  static isPending = (step: ProcessStep) => step.progress === 0

  constructor(
    readonly name: string,
    readonly description: string,
    readonly progress: number,
  ) {}

  readonly status = [
    [ProcessStep.isCompleted, ProcessStepStatus.Completed] as const,
    [ProcessStep.isInProgress, ProcessStepStatus.InProgress] as const,
    [ProcessStep.isPending, ProcessStepStatus.Pending] as const,
  ].find(([fn]) => fn(this))![1]

  static fromUseCase(useCase: UseCase) {
    return new ProcessStep(UseCase.nameOf(useCase), useCase.toString(), 0)
  }
}

export enum ProcessStepStatus {
  Completed = 'completed',
  InProgress = 'in-progress',
  Pending = 'pending',
  Failed = 'failed',
}
