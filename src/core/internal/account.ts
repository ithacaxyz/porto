import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'

import type * as Key from './key.js'

/** A delegated account. */
export type Account = {
  address: Address.Address
  delegation: Address.Address
  keys?: readonly Key.Key[] | undefined
  label?: string | undefined
  type: 'delegated'
}

/**
 * Instantiates a delegated account.
 *
 * @param account - Account to instantiate.
 * @returns An instantiated delegated account.
 */
export function from<const account extends from.Parameters>(
  account: account | from.Parameters,
): account & { type: 'delegated' } {
  return { ...account, type: 'delegated' } as never
}

export declare namespace from {
  type Parameters = Omit<Account, 'type'>
}

/**
 * Extracts a signing key from a delegated account and signs payload(s).
 *
 * @example
 * TODO
 *
 * @param parameters - Parameters.
 * @returns Signatures.
 */
export async function sign(
  account: Account,
  parameters: sign.Parameters,
): Promise<sign.ReturnType> {
  const { key, payloads } = parameters

  const [payload, authorizationPayload] = payloads

  // In order to sign (and perform) an authorization, we need the EOA's root key.
  // We will extract an "owner" key from either the `key` parameter or the provided `account`.
  const ownerKey = (() => {
    // Extract from `key` parameter.
    if (typeof key === 'object' && key.role === 'owner') return key
    if (typeof key === 'number' && account.keys?.[key]?.role === 'owner')
      return account.keys[key]

    // Extract from the `account`.
    return account.keys?.find((key) => key.role === 'owner')
  })()

  // If we have an authorization payload, but no "owner" key on the account,
  // then we cannot perform an authorization as we need the EOA's private key.
  if (authorizationPayload && !ownerKey?.sign)
    throw new Error('account does not have key of role "owner".')

  // Extract a key to sign the payload with.
  const signingKey = (() => {
    // Extract from `key` parameter.
    if (typeof key === 'object') return key

    // Extract from the `account` (with optional `key` index).
    if (!account.keys) return undefined
    if (typeof key === 'number') return account.keys[key]
    return account.keys[0]
  })()

  // If the account has no valid signing key, then we cannot sign the payload.
  if (!signingKey || !signingKey.sign)
    throw new Error('cannot find key to sign with.')

  // Sign the payload(s).
  const signatures = await Promise.all([
    signingKey.sign({ payload }),
    authorizationPayload && ownerKey?.sign
      ? ownerKey.sign({ payload: authorizationPayload })
      : undefined,
  ])

  return signatures as never
}

export declare namespace sign {
  type Parameters = {
    /**
     * Key to sign the payloads with. If not provided, a key will be extracted from the `account`.
     */
    key?: number | Key.Key | undefined
    /**
     * Payloads to sign.
     */
    payloads:
      | [executePayload: Hex.Hex]
      | [executePayload: Hex.Hex, authorizationPayload: Hex.Hex]
  }

  type ReturnType =
    | [executeSignature: Hex.Hex]
    | [executeSignature: Hex.Hex, authorizationSignature: Hex.Hex]
}
