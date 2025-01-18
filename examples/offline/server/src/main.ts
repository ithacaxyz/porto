import { Hono } from 'hono'
import { env, getRuntimeKey } from 'hono/adapter'
import { getRouterName, showRoutes } from 'hono/dev'
import { Address, WebCryptoP256 } from 'ox'

const app = new Hono<{ Bindings: Env }>().basePath('/v1')

app.get('/', (context) => context.text('TBD'))

app.post('/keys', async (context) => {
  const payload = await context.req.json<{ address: Address.Address }>()

  const isAddress = Address.validate(payload.address)

  if (!isAddress) return context.json({ error: 'Invalid address' }, 400)

  const keyPair = await WebCryptoP256.createKeyPair()

  return context.json({
    callScopes: [],
    publicKey: keyPair.publicKey,
    expiry: Date.now() + 1000 * 60 * 60 * 24, // 1 day
  })
})

showRoutes(app, {
  verbose: true,
})

const runtimeKey = getRuntimeKey()
if (runtimeKey !== 'workerd')
  console.info(`Running on http://localhost:${process.env.PORT}`)

export default app
