import { Protocol_Request } from './request.ts'

export class Protocol {
  static http_request(req: Protocol_Request) {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Protocol_Request.build(req)),
    }
  }
}
