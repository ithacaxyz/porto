import { afterAll, beforeAll, vi } from 'vitest'
import { createClient, http } from 'viem'
import { deployContract } from 'viem/actions'

import * as Anvil from './src/anvil.js'
import * as Relay from './src/relay.js'

beforeAll(async () => {
  await Promise.all(
    [...Object.values(Anvil.instances), ...Object.values(Relay.instances)].map(
      async (instance) => {
        await fetch(`${instance.rpcUrl}/start`)
      },
    ),
  )

  await Promise.all(
    Object.values(Anvil.instances).map(async (instance) => {
      const client = createClient({
        transport: http(instance.rpcUrl),
      })

      deployContract
    }),
  )
})

afterAll(async () => {
  vi.restoreAllMocks()
})
