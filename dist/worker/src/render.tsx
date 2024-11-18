import React from 'react'
import type { RedirectStatusCode } from 'hono/utils/http-status'
import { Handler } from 'hono'
import { stream } from 'hono/streaming'

import { renderToReadableStream } from 'react-dom/server'

import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server'
type StaticHandler = ReturnType<typeof createStaticHandler>

import { Root } from '@infinitydoc/website-pages'

export const ssr = (handler: StaticHandler): Handler => async (c) => {
  const context = await handler.query(c.req.raw)

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

  const router = createStaticRouter(handler.dataRoutes, context, {
    future: {
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
    }
  })

  const title = context.matches[0].route.handle.title ?? 'InfinityDoc'

  return stream(c, async (stream) => {
    stream.onAbort(() => console.log('aborted'))

    const r = await renderToReadableStream(
      <Root title={title}>
        <StaticRouterProvider router={router} context={context} />
      </Root>,
      {
        bootstrapScripts: ['./main.js'],
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
