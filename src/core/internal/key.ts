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

import type * as Storage from '../Storage.js'
import * as Call from './call.js'
import type * as RelayKey_typebox from './relay/typebox/key.js'
import type * as RelayPermission_typebox from './relay/typebox/permission.js'
import type * as Key_typebox from './typebox/key.js'
import type {
  Compute,
  ExactPartial,
  Mutable,
  OneOf,
  Undefined,
  UnionOmit,
  UnionRequiredBy,
} from './types.js'

type PrivateKeyFn = () => Hex.Hex

export type BaseKey<type extends string, properties = {}> = Compute<
  Key_typebox.Base & {
    /** Permissions. */
    permissions?: Permissions | undefined
    /** Whether the key will need its digest (SHA256) prehashed when signing. */
    prehash?: boolean | undefined
    /** Key type. */
    type: type
  } & OneOf<
      | ({
          /** Whether the key can sign. */
          canSign: true
        } & properties)
      | ({
          /** Whether the key can sign. */
          canSign: false
        } & Undefined<properties>)
    >
>

export type Key = OneOf<
  AddressKey | P256Key | Secp256k1Key | WebCryptoKey | WebAuthnKey
>
export type AddressKey = BaseKey<'address'>
export type P256Key = BaseKey<'p256', { privateKey: PrivateKeyFn }>
export type Secp256k1Key = BaseKey<'secp256k1', { privateKey: PrivateKeyFn }>
export type WebCryptoKey = BaseKey<
  'p256',
  {
    credential?:
      | Pick<WebAuthnP256.P256Credential, 'id' | 'publicKey'>
      | undefined
    privateKey: CryptoKey
  }
>
export type WebAuthnKey = BaseKey<
  'webauthn-p256',
  {
    credential: Pick<WebAuthnP256.P256Credential, 'id' | 'publicKey'>
    rpId: string | undefined
  }
>

export type Permissions = Key_typebox.Permissions

/** RPC (relay-compatible) format of a key. */
export type Relay = RelayKey_typebox.WithPermissions

/** Serialized (contract-compatible) format of a key. */
export type Serialized = {
  expiry: number
  isSuperAdmin: boolean
  keyType: number
  publicKey: Hex.Hex
}

/** Relay key type to key type mapping. */
export const fromRelayKeyType = {
  p256: 'p256',
  webauthnp256: 'webauthn-p256',
  secp256k1: 'secp256k1',
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

/** Key type to relay key type mapping. */
export const toRelayKeyType = {
  address: 'secp256k1',
  p256: 'p256',
  'webauthn-p256': 'webauthnp256',
  secp256k1: 'secp256k1',
} as const

/** Key role to relay key role mapping. */
export const toRelayKeyRole = {
  admin: 'admin',
  session: 'normal',
} as const

/** Key type to serialized (contract-compatible) key type mapping. */
export const toSerializedKeyType = {
  p256: 0,
  'webauthn-p256': 1,
  secp256k1: 2,
  address: 2,
} as const

/** Period to serialized (contract-compatible) spend period mapping. */
export const toSerializedSpendPeriod = {
  minute: 0,
  hour: 1,
  day: 2,
  week: 3,
  month: 4,
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
 * const key = Key.createP256({
 *   role: 'admin',
 * })
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
export function createP256<const role extends Key['role']>(
  parameters: createP256.Parameters<role>,
) {
  const privateKey = P256.randomPrivateKey()
  return fromP256({
    ...parameters,
    privateKey,
  })
}

export declare namespace createP256 {
  type Parameters<role extends Key['role']> = {
    /** Expiry. */
    expiry?: fromP256.Parameters['expiry']
    /** Permissions. */
    permissions?: Permissions | undefined
    /** Role. */
    role: fromP256.Parameters<role>['role']
  }
}

/**
 * Creates a random Secp256k1 key.
 *
 * @example
 * ```ts
 * import * as Key from './key.js'
 *
 * // Admin Key
 * const key = Key.createSecp256k1({
 *   role: 'admin',
 * })
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
export function createSecp256k1<const role extends Key['role']>(
  parameters: createSecp256k1.Parameters<role>,
) {
  const privateKey = Secp256k1.randomPrivateKey()
  return fromSecp256k1({
    ...parameters,
    privateKey,
  })
}

export declare namespace createSecp256k1 {
  type Parameters<role extends Key['role']> = {
    /** Expiry. */
    expiry?: fromSecp256k1.Parameters['expiry']
    /** Permissions. */
    permissions?: Permissions | undefined
    /** Role. */
    role: fromSecp256k1.Parameters<role>['role']
  }
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
 *   role: 'admin',
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
export async function createWebAuthnP256<const role extends Key['role']>(
  parameters: createWebAuthnP256.Parameters<role>,
) {
  const { createFn, label, rpId, userId } = parameters

  const credential = await WebAuthnP256.createCredential({
    authenticatorSelection: {
      requireResidentKey: false,
      residentKey: 'preferred',
      userVerification: 'required',
    },
    createFn,
    rp: rpId
      ? {
          id: rpId,
          name: rpId,
        }
      : undefined,
    user: {
      displayName: label,
      name: label,
      id: userId,
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
  type Parameters<role extends Key['role']> = {
    /**
     * Credential creation function. Useful for environments that do not support
     * the WebAuthn API natively (i.e. React Native or testing environments).
     *
     * @default window.navigator.credentials.create
     */
    createFn?: WebAuthnP256.createCredential.Options['createFn'] | undefined
    /** Expiry. */
    expiry?: fromWebAuthnP256.Parameters['expiry']
    /** Label. */
    label: string
    /** Permissions. */
    permissions?: Permissions | undefined
    /** Role. */
    role: fromWebAuthnP256.Parameters<role>['role']
    /** Relying Party ID. */
    rpId?: string | undefined
    /** User ID. */
    userId: Bytes.Bytes
  }
}

/**
 * Creates a random WebCryptoP256 key.
 *
 * @example
 * ```ts
 * import * as Key from './key.js'
 *
 * // Admin Key
 * const key = Key.createWebCryptoP256({
 *   role: 'admin',
 * })
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
export async function createWebCryptoP256<const role extends Key['role']>(
  parameters: createWebCryptoP256.Parameters<role>,
) {
  const keyPair = await WebCryptoP256.createKeyPair()
  return fromWebCryptoP256({
    ...parameters,
    keyPair,
  })
}

export declare namespace createWebCryptoP256 {
  type Parameters<role extends Key['role']> = {
    /** Expiry. */
    expiry?: fromP256.Parameters['expiry']
    /** Permissions. */
    permissions?: Permissions | undefined
    /** Role. */
    role: fromP256.Parameters<role>['role']
  }
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
  return {
    expiry: serialized.expiry,
    hash: hash({
      publicKey,
      type,
    }),
    publicKey,
    role: serialized.isSuperAdmin ? 'admin' : 'session',
    canSign: false,
    type,
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
 *   role: 'admin',
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
export function from<const key extends from.Value>(
  key: from.Parameters<key>,
): from.ReturnType<key> {
  if ('isSuperAdmin' in key) return deserialize(key) as never
  const { canSign = false, expiry = 0, role = 'session', type } = key

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
      return Hex.padLeft(address, 32)
    }
    return publicKey
  })()

  return {
    ...key,
    canSign,
    expiry,
    hash: hash({
      publicKey,
      type,
    }),
    publicKey,
    role,
    type,
  } satisfies BaseKey<string> as never
}

export declare namespace from {
  type Value = UnionRequiredBy<
    ExactPartial<UnionOmit<Key, 'hash'>>,
    'publicKey' | 'type'
  >

  type Parameters<key extends from.Value> = key | Key | Serialized

  type ReturnType<key extends from.Value> = key extends from.Value
    ? key & Pick<Key, 'canSign' | 'expiry' | 'hash' | 'role'>
    : Key
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
 *   role: 'admin',
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
export function fromP256<const role extends Key['role']>(
  parameters: fromP256.Parameters<role>,
) {
  const { privateKey } = parameters
  const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
    includePrefix: false,
  })
  return from({
    canSign: true,
    expiry: parameters.expiry ?? 0,
    publicKey,
    role: parameters.role as Key['role'],
    permissions: parameters.permissions,
    privateKey() {
      return privateKey
    },
    type: 'p256',
  })
}

export declare namespace fromP256 {
  type Parameters<role extends Key['role'] = Key['role']> = {
    /** Expiry. */
    expiry?: Key['expiry'] | undefined
    /** Permissions. */
    permissions?: Permissions | undefined
    /** P256 private key. */
    privateKey: Hex.Hex
    /** Role. */
    role: role | Key['role']
  }
}

/**
 * Converts a relay-formatted key to a key.
 *
 * @example
 * TODO
 *
 * @param relay - Relay key.
 * @returns Key.
 */
export function fromRelay(relay: Relay): Key {
  const permissions: {
    calls?: Mutable<Key_typebox.CallPermissions> | undefined
    spend?: Mutable<Key_typebox.SpendPermissions> | undefined
  } = {}

  for (const permission of relay.permissions) {
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
    canSign: false,
    expiry: relay.expiry,
    permissions: permissions as Permissions,
    publicKey: relay.publicKey,
    role: fromRelayKeyRole[relay.role],
    type: fromRelayKeyType[relay.type],
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
 *   role: 'admin',
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
export function fromSecp256k1<const role extends Key['role']>(
  parameters: fromSecp256k1.Parameters<role>,
) {
  const { privateKey, role } = parameters
  const publicKey = (() => {
    if (parameters.publicKey) return parameters.publicKey
    if (privateKey)
      return Address.fromPublicKey(Secp256k1.getPublicKey({ privateKey }))
    return parameters.address.toLowerCase() as Hex.Hex
  })()
  return from({
    canSign: Boolean(privateKey),
    expiry: parameters.expiry ?? 0,
    publicKey,
    role,
    permissions: parameters.permissions,
    privateKey: privateKey ? () => privateKey : undefined,
    type: 'secp256k1',
  } as Secp256k1Key)
}

export declare namespace fromSecp256k1 {
  type Parameters<role extends Key['role'] = Key['role']> = {
    /** Expiry. */
    expiry?: Key['expiry'] | undefined
    /** Permissions. */
    permissions?: Permissions | undefined
    /** Role. */
    role: role | Key['role']
  } & OneOf<
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
 *   role: 'admin',
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
export function fromWebAuthnP256<const role extends Key['role']>(
  parameters: fromWebAuthnP256.Parameters<role>,
) {
  const { credential, id, rpId } = parameters
  const publicKey = PublicKey.toHex(credential.publicKey, {
    includePrefix: false,
  })
  return from({
    canSign: true,
    credential,
    expiry: parameters.expiry ?? 0,
    id,
    permissions: parameters.permissions,
    publicKey,
    role: parameters.role as Key['role'],
    rpId,
    type: 'webauthn-p256',
  })
}

export declare namespace fromWebAuthnP256 {
  type Parameters<role extends Key['role'] = Key['role']> = {
    /** Expiry. */
    expiry?: Key['expiry'] | undefined
    /** WebAuthnP256 Credential. */
    credential: Pick<WebAuthnP256.P256Credential, 'id' | 'publicKey'>
    /** Key ID. */
    id: Key['id']
    /** Permissions. */
    permissions?: Permissions | undefined
    /** Role. */
    role: role | Key['role']
    /** Relying Party ID. */
    rpId?: string | undefined
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
 *   role: 'admin',
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
export function fromWebCryptoP256<const role extends Key['role']>(
  parameters: fromWebCryptoP256.Parameters<role>,
) {
  const { keyPair } = parameters
  const { privateKey } = keyPair
  const publicKey = PublicKey.toHex(keyPair.publicKey, {
    includePrefix: false,
  })
  return from({
    canSign: true,
    expiry: parameters.expiry ?? 0,
    permissions: parameters.permissions,
    publicKey,
    role: parameters.role as Key['role'],
    prehash: true,
    privateKey,
    type: 'p256',
  })
}

export declare namespace fromWebCryptoP256 {
  type Parameters<role extends Key['role']> = {
    /** Expiry. */
    expiry?: Key['expiry'] | undefined
    /** P256 private key. */
    keyPair: Awaited<ReturnType<typeof WebCryptoP256.createKeyPair>>
    /** Permissions. */
    permissions?: Permissions | undefined
    /** Role. */
    role: role | Key['role']
  }
}

/**
 * Hashes a key.
 *
 * @example
 * ```ts
 * import * as Key from './key.js'
 *
 * const key = Key.createP256({
 *   role: 'admin',
 * })
 *
 * const hash = Key.hash(key)
 * ```
 *
 * @param key - Key.
 * @returns Hashed key.
 */
export function hash(key: Pick<Key, 'publicKey' | 'type'>): Hex.Hex {
  const { publicKey, type } = key
  return Hash.keccak256(
    AbiParameters.encode(
      [{ type: 'uint8' }, { type: 'bytes32' }],
      [toSerializedKeyType[type], Hash.keccak256(publicKey)],
    ),
  )
}

/**
 * Serializes a key to a contract-compatible format.
 *
 * @example
 * ```ts
 * import * as Key from './key.js'
 *
 * const key = Key.createP256({
 *   role: 'admin',
 * })
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
    publicKey,
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
  const { canSign, publicKey, type: keyType } = key

  if (!canSign)
    throw new Error(
      'Key is not canSign.\n\nKey:\n' + Json.stringify(key, null, 2),
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
      const { privateKey } = key
      return [
        Signature.toHex(Secp256k1.sign({ payload, privateKey: privateKey() })),
        false,
      ]
    }
    if (keyType === 'webauthn-p256') {
      const { credential, rpId } = key

      const cacheKey = `porto.webauthnVerified.${key.hash}`
      const now = Date.now()
      const verificationTimeout = 10 * 60 * 1000 // 10 minutes in milliseconds

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
      const id = Bytes.toHex(new Uint8Array(response.userHandle!))
      if (key.id && !Address.isEqual(key.id, id))
        throw new Error(
          `supplied webauthn key "${key.id}" does not match signature webauthn key "${id}"`,
        )

      if (requireVerification && storage) await storage.setItem(cacheKey, now)

      const signature = AbiParameters.encode(
        AbiParameters.from([
          'struct WebAuthnAuth { bytes authenticatorData; string clientDataJSON; uint256 challengeIndex; uint256 typeIndex; bytes32 r; bytes32 s; }',
          'WebAuthnAuth auth',
        ]),
        [
          {
            authenticatorData: metadata.authenticatorData,
            challengeIndex: BigInt(metadata.challengeIndex),
            clientDataJSON: metadata.clientDataJSON,
            r: Hex.fromNumber(r, { size: 32 }),
            s: Hex.fromNumber(s, { size: 32 }),
            typeIndex: BigInt(metadata.typeIndex),
          },
        ],
      )
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
      publicKey,
      prehash,
    })
  return signature
}

/**
 * Converts a key to a relay-compatible format.
 *
 * @example
 * TODO
 *
 * @param key - Key.
 * @returns Relay key.
 */
export function toRelay(
  key: Pick<
    Key,
    'expiry' | 'permissions' | 'publicKey' | 'role' | 'signature' | 'type'
  >,
): Relay {
  const { expiry, publicKey, role, signature, type } = key

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
            type: 'call',
            to: to ?? Call.anyTarget,
            selector,
          } as const satisfies RelayPermission_typebox.CallPermission
        })
      }

      if (key === 'spend') {
        const value = v as Key_typebox.SpendPermissions
        return value.map(({ limit, period, token }) => {
          return {
            type: 'spend',
            limit,
            period,
            token,
          } as const satisfies RelayPermission_typebox.SpendPermission
        })
      }

      throw new Error(`Invalid permission type "${key}".`)
    })
    .flat()

  // TODO(relay): remove temporary call scope on EntryPoint.
  if (key.role === 'session')
    permissions.push({
      selector: Call.anySelector,
      to: '0x5197adb49b4ecaa8e00f60f43757d3f5ad630227',
      type: 'call',
    })

  return {
    expiry,
    permissions: permissions ?? [],
    publicKey,
    role: toRelayKeyRole[role],
    signature,
    type: toRelayKeyType[type],
  }
}

///////////////////////////////////////////////////////////////////////////
// Internal
///////////////////////////////////////////////////////////////////////////

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
