import { env } from 'cloudflare:workers'
import type { ExportedHandler } from '@cloudflare/workers-types'
import { exp1Abi, exp1Address } from '@porto/apps/contracts'
import { Chains } from 'porto'
import { createWalletClient, http, isAddress, publicActions } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { waitForTransactionReceipt } from 'viem/actions'

const DRIP_PRIVATE_KEY = env.DRIP_PRIVATE_KEY
const account = privateKeyToAccount(DRIP_PRIVATE_KEY)

if (!account?.address) throw new Error('Invalid DRIP_PRIVATE_KEY')

const chains = {
  [Chains.baseSepolia.id]: Chains.baseSepolia,
  [Chains.portoDev.id]: Chains.portoDev,
} as const

const headers = (chainId?: keyof typeof chains) =>
  new Headers({
    'Access-Control-Allow-Origin': '*',
    'X-Faucet-Address': account.address,
    ...(chainId
      ? {
          'X-Faucet-ChainId': chainId.toString(),
          'X-Faucet-RpcUrl': chains[chainId].rpcUrls.default.http[0],
        }
      : {}),
  })

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url)
      const address = url.searchParams.get('address')
      const chainId = Number(url.searchParams.get('chainId')) as
        | keyof typeof chains
        | undefined
      const value = BigInt(url.searchParams.get('value') ?? 25)

      if (!address || !isAddress(address))
        return Response.json(
          { error: 'Valid EVM address required' },
          { headers: headers(chainId), status: 400 },
        )

      if (!chainId || !exp1Address[chainId as keyof typeof exp1Address])
        return Response.json(
          { error: 'Valid chainId required' },
          { headers: headers(), status: 400 },
        )

      const { success } = await env.RATE_LIMITER.limit({
        key:
          address.toLowerCase() +
          (request.headers.get('cf-connecting-ip') ?? ''),
      })

      if (!success)
        return Response.json(
          { error: 'Rate limit exceeded' },
          { headers: headers(chainId), status: 429 },
        )

      const client = createWalletClient({
        account,
        chain: chains[chainId],
        transport: http(),
      }).extend(publicActions)

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await client.estimateFeesPerGas()

      const hash = await client.writeContract({
        abi: exp1Abi,
        address: exp1Address[chainId as keyof typeof exp1Address],
        args: [address, value],
        functionName: 'mint',
        maxFeePerGas: maxFeePerGas * 2n,
        maxPriorityFeePerGas: maxPriorityFeePerGas * 2n,
      })

      // wait for transaction inclusion
      const receipt = await waitForTransactionReceipt(client, {
        hash,
      })

      if (receipt.status === 'success')
        return Response.json(
          { id: receipt.transactionHash },
          { headers: headers(chainId), status: 200 },
        )

      return Response.json(
        { error: receipt.status, id: receipt.transactionHash },
        { headers: headers(chainId), status: 500 },
      )
    } catch (error) {
      console.error(error)
      return Response.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { headers: headers(), status: 500 },
      )
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>
