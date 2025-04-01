import type { Address } from 'ox'
import { Chains, Mode, Porto, Storage } from 'porto'
import { custom, defineChain, http, type Transport } from 'viem'

import { type Chain, odysseyTestnet } from '../../src/core/Chains.js'
import * as Porto_internal from '../../src/core/internal/porto.js'
import { exp1Address } from './_generated/contracts.js'
import * as Anvil from './anvil.js'
import * as Relay from './relay.js'

export const defaultChain = defineChain({
  ...odysseyTestnet,
  ...(process.env.VITE_ANVIL !== 'false' && {
    rpcUrls: {
      default: { http: [Anvil.instances.odyssey.rpcUrl] },
    },
  }),
})

export function getPorto(
  parameters: {
    chain?: Chain | undefined
    mode?: (parameters: {
      feeToken?: Record<number, Address.Address> | undefined
      mock: boolean
    }) => Mode.Mode | undefined
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
    mode = Mode.contract,
    transports = {},
  } = parameters
  const porto = Porto.create({
    chains: [chain],
    mode: mode({
      feeToken: {
        [Chains.odysseyTestnet.id]: exp1Address,
      },
      mock: true,
    }),
    storage: Storage.memory(),
    transports: {
      [Chains.odysseyTestnet.id]: {
        default:
          transports.default ??
          (process.env.VITE_ANVIL !== 'false'
            ? custom(Anvil.instances.odyssey)
            : http()),
        relay: transports.relay
          ? transports.relay === true
            ? http(
                process.env.VITE_ANVIL !== 'false'
                  ? Relay.instances.odyssey.rpcUrl
                  : 'https://relay-staging.ithaca.xyz',
                {
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
                },
              )
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
