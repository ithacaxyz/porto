/**
 * Test card:
 * 4242 4242 4242 4242
 * any 3-digit CVC
 * any future expiration date
 * SSN: 0000
 */

import { Env } from '@porto/apps'

export function stripeOnrampUrl(params: stripeOnrampUrl.Params) {
  if (params.amount < 1 || params.amount > 30_000) {
    console.warn(
      `Invalid amount for Stripe onramp: ${params.amount}. Must be between 1 and 30,000.`,
    )
    return
  }

  const searchParams = new URLSearchParams({
    address: params.address,
    destination_currency: 'usdc',
    destination_network: 'base',
    environment: Env.get(),
    source_amount: params.amount.toString(),
    source_currency: 'usd',
  })
  const url = new URL(
    '/onramp',
    import.meta.env.VITE_PORTO_WORKERS_URL ||
      'https://octopus.porto.workers.dev',
  )
  url.search = searchParams.toString()
  return url.toString()
}

export declare namespace stripeOnrampUrl {
  type Params = {
    amount: number
    address: string
  }
}
