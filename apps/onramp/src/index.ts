import { env } from 'cloudflare:workers'
import type { ExportedHandler } from '@cloudflare/workers-types'
import { Address } from 'ox'
import { silentSignUp } from './api'
import { constructSignature } from './signature'

const SDK_PARTNER_TOKEN = env.SDK_PARTNER_TOKEN
if (!SDK_PARTNER_TOKEN) throw new Error('SDK_PARTNER_TOKEN is required')

const MERCURYO_CONFIG = {
  baseURL: 'https://sandbox-api.mrcr.io/v1.6',
  headers: {
    'Content-Type': 'application/json',
    'Sdk-Partner-Token': SDK_PARTNER_TOKEN,
  },
}

const headers = new Headers({
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
  'X-Api-Source': 'porto',
})
// /?widget_id=6b5ab199-cdb8-4426-8a34-3ff9d24188cf&address=33kASaULxMieHd6dw8KzpH1EJKTrB3K2fx&signature=415d23b09d0ad80a7f2e4a950ff5097930f1335cb2a6e802b640ea30a25273b761752f7dec5ffa1532a2fc4ff10a9563c2f56971b0556f22c3323bd6d9e2f838&payment_method=apple&widget_flow=applepay_minimal&fiat_amount=250

export default {
  async fetch(request, _env) {
    const url = new URL(request.url)
    const path = url.pathname.toLowerCase()
    try {
      if (request.method === 'OPTIONS') return new Response(null, { headers })

      const sandbox = url.searchParams.get('sandbox') === 'true'
      const address = url.searchParams.get('address') as Address.Address
      const fiatAmount = url.searchParams.get('amount') as string

      if (!Address.checksum(address)) throw new Error('address is required')

      const searchParams = new URLSearchParams({
        address,
        fiat_amount: fiatAmount,
        payment_method: 'apple',
        widget_flow: 'applepay_minimal',
        widget_id: process.env.WIDGET_ID,
      })

      if (path.endsWith('sign-up')) {
        // do silent-signup
        const email = url.searchParams.get('email')
        if (!email) throw new Error('email is required')

        searchParams.set(
          'signature',
          constructSignature({
            address,
            secret: process.env.AUTH_SECRET_KEY,
          }),
        )

        const silentSignUpResponse = await silentSignUp({ email })
        if (silentSignUpResponse.status !== 200)
          throw new Error('failed to sign up')

        searchParams.set('init_token', silentSignUpResponse.data.init_token)
        searchParams.set(
          'init_token_type',
          silentSignUpResponse.data.init_token_type,
        )

        return Response.redirect(
          `https://exchange.mercuryo.io?${searchParams.toString()}`,
          302,
        )
      }

      if (path.endsWith('login')) throw new Error('soon')

      return Response.json({ error: 'Not found' }, { headers, status: 404 })
    } catch (error) {
      console.error(error)
      return Response.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { headers, status: 500 },
      )
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>
