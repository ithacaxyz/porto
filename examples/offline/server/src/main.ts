import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { cache } from 'hono/cache'
import { logger } from 'hono/logger'
import { poweredBy } from 'hono/powered-by'
import { prettyJSON } from 'hono/pretty-json'
import { Address, Json, WebCryptoP256 } from 'ox'
import { env, getRuntimeKey } from 'hono/adapter'
import { HTTPException } from 'hono/http-exception'
import { getRouterName, showRoutes } from 'hono/dev'
import { contextStorage } from 'hono/context-storage'
import { getConnInfo } from 'hono/cloudflare-workers'

const app = new Hono<{ Bindings: Env }>()

app.use('*', logger())
app.use('*', cors({ origin: '*', allowMethods: ['GET', 'HEAD', 'OPTIONS'] }))
/* append `?pretty` to any request to get prettified JSON */
app.use('*', prettyJSON({ space: 2 }))
app.use(contextStorage())

app.get('/', (context) => context.redirect('/v1'))

app.get('/ping', (context) => context.text('pong'))
app.get('/health', (context) => context.text('ok'))

app.get('/routes', async (context) => {
  const verbose = context.req.query('verbose')
  const { ENVIRONMENT } = env(context)
  if (ENVIRONMENT === 'development') {
    const { showRoutes } = await import('hono/dev')
    showRoutes(app, { verbose: verbose === 'true' || verbose === '1' })
    return new Response(
      JSON.stringify([...new Set(app.routes.map(({ path }) => path))], null, 2),
    )
  }
  return new Response(null, { status: 418 })
})

app.get('/v1', (context) =>
  context.json({ version: '1', name: 'Porto Offline Tx Server' }),
)

/**
 * Returns existing keys
 */
app.get('/keys', async (context) => context.json({ error: 'Not implemented' }))

/**
 * Creates new keys
 */
app.post('/keys', async (context) => {
  const payload = await context.req.json<{ address: Address.Address }>()

  const isAddress = Address.validate(payload.address)
  if (!isAddress) return context.json({ error: 'Invalid address' }, 400)

  const keys = await WebCryptoP256.createKeyPair({ extractable: true })

  return context.json(
    Json.stringify({
      callScopes: [],
      publicKey: keys.publicKey,
      expiry: Date.now() + 1000 * 60 * 60, // 1 hour
    }),
  )
})

/**
 * Authorized key notification
 */
app.post('/authorized-key', async (context) => {
  const payload = await context.req.json<{}>()

  return context.json({ error: 'Not implemented' })
})

showRoutes(app)

const runtimeKey = getRuntimeKey()

if (runtimeKey !== 'workerd')
  console.info(`Running on http://localhost:${process.env.PORT}`)

export default app
