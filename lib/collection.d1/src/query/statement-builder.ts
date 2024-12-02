import { ConditionStatement } from './condition-statement.ts'

export class StatementBuilder {
  statement = new ConditionStatement()

  private isFirst = true
  private isNextWhereInOr = false

  compose(exp: ConditionStatement) {
    if (this.isFirst) {
      this.statement = exp
      this.isFirst = false
      return this
    }

    if (this.isNextWhereInOr) {
      this.statement = this.statement.or(exp)

      this.isNextWhereInOr = false
      return this
    }

    this.statement = this.statement.and(exp)

    return this
  }

  or() {
    this.isNextWhereInOr = true
    return this
  }
}
