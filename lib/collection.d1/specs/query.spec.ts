import { assertEquals } from 'jsr:@std/assert'

import type { QueryFactory } from '@duesabati/collection'

import { ConditionStatement, StatementBuilder } from '../src/query/index.ts'

class SomeDataStructure {
  [key: string]: any

  name: string = ''
  age: number = 0

  constructor(pln: Partial<SomeDataStructure>) {
    Object.assign(this, pln)
  }
}

Deno.test('Given a serialized query, correctly translate it to «SQLite» sql statement', () => {
  const c = ConditionStatement.make({ field: 'name', op: '==', value: 'John' })

  assertEquals(c.Statement, [['name = John']])
})

Deno.test('Given one and only one ConditionStatement, it should output WHERE <statement>', () => {
  const c = ConditionStatement.make({ field: 'name', op: '==', value: 'John' })

  const sb = new StatementBuilder()

  sb.compose(c)

  assertEquals(sb.statement.Statement, [['name = John']])
})

Deno.test('Given two ConditionStatement, it should output WHERE <statement> AND <statement>', () => {
  const c1 = ConditionStatement.make({ field: 'name', op: '==', value: 'John' })
  const c2 = ConditionStatement.make({ field: 'age', op: '>', value: 18 })

  const sb = new StatementBuilder()

  sb.compose(c1)
  sb.compose(c2)

  assertEquals(sb.statement.Statement, [['name = John', 'age > 18']])
})

Deno.test(
  'Given three conditions where the first two are in AND and the last one is in OR, it should make an array of two ',
  () => {
    const c1 = ConditionStatement.make({
      field: 'name',
      op: '==',
      value: 'John',
    })
    const c2 = ConditionStatement.make({ field: 'age', op: '<', value: 30 })
    const c3 = ConditionStatement.make({ field: 'age', op: '>', value: 18 })

    const sb = new StatementBuilder()

    sb.compose(c1)
    sb.compose(c2)
    sb.or()
    sb.compose(c3)

    assertEquals(sb.statement.Statement, [['name = John', 'age < 30'], [
      'age > 18',
    ]])
  },
)

Deno.test('Given a query, it should return a valid SQL statement', () => {})
