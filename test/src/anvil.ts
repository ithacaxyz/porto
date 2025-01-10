import { resolve } from 'node:path'
import { Provider, RpcTransport } from 'ox'
import { createServer } from 'prool'
import { type AnvilParameters, anvil } from 'prool/instances'
import {
  http,
  type TransactionRequest,
  createClient,
  formatTransaction,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { prepareTransactionRequest, signTransaction } from 'viem/actions'

export const anvilMainnet = defineAnvil({
  forkUrl: getEnv('VITE_ANVIL_FORK_URL', 'https://eth.merkle.io'),
  forkBlockNumber: 19868020n,
  port: 8545,
  loadState: resolve(import.meta.dirname, 'anvil.json'),
})

/////////////////////////////////////////////////////////////////
// Utilities
/////////////////////////////////////////////////////////////////

function getEnv(key: string, fallback: string): string {
  if (typeof process.env[key] === 'string') return process.env[key] as string
  console.warn(
    `\`process.env.${key}\` not found. Falling back to \`${fallback}\`.`,
  )
  return fallback
}

function defineAnvil(parameters: AnvilParameters) {
  const { port } = parameters
  const poolId =
    Number(process.env.VITEST_POOL_ID ?? 1) *
    Number(process.env.VITEST_SHARD_ID ?? 1)
  const rpcUrl = `http://127.0.0.1:${port}/${poolId}`

  const config = {
    ...parameters,
    odyssey: true,
    hardfork: 'Prague',
  } as const

  const client = createClient({
    transport: http(rpcUrl),
  })

  const transport = RpcTransport.fromHttp(rpcUrl)
  const provider = Provider.from({
    async request(args) {
      if (args.method === 'eth_sendTransaction') {
        const transaction = formatTransaction(
          (args.params as any)[0],
        ) as TransactionRequest

        const request = await prepareTransactionRequest(client, {
          ...transaction,
          account: privateKeyToAccount(
            '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
          ),
          chain: null,
        })

        const serialized = await signTransaction(client, request)

        args.method = 'eth_sendRawTransaction' as any
        args.params = [serialized] as any
      }

      return transport.request(args as any)
    },
  })

  return {
    config,
    request: provider.request,
    async restart() {
      await fetch(`${rpcUrl}/restart`)
    },
    rpcUrl,
    async start() {
      return await createServer({
        instance: anvil(config),
        port,
      }).start()
    },
  }
}
