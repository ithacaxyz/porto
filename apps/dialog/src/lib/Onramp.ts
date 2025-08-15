import { Env } from '@porto/apps'

export function enableOnramp() {
  const dialogSearchParams = new URLSearchParams(window.location.search)
  const onrampEnabled = dialogSearchParams.get('onramp') === 'true'

  return Env.get() === 'prod' || onrampEnabled
}

export function getOnrampWidget() {
  if (typeof window === 'undefined' || Env.get() !== 'prod') return
  if (window?.mercuryoWidget) return window.mercuryoWidget

  const script = document.createElement('script')
  script.setAttribute('src', 'https://widget.mercuryo.io/embed.2.1.js')
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
