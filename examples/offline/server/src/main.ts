import { Key, Porto } from 'Porto'
import { Hono } from 'hono'
import { env, getRuntimeKey } from 'hono/adapter'
import { contextStorage, getContext } from 'hono/context-storage'
import { cors } from 'hono/cors'
import { showRoutes } from 'hono/dev'
import { logger } from 'hono/logger'
import { Address, Json, WebCryptoP256 } from 'ox'

const app = new Hono<{
  Bindings: { KV: KVNamespace }
}>()

app.use('*', logger())
app.use(contextStorage())
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

  getContext<{
    Bindings: { KV: KVNamespace }
  }>().env.KV.put('keyPair', JSON.stringify(keyPair))

  return context.json(Key.toRpc(key))
})

/**
 * Authorized key notification
 */
app.post('/authorized-key', async (context) => {
  const payload = await context.req.json<{}>()

  const porto = Porto.create()
  const {
    signPayload,
    // Filled context for the `wallet_sendCalls` JSON-RPC method.
    context: portoContext,
  } = await porto.provider.request({
    method: 'experimental_prepareCalls',
    params: [
      {
        calls: [],
        capabilities: {},
        chainId: '0x1',
        from: '0x0',
        version: '1',
      },
    ] as any,
  })

  const keyPairString = await getContext<{
    Bindings: { KV: KVNamespace }
  }>().env.KV.get('keyPair')
  const keyPair = Json.parse(keyPairString ?? '{}') as Key.Key

  const signature = Key.sign(keyPair, { payload: signPayload })

  const hash = await porto.provider.request({
    method: 'wallet_sendCalls',
    params: [
      {
        //@ts-ignore
        ...portoContext,
        capabilities: {
          // @ts-ignore
          ...portoContext.capabilities,
          prepareCalls: {
            // @ts-ignore
            ...portoContext.capabilities.prepareCalls,
            signature,
          },
        },
      },
    ],
  })

  return context.json({ error: 'Not implemented' })
})

showRoutes(app)

const runtimeKey = getRuntimeKey()

if (runtimeKey !== 'workerd')
  console.info(`Running on http://localhost:${process.env.PORT}`)

export default app
