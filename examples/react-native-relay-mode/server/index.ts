import NodePath from 'node:path'
import * as Bun from 'bun'
import * as JoseMourinho from 'jose'
import { Porto } from 'porto'
import { RelayClient } from 'porto/viem'
import {
  generateSiweNonce,
  parseSiweMessage,
  verifySiweMessage,
} from 'viem/siwe'

const porto = Porto.create()

const JWT_SECRET = Bun.env.JWT_SECRET
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set')

/**
 * In production you will want to have a stricter CORS policy.
 */
const headers = new Headers({
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Private-Network': 'true',
})

const server = Bun.serve({
  port: Number(Bun.env.PORT || 69_69),
  routes: {
    '/': Response.json({ ok: new Date().toISOString() }, { headers }),
    '/.well-known/apple-app-site-association': async () =>
      Response.json(
        await Bun.file(
          NodePath.join(import.meta.dirname, './apple-app-site-association'),
        ).json(),
        { headers },
      ),
    '/.well-known/apple-app-site-association.json': Response.redirect(
      '/.well-known/apple-app-site-association',
    ),
    '/.well-known/assetlinks.json': async () =>
      Response.json(
        await Bun.file(
          NodePath.join(import.meta.dirname, './assetlinks.json'),
        ).json(),
        { headers },
      ),

    '/api/me': async (request) => {
      const token = request.cookies.get('auth')
      if (!token)
        return Response.json(
          { error: 'Unauthorized' },
          { headers, status: 401 },
        )

      const { payload } = await JoseMourinho.jwtDecrypt(
        token,
        JoseMourinho.base64url.decode(Bun.env.JWT_SECRET),
      )
      return Response.json(payload, { headers })
    },
    '/api/siwe/logout': async (request) => {
      request.cookies.delete('auth')
      return Response.json({ success: true }, { headers, status: 204 })
    },
    '/api/siwe/nonce': async () => {
      const nonce = generateSiweNonce()

      await Promise.all([
        Bun.redis.set(nonce, 'valid'),
        Bun.redis.expire(nonce, 600),
      ])

      return Response.json({ nonce }, { headers })
    },
    '/api/siwe/verify': async (request) => {
      const { message, signature } = await request.json()
      const { address, chainId, nonce } = parseSiweMessage(message)

      if (!nonce)
        return Response.json(
          { error: 'Nonce is required' },
          { headers, status: 400 },
        )

      const nonceSession = await Bun.redis.get(nonce)
      if (!nonceSession)
        return Response.json(
          { error: 'Invalid or expired nonce' },
          { headers, status: 401 },
        )

      await Bun.redis.del(nonce)

      const client = RelayClient.fromPorto(porto, { chainId })
      const valid = await verifySiweMessage(client, {
        address,
        message,
        signature,
      })

      const maxAge = 60 * 60 * 24 * 7
      const exp = Math.floor(Date.now() / 1000) + maxAge

      if (!valid)
        return Response.json(
          { error: 'Invalid signature' },
          { headers, status: 401 },
        )

      const token = await new JoseMourinho.SignJWT({
        sub: address,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(exp)
        .sign(new TextEncoder().encode(Bun.env.JWT_SECRET))

      request.cookies.set('auth', token, {
        httpOnly: true,
        maxAge,
        path: '/',
        sameSite: 'lax',
        secure: true,
      })

      return Response.json({ success: true }, { headers })
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
