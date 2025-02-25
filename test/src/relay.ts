import { RpcTransport } from 'ox'
import { createServer } from 'prool'

import { anvilOdyssey } from './anvil.js'
import { ExperimentERC20 } from './contracts.js'
import { relay } from './prool.js'

export const relayOdyssey = defineRelay({
  endpoint: (key) => `http://127.0.0.1:${anvilOdyssey.port}/${key}`,
  feeToken: ExperimentERC20.address[0],
  txGasBuffer: 2_000_000n,
  userOpGasBuffer: 2_000_000n,
})

/////////////////////////////////////////////////////////////////
// Utilities
/////////////////////////////////////////////////////////////////

function defineRelay(parameters: {
  endpoint: (key: number) => string
  feeToken: string
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
