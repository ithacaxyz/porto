import * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import * as Secp256k1 from 'ox/Secp256k1'
import * as Signature from 'ox/Signature'
import * as TypedData from 'ox/TypedData'
import type * as WebAuthnP256 from 'ox/WebAuthnP256'
import {
  hashMessage,
  hashTypedData,
  type LocalAccount,
  type PartialBy,
} from 'viem'
import { toAccount } from 'viem/accounts'
import type { Assign, Compute } from '../core/internal/types.js'
import type * as Storage from '../core/Storage.js'
import * as Key from './Key.js'

export type Account<
  source extends 'porto' | 'privateKey' = 'porto' | 'privateKey',
> = LocalAccount<source> & {
  keys?: readonly Key.Key[] | undefined
  sign: NonNullable<LocalAccount['sign']>
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
  const source = account.sign ? 'privateKey' : 'porto'

  const {
    address,
    sign: sign_,
    signMessage,
    signTransaction,
    signTypedData,
    type,
  } = toAccount({
    address: account.address,
    sign({ hash }) {
      if (source === 'privateKey') return account.sign!({ hash })
      throw new Error('`sign` not supported on porto accounts.')
    },
    signMessage({ message }) {
      return this.sign!({
        hash: hashMessage(message),
      })
    },
    signTransaction() {
      throw new Error('`signTransaction` not supported on porto accounts.')
    },
    signTypedData(typedData) {
      return this.sign!({
        hash: hashTypedData(typedData),
      })
    },
  })
  return {
    address,
    keys: account.keys ?? undefined,
    sign: sign_,
    signMessage,
    signTransaction,
    signTypedData,
    source,
    type,
  } as never
}

export declare namespace from {
  type AccountParameter = PartialBy<
    Pick<Account, 'address' | 'keys' | 'sign'>,
    'sign'
  >

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
    Assign<
      Account,
      account extends AccountParameter ? account : { address: account }
    > & {
      source: account extends { sign: NonNullable<LocalAccount['sign']> }
        ? 'privateKey'
        : 'porto'
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
    async sign({ hash }) {
      return Signature.toHex(
        Secp256k1.sign({
          payload: hash,
          privateKey,
        }),
      )
    },
    source: 'privateKey',
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
    (Omit<Account, 'keys'> &
      (options['keys'] extends readonly Key.Key[]
        ? { keys: options['keys'] }
        : { keys?: Account['keys'] })) & { source: 'privateKey' }
  >
}

export function getKey(
  account: Account,
  parameters: getKey.Parameters = {},
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
  const { storage, replaySafe = true, wrap = true, webAuthn } = parameters

  const key = getKey(account, parameters)

  const payload = (() => {
    if (!replaySafe) return parameters.payload
    return TypedData.getSignPayload({
      domain: { verifyingContract: account.address },
      message: {
        digest: parameters.payload,
      },
      primaryType: 'ERC1271Sign',
      types: {
        ERC1271Sign: [{ name: 'digest', type: 'bytes32' }],
      },
    })
  })()

  const sign = (() => {
    if (!key) {
      if (account.source === 'privateKey') return account.sign
      return undefined
    }
    return ({ hash }: { hash: Hex.Hex }) =>
      Key.sign(key, {
        address: null,
        payload: hash,
        storage,
        webAuthn,
        wrap,
      })
  })()

  // If the account has no valid signing key, then we cannot sign the payload.
  if (!sign) throw new Error('cannot find key to sign with.')

  // Sign the payload.
  return await sign({ hash: payload })
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
     * Whether to use replay-safe signing.
     * `false` if replay-safe signing is not needed (e.g. signing call bundles).
     */
    replaySafe?: boolean
    /**
     * Role to extract the key from the `account` for signing.
     */
    role?: Key.Key['role'] | undefined
    /**
     * Storage to use for keytype-specific caching (e.g. WebAuthn user verification).
     */
    storage?: Storage.Storage | undefined
    /**
     * Whether to wrap the signature with key metadata.
     */
    wrap?: boolean | undefined
    /**
     * WebAuthn helpers for non-browser environments (e.g., React Native passkeys).
     */
    webAuthn?:
      | {
          createFn?:
            | WebAuthnP256.createCredential.Options['createFn']
            | undefined
          getFn?: WebAuthnP256.sign.Options['getFn'] | undefined
        }
      | undefined
  }
}
