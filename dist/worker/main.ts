import { Hono } from 'hono'

import { createStaticHandler } from 'react-router'

import { routes } from '@infinitydoc/website-pages'
import { d1 } from '@duesabati/collection-d1'
import { SimpleD1Client } from '@duesabati/simple-d1'
import { consus } from '@duesabati/collection-http'
import { forward_to } from './development/forward.ts'
import { ssr } from './src/render.tsx'
import { Bindings } from './worker-context.d.ts'
import { setup_cols } from '@infinitydoc/db'
import { ServiceHighlight } from '@infinitydoc/model'

const app = new Hono<{ Bindings: Bindings }>()
const handler = createStaticHandler(routes)

app.use('/live-reload', forward_to('http://localhost:1234/live-reload'))

app.post('/db/service_highlights', (c, next) => {
  const client = new SimpleD1Client(c.env.DB)

  const cols = setup_cols((cols) => {
    cols.get(ServiceHighlight).store_in(
      d1(client.table('service_highlight', ServiceHighlight)),
    )
  })

  const service_highlight = cols.get(ServiceHighlight)

  return consus(service_highlight)(c, next)
})

app.get('/db/test', async (c) => {
  const res = await c.env.DB.prepare('SELECT 1').run()
  return c.json(res.meta)
})

app.get('*', ssr(handler))

export default app
