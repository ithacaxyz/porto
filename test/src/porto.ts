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
  ...(Anvil.enabled && {
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
          relay?: false | Transport | undefined
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
          (Anvil.enabled ? custom(Anvil.instances.odyssey) : http()),
        relay:
          transports.relay === false
            ? undefined
            : (transports.relay ??
              http(
                Anvil.enabled
                  ? Relay.instances.odyssey.rpcUrl
                  : 'https://relay-staging.ithaca.xyz',
              )),
      },
    },
  })

  const client = Porto_internal.getClient(porto).extend(() => ({
    mode: 'anvil',
  }))

  const delegation = client.chain.contracts.delegation.address

  return { client, delegation, porto }
}
