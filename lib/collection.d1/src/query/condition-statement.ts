import type { SelOperation } from '@duesabati/collection'
import { immerable, produce } from 'immer'

export class ConditionStatement {
  [immerable] = true

  constructor(readonly Statement: string[][] = []) {}

  /**
   * Combines the current ConditionStatement with another using AND logic.
   * @param other - The other ConditionStatement to combine.
   * @returns A new ConditionStatement representing the AND logic.
   */
  and(other: ConditionStatement): ConditionStatement {
    return produce(this, (draft) => {
      const new_statement: string[][] = []

      for (const subset of draft.Statement) {
        for (const other_subset of other.Statement) {
          new_statement.push([...subset, ...other_subset])
        }
      }

      draft.Statement = new_statement
    })
  }

  /**
   * Combines the current ConditionStatement with another using OR logic.
   * @param other - The other ConditionStatement to combine.
   * @returns A new ConditionStatement representing the OR logic.
   */
  or(other: ConditionStatement): ConditionStatement {
    return produce(this, (draft) => {
      draft.Statement = [...draft.Statement, ...other.Statement]
    })
  }

  toSQLStatement(): string {
    if (this.Statement.length === 0) {
      return 'WHERE TRUE' // Return a default "always true" clause for empty conditions
    }

    // Combine subarrays using AND, and combine the resulting groups using OR
    const ors = this.Statement.map((subset) => {
      const ands = subset.map((condition) => `(${condition})`).join(' AND ')
      return `(${ands})`
    })

    const clause = ors.join(' OR ')

    return `WHERE ${clause}`
  }

  static make(opr: SelOperation): ConditionStatement {
    switch (opr.op) {
      case '==': {
        return new ConditionStatement([[`${opr.field} = ${opr.value}`]])
      }
      case '!=': {
        return new ConditionStatement([[`${opr.field} != ${opr.value}`]])
      }

      case '>': {
        return new ConditionStatement([[`${opr.field} > ${opr.value}`]])
      }

      case '<': {
        return new ConditionStatement([[`${opr.field} < ${opr.value}`]])
      }

      case '<=': {
        return new ConditionStatement([[`${opr.field} <= ${opr.value}`]])
      }

      case '>=': {
        return new ConditionStatement([[`${opr.field} >= ${opr.value}`]])
      }

      case 'in': {
        throw new Error('«in» operator not supported')
      }
      case 'like': {
        throw new Error('«like» operator not supported')
      }
      case 'starts-with': {
        throw new Error('«starts-with» operator not supported')
      }
    }

    throw new Error('Unsupported operator')
  }
}
