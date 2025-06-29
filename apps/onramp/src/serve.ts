import { Address } from 'ox'
import type { MercuryoCallback } from './callback.ts'
import WidgetPage from './index.html'
import { constructSignature } from './signature'

/**
 * TODO: verify header signature in `/callback` route
 */

const serve = Bun.serve({
  development: true,
  error: (error) => {
    console.error(error)
    return new Response(`Internal Error: ${error.message}`, {
      headers: { 'Content-Type': 'text/plain' },
      status: 500,
    })
  },
  routes: {
    '/': {
      GET: async (request) => {
        const url = new URL(request.url)

        const address = url.searchParams.get('address')
        if (!address || !Address.checksum(address))
          throw new Error('address of buyer as search param is required')

        const signature = constructSignature({
          address: Address.checksum(address),
          secret: process.env.AUTH_SECRET_KEY,
        })

        const searchParams = new URLSearchParams({
          address,
          currencies: 'USDT,ETH',
          fiat_amount: '40',
          fiat_currencies: 'USD,EUR',
          network: 'ETHEREUM',
          payment_method: 'apple',
          redirect_url: '/success',
          signature,
          type: 'buy',
          widget_id: 'ffbb1cbb-03e0-4c39-b8d5-9e645e42a7cf',
        })

        return Response.redirect(
          new URL(`/widget?${searchParams.toString()}`, request.url),
        )
      },
    },
    /**
     * @see https://oor-iframe.redoc.ly/#section/Callbacks
     *
     * Callback receives event updates from Mercuryo.
     * Updates on transaction status:
     * New, Pending, Cancelled, Paid, Order, Failed, Order, Scheduled
     */
    '/callback': {
      POST: async (request, server) => {
        const xSignature = request.headers.get('X-Signature')
        if (!xSignature) return new Response('No signature', { status: 400 })
        console.info(`X-Signature: ${xSignature}`)

        const body: MercuryoCallback = await request.json()

        const ip = server.requestIP(request as Request)
        const status = body.data.status

        console.info(`[${ip?.address}] Transaction status: ${status}`)

        return new Response('ok')
      },
    },
    '/success': {
      GET: (request) => {
        console.info(request.url)
        return new Response('success')
      },
    },
    '/widget': WidgetPage,
  },
})

console.info(`Server is running on ${serve.url}`)
