import { Hono } from 'hono'
import { logger } from 'hono/logger'

import { createStaticHandler } from 'react-router-dom/server'

import { routes } from '@infinitydoc/website-pages'
import { serve_static } from './development/serve-static.ts'
import { forward_to } from './development/forward.ts'
import { ssr } from './src/render.tsx'

const STATIC_PATH = Deno.env.get('STATIC_PATH') || 'unset'

const app = new Hono()
const handler = createStaticHandler(routes)

console.log(STATIC_PATH)

app.use(logger())

app.use('/live-reload', forward_to('http://localhost:1234/live-reload'))

app.get('*', serve_static({ root: STATIC_PATH }))

app.get('*', ssr(handler))

export default app

export const onRequest = app