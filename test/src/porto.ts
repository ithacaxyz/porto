import { Chains, Implementation, Porto, Storage } from 'porto'
import { http, type Transport, custom, defineChain } from 'viem'

import { type Chain, odysseyTestnet } from '../../src/core/Chains.js'
import { anvilOdyssey } from './anvil.js'
import { relayOdyssey } from './relay.js'

export const defaultChain = defineChain({
  ...odysseyTestnet,
  contracts: {
    ...odysseyTestnet.contracts,
    entryPoint: {
      address: '0x307AF7d28AfEE82092aA95D35644898311CA5360',
    },
  },
  rpcUrls: {
    default: { http: [anvilOdyssey.rpcUrl] },
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
        default: transports.default ?? custom(anvilOdyssey),
        relay: transports.relay
          ? transports.relay === true
            ? http(relayOdyssey.rpcUrl)
            : transports.relay
          : undefined,
      },
    },
  })

  const client = Porto.getClient(porto).extend(() => ({
    mode: 'anvil',
  }))

  const delegation = client.chain.contracts.delegation.address

  return { client, delegation, porto }
}
