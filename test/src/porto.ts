import { Chains, Implementation, Porto, Storage } from 'porto'
import { http, type Transport, custom, defineChain } from 'viem'

import { type Chain, odysseyTestnet } from '../../src/core/Chains.js'
import * as Porto_internal from '../../src/core/internal/porto.js'
import * as Anvil from './anvil.js'
import * as Relay from './relay.js'

export const defaultChain = defineChain({
  ...odysseyTestnet,
  contracts: {
    ...odysseyTestnet.contracts,
    entryPoint: {
      address: '0x307AF7d28AfEE82092aA95D35644898311CA5360',
    },
  },
  rpcUrls: {
    default: { http: [Anvil.instances.odyssey.rpcUrl] },
  },
})

export function getPorto(
  parameters: {
    chain?: Chain | undefined
    implementation?: (parameters: {
      mock: boolean
    }) => Implementation.Implementation | undefined
    transports?:
      | {
          default?: Transport | undefined
          relay?: boolean | Transport | undefined
        }
      | undefined
  } = {},
) {
  const {
    chain = defaultChain,
    implementation = Implementation.local,
    transports = {},
  } = parameters
  const porto = Porto.create({
    chains: [chain],
    implementation: implementation({
      mock: true,
    }),
    storage: Storage.memory(),
    transports: {
      [Chains.odysseyTestnet.id]: {
        default: transports.default ?? custom(Anvil.instances.odyssey),
        relay: transports.relay
          ? transports.relay === true
            ? http(Relay.instances.odyssey.rpcUrl)
            : transports.relay
          : undefined,
      },
    },
  })

  const client = Porto_internal.getClient(porto).extend(() => ({
    mode: 'anvil',
  }))

  const delegation = client.chain.contracts.delegation.address

  return { client, delegation, porto }
}
