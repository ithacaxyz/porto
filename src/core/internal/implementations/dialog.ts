import * as Provider from 'ox/Provider'
import * as RpcRequest from 'ox/RpcRequest'
import * as RpcSchema from 'ox/RpcSchema'

import * as Dialog from '../../Dialog.js'
import type { QueuedRequest } from '../../Porto.js'
import type * as RpcSchema_porto from '../../RpcSchema.js'
import * as Account from '../account.js'
import * as Delegation from '../delegation.js'
import * as Implementation from '../implementation.js'
import * as Key from '../key.js'
import * as Permissions from '../permissions.js'
import * as PermissionsRequest from '../permissionsRequest.js'
import type * as Porto from '../porto.js'
import * as Schema from '../typebox/schema.js'

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

  return Implementation.from({
    actions: {
      async createAccount(parameters) {
        const { internal } = parameters
        const { request, store } = internal

        const provider = getProvider(store)

        const account = await (async () => {
          if (request.method === 'experimental_createAccount') {
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
            const keys = account.capabilities?.permissions
              ?.map((permission) => {
                if (permission.id === key?.publicKey) return key
                try {
                  return Permissions.toKey(
                    Schema.Decode(Permissions.Schema, permission),
                  )
                } catch (err) {
                  return undefined
                }
              })
              .filter(Boolean) as readonly Key.Key[]

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
              const keys = account.capabilities?.permissions
                ?.map((permission) => {
                  if (permission.id === key?.publicKey) return key
                  try {
                    return Permissions.toKey(
                      Schema.Decode(Permissions.Schema, permission),
                    )
                  } catch (err) {
                    return undefined
                  }
                })
                .filter(Boolean) as readonly Key.Key[]

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

      async prepareCalls(parameters) {
        const { internal, key } = parameters
        const { client } = internal

        const { request, signPayloads } = await Delegation.prepareExecute(
          client,
          parameters,
        )

        return {
          account: request.account,
          context: { calls: request.calls, nonce: request.nonce },
          key,
          signPayloads,
        }
      },

      async prepareUpgradeAccount(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (request.method !== 'experimental_prepareUpgradeAccount')
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

      async sendCalls(parameters) {
        const { account, calls, internal } = parameters
        const { client, store, request } = internal

        // Try and extract an authorized key to sign the calls with.
        const key = await Implementation.getAuthorizedExecuteKey({
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

        throw new Error('Cannot execute for method: ' + request.method)
      },

      async sendPreparedCalls(parameters) {
        const { account, context, key, internal } = parameters
        const { client } = internal

        if (!context.calls) throw new Error('calls is required')
        if (!context.nonce) throw new Error('nonce is required')

        const signature = Key.wrapSignature(parameters.signature, {
          keyType: key.type,
          publicKey: key.publicKey,
        })

        const hash = await Delegation.execute(client, {
          account,
          calls: context.calls,
          nonce: context.nonce,
          signatures: [signature],
        })

        return hash
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

      async upgradeAccount(parameters) {
        const { context, internal, signatures } = parameters
        const { client } = internal

        const request = context as Delegation.execute.Parameters & {
          nonce: bigint
        }

        await Delegation.execute(client, {
          ...request,
          signatures,
        })

        const account = Account.from(request.account)

        return { account }
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
