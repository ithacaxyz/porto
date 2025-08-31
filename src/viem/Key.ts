import * as AbiFunction from 'ox/AbiFunction'
import * as AbiParameters from 'ox/AbiParameters'
import * as Address from 'ox/Address'
import * as Bytes from 'ox/Bytes'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import * as P256 from 'ox/P256'
import * as PublicKey from 'ox/PublicKey'
import * as Secp256k1 from 'ox/Secp256k1'
import * as Signature from 'ox/Signature'
import * as TypedData from 'ox/TypedData'
import * as Value from 'ox/Value'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import * as WebCryptoP256 from 'ox/WebCryptoP256'
import { zeroAddress } from 'viem'
import * as Call from '../core/internal/call.js'
import type * as RelayKey_schema from '../core/internal/relay/schema/key.js'
import type * as RelayPermission_schema from '../core/internal/relay/schema/permission.js'
import type * as Key_schema from '../core/internal/schema/key.js'
import type * as Tokens from '../core/internal/tokens.js'
import type {
  Compute,
  ExactPartial,
  Mutable,
  OneOf,
  PartialBy,
  RequiredBy,
  UnionOmit,
  UnionRequiredBy,
} from '../core/internal/types.js'
import type * as Storage from '../core/Storage.js'

type PrivateKeyFn = () => Hex.Hex

export type BaseKey<
  type extends string = string,
  privateKey = unknown,
> = Compute<
  Key_schema.WithPermissions & {
    /** Whether the key will need its digest (SHA256) prehashed when signing. */
    prehash?: boolean | undefined
    /** Private key. */
    privateKey?: privateKey | undefined
    /** Key type. */
    type: type
  }
>

export type Key = OneOf<
  AddressKey | P256Key | Secp256k1Key | WebCryptoKey | WebAuthnKey
>
export type AddressKey = BaseKey<'address'>
export type P256Key = BaseKey<'p256', PrivateKeyFn>
export type Secp256k1Key = BaseKey<'secp256k1', PrivateKeyFn>
export type WebCryptoKey = BaseKey<'p256', CryptoKey>
export type WebAuthnKey = BaseKey<
  'webauthn-p256',
  OneOf<
    | {
        credential: Pick<WebAuthnP256.P256Credential, 'id' | 'publicKey'>
        rpId: string | undefined
      }
    | {
        privateKey: PrivateKeyFn
      }
  >
>

export type Permissions = Key_schema.Permissions

/** RPC (relay-compatible) format of a key. */
export type Relay = RelayKey_schema.WithPermissions

/** Serialized (contract-compatible) format of a key. */
export type Serialized = {
  expiry: number
  isSuperAdmin: boolean
  keyType: number
  publicKey: Hex.Hex
}

export type SpendPermissions = Key_schema.SpendPermissions
export type SpendPermission = SpendPermissions[number]

/** Relay key type to key type mapping. */
export const fromRelayKeyType = {
  p256: 'p256',
  secp256k1: 'secp256k1',
  webauthnp256: 'webauthn-p256',
} as const

/** Relay key role to key role mapping. */
export const fromRelayKeyRole = {
  admin: 'admin',
  normal: 'session',
} as const

/** Serialized (contract-compatible) key type to key type mapping. */
export const fromSerializedKeyType = {
  0: 'p256',
  1: 'webauthn-p256',
  2: 'secp256k1',
} as const

/** Serialized (contract-compatible) spend period to period mapping. */
export const fromSerializedSpendPeriod = {
  0: 'minute',
  1: 'hour',
  2: 'day',
  3: 'week',
  4: 'month',
  5: 'year',
} as const

/** Key type to Relay key type mapping. */
export const toRelayKeyType = {
  address: 'secp256k1',
  p256: 'p256',
  secp256k1: 'secp256k1',
  'webauthn-p256': 'webauthnp256',
} as const

/** Key role to Relay key role mapping. */
export const toRelayKeyRole = {
  admin: 'admin',
  session: 'normal',
} as const

/** Key type to serialized (contract-compatible) key type mapping. */
export const toSerializedKeyType = {
  address: 2,
  p256: 0,
  secp256k1: 2,
  'webauthn-p256': 1,
} as const

/** Period to serialized (contract-compatible) spend period mapping. */
export const toSerializedSpendPeriod = {
  day: 2,
  hour: 1,
  minute: 0,
  month: 4,
  week: 3,
  year: 5,
} as const

/**
 * Creates a random P256 key.
 *
 * @example
 * ```ts
 * import * as Key from './key.js'
 *
 * // Admin Key
 * const key = Key.createP256()
 *
 * // Session Key
 * const key = Key.createP256({
 *   expiry: 1714857600,
 *   role: 'session',
 * })
 * ```
 *
 * @param parameters - Key parameters.
 * @returns P256 key.
 */
export function createP256(parameters: createP256.Parameters = {}) {
  const privateKey = P256.randomPrivateKey()
  return fromP256({
    ...parameters,
    privateKey,
  })
}

export declare namespace createP256 {
  type Parameters = Pick<
    fromP256.Parameters,
    'expiry' | 'feeToken' | 'permissions' | 'role'
  >
}

/**
 * Creates a random Secp256k1 key.
 *
 * @example
 * ```ts
 * import * as Key from './key.js'
 *
 * // Admin Key
 * const key = Key.createSecp256k1()
 *
 * // Session Key
 * const key = Key.createSecp256k1({
 *   expiry: 1714857600,
 *   role: 'session',
 * })
 * ```
 *
 * @param parameters - Key parameters.
 * @returns Secp256k1 key.
 */
export function createSecp256k1(parameters: createSecp256k1.Parameters = {}) {
  const privateKey = Secp256k1.randomPrivateKey()
  return fromSecp256k1({
    ...parameters,
    privateKey,
  })
}

export declare namespace createSecp256k1 {
  type Parameters = Pick<
    fromSecp256k1.Parameters,
    'expiry' | 'feeToken' | 'permissions' | 'role'
  >
}

/**
 * Creates a WebAuthnP256 key.
 *
 * @example
 * ```ts
 * import { Bytes } from 'ox'
 * import * as Key from './key.js'
 *
 * // Admin Key
 * const key = Key.createWebAuthnP256({
 *   label: 'My Key',
 *   userId: Bytes.from('0x0000000000000000000000000000000000000000'),
 * })
 *
 * // Session Key
 * const key = Key.createWebAuthnP256({
 *   expiry: 1714857600,
 *   label: 'My Key',
 *   role: 'session',
 *   userId: Bytes.from('0x0000000000000000000000000000000000000000'),
 * })
 * ```
 *
 * @param parameters - Key parameters.
 * @returns WebAuthnP256 key.
 */
export async function createWebAuthnP256(
  parameters: createWebAuthnP256.Parameters,
) {
  const { createFn, label, rpId, userId } = parameters

  const credential = await WebAuthnP256.createCredential({
    authenticatorSelection: {
      requireResidentKey: true,
      residentKey: 'required',
      userVerification: 'required',
    },
    createFn,
    extensions: {
      credProps: true,
    },
    rp: rpId
      ? {
          id: rpId,
          name: rpId,
        }
      : undefined,
    user: {
      displayName: label,
      id: new Uint8Array(userId ?? Bytes.fromString(label)),
      name: label,
    },
  })

  return fromWebAuthnP256({
    ...parameters,
    credential: {
      id: credential.id,
      publicKey: credential.publicKey,
    },
    id: userId
      ? Bytes.toHex(userId)
      : PublicKey.toHex(credential.publicKey, {
          includePrefix: false,
        }),
  })
}

export declare namespace createWebAuthnP256 {
  type Parameters = Pick<
    fromWebAuthnP256.Parameters,
    'expiry' | 'feeToken' | 'permissions' | 'role'
  > & {
    /**
     * Credential creation function. Useful for environments that do not support
     * the WebAuthn API natively (i.e. React Native or testing environments).
     *
     * @default window.navigator.credentials.create
     */
    createFn?: WebAuthnP256.createCredential.Options['createFn'] | undefined
    /** Label. */
    label: string
    /** Relying Party ID. */
    rpId?: string | undefined
    /** User ID. */
    userId?: Bytes.Bytes | undefined
  }
}

/**
 * Creates a random WebAuthn-wrapped P256 key.
 *
 * @example
 * ```ts
 * import * as Key from './key.js'
 *
 * // Admin Key
 * const key = Key.createHeadlessWebAuthnP256()
 *
 * // Session Key
 * const key = Key.createHeadlessWebAuthnP256({
 *   expiry: 1714857600,
 *   role: 'session',
 * })
 * ```
 *
 * @param parameters - Key parameters.
 * @returns P256 key.
 */
export function createHeadlessWebAuthnP256(
  parameters: createHeadlessWebAuthnP256.Parameters = {},
) {
  const privateKey = P256.randomPrivateKey()
  return fromHeadlessWebAuthnP256({
    ...parameters,
    privateKey,
  })
}

export declare namespace createHeadlessWebAuthnP256 {
  type Parameters = Pick<
    fromHeadlessWebAuthnP256.Parameters,
    'expiry' | 'feeToken' | 'permissions' | 'role'
  >
}

/**
 * Creates a random WebCryptoP256 key.
 *
 * @example
 * ```ts
 * import * as Key from './key.js'
 *
 * // Admin Key
 * const key = Key.createWebCryptoP256()
 *
 * // Session Key
 * const key = Key.createWebCryptoP256({
 *   expiry: 1714857600,
 *   role: 'session',
 * })
 * ```
 *
 * @param parameters - Key parameters.
 * @returns WebCryptoP256 key.
 */
export async function createWebCryptoP256(
  parameters: createWebCryptoP256.Parameters = {},
) {
  const keyPair = await WebCryptoP256.createKeyPair()
  return fromWebCryptoP256({
    ...parameters,
    keyPair,
  })
}

export declare namespace createWebCryptoP256 {
  type Parameters = Pick<
    fromWebCryptoP256.Parameters,
    'expiry' | 'feeToken' | 'permissions' | 'role'
  >
}

/**
 * Deserializes a key from its serialized format.
 *
 * @example
 * ```ts
 * import * as Key from './key.js'
 *
 * const key = Key.deserialize({
 *   expiry: 0,
 *   isSuperAdmin: false,
 *   keyType: 0,
 *   publicKey: '0x04ec0effa5f2f378cbf7fd2fa7ca1e8dc51cf777c129fa1c00a0e9a9205f2e511ff3f20b34a4e0b50587d055c0e0fad33d32cf1147d3bb2538fbab0d15d8e65008',
 * })
 * ```
 *
 * @param serialized - Serialized key.
 * @returns Key.
 */
export function deserialize(
  serialized: Serialized,
  options: deserialize.Options = {},
): Key {
  const { chainId } = options
  const publicKey = serialized.publicKey
  const type = (fromSerializedKeyType as any)[serialized.keyType]
  return from({
    chainId,
    expiry: serialized.expiry,
    publicKey,
    role: serialized.isSuperAdmin ? 'admin' : 'session',
    type,
  })
}

export declare namespace deserialize {
  type Options = {
    chainId?: number | undefined
  }
}

/**
 * Instantiates a key from its parameters.
 *
 * @example
 * ```ts
 * import { P256 } from 'ox'
 * import * as Key from './key.js'
 *
 * const privateKey = P256.randomPrivateKey()
 * const publicKey = P256.getPublicKey({ privateKey })
 *
 * const key = Key.from({
 *   expiry: 0,
 *   publicKey,
 *   async sign({ payload }) {
 *     return P256.sign({ payload, privateKey })
 *   },
 *   type: 'p256',
 * })
 * ```
 *
 * @param key - Key.
 * @returns Key.
 */
export function from<type extends Key['type']>(
  key: from.Value<type>,
  options: from.Options = {},
): Extract<Key, { type: type }> {
  const { chainId = key.chainId } = options
  const { expiry = 0, id, prehash = false, role = 'admin', type } = key

  const publicKey = (() => {
    const publicKey = key.publicKey
    if (publicKey === '0x') return publicKey
    if (type === 'secp256k1' || type === 'address') {
      const isAddress =
        Hex.size(publicKey) === 20 ||
        Hex.toBigInt(Hex.slice(publicKey, 0, 12)) === 0n
      const address = isAddress
        ? Hex.slice(publicKey, -20)
        : Address.fromPublicKey(PublicKey.fromHex(publicKey))
      return address
    }
    return publicKey
  })()

  return {
    ...key,
    chainId,
    expiry,
    hash: hash({
      publicKey,
      type,
    }),
    id: (id ?? publicKey).toLowerCase() as Hex.Hex,
    prehash,
    publicKey: publicKey.toLowerCase() as Hex.Hex,
    role,
    type,
  } satisfies BaseKey<string> as never
}

export declare namespace from {
  type Value<type extends Key['type'] = Key['type']> = OneOf<
    UnionRequiredBy<ExactPartial<UnionOmit<Key, 'hash'>>, 'publicKey'> & {
      type: type | Key['type']
    }
  >

  type Options = {
    chainId?: number | undefined
  }
}

/**
 * Instantiates a P256 key from its parameters.
 *
 * @example
 * ```ts
 * import { P256 } from 'ox'
 * import * as Key from './key.js'
 *
 * // Admin Key
 * const key = Key.fromP256({
 *   privateKey: P256.randomPrivateKey(),
 * })
 *
 * // Session Key
 * const key = Key.fromP256({
 *   expiry: 1714857600,
 *   privateKey: P256.randomPrivateKey(),
 *   role: 'session',
 * })
 * ```
 *
 * @param parameters - Key parameters.
 * @returns P256 key.
 */
export function fromP256(parameters: fromP256.Parameters) {
  const { chainId, expiry, feeToken, permissions, privateKey, role } =
    parameters
  const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
    includePrefix: false,
  })
  return from({
    chainId,
    expiry,
    feeToken,
    permissions,
    privateKey() {
      return privateKey
    },
    publicKey,
    role,
    type: 'p256',
  })
}

export declare namespace fromP256 {
  type Parameters = Pick<
    from.Value,
    'chainId' | 'expiry' | 'feeToken' | 'permissions' | 'role'
  > & {
    /** P256 private key. */
    privateKey: Hex.Hex
  }
}

/**
 * Converts a Relay-formatted key to a key.
 *
 * @example
 * TODO
 *
 * @param relayKey - Relay key.
 * @returns Key.
 */
export function fromRelay(relayKey: Relay, options: { chainId: number }): Key {
  const { chainId } = options
  const { publicKey } = relayKey

  const isAddress =
    Hex.size(publicKey) === 20 ||
    Hex.toBigInt(Hex.slice(publicKey, 0, 12)) === 0n

  const permissions: {
    calls?: Mutable<Key_schema.CallPermissions> | undefined
    spend?: Mutable<Key_schema.SpendPermissions> | undefined
  } = {}

  for (const permission of relayKey.permissions) {
    if (permission.type === 'call') {
      permissions.calls ??= []
      permissions.calls.push({
        signature: permission.selector,
        to: permission.to === Call.anyTarget ? undefined : permission.to,
      })
    }
    if (permission.type === 'spend') {
      permissions.spend ??= []
      permissions.spend.push({
        limit: permission.limit,
        period: permission.period,
        token: permission.token as Address.Address,
      })
    }
  }

  return from({
    chainId,
    expiry: relayKey.expiry,
    permissions: permissions as Permissions,
    publicKey: relayKey.publicKey,
    role: fromRelayKeyRole[relayKey.role],
    type: isAddress ? 'address' : fromRelayKeyType[relayKey.type],
  })
}

/**
 * Instantiates a Secp256k1 key from its parameters.
 *
 * @example
 * ```ts
 * import { Secp256k1 } from 'ox'
 * import * as Key from './key.js'
 *
 * // Admin Key
 * const key = Key.fromSecp256k1({
 *   privateKey: Secp256k1.randomPrivateKey(),
 * })
 *
 * // Session Key
 * const key = Key.fromSecp256k1({
 *   expiry: 1714857600,
 *   privateKey: Secp256k1.randomPrivateKey(),
 *   role: 'session',
 * })
 * ```
 *
 * @param parameters - Key parameters.
 * @returns Secp256k1 key.
 */
export function fromSecp256k1(parameters: fromSecp256k1.Parameters) {
  const { privateKey, role } = parameters
  const publicKey = (() => {
    if (parameters.publicKey) return parameters.publicKey
    if (privateKey)
      return Address.fromPublicKey(Secp256k1.getPublicKey({ privateKey }))
    return parameters.address.toLowerCase() as Hex.Hex
  })()
  return from({
    expiry: parameters.expiry ?? 0,
    feeToken: parameters.feeToken,
    permissions: parameters.permissions,
    privateKey: privateKey ? () => privateKey : undefined,
    publicKey,
    role,
    type: 'secp256k1',
  } as Secp256k1Key)
}

export declare namespace fromSecp256k1 {
  type Parameters = Pick<
    from.Value,
    'expiry' | 'feeToken' | 'permissions' | 'role'
  > &
    OneOf<
      | {
          /** Ethereum address. */
          address: Address.Address
        }
      | {
          /** Secp256k1 public key. */
          publicKey: Hex.Hex
        }
      | {
          /** Secp256k1 private key. */
          privateKey: Hex.Hex
        }
    >
}

/**
 * Instantiates a WebAuthnP256 key from its parameters.
 *
 * @example
 * ```ts
 * import { WebAuthnP256 } from 'ox'
 * import * as Key from './key.js'
 *
 * const credential = await WebAuthnP256.createCredential({ name: 'My Key' })
 *
 * // Admin Key
 * const key = Key.fromWebAuthnP256({
 *   credential,
 * })
 *
 * // Session Key
 * const key = Key.fromWebAuthnP256({
 *   expiry: 1714857600,
 *   credential,
 *   role: 'session',
 * })
 * ```
 *
 * @param parameters - Key parameters.
 * @returns WebAuthnP256 key.
 */
export function fromWebAuthnP256(parameters: fromWebAuthnP256.Parameters) {
  const { credential, id, rpId } = parameters
  const publicKey = PublicKey.toHex(credential.publicKey, {
    includePrefix: false,
  })
  return from({
    chainId: parameters.chainId,
    expiry: parameters.expiry ?? 0,
    feeToken: parameters.feeToken,
    id,
    permissions: parameters.permissions,
    privateKey: {
      credential,
      rpId,
    },
    publicKey,
    role: parameters.role,
    type: 'webauthn-p256',
  })
}

export declare namespace fromWebAuthnP256 {
  type Parameters = Pick<
    from.Value,
    'chainId' | 'expiry' | 'feeToken' | 'id' | 'permissions' | 'role'
  > & {
    /** WebAuthnP256 Credential. */
    credential: Pick<WebAuthnP256.P256Credential, 'id' | 'publicKey'>
    /** Relying Party ID. */
    rpId?: string | undefined
  }
}

/**
 * Instantiates a WebAuthn-wrapped P256 key from its parameters.
 *
 * @example
 * ```ts
 * import { P256 } from 'ox'
 * import * as Key from './key.js'
 *
 * const privateKey = P256.randomPrivateKey()
 *
 * // Admin Key
 * const key = Key.fromHeadlessWebAuthnP256({
 *   privateKey,
 * })
 *
 * // Session Key
 * const key = Key.fromHeadlessWebAuthnP256({
 *   expiry: 1714857600,
 *   privateKey,
 *   role: 'session',
 * })
 * ```
 *
 * @param parameters - Key parameters.
 * @returns WebAuthn-wrapped P256 key.
 */
export function fromHeadlessWebAuthnP256(
  parameters: fromHeadlessWebAuthnP256.Parameters,
) {
  const { privateKey } = parameters
  const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
    includePrefix: false,
  })
  return from({
    chainId: parameters.chainId,
    expiry: parameters.expiry ?? 0,
    feeToken: parameters.feeToken,
    permissions: parameters.permissions,
    privateKey: {
      privateKey() {
        return privateKey
      },
    },
    publicKey,
    role: parameters.role,
    type: 'webauthn-p256',
  })
}

export declare namespace fromHeadlessWebAuthnP256 {
  type Parameters = Pick<
    from.Value,
    'chainId' | 'expiry' | 'feeToken' | 'permissions' | 'role'
  > & {
    /** P256 private key. */
    privateKey: Hex.Hex
  }
}

/**
 * Instantiates a WebCryptoP256 key from its parameters.
 *
 * @example
 * ```ts
 * import { WebCryptoP256 } from 'ox'
 * import * as Key from './key.js'
 *
 * const keyPair = await WebCryptoP256.createKeyPair()
 *
 * // Admin Key
 * const key = Key.fromWebCryptoP256({
 *   keyPair,
 * })
 *
 * // Session Key
 * const key = Key.fromWebCryptoP256({
 *   expiry: 1714857600,
 *   keyPair,
 *   role: 'session',
 * })
 * ```
 *
 * @param parameters - Key parameters.
 * @returns WebCryptoP256 key.
 */
export function fromWebCryptoP256(parameters: fromWebCryptoP256.Parameters) {
  const { chainId, expiry, feeToken, keyPair, permissions, role } = parameters
  const { privateKey } = keyPair
  const publicKey = PublicKey.toHex(keyPair.publicKey, {
    includePrefix: false,
  })
  return from({
    chainId,
    expiry,
    feeToken,
    permissions,
    prehash: true,
    privateKey,
    publicKey,
    role,
    type: 'p256',
  })
}

export declare namespace fromWebCryptoP256 {
  type Parameters = Pick<
    from.Value,
    'chainId' | 'expiry' | 'feeToken' | 'permissions' | 'role'
  > & {
    /** P256 private key. */
    keyPair: Awaited<ReturnType<typeof WebCryptoP256.createKeyPair>>
  }
}

/**
 * Hashes a key.
 *
 * @example
 * ```ts
 * import * as Key from './key.js'
 *
 * const key = Key.createP256()
 *
 * const hash = Key.hash(key)
 * ```
 *
 * @param key - Key.
 * @returns Hashed key.
 */
export function hash(key: Pick<Key, 'publicKey' | 'type'>): Hex.Hex {
  const { type } = key
  const publicKey = serializePublicKey(key.publicKey)
  return Hash.keccak256(
    AbiParameters.encode(
      [{ type: 'uint8' }, { type: 'bytes32' }],
      [toSerializedKeyType[type], Hash.keccak256(publicKey)],
    ),
  )
}

/**
 * Serializes a public key.
 *
 * @param publicKey - Public key.
 * @returns Serialized public key.
 */
export function serializePublicKey(publicKey: Hex.Hex): Hex.Hex {
  return Hex.size(publicKey) < 32 ? Hex.padLeft(publicKey, 32) : publicKey
}

/**
 * Serializes a key to a contract-compatible format.
 *
 * @example
 * ```ts
 * import * as Key from './key.js'
 *
 * const key = Key.createP256()
 *
 * const serialized = Key.serialize(key)
 * ```
 *
 * @param key - Key.
 * @returns Serialized key.
 */
export function serialize(key: Key): Serialized {
  const { expiry = 0, publicKey, role, type } = key
  return {
    expiry,
    isSuperAdmin: role === 'admin',
    keyType: toSerializedKeyType[type],
    publicKey: serializePublicKey(publicKey),
  }
}

export async function sign(key: Key, parameters: sign.Parameters) {
  const { address, storage, webAuthn, wrap = true } = parameters
  const { privateKey, publicKey, type: keyType } = key

  if (!privateKey)
    throw new Error(
      'Key does not have a private key to sign with.\n\nKey:\n' +
        Json.stringify(key, null, 2),
    )

  const payload = (() => {
    if (!address) return parameters.payload
    return TypedData.getSignPayload({
      domain: { verifyingContract: address },
      message: {
        digest: parameters.payload,
      },
      primaryType: 'ERC1271Sign',
      types: {
        ERC1271Sign: [{ name: 'digest', type: 'bytes32' }],
      },
    })
  })()

  const [signature, prehash] = await (async () => {
    if (keyType === 'p256') {
      const { privateKey } = key
      if (typeof privateKey === 'function')
        return [
          Signature.toHex(P256.sign({ payload, privateKey: privateKey() })),
          false,
        ]
      if (privateKey instanceof CryptoKey) {
        const signature = Signature.toHex(
          await WebCryptoP256.sign({ payload, privateKey }),
        )
        return [signature, true]
      }
    }
    if (keyType === 'secp256k1') {
      return [
        Signature.toHex(Secp256k1.sign({ payload, privateKey: privateKey() })),
        false,
      ]
    }
    if (keyType === 'webauthn-p256') {
      if (privateKey.privateKey) {
        const { payload: wrapped, metadata } = WebAuthnP256.getSignPayload({
          challenge: payload,
          origin: 'https://ithaca.xyz',
          rpId: 'ithaca.xyz',
        })
        const { r, s } = P256.sign({
          hash: true,
          payload: wrapped,
          privateKey: privateKey.privateKey(),
        })
        const signature = serializeWebAuthnSignature({
          metadata,
          signature: { r, s },
        })
        return [signature, false]
      }

      const { credential, rpId } = privateKey

      const cacheKey = `porto.webauthnVerified.${key.hash}`
      const now = Date.now()
      const verificationTimeout = 10 * 60 * 1_000 // 10 minutes in milliseconds

      let requireVerification = true
      if (storage) {
        const lastVerified = await storage.getItem<number>(cacheKey)
        requireVerification =
          !lastVerified || now - lastVerified > verificationTimeout
      }

      const {
        signature: { r, s },
        raw,
        metadata,
      } = await WebAuthnP256.sign({
        challenge: payload,
        credentialId: credential.id,
        getFn: webAuthn?.getFn,
        rpId,
        userVerification: requireVerification ? 'required' : 'preferred',
      })

      const response = raw.response as AuthenticatorAssertionResponse
      if (!response?.userHandle)
        throw new Error('No user handle in response', {
          cause: { response },
        })
      const id = Bytes.toHex(new Uint8Array(response.userHandle!))
      if (key.id && Address.validate(key.id) && !Address.isEqual(key.id, id))
        throw new Error(
          `supplied webauthn key "${key.id}" does not match signature webauthn key "${id}"`,
          { cause: { id, key } },
        )

      if (requireVerification && storage) await storage.setItem(cacheKey, now)

      const signature = serializeWebAuthnSignature({
        metadata,
        signature: { r, s },
      })
      return [signature, false]
    }
    throw new Error(
      `Key type "${keyType}" is not supported.\n\nKey:\n` +
        Json.stringify(key, null, 2),
    )
  })()

  if (wrap)
    return wrapSignature(signature, {
      keyType,
      prehash,
      publicKey,
    })
  return signature
}

export declare namespace sign {
  type Parameters = {
    /**
     * Address to use for replay-safe signing.
     * `null` if replay-safe signing is not needed (e.g. signing call bundles).
     */
    address: Address.Address | null
    /**
     * Payload to sign.
     */
    payload: Hex.Hex
    /**
     * Storage to use for keytype-specific caching (e.g. WebAuthn user verification).
     */
    storage?: Storage.Storage | undefined
    /**
     * WebAuthn configuration.
     */
    webAuthn?:
      | {
          createFn?: WebAuthnP256.createCredential.Options['createFn']
          getFn?: WebAuthnP256.sign.Options['getFn']
        }
      | undefined
    /**
     * Whether to wrap the signature with key metadata.
     * @default true
     */
    wrap?: boolean | undefined
  }
}

/**
 * Converts a key to a Relay-compatible format.
 *
 * @example
 * TODO
 *
 * @param key - Key.
 * @returns Relay key.
 */
export function toRelay(
  key: toRelay.Value,
  options: toRelay.Options = {},
): RequiredBy<Relay, 'prehash'> {
  const { expiry = 0, prehash = false, publicKey, role = 'admin', type } = key
  const { feeTokens, orchestrator } = options

  // biome-ignore lint/complexity/useFlatMap: i know
  const permissions = Object.entries(
    resolvePermissions(key, {
      feeTokens,
    }),
  )
    // biome-ignore lint/suspicious/useIterableCallbackReturn: _
    .map(([key, v]) => {
      if (key === 'calls') {
        const calls = v as Key_schema.CallPermissions
        return calls.map(({ signature, to }) => {
          const selector = (() => {
            if (!signature) return Call.anySelector
            if (Hex.validate(signature)) return signature
            return AbiFunction.getSelector(signature)
          })()
          return {
            selector,
            to: to ?? Call.anyTarget,
            type: 'call',
          } as const satisfies RelayPermission_schema.CallPermission
        })
      }
      if (key === 'feeToken') return
      if (key === 'spend') {
        const value = v as Key_schema.SpendPermissions
        return value.map(({ limit, period, token }) => {
          return {
            limit,
            period,
            token,
            type: 'spend',
          } as const satisfies RelayPermission_schema.SpendPermission
        })
      }

      throw new Error(`Invalid permission type "${key}".`)
    })
    .flat()
    .filter(Boolean) as RelayPermission_schema.Permission[]

  if (key.role === 'session' && orchestrator)
    permissions.push({
      selector: Call.anySelector,
      to: orchestrator,
      type: 'call',
    })

  return {
    expiry,
    permissions: permissions ?? [],
    prehash,
    publicKey: serializePublicKey(publicKey),
    role: toRelayKeyRole[role],
    type: toRelayKeyType[type],
  }
}

export declare namespace toRelay {
  type Value = PartialBy<
    Pick<
      Key,
      'expiry' | 'prehash' | 'permissions' | 'publicKey' | 'role' | 'type'
    >,
    'expiry' | 'role'
  >

  type Options = {
    /** Fee tokens. */
    feeTokens?: readonly Tokens.Token[] | undefined
    /** Orchestrator address. */
    orchestrator?: Address.Address | undefined
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
  key: Pick<Key, 'feeToken' | 'permissions'>,
  options: resolvePermissions.Options,
) {
  const { permissions } = key

  const calls = permissions?.calls ? [...permissions.calls] : []
  const spend = permissions?.spend ? [...permissions.spend] : []

  const feeTokens = options.feeTokens?.filter((token) => token.feeToken)
  if (feeTokens && feeTokens.length > 0) {
    const feeToken = getFeeToken(key, {
      feeTokens,
    })

    if (feeToken) {
      let index = -1
      let minPeriod: number = toSerializedSpendPeriod.year

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

        const period = toSerializedSpendPeriod[s.period]
        if (period < minPeriod) minPeriod = period
      }

      // If there is a token assigned to a spend permission and the fee token
      // is the same, update the limit to account for the fee.
      if (index !== -1) {
        spend[index] = {
          ...spend[index]!,
          limit: spend[index]!.limit + feeToken.value,
        }
        // Assign this as the first spend permission, as it will be used
        // as the fee token for call bundles that use this key.
        spend.unshift(spend.splice(index, 1)[0]!)
      }
      // Update the spend permissions to account for the fee token.
      // The fee token permission must be assigned as the first spend
      // permission as it will be used as the fee token for call bundles
      // that use this key.
      else if (typeof minPeriod === 'number')
        spend.unshift({
          limit: feeToken.value,
          period:
            fromSerializedSpendPeriod[
              minPeriod as keyof typeof fromSerializedSpendPeriod
            ],
          token: feeToken.address,
        })
    }
  }

  return { ...permissions, calls, spend }
}

export declare namespace resolvePermissions {
  export type Options = {
    feeTokens?: Tokens.Tokens | null | undefined
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
export function getFeeToken(
  key: Pick<Key, 'feeToken' | 'permissions'>,
  options: getFeeToken.Options,
): getFeeToken.ReturnType {
  const { feeTokens } = options

  if (!key.feeToken) return undefined

  const feeToken = feeTokens.find((token) => {
    if (key.feeToken!.symbol === token.symbol) return true
    if (!key.feeToken!.symbol) return token.address === zeroAddress
    if (key.feeToken!.symbol === 'native') return token.address === zeroAddress
    return false
  })
  if (!feeToken) return undefined

  const value = Value.from(key.feeToken.limit, feeToken.decimals)

  return {
    ...feeToken,
    value,
  }
}

export declare namespace getFeeToken {
  export type Options = {
    feeTokens: Tokens.Tokens
  }

  export type ReturnType =
    | (Tokens.Token & {
        value: bigint
      })
    | undefined
}

///////////////////////////////////////////////////////////////////////////
// Internal
///////////////////////////////////////////////////////////////////////////

export function serializeWebAuthnSignature(
  options: serializeWebAuthnSignature.Options,
) {
  const { metadata, signature } = options
  return AbiParameters.encode(
    AbiParameters.from([
      'struct WebAuthnAuth { bytes authenticatorData; string clientDataJSON; uint256 challengeIndex; uint256 typeIndex; bytes32 r; bytes32 s; }',
      'WebAuthnAuth auth',
    ]),
    [
      {
        authenticatorData: metadata.authenticatorData,
        challengeIndex: BigInt(metadata.challengeIndex),
        clientDataJSON: metadata.clientDataJSON,
        r: Hex.fromNumber(signature.r, { size: 32 }),
        s: Hex.fromNumber(signature.s, { size: 32 }),
        typeIndex: BigInt(metadata.typeIndex),
      },
    ],
  )
}

export declare namespace serializeWebAuthnSignature {
  type Options = {
    metadata: WebAuthnP256.SignMetadata
    signature: Signature.Signature<false>
  }
}

export function wrapSignature(
  signature: Hex.Hex,
  options: wrapSignature.Options,
) {
  const { keyType: type, prehash = false, publicKey } = options

  const keyHash = hash({ publicKey, type })
  return AbiParameters.encodePacked(
    ['bytes', 'bytes32', 'bool'],
    [signature, keyHash, prehash],
  )
}

declare namespace wrapSignature {
  type Options = {
    keyType: Key['type']
    prehash?: boolean | undefined
    publicKey: Hex.Hex
  }
}
