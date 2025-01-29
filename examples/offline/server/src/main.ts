import { Account, Chains, Key, Porto } from 'Porto'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { showRoutes } from 'hono/dev'
import { AbiFunction, Address, Hex, Json, Value } from 'ox'
import { ExperimentERC20 } from 'src/contracts.ts'

const app = new Hono<Env>()

app.use('*', cors({ origin: '*', allowMethods: ['GET', 'HEAD', 'OPTIONS'] }))

app.onError((error, context) => {
  console.info(error)
  return context.json({ error: error.message }, 500)
})

/**
 * Debug stored keys
 * If `address` is provided, returns the value of the key, otherwise list all keys
 */
app.get('/debug', async (context) => {
  const address = context.req.query('address')
  if (!address) {
    const keys = await context.env.KEYS_01.list()
    return context.json(keys)
  }

  const key = await context.env.KEYS_01.get(address.toLowerCase())
  if (!key) return context.json({ error: 'Key not found' }, 404)
  return context.json(Json.parse(key))
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

  const key = Key.createP256({
    role: 'session',
    permissions: payload.permissions,
    expiry: Math.floor(Date.now() / 1_000) + 3_600,
  })

  const toRpc = Key.toRpc(key)

  context.executionCtx.waitUntil(
    /**
     * NOTE: this is not secure. In production, you should encrypt the private key.
     * See https://oxlib.sh/api/AesGcm
     */
    context.env.KEYS_01.put(
      payload.address.toLowerCase(),
      JSON.stringify({
        ...toRpc,
        privateKey: key.privateKey(),
        account: payload.address.toLowerCase(),
      }),
    ),
  )

  return context.json(toRpc)
})

const actions = ['mint', 'approve-transfer']

/**
 * once the app client authorizes the key,
 * it will call this endpoint to notify the server (WIP)
 */
app.post('/demo', async (context) => {
  const action = context.req.query('action')
  const payload = await context.req.json<{ address: Address.Address }>()

  if (!action || !actions.includes(action)) {
    return context.json({ error: 'Invalid action' }, 400)
  }

  const porto = Porto.create()

  const storedKey = await context.env.KEYS_01.get(payload.address.toLowerCase())

  if (!storedKey) throw new Error('Key not found')

  const { privateKey, account, ...key } = Json.parse(storedKey)

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
            [account, Value.fromEther('3')],
          ),
        },
        {
          to: ExperimentERC20.address,
          data: AbiFunction.encodeData(
            AbiFunction.fromAbi(ExperimentERC20.abi, 'transfer'),
            [
              '0x0000000000000000000000000000000000000000',
              Value.fromEther('1'),
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
    version: '1',
    from: account,
    chainId: Hex.fromNumber(Chains.odysseyTestnet.id),
  } as const

  const {
    signPayload,
    // Filled context for the `wallet_sendCalls` JSON-RPC method.
    ...request
  } = await porto.provider.request({
    method: 'wallet_prepareCalls',
    params: [prepareCallsParams],
  })

  const p256Key = Key.fromP256({ ...key, privateKey })

  const signature = await Key.sign(Key.from(p256Key), {
    address: account,
    payload: signPayload,
  })

  const [hash] = await porto.provider.request({
    method: 'wallet_sendPreparedCalls',
    params: [
      {
        ...request,
        signature,
      },
    ],
  })

  return context.text(hash ?? '')
})

showRoutes(app)
async function scheduledTask(
  env: Env,
  context: ExecutionContext,
): Promise<void> {
  /* TODO */
}

export default {
  fetch: app.fetch,
  scheduled: async (controller, env, context): Promise<void> => {
    context.waitUntil(scheduledTask(env, context))
  },
} satisfies ExportedHandler<Env>
