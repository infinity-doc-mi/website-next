import {
  NullProcessStatusReporter,
  type ProcessStatusReporter,
} from './process-status-reporter.ts'
import type { Program } from './program.ts'
import { Runner } from './runner.ts'

export class ProgramRunner extends Runner {
  private reporter: ProcessStatusReporter = new NullProcessStatusReporter()

  setReporter(reporter: ProcessStatusReporter) {
    this.reporter = reporter
    return this
  }

  runProgram(prg: Program) {
    return prg.run(this, this.reporter)
  }
}
