import { env } from 'cloudflare:workers'
import * as crypto from 'node:crypto'
import { Hono } from 'hono'
import { getConnInfo } from 'hono/cloudflare-workers'
import { HTTPException } from 'hono/http-exception'
import type * as jwt from 'hono/jwt'
import { validator } from 'hono/validator'
import type { Address } from 'ox'
import { isAddress } from 'viem'
import { PORTO_MERCHANT_ID } from '#constants.ts'
import { generateJsonWebToken } from '#utilities/jwt.ts'

const onrampApp = new Hono<{
  Bindings: Cloudflare.Env
  Variables: jwt.JwtVariables
}>()
  .onError((error, context) => {
    console.error(error.cause)
    return context.json(
      {
        error:
          error?.cause ??
          (error instanceof Error ? error.message : `Unknown error ${error}`),
      },
      500,
    )
  })
  .on(['GET', 'POST'], '/us', async (context) => {
    type requestFields = {
      amount: string
      payment_currency?: 'USD'
      purchase_currency?: 'USDC' | 'ETH'
      address: Address.Address
      email: string
      environment?: 'production' | 'sandbox'
      phone: string
      destination_network?: 'base'
      redirect?: 'true' | 'false'
    }

    const {
      address,
      amount,
      email,
      environment = 'production',
      phone,
      payment_currency,
      purchase_currency,
      redirect = 'false',
    } = (context.req.query() as requestFields) ||
    (await context.req.json<requestFields>())

    const coinbaseApiURL = new URL(
      '/onramp/v2/onramp/order',
      env.COINBASE_API_BASE_URL,
    )

    const jwt = await generateJsonWebToken({
      host: coinbaseApiURL.host,
      method: 'POST',
      path: coinbaseApiURL.pathname,
    })

    const response = await fetch(coinbaseApiURL.toString(), {
      body: JSON.stringify({
        agreementAcceptedAt: new Date().toISOString(),
        destinationAddress: address,
        destinationNetwork: 'base',
        email,
        partnerUserRef: PORTO_MERCHANT_ID,
        paymentAmount: amount,
        paymentCurrency: 'USD',
        paymentMethod: 'GUEST_CHECKOUT_APPLE_PAY',
        phoneNumber: `(+1)${phone}`,
        purchaseCurrency: 'USDC',
      }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const data = (await response.json()) as {
      order: {
        orderId: string
        paymentTotal: string
        paymentSubtotal: string
        paymentCurrency: string
        paymentMethod: string
        purchaseAmount: string
        purchaseCurrency: string
        fees: Array<{
          feeType: string
          feeAmount: string
          feeCurrency: string
        }>
        exchangeRate: string
        destinationAddress: string
        destinationNetwork: string
        status: string
        txHash: string
        createdAt: string
        updatedAt: string
      }
      authSteps: Array<unknown>
      paymentLink: {
        url: string
        paymentLinkType: string
      }
    }

    if (
      data?.order?.status !== 'ONRAMP_ORDER_STATUS_PENDING_PAYMENT' ||
      !Object.hasOwn(data, 'paymentLink')
    )
      throw new HTTPException(500, {
        cause: data,
        message: 'Failed to create Coinbase Onramp order',
      })

    return redirect === 'true'
      ? context.redirect(data.paymentLink.url)
      : context.json({ link: data.paymentLink.url, ...data })
  })
  .on(['GET', 'POST'], '/global', async (context) => {
    const { address, amount, email, environment } = context.req.query()
    const redirect = context.req.query('redirect') === 'true'
    const ipAddress =
      context.req.header('cf-connecting-ip') ??
      context.req.header('x-forwarded-for') ??
      getConnInfo(context).remote.address

    const url = new URL(context.env.WIDGET_URL)

    const silentSignUpResponse = await silentSignUp({ email })

    if (silentSignUpResponse.status !== 200) {
      console.error(
        silentSignUpResponse.code,
        silentSignUpResponse.message,
        silentSignUpResponse.status,
      )
      throw new HTTPException(500, {
        cause: silentSignUpResponse,
        message: 'Failed to sign up',
      })
    }

    const signatureV2 = crypto
      .createHash('sha512')
      .update(
        `${address}${context.env.AUTH_SECRET_KEY}${ipAddress}${PORTO_MERCHANT_ID}`,
      )
      .digest('hex')

    const searchParams = new URLSearchParams({
      address,
      birth_date: '06/09/1989',
      currency: 'USDC',
      fiat_amount: amount,
      fiat_currency: 'USD',
      first_name: 'John',
      init_token: silentSignUpResponse.data.init_token,
      init_token_type: silentSignUpResponse.data.init_type_token,
      last_name: 'Doe',
      network: 'BASE',
      payment_method: 'apple',
      signature: `v2:${signatureV2}`,
      widget_flow: 'applepay_minimal',
      widget_id: context.env.WIDGET_ID,
    })

    url.search = searchParams.toString()

    return redirect
      ? context.redirect(url.toString())
      : context.json({ link: url.toString() })
  })
  .get(
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
        return context.json(
          { error: 'Could not create Stripe Onramp session. No redirect_url' },
          500,
        )
      }

      return context.redirect(data.redirect_url)
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

export { onrampApp }
