import { RpcTransport } from 'ox'
import { createServer } from 'prool'

import * as Chains from '../../src/core/Chains.js'
import {
  accountNewProxyAddress,
  accountProxyAddress,
  orchestratorAddress,
  simulatorAddress,
} from './_generated/addresses.js'
import { exp1Address } from './_generated/contracts.js'
import * as Anvil from './anvil.js'
import { poolId, rpcServer } from './prool.js'

const defaultConfig = {
  delegationProxy: accountProxyAddress,
  endpoint: (key) => `http://127.0.0.1:${Anvil.instances.portoDev.port}/${key}`,
  feeTokens: [
    '0x0000000000000000000000000000000000000000',
    exp1Address[Chains.anvil.id],
  ],
  intentGasBuffer: 100_000n,
  orchestrator: orchestratorAddress,
  simulator: simulatorAddress,
  txGasBuffer: 100_000n,
  version: '7537e85',
} satisfies Parameters<typeof defineRpcServer>[0]

export const instances = {
  portoDev: defineRpcServer(defaultConfig),
  portoDev_newAccount: defineRpcServer({
    ...defaultConfig,
    delegationProxy: accountNewProxyAddress,
    legacyDelegationProxy: accountProxyAddress,
    port: 9120,
  }),
} as const

/////////////////////////////////////////////////////////////////
// Utilities
/////////////////////////////////////////////////////////////////

function defineRpcServer(parameters: {
  endpoint: (key: number) => string
  delegationProxy: string
  feeTokens: string[]
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
          rpcServer({
            ...rest,
            endpoint: endpoint(key),
            http: {
              port,
            },
          }),
        port,
      }).start()
    },
  }
}
