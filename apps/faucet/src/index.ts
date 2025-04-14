import { env } from 'cloudflare:workers'
import type { ExportedHandler } from '@cloudflare/workers-types'
import { exp1Abi, exp1Address } from '@porto/apps/contracts'
import { Chains } from 'porto'
import { Account, Key, Relay } from 'porto/internal'
import { createClient, http, isAddress, isHex } from 'viem'

const DRIP_ADDRESS = env.DRIP_ADDRESS
const DRIP_PRIVATE_KEY = env.DRIP_PRIVATE_KEY

if (!isAddress(DRIP_ADDRESS) || !isHex(DRIP_PRIVATE_KEY)) {
  throw new Error('Invalid environment variables')
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url)
      const address = url.searchParams.get('address')
      const chainId = Number(url.searchParams.get('chainId'))
      const value = BigInt(url.searchParams.get('value') ?? 25)

      if (!address || !isAddress(address))
        return new Response('Valid EVM address required', { status: 400 })
      if (!chainId || !exp1Address[chainId as keyof typeof exp1Address])
        return new Response('Valid chainId required', { status: 400 })

      const { success } = await env.RATE_LIMITER.limit({
        key:
          address.toLowerCase() +
          (request.headers.get('cf-connecting-ip') ?? ''),
      })

      if (!success) {
        return new Response('Rate limit exceeded', { status: 429 })
      }

      const client = createClient({
        chain: Chains.odysseyDevnet,
        transport: http('https://relay-staging.ithaca.xyz'),
      })

      const account = Account.from({
        address: DRIP_ADDRESS,
        keys: [
          Key.fromHeadlessWebAuthnP256({
            privateKey: DRIP_PRIVATE_KEY,
          }),
        ],
      })

      const { id } = await Relay.sendCalls(client, {
        account,
        calls: [
          {
            abi: exp1Abi,
            args: [address, value],
            functionName: 'mint',
            to: exp1Address[chainId as keyof typeof exp1Address],
          },
        ],
        feeToken: exp1Address[chainId as keyof typeof exp1Address],
      })

      return Response.json(
        { id },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
    } catch (error) {
      console.error(error)
      return new Response(
        error instanceof Error ? error.message : 'Unknown error',
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          status: 500,
        },
      )
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>
