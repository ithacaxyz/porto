import { Chains, Key, Porto } from 'Porto'
import { Hono } from 'hono'
import { env, getRuntimeKey } from 'hono/adapter'
import { contextStorage } from 'hono/context-storage'
import { cors } from 'hono/cors'
import { showRoutes } from 'hono/dev'
import { AbiFunction, Address, Hex, P256, type RpcSchema, Value } from 'ox'
import type { Wallet } from 'ox/RpcSchema'
import { ExperimentERC20 } from 'src/contracts.ts'

type WalletSendCallsParams = RpcSchema.ExtractRequest<
  Wallet,
  'wallet_sendCalls'
>['params'][number]

type SendCallsContext = WalletSendCallsParams

const app = new Hono<Env>()

app.use(contextStorage())
app.use('*', cors({ origin: '*', allowMethods: ['GET', 'HEAD', 'OPTIONS'] }))

app.use(async (context, next) => {
  context.set('KEY_PAIR', context.get('KEY_PAIR'))
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

/**
 * Returns existing keys
 */
app.get('/keys', async (context) => context.json({ error: 'Not implemented' }))

/**
 * Creates new keys
 */
app.post('/keys', async (context) => {
  const payload = await context.req.json<{
    address: Address.Address
    permissions: Key.Permissions
  }>()

  const isAddress = Address.validate(payload.address)
  if (!isAddress) return context.json({ error: 'Invalid address' }, 400)

  const privateKey = P256.randomPrivateKey()

  const key = Key.fromP256({
    privateKey,
    role: 'admin',
    expiry: 1714857600,
    permissions: payload.permissions,
  })
  console.info(key.privateKey)
  return context.json({ key: Key.toRpc(key), privateKey: key.privateKey() })
})

/**
 * once the app client authorizes the key,
 * it will call this endpoint to notify the server (WIP)
 */
app.post('/authorize-status', async (context) => {
  const payload = await context.req.json<{
    address: Address.Address
    authorizeKeys: Key.Key
    privateKey: Hex.Hex // tmp
  }>()

  const porto = Porto.create({
    chains: [Chains.odysseyTestnet],
  })

  const action = 'mint'
  const account = payload.address

  const calls = (() => {
    if (action === 'mint')
      return [
        {
          to: ExperimentERC20.address,
          data: AbiFunction.encodeData(
            AbiFunction.fromAbi(ExperimentERC20.abi, 'mint'),
            [account, Value.fromEther('100')],
          ),
        },
      ]

    if (action === 'approve-transfer')
      return [
        {
          to: ExperimentERC20.address,
          data: AbiFunction.encodeData(
            AbiFunction.fromAbi(ExperimentERC20.abi, 'approve'),
            [account, Value.fromEther('50')],
          ),
        },
        {
          to: ExperimentERC20.address,
          data: AbiFunction.encodeData(
            AbiFunction.fromAbi(ExperimentERC20.abi, 'transferFrom'),
            [
              account,
              '0x0000000000000000000000000000000000000000',
              Value.fromEther('50'),
            ],
          ),
        },
      ] as const

    return [
      {
        to: '0x0000000000000000000000000000000000000000',
        value: '0x0',
      },
      {
        to: '0x0000000000000000000000000000000000000000',
        value: '0x0',
      },
    ] as const
  })()

  const prepareCallsParams = {
    calls,
    chainId: Hex.fromNumber(Chains.odysseyTestnet.id),
    from: payload.address,
    version: '1',
  } as const

  const {
    signPayload,
    // Filled context for the `wallet_sendCalls` JSON-RPC method.
    context: _portoContext,
  } = await porto.provider.request({
    method: 'experimental_prepareCalls',
    params: [prepareCallsParams],
  })

  const portoContext = _portoContext as SendCallsContext

  const signature = await Key.sign(
    Key.fromP256({
      privateKey: payload.privateKey,
      role: payload.authorizeKeys.role,
      expiry: payload.authorizeKeys.expiry,
      permissions: payload.authorizeKeys.permissions,
    }),
    {
      address: payload.address,
      payload: signPayload,
    },
  )

  const hash = await porto.provider.request({
    method: 'wallet_sendCalls',
    params: [
      {
        ...portoContext,
        capabilities: {
          ...portoContext.capabilities,
          prepareCalls: {
            ...portoContext.capabilities?.['prepareCalls'],
            signature,
          },
        },
        from: payload.address,
      },
    ],
  })

  return context.json({ hash })
})

showRoutes(app)

const runtimeKey = getRuntimeKey()

if (runtimeKey !== 'workerd')
  console.info(`Running on http://localhost:${process.env.PORT}`)

export default app
