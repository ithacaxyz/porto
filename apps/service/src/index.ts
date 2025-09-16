import type { ExportedHandler } from '@cloudflare/workers-types'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { requestId } from 'hono/request-id'
import { secureHeaders } from 'hono/secure-headers'
import { trimTrailingSlash } from 'hono/trailing-slash'

import { corsApp } from './routes/cors.ts'
import { onrampApp } from './routes/onramp.ts'
import { snapshotApp } from './routes/snapshot.tsx'
import { verifyApp } from './routes/verify.ts'

const app = new Hono<{ Bindings: Cloudflare.Env }>()
app.use(cors())
app.use(csrf())
app.use(logger())
app.use(prettyJSON())
app.use(secureHeaders())
app.use('*', requestId())
app.use(trimTrailingSlash())

app.get('/', (context) =>
  context.json({
    routes: ['/cors', '/onramp', '/snapshot', '/verify'],
    version: context.env.APP_VERSION,
  }),
)

app.get('/health', (context) => context.text('ok'))

app.route('/cors', corsApp)
app.route('/onramp', onrampApp)
app.route('/snapshot', snapshotApp)
app.route('/verify', verifyApp)

export default app satisfies ExportedHandler<Cloudflare.Env>
