import { env } from 'cloudflare:workers'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { importJWK, type JWTPayload, SignJWT } from 'jose'
import { z } from 'zod'

const onrampApp = new Hono<{ Bindings: Cloudflare.Env }>()

const host = 'api.cdp.coinbase.com'

onrampApp.post(
  '/orders',
  zValidator(
    'json',
    z.object({
      address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
      amount: z.number().gte(1).lt(10_000),
      domain: z.string(),
      provider: z
        .union([z.literal('coinbase')])
        .optional()
        .default('coinbase'),
      sandbox: z.boolean(),
    }),
  ),
  async (c) => {
    const json = c.req.valid('json')

    switch (json.provider) {
      case 'coinbase': {
        const path = '/platform/v2/onramp/orders'
        const method = 'POST'
        const jwt = await generateCoinbaseJwt({
          keyId: env.CB_API_KEY_ID,
          keySecret: env.CB_API_KEY_SECRET,
          request: { method, path },
        })

        // TODO: get data from relay
        const email = 'tom@ithaca.xyz'
        const phoneNumber = '+16173125700'
        const agreementAcceptedAt = new Date().toISOString()
        const phoneNumberVerifiedAt = new Date().toISOString()

        const response = await fetch(`https://${host}${path}`, {
          body: JSON.stringify({
            agreementAcceptedAt,
            destinationAddress: json.address,
            destinationNetwork: 'base',
            domain: json.domain,
            email,
            partnerUserRef: `${json.sandbox ? 'sandbox-' : ''}${json.address}`,
            paymentCurrency: 'USD',
            paymentMethod: 'GUEST_CHECKOUT_APPLE_PAY',
            phoneNumber,
            phoneNumberVerifiedAt,
            purchaseAmount: json.amount.toString(),
            purchaseCurrency: 'USDC',
          }),
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
          method,
        })
        if (!response.ok)
          throw new HTTPException(response.status as never, {
            message: response.statusText,
          })

        const data = await response.json()
        const parsed = await z
          .object({
            order: z.object({
              orderId: z.string(),
            }),
            paymentLink: z.object({
              paymentLinkType: z.literal('PAYMENT_LINK_TYPE_APPLE_PAY_BUTTON'),
              url: z.url(),
            }),
          })
          .parseAsync(data)
        const typeLookup = {
          PAYMENT_LINK_TYPE_APPLE_PAY_BUTTON: 'apple',
        } as const
        return c.json({
          orderId: parsed.order.orderId,
          type: typeLookup[parsed.paymentLink.paymentLinkType],
          url: parsed.paymentLink.url,
        })
      }
    }
  },
)

export { onrampApp }

async function generateCoinbaseJwt(opts: {
  claims?: JWTPayload | undefined
  expiresIn?: number | undefined
  keyId: string
  keySecret: string
  nonce?: string | undefined
  now?: number | undefined
  request: {
    method: 'GET' | 'POST'
    host?: string | undefined
    path: string
  }
}) {
  const {
    claims = {
      aud: ['cdp_service'],
      iss: 'cdp',
      sub: opts.keyId,
      uris: [
        `${opts.request.method} ${opts.request.host ?? host}${opts.request.path}`,
      ],
    },
    expiresIn = 120,
    nonce = crypto.randomUUID(),
    now = Math.floor(Date.now() / 1000),
  } = opts
  const decoded = Buffer.from(opts.keySecret, 'base64')
  if (decoded.length !== 64) throw new Error('Invalid Ed25519 key length')

  const alg = 'EdDSA'
  const seed = decoded.subarray(0, 32)
  const publicKey = decoded.subarray(32)
  const key = await importJWK(
    {
      crv: 'Ed25519',
      d: seed.toString('base64url'),
      kty: 'OKP',
      x: publicKey.toString('base64url'),
    },
    alg,
  )

  return await new SignJWT(claims)
    .setProtectedHeader({
      alg,
      kid: opts.keyId,
      nonce,
      typ: 'JWT',
    })
    .setIssuedAt(now)
    .setNotBefore(now)
    .setExpirationTime(now + expiresIn)
    .sign(key)
}
