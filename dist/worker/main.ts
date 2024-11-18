import { Hono } from 'hono'
import { logger } from 'hono/logger'

type Bindings = {
  ASSETS: { fetch: typeof fetch }
}

import { createStaticHandler } from 'react-router-dom/server'

import { routes } from '@infinitydoc/website-pages'
import { forward_to } from './development/forward.ts'
import { ssr } from './src/render.tsx'

const app = new Hono<{ Bindings: Bindings }>()
const handler = createStaticHandler(routes)

app.use(logger())

app.use('/live-reload', forward_to('http://localhost:1234/live-reload'))

app.get('*', ssr(handler))

export default app
