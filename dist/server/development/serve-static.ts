import type { MiddlewareHandler } from 'hono'
import { serveStatic } from 'hono/deno'

/**
 * Unfortunately serveStatic assume that index.html is the default file
 * to serve if the path is /, so we need to skip it.
 */
const skip_if_index = (skip: () => void) => (p: string) =>
  p.endsWith('index.html') ? skip() : undefined

export const serve_static =
  (opts: { root: string }): MiddlewareHandler => (c, next) =>
    serveStatic({ root: opts.root, onFound: skip_if_index(next) })(c, next)
