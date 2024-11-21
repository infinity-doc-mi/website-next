import { type DataStructure, SerializedQuery } from '../../storage/mod.ts'

export class Protocol_Request {
  op: string = 'noop' as
    | 'noop'
    | 'insert'
    | 'list'
    | 'delete'
    | 'update'
    | 'upsert'
    | 'count'
  query: SerializedQuery<any> = new SerializedQuery()
  attached_docs: DataStructure[] = []

  static set_op(req: Protocol_Request, op: string) {
    req.op = op
  }

  static set_query(req: Protocol_Request, query: SerializedQuery<any>) {
    req.query = query
  }

  static attach_doc(req: Protocol_Request, doc: DataStructure) {
    req.attached_docs.push(doc)
  }

  static build(req: Protocol_Request) {
    const body = {} as Record<string, any>
    body.op = req.op
    body.query = req.query

    if (req.attached_docs.length) {
      body.attached_docs = req.attached_docs
    }

    return body
  }
}
