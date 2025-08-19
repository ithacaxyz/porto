import { Env } from '@porto/apps'
import type { Address } from 'ox'
import { z } from 'zod'

export function enableOnramp() {
  const dialogSearchParams = new URLSearchParams(window.location.search)
  const onrampEnabled = dialogSearchParams.get('onramp') === 'true'

  return Env.get() === 'prod' || onrampEnabled
}

const onrampTokenSchema = z.object({
  birthdate: z.string(),
  currency: z.string(),
  error: z.string().nullable(),
  fiatAmount: z.string(),
  fiatCurrency: z.string(),
  firstName: z.string(),
  initToken: z.string(),
  initTypeToken: z.string(),
  lastName: z.string(),
  merchantTransactionId: z.string(),
  network: z.string(),
  paymentMethod: z.string(),
  signature: z.string(),
  widgetFlow: z.string(),
  widgetId: z.string(),
  widgetUrl: z.string(),
})

const onrampWorkerUrl = 'https://onramp.porto.workers.dev'

export async function onrampAuthToken(address: Address.Address) {
  const response = await fetch(`${onrampWorkerUrl}/token?address=${address}`)
  const data = await response.json()
  return onrampTokenSchema.parse(data)
}

const onrampTransactionSchema = z.object({
  amount: z.string(),
  currency: z.string(),
  hash: z.string(),
  status: z.string(),
  url: z.string(),
})

export async function onrampTransactions(merchantTransactionId: string) {
  const response = await fetch(
    `${onrampWorkerUrl}/transactions?merchantTransactionId=${merchantTransactionId}`,
  )
  return onrampTransactionSchema.parse(await response.json())
}

const widgetScript = 'https://widget.mercuryo.io/embed.2.1.js'

export function getOnrampWidget() {
  if (Env.get() !== 'prod' || typeof window === 'undefined') return

  const existingScript = document.querySelector(`script[src="${widgetScript}"]`)
  if (existingScript) return window.mercuryoWidget

  const script = document.createElement('script')
  script.setAttribute('src', widgetScript)
  script.setAttribute('async', 'true')
  document.body.appendChild(script)

  return window.mercuryoWidget
}

declare global {
  interface Window {
    mercuryoWidget: any
  }
}

/**
 * Test card:
 * 4242 4242 4242 4242
 * any 3-digit CVC
 * any future expiration date
 * SSN: 0000
 */

export function stripeOnrampUrl(params: stripeOnrampUrl.Params) {
  if (params.amount < 1 || params.amount > 30_000) {
    console.warn(
      `Invalid amount for Stripe onramp: ${params.amount}. Must be between 1 and 30,000.`,
    )
    return
  }

  const searchParams = new URLSearchParams({
    destination_currency: 'usdc',
    destination_network: 'base',
    environment: Env.get(),
    source_amount: params.amount.toString(),
    source_currency: 'usd',
    wallet_address: params.address,
  })
  const url = new URL('/onramp', import.meta.env.VITE_WORKERS_URL)
  url.search = searchParams.toString()
  return url.toString()
}

export declare namespace stripeOnrampUrl {
  type Params = {
    amount: number
    address: string
  }
}
