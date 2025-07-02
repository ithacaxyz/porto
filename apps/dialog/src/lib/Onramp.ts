import { Env } from '@porto/apps'
import * as Dialog from '~/lib/Dialog.ts'

export function enableOnramp() {
  // Check dialog's own params
  const dialogSearchParams = new URLSearchParams(window.location.search)
  const dialogDebugOnramp = dialogSearchParams.get('debug') === 'onramp'

  // Check parent's params from Dialog store
  const parentSearchParams = Dialog.store?.getState().referrer?.searchParams
  let parentDebugOnramp = false
  if (parentSearchParams) {
    const params = new URLSearchParams(parentSearchParams)
    parentDebugOnramp = params.get('debug') === 'onramp'
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
