import { env } from 'cloudflare:workers'
import type { ExportedHandler } from '@cloudflare/workers-types'
import { exp1Abi, exp1Address } from '@porto/apps/contracts'
import { createClient, http, isAddress, isHex } from 'viem'
import { Chains } from 'porto'
import { Account, Key, Relay } from 'porto/internal'

const DRIP_ADDRESS = env.DRIP_ADDRESS
const DRIP_PRIVATE_KEY = env.DRIP_PRIVATE_KEY

if (!isAddress(DRIP_ADDRESS) || !isHex(DRIP_PRIVATE_KEY)) {
  throw new Error('Invalid environment variables')
}

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url)
      const address = url.searchParams.get('address')
      const value = Number(url.searchParams.get('value') ?? 25)

      if (!address || !isAddress(address)) {
        return new Response('Valid EVM address required', { status: 400 })
      }

      const client = createClient({
        chain: Chains.odysseyTestnet,
        transport: http('https://relay-staging.ithaca.xyz'),
      })

      const account = Account.from({
        address: DRIP_ADDRESS,
        keys: [
          Key.fromSecp256k1({ role: 'admin', privateKey: DRIP_PRIVATE_KEY }),
        ],
      })

      const { id } = await Relay.sendCalls(client, {
        account,
        calls: [
          {
            abi: exp1Abi,
            to: exp1Address,
            functionName: 'mint',
            args: [address, value],
          },
        ],
        feeToken: exp1Address,
      })

      return new Response(id)
    } catch (error) {
      console.error(error)
      return new Response(
        error instanceof Error ? error.message : 'Unknown error',
        { status: 500 },
      )
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>
