import type { RpcRequest } from 'ox'
import * as Address from 'ox/Address'
import * as Bytes from 'ox/Bytes'
import type * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as PublicKey from 'ox/PublicKey'
import * as Secp256k1 from 'ox/Secp256k1'
import * as TypedData from 'ox/TypedData'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import type { Client, Hash, Transport } from 'viem'
import { readContract } from 'viem/actions'

import type * as Chains from './Chains.js'
import type { Config } from './Porto.js'
import * as Account from './internal/account.js'
import * as Call from './internal/call.js'
import * as Delegation from './internal/delegation.js'
import { delegationAbi } from './internal/generated.js'
import * as Key from './internal/key.js'
import type * as RpcSchema from './internal/rpcSchema.js'
import type { Compute } from './internal/types.js'

type Request = Pick<RpcRequest.RpcRequest, 'method' | 'params'>

export type Implementation = {
  actions: {
    authorizeKey: (parameters: {
      /** Account to authorize the keys for. */
      account: Account.Account
      /** Key to authorize. */
      key?: RpcSchema.AuthorizeKeyParameters['key'] | undefined
      /** Viem Client. */
      client: Client<Transport, Chains.Chain>
      /** Porto config. */
      config: Config
      /** RPC Request. */
      request: Request
    }) => Promise<{ hash: Hex.Hex; key: Key.Key }>

    createAccount: (parameters: {
      /** Extra keys to authorize. */
      authorizeKeys?:
        | true
        | readonly RpcSchema.AuthorizeKeyParameters['key'][]
        | undefined
      /** Viem Client. */
      client: Client<Transport, Chains.Chain>
      /** Porto config. */
      config: Config
      /** Label to associate with the WebAuthn credential. */
      label?: string | undefined
      /** RPC Request. */
      request: Request
    }) => Promise<{
      /** Account. */
      account: Account.Account
      /** Transaction hash. */
      hash: Hash
    }>

    execute: (parameters: {
      /** Account to execute the calls with. */
      account: Account.Account
      /** Calls to execute. */
      calls: readonly Call.Call[]
      /** Viem Client. */
      client: Client<Transport, Chains.Chain>
      /** Key to use to execute the calls. */
      key?: { publicKey: Hex.Hex } | undefined
      /** Porto config. */
      config: Config
      /** RPC Request. */
      request: Request
    }) => Promise<Hex.Hex>

    loadAccounts: (parameters: {
      /** Address of the account to load. */
      address?: Address.Address | undefined
      /** Extra keys to authorize. */
      authorizeKeys?:
        | true
        | readonly RpcSchema.AuthorizeKeyParameters['key'][]
        | undefined
      /** Viem Client. */
      client: Client<Transport, Chains.Chain>
      /** Porto config. */
      config: Config
      /** Credential ID to use to load an existing account. */
      credentialId?: string | undefined
      /** RPC Request. */
      request: Request
    }) => Promise<{
      /** Accounts. */
      accounts: readonly Account.Account[]
    }>

    signPersonalMessage: (parameters: {
      /** Account to sign the message with. */
      account: Account.Account
      /** Viem Client. */
      client: Client<Transport, Chains.Chain>
      /** Porto config. */
      config: Config
      /** Data to sign. */
      data: Hex.Hex
      /** RPC Request. */
      request: Request
    }) => Promise<Hex.Hex>

    signTypedData: (parameters: {
      /** Account to sign the message with. */
      account: Account.Account
      /** Viem Client. */
      client: Client<Transport, Chains.Chain>
      /** Porto config. */
      config: Config
      /** Data to sign. */
      data: string
      /** RPC Request. */
      request: Request
    }) => Promise<Hex.Hex>
  }
}

/**
 * Instantiates an implementation.
 *
 * @param implementation - Implementation.
 * @returns Implementation.
 */
export function from<const implementation extends Implementation>(
  implementation: implementation | Implementation,
): Compute<implementation> {
  return implementation as implementation
}

/**
 * Implementation for a WebAuthn-based local environment. Account management
 * and signing is handled locally.
 *
 * @param parameters - Parameters.
 * @returns Implementation.
 */
export function local(parameters: local.Parameters = {}) {
  const defaultExpiry = Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour

  const keystoreHost = (() => {
    if (parameters.keystoreHost === 'self') return undefined
    if (
      typeof window !== 'undefined' &&
      window.location.hostname === 'localhost'
    )
      return undefined
    return parameters.keystoreHost
  })()

  return from({
    actions: {
      async authorizeKey(parameters) {
        const { account, client, key: keyToAuthorize } = parameters

        const keys = await getKeysToAuthorize({
          authorizeKeys: [keyToAuthorize],
          defaultExpiry,
        })

        // TODO: wait for tx to be included?
        const hash = await Delegation.execute(client, {
          account,
          calls: keys!.flatMap((key) => [
            Call.setCanExecute({ key }),
            Call.authorize({ key }),
          ]),
        })

        return { hash, key: keys![0]! }
      },

      async createAccount(parameters) {
        const { authorizeKeys, client } = parameters

        const privateKey = Secp256k1.randomPrivateKey()
        const address = Address.fromPublicKey(
          Secp256k1.getPublicKey({ privateKey }),
        )

        const label =
          parameters.label ?? `${address.slice(0, 8)}\u2026${address.slice(-6)}`

        const key = await Key.createWebAuthnP256({
          label,
          role: 'admin',
          rpId: keystoreHost,
          userId: Bytes.from(address),
        })

        const extraKeys = await getKeysToAuthorize({
          authorizeKeys,
          defaultExpiry,
        })

        const account = Account.fromPrivateKey(privateKey, {
          keys: [key, ...(extraKeys ?? [])],
        })
        const delegation = client.chain.contracts.delegation.address

        // TODO: wait for tx to be included?
        const hash = await Delegation.execute(client, {
          account,
          calls: account.keys.flatMap((key) => [
            Call.setCanExecute({ key }),
            Call.authorize({ key }),
          ]),
          delegation,
        })

        return { account, hash }
      },

      async execute(parameters) {
        const { account, calls, client } = parameters

        const key = (() => {
          if (parameters.key) {
            const key = account.keys?.find(
              (key) =>
                key.publicKey === parameters.key?.publicKey && key.canSign,
            )
            if (!key)
              throw new Error(
                `key (publicKey: ${parameters.key?.publicKey}) does not exist or is not a provider-managed key.`,
              )
            return key
          }
          const sessionKey = account.keys?.find(
            (key) =>
              key.canSign &&
              key.role === 'session' &&
              key.expiry > BigInt(Math.floor(Date.now() / 1000)),
          )
          const adminKey = account.keys?.find(
            (key) => key.role === 'admin' && key.canSign,
          )
          return sessionKey ?? adminKey
        })()

        const hash = await Delegation.execute(client, {
          account,
          calls,
          key,
        })

        return hash
      },

      async loadAccounts(parameters) {
        const { authorizeKeys, client } = parameters

        const { address, credentialId } = await (async () => {
          if (parameters.address && parameters.credentialId)
            return {
              address: parameters.address,
              credentialId: parameters.credentialId,
            }

          // We will sign a random challenge. We need to do this to extract the
          // user id (ie. the address) to query for the Account's keys.
          const credential = await WebAuthnP256.sign({
            challenge: '0x',
            rpId: keystoreHost,
          })
          const response = credential.raw
            .response as AuthenticatorAssertionResponse

          const address = Bytes.toHex(new Uint8Array(response.userHandle!))
          const credentialId = credential.raw.id

          return { address, credentialId }
        })()

        // Fetch the delegated account's keys.
        const [keyCount, extraKeys] = await Promise.all([
          readContract(client, {
            abi: delegationAbi,
            address,
            functionName: 'keyCount',
          }),
          getKeysToAuthorize({
            authorizeKeys,
            defaultExpiry,
          }),
        ])
        const keys = await Promise.all(
          Array.from({ length: Number(keyCount) }, (_, index) =>
            Delegation.keyAt(client, { account: address, index }),
          ),
        )

        // Instantiate the account based off the extracted address and keys.
        const account = Account.from({
          address,
          keys: [...keys, ...(extraKeys ?? [])].map((key, i) => {
            // Assume that the first key is the admin WebAuthn key.
            if (i === 0 && key.type === 'webauthn-p256')
              return Key.fromWebAuthnP256({
                ...key,
                credential: {
                  id: credentialId,
                  publicKey: PublicKey.fromHex(key.publicKey),
                },
              })
            return key
          }),
        })

        if (extraKeys)
          await Delegation.execute(client, {
            account,
            calls: extraKeys.flatMap((key) => [
              Call.setCanExecute({ key }),
              Call.authorize({ key }),
            ]),
          })

        return {
          accounts: [account],
        }
      },

      async signPersonalMessage(parameters) {
        const { account, data } = parameters

        const key = account.keys?.find(
          (key) => key.role === 'admin' && key.canSign,
        )
        if (!key) throw new Error('cannot find admin key to sign with.')

        const [signature] = await Account.sign(account, {
          key,
          payloads: [PersonalMessage.getSignPayload(data)],
        })

        return signature
      },

      async signTypedData(parameters) {
        const { account, data } = parameters

        const key = account.keys?.find(
          (key) => key.role === 'admin' && key.canSign,
        )
        if (!key) throw new Error('cannot find admin key to sign with.')

        const [signature] = await Account.sign(account, {
          key,
          payloads: [TypedData.getSignPayload(Json.parse(data))],
        })

        return signature
      },
    },
  })
}

export declare namespace local {
  type Parameters = {
    /**
     * Keystore host (WebAuthn relying party).
     * @default 'self'
     */
    keystoreHost?: 'self' | (string & {}) | undefined
  }
}

// TODO
export function iframe() {
  throw new Error('Not implemented.')
}

/**
 * Mock P256 implementation for testing.
 *
 * @param parameters - Parameters.
 * @returns Implementation.
 */
export function mock() {
  let address: Address.Address | undefined

  return from({
    actions: {
      ...local().actions,

      async createAccount(parameters) {
        const { authorizeKeys, client } = parameters

        const privateKey = Secp256k1.randomPrivateKey()

        const key = Key.createP256({
          role: 'admin',
        })

        const extraKeys = await getKeysToAuthorize({
          authorizeKeys,
          defaultExpiry: 694206942069,
        })

        const account = Account.fromPrivateKey(privateKey, {
          keys: [key, ...(extraKeys ?? [])],
        })
        const delegation = client.chain.contracts.delegation.address

        address = account.address

        const hash = await Delegation.execute(client, {
          account,
          calls: account.keys.flatMap((key) => [
            Call.setCanExecute({ key }),
            Call.authorize({ key }),
          ]),
          delegation,
        })

        return { account, hash }
      },

      async loadAccounts(parameters) {
        const { client } = parameters

        if (!address) throw new Error('no address found.')

        const keyCount = await readContract(client, {
          abi: delegationAbi,
          address,
          functionName: 'keyCount',
        })
        const keys = await Promise.all(
          Array.from({ length: Number(keyCount) }, (_, index) =>
            Delegation.keyAt(client, { account: address!, index }),
          ),
        )

        const account = Account.from({
          address,
          keys,
        })

        return {
          accounts: [account],
        }
      },
    },
  })
}

///////////////////////////////////////////////////////////////////////////
// Internal
///////////////////////////////////////////////////////////////////////////

async function getKeysToAuthorize(parameters: {
  authorizeKeys:
    | true
    | readonly RpcSchema.AuthorizeKeyParameters['key'][]
    | undefined
  defaultExpiry: number
}) {
  const { authorizeKeys, defaultExpiry } = parameters

  // Don't need to authorize extra keys if none are provided.
  if (!authorizeKeys) return undefined

  // If truthy, authorize an arbitrary session key.
  if (authorizeKeys === true)
    return [
      await Key.createWebCryptoP256({
        expiry: defaultExpiry,
        role: 'session',
      }),
    ]

  // Otherwise, authorize the provided keys.
  return await Promise.all(
    authorizeKeys.map(async (key) => {
      const expiry = key?.expiry ?? defaultExpiry
      if (key?.publicKey)
        return Key.from({
          ...key,
          canSign: false,
          expiry,
        })
      return await Key.createWebCryptoP256({
        expiry,
        role: 'session',
      })
    }),
  )
}
