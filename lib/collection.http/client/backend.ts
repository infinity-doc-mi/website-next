import type {
  DataStructure,
  Op_Count,
  Op_Delete,
  Op_Insert,
  Op_List,
  Op_Update,
  OperationFactory,
} from '@duesabati/collection'
import { QuerySerializer } from '@duesabati/collection'

import { Protocol } from '../protocol/index.ts'
import { Protocol_Request } from '../protocol/request.ts'

export class HTTP_Backend<T extends DataStructure = any> extends QuerySerializer
  implements OperationFactory<T> {
  private endpoint: string = ''

  set_endpoint(endpoint: string) {
    this.endpoint = endpoint
    return this
  }

  make_delete(): Op_Delete {
    return async () => {
      await this.make_request((req) => {
        Protocol_Request.set_op(req, 'delete')
      })
    }
  }

  make_insert(): Op_Insert<T> {
    return async (docs) => {
      await this.make_request((req) => {
        Protocol_Request.set_op(req, 'insert')
        docs.forEach((doc) => Protocol_Request.attach_doc(req, doc))
      })
    }
  }

  make_update(upsert: boolean): Op_Update<T> {
    return async (patch) => {
      await this.make_request((req) => {
        Protocol_Request.set_op(req, upsert ? 'upsert' : 'update')
        Protocol_Request.attach_doc(req, patch)
      })
    }
  }

  make_list(): Op_List<T> {
    return async () => {
      const res = await this.make_request((req) =>
        Protocol_Request.set_op(req, 'list')
      )
      return Array.from<T>(await res.json())
    }
  }

  make_count(): Op_Count {
    return async () => {
      const res = await this.make_request((req) =>
        Protocol_Request.set_op(req, 'count')
      )
      return (await res.json()).count
    }
  }

  private make_request(m: (req: Protocol_Request) => void) {
    const req = new Protocol_Request()
    Protocol_Request.set_query(req, this.to_query())
    m(req)
    const http_req = Protocol.http_request(req)
    return fetch(this.endpoint, http_req)
  }
}

export function web_server(endpoint: string) {
  return () => new HTTP_Backend().set_endpoint(endpoint)
}
