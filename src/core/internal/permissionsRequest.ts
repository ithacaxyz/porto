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
  const type = request.key?.type ?? 'secp256k1'
  const feeToken = request.feeToken
  const permissions = Key.resolvePermissions(request, {
    feeTokens: options.feeTokens,
  })
  const publicKey = request?.key?.publicKey ?? '0x'

  const key = Key.from({
    chainId,
    expiry,
    feeToken,
    permissions,
    publicKey,
    role: 'session',
    type,
  })
  if (request?.key) return key

  return await Key.createWebCryptoP256({
    ...key,
    role: 'session',
  })
}

export declare namespace toKey {
  export type Options = {
    chainId?: number | undefined
    feeTokens?: Tokens.Tokens | undefined
  }
}
