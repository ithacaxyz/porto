import * as AbiParameters from 'ox/AbiParameters'
import type * as Bytes from 'ox/Bytes'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'
import * as P256 from 'ox/P256'
import * as PublicKey from 'ox/PublicKey'
import * as Secp256k1 from 'ox/Secp256k1'
import * as Signature from 'ox/Signature'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import * as WebCryptoP256 from 'ox/WebCryptoP256'

/** Key on a delegated account. */
export type Key = {
  expiry: number
  publicKey: PublicKey.PublicKey
  sign?: (parameters: { payload: Hex.Hex }) => Promise<Hex.Hex> | undefined
  role: 'owner' | 'admin' | 'session'
  type: 'p256' | 'secp256k1' | 'webauthn-p256'
}

/** Serialized (contract-compatible) format of a key. */
export type Serialized = {
  expiry: number
  isSuperAdmin: boolean
  keyType: number
  publicKey: Hex.Hex
}

/** Key type to serialized key type mapping. */
export const toSerializedKeyType = {
  p256: 0,
  'webauthn-p256': 1,
  secp256k1: 2,
} as const

/** Serialized key type to key type mapping. */
export const fromSerializedKeyType = {
  0: 'p256',
  1: 'webauthn-p256',
  2: 'secp256k1',
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
export function createP256<const role extends 'admin' | 'session'>(
  parameters: createP256.Parameters<role>,
) {
  const privateKey = P256.randomPrivateKey()
  return fromP256({
    ...parameters,
    privateKey,
  })
}

export declare namespace createP256 {
  type Parameters<role extends 'admin' | 'session'> = {
    /** Expiry. */
    expiry?: fromP256.Parameters['expiry']
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
export function createSecp256k1<const role extends 'admin' | 'session'>(
  parameters: createSecp256k1.Parameters<role>,
) {
  const privateKey = Secp256k1.randomPrivateKey()
  return fromSecp256k1({
    ...parameters,
    privateKey,
  })
}

export declare namespace createSecp256k1 {
  type Parameters<role extends 'admin' | 'session'> = {
    /** Expiry. */
    expiry?: fromSecp256k1.Parameters['expiry']
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
export async function createWebAuthnP256<
  const role extends 'admin' | 'session',
>(parameters: createWebAuthnP256.Parameters<role>) {
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
    credential,
  })
}

export declare namespace createWebAuthnP256 {
  type Parameters<role extends 'admin' | 'session'> = {
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
export async function createWebCryptoP256<
  const role extends 'admin' | 'session',
>(parameters: createWebCryptoP256.Parameters<role>) {
  const keyPair = await WebCryptoP256.createKeyPair()
  return fromWebCryptoP256({
    ...parameters,
    keyPair,
  })
}

export declare namespace createWebCryptoP256 {
  type Parameters<role extends 'admin' | 'session'> = {
    /** Expiry. */
    expiry?: fromP256.Parameters['expiry']
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
  return {
    expiry: serialized.expiry,
    publicKey: PublicKey.fromHex(serialized.publicKey),
    role: serialized.isSuperAdmin ? 'admin' : 'session',
    type: (fromSerializedKeyType as any)[serialized.keyType],
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
export function from<const key extends Key>(
  key: key | Key | Serialized,
): key extends Key ? key : Key {
  if ('isSuperAdmin' in key) return deserialize(key) as never

  const { expiry = 0, publicKey, role, sign, type } = key
  return { expiry, publicKey, role, sign, type } as never
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
export function fromP256<const role extends 'admin' | 'session'>(
  parameters: fromP256.Parameters<role>,
) {
  const { privateKey } = parameters
  const publicKey = P256.getPublicKey({ privateKey })
  const type = 'p256' as const
  return from({
    expiry: parameters.expiry ?? 0,
    publicKey,
    role: parameters.role as 'admin' | 'session',
    async sign({ payload }) {
      const signature = Signature.toHex(P256.sign({ payload, privateKey }))
      return wrapSignature(signature, {
        keyType: type,
        publicKey,
      })
    },
    type,
  })
}

export declare namespace fromP256 {
  type Parameters<role extends 'admin' | 'session' = 'admin' | 'session'> = {
    /** Expiry. */
    expiry?: Key['expiry'] | undefined
    /** P256 private key. */
    privateKey: Hex.Hex
    /** Role. */
    role: role | 'admin' | 'session'
  }
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
export function fromSecp256k1<const role extends 'owner' | 'admin' | 'session'>(
  parameters: fromSecp256k1.Parameters<role>,
) {
  const { privateKey, role } = parameters
  const publicKey = Secp256k1.getPublicKey({ privateKey })
  const type = 'secp256k1' as const
  return from({
    expiry: parameters.expiry ?? 0,
    publicKey,
    role,
    async sign({ payload }) {
      const signature = Signature.toHex(Secp256k1.sign({ payload, privateKey }))
      if (role === 'owner') return signature
      return wrapSignature(signature, {
        keyType: type,
        publicKey,
      })
    },
    type,
  })
}

export declare namespace fromSecp256k1 {
  type Parameters<
    role extends 'owner' | 'admin' | 'session' = 'owner' | 'admin' | 'session',
  > = {
    /** Expiry. */
    expiry?: Key['expiry'] | undefined
    /** Secp256k1 private key. */
    privateKey: Hex.Hex
    /** Role. */
    role: role | 'owner' | 'admin' | 'session'
  }
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
export function fromWebAuthnP256<const role extends 'admin' | 'session'>(
  parameters: fromWebAuthnP256.Parameters<role>,
) {
  const { credential, rpId } = parameters
  const type = 'webauthn-p256' as const
  return from({
    expiry: parameters.expiry ?? 0,
    publicKey: credential.publicKey,
    role: parameters.role as 'admin' | 'session',
    async sign({ payload }) {
      const {
        signature: { r, s },
        metadata,
      } = await WebAuthnP256.sign({
        challenge: payload,
        credentialId: credential.id,
        rpId,
      })
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
      return wrapSignature(signature, {
        keyType: type,
        publicKey: credential.publicKey,
      })
    },
    type,
  })
}

export declare namespace fromWebAuthnP256 {
  type Parameters<role extends 'admin' | 'session' = 'admin' | 'session'> = {
    /** Expiry. */
    expiry?: Key['expiry'] | undefined
    /** WebAuthnP256 Credential. */
    credential: WebAuthnP256.P256Credential
    /** Role. */
    role: role | 'admin' | 'session'
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
export function fromWebCryptoP256<const role extends 'admin' | 'session'>(
  parameters: fromWebCryptoP256.Parameters<role>,
) {
  const { keyPair } = parameters
  const { publicKey, privateKey } = keyPair
  const type = 'p256' as const
  return from({
    expiry: parameters.expiry ?? 0,
    publicKey,
    role: parameters.role as 'admin' | 'session',
    async sign({ payload }) {
      const signature = Signature.toHex(
        await WebCryptoP256.sign({ payload, privateKey }),
      )
      return wrapSignature(signature, {
        keyType: type,
        prehash: true,
        publicKey,
      })
    },
    type,
  })
}

export declare namespace fromWebCryptoP256 {
  type Parameters<role extends 'admin' | 'session'> = {
    /** Expiry. */
    expiry?: Key['expiry'] | undefined
    /** P256 private key. */
    keyPair: Awaited<ReturnType<typeof WebCryptoP256.createKeyPair>>
    /** Role. */
    role: role | 'admin' | 'session'
  }
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
    isSuperAdmin: role === 'owner' || role === 'admin',
    keyType: toSerializedKeyType[type],
    publicKey: PublicKey.toHex(publicKey, { includePrefix: false }),
  }
}

///////////////////////////////////////////////////////////////////////////
// Internal
///////////////////////////////////////////////////////////////////////////

function wrapSignature(signature: Hex.Hex, options: wrapSignature.Options) {
  const { keyType, prehash = false, publicKey } = options

  const keyHash = Hash.keccak256(
    AbiParameters.encode(
      [{ type: 'uint8' }, { type: 'bytes32' }],
      [
        toSerializedKeyType[keyType],
        Hash.keccak256(PublicKey.toHex(publicKey, { includePrefix: false })),
      ],
    ),
  )
  return AbiParameters.encodePacked(
    ['bytes', 'bytes32', 'bool'],
    [signature, keyHash, prehash],
  )
}

declare namespace wrapSignature {
  type Options = {
    keyType: Key['type']
    prehash?: boolean | undefined
    publicKey: PublicKey.PublicKey
  }
}