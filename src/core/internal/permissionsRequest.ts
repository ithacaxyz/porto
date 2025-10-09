import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import type * as z from 'zod/mini'
import * as Key from '../../viem/Key.js'
import * as Permissions from './schema/permissions.js'
import type * as Tokens from './tokens.js'

export const Schema = Permissions.Request

export type PermissionsRequest = z.infer<typeof Schema>

export function fromKey(key: Key.Key): PermissionsRequest {
  const { expiry, feeToken, permissions, publicKey, type } = key
  return {
    expiry,
    feeToken: feeToken ?? null,
    key: {
      publicKey,
      type,
    },
    permissions: (permissions ?? {}) as never,
  }
}

export declare namespace fromKey {
  export type Options = {
    address: Address.Address
    chainId?: Hex.Hex | undefined
  }
}

export async function toKey(
  request: PermissionsRequest | undefined,
  options: toKey.Options = {},
): Promise<Key.Key | undefined> {
  if (!request) return undefined

  const chainId = options.chainId ?? request.chainId
  const expiry = request.expiry ?? 0
  const feeToken = request.feeToken
  const permissions = Key.resolvePermissions(request, {
    feeTokens: options.feeTokens,
  })
  const baseParameters = {
    chainId,
    expiry,
    feeToken,
    permissions,
    role: 'session' as const,
  }

  if (request?.key)
    return Key.from({
      ...baseParameters,
      publicKey: request.key.publicKey,
      type: request.key.type ?? 'secp256k1',
    })

  const hasWebCryptoSubtle =
    typeof globalThis.crypto?.subtle?.generateKey === 'function'

  if (hasWebCryptoSubtle)
    try {
      return await Key.createWebCryptoP256(baseParameters)
    } catch (error) {
      if (!isWebCryptoUnavailable(error)) throw error
    }

  return Key.createP256(baseParameters)
}

export declare namespace toKey {
  export type Options = {
    chainId?: number | undefined
    feeTokens?: Tokens.Tokens | undefined
  }
}

function isWebCryptoUnavailable(error: unknown) {
  if (!(error instanceof Error)) return false
  const message = error.message?.toLowerCase() ?? ''
  return (
    error.name === 'TypeError' ||
    error.name === 'ReferenceError' ||
    message.includes('subtle') ||
    message.includes('generatekey')
  )
}
