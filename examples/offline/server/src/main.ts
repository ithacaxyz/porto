import { Key, Porto } from 'Porto'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { showRoutes } from 'hono/dev'
import { prettyJSON } from 'hono/pretty-json'
import { Address, Json } from 'ox'
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
  const payload = await context.req.json<{
    address: Address.Address
    permissions: Key.Permissions
  }>()

  const isAddress = Address.validate(payload.address)
  if (!isAddress) return context.json({ error: 'Invalid address' }, 400)

  const key = Key.createP256({
    role: 'session',
    permissions: payload.permissions,
    expiry: Math.floor(Date.now() / 1_000) + 4 * 60, // 3 minutes
  })

  const toRpc = Key.toRpc(key)

  context.executionCtx.waitUntil(
    /**
     * NOTE: this is not secure. In production, you should encrypt any sensitive data before storing it.
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

/**
 * once the app client authorizes the key,
 * it will call this endpoint to notify the server (WIP)
 */
app.post('/schedule', async (context) => {
  const action = context.req.query('action')
  const schedule = context.req.query('schedule')?.replaceAll('+', ' ')

  if (!action || !actions.includes(action)) {
    return context.json({ error: 'Invalid action' }, 400)
  }

  const { address } = await context.req.json<{ address: Address.Address }>()
  if (!address) return context.json({ error: 'Invalid address' }, 400)

  const porto = Porto.create()

  const storedKey = await context.env.KEYS_01.get(address.toLowerCase())
  if (!storedKey) throw new Error('Key not found')
  const { privateKey, account, ...key } = Json.parse(storedKey)

  const calls = buildActionCall({ action, account })

  const insertSchedule = await context.env.DB.prepare(
    /* sql */ `
    INSERT INTO schedules (
      address,
      schedule,
      action,
      calls
    ) VALUES (?, ?, ?, ?)`,
  )
    .bind(
      //
      address.toLowerCase(),
      schedule,
      action,
      Json.stringify(calls),
    )
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
