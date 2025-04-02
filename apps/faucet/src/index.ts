import { env } from 'cloudflare:workers'
import type { ExportedHandler } from '@cloudflare/workers-types'
import { exp1Address } from '@porto/apps/contracts'
import {
  createWalletClient,
  erc20Abi,
  http,
  isAddress,
  isHex,
  parseEther,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { odysseyTestnet } from 'viem/chains'

const DRIP_ADDRESS = env.DRIP_ADDRESS
const DRIP_PRIVATE_KEY = env.DRIP_PRIVATE_KEY

if (!isAddress(DRIP_ADDRESS) || !isHex(DRIP_PRIVATE_KEY)) {
  throw new Error('Invalid environment variables')
}

export default {
  async fetch(request, env) {
    try {
      const client = createWalletClient({
        account: privateKeyToAccount(DRIP_PRIVATE_KEY),
        chain: odysseyTestnet,
        transport: http(),
      })

      const url = new URL(request.url)
      const address = url.searchParams.get('address')

      if (!address || !isAddress(address)) {
        return new Response('Valid EVM address required', { status: 400 })
      }

      const result = await client.writeContract({
        abi: erc20Abi,
        address: exp1Address,
        args: [address, parseEther(env.DRIP_AMOUNT ?? '25')],
        functionName: 'transfer',
      })

      return new Response(result)
    } catch (error) {
      console.error(error)
      return new Response(
        error instanceof Error ? error.message : 'Unknown error',
        { status: 500 },
      )
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>
