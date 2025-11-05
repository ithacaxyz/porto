import { env } from 'cloudflare:workers'
import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import * as jwt from 'hono/jwt'
import { Porto } from 'porto'
import { RelayClient } from 'porto/viem'
import {
  generateSiweNonce,
  parseSiweMessage,
  verifySiweMessage,
} from 'viem/siwe'

const app = new Hono<{ Bindings: Cloudflare.Env }>().basePath('/api')

function createCorsHeaders(request: Request) {
  const origin = request.headers.get('Origin') ?? 'https://id.porto.sh'
  const headers = new Headers({
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Private-Network': 'true',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  })
  return headers
}

app.options('*', (c) =>
  c.json({ success: true }, { headers: createCorsHeaders(c.req.raw) }),
)

app.options('/siwe/nonce', (c) =>
  c.json({ success: true }, { headers: createCorsHeaders(c.req.raw) }),
)
app.on(['GET', 'POST'], '/siwe/nonce', async (c) => {
  const headers = createCorsHeaders(c.req.raw)
  // Generate a nonce to be used in the SIWE message.
  // This is used to prevent replay attacks.
  const nonce = generateSiweNonce()

  // Store nonce for this session (10 minutes).
  await c.env.NONCE_STORE.put(nonce, 'valid', { expirationTtl: 600 })

  return c.json({ nonce }, { headers })
})

app.options('/siwe/verify', (c) =>
  c.json({ success: true }, { headers: createCorsHeaders(c.req.raw) }),
)
app.post('/siwe/verify', async (c) => {
  const headers = createCorsHeaders(c.req.raw)
  const existingToken = getCookie(c, 'auth')
  if (existingToken) {
    try {
      await jwt.verify(existingToken, c.env.JWT_SECRET)
      return c.json({ success: true }, { headers })
    } catch {
      // ignore and continue with verification flow
    }
  }
  // Extract properties from the request body and SIWE message.
  const { message, signature } = await c.req.json()
  const siweMessage = parseSiweMessage(message)
  const { address, chainId, nonce } = siweMessage

  // If there is no nonce, we cannot verify the signature.
  if (!nonce)
    return c.json({ error: 'Nonce is required' }, { headers, status: 400 })

  // Check if the nonce is valid for this session.
  const nonce_session = await c.env.NONCE_STORE.get<string | null>(nonce)
  if (!nonce_session)
    return c.json(
      { error: 'Invalid or expired nonce' },
      { headers, status: 401 },
    )

  if (nonce_session.startsWith('used:')) {
    const usedSignature = nonce_session.slice('used:'.length)
    if (usedSignature === signature) {
      const maxAge = 60 * 60 * 24 * 7 // 7 days
      const exp = Math.floor(Date.now() / 1000) + maxAge
      const token = await jwt.sign({ exp, sub: address }, c.env.JWT_SECRET)
      await c.env.NONCE_STORE.put(nonce, `used:${signature}`, {
        expirationTtl: 60,
      })
      setCookie(c, 'auth', token, {
        httpOnly: true,
        maxAge,
        path: '/',
        sameSite: 'none',
        secure: true,
      })
      return c.json({ success: true }, { headers })
    }
    return c.json(
      { error: 'Invalid or expired nonce' },
      { headers, status: 401 },
    )
  }

  const porto = Porto.create()

  // Verify the signature.
  const client = RelayClient.fromPorto(porto, { chainId })
  const valid = await verifySiweMessage(client, {
    address: address!,
    message,
    signature,
  })

  // If the signature is invalid, we cannot authenticate the user.
  if (!valid)
    return c.json({ error: 'Invalid signature' }, { headers, status: 401 })

  const maxAge = 60 * 60 * 24 * 7 // 7 days
  const exp = Math.floor(Date.now() / 1000) + maxAge

  // Issue a JWT token for the user in a HTTP-only cookie.
  const token = await jwt.sign({ exp, sub: address }, c.env.JWT_SECRET)
  await c.env.NONCE_STORE.put(nonce, `used:${signature}`, {
    expirationTtl: 60,
  })
  setCookie(c, 'auth', token, {
    httpOnly: true,
    maxAge,
    path: '/',
    sameSite: 'none',
    secure: true,
  })

  return c.json({ success: true }, { headers })
})

app.options('/siwe/logout', (c) =>
  c.json({ success: true }, { headers: createCorsHeaders(c.req.raw) }),
)
app.post(
  '/siwe/logout',
  jwt.jwt({ cookie: 'auth', secret: env.JWT_SECRET }),
  async (c) => {
    const headers = createCorsHeaders(c.req.raw)
    deleteCookie(c, 'auth')
    return c.json({ success: true }, { headers })
  },
)
app.options('/me', (c) =>
  c.json({ success: true }, { headers: createCorsHeaders(c.req.raw) }),
)
app.get(
  '/me',
  jwt.jwt({ cookie: 'auth', secret: env.JWT_SECRET }),
  async (c) => {
    const headers = createCorsHeaders(c.req.raw)
    return c.json(c.get('jwtPayload'), { headers })
  },
)

export default app satisfies ExportedHandler<Cloudflare.Env>
