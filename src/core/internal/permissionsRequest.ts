import type * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'

import * as Key from './key.js'
import * as Permissions from './typebox/permissions.js'
import type { StaticDecode } from './typebox/schema.js'

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
  options?: toKey.Options,
): Promise<Key.Key | undefined> {
  if (!request) return undefined

  const { feeToken } = options ?? {}

  const feeSpendPermission = feeToken?.permissionSpendLimit
    ? ({
        ...feeToken.permissionSpendLimit,
        token: feeToken.address,
      } satisfies Key.SpendPermission)
    : undefined

  const expiry = request.expiry ?? 0
  const type = request.key?.type ?? 'secp256k1'

  // TODO: remove once spend permissions on fees are supported. this is a workaround
  //       and it definitely not prod ready.
  const spendPermissions_tmp = request.permissions?.spend?.map((permission) => {
    if (feeSpendPermission && permission.token === feeSpendPermission?.token) {
      return {
        ...permission,
        limit: permission.limit + feeSpendPermission.limit,
      }
    }
    return permission
  })
  const permissions = {
    ...request.permissions,
    ...(spendPermissions_tmp && {
      spend: spendPermissions_tmp,
    }),
  }
  const publicKey = request?.key?.publicKey ?? '0x'

  const key = Key.from({
    expiry,
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
    /**
     * Fee token to use for permission requests.
     */
    feeToken?:
      | {
          /**
           * Fee token address.
           */
          address?: Address.Address | undefined
          /**
           * Spending limit to pay for fees on this key.
           */
          permissionSpendLimit?:
            | Pick<Key.SpendPermission, 'limit' | 'period'>
            | undefined
        }
      | undefined
  }
}
