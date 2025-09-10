import { RpcTransport } from 'ox'
import { createServer } from 'prool'

import * as Chains from '../../src/core/Chains.js'
import {
  accountNewProxyAddress,
  accountProxyAddress,
  escrowAddress,
  funderAddress,
  orchestratorAddress,
  simulatorAddress,
} from './_generated/addresses.js'
import { exp1Address, exp2Address } from './_generated/contracts.js'
import * as Anvil from './anvil.js'
import { poolId, relay } from './prool.js'

const defaultConfig = {
  delegationProxy: accountProxyAddress,
  escrow: escrowAddress,
  funder: funderAddress,
  funderOwnerKey: Anvil.account.relay.privateKey,
  funderSigningKey: Anvil.account.relay.privateKey,
  intentGasBuffer: 100_000n,
  orchestrator: orchestratorAddress,
  simulator: simulatorAddress,
  txGasBuffer: 100_000n,
} satisfies Partial<Parameters<typeof defineRelay>[0]>

export const instances = {
  anvil: defineRelay({
    ...defaultConfig,
    endpoint: (key) => `http://127.0.0.1:${Anvil.instances.anvil.port}/${key}`,
    feeTokens: [
      '0x0000000000000000000000000000000000000000',
      exp1Address[Chains.anvil.id],
      exp2Address[Chains.anvil.id],
    ],
    interopToken: exp1Address[Chains.anvil.id],
  }),
  anvil_newAccount: defineRelay({
    ...defaultConfig,
    delegationProxy: accountNewProxyAddress,
    endpoint: (key) => `http://127.0.0.1:${Anvil.instances.anvil.port}/${key}`,
    feeTokens: [
      '0x0000000000000000000000000000000000000000',
      exp1Address[Chains.anvil.id],
    ],
    interopToken: exp1Address[Chains.anvil.id],
    legacyDelegationProxy: accountProxyAddress,
    port: 9120,
  }),
} as const

/////////////////////////////////////////////////////////////////
// Utilities
/////////////////////////////////////////////////////////////////

function defineRelay(parameters: {
  endpoint: (key: number) => string
  delegationProxy: string
  escrow: string
  feeTokens: string[]
  funderSigningKey: string
  funderOwnerKey: string
  funder: string
  interopToken: string
  image?: string | undefined
  intentGasBuffer?: bigint | undefined
  legacyDelegationProxy?: string
  orchestrator: string
  simulator: string
  txGasBuffer?: bigint | undefined
  version?: string | undefined
  port?: number | undefined
}) {
  const { endpoint, port = 9119, ...rest } = parameters
  const rpcUrl = `http://127.0.0.1:${port}/${poolId}`

  const transport = RpcTransport.fromHttp(rpcUrl)

  return {
    request: transport.request,
    async restart() {
      await fetch(`${rpcUrl}/restart`)
    },
    rpcUrl,
    async start() {
      return await createServer({
        instance: (key) =>
          relay({
            ...rest,
            endpoint: endpoint(key),
            http: {
              port,
            },
            version: 'v24.0.2',
          }),
        port,
      }).start()
    },
  }
}
