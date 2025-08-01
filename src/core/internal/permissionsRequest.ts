import * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import * as Value from 'ox/Value'
import { zeroAddress } from 'viem'
import * as Key from '../../viem/Key.js'
import type * as FeeTokens from './feeTokens.js'
import * as Permissions from './schema/permissions.js'

export const Schema = Permissions.Request

export type PermissionsRequest = typeof Schema.Type

export function fromKey(key: Key.Key): PermissionsRequest {
  const { expiry, feeLimit, permissions, publicKey, type } = key
  return {
    expiry,
    feeLimit,
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

  const { feeTokens = [] } = options

  const expiry = request.expiry ?? 0
  const feeLimit = request.feeLimit
  const type = request.key?.type ?? 'secp256k1'
  const permissions = resolvePermissions(request, {
    feeTokens,
  })
  const publicKey = request?.key?.publicKey ?? '0x'

  const key = Key.from({
    expiry,
    feeLimit,
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
    feeTokens?: FeeTokens.FeeTokens | undefined
  }
}

/**
 * Resolves the permissions for the permissions request, and if needed, adds
 * the fee limit to the spend permissions.
 *
 * @param request - Permissions request.
 * @param options - Options.
 * @returns Resolved permissions.
 */
export function resolvePermissions(
  request: Permissions.Request,
  options: resolvePermissions.Options,
) {
  const { permissions } = request
  const { feeTokens } = options

  const spend = permissions.spend ? [...permissions.spend] : []

  if (feeTokens && feeTokens.length > 0) {
    const feeLimit = getFeeLimit(request, {
      feeTokens,
    })

    if (feeLimit) {
      let index = -1
      let minPeriod: number = Key.toSerializedSpendPeriod.year

      const feeToken = feeTokens[0]!
      for (let i = 0; i < spend.length; i++) {
        const s = spend[i]!
        if (s.token && Address.isEqual(feeToken.address, s.token)) {
          index = i
          break
        }
        if (!s.token && feeToken.address === zeroAddress) {
          index = i
          break
        }

        const period = Key.toSerializedSpendPeriod[s.period]
        if (period < minPeriod) minPeriod = period
      }

      // If there is a token assigned to a spend permission and the fee token
      // is the same, update the limit to account for the fee.
      if (index !== -1)
        spend[index] = {
          ...spend[index]!,
          limit: spend[index]!.limit + feeLimit.value,
        }
      // Update the spend permissions to account for the fee token.
      else if (typeof minPeriod === 'number')
        spend.push({
          limit: feeLimit.value,
          period:
            Key.fromSerializedSpendPeriod[
              minPeriod as keyof typeof Key.fromSerializedSpendPeriod
            ],
          token: feeToken.address,
        })
    }
  }

  return { ...permissions, spend }
}

export declare namespace resolvePermissions {
  export type Options = {
    feeTokens?: FeeTokens.FeeTokens | undefined
  }
}

/**
 * Gets the fee limit (in units of the fee token) to be used for the
 * authorized permissions.
 *
 * @param request - The permissions request to get the fee limit for.
 * @param options - Options.
 * @returns Fee limit (in units of the fee token).
 */
export function getFeeLimit(
  request: Permissions.Request,
  options: getFeeLimit.Options,
): getFeeLimit.ReturnType {
  const { feeLimit } = request
  const { feeTokens } = options

  if (!feeLimit) return undefined

  const feeToken = feeTokens[0]!

  const limitToken = feeTokens.find((token) => {
    if (feeLimit.currency === 'USD') return token.kind.startsWith('USD')
    return (
      feeLimit.currency === token.symbol || feeLimit.currency === token.kind
    )
  })
  if (!limitToken) return undefined

  if (Address.isEqual(feeToken.address, limitToken.address))
    return {
      token: feeToken,
      value: Value.from(feeLimit.value, feeToken.decimals),
    }

  const value = Value.from(
    String(
      Number(feeLimit.value) *
        (Number(limitToken.nativeRate ?? 1n) /
          Number(feeToken.nativeRate ?? 1n)),
    ),
    feeToken.decimals,
  )

  return {
    token: feeToken,
    value,
  }
}

export declare namespace getFeeLimit {
  export type Options = {
    feeTokens: FeeTokens.FeeTokens
  }

  export type ReturnType =
    | {
        token: FeeTokens.FeeToken
        value: bigint
      }
    | undefined
}
