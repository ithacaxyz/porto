import { env } from 'cloudflare:workers'
import { Hono } from 'hono'
import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'

import { createAuth } from '../better-auth.config'

const app = new Hono<{ Bindings: Env }>().basePath('/api')
const auth = await createAuth({
  db: new Kysely({
    dialect: new D1Dialect({ database: env.DB }),
  }),
  domain: env.BETTER_AUTH_SIWE_DOMAIN,
})

app.on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))

app.get('/me', async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  return c.json({ session })
})

export default app satisfies ExportedHandler<Env>
