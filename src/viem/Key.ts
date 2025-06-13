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
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import * as WebCryptoP256 from 'ox/WebCryptoP256'
import * as Call from '../core/internal/call.js'
import type * as ServerKey_typebox from '../core/internal/rpcServer/typebox/key.js'
import type * as ServerPermission_typebox from '../core/internal/rpcServer/typebox/permission.js'
import type * as Key_typebox from '../core/internal/typebox/key.js'
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
  Key_typebox.WithPermissions & {
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

export type Permissions = Key_typebox.Permissions

/** RPC (server-compatible) format of a key. */
export type Server = ServerKey_typebox.WithPermissions

/** Serialized (contract-compatible) format of a key. */
export type Serialized = {
  expiry: number
  isSuperAdmin: boolean
  keyType: number
  publicKey: Hex.Hex
}

export type SpendPermissions = Key_typebox.SpendPermissions
export type SpendPermission = SpendPermissions[number]

/** RPC Server key type to key type mapping. */
export const fromRpcServerKeyType = {
  p256: 'p256',
  secp256k1: 'secp256k1',
  webauthnp256: 'webauthn-p256',
} as const

/** RPC Server key role to key role mapping. */
export const fromRpcServerKeyRole = {
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

/** Key type to RPC Server key type mapping. */
export const toRpcServerKeyType = {
  address: 'secp256k1',
  p256: 'p256',
  secp256k1: 'secp256k1',
  'webauthn-p256': 'webauthnp256',
} as const

/** Key role to RPC Server key role mapping. */
export const toRpcServerKeyRole = {
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
  type Parameters = Pick<fromP256.Parameters, 'expiry' | 'permissions' | 'role'>
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
    'expiry' | 'permissions' | 'role'
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
      id: userId,
      name: label,
    },
  })

  return fromWebAuthnP256({
    ...parameters,
    credential: {
      id: credential.id,
      publicKey: credential.publicKey,
    },
    id: Bytes.toHex(userId),
  })
}

export declare namespace createWebAuthnP256 {
  type Parameters = Pick<
    fromWebAuthnP256.Parameters,
    'expiry' | 'permissions' | 'role'
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
    userId: Bytes.Bytes
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
    'expiry' | 'permissions' | 'role'
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
    'expiry' | 'permissions' | 'role'
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
export function deserialize(serialized: Serialized): Key {
  const publicKey = serialized.publicKey
  const type = (fromSerializedKeyType as any)[serialized.keyType]
  return from({
    expiry: serialized.expiry,
    publicKey,
    role: serialized.isSuperAdmin ? 'admin' : 'session',
    type,
  })
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
): Extract<Key, { type: type }> {
  const { expiry = 0, id, role = 'admin', type } = key

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
    expiry,
    hash: hash({
      publicKey,
      type,
    }),
    id: (id ?? publicKey).toLowerCase() as Hex.Hex,
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
  const { expiry, permissions, privateKey, role } = parameters
  const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
    includePrefix: false,
  })
  return from({
    expiry,
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
  type Parameters = Pick<from.Value, 'expiry' | 'permissions' | 'role'> & {
    /** P256 private key. */
    privateKey: Hex.Hex
  }
}

/**
 * Converts a RPC Server-formatted key to a key.
 *
 * @example
 * TODO
 *
 * @param serverKey - RPC Server key.
 * @returns Key.
 */
export function fromRpcServer(serverKey: Server): Key {
  const permissions: {
    calls?: Mutable<Key_typebox.CallPermissions> | undefined
    spend?: Mutable<Key_typebox.SpendPermissions> | undefined
  } = {}

  for (const permission of serverKey.permissions) {
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
    expiry: serverKey.expiry,
    permissions: permissions as Permissions,
    publicKey: serverKey.publicKey,
    role: fromRpcServerKeyRole[serverKey.role],
    type: fromRpcServerKeyType[serverKey.type],
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
    permissions: parameters.permissions,
    privateKey: privateKey ? () => privateKey : undefined,
    publicKey,
    role,
    type: 'secp256k1',
  } as Secp256k1Key)
}

export declare namespace fromSecp256k1 {
  type Parameters = Pick<from.Value, 'expiry' | 'permissions' | 'role'> &
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
    expiry: parameters.expiry ?? 0,
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
    'expiry' | 'id' | 'permissions' | 'role'
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
    expiry: parameters.expiry ?? 0,
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
  type Parameters = Pick<from.Value, 'expiry' | 'permissions' | 'role'> & {
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
  const { expiry, keyPair, permissions, role } = parameters
  const { privateKey } = keyPair
  const publicKey = PublicKey.toHex(keyPair.publicKey, {
    includePrefix: false,
  })
  return from({
    expiry,
    permissions,
    prehash: true,
    privateKey,
    publicKey,
    role,
    type: 'p256',
  })
}

export declare namespace fromWebCryptoP256 {
  type Parameters = Pick<from.Value, 'expiry' | 'permissions' | 'role'> & {
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

export async function sign(
  key: Key,
  parameters: {
    payload: Hex.Hex
    storage?: Storage.Storage | undefined
    wrap?: boolean | undefined
  },
) {
  const { payload, storage, wrap = true } = parameters
  const { privateKey, publicKey, type: keyType } = key

  if (!privateKey)
    throw new Error(
      'Key does not have a private key to sign with.\n\nKey:\n' +
        Json.stringify(key, null, 2),
    )

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
        rpId,
        userVerification: requireVerification ? 'required' : 'preferred',
      })

      const response = raw.response as AuthenticatorAssertionResponse
      if (!response?.userHandle)
        throw new Error('No user handle in response', {
          cause: { response },
        })
      const id = Bytes.toHex(new Uint8Array(response.userHandle!))
      if (key.id && !Address.isEqual(key.id, id))
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

/**
 * Converts a key to a RPC Server-compatible format.
 *
 * @example
 * TODO
 *
 * @param key - Key.
 * @returns RPC Server key.
 */
export function toRpcServer(
  key: toRpcServer.Value,
  options: toRpcServer.Options = {},
): RequiredBy<Server, 'prehash'> {
  const { expiry = 0, prehash = false, publicKey, role = 'admin', type } = key
  const { orchestrator } = options

  // biome-ignore lint/complexity/useFlatMap:
  const permissions = Object.entries(key.permissions ?? {})
    .map(([key, v]) => {
      if (key === 'calls') {
        const calls = v as Key_typebox.CallPermissions
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
          } as const satisfies ServerPermission_typebox.CallPermission
        })
      }

      if (key === 'spend') {
        const value = v as Key_typebox.SpendPermissions
        return value.map(({ limit, period, token }) => {
          return {
            limit,
            period,
            token,
            type: 'spend',
          } as const satisfies ServerPermission_typebox.SpendPermission
        })
      }

      throw new Error(`Invalid permission type "${key}".`)
    })
    .flat()

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
    role: toRpcServerKeyRole[role],
    type: toRpcServerKeyType[type],
  }
}

export declare namespace toRpcServer {
  type Value = PartialBy<
    Pick<
      Key,
      'expiry' | 'prehash' | 'permissions' | 'publicKey' | 'role' | 'type'
    >,
    'expiry' | 'role'
  >

  type Options = {
    /** Orchestrator address. */
    orchestrator?: Address.Address | undefined
  }
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
