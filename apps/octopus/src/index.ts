import type { ExportedHandler } from '@cloudflare/workers-types'

const headers = new Headers({
  'Access-Control-Allow-Origin': '*',
  'X-Api-Provider': 'Porto',
})

export default {
  async fetch(request, env) {
    try {
      if (request.method === 'OPTIONS') return new Response(null, { headers })

      const url = new URL(request.url)

      if (url.pathname === '/onramp') {
        const address = url.searchParams.get('address')
        if (!address)
          return Response.json(
            { error: 'Address is required' },
            { headers, status: 400 },
          )

        const region = url.searchParams.get('region') ?? 'us'
        const destination_currency =
          url.searchParams.get('destination_currency') ?? 'usdc'
        const destination_network =
          url.searchParams.get('destination_network') ?? 'base'
        const source_currency = url.searchParams.get('source_currency') ?? 'usd'
        const source_amount = url.searchParams.get('source_amount')
        if (!source_amount)
          return Response.json(
            { error: 'Source amount is required' },
            { headers, status: 400 },
          )

        const body = new URLSearchParams({
          destination_currency,
          destination_network,
          source_amount,
          source_currency,
        })

        body.append('wallet_addresses[base_network]', address)
        body.append('destination_currencies[]', 'usdc')
        body.append('destination_networks[]', 'base')

        const response = await fetch(
          'https://api.stripe.com/v1/crypto/onramp_sessions',
          {
            body,
            headers: {
              Authorization: `Bearer ${env.STRIPE_API_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
          },
        )
        const data = (await response.json()) as { redirect_url: string }
        if (!Object.hasOwn(data, 'redirect_url')) {
          console.info(data)
          return new Response('failed. Better err msg coming soon', {
            headers,
            status: 500,
          })
        }
        return Response.redirect(data.redirect_url)
      }

      return Response.redirect('https://edgecats.net')
    } catch (error) {
      console.error(error)
      return Response.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { headers, status: 500 },
      )
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>
