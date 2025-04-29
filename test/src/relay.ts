import { RpcTransport } from 'ox'
import { createServer } from 'prool'

import * as Chains from '../../src/core/Chains.js'
import { exp1Address } from './_generated/contracts.js'
import * as Anvil from './anvil.js'
import { poolId, relay } from './prool.js'

export const instances = {
  odyssey: defineRelay({
    accountRegistry: Chains.anvil.contracts.accountRegistry.address,
    delegationProxy: Chains.anvil.contracts.delegation.address,
    endpoint: (key) =>
      `http://127.0.0.1:${Anvil.instances.odyssey.port}/${key}`,
    entrypoint: Chains.anvil.contracts.entryPoint.address,
    feeTokens: [
      '0x0000000000000000000000000000000000000000',
      exp1Address[Chains.anvil.id],
    ],
    simulator: Chains.anvil.contracts.simulator.address,
    userOpGasBuffer: 100_000n,
  }),
} as const

/////////////////////////////////////////////////////////////////
// Utilities
/////////////////////////////////////////////////////////////////

function defineRelay(parameters: {
  accountRegistry: string
  endpoint: (key: number) => string
  entrypoint: string
  delegationProxy: string
  feeTokens: string[]
  simulator: string
  txGasBuffer?: bigint | undefined
  userOpGasBuffer?: bigint | undefined
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
          relay({
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
