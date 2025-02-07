import { Chains, Porto } from 'Porto'
import { Hex, Json, P256, Signature } from 'ox'

export interface Schedule {
  id: number
  created_at: string
  address: string
  schedule: string
  action: string
  calls: string
}

export async function scheduledTask(
  event: ScheduledController,
  env: Env,
  context: ExecutionContext,
): Promise<void> {
  console.info('cron started', event.scheduledTime)

  const porto = Porto.create()

  const schedulesQuery = await env.DB.prepare(
    /* sql */ `SELECT * FROM schedules;`,
  ).all<Schedule>()

  if (!schedulesQuery.success) return console.error(schedulesQuery.error)

  const statements: Array<D1PreparedStatement> = []

  for (const scheduleTask of schedulesQuery.results) {
    try {
      const { id, address, schedule, action, calls } = scheduleTask

      if (schedule !== '* * * * *') {
        // we're only handling 'once every minute' schedules for now
        console.info('skipping schedule', schedule)
        continue
      }

      const storedKey = await env.KEYS_01.get(address.toLowerCase())
      if (!storedKey) continue

      const { privateKey, account, ...key } = Json.parse(storedKey)

      if (key.expiry < Math.floor(Date.now() / 1_000)) {
        console.info('key expired', key.expiry)
        const deleteQuery = await env.DB.prepare(
          /* sql */ `DELETE FROM schedules WHERE id = ?;`,
        )
          .bind(id)
          .run()
        if (!deleteQuery.success) return console.error(deleteQuery.error)
        continue
      }

      const { digest, ...request } = await porto.provider.request({
        method: 'wallet_prepareCalls',
        params: [
          {
            calls: Json.parse(calls),
            version: '1',
            from: account,
            chainId: Hex.fromNumber(Chains.odysseyTestnet.id),
          },
        ],
      })

      const signature = Signature.toHex(
        P256.sign({
          payload: digest,
          privateKey,
        }),
      )

      const [hash] = await porto.provider.request({
        method: 'wallet_sendPreparedCalls',
        params: [
          {
            ...request,
            signature: {
              publicKey: key.publicKey,
              type: 'p256',
              value: signature,
            },
          },
        ],
      })

      const statement = env.DB.prepare(
        /* sql */ `INSERT INTO transactions (address, hash, role, public_key) VALUES (?, ?, ?, ?)`,
      ).bind(address.toLowerCase(), hash, key.role, key.publicKey)

      statements.push(statement)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error
      console.error(errorMessage)
    }
  }

  if (statements.length) {
    const batchResult = await env.DB.batch(statements)

    batchResult.map((item) => {
      console.info(`success: ${item.success}`)
      console.table(item.results)
    })
  }

  console.info('cron processed', event.scheduledTime)
}
