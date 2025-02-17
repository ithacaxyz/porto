import {
  http,
  type Chain,
  type HttpTransport,
  type TransactionRequest,
  createClient,
  defineChain,
  formatTransaction,
  parseGwei,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { prepareTransactionRequest, signTransaction } from 'viem/actions'

export const chain = (id = 1) =>
  defineChain({
    id,
    name: 'Anvil',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    contracts: {
      delegation: {
        address: '0x44b636676dbbc8361ffa519a121958958b66ba3f',
      },
    },
    rpcUrls: {
      default: {
        http: ['http://127.0.0.1:8545/' + id],
      },
    },
  })

export function transport(): HttpTransport {
  return (options) => {
    const transport = http()(options)

    return {
      ...transport,
      async request({ params, method }, opts) {
        let body = { params, method }

        if (method === 'eth_sendTransaction') {
          const client = createClient({
            chain: options.chain as Chain,
            transport: http(),
          })

          const transaction = formatTransaction(
            (params as any)[0],
          ) as TransactionRequest

          const request = await prepareTransactionRequest(client, {
            ...transaction,
            account: privateKeyToAccount(
              '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
            ),
            chain: null,
            maxFeePerGas: parseGwei('100') as any,
            maxPriorityFeePerGas: parseGwei('10') as any,
            gas: 1_000_000n,
          })

          const serialized = await signTransaction(client, request)

          body = {
            ...body,
            method: 'eth_sendRawTransaction',
            params: [serialized],
          }
        }

        return await transport.request(body, opts)
      },
    }
  }
}
