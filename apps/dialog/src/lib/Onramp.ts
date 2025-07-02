import { Env } from '@porto/apps'

export function enableOnramp() {
  if (typeof window === 'undefined' || typeof window.parent === 'undefined')
    return false

  const dialogSearchParams = new URLSearchParams(window.location.search)
  const dialogDebugOnramp = dialogSearchParams.get('debug') === 'onramp'
  let parentDebugOnramp = false
  try {
    if (window.parent !== window && window.parent.location) {
      const parentSearchParams = new URLSearchParams(
        window.parent.location.search,
      )
      parentDebugOnramp = parentSearchParams.get('debug') === 'onramp'
    }
  } catch {
    console.warn("Can't access parent due to cross-origin restrictions")
  }
  return Env.get() === 'prod' || dialogDebugOnramp || parentDebugOnramp
}

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
