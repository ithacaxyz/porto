import * as AbiParameters from 'ox/AbiParameters'
import * as Address from 'ox/Address'
import * as Bytes from 'ox/Bytes'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'
import * as PublicKey from 'ox/PublicKey'
import * as Secp256k1 from 'ox/Secp256k1'
import type * as Signature from 'ox/Signature'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import * as WebCryptoP256 from 'ox/WebCryptoP256'
import type { Chain, Client, Transport } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { readContract, writeContract } from 'viem/actions'
import {
  type Authorization as Authorization_viem,
  prepareAuthorization,
  signAuthorization,
} from 'viem/experimental'

import { experimentalDelegationAbi } from '../generated.js'
import type { OneOf, Undefined } from './types.js'

////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////

export type Account = {
  address: Address.Address
  label: string
  keys: readonly Key[]
}

export type BaseKey<type extends string, properties> = {
  expiry: bigint
  publicKey: PublicKey.PublicKey
  type: type
} & OneOf<
  | ({
      status: 'unlocked'
    } & properties)
  | ({
      status: 'locked'
    } & Undefined<properties>)
>

export type Calls = readonly {
  to: Address.Address
  value?: bigint | undefined
  data?: Hex.Hex | undefined
}[]

export type Key = WebAuthnKey | WebCryptoKey

export type SerializedKey = {
  expiry: bigint
  keyType: number
  publicKey: PublicKey.PublicKey
}

export type WebAuthnKey = BaseKey<'webauthn', WebAuthnP256.P256Credential>

export type WebCryptoKey = BaseKey<
  'p256',
  {
    privateKey: CryptoKey
  }
>

////////////////////////////////////////////////////////////////
// Constants
////////////////////////////////////////////////////////////////

const keyType = {
  p256: 0,
  webauthn: 1,
} as const

const keyTypeSerialized = {
  0: 'p256',
  1: 'webauthn',
} as const

////////////////////////////////////////////////////////////
// Actions
////////////////////////////////////////////////////////////

/** Authorizes a key onto an Account. */
export async function authorize<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: authorize.Parameters,
) {
  const { account, keys, keyIndex = 0, rpId } = parameters

  const { payload, serializedKeys } = await getAuthorizeSignPayload(client, {
    address: account.address,
    keys,
  })

  const signature = await sign({ account, payload, keyIndex, rpId })

  const hash = await writeContract(client, {
    abi: experimentalDelegationAbi,
    address: account.address,
    functionName: 'authorize',
    args: [serializedKeys, signature],
    account: null,
    chain: null,
  })

  return { hash }
}

export declare namespace authorize {
  type Parameters = {
    /** Account to add the key to. */
    account: Account
    /** Keys to authorize. */
    keys: readonly Key[]
    /** Index of the key to sign with. */
    keyIndex?: number | undefined
    /** Relying Party ID. */
    rpId?: string | undefined
  }
}

/** Creates a new Account. */
export async function create<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: create.Parameters,
) {
  // Generate a random private key to instantiate the Account.
  // We will only hold onto the private key for the duration of this lexical scope
  // (we will not persist it).
  const privateKey = Secp256k1.randomPrivateKey()

  // Derive the Account's address from the private key. We will use this as the
  // Transaction target, as well as for the label/id on the WebAuthn credential.
  const address = Address.fromPublicKey(Secp256k1.getPublicKey({ privateKey }))

  // Prepare values needed to fill the initialize call, and extract the payloads
  // to sign over.
  const result = await prepareInitialize(client, {
    ...parameters,
    address,
  })

  // Sign the authorization to designate the delegation contract onto the
  // account.
  const authorization = await signAuthorization(client, {
    account: privateKeyToAccount(privateKey),
    ...result.authorization,
  })

  // Sign the `initialize` payload for account initialization.
  const signature = Secp256k1.sign({
    payload: result.signPayload,
    privateKey,
  })

  return initialize(client, {
    ...result,
    authorization,
    signature,
  })
}

export declare namespace create {
  type Parameters = {
    /** Extra keys to authorize. */
    authorizeKeys?: readonly Key[] | undefined
    /** Contract address to delegate to. */
    delegation: Address.Address
    /** Label for the account. */
    label?: string | undefined
    /** Relying Party ID. */
    rpId?: string | undefined
  }
}

/** Creates a new WebAuthn-P256 Account key. */
export async function createWebAuthnKey(
  parameters: createWebAuthnKey.Parameters,
): Promise<WebAuthnKey> {
  const { expiry = 0n, rpId, label, userId } = parameters

  const key = await WebAuthnP256.createCredential({
    authenticatorSelection: {
      requireResidentKey: false,
      residentKey: 'preferred',
      userVerification: 'required',
    },
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

  return {
    ...key,
    expiry,
    status: 'unlocked',
    type: 'webauthn',
  }
}

export declare namespace createWebAuthnKey {
  type Parameters = {
    /** Expiry for the key. */
    expiry?: bigint | undefined
    /** Relying Party ID. */
    rpId?: string | undefined
    /** Label for the key. */
    label: string
    /** User ID. */
    userId: Bytes.Bytes
  }
}

/** Creates a new WebCrypto-P256 Account key. */
export async function createWebCryptoKey(
  parameters: createWebCryptoKey.Parameters,
): Promise<WebCryptoKey> {
  const { expiry } = parameters
  const keyPair = await WebCryptoP256.createKeyPair()
  return {
    ...keyPair,
    expiry,
    status: 'unlocked',
    type: 'p256',
  }
}

export declare namespace createWebCryptoKey {
  type Parameters = {
    /** Expiry for the key. */
    expiry: bigint
  }
}

/** Executes calls on an Account. */
export async function execute<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: execute.Parameters,
) {
  const { account, calls, keyIndex = 0, rpId } = parameters

  // Fetch the latest nonce. We will need to sign over it for replay protection.
  const nonce = await readContract(client, {
    abi: experimentalDelegationAbi,
    address: account.address,
    functionName: 'nonce',
  })

  // Encode the calls.
  const encodedCalls = Hex.concat(
    ...calls.map((call) =>
      AbiParameters.encodePacked(
        ['uint8', 'address', 'uint256', 'uint256', 'bytes'],
        [
          0,
          call.to,
          call.value ?? 0n,
          BigInt(Hex.size(call.data ?? '0x')),
          call.data ?? '0x',
        ],
      ),
    ),
  )

  // Construct the signing payload.
  const payload = Hash.keccak256(
    AbiParameters.encodePacked(['uint256', 'bytes'], [nonce, encodedCalls]),
  )

  // Sign the payload with a provided key index (we will use the key at the
  // provided index to sign).
  const signature = await sign({ account, payload, keyIndex, rpId })

  // Execute the calls.
  return await writeContract(client, {
    abi: experimentalDelegationAbi,
    address: account.address,
    functionName: 'execute',
    args: [encodedCalls, signature],
    account: null,
    chain: null,
  })
}

export declare namespace execute {
  type Parameters = {
    /** Account to execute the calls on. */
    account: Account
    /** Calls to execute. */
    calls: Calls
    /** Index of the key to sign with. */
    keyIndex?: number | undefined
    /** Relying Party ID. */
    rpId?: string | undefined
  }
}

/** Gets the signing payload for authorizing a key. */
export async function getAuthorizeSignPayload<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getAuthorizeSignPayload.Parameters,
) {
  const { address, keys } = parameters

  // Fetch the latest nonce. We will need to sign over it for replay protection.
  const nonce = await readContract(client, {
    abi: experimentalDelegationAbi,
    address: address!,
    functionName: 'nonce',
  })

  // Serialize the key.
  const serializedKeys = serializeKeys(keys)

  // Construct the signing payload.
  const payload = Hash.keccak256(
    AbiParameters.encode(
      AbiParameters.from([
        'struct PublicKey { uint256 x; uint256 y; }',
        'struct Key { uint256 expiry; uint8 keyType; PublicKey publicKey; }',
        'uint256 nonce',
        'Key[] keys',
      ]),
      [nonce, serializedKeys],
    ),
  )

  return { payload, serializedKeys }
}

export declare namespace getAuthorizeSignPayload {
  type Parameters = {
    address: Address.Address
    keys: readonly Key[]
  }
}

/** Initializes an Account. */
export async function initialize<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: initialize.Parameters,
) {
  const { account, authorization, signature } = parameters
  const { address, keys, label } = account

  // Serialize keys into format for contract.
  const serializedKeys = serializeKeys(keys)

  // Designate the delegation with the authorization, and initialize (and authorize keys) the Account.
  const hash = await writeContract(client, {
    abi: experimentalDelegationAbi,
    address,
    functionName: 'initialize',
    args: [label, serializedKeys, signature!],
    authorizationList: [authorization],
    account: null,
    chain: null,
  })

  return {
    account,
    hash,
  }
}

export declare namespace initialize {
  type Parameters = {
    account: Account
    authorization: Authorization_viem
    signature: Signature.Signature
  }
}

/** Whether or not the provided key is an active session key. */
export function isActiveSessionKey(key: Key) {
  return (
    key.expiry > BigInt(Math.floor(Date.now() / 1000)) &&
    key.status === 'unlocked'
  )
}

/** Loads an existing Account. */
export async function load<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: load.Parameters = {},
) {
  const { authorizeKeys = [], rpId } = parameters

  let address: Address.Address
  let raw: PublicKeyCredential
  let credentialId: string
  if (parameters.address && parameters.credentialId) {
    address = parameters.address
    credentialId = parameters.credentialId
  } else {
    // We will sign a random challenge. We need to do this to extract the
    // user id (ie. the address) to query for the Account's keys.
    const credential = await WebAuthnP256.sign({
      challenge: '0x',
      rpId,
    })

    const response = credential.raw.response as AuthenticatorAssertionResponse
    address = Bytes.toHex(new Uint8Array(response.userHandle!))
    credentialId = credential.raw.id
    raw = credential.raw
  }

  // If there are extra keys to authorize (ie. session keys), sign over them.
  const authorizeKeysResult = await (async () => {
    if (authorizeKeys.length === 0) return undefined

    const { serializedKeys, payload } = await getAuthorizeSignPayload(client, {
      address,
      keys: authorizeKeys ?? [],
    })

    const { signature, metadata, ...rest } = await WebAuthnP256.sign({
      challenge: payload,
      credentialId,
      rpId,
    })
    raw = rest.raw

    // if `address` and `credentialId` were passed (to remove first signature),
    // check to make sure `address` matches the key used for the second signature.
    if (parameters.address && parameters.credentialId) {
      const response = rest.raw.response as AuthenticatorAssertionResponse
      const userHandle = Bytes.toHex(new Uint8Array(response.userHandle!))
      if (address !== userHandle)
        throw new Error(
          `supplied address "${address}" does not match signature address "${userHandle}"`,
        )
    }

    const wrappedSignature = wrapSignature({
      metadata: getWebAuthnMetadata(metadata),
      signature,
    })

    return { serializedKeys, signature: wrappedSignature }
  })()

  // Query for the Account's keys and label, and authorize additional keys if provided.
  const [serializedKeys, label] = await Promise.all([
    readContract(client, {
      abi: experimentalDelegationAbi,
      address,
      functionName: 'getKeys',
    }),
    readContract(client, {
      abi: experimentalDelegationAbi,
      address,
      functionName: 'label',
    }),
    authorizeKeysResult
      ? writeContract(client, {
          abi: experimentalDelegationAbi,
          address,
          functionName: 'authorize',
          args: [
            authorizeKeysResult.serializedKeys,
            authorizeKeysResult.signature,
          ],
          account: null,
          chain: null,
        })
      : null,
  ])

  const keys = [
    // Hydrate the keys from the Account's contract.
    ...serializedKeys.map((key, index) => {
      // Assume that the first key is the "master" WebAuthn key.
      if (index === 0)
        return {
          expiry: 0n,
          id: credentialId,
          publicKey: PublicKey.from(key.publicKey),
          raw,
          status: 'unlocked',
          type: 'webauthn',
        } satisfies WebAuthnKey

      return {
        expiry: key.expiry,
        publicKey: PublicKey.from(key.publicKey),
        status: 'locked',
        type: (keyTypeSerialized as any)[key.keyType],
      } satisfies Key
    }),
    // Add the additional keys that were authorized.
    ...(authorizeKeys ?? []),
  ] satisfies Key[]

  return {
    account: {
      address,
      label,
      keys,
    },
  }
}

export declare namespace load {
  type Parameters = {
    /** Address of the account to load. */
    address?: Address.Address | undefined
    /** Extra keys to authorize. */
    authorizeKeys?: readonly Key[] | undefined
    /** Credential ID to use to load an existing account. */
    credentialId?: string | undefined
    /** Relying Party ID. */
    rpId?: string | undefined
  }
}

/**
 * Prepares values needed to fill the `initialize` function, as well as the payloads to
 * sign for account initialization.
 */
export async function prepareInitialize<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: prepareInitialize.Parameters,
): Promise<prepareInitialize.ReturnType> {
  const { address, authorizeKeys, delegation, rpId } = parameters

  // Create an identifiable label for the Account.
  const label =
    parameters.label ?? `${address.slice(0, 8)}\u2026${address.slice(-6)}`

  // Create a WebAuthn-P256 key to attach and authorize onto the the Account.
  const key = await createWebAuthnKey({
    label,
    rpId,
    userId: Bytes.from(address),
  })

  const keys = [key, ...(authorizeKeys ?? [])]

  // Serialize keys into format for contract.
  const serializedKeys = serializeKeys(keys)

  // Construct the initialize payload to sign (nonce will always be zero for instantiation).
  const signPayload = Hash.keccak256(
    AbiParameters.encode(
      AbiParameters.from([
        'struct PublicKey { uint256 x; uint256 y; }',
        'struct Key { uint256 expiry; uint8 keyType; PublicKey publicKey; }',
        'uint256 nonce',
        'string label',
        'Key[] keys',
      ]),
      [0n, label, serializedKeys],
    ),
  )

  // Prepare an authorization to sign to designate the delegation contract onto the Account.
  const authorization = await prepareAuthorization(client, {
    account: address,
    contractAddress: delegation,
    delegate: true,
  })

  return {
    account: {
      address,
      keys,
      label,
    },
    authorization,
    signPayload,
  }
}

export declare namespace prepareInitialize {
  type Parameters = {
    /** Address of the account to import. */
    address: Address.Address
    /** Extra keys to authorize. */
    authorizeKeys?: readonly Key[] | undefined
    /** Contract address to delegate to. */
    delegation: Address.Address
    /** Label for the account. */
    label?: string | undefined
    /** Relying Party ID. */
    rpId?: string | undefined
  }

  type ReturnType = {
    account: Account
    authorization: Authorization_viem
    signPayload: Hex.Hex
  }
}

/** Serializes keys into format for the delegation contract. */
export function serializeKeys(keys: readonly Key[]) {
  return keys.map((key) => ({
    expiry: key.expiry,
    keyType: keyType[key.type],
    publicKey: key.publicKey,
  }))
}

/** Signs a payload with a key on the Account. */
export async function sign(parameters: sign.Parameters) {
  const { account, payload, keyIndex = 0, rpId } = parameters

  const key = account.keys[keyIndex]

  // If the key is not found, or is locked, we cannot sign.
  if (!key) throw new Error('key not found')
  if (key.status === 'locked') throw new Error('key is locked')

  if (key.type === 'webauthn') {
    const { signature, metadata } = await WebAuthnP256.sign({
      challenge: payload,
      credentialId: key.id,
      rpId,
    })

    return wrapSignature({
      metadata: getWebAuthnMetadata(metadata),
      signature,
    })
  }

  if (key.type === 'p256') {
    const signature = await WebCryptoP256.sign({
      payload,
      privateKey: key.privateKey,
    })

    return wrapSignature({
      signature,
      keyIndex,
      prehash: true,
    })
  }

  throw new Error(`type not supported: ${(key as any).type}`)
}

export declare namespace sign {
  export type Parameters = {
    /** Account to sign with. */
    account: Account
    /** Payload to sign. */
    payload: Hex.Hex
    /** Index of the key to sign with. */
    keyIndex?: number | undefined
    /** Relying Party ID. */
    rpId?: string | undefined
  }
}

////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////

function wrapSignature(parameters: {
  keyIndex?: number | undefined
  metadata?: Hex.Hex | undefined
  prehash?: boolean | undefined
  signature: Signature.Signature<boolean>
}) {
  const {
    keyIndex = 0,
    metadata = '0x',
    prehash = false,
    signature,
  } = parameters
  return AbiParameters.encode(
    AbiParameters.from([
      'struct Signature { uint256 r; uint256 s; uint8 yParity; }',
      'struct WrappedSignature { uint32 keyIndex; Signature signature; bool prehash; bytes metadata; }',
      'WrappedSignature wrappedSignature',
    ]),
    [
      {
        keyIndex,
        signature: { r: signature.r, s: signature.s, yParity: 0 },
        prehash,
        metadata,
      },
    ],
  )
}

function getWebAuthnMetadata(metadata: WebAuthnP256.SignMetadata) {
  return AbiParameters.encode(
    AbiParameters.from([
      'struct Metadata { bytes authenticatorData; string clientDataJSON; uint16 challengeIndex; uint16 typeIndex; bool userVerificationRequired; }',
      'Metadata metadata',
    ]),
    [metadata],
  )
}
