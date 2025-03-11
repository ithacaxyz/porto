import { RpcTransport } from 'ox'
import { createServer } from 'prool'

import * as Anvil from './anvil.js'
import { ExperimentERC20 } from './contracts.js'
import { relay } from './prool.js'

export const instances = {
  odyssey: defineRelay({
    endpoint: (key) =>
      `http://127.0.0.1:${Anvil.instances.odyssey.port}/${key}`,
    feeTokens: [
      '0x0000000000000000000000000000000000000000',
      ExperimentERC20.address[0],
    ],
    userOpGasBuffer: 100_000n,
  }),
} as const

/////////////////////////////////////////////////////////////////
// Utilities
/////////////////////////////////////////////////////////////////

function defineRelay(parameters: {
  endpoint: (key: number) => string
  feeTokens: string[]
  txGasBuffer?: bigint | undefined
  userOpGasBuffer?: bigint | undefined
  port?: number | undefined
}) {
  const { endpoint, port = 9119 } = parameters
  const poolId =
    Number(process.env.VITEST_POOL_ID ?? 1) *
    Number(process.env.VITEST_SHARD_ID ?? 1)
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
