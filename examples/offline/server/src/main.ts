import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { cache } from 'hono/cache'
import { env, getRuntimeKey } from 'hono/adapter'
import { Address, WebCryptoP256, Json } from 'ox'
import { getRouterName, showRoutes } from 'hono/dev'
import { contextStorage, getContext } from 'hono/context-storage'

const app = new Hono<{ Bindings: Env }>().basePath('/v1')

app.use('*', cors())
app.use(contextStorage())
app.get(
  '*',
  cache({
    cacheControl: 'max-age=3600',
    cacheName: 'porto-offline-server',
  }),
)

app.get('/', (context) => context.text('TBD'))
app.get('/ping', (context) => context.text('pong'))

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

  return new Response(
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
