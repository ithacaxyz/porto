import { RpcTransport } from 'ox'
import { createServer } from 'prool'

import * as Chains from '../../src/core/Chains.js'
import {
  accountRegistryAddress,
  delegationProxyAddress,
  entryPointAddress,
  simulatorAddress,
} from './_generated/addresses.js'
import { exp1Address } from './_generated/contracts.js'
import * as Anvil from './anvil.js'
import { poolId, rpcServer } from './prool.js'

export const instances = {
  odyssey: defineRpcServer({
    accountRegistry: accountRegistryAddress,
    delegationProxy: delegationProxyAddress,
    endpoint: (key) =>
      `http://127.0.0.1:${Anvil.instances.odyssey.port}/${key}`,
    entrypoint: entryPointAddress,
    feeTokens: [
      '0x0000000000000000000000000000000000000000',
      exp1Address[Chains.anvil.id],
    ],
    simulator: simulatorAddress,
    userOpGasBuffer: 100_000n,
  }),
} as const

/////////////////////////////////////////////////////////////////
// Utilities
/////////////////////////////////////////////////////////////////

function defineRpcServer(parameters: {
  accountRegistry: string
  endpoint: (key: number) => string
  entrypoint: string
  delegationProxy: string
  feeTokens: string[]
  image?: string | undefined
  simulator: string
  txGasBuffer?: bigint | undefined
  userOpGasBuffer?: bigint | undefined
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
