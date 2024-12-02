import type { RedirectStatusCode } from 'hono/utils/http-status'
import { Handler } from 'hono'
import { stream } from 'hono/streaming'

// @deno-types="@types/react-dom/server"
import { renderToReadableStream } from 'react-dom/server'

import {
  createStaticRouter,
  type StaticHandler,
  StaticRouterProvider,
} from 'react-router'

import { d1 } from '@duesabati/collection-d1'
import { SimpleD1Client } from '@duesabati/simple-d1'

import { Root } from '@infinitydoc/website-pages'
import { setup_cols } from '@infinitydoc/db'
import { ServiceHighlight } from '@infinitydoc/model'
import { Bindings } from '../worker-context.d.ts'

export const ssr =
  (handler: StaticHandler): Handler<{ Bindings: Bindings }> => async (c) => {
    const client = new SimpleD1Client(c.env.DB)

    const cols = setup_cols((cols) => {
      cols.get(ServiceHighlight).store_in(
        d1(client.table('service_highlight', ServiceHighlight)),
      )
    })

    const context = await handler.query(c.req.raw, {
      requestContext: { cols },
    })

    if (
      context instanceof Response &&
      [301, 302, 303, 307, 308].includes(context.status)
    ) {
      return c.redirect(
        context.headers.get('Location') ?? '/',
        context.status as RedirectStatusCode,
      )
    }

    if (context instanceof Response) {
      return context
    }

    const router = createStaticRouter(handler.dataRoutes, context)

    const title = context.matches[0].route.handle?.title ?? 'InfinityDoc'

    c.header('Content-Type', 'text/html')

    return stream(c, async (stream) => {
      stream.onAbort(() => console.log('aborted'))

      const r = await renderToReadableStream(
        <Root title={title}>
          <StaticRouterProvider
            router={router}
            context={context}
          />
        </Root>,
        {
          bootstrapScripts: ['/main.js'],
          bootstrapScriptContent: `window.__HEAD__ = ${
            JSON.stringify({
              title,
            })
          }`,
        },
      )

      await stream.pipe(r)
    })
  }

// const is_redirect = (res: Response) => res.status >= 300 && res.status < 400
