import type { Handler } from 'hono'

export const forward_to = (location: string): Handler => (c) => {
  return c.redirect(location)
}
