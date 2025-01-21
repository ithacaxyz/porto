import { signMessage } from '@wagmi/core'
import { odysseyTestnet } from '@wagmi/core/chains'
import { Chains, Implementation, Key, Porto, Storage } from 'Porto'
import { Hono } from 'hono'
import { env, getRuntimeKey } from 'hono/adapter'
import { contextStorage, getContext } from 'hono/context-storage'
import { cors } from 'hono/cors'
import { showRoutes } from 'hono/dev'
import { logger } from 'hono/logger'
import { Address, Json, type RpcSchema, WebCryptoP256 } from 'ox'
import type { Wallet } from 'ox/RpcSchema'

type WalletSendCallsParams = RpcSchema.ExtractRequest<
  Wallet,
  'wallet_sendCalls'
>['params'][number]

type Calls = Omit<WalletSendCallsParams['calls'][number], 'value'> & {
  value?: bigint | undefined
}

type SendCallsContext = WalletSendCallsParams
//  Omit<WalletSendCallsParams, 'calls'> & {
//   calls: Calls[]
// }

const app = new Hono<Env>()

app.use('*', logger())
app.use(contextStorage())
app.use('*', cors({ origin: '*', allowMethods: ['GET', 'HEAD', 'OPTIONS'] }))

app.use(async (context, next) => {
  context.set('KEY_PAIR', 'test')
  await next()
})

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

  context.set('KEY_PAIR', Json.stringify(keyPair))

  // getContext<{
  //   Bindings: { KV: KVNamespace }
  // }>().env.KV.put('keyPair', JSON.stringify(keyPair))

  return context.json(Key.toRpc(key))
})

/**
 * once the app client authorizes the key,
 * it will call this endpoint to notify the server
 */
app.post('/authorize-status', async (context) => {
  const payload = await context.req.json<{}>()
  console.info(JSON.stringify(payload, undefined, 2))
  // const keyPairString = await getContext<{
  //   Bindings: { KV: KVNamespace }
  // }>().env.KV.get('keyPair')
  // const keyPair = Json.parse(keyPairString ?? '{}') as Key.Key
  // const keyPairString = context.get('KEY_PAIR') as Key.Key
  // console.info()
  console.info('key pairs')
  const keyPair = context.get('KEY_PAIR')
  console.info(JSON.stringify({ keyPair }, undefined, 2))
  const keyPairString = {}

  const porto = Porto.create({
    chains: [Chains.odysseyTestnet],
    storage: Storage.localStorage(),
    implementation: Implementation.local(),
  })

  const {
    signPayload,
    // Filled context for the `wallet_sendCalls` JSON-RPC method.
    context: _portoContext,
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
  const portoContext = _portoContext as SendCallsContext

  const signature = Key.sign(Json.parse(keyPair), { payload: signPayload })

  const preparedCalls = portoContext?.capabilities?.['prepareCalls']

  const hash = await porto.provider.request({
    method: 'wallet_sendCalls',
    params: [
      {
        ...portoContext,
        capabilities: {
          ...portoContext.capabilities,
          prepareCalls: {
            ...preparedCalls,
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
