import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import * as Siwe from 'ox/Siwe'
import type { Chain, Client, Transport } from 'viem'
import type * as Capabilities from './schema/capabilities.js'

/** Set of authentication endpoints. */
export type AuthUrl = {
  /** Endpoint to logout the user. (e.g. `/logout`) */
  logout: string
  /** Endpoint to generate a nonce. (e.g. `/nonce`) */
  nonce: string
  /** Endpoint to verify the signature, and authenticate the user. (e.g. `/verify`) */
  verify: string
}

export async function authenticate(
  parameters: authenticate.Parameters,
): Promise<authenticate.ReturnType> {
  const { address, authUrl, message, signature } = parameters

  const { chainId } = Siwe.parseMessage(message)

  return await fetch(authUrl.verify, {
    body: JSON.stringify({
      address,
      chainId,
      message,
      signature,
      walletAddress: address,
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).then((res) => res.json())
}

export declare namespace authenticate {
  type Parameters = {
    address: Address.Address
    authUrl: AuthUrl
    message: string
    signature: Hex.Hex
  }

  type ReturnType = {
    token?: string | undefined
  }
}

export async function buildMessage<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  siwe: Capabilities.signInWithEthereum.Request,
  options: buildMessage.Options,
) {
  const {
    chainId = client.chain?.id,
    domain,
    uri,
    resources,
    version = '1',
  } = siwe
  const { address } = options

  const authUrl = siwe.authUrl ? resolveAuthUrl(siwe.authUrl) : undefined

  if (!chainId) throw new Error('`chainId` is required.')
  if (!domain) throw new Error('`domain` is required.')
  if (!siwe.nonce && !authUrl?.nonce)
    throw new Error('`nonce` or `authUrl.nonce` is required.')
  if (!uri) throw new Error('`uri` is required.')

  const nonce = await (async () => {
    if (siwe.nonce) return siwe.nonce
    if (!authUrl?.nonce)
      throw new Error('`nonce` or `authUrl.nonce` is required.')
    const response = await fetch(authUrl.nonce, {
      body: JSON.stringify({
        address,
        chainId,
        walletAddress: address,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const res = await response.json().catch(() => undefined)
    if (!res?.nonce) throw new Error('`nonce` or `authUrl.nonce` is required.')
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

export function resolveAuthUrl(
  authUrl: string | AuthUrl,
  origin = '',
): AuthUrl | undefined {
  if (!authUrl) return undefined

  const urls = (() => {
    if (typeof authUrl === 'string') {
      const url = authUrl.replace(/\/$/, '')
      return {
        logout: url + '/logout',
        nonce: url + '/nonce',
        verify: url + '/verify',
      }
    }
    return authUrl
  })()

  return {
    logout: resolveUrl(urls.logout, origin),
    nonce: resolveUrl(urls.nonce, origin),
    verify: resolveUrl(urls.verify, origin),
  }
}

function resolveUrl(url: string, origin: string) {
  if (!origin) return url
  if (!url.startsWith('/')) return url
  return origin + url
}
