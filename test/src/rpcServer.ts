import { RpcTransport } from 'ox'
import { createServer } from 'prool'

import * as Chains from '../../src/core/Chains.js'
import {
  accountProxyAddress,
  accountRegistryAddress,
  orchestratorAddress,
  simulatorAddress,
} from './_generated/addresses.js'
import { exp1Address } from './_generated/contracts.js'
import * as Anvil from './anvil.js'
import { poolId, rpcServer } from './prool.js'

export const instances = {
  odyssey: defineRpcServer({
    accountRegistry: accountRegistryAddress,
    delegationProxy: accountProxyAddress,
    endpoint: (key) =>
      `http://127.0.0.1:${Anvil.instances.odyssey.port}/${key}`,
    feeTokens: [
      '0x0000000000000000000000000000000000000000',
      exp1Address[Chains.anvil.id],
    ],
    intentGasBuffer: 100_000n,
    orchestrator: orchestratorAddress,
    simulator: simulatorAddress,
    version: '7b01a2c',
  }),
} as const

/////////////////////////////////////////////////////////////////
// Utilities
/////////////////////////////////////////////////////////////////

function defineRpcServer(parameters: {
  accountRegistry: string
  endpoint: (key: number) => string
  delegationProxy: string
  feeTokens: string[]
  image?: string | undefined
  intentGasBuffer?: bigint | undefined
  orchestrator: string
  simulator: string
  txGasBuffer?: bigint | undefined
  version?: string | undefined
  port?: number | undefined
}) {
  const { endpoint, port = 9119 } = parameters
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
            ...parameters,
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
