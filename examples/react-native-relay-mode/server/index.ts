import NodePath from 'node:path'
import * as JoseMourinho from 'jose'
import { Porto } from 'porto'
import { RelayClient } from 'porto/viem'
import {
  generateSiweNonce,
  parseSiweMessage,
  verifySiweMessage,
} from 'viem/siwe'

const porto = Porto.create()

const headers = new Headers({
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Private-Network': 'true',
})

const JWT_SECRET = Bun.env.JWT_SECRET
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set')

const server = Bun.serve({
  fetch: (request) => fetch(request, { headers }),
  port: Number(Bun.env.PORT || 69_69),
  routes: {
    '/': () => new Response('ok', { headers }),
    '/.well-known/apple-app-site-association': async (request, server) => {
      const url = new URL(request.url)
      const ipAddress = server.requestIP(request)
      console.info(`Request from ${ipAddress?.address} ${url.pathname}`)

      const filePath = NodePath.join(
        import.meta.dirname,
        './apple-app-site-association',
      )

      return Response.json(await Bun.file(filePath).json(), { headers })
    },
    '/.well-known/apple-app-site-association.json': async () =>
      Response.redirect('/.well-known/apple-app-site-association', 301),
    '/.well-known/assetlinks.json': async (request, server) => {
      const url = new URL(request.url)
      const ipAddress = server.requestIP(request)
      console.info(`Request from ${ipAddress?.address} ${url.pathname}`)

      const filePath = NodePath.join(import.meta.dirname, './assetlinks.json')

      return Response.json(await Bun.file(filePath).json(), { headers })
    },
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
    '/api/siwe/logout': async (request, server) => {
      const url = new URL(request.url)
      const ipAddress = server.requestIP(request)
      console.info(`Request from ${ipAddress?.address} ${url.pathname}`)

      request.cookies.delete('auth')
      return Response.json({ success: true }, { headers, status: 204 })
    },
    '/api/siwe/nonce': () =>
      Response.json({ nonce: generateSiweNonce() }, { headers }),
    '/api/siwe/verify': async (request, server) => {
      const url = new URL(request.url)
      const ipAddress = server.requestIP(request)
      console.info(`Request from ${ipAddress?.address} ${url.pathname}`)

      const params = await request.json()
      const message = parseSiweMessage(params.message)
      const { address, chainId } = message

      // Verify the signature.
      const client = RelayClient.fromPorto(porto, { chainId })
      const valid = await verifySiweMessage(client, {
        message: message as string,
        signature: params.signature,
      })

      const maxAge = 60 * 60 * 24 * 7 // 7 days
      const exp = Math.floor(Date.now() / 1000) + maxAge

      if (!valid)
        return Response.json(
          { error: 'Invalid signature' },
          { headers, status: 401 },
        )

      const token = await new JoseMourinho.SignJWT()
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
  console.info(`Server is running on http://localhost:${server.port}`)
else console.info(`Server is running on port ${server.port}`)
