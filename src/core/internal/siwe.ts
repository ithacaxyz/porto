import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import * as Siwe from 'ox/Siwe'
import type { Chain, Client, Transport } from 'viem'
import type * as Capabilities from './typebox/capabilities.js'

export async function authenticate(parameters: authenticate.Parameters) {
  const { authUrl, message, signature } = parameters

  return await fetch(authUrl, {
    body: JSON.stringify({
      message,
      signature,
    }),
    method: 'POST',
  }).then((response) => response.headers.get('x-siwe-token') ?? undefined)
}

export declare namespace authenticate {
  type Parameters = {
    authUrl: string
    message: string
    signature: Hex.Hex
  }
}

export async function buildMessage<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  siwe: Capabilities.signInWithEthereum.Request,
  options: buildMessage.Options,
) {
  const {
    authUrl,
    chainId = client.chain?.id,
    domain,
    uri,
    resources,
    version = '1',
  } = siwe

  if (!chainId) throw new Error('chainId is required.')
  if (!domain) throw new Error('domain is required.')
  if (!siwe.nonce && !authUrl) throw new Error('nonce is required.')
  if (!uri) throw new Error('uri is required.')

  const nonce = await (async () => {
    if (siwe.nonce) return siwe.nonce
    const response = await fetch(authUrl?.replace(/\/$/, '') + '/nonce')
    const res = await response.json()
    if (!res?.nonce) throw new Error('nonce is required.')
    return res.nonce
  })()

  const message = Siwe.createMessage({
    ...siwe,
    address: options.address,
    chainId,
    domain,
    nonce,
    resources: resources as string[] | undefined,
    uri,
    version,
  })

  return message
}

export declare namespace buildMessage {
  type Options = {
    address: Address.Address
  }
}
