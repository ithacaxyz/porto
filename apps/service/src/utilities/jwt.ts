import { Buffer } from 'node:buffer'
import * as crypto from 'node:crypto'
import type { JWTPayload } from 'hono/utils/jwt/types'

const KEY_NAME = process.env.COINBASE_SECRET_KEY_ID
const KEY_SECRET = process.env.COINBASE_SECRET_KEY

export async function generateJsonWebToken(params: {
  method: string
  host: string
  path: string
}): Promise<string> {
  const { method, host, path } = params
  const now = Math.floor(Date.now() / 1_000)

  const header = {
    alg: 'EdDSA',
    kid: KEY_NAME,
    nonce: crypto.randomBytes(16).toString('hex'),
    typ: 'JWT',
  }

  const headerBase64URL = Buffer.from(JSON.stringify(header)).toString(
    'base64url',
  )

  const payload = {
    exp: now + 2 * 60,
    iss: 'cdp',
    nbf: now,
    sub: KEY_NAME,
    uri: `${method} ${host}${path}`,
  } as const satisfies JWTPayload

  const payloadBase64URL = Buffer.from(JSON.stringify(payload)).toString(
    'base64url',
  )
  const message = `${headerBase64URL}.${payloadBase64URL}`

  const privateKeyBuffer = Buffer.from(KEY_SECRET, 'base64')
  const SN1_DER = Buffer.from('302e020100300506032b657004220420', 'hex')
  const privateKey = crypto.createPrivateKey({
    format: 'der',
    key: Buffer.concat([SN1_DER, privateKeyBuffer]),
    type: 'pkcs8',
  })

  const signature = crypto.sign(null, Buffer.from(message), privateKey)
  const signatureBase64url = signature.toString('base64url')

  return `${message}.${signatureBase64url}`
}
