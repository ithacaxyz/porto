import { afterAll, beforeAll, vi } from 'vitest'

import * as Chains from '../src/core/Chains.js'
import * as Anvil from './src/anvil.js'
import * as Relay from './src/relay.js'

beforeAll(async () => {
  await Promise.all(
    Object.values(Anvil.instances).map(async (instance) => {
      await fetch(`${instance.rpcUrl}/start`)

      const chain = Object.values(Chains).find(
        (x) => 'rpcUrls' in x && x.id === instance.config.chainId,
      ) as Chains.Chain
      if (!chain) throw new Error('Chain not found')

      await Anvil.loadState({
        accountRegistryAddress: chain.contracts.accountRegistry!.address,
        delegationAddress: chain.contracts.delegation!.address,
        entryPointAddress: chain.contracts.entryPoint!.address,
        rpcUrl: instance.rpcUrl,
      })
    }),
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
