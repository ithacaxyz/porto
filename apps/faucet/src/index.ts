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

const headers = new Headers({
  'Access-Control-Allow-Origin': '*',
  'X-Faucet-Address': account.address,
  'X-Faucet-ChainId': Chains.odysseyDevnet.id.toString(),
  'X-Faucet-RpcUrl': Chains.odysseyDevnet.rpcUrls.default.http[0],
})

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url)
      const address = url.searchParams.get('address')
      const chainId = Number(url.searchParams.get('chainId'))
      const value = BigInt(url.searchParams.get('value') ?? 25)

      if (!address || !isAddress(address))
        return Response.json(
          { error: 'Valid EVM address required' },
          { headers, status: 400 },
        )
      if (!chainId || !exp1Address[chainId as keyof typeof exp1Address])
        return Response.json(
          { error: 'Valid chainId required' },
          { headers, status: 400 },
        )

      const { success } = await env.RATE_LIMITER.limit({
        key:
          address.toLowerCase() +
          (request.headers.get('cf-connecting-ip') ?? ''),
      })

      if (!success) {
        return Response.json(
          { error: 'Rate limit exceeded' },
          { headers, status: 429 },
        )
      }

      const client = createWalletClient({
        account,
        chain: Chains.odysseyDevnet,
        transport: http(),
      }).extend(publicActions)

      const hash = await client.writeContract({
        abi: exp1Abi,
        address: exp1Address[chainId as keyof typeof exp1Address],
        args: [address, value],
        functionName: 'mint',
      })

      // wait for transaction inclusion
      const receipt = await waitForTransactionReceipt(client, {
        hash,
      })

      if (receipt.status === 'success') {
        return Response.json(
          { id: receipt.transactionHash },
          { headers, status: 200 },
        )
      }

      return Response.json(
        { error: receipt.status, id: receipt.transactionHash },
        { headers, status: 500 },
      )
    } catch (error) {
      console.error(error)
      return Response.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { headers, status: 500 },
      )
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>
