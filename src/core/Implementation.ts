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

import * as Delegation from './Delegation.js'
import * as Dialog from './Dialog.js'
import type { Client, QueuedRequest } from './Porto.js'
import type * as RpcSchema_porto from './RpcSchema.js'
import * as Account from './internal/account.js'
import * as Call from './internal/call.js'
import { delegationAbi } from './internal/generated.js'
import * as Key from './internal/key.js'
import * as Permissions from './internal/permissions.js'
import * as PermissionsRequest from './internal/permissionsRequest.js'
import type * as Porto from './internal/porto.js'
import type * as Rpc from './internal/typebox/rpc.js'
import * as Schema from './internal/typebox/schema.js'
import type { Compute, PartialBy } from './internal/types.js'

type Request = Rpc.parseRequest.ReturnType

type ActionsInternal = Porto.Internal & {
  /** Viem Client. */
  client: Client
  /** RPC Request. */
  request: Request
}

export type Implementation = {
  actions: {
    createAccount: (parameters: {
      /** Preparation context (from `prepareCreateAccount`). */
      context?: unknown | undefined
      /** Internal properties. */
      internal: ActionsInternal
      /** Label to associate with the WebAuthn credential. */
      label?: string | undefined
      /** Permissions to grant. */
      permissions?: PermissionsRequest.PermissionsRequest | undefined
      /** Preparation signatures (from `prepareCreateAccount`). */
      signatures?: readonly Hex.Hex[] | undefined
    }) => Promise<{
      /** Account. */
      account: Account.Account
    }>

    prepareExecute: (parameters: {
      /** Account to execute the calls with. */
      account: Account.Account
      /** Calls to execute. */
      calls: readonly Call.Call[]
      /** Viem Clients. */
      client: Client
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<{
      /** RPC Request. */
      request: unknown
      /** Hex payloads to sign over. */
      signPayloads: readonly Hex.Hex[]
    }>

    execute: (parameters: {
      /** Account to execute the calls with. */
      account: Account.Account
      /** Calls to execute. */
      calls: readonly Call.Call[]
      /** Permissions ID to use to execute the calls. */
      permissionsId?: Hex.Hex | undefined
      /** Nonce to use for execution. */
      nonce?: bigint | undefined
      /** Signature for execution. */
      signature?: Hex.Hex | undefined
      /** Internal properties. */
      internal: ActionsInternal
    }) => Promise<Hex.Hex>

    grantPermissions: (parameters: {
      /** Account to authorize the keys for. */
      account: Account.Account
      /** Internal properties. */
      internal: ActionsInternal
      /** Permissions to grant. */
      permissions?: PermissionsRequest.PermissionsRequest | undefined
    }) => Promise<{ key: Key.Key }>

    loadAccounts: (parameters: {
      /** Address of the account to load. */
      address?: Address.Address | undefined
      /** Credential ID to use to load an existing account. */
      credentialId?: string | undefined
      /** Internal properties. */
      internal: ActionsInternal
      /** Permissions to grant. */
      permissions?: PermissionsRequest.PermissionsRequest | undefined
    }) => Promise<{
      /** Accounts. */
      accounts: readonly Account.Account[]
    }>

    prepareCreateAccount: (parameters: {
      /** Address of the account to import. */
      address: Address.Address
      /** Label to associate with the account. */
      label?: string | undefined
      /** Internal properties. */
      internal: ActionsInternal
      /** Permissions to grant. */
      permissions?: PermissionsRequest.PermissionsRequest | undefined
    }) => Promise<{
      /** Filled context for the `createAccount` implementation. */
      context: unknown
      /** Hex payloads to sign over. */
      signPayloads: readonly Hex.Hex[]
    }>

    revokePermissions: (parameters: {
      /** Account to revoke the permissions for. */
      account: Account.Account
      /** ID of the permissions to revoke. */
      id: Hex.Hex
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
      async createAccount(parameters) {
        const { label, internal, permissions } = parameters
        const { client } = internal

        const { account, context, signatures } = await (async () => {
          // If the context and signatures are provided, we can skip
          // the preparation step (likely `wallet_prepareCreateAccount` has
          // been called).
          if (parameters.context && parameters.signatures)
            return {
              account: (parameters.context as any).account,
              context: parameters.context,
              signatures: parameters.signatures,
            }

          // Generate a random private key and derive the address.
          // The address here will be the address of the account.
          const privateKey = Secp256k1.randomPrivateKey()
          const address = Address.fromPublicKey(
            Secp256k1.getPublicKey({ privateKey }),
          )

          // Prepare the account for creation.
          const { context, signPayloads } = await prepareCreateAccount({
            address,
            client,
            keystoreHost,
            label,
            permissions,
          })

          // Assign any keys to the account and sign over the payloads
          // required for account creation (e.g. 7702 auth and/or account initdata).
          const account = Account.fromPrivateKey(privateKey, {
            keys: context.account.keys,
          })
          const signatures = await Account.sign(account, {
            payloads: signPayloads,
          })

          return { account, context, signatures }
        })()

        // Execute the account creation.
        // TODO: wait for tx to be included?
        await Delegation.execute(client, {
          ...(context as any),
          account,
          signatures,
        })

        return { account }
      },

      async prepareExecute(parameters) {
        const { client } = parameters

        const { request, signPayloads } = await Delegation.prepareExecute(
          client,
          parameters,
        )

        return {
          request,
          signPayloads,
        }
      },

      async execute(parameters) {
        const { account, calls, internal, nonce, signature } = parameters
        const { client } = internal

        // Try and extract an authorized key to sign the calls with.
        const key = await getAuthorizedExecuteKey({
          account,
          calls,
          permissionsId: parameters.permissionsId,
        })

        // Execute the calls (with the key if provided, otherwise it will
        // fall back to an admin key).
        const hash = await Delegation.execute(client, {
          account,
          calls,
          ...(nonce && signature
            ? {
                nonce,
                signatures: [signature],
              }
            : {
                key,
              }),
        })

        return hash
      },

      async grantPermissions(parameters) {
        const { account, permissions, internal } = parameters
        const { client } = internal

        // Parse permissions request into a structured key.
        const key = await PermissionsRequest.toKey(permissions)
        if (!key) throw new Error('key not found.')

        // TODO: wait for tx to be included?
        await Delegation.execute(client, {
          account,
          // Extract calls to authorize the key.
          calls: getAuthorizeCalls([key]),
        })

        return { key }
      },

      async loadAccounts(parameters) {
        const { internal, permissions } = parameters
        const { client } = internal

        const { address, credentialId } = await (async () => {
          // If the address and credentialId are provided, we can skip the
          // WebAuthn discovery step.
          if (parameters.address && parameters.credentialId)
            return {
              address: parameters.address,
              credentialId: parameters.credentialId,
            }

          // Discovery step. We will sign a random challenge. We need to do this
          // to extract the user id (ie. the address) to query for the Account's keys.
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
        const [keyCount, extraKey] = await Promise.all([
          readContract(client, {
            abi: delegationAbi,
            address,
            functionName: 'keyCount',
          }),
          PermissionsRequest.toKey(permissions),
        ])
        const keys = await Promise.all(
          Array.from({ length: Number(keyCount) }, (_, index) =>
            Delegation.keyAt(client, { account: address, index }),
          ),
        )

        // Instantiate the account based off the extracted address and keys.
        const account = Account.from({
          address,
          keys: [...keys, ...(extraKey ? [extraKey] : [])].map((key, i) => {
            const credential = {
              id: credentialId,
              publicKey: PublicKey.fromHex(key.publicKey),
            }
            // Assume that the first key is the admin WebAuthn key.
            if (i === 0 && key.type === 'webauthn-p256')
              return Key.fromWebAuthnP256({ ...key, credential })
            // Add credential to session key to be able to restore from storage later
            if (key.type === 'p256' && key.role === 'session')
              return { ...key, credential } as typeof key
            return key
          }),
        })

        // If there is an extra key to authorize, we need to authorize it.
        if (extraKey)
          // TODO: wait for tx to be included?
          await Delegation.execute(client, {
            account,
            calls: getAuthorizeCalls([extraKey]),
          })

        return {
          accounts: [account],
        }
      },

      async prepareCreateAccount(parameters) {
        const { address, label, internal, permissions } = parameters
        const { client } = internal
        return await prepareCreateAccount({
          address,
          client,
          keystoreHost,
          label,
          permissions,
        })
      },

      async revokePermissions(parameters) {
        const { account, id, internal } = parameters
        const { client } = internal

        const key = account.keys?.find((key) => key.publicKey === id)
        if (!key) return

        // We shouldn't be able to revoke the admin keys.
        if (key.role === 'admin') throw new Error('cannot revoke permissions.')

        await Delegation.execute(client, {
          account,
          calls: [Call.setCanExecute({ key, enabled: false })],
        })
      },

      async signPersonalMessage(parameters) {
        const { account, data } = parameters

        // Only admin keys can sign personal messages.
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

        // Only admin keys can sign typed data.
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
  const { host = 'https://exp.porto.sh/dialog', renderer = Dialog.iframe() } =
    parameters

  const requestStore = RpcRequest.createStore()

  // Function to instantiate a provider for the dialog. This
  // will be used to queue up requests for the dialog and
  // handle responses.
  function getProvider(store: Porto.Internal['store']) {
    return Provider.from(
      {
        async request(r) {
          const request = requestStore.prepare(r as any)

          // When we receive a request, we need to add it to the queue.
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

          // We need to wait for the request to be resolved.
          return new Promise((resolve, reject) => {
            const unsubscribe = store.subscribe(
              (x) => x.requestQueue,
              (requestQueue) => {
                // If the queue is empty, reject the request as it will
                // never be resolved.
                if (requestQueue.length === 0) {
                  unsubscribe()
                  reject(new Provider.UserRejectedRequestError())
                }

                // Find the request in the queue based off its JSON-RPC identifier.
                const queued = requestQueue.find(
                  (x) => x.request.id === request.id,
                )
                if (!queued) return
                if (queued.status !== 'success' && queued.status !== 'error')
                  return

                // We have a response, we can unsubscribe from the store.
                unsubscribe()

                // If the request was successful, resolve with the result.
                if (queued.status === 'success') resolve(queued.result as any)
                // Otherwise, reject with EIP-1193 Provider error.
                else reject(Provider.parseError(queued.error))

                // Remove the request from the queue.
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
      async createAccount(parameters) {
        const { internal } = parameters
        const { client, request, store } = internal

        const provider = getProvider(store)

        const account = await (async () => {
          if (request.method === 'experimental_createAccount') {
            // Extract the capabilities from the request.
            const [{ context, signatures }] = request._decoded.params ?? [{}]

            // If the context and signatures are provided, we can create
            // the account without sending a request to the dialog.
            if (context && signatures) {
              const request = context as Delegation.execute.Parameters & {
                nonce: bigint
              }
              await Delegation.execute(client, {
                ...request,
                signatures,
              })
              return Account.from(request.account)
            }

            // Send a request off to the dialog to create an account.
            const { address } = await provider.request(request)
            return Account.from({
              address,
            })
          }

          if (request.method === 'wallet_connect') {
            // Extract the capabilities from the request.
            const [{ capabilities }] = request._decoded.params ?? [{}]

            // Parse the authorize key into a structured key.
            const key = await PermissionsRequest.toKey(
              capabilities?.grantPermissions,
            )

            // Convert the key into a permission.
            const permissionsRequest = key
              ? Schema.Encode(
                  PermissionsRequest.Schema,
                  PermissionsRequest.fromKey(key),
                )
              : undefined

            // Send a request off to the dialog to create an account.
            const { accounts } = await provider.request({
              ...request,
              params: [
                {
                  capabilities: {
                    ...request.params?.[0]?.capabilities,
                    grantPermissions: permissionsRequest,
                  },
                },
              ],
            })

            const [account] = accounts
            if (!account) throw new Error('no account found.')

            // Build keys to assign onto the account.
            const keys = account.capabilities?.permissions?.map(
              (permission) => {
                if (permission.id === key?.publicKey) return key
                return Permissions.toKey(
                  Schema.Decode(Permissions.Schema, permission),
                )
              },
            )

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

      async prepareExecute(parameters) {
        const { client } = parameters
        const { request, signPayloads } = await Delegation.prepareExecute(
          client,
          parameters,
        )

        return {
          request,
          signPayloads,
        }
      },

      async execute(parameters) {
        const { account, calls, internal, nonce, signature } = parameters
        const { client, store, request } = internal

        // Try and extract an authorized key to sign the calls with.
        const key = await getAuthorizedExecuteKey({
          account,
          calls,
          permissionsId: parameters.permissionsId,
        })

        // If a key is found, execute the calls with it.
        // No need to send a request to the dialog.
        if (key)
          return await Delegation.execute(client, {
            account,
            calls,
            key,
          })

        const provider = getProvider(store)

        if (request.method === 'eth_sendTransaction')
          // Send a transaction request to the dialog.
          return await provider.request(request)

        if (request.method === 'wallet_sendCalls')
          // Send calls request to the dialog.
          return await provider.request(request)

        // execute prepared calls directly with Delegation.execute
        if (request.method === 'wallet_sendPreparedCalls') {
          const hash = await Delegation.execute(client, {
            account,
            calls,
            nonce: nonce!,
            signatures: [signature!],
          })

          return hash
        }

        throw new Error('Cannot execute for method: ' + request.method)
      },

      async grantPermissions(parameters) {
        const { internal } = parameters
        const { request, store } = internal

        if (request.method !== 'experimental_grantPermissions')
          throw new Error(
            'Cannot grant permissions for method: ' + request.method,
          )

        const [{ address, ...permissions }] = request._decoded.params

        // Parse permissions request into a structured key.
        const key = await PermissionsRequest.toKey(permissions)
        if (!key) throw new Error('no key found.')

        const permissionsRequest = Schema.Encode(
          PermissionsRequest.Schema,
          PermissionsRequest.fromKey(key),
        )

        // Send a request off to the dialog to grant the permissions.
        const provider = getProvider(store)
        await provider.request({
          method: 'experimental_grantPermissions',
          params: [permissionsRequest],
        })

        return { key }
      },

      async loadAccounts(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        const provider = getProvider(store)

        const accounts = await (async () => {
          if (request.method === 'eth_requestAccounts') {
            const addresses = await provider.request(request)
            return addresses.map((address) => Account.from({ address }))
          }

          if (request.method === 'wallet_connect') {
            const [{ capabilities }] = request._decoded.params ?? [{}]

            // Parse provided (RPC) key into a structured key.
            const key = await PermissionsRequest.toKey(
              capabilities?.grantPermissions,
            )

            // Convert the key into a permissions request.
            const permissionsRequest = key
              ? Schema.Encode(
                  PermissionsRequest.Schema,
                  PermissionsRequest.fromKey(key),
                )
              : undefined

            // Send a request to the dialog.
            const result = await provider.request({
              ...request,
              params: [
                {
                  ...request.params?.[0],
                  capabilities: {
                    ...request.params?.[0]?.capabilities,
                    grantPermissions: permissionsRequest,
                  },
                },
              ],
            })

            return result.accounts.map((account) => {
              const keys = account.capabilities?.permissions?.map(
                (permission) => {
                  if (permission.id === key?.publicKey) return key
                  return Permissions.toKey(
                    Schema.Decode(Permissions.Schema, permission),
                  )
                },
              )

              return Account.from({
                address: account.address,
                keys,
              })
            })
          }

          throw new Error('Cannot load accounts for method: ' + request.method)
        })()

        return {
          accounts,
        }
      },

      async prepareCreateAccount(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (request.method !== 'experimental_prepareCreateAccount')
          throw new Error(
            'Cannot prepare create account for method: ' + request.method,
          )

        const provider = getProvider(store)
        return await provider.request(request)
      },

      async revokePermissions(parameters) {
        const { account, id, internal } = parameters
        const { store, request } = internal

        if (request.method !== 'experimental_revokePermissions')
          throw new Error(
            'Cannot revoke permissions for method: ' + request.method,
          )

        const key = account.keys?.find((key) => key.publicKey === id)
        if (!key) return

        // We shouldn't be able to revoke admins.
        if (key.role === 'admin') throw new Error('cannot revoke permissions.')

        const provider = getProvider(store)
        return await provider.request(request)
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
     * @default 'http://exp.porto.sh/dialog'
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
        const { internal, permissions } = parameters
        const { client } = internal

        const privateKey = Secp256k1.randomPrivateKey()

        const key = Key.createP256({
          role: 'admin',
        })

        const extraKey = await PermissionsRequest.toKey(permissions)

        const account = Account.fromPrivateKey(privateKey, {
          keys: [key, ...(extraKey ? [extraKey] : [])],
        })
        const delegation = client.chain.contracts.delegation.address

        address = account.address

        const hash = await Delegation.execute(client, {
          account,
          calls: getAuthorizeCalls(account.keys),
          delegation,
        })

        return { account, hash }
      },

      async loadAccounts(parameters) {
        const { internal } = parameters
        const { client } = internal

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

async function prepareCreateAccount(parameters: {
  address: Address.Address
  client: Client
  label?: string | undefined
  keystoreHost?: string | undefined
  permissions: PermissionsRequest.PermissionsRequest | undefined
}) {
  const { address, client, keystoreHost, permissions } = parameters

  const label =
    parameters.label ?? `${address.slice(0, 8)}\u2026${address.slice(-6)}`

  const key = await Key.createWebAuthnP256({
    label,
    role: 'admin',
    rpId: keystoreHost,
    userId: Bytes.from(address),
  })

  const extraKey = await PermissionsRequest.toKey(permissions)

  const keys = [key, ...(extraKey ? [extraKey] : [])]

  const account = Account.from({
    address,
    keys,
  })
  const delegation = client.chain.contracts.delegation.address

  const { request, signPayloads } = await Delegation.prepareExecute(client, {
    account,
    calls: getAuthorizeCalls(account.keys),
    delegation,
  })

  return { context: request, signPayloads }
}

function getAuthorizeCalls(keys: readonly Key.Key[]): readonly Call.Call[] {
  return keys.flatMap((key) => {
    const { permissions } = key

    const permissionCalls: Call.Call[] = []

    // Set call scopes.
    if (permissions?.calls)
      permissionCalls.push(
        ...permissions.calls.map((scope) => {
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
        }),
      )
    else permissionCalls.push(Call.setCanExecute({ key }))

    // Set spend limits.
    if (permissions?.spend)
      permissionCalls.push(
        ...permissions.spend.map((spend) =>
          Call.setSpendLimit({ key, ...spend }),
        ),
      )

    // Set authorized contracts for signature verification.
    if (permissions?.signatureVerification) {
      const { addresses } = permissions.signatureVerification
      permissionCalls.push(
        ...addresses.map((address) =>
          Call.setSignatureCheckerApproval({
            address,
            enabled: true,
            key,
          }),
        ),
      )
    }

    return [...permissionCalls, Call.authorize({ key })]
  })
}

async function getAuthorizedExecuteKey(parameters: {
  account: Account.Account
  calls: readonly Call.Call[]
  permissionsId?: Hex.Hex | undefined
}): Promise<Key.Key | undefined> {
  const { account, calls, permissionsId } = parameters

  // If a key is provided, use it.
  if (permissionsId) {
    const key = account.keys?.find(
      (key) => key.publicKey === permissionsId && key.canSign,
    )
    if (!key)
      throw new Error(`permission (id: ${permissionsId}) does not exist.`)
    return key
  }

  // Otherwise, try and find a valid session key.
  const sessionKey = account.keys?.find((key) => {
    if (!key.canSign) return false
    if (key.role !== 'session') return false
    if (key.expiry < BigInt(Math.floor(Date.now() / 1000))) return false

    const hasValidScope = key.permissions?.calls?.some((scope) =>
      calls.some((call) => {
        if (scope.to && scope.to !== call.to) return false
        if (scope.signature) {
          if (!call.data) return false
          const selector = Hex.slice(call.data, 0, 4)
          if (Hex.validate(scope.signature) && scope.signature !== selector)
            return false
          if (AbiItem.getSelector(scope.signature) !== selector) return false
        }
        return true
      }),
    )
    if (hasValidScope) return true

    return false
  })

  // Fall back to an admin key.
  const adminKey = account.keys?.find(
    (key) => key.role === 'admin' && key.canSign,
  )

  return sessionKey ?? adminKey
}
