import * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import * as Secp256k1 from 'ox/Secp256k1'
import * as Signature from 'ox/Signature'

import * as Key from './key.js'
import type { Compute, RequiredBy } from './types.js'

/** A delegated account. */
export type Account = {
  address: Address.Address
  keys?: readonly Key.Key[] | undefined
  sign?: ((parameters: { payload: Hex.Hex }) => Promise<Hex.Hex>) | undefined
  type: 'delegated'
}

/**
 * Instantiates a delegated account.
 *
 * @param account - Account to instantiate.
 * @returns An instantiated delegated account.
 */
export function from<const account extends from.Parameters>(
  parameters: from.Parameters<account>,
): Compute<from.ReturnType<account>> {
  const account = (
    typeof parameters === 'string' ? { address: parameters } : parameters
  ) as from.AccountParameter
  return { ...account, type: 'delegated' } as never
}

export declare namespace from {
  type AccountParameter = Omit<Account, 'type'>

  type Parameters<
    account extends Address.Address | AccountParameter =
      | Address.Address
      | AccountParameter,
  > = account | Address.Address | AccountParameter

  type ReturnType<
    account extends Address.Address | AccountParameter =
      | Address.Address
      | AccountParameter,
  > = Readonly<
    (account extends AccountParameter ? account : { address: account }) & {
      type: 'delegated'
    }
  >
}

/**
 * Instantiates a delegated account from a private key.
 *
 * @param privateKey - Private key.
 * @param options - Options.
 * @returns An instantiated delegated account.
 */
export function fromPrivateKey<
  const options extends fromPrivateKey.Options = fromPrivateKey.Options,
>(
  privateKey: Hex.Hex,
  options: options | fromPrivateKey.Options = {},
): Compute<fromPrivateKey.ReturnType<options>> {
  const { keys } = options
  const address = Address.fromPublicKey(Secp256k1.getPublicKey({ privateKey }))
  return from({
    address,
    keys,
    async sign({ payload }) {
      return Signature.toHex(
        Secp256k1.sign({
          privateKey,
          payload,
        }),
      )
    },
  }) as fromPrivateKey.ReturnType<options>
}

export declare namespace fromPrivateKey {
  type Options = {
    /**
     * Keys to instantiate.
     */
    keys?: readonly Key.Key[] | undefined
  }

  type ReturnType<options extends Options = Options> = Readonly<
    RequiredBy<Omit<Account, 'keys'>, 'sign'> &
      (options['keys'] extends readonly Key.Key[]
        ? { keys: options['keys'] }
        : { keys?: Account['keys'] })
  >
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
export async function sign<
  const account extends Account,
  payloads extends sign.Payloads,
>(
  account: account | Account,
  parameters: sign.Parameters<account, payloads>,
): Promise<Compute<payloads>> {
  const { payloads } = parameters

  const [payload, authorizationPayload] = payloads as {} as [Hex.Hex, Hex.Hex]

  // If we have an authorization payload, but no root signing key on the account,
  // then we cannot perform an authorization as we need the EOA's private key.
  if (authorizationPayload && !account.sign)
    throw new Error('cannot find root signing key to sign authorization.')

  // Extract a key to sign the payload with.
  const key = (() => {
    const key = parameters.key

    // Extract from `key` parameter.
    if (typeof key === 'object') return key

    // If we have an authorization payload, use the root signing key.
    if (authorizationPayload) return undefined

    // Extract from `account.keys` (with optional `key` index).
    if (account.keys && account.keys.length > 0) {
      if (typeof key === 'number') return account.keys[key]
      return account.keys.find((key) => key.canSign)
    }

    return undefined
  })()

  const sign = (() => {
    // If we have no key, use the root signing key.
    if (!key) return account.sign
    return (parameters: { payload: Hex.Hex }) =>
      Key.sign(key, {
        ...parameters,
        address: account.address,
      })
  })()

  // If the account has no valid signing key, then we cannot sign the payload.
  if (!sign) throw new Error('cannot find key to sign with.')

  // Sign the payload(s).
  const signatures = await Promise.all([
    sign({ payload }),
    authorizationPayload && account.sign
      ? account.sign({ payload: authorizationPayload })
      : undefined,
  ])

  return signatures as never
}

export declare namespace sign {
  type Parameters<
    account extends Account = Account,
    payloads extends Payloads = Payloads,
  > = {
    /**
     * Key to sign the payloads with. If not provided, a key will be extracted from the `account`.
     */
    key?: number | Key.Key | undefined
    /**
     * Payloads to sign.
     */
    payloads: payloads &
      (account extends { sign: NonNullable<Account['sign']> }
        ? Payloads
        : readonly [execute: Hex.Hex])
  }

  type Payloads =
    | readonly [execute: Hex.Hex]
    | readonly [execute: Hex.Hex, authorization: Hex.Hex]
}
