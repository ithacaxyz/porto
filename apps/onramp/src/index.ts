import type { ExportedHandler } from '@cloudflare/workers-types'
import { Address } from 'ox'
import { silentSignUp } from './api'
import { env } from './constants'
import { constructSignature } from './signature'

const headers = new Headers({
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
  'X-Api-Source': 'porto',
})

export default {
  async fetch(request, _env) {
    const url = new URL(request.url)
    const path = url.pathname.toLowerCase()
    try {
      console.info(process.env.ENVIRONMENT)
      if (request.method === 'OPTIONS') return new Response(null, { headers })
      if (!['/sign-up', '/login'].includes(path))
        return Response.json({ error: 'Not found' }, { headers, status: 404 })

      const environment =
        (url.searchParams.get('env') as 'sandbox' | 'production') ??
        'production'
      if (!['sandbox', 'production'].includes(environment))
        throw new Error('Invalid environment')

      process.env.ENVIRONMENT = environment

      const sdkPartnerToken = env(environment).SDK_PARTNER_TOKEN
      const WIDGET_ID = env(environment).WIDGET_ID
      const WIDGET_URL = env(environment).WIDGET_URL
      const API_BASE_URL = env(environment).API_BASE_URL
      const AUTH_SECRET_KEY = env(environment).AUTH_SECRET_KEY
      const AUTH_SIGN_KEY = env(environment).AUTH_SIGN_KEY

      const address = url.searchParams.get('address') as Address.Address
      const fiatAmount = (url.searchParams.get('amount') as string) || '25'

      if (!Address.checksum(address)) throw new Error('address is required')

      const searchParams = new URLSearchParams({
        address,
        fiat_amount: fiatAmount,
        payment_method: 'apple',
        widget_flow: 'applepay_minimal',
        widget_id: WIDGET_ID,
      })

      if (path.endsWith('sign-up')) {
        // do silent-signup
        const email = url.searchParams.get('email')
        if (!email) throw new Error('email is required')

        searchParams.set(
          'signature',
          constructSignature({
            address,
            secret: AUTH_SECRET_KEY,
          }),
        )

        const silentSignUpResponse = await silentSignUp({ email })
        if (silentSignUpResponse.status !== 200)
          throw new Error('failed to sign up')

        searchParams.set('init_token', silentSignUpResponse.data.init_token)
        searchParams.set(
          'init_token_type',
          silentSignUpResponse.data.init_type_token,
        )

        return Response.json(
          { url: `${WIDGET_URL}?${searchParams.toString()}` },
          { headers },
        )
      }

      if (path.endsWith('login')) throw new Error('soon')

      return Response.json({ error: 'Not found' }, { headers, status: 404 })
    } catch (error) {
      console.error(error)
      return Response.json(
        {
          error: error instanceof Error ? error.message : JSON.stringify(error),
        },
        { headers, status: 500 },
      )
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>
