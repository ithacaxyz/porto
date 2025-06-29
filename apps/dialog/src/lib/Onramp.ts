export function mercuryoOnrampUrl(_params: {}) {
  throw new Error('Not implemented')
}

/**
 * Test card:
 * 4242 4242 4242 4242
 * any 3-digit CVC
 * any future expiration date
 * SSN: 0000
 */

export function stripeOnrampUrl(amount: number) {
  if (amount < 1 || amount > 30_000) {
    throw new Error(
      `Invalid amount for Stripe onramp: ${amount}. Must be between 1 and 30,000.`,
    )
  }

  const searchParams = new URLSearchParams({
    destination_currency: 'usdc',
    destination_network: 'base',
    ref: 'porto',
    source_amount: amount.toString(),
    source_currency: 'usd',
  })
  const url = new URL('https://crypto.link.com')
  url.search = searchParams.toString()
  return url.toString()
}
