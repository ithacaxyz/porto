import { afterAll, vi } from 'vitest'
import * as instances from './src/anvil.js'

afterAll(async () => {
  vi.restoreAllMocks()

  // Reset the anvil instances to the same state it was in before the tests started.
  await Promise.all(
    Object.values(instances).map((instance) => instance.restart()),
  )
})
