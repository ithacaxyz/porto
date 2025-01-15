import * as AbiItem from 'ox/AbiItem'
import * as Address from 'ox/Address'
import * as Bytes from 'ox/Bytes'
import * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as Provider from 'ox/Provider'
import * as PublicKey from 'ox/PublicKey'
import * as RpcRequest from 'ox/RpcRequest'
import * as RpcSchema from 'ox/RpcSchema'
import * as Secp256k1 from 'ox/Secp256k1'
import * as TypedData from 'ox/TypedData'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import { readContract } from 'viem/actions'

import * as Dialog from './Dialog.js'
import type { Clients, QueuedRequest } from './Porto.js'
import * as Account from './internal/account.js'
import * as Call from './internal/call.js'
import * as Delegation from './internal/delegation.js'
import { delegationAbi } from './internal/generated.js'
import * as Key from './internal/key.js'
import type * as Porto from './internal/porto.js'
import type * as RpcSchema_porto from './internal/rpcSchema.js'
import type { Compute, PartialBy } from './internal/types.js'

type Request = RpcSchema.ExtractRequest<RpcSchema_porto.Schema>

type ActionsInternal = Porto.Internal & {
  /** Viem Clients. */
  clients: Clients
  /** RPC Request. */
  request: Request
}

export type Implementation = {
  actions: {
    authorizeKey: (parameters: {
      /** Account to authorize the keys for. */
      account: Account.Account
      /** Key to authorize. */
      key?: RpcSchema_porto.AuthorizeKeyParameters['key'] | undefined
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<{ key: Key.Key }>

    createAccount: (parameters: {
      /** Extra keys to authorize. */
      authorizeKeys?:
        | readonly RpcSchema_porto.AuthorizeKeyParameters['key'][]
        | undefined
      /** Preparation context (from `prepareCreateAccount`). */
      context?: unknown | undefined
      /** Internal properties. */
      internal: ActionsInternal
      /** Label to associate with the WebAuthn credential. */
      label?: string | undefined
      /** Preparation signatures (from `prepareCreateAccount`). */
      signatures?: readonly Hex.Hex[] | undefined
    }) => Promise<{
      /** Account. */
      account: Account.Account
    }>

    execute: (parameters: {
      /** Account to execute the calls with. */
      account: Account.Account
      /** Calls to execute. */
      calls: readonly Call.Call[]
      /** Key to use to execute the calls. */
      key?: { publicKey: Hex.Hex } | undefined
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<Hex.Hex>

    loadAccounts: (parameters: {
      /** Address of the account to load. */
      address?: Address.Address | undefined
      /** Extra keys to authorize. */
      authorizeKeys?:
        | readonly RpcSchema_porto.AuthorizeKeyParameters['key'][]
        | undefined
      /** Credential ID to use to load an existing account. */
      credentialId?: string | undefined
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<{
      /** Accounts. */
      accounts: readonly Account.Account[]
    }>

    prepareCreateAccount: (parameters: {
      /** Address of the account to import. */
      address: Address.Address
      /** Extra keys to authorize. */
      authorizeKeys?:
        | readonly RpcSchema_porto.AuthorizeKeyParameters['key'][]
        | undefined
      /** Label to associate with the account. */
      label?: string | undefined
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<{
      /** Filled context for the `createAccount` implementation. */
      context: unknown
      /** Hex payloads to sign over. */
      signPayloads: Hex.Hex[]
    }>

    revokeKey: (parameters: {
      /** Account to revoke the key for. */
      account: Account.Account
      /** Public key of the key to revoke. */
      publicKey: Hex.Hex
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<void>

    signPersonalMessage: (parameters: {
      /** Account to sign the message with. */
      account: Account.Account
      /** Data to sign. */
      data: Hex.Hex
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<Hex.Hex>

    signTypedData: (parameters: {
      /** Account to sign the message with. */
      account: Account.Account
      /** Data to sign. */
      data: string
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<Hex.Hex>
  }
  setup: (parameters: {
    /** Internal properties. */
    internal: Porto.Internal
  }) => () => void
}

const defaultExpiry = Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour

/**
 * Instantiates an implementation.
 *
 * @param implementation - Implementation.
 * @returns Implementation.
 */
export function from<const implementation extends from.Parameters>(
  implementation: implementation | from.Parameters,
): Compute<implementation & Pick<Implementation, 'setup'>> {
  return {
    ...implementation,
    setup: implementation.setup ?? (() => {}),
  } as implementation & Pick<Implementation, 'setup'>
}

export declare namespace from {
  type Parameters = PartialBy<Implementation, 'setup'>
}

/**
 * Implementation for a WebAuthn-based local environment. Account management
 * and signing is handled locally.
 *
 * @param parameters - Parameters.
 * @returns Implementation.
 */
export function local(parameters: local.Parameters = {}) {
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
        const { account, key: keyToAuthorize, internal } = parameters
        const { clients } = internal

        const keys = await getKeysToAuthorize({
          authorizeKeys: [keyToAuthorize],
          defaultExpiry,
        })

        // TODO: wait for tx to be included?
        await Delegation.execute(clients.relay, {
          account,
          calls: getAuthorizeCalls(keys!),
        })

        return { key: keys![0]! }
      },

      async createAccount(parameters) {
        const { authorizeKeys, label, internal } = parameters
        const { clients } = internal

        const { account, context, signatures } = await (async () => {
          if (parameters.context && parameters.signatures)
            return {
              account: (parameters.context as any).account,
              context: parameters.context,
              signatures: parameters.signatures,
            }

          const privateKey = Secp256k1.randomPrivateKey()
          const address = Address.fromPublicKey(
            Secp256k1.getPublicKey({ privateKey }),
          )

          const { context, signPayloads } = await prepareCreateAccount({
            address,
            authorizeKeys,
            clients,
            defaultExpiry,
            keystoreHost,
            label,
          })

          const account = Account.fromPrivateKey(privateKey, {
            keys: context.account.keys,
          })
          const signatures = await Account.sign(account, {
            payloads: signPayloads,
          })

          return { account, context, signatures }
        })()

        await Delegation.execute(clients.relay, {
          ...(context as any),
          account,
          signatures,
        })

        return { account }
      },

      async execute(parameters) {
        const { account, calls, internal } = parameters
        const { clients } = internal

        const key = (() => {
          // If a key is provided, use it.
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

          // Otherwise, try and find a valid session key.
          const sessionKey = account.keys?.find((key) => {
            if (!key.canSign) return false
            if (key.role !== 'session') return false
            if (key.expiry < BigInt(Math.floor(Date.now() / 1000))) return false

            const hasInvalidScope = key.callScopes?.some((scope) =>
              calls.some((call) => {
                if (scope.to && scope.to !== call.to) return true
                if (scope.signature) {
                  if (!call.data) return true
                  const selector = Hex.slice(call.data, 0, 4)
                  if (
                    Hex.validate(scope.signature) &&
                    scope.signature !== selector
                  )
                    return true
                  if (AbiItem.getSelector(scope.signature) !== selector)
                    return true
                }
                return false
              }),
            )
            if (hasInvalidScope) return false

            return true
          })

          // Fall back to an admin key.
          const adminKey = account.keys?.find(
            (key) => key.role === 'admin' && key.canSign,
          )

          return sessionKey ?? adminKey
        })()

        const hash = await Delegation.execute(clients.relay, {
          account,
          calls,
          key,
        })

        return hash
      },

      async loadAccounts(parameters) {
        const { authorizeKeys, internal } = parameters
        const { clients } = internal

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
          readContract(clients.default, {
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
            Delegation.keyAt(clients.default, { account: address, index }),
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
          await Delegation.execute(clients.relay, {
            account,
            calls: getAuthorizeCalls(extraKeys),
          })

        return {
          accounts: [account],
        }
      },

      async prepareCreateAccount(parameters) {
        const { address, authorizeKeys, label, internal } = parameters
        const { clients } = internal
        return await prepareCreateAccount({
          address,
          authorizeKeys,
          clients,
          defaultExpiry,
          keystoreHost,
          label,
        })
      },

      async revokeKey(parameters) {
        const { account, internal, publicKey } = parameters
        const { clients } = internal

        const key = account.keys?.find((key) => key.publicKey === publicKey)
        if (!key) return

        if (
          key.role === 'admin' &&
          account.keys?.map((x) => x.role === 'admin').length === 1
        )
          throw new Error(
            'cannot revoke key. account must have at least one admin key.',
          )

        await Delegation.execute(clients.relay, {
          account,
          calls: [Call.setCanExecute({ key, enabled: false })],
        })
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

export function dialog(parameters: dialog.Parameters = {}) {
  const {
    host = 'http://localhost:5174', // TODO: change
    renderer = Dialog.iframe(),
  } = parameters

  const requestStore = RpcRequest.createStore()

  function getProvider(store: Porto.Internal['store']) {
    return Provider.from(
      {
        async request(r) {
          const request = requestStore.prepare(r as any)

          store.setState((x) => ({
            ...x,
            requestQueue: [
              ...x.requestQueue,
              {
                request,
                status: 'pending',
              },
            ],
          }))

          return new Promise((resolve, reject) => {
            const unsubscribe = store.subscribe(
              (x) => x.requestQueue,
              (requestQueue) => {
                if (requestQueue.length === 0) {
                  unsubscribe()
                  reject(new Provider.UserRejectedRequestError())
                }

                const queued = requestQueue.find(
                  (x) => x.request.id === request.id,
                )
                if (!queued) return
                if (queued.status !== 'success' && queued.status !== 'error')
                  return

                unsubscribe()

                if (queued.status === 'success') resolve(queued.result as any)
                else reject(Provider.parseError(queued.error))

                store.setState((x) => ({
                  ...x,
                  requestQueue: x.requestQueue.filter(
                    (x) => x.request.id !== request.id,
                  ),
                }))
              },
            )
          })
        },
      },
      { schema: RpcSchema.from<RpcSchema_porto.Schema>() },
    )
  }

  return from({
    actions: {
      async authorizeKey(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (request.method !== 'experimental_authorizeKey')
          throw new Error('Cannot authorize key for method: ' + request.method)

        const [{ address, key: keyToAuthorize }] = request.params

        const keys = await getKeysToAuthorize({
          authorizeKeys: [keyToAuthorize],
          defaultExpiry,
        })
        if (!keys || keys.length === 0) throw new Error('no keys found.')

        const key = keys[0]!

        const provider = getProvider(store)
        await provider.request({
          method: 'experimental_authorizeKey',
          params: [
            {
              address,
              key: Key.toRpc(key) as any,
            },
          ],
        })

        return { key }
      },

      async createAccount(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        const provider = getProvider(store)

        const account = await (async () => {
          if (request.method === 'experimental_createAccount') {
            const { address } = await provider.request(request)
            return Account.from({
              address,
            })
          }

          if (request.method === 'wallet_connect') {
            const [{ capabilities }] = request.params ?? [{}]

            const [authorizeKey] = await getKeysToAuthorize({
              authorizeKeys: capabilities?.authorizeKey
                ? [capabilities.authorizeKey]
                : undefined,
              defaultExpiry,
            })

            const authorizeKey_rpc = authorizeKey
              ? Key.toRpc(authorizeKey)
              : undefined

            const { accounts } = await provider.request({
              ...request,
              params: [
                {
                  capabilities: {
                    ...request.params?.[0]?.capabilities,
                    authorizeKey: authorizeKey_rpc as any,
                  },
                },
              ],
            })

            const [account] = accounts
            if (!account) throw new Error('no account found.')

            const keys = account.capabilities?.keys?.map((key) => {
              if (key.publicKey === authorizeKey?.publicKey) return authorizeKey
              return Key.fromRpc(key)
            })

            return Account.from({
              address: account.address,
              keys,
            })
          }

          throw new Error(
            `Account creation not supported on method: ${request.method}`,
          )
        })()

        return {
          account,
        }
      },

      // TODO: handle authorize keys
      async execute(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (
          request.method !== 'eth_sendTransaction' &&
          request.method !== 'wallet_sendCalls'
        )
          throw new Error('Cannot execute for method: ' + request.method)

        const provider = getProvider(store)
        const result = await provider.request(request)

        return result as Hex.Hex
      },

      // TODO: handle authorize keys
      async loadAccounts(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        const provider = getProvider(store)

        const accounts = await (async () => {
          if (request.method === 'eth_requestAccounts') {
            const addresses = await provider.request(request)
            return addresses.map((address) => ({
              address,
              capabilities: {
                keys: [],
              },
            }))
          }

          if (request.method === 'wallet_connect') {
            const result = await provider.request(request)
            return result.accounts
          }

          throw new Error('Cannot load accounts for method: ' + request.method)
        })()

        return {
          accounts: accounts.map((account) =>
            Account.from({
              address: account.address,
              keys: account.capabilities?.keys?.map(Key.fromRpc) ?? [],
            }),
          ),
        }
      },

      prepareCreateAccount() {
        throw new Error('TODO')
      },

      async revokeKey() {
        throw new Error('TODO')
      },

      async signPersonalMessage(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (request.method !== 'personal_sign')
          throw new Error(
            'Cannot sign personal message for method: ' + request.method,
          )

        const provider = getProvider(store)
        return await provider.request(request)
      },

      async signTypedData(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (request.method !== 'eth_signTypedData_v4')
          throw new Error(
            'Cannot sign typed data for method: ' + request.method,
          )

        const provider = getProvider(store)
        return await provider.request(request)
      },
    },
    setup(parameters) {
      const { internal } = parameters
      const { store } = internal

      const dialog = renderer.setup({
        host,
        internal,
      })

      const unsubscribe = store.subscribe(
        (x) => x.requestQueue,
        (requestQueue) => {
          const requests = requestQueue
            .map((x) => (x.status === 'pending' ? x : undefined))
            .filter(Boolean) as readonly QueuedRequest[]
          if (requests.length > 0) dialog.syncRequests(requests)
          else dialog.close()
        },
      )

      return () => {
        unsubscribe()
        dialog.destroy()
      }
    },
  })
}

export declare namespace dialog {
  type Parameters = {
    /**
     * Wallet embed host.
     * @default 'http://wallet.ithaca.xyz/embed'
     */
    host?: string | undefined
    /**
     * Dialog renderer.
     * @default Dialog.iframe()
     */
    renderer?: Dialog.Dialog | undefined
  }
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
        const { authorizeKeys, internal } = parameters
        const { clients } = internal

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
        const delegation = clients.default.chain.contracts.delegation.address

        address = account.address

        const hash = await Delegation.execute(clients.relay, {
          account,
          calls: getAuthorizeCalls(account.keys),
          delegation,
        })

        return { account, hash }
      },

      async loadAccounts(parameters) {
        const { internal } = parameters
        const { clients } = internal

        if (!address) throw new Error('no address found.')

        const keyCount = await readContract(clients.default, {
          abi: delegationAbi,
          address,
          functionName: 'keyCount',
        })
        const keys = await Promise.all(
          Array.from({ length: Number(keyCount) }, (_, index) =>
            Delegation.keyAt(clients.default, { account: address!, index }),
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

async function prepareCreateAccount(parameters: {
  address: Address.Address
  authorizeKeys:
    | readonly RpcSchema_porto.AuthorizeKeyParameters['key'][]
    | undefined
  clients: Clients
  defaultExpiry: number
  label?: string | undefined
  keystoreHost?: string | undefined
}) {
  const { address, authorizeKeys, clients, defaultExpiry, keystoreHost } =
    parameters

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

  const keys = [key, ...(extraKeys ?? [])]

  const account = Account.from({
    address,
    keys,
  })
  const delegation = clients.default.chain.contracts.delegation.address

  const { request, signPayloads } = await Delegation.prepareExecute(
    clients.default,
    {
      account,
      calls: getAuthorizeCalls(account.keys),
      delegation,
    },
  )

  return { context: request, signPayloads }
}

function getAuthorizeCalls(keys: readonly Key.Key[]) {
  return keys.flatMap((key) => {
    if (key.role === 'session' && (key.callScopes ?? []).length === 0)
      throw new Error(
        'session key must have at least one call scope (`callScope`).',
      )
    const scopes = key.callScopes
      ? key.callScopes.map((scope) => {
          const selector = (() => {
            if (!scope.signature) return undefined
            if (scope.signature.startsWith('0x'))
              return scope.signature as Hex.Hex
            return AbiItem.getSelector(scope.signature)
          })()
          return Call.setCanExecute({
            key,
            selector,
            to: scope.to,
          })
        })
      : [Call.setCanExecute({ key })]
    return [...scopes, Call.authorize({ key })]
  })
}

async function getKeysToAuthorize(parameters: {
  authorizeKeys:
    | readonly RpcSchema_porto.AuthorizeKeyParameters['key'][]
    | undefined
  defaultExpiry: number
}) {
  const { authorizeKeys, defaultExpiry } = parameters

  // Don't need to authorize extra keys if none are provided.
  if (!authorizeKeys) return []

  // Otherwise, authorize the provided keys.
  return await Promise.all(
    authorizeKeys.map(async (key) => {
      const expiry = key?.expiry ?? defaultExpiry
      const role = key?.role ?? 'session'
      if (key?.publicKey)
        return Key.from({
          ...key,
          canSign: false,
          expiry,
          role,
        })
      return await Key.createWebCryptoP256({
        callScopes: key?.callScopes,
        expiry,
        role: 'session',
      })
    }),
  )
}
