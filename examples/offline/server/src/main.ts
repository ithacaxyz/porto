import { Account, Chains, Key, Porto } from 'Porto'
import { Hono } from 'hono'
import { getRuntimeKey } from 'hono/adapter'
import { contextStorage, getContext } from 'hono/context-storage'
import { cors } from 'hono/cors'
import { showRoutes } from 'hono/dev'
import {
  AbiFunction,
  Address,
  AesGcm,
  Authorization,
  Hex,
  Json,
  P256,
  type RpcSchema,
  Value,
  WebCryptoP256,
} from 'ox'
import type { Wallet } from 'ox/RpcSchema'
import { ExperimentERC20 } from 'src/contracts.ts'

type SendCallsContext = RpcSchema.ExtractRequest<
  Wallet,
  'wallet_sendCalls'
>['params'][number]

const app = new Hono<Env>()
app.use(contextStorage())
app.use('*', cors({ origin: '*', allowMethods: ['GET', 'HEAD', 'OPTIONS'] }))
app.onError((error, context) => {
  console.info(error)
  return context.json({ error: error.message }, 500)
})

const setKV = (value: string) => {
  return getContext<Env>().env.KEYS_01.put('key', value)
}

const getKV = () => {
  return getContext<Env>().env.KEYS_01.get('key')
}

app.use(async (c, next) => {
  const url = c.req.url
  // console.info(url)
  // console.info()
  // c.set('KEY', 'Hello!')
  await next()
})

/**
 * Returns existing keys
 */
app.get('/keys', async (context) => {
  const value = await context.env.KEYS_01.get('key')
  if (!value) return context.json([])
  const { privateKey, ...key } = Json.parse(value)
  return context.json({ key, privateKey })
})

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

  const privateKey = P256.randomPrivateKey({ as: 'Hex' })
  const key = Key.fromP256({
    privateKey,
    role: 'session',
    expiry: 1714857600,
    permissions: payload.permissions,
  })

  const toRpc = Key.toRpc(key)

  context.env.KEYS_01.put(
    'key',
    JSON.stringify({ ...toRpc, privateKey: key.privateKey() }),
  )

  return context.json(toRpc)
})

/**
 * once the app client authorizes the key,
 * it will call this endpoint to notify the server (WIP)
 */
app.post('/authorize-status', async (context) => {
  const payload = await context.req.json<{ address: Address.Address }>()

  const porto = Porto.create()

  const action = 'mint'
  const account = payload.address

  const calls = (() => {
    if (action === 'mint')
      return [
        {
          to: ExperimentERC20.address,
          data: AbiFunction.encodeData(
            AbiFunction.fromAbi(ExperimentERC20.abi, 'mint'),
            [account, Value.fromEther('10')],
          ),
        },
      ]

    if (action === 'approve-transfer')
      return [
        {
          to: ExperimentERC20.address,
          data: AbiFunction.encodeData(
            AbiFunction.fromAbi(ExperimentERC20.abi, 'approve'),
            [account, Value.fromEther('5')],
          ),
        },
        {
          to: ExperimentERC20.address,
          data: AbiFunction.encodeData(
            AbiFunction.fromAbi(ExperimentERC20.abi, 'transferFrom'),
            [
              account,
              '0x0000000000000000000000000000000000000000',
              Value.fromEther('5'),
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
    ...request
  } = await porto.provider.request({
    method: 'wallet_prepareCalls',
    params: [prepareCallsParams],
  })
  console.info(request)

  const storedKey = await context.env.KEYS_01.get('key')
  if (!storedKey) throw new Error('Key not found')

  const { privateKey, ...key } = Json.parse(storedKey)
  const p256Key = Key.fromP256({ ...key, privateKey })

  // const signature = P256.sign({
  //   payload: signPayload,
  //   privateKey: p256Key.privateKey(),
  // })

  const signature = await Key.sign(Key.from({ ...p256Key, type: 'p256' }), {
    address: payload.address,
    payload: signPayload,
  })

  // const hash = await porto.provider.request({
  //   method: 'wallet_sendCalls',
  //   params: [
  //     {
  //       ...portoContext,
  //       capabilities: {
  //         ...portoContext.capabilities,
  //         prepareCalls: {
  //           ...portoContext.capabilities?.['prepareCalls'],
  //           signature,
  //         },
  //       },
  //       chainId: Hex.fromNumber(Chains.odysseyTestnet.id),
  //       from: Account.from({ address: payload.address }).address,
  //     },
  //   ],
  // })

  const hash = await porto.provider.request({
    method: 'wallet_sendPreparedCalls',
    params: [
      {
        ...request,
        signature,
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
