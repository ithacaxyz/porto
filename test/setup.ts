import { afterAll, beforeAll, vi } from 'vitest'

import * as anvilInstances from './src/anvil.js'
import * as relayInstances from './src/relay.js'

beforeAll(async () => {
  await Promise.all(
    [...Object.values(anvilInstances), ...Object.values(relayInstances)].map(
      async (instance) => {
        await fetch(`${instance.rpcUrl}/start`)
      },
    ),
  )
})

afterAll(async () => {
  vi.restoreAllMocks()
})
