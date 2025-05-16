import * as Provider from 'ox/Provider'
import * as RpcRequest from 'ox/RpcRequest'
import * as RpcSchema from 'ox/RpcSchema'
import * as Account from '../../Account.js'
import * as Dialog from '../../Dialog.js'
import * as Key from '../../Key.js'
import type { QueuedRequest } from '../../Porto.js'
import * as RpcSchema_porto from '../../RpcSchema.js'
import * as Mode from '../mode.js'
import * as Permissions from '../permissions.js'
import * as PermissionsRequest from '../permissionsRequest.js'
import type * as Porto from '../porto.js'
import * as PreCalls from '../preCalls.js'
import * as Typebox from '../typebox/typebox.js'

export function dialog(parameters: dialog.Parameters = {}) {
  const {
    host = 'https://stg.id.porto.sh/dialog',
    renderer = Dialog.iframe(),
  } = parameters

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
          store.setState((x) => {
            const account = x.accounts[0]
            const adminKey = account?.keys?.find(
              (key) => key.role === 'admin' && key.type === 'webauthn-p256',
            )
            return {
              ...x,
              requestQueue: [
                ...x.requestQueue,
                {
                  account: account
                    ? {
                        address: account.address,
                        credentialId: (adminKey as any)?.credentialId,
                        keyId: adminKey?.id,
                      }
                    : undefined,
                  request,
                  status: 'pending',
                },
              ],
            }
          })

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

  return Mode.from({
    actions: {
      async addFunds(parameters) {
        const { internal } = parameters
        const { request, store } = internal

        if (request.method !== 'experimental_addFunds')
          throw new Error('Cannot add funds for method: ' + request.method)

        const provider = getProvider(store)
        return await provider.request(request)
      },

      async createAccount(parameters) {
        const { internal } = parameters
        const {
          config: { storage },
          request,
          store,
        } = internal

        const provider = getProvider(store)

        const account = await (async () => {
          if (request.method === 'experimental_createAccount') {
            // Send a request off to the dialog to create an account.
            const { address, capabilities } = await provider.request(request)

            const { preCalls } = capabilities ?? {}
            if (preCalls)
              await PreCalls.add(preCalls as PreCalls.PreCalls, {
                address,
                storage,
              })

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
              ? Typebox.Encode(
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
            const adminKeys = account.capabilities?.admins
              ?.map(Key.from)
              .filter(Boolean) as readonly Key.Key[]

            const sessionKeys = account.capabilities?.permissions
              ?.map((permission) => {
                if (permission.id === key?.publicKey) return key
                try {
                  return Permissions.toKey(
                    Typebox.Decode(Permissions.Schema, permission),
                  )
                } catch (err) {
                  return undefined
                }
              })
              .filter(Boolean) as readonly Key.Key[]

            const { preCalls } = account.capabilities ?? {}
            if (preCalls)
              await PreCalls.add(preCalls as PreCalls.PreCalls, {
                address: account.address,
                storage,
              })

            return Account.from({
              address: account.address,
              keys: [...adminKeys, ...sessionKeys],
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

      async getAccountVersion(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (request.method !== 'experimental_getAccountVersion')
          throw new Error('Cannot get version for method: ' + request.method)

        const provider = getProvider(store)
        const result = await provider.request(request)
        return result
      },

      async getCallsStatus(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (request.method !== 'wallet_getCallsStatus')
          throw new Error('Cannot get status for method: ' + request.method)

        const provider = getProvider(store)
        const result = await provider.request(request)
        return result
      },

      async grantAdmin(parameters) {
        const { internal } = parameters
        const { request, store } = internal

        if (request.method !== 'experimental_grantAdmin')
          throw new Error(
            'Cannot authorize admin for method: ' + request.method,
          )

        const [params] = request._decoded.params

        const key = Key.from(params.key)
        if (!key) throw new Error('no key found.')

        // Send a request off to the dialog to authorize the admin.
        const provider = getProvider(store)
        await provider.request({
          method: 'experimental_grantAdmin',
          params: request.params,
        })

        return { key }
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

        const permissionsRequest = Typebox.Encode(
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
        const {
          config: { storage },
          store,
          request,
        } = internal

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
              ? Typebox.Encode(
                  PermissionsRequest.Schema,
                  PermissionsRequest.fromKey(key),
                )
              : undefined

            // Send a request to the dialog.
            const { accounts } = await provider.request({
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

            await Promise.all(
              accounts.map(async (account) => {
                const { preCalls } = account.capabilities ?? {}
                if (!preCalls) return
                await PreCalls.add(preCalls as PreCalls.PreCalls, {
                  address: account.address,
                  storage,
                })
              }),
            )

            return accounts.map((account) => {
              const adminKeys = account.capabilities?.admins
                ?.map((key) => Key.from(key))
                .filter(Boolean) as readonly Key.Key[]
              const sessionKeys = account.capabilities?.permissions
                ?.map((permission) => {
                  try {
                    const key_ = Permissions.toKey(
                      Typebox.Decode(Permissions.Schema, permission),
                    )
                    if (key_.publicKey === key?.publicKey) return key
                    return key_
                  } catch (err) {
                    return undefined
                  }
                })
                .filter(Boolean) as readonly Key.Key[]

              return Account.from({
                address: account.address,
                keys: [...adminKeys, ...sessionKeys],
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
        const { account, internal } = parameters
        const {
          config: { storage },
          store,
          request,
        } = internal

        if (request.method !== 'wallet_prepareCalls')
          throw new Error('Cannot prepare calls for method: ' + request.method)

        const preCalls = await PreCalls.get({
          address: account.address,
          storage,
        })

        const provider = getProvider(store)
        const result = await provider.request({
          ...request,
          params: [
            {
              ...request.params?.[0],
              capabilities: {
                ...request.params?.[0]?.capabilities,
                preCalls,
              },
            },
          ],
        })

        return {
          account,
          context: result.context as any,
          key: result.key,
          signPayloads: [result.digest],
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

      async revokeAdmin(parameters) {
        const { account, id, internal } = parameters
        const { store, request } = internal

        if (request.method !== 'experimental_revokeAdmin')
          throw new Error('Cannot revoke admin for method: ' + request.method)

        const key = account.keys?.find((key) => key.publicKey === id)
        if (!key) return

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
        const {
          config: { storage },
          client,
          store,
          request,
        } = internal

        const provider = getProvider(store)

        const preCalls = await PreCalls.get({
          address: account.address,
          storage,
        })

        // Try and extract an authorized key to sign the calls with.
        const key = await Mode.getAuthorizedExecuteKey({
          account,
          calls,
          permissionsId: parameters.permissionsId,
        })

        // If a session key is found, try execute the calls with it
        // without sending a request to the dialog. If the key does not
        // have permission to execute the calls, fall back to the dialog.
        if (key && key.role === 'session') {
          try {
            // TODO: use eventual Viem Action.
            const req = await provider.request(
              Typebox.Encode(RpcSchema_porto.wallet_prepareCalls.Request, {
                method: 'wallet_prepareCalls',
                params: [
                  {
                    calls,
                    capabilities: {
                      ...(request._decoded.method === 'wallet_sendCalls'
                        ? request._decoded.params?.[0]?.capabilities
                        : undefined),
                      preCalls,
                    },
                    chainId: client.chain.id,
                    from: account.address,
                    key,
                  },
                ],
              } satisfies RpcSchema_porto.wallet_prepareCalls.Request),
            )

            const signature = await Key.sign(key, {
              payload: req.digest,
              wrap: false,
            })

            // TODO: use eventual Viem Action.
            const result = await provider.request({
              method: 'wallet_sendPreparedCalls',
              params: [
                {
                  ...req,
                  signature,
                },
              ],
            })

            await PreCalls.clear({
              address: account.address,
              storage,
            })

            const id = result[0]
            if (!id) throw new Error('id not found')

            return id
          } catch {}
        }

        if (request.method === 'eth_sendTransaction') {
          // Send a transaction request to the dialog.
          const id = await provider.request({
            ...request,
            params: [
              {
                ...request.params?.[0],
                // @ts-expect-error
                capabilities: {
                  preCalls,
                },
              },
            ],
          })

          await PreCalls.clear({
            address: account.address,
            storage,
          })

          return { id }
        }

        if (request.method === 'wallet_sendCalls') {
          // Send calls request to the dialog.
          const result = await provider.request({
            method: 'wallet_sendCalls',
            params: [
              {
                ...request.params?.[0],
                capabilities: {
                  ...request.params?.[0]?.capabilities,
                  preCalls,
                },
              },
            ],
          })

          await PreCalls.clear({
            address: account.address,
            storage,
          })

          return result
        }

        throw new Error('Cannot execute for method: ' + request.method)
      },

      async sendPreparedCalls(parameters) {
        const { account, internal } = parameters
        const {
          config: { storage },
          store,
          request,
        } = internal

        if (request.method !== 'wallet_sendPreparedCalls')
          throw new Error(
            'Cannot send prepared calls for method: ' + request.method,
          )

        const provider = getProvider(store)
        const result = await provider.request(request)

        if (account.address)
          await PreCalls.clear({
            address: account.address,
            storage,
          })

        const id = result[0]?.id
        if (!id) throw new Error('id not found')

        return id
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

      async updateAccount(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (request.method !== 'experimental_updateAccount')
          throw new Error('Cannot update account for method: ' + request.method)

        const provider = getProvider(store)
        return await provider.request(request)
      },

      async upgradeAccount(parameters) {
        const { account, internal } = parameters
        const { store, request } = internal

        if (request.method !== 'experimental_upgradeAccount')
          throw new Error(
            'Cannot upgrade account for method: ' + request.method,
          )

        const provider = getProvider(store)
        await provider.request(request)

        return { account }
      },
    },
    name: 'dialog',
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
          dialog.syncRequests(requests)
          if (requests.length === 0) dialog.close()
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
     * @default 'http://stg.id.porto.sh/dialog'
     */
    host?: string | undefined
    /**
     * Dialog renderer.
     * @default Dialog.iframe()
     */
    renderer?: Dialog.Dialog | undefined
  }
}
