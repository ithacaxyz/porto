import * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import * as Secp256k1 from 'ox/Secp256k1'
import * as Signature from 'ox/Signature'

import type * as Storage from '../Storage.js'
import * as Key from './key.js'
import type { Compute, RequiredBy } from './types.js'

/** A delegated account. */
export type Account = {
  address: Address.Address
  keys?: readonly Key.Key[] | undefined
  sign?: ((parameters: { payload: Hex.Hex }) => Promise<Hex.Hex>) | undefined
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
  return account as never
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
    account extends AccountParameter ? account : { address: account }
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
          payload,
          privateKey,
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

export function getKey(
  account: Account,
  parameters: getKey.Parameters,
): Key.Key | undefined {
  const { key, role } = parameters

  if (key === null) return undefined

  // Extract from `key` parameter.
  if (typeof key === 'object') return key

  // Extract from `account.keys` (with optional `key` index).
  if (account.keys && account.keys.length > 0) {
    if (typeof key === 'number') return account.keys[key]
    return account.keys.find(
      (key) => key.privateKey && (!role || key.role === role),
    )
  }

  return undefined
}

export declare namespace getKey {
  type Parameters = {
    key?: number | Key.Key | null | undefined
    role?: Key.Key['role'] | undefined
  }
}

/**
 * Extracts a signing key from a delegated account and signs a payload.
 *
 * @example
 * TODO
 *
 * @param parameters - Parameters.
 * @returns Signature.
 */
export async function sign(
  account: Account,
  parameters: sign.Parameters,
): Promise<Compute<Hex.Hex>> {
  const { payload, storage } = parameters

  const key = getKey(account, parameters)

  const sign = (() => {
    // If we have no key, use the root signing key.
    if (!key) return account.sign
    return (parameters: { payload: Hex.Hex }) =>
      Key.sign(key, {
        ...parameters,
        storage,
      })
  })()

  // If the account has no valid signing key, then we cannot sign the payload.
  if (!sign) throw new Error('cannot find key to sign with.')

  // Sign the payload.
  return await sign({ payload })
}

export declare namespace sign {
  type Parameters = {
    /**
     * Key to sign the payloads with.
     *
     * - If number, the key at the index will be used.
     * - If `Key.Key`, the provided key will be used.
     * - If `null`, the account's root signing key will be used.
     * - If not provided, a key will be extracted from the `account`.
     */
    key?: number | Key.Key | null | undefined
    /**
     * Payload to sign.
     */
    payload: Hex.Hex
    /**
     * Storage to use for keytype-specific caching (e.g. WebAuthn user verification).
     */
    storage?: Storage.Storage | undefined
  }
}
