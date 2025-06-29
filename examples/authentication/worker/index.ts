import { env } from 'cloudflare:workers'
import { Hono } from 'hono'
import { deleteCookie, setCookie } from 'hono/cookie'
import * as jwt from 'hono/jwt'
import { Porto, ServerActions } from 'porto'
import { ServerClient } from 'porto/viem'
import { hashMessage } from 'viem'
import { generateSiweNonce, parseSiweMessage } from 'viem/siwe'

const porto = Porto.create()

const app = new Hono<{ Bindings: Env }>().basePath('/api')

app.get('/nonce', async (c) => {
  // Generate a nonce to be used in the SIWE message.
  // This is used to prevent replay attacks.
  const nonce = generateSiweNonce()

  // Store nonce for this session (10 minutes).
  await c.env.NONCE_STORE.put(nonce, 'valid', { expirationTtl: 600 })

  return c.text(nonce)
})

app.post('/auth', async (c) => {
  // Extract properties from the request body and SIWE message.
  const { message, signature } = await c.req.json()
  const { address, chainId, nonce } = parseSiweMessage(message)

  // If there is no nonce, we cannot verify the signature.
  if (!nonce) return c.json({ error: 'Nonce is required' }, 400)

  // Check if the nonce is valid for this session.
  const nonce_session = await c.env.NONCE_STORE.get(nonce)
  if (!nonce_session) return c.json({ error: 'Invalid or expired nonce' }, 401)

  await c.env.NONCE_STORE.delete(nonce)

  // Verify the signature.
  const client = ServerClient.fromPorto(porto, { chainId })
  const valid = ServerActions.verifySignature(client, {
    address: address!,
    digest: hashMessage(message),
    signature,
  })

  // If the signature is invalid, we cannot authenticate the user.
  if (!valid) return c.json({ error: 'Invalid signature' }, 401)

  const maxAge = 60 * 60 * 24 * 7 // 7 days
  const exp = Math.floor(Date.now() / 1000) + maxAge

  // Issue a JWT token for the user in a HTTP-only cookie.
  const token = await jwt.sign({ exp, sub: address }, c.env.JWT_SECRET)
  setCookie(c, 'auth', token, {
    httpOnly: true,
    maxAge,
    path: '/',
    sameSite: 'lax',
    secure: true,
  })

  return c.json({ success: true })
})

app.get(
  '/me',
  jwt.jwt({ cookie: 'auth', secret: env.JWT_SECRET }),
  async (c) => {
    return c.json(c.get('jwtPayload'))
  },
)

app.get(
  '/logout',
  jwt.jwt({ cookie: 'auth', secret: env.JWT_SECRET }),
  async (c) => {
    deleteCookie(c, 'auth')
    return c.json({ success: true })
  },
)

export default app satisfies ExportedHandler<Env>
