import { Database } from 'bun:sqlite'
import * as Bun from 'bun'
import * as JoseMourinho from 'jose'
import { Porto } from 'porto'
import { RelayClient } from 'porto/viem'
import {
  generateSiweNonce,
  parseSiweMessage,
  verifySiweMessage,
} from 'viem/siwe'

const JWT_SECRET = Bun.env.JWT_SECRET
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set')

/**
 * In production you will want to have a stricter CORS policy.
 */
const headers = new Headers({
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
})

const siweHeaders = (() => {
  const baseHeaders = new Headers(headers)
  baseHeaders.set('Access-Control-Allow-Credentials', 'true')
  baseHeaders.set(
    'Access-Control-Allow-Origin',
    'https://porto-relay-mode.ngrok.io',
  )
  return baseHeaders
})()

const porto = Porto.create()

const database = new Database(':memory:')

database.run(/* sql */ `
  CREATE TABLE IF NOT EXISTS nonce (
    nonce TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  )
`)

const server = Bun.serve({
  development: Bun.env.NODE_ENV !== 'production',
  error: (error) =>
    Response.json(
      { error: error.message },
      { headers: siweHeaders, status: 500 },
    ),
  port: Number(Bun.env.PORT || 69_69),
  routes: {
    '/': Response.json({ ok: new Date().toISOString() }, { headers }),
    '/.well-known/apple-app-site-association': {
      GET: async () => {
        return Response.json(
          await Bun.file('./apple-app-site-association').json(),
          { headers },
        )
      },
    },
    '/.well-known/apple-app-site-association.json': Response.redirect(
      '/.well-known/apple-app-site-association',
    ),
    '/.well-known/assetlinks.json': {
      GET: async () =>
        Response.json(await Bun.file('./assetlinks.json').json(), {
          headers,
        }),
    },
    '/api/me': async (request) => {
      const token = request.cookies.get('auth')

      if (!token)
        return Response.json(
          { error: 'Unauthorized' },
          { headers: siweHeaders, status: 401 },
        )

      const { payload } = await JoseMourinho.jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET),
      )

      return Response.json(payload, { headers: siweHeaders })
    },
    '/api/siwe/logout': async (request) => {
      request.cookies.delete('auth')
      return Response.json(
        { success: true },
        { headers: siweHeaders, status: 204 },
      )
    },
    '/api/siwe/nonce': {
      OPTIONS: () => new Response(null, { headers: siweHeaders }),
      POST: async () => {
        const nonce = generateSiweNonce()

        database.run(
          'INSERT INTO nonce (nonce, status, expires_at) VALUES (?, ?, ?)',
          [nonce, 'valid', Math.floor(Date.now() / 1_000) + 3_600], // 1 hour
        )

        return Response.json({ nonce }, { headers: siweHeaders })
      },
    },
    '/api/siwe/verify': {
      OPTIONS: () => new Response(null, { headers: siweHeaders }),
      POST: async (request) => {
        const { message, signature } = await request.json()

        const { address, chainId, nonce } = parseSiweMessage(message)

        if (!nonce)
          return Response.json(
            { error: 'Nonce is required' },
            { headers: siweHeaders, status: 400 },
          )

        const nonceSession = database.run(
          'SELECT * FROM nonce WHERE nonce = ?',
          [nonce],
        )
        if (!nonceSession)
          return Response.json(
            { error: 'Invalid or expired nonce' },
            { headers: siweHeaders, status: 401 },
          )

        database.run('DELETE FROM nonce WHERE nonce = ?', [nonce])

        const client = RelayClient.fromPorto(porto, { chainId })
        const valid = await verifySiweMessage(client, {
          address,
          message,
          signature,
        })

        if (!valid)
          return Response.json(
            { error: 'Invalid signature' },
            { headers: siweHeaders, status: 401 },
          )

        const maxAge = 60 * 60 * 24 * 7
        const exp = Math.floor(Date.now() / 1000) + maxAge

        const token = await new JoseMourinho.SignJWT({
          sub: address,
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime(exp)
          .sign(new TextEncoder().encode(JWT_SECRET))

        request.cookies.set('auth', token, {
          httpOnly: true,
          maxAge,
          path: '/',
          sameSite: 'none',
          secure: true,
        })

        return Response.json({ success: true }, { headers: siweHeaders })
      },
    },
  },
})

const stopAndExit = () => [server.stop(), process.exit(0)]

process.on('SIGINT', () => stopAndExit())
process.on('SIGTERM', () => stopAndExit())
process.on('SIGQUIT', () => stopAndExit())

if (Bun.env.NODE_ENV === 'development')
  console.info(`Server running on http://localhost:${server.port}`)
else console.info(`Server running on port ${server.port}`)
