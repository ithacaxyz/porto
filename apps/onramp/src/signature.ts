import crypto from 'node:crypto'
import type Address from 'ox/Address'

export function generateSignature({
  data,
  secret,
}: {
  data: string
  secret: string
}) {
  if (!data || !secret) throw new Error('Invalid data or secret')
  const hash = crypto.createHmac('sha256', secret).update(data).digest('hex')
  return hash
}

/**
 * @see https://oor-redirect.redoc.ly/#section/Callbacks/Callback-Signature
 */
export function verifySignature({
  body,
  secret,
  signature,
}: {
  body: string
  secret: string
  signature: string
}) {
  if (!body || !secret || !signature) return false
  const hash = generateSignature({ data: body, secret })
  return hash === signature
}

export const constructSignature = ({
  secret,
  address,
}: {
  secret: string
  address: Address.Address
}) => crypto.createHash('sha512').update(`${address}${secret}`).digest('hex')
