import type { Address } from 'ox'
import { Chains, Mode, Porto, Storage } from 'porto'
import { custom, http, type Transport } from 'viem'

import * as Porto_internal from '../../src/core/internal/porto.js'
import * as Contracts from './_generated/contracts.js'
import * as Anvil from './anvil.js'
import * as Relay from './relay.js'

export const chain = Anvil.enabled
  ? Chains.odysseyTestnet
  : Chains.odysseyDevnet

export const exp1Address = Contracts.exp1Address[chain.id]
export const exp1Abi = Contracts.exp1Abi
export const exp1Config = {
  abi: exp1Abi,
  address: exp1Address,
} as const

export const exp2Address = Contracts.exp2Address[chain.id]
export const exp2Abi = Contracts.exp2Abi
export const exp2Config = {
  abi: exp2Abi,
  address: exp2Address,
} as const

export function getPorto(
  parameters: {
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
  const { mode = Mode.contract, transports = {} } = parameters
  const porto = Porto.create({
    chains: [chain],
    mode: mode({
      feeToken: {
        [chain.id]: exp1Address,
      },
      mock: true,
    }),
    storage: Storage.memory(),
    transports: {
      [chain.id]: {
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
                {
                  // async onFetchRequest(_, init) {
                  //   console.log('request:', init.body)
                  // },
                  // async onFetchResponse(response) {
                  //   console.log('response:', await response.clone().json())
                  // },
                },
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
