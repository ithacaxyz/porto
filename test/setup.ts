import { afterAll, beforeAll, vi } from 'vitest'

import * as Anvil from './src/anvil.js'
import * as Relay from './src/relay.js'

beforeAll(async () => {
  await Promise.all(
    Object.values(Anvil.instances).map((instance) =>
      fetch(`${instance.rpcUrl}/start`),
    ),
  )
  await Promise.all(
    Object.values(Relay.instances).map((instance) =>
      fetch(`${instance.rpcUrl}/start`),
    ),
  )
})

afterAll(async () => {
  vi.restoreAllMocks()
})
