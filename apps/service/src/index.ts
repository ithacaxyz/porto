import type { ExportedHandler } from '@cloudflare/workers-types'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { requestId } from 'hono/request-id'

import { corsApp } from './routes/cors.ts'
import { faucetApp } from './routes/faucet.ts'
import { onrampApp } from './routes/onramp.ts'
import { verifyApp } from './routes/verify.ts'

const app = new Hono<{ Bindings: Cloudflare.Env }>()
app.use(logger())
app.use(prettyJSON())
app.use('*', requestId())

app.get('/health', (context) => context.text('ok'))

app.route('/cors', corsApp)
app.route('/faucet', faucetApp)
app.route('/onramp', onrampApp)
app.route('/verify', verifyApp)

export default app satisfies ExportedHandler<Cloudflare.Env>
