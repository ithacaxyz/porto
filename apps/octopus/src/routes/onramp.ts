import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { isAddress } from 'viem'

const onrampApp = new Hono<{ Bindings: Cloudflare.Env }>()

onrampApp.get(
  '/',
  validator('query', (values, context) => {
    const {
      wallet_address,
      environment,
      source_amount,
      source_currency = 'usd',
      destination_currencies,
      destination_network = 'base',
      destination_networks,
      destination_currency = 'usdc',
      lock_wallet_address = 'false',
    } = <Record<string, string>>values

    if (!wallet_address || !isAddress(wallet_address))
      return context.json({ error: 'Valid EVM address required' }, 400)

    if (!source_amount)
      return context.json({ error: '`source_amount` is required' }, 400)

    const apiKey =
      environment === 'prod' || environment === 'production'
        ? context.env.STRIPE_API_KEY
        : context.env.SANDBOX_STRIPE_API_KEY

    if (!apiKey) return context.json({ error: 'Valid API key required' }, 400)

    const destinationNetworks = (() =>
      destination_networks?.split(',') ?? [destination_network])()

    const destinationCurrencies = (() =>
      destination_currencies?.split(',') ?? [destination_currency])()

    return {
      apiKey,
      destination_currencies: destinationCurrencies,
      destination_currency,
      destination_network,
      destination_networks: destinationNetworks,
      lock_wallet_address,
      source_amount,
      source_currency,
      wallet_address,
    }
  }),
  async (context) => {
    const {
      apiKey,
      destination_networks,
      destination_currencies,
      lock_wallet_address,
      wallet_address,
      destination_currency,
      destination_network,
      source_amount,
      source_currency,
    } = context.req.valid('query')

    const body = new URLSearchParams({
      destination_currency,
      destination_network,
      lock_wallet_address,
      source_amount,
      source_currency,
      wallet_address,
    })

    for (const currency of destination_currencies)
      body.append('destination_currencies[]', currency)

    for (const network of destination_networks)
      body.append('destination_networks[]', network)

    const response = await fetch(
      'https://api.stripe.com/v1/crypto/onramp_sessions',
      {
        body,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
      },
    )

    const data = (await response.json()) as { redirect_url: string }

    if (!Object.hasOwn(data, 'redirect_url')) {
      console.error(data)
      return context.json(
        { error: 'Could not create Stripe Onramp session. No redirect_url' },
        500,
      )
    }

    return context.redirect(data.redirect_url)
  },
)

export { onrampApp }
