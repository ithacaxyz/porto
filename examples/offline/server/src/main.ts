import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { showRoutes } from 'hono/dev'
import { prettyJSON } from 'hono/pretty-json'
import { Address, Json, P256, PublicKey, type RpcSchema, Signature } from 'ox'
import type { RpcSchema as RpcSchema_porto } from 'porto'
import { actions, buildActionCall } from './calls.ts'
import { scheduledTask } from './scheduled.ts'

const app = new Hono<{ Bindings: Env }>()

app.use(prettyJSON({ space: 2 }))
app.use(
  '*',
  cors({ origin: '*', allowMethods: ['GET', 'HEAD', 'OPTIONS', 'POST'] }),
)

app.get('/', (context) => context.text('gm'))

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
    const statements = [
      context.env.DB.prepare(`SELECT * FROM transactions;`),
      context.env.DB.prepare(`SELECT * FROM schedules;`),
    ]
    const [transactions, schedules] = await context.env.DB.batch(statements)
    return context.json({
      transactions: transactions?.results,
      schedules: schedules?.results,
      keys,
    })
  }

  const key = await context.env.KEYS_01.get(address.toLowerCase())
  if (!key) return context.json({ error: 'Key not found' }, 200)

  const _address = address.toLowerCase()
  const statements = [
    context.env.DB.prepare(`SELECT * FROM transactions WHERE address = ?`).bind(
      _address,
    ),
    context.env.DB.prepare(`SELECT * FROM schedules WHERE address = ?`).bind(
      _address,
    ),
  ]
  const [transactions, schedules] = await context.env.DB.batch(statements)
  return context.json({
    transactions: transactions?.results,
    schedules: schedules?.results,
    key: Json.parse(key),
  })
})

/**
 * Creates new keys
 */
app.post('/keys', async (context) => {
  type Permissions = RpcSchema.ExtractParams<
    RpcSchema_porto.Schema,
    'experimental_grantPermissions'
  >[0]['permissions']
  const payload = await context.req.json<{
    address: Address.Address
    permissions: Permissions
  }>()

  const isAddress = Address.validate(payload.address)
  if (!isAddress) return context.json({ error: 'Invalid address' }, 400)

  const privateKey = P256.randomPrivateKey()
  const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
    includePrefix: false,
  })

  const result = {
    expiry: Math.floor(Date.now() / 1_000) + 4 * 60, // 3 minutes
    permissions: payload.permissions,
    key: {
      publicKey,
      type: 'p256',
    },
  } satisfies RpcSchema.ExtractParams<
    RpcSchema_porto.Schema,
    'experimental_grantPermissions'
  >[0]

  context.executionCtx.waitUntil(
    context.env.KEYS_01.put(
      payload.address.toLowerCase(),
      JSON.stringify({
        ...result,
        account: payload.address.toLowerCase(),
        /**
         * NOTE: this is not secure. In production, you should encrypt any sensitive data before storing it.
         * See https://oxlib.sh/api/AesGcm
         */
        privateKey,
        publicKey,
      }),
    ),
  )

  return context.json(result)
})

/**
 * Schedules transactions to be executed at a later time
 * The transaction are sent by the key owner
 */
app.post('/schedule', async (context) => {
  const action = context.req.query('action')
  const schedule = context.req.query('schedule')?.replaceAll('+', ' ')

  if (!action || !actions.includes(action)) {
    return context.json({ error: 'Invalid action' }, 400)
  }

  const { address } = await context.req.json<{ address: Address.Address }>()
  if (!address) return context.json({ error: 'Invalid address' }, 400)

  const storedKey = await context.env.KEYS_01.get(address.toLowerCase())
  if (!storedKey) throw new Error('Key not found')
  const { privateKey, account, ...key } = Json.parse(storedKey)

  const calls = buildActionCall({ action, account })

  const insertSchedule = await context.env.DB.prepare(
    /* sql */ `
    INSERT INTO schedules ( address, schedule, action, calls ) VALUES ( ?, ?, ?, ? )`,
  )
    .bind(address.toLowerCase(), schedule, action, Json.stringify(calls))
    .all()

  if (!insertSchedule.success) {
    return context.json({ error: insertSchedule.error }, 500)
  }

  return context.json(insertSchedule)
})

showRoutes(app)

export default {
  fetch: app.fetch,
  scheduled: async (event, env, context): Promise<void> => {
    context.waitUntil(scheduledTask(event, env, context))
  },
} satisfies ExportedHandler<Env>
