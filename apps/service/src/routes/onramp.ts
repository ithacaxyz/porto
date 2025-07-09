import { env } from 'cloudflare:workers'
import * as crypto from 'node:crypto'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { validator } from 'hono/validator'
import { isAddress } from 'viem'

const onrampApp = new Hono<{ Bindings: Cloudflare.Env }>()

  .onError((error, context) => {
    return context.json(
      {
        error:
          error?.cause ??
          (error instanceof Error ? error.message : `Unknown error ${error}`),
      },
      500,
    )
  })

  .get(
    '/',
    validator('query', (values, context) => {
      const {
        email,
        amount,
        address,
        redirect = 'false',
        environment = 'production',
      } = <Record<string, string>>values
      const errorResponse = (message: string) =>
        context.json(
          {
            error: `${message}. Required parameters: ${Object.keys(values).join(', ')}`,
          },
          400,
        )

      if (!address || !isAddress(address))
        return errorResponse('Valid EVM address required')
      if (!amount) return errorResponse('`amount` is required')
      if (!email) return errorResponse('`email` is required')
      if (!['production', 'sandbox'].includes(environment))
        return errorResponse('`environment` must be "production" or "sandbox"')

      return {
        address,
        amount,
        email,
        environment,
        redirect: redirect === 'true',
      }
    }),
    async (context) => {
      const { address, amount, email, environment, redirect } =
        context.req.valid('query')

      const url = new URL(context.env.WIDGET_URL)
      const searchParams = new URLSearchParams({
        address,
        currency: 'USDC',
        fiat_amount: amount,
        fiat_currency: 'USD',
        network: 'BASE',
        payment_method: 'apple',
        widget_flow: 'applepay_minimal',
        widget_id: context.env.WIDGET_ID,
      })

      const signature = crypto
        .createHash('sha512')
        .update(`${address}${context.env.AUTH_SECRET_KEY}`)
        .digest('hex')

      searchParams.set('signature', signature)

      const silentSignUpResponse = await silentSignUp({ email })

      if (silentSignUpResponse.status !== 200) {
        throw new HTTPException(500, {
          cause: silentSignUpResponse,
          message: 'Failed to sign up',
        })
      }

      searchParams.set('init_token', silentSignUpResponse.data.init_token)
      searchParams.set(
        'init_token_type',
        silentSignUpResponse.data.init_type_token,
      )

      url.search = searchParams.toString()

      return redirect
        ? context.redirect(url.toString())
        : context.json({ url: url.toString() })
    },
  )

const baseHeaders = {
  'Content-Type': 'application/json',
  'Sdk-Partner-Token': env.SDK_PARTNER_TOKEN,
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${env.API_BASE_URL}${path}`, {
    ...options,
    headers: { ...baseHeaders, ...options.headers },
  })
  const data = (await response.json()) as T
  if (data) return data
  throw new Error('Failed to perform silent authentication')
}

type ForbiddenError = { status: 403 } & (
  | { code: 403020; message: 'IP is blacklisted' }
  | { code: 403031; message: 'Login failed. Check the message field' }
  | { code: 403007; message: 'Transaction lock error. Please contact support' }
)

type ErrorResponse =
  | ForbiddenError
  | { status: 400; code: 400037; message: 'Validation failed' }
  | { status: 401; code: 401000; message: 'Authorization failed' }
  | { status: 404; code: 404; message: 'User is not found' }
  | { status: 405; code: 405000; message: 'Method Not Allowed' & string }
  | { status: 500; code: 500; message: 'Internal server error' & string }

export type SilentSignUpResponse =
  | {
      data: { uuid: string; init_token: string; init_type_token: string }
      status: 200
    }
  | ErrorResponse

type SilentSignUpRequestParameters =
  | { email: string }
  | { phone: string }
  | { user_uuid4: string }

/**
 * @see https://oor-redirect.redoc.ly/#section/Silent-Authentication/Silent-Sign-Up
 *
 * @note
 * `init_token` expires after the first time it was passed or after one hour
 */
export async function silentSignUp(
  parameters: SilentSignUpRequestParameters & { language_code?: string },
): Promise<SilentSignUpResponse> {
  return await apiRequest<SilentSignUpResponse>('/sdk-partner/sign-up', {
    body: JSON.stringify({ accept: true, ...parameters }),
    method: 'POST',
  })
}

type SilentSignInResponse =
  | {
      data: { uuid: string; init_token: string; init_type_token: string }
      status: 200
    }
  | ErrorResponse

/**
 * @see https://oor-redirect.redoc.ly/#section/Silent-Authentication/Silent-Sign-In
 *
 * @note
 * `init_token` expires after the first time it was passed or after one hour
 */
export async function silentSignIn(
  parameters: SilentSignUpRequestParameters,
): Promise<SilentSignInResponse> {
  return await apiRequest<SilentSignInResponse>('/sdk-partner/login', {
    body: JSON.stringify(parameters),
    method: 'POST',
  })
}

onrampApp.get(
  '/external',
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
