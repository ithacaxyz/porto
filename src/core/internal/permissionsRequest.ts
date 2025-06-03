import * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'

import * as Key from '../../viem/Key.js'
import * as Permissions from './typebox/permissions.js'
import type { StaticDecode } from './typebox/typebox.js'

export const Schema = Permissions.Request

export type PermissionsRequest = StaticDecode<typeof Schema>

export function fromKey(key: Key.Key): PermissionsRequest {
  const { expiry, permissions, publicKey, type } = key
  return {
    expiry,
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
): Promise<Key.Key | undefined> {
  if (!request) return undefined

  const expiry = request.expiry ?? 0
  const permissions = request.permissions ?? {}

  if (!request.key) {
    return await Key.createWebCryptoP256({
      expiry,
      permissions,
      role: 'session',
    })
  }

  const type = request.key.type ?? 'secp256k1'
  const publicKey = request.key.publicKey

  return Key.from({
    expiry,
    permissions,
    publicKey,
    role: 'session',
    type,
  })
}
