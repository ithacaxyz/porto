import { Key } from 'Porto'
import { Hono } from 'hono'
import { env, getRuntimeKey } from 'hono/adapter'
import { cors } from 'hono/cors'
import { showRoutes } from 'hono/dev'
import { logger } from 'hono/logger'
import { Address, WebCryptoP256 } from 'ox'

const app = new Hono<{ Bindings: Env }>()

app.use('*', logger())
app.use('*', cors({ origin: '*', allowMethods: ['GET', 'HEAD', 'OPTIONS'] }))

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

  const keyPair = await WebCryptoP256.createKeyPair({ extractable: true })

  const key = Key.fromWebCryptoP256({
    keyPair,
    role: 'session',
    expiry: 1714857600,
  })

  return context.json(Key.toRpc(key))
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
