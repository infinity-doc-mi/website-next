import { MiddlewareHandler } from 'hono'

type LoggerConfiguration = {
  skip?: string[]
}

export const logger =
  (cfg?: LoggerConfiguration): MiddlewareHandler => async (ctx, next) => {
    const { skip = [] } = cfg || {}

    const endpoints_to_omit = skip.map((header) => header.toLowerCase())

    if (endpoints_to_omit.includes(ctx.req.path.toLowerCase())) {
      return next()
    }

    const date = new Date().toISOString()
    const method = ctx.req.method
    const path = ctx.req.path

    const start = Date.now()
    console.log(`<-- ${date} ${method} ${path}`)

    await next()

    const status = ctx.res.status
    const elapsed = Date.now() - start
    console.log(`--> ${date} ${method} ${path} ${status} ${elapsed}ms`)
  }
