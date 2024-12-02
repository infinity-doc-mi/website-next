import type {} from '@cloudflare/workers-types'

import type { ClassOf, DataStructure } from '@duesabati/collection'

export class SimpleD1Client {
  private static tested = false

  constructor(readonly db: D1Database) {}

  table<T extends DataStructure>(name: string, cls: ClassOf<T>) {
    this.test_connection()

    return new D1Table(this, name, cls)
  }

  private test_connection() {
    if (SimpleD1Client.tested) {
      return
    }

    this.db.exec('SELECT 1')
      .then(() => {
        SimpleD1Client.tested = true
      })
      .catch((e) => {
        console.error('Failed to connect to database:', e)
        throw e
      })
  }
}

export class D1Table<T extends DataStructure> {
  private columns: [keyof T, DataType][] = []
  private created = false

  constructor(
    private client: SimpleD1Client,
    private name: string,
    private cls: ClassOf<T>,
  ) {
    this.columns = Object.entries(new this.cls())
      .map(([k, v]) => [k, read_type(v)])
  }

  async select(clauses: string) {
    this.ensure_table()

    const { results } = await this.client.db
      .prepare(`
        SELECT * FROM ${this.name}
        ${clauses}
      `)
      .run<T>()

    return results.map(this.parse).map((r) => new this.cls(r))
  }

  insert<T>(data: T[]) {
    this.ensure_table()

    const stmt = this.client.db.prepare(`
      INSERT INTO ${this.name} (raw_data)
      VALUES (?)
    `)

    return this.client.db.batch(
      data.map((d) => stmt.bind(JSON.stringify(d))),
    )
  }

  delete(clauses: string) {
    this.ensure_table()

    return this.client.db.prepare(`
      DELETE FROM ${this.name}
      ${clauses}
    `).run()
  }

  private ensure_table() {
    if (!this.created) {
      this.create_table()
      this.created = true
    }
  }

  private create_table() {
    const generated_cols = Object.keys(new this.cls())
      .map((c) => `${c} AS (json_extract(raw_data, '$.${c}'))`)
      .join(',\n')

    this.client.db.prepare(`
      CREATE TABLE IF NOT EXISTS ${this.name} (
        _id INTEGER PRIMARY KEY AUTOINCREMENT,
        _last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        raw_data TEXT,
        ${generated_cols}
      )
    `).run()
  }

  private parse = (v: object): T => {
    return Object.fromEntries(
      Object.entries(v).map(([col, val]) => {
        const col_prop = this.columns.find(([name]) => col === name)

        if (!col_prop) {
          return [col, val]
        }

        const [_, type] = col_prop

        if (type === 'array' || type === 'record') {
          return [col, JSON.parse(val as any)]
        }

        if (type === 'boolean') {
          return [col, Boolean(val)]
        }

        return [col, val]
      }),
    ) as T
  }
}

type DataType =
  | 'number'
  | 'string'
  | 'boolean'
  | 'array'
  | 'record'
  | 'undefined'
  | 'function'
  | 'symbol'

function read_type(t: unknown): DataType {
  const type = typeof t

  if (type === 'object') {
    if (Array.isArray(t)) {
      return 'array' as const
    }

    return 'record' as const
  }

  if (type === 'bigint') {
    return 'number' as const
  }

  return type
}
