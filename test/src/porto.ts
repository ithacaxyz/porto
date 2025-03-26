import type { Address } from 'ox'
import { Chains, Implementation, Porto, Storage } from 'porto'
import { http, type Transport, custom, defineChain } from 'viem'

import { type Chain, odysseyTestnet } from '../../src/core/Chains.js'
import * as Porto_internal from '../../src/core/internal/porto.js'
import { exp1Address } from './_generated/contracts.js'
import * as Anvil from './anvil.js'
import * as Relay from './relay.js'

export const defaultChain = defineChain({
  ...odysseyTestnet,
  rpcUrls: {
    default: { http: [Anvil.instances.odyssey.rpcUrl] },
  },
})

export function getPorto(
  parameters: {
    chain?: Chain | undefined
    implementation?: (parameters: {
      feeToken?: Address.Address | undefined
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
      feeToken: exp1Address,
      mock: true,
    }),
    storage: Storage.memory(),
    transports: {
      [Chains.odysseyTestnet.id]: {
        default: transports.default ?? custom(Anvil.instances.odyssey),
        relay: transports.relay
          ? transports.relay === true
            ? http(Relay.instances.odyssey.rpcUrl, {
                // async onFetchRequest(request, init) {
                //   console.log(
                //     JSON.stringify(JSON.parse(await init.body), null, 2),
                //   )
                // },
                // async onFetchResponse(response, init) {
                //   console.log(
                //     JSON.stringify(await response.clone().json(), null, 2),
                //   )
                // },
              })
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
