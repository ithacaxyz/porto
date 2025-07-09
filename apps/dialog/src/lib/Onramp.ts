import { Env } from '@porto/apps'

export function enableOnramp() {
  const dialogSearchParams = new URLSearchParams(window.location.search)
  const onrampEnabled = dialogSearchParams.get('onramp') === 'true'

  return Env.get() === 'prod' || onrampEnabled
}

export function integratedOnrampUrl(params: integratedOnrampUrl.Params) {
  const { address, amount = 40, email, redirect = 'false' } = params
  if (amount < 37 || amount > 5_000) {
    console.warn(
      `Invalid amount for onramp: ${amount}. Must be between 37 and 5,000.`,
    )
    throw new Error(
      `Invalid amount for onramp: ${amount}. Must be between 37 and 5,000.`,
    )
  }

  const searchParams = new URLSearchParams({
    address,
    amount: amount.toString(),
    email,
    redirect,
  })

  const url = new URL(
    '/onramp',
    import.meta.env.VITE_PORTO_WORKERS_URL ||
      'https://octopus.porto.workers.dev',
  )
  url.search = searchParams.toString()
  return url.toString()
}

export declare namespace integratedOnrampUrl {
  type Params = {
    email: string
    amount: number
    address: string
    redirect?: 'true' | 'false'
  }
}

/**
 * Test card:
 * 4242 4242 4242 4242
 * any 3-digit CVC
 * any future expiration date
 * SSN: 0000
 */

export function externalOnrampUrl(params: externalOnrampUrl.Params) {
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

export declare namespace externalOnrampUrl {
  type Params = {
    amount: number
    address: string
  }
}
