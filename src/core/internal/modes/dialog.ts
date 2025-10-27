import type * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import * as Provider from 'ox/Provider'
import * as RpcRequest from 'ox/RpcRequest'
import * as RpcResponse from 'ox/RpcResponse'
import * as RpcSchema from 'ox/RpcSchema'
import { waitForCallsStatus } from 'viem/actions'
import * as z from 'zod/mini'
import type { ThemeFragment } from '../../../theme/Theme.js'
import * as Account from '../../../viem/Account.js'
import * as Key from '../../../viem/Key.js'
import * as Dialog from '../../Dialog.js'
import type { QueuedRequest } from '../../Porto.js'
import * as RpcSchema_porto from '../../RpcSchema.js'
import type { Storage } from '../../Storage.js'
import * as Mode from '../mode.js'
import * as Permissions from '../permissions.js'
import * as PermissionsRequest from '../permissionsRequest.js'
import type * as Porto from '../porto.js'
import type * as Token from '../schema/token.js'
import * as Siwe from '../siwe.js'
import * as U from '../utils.js'
import { relay } from './relay.js'

export function dialog(parameters: dialog.Parameters = {}) {
  const {
    fallback = relay(),
    host = Dialog.hostUrls.prod,
    renderer = Dialog.iframe(),
    theme,
    themeController,
  } = parameters

  const listeners = new Set<(requestQueue: readonly QueuedRequest[]) => void>()
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
                        key: adminKey
                          ? {
                              credentialId: (adminKey as any)?.credentialId,
                              publicKey: adminKey.publicKey,
                            }
                          : undefined,
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
            const listener = (requestQueue: readonly QueuedRequest[]) => {
              // Find the request in the queue based off its JSON-RPC identifier.
              const queued = requestQueue.find(
                (x) => x.request.id === request.id,
              )

              // If the request is not found and the queue is empty, reject the request
              // as it will never be resolved (likely cancelled or dialog closed).
              if (!queued && requestQueue.length === 0) {
                listeners.delete(listener)
                reject(new Provider.UserRejectedRequestError())
                return
              }

              // If request not found but queue has other requests, wait for next update.
              if (!queued) return

              // If request found but not yet resolved, wait for next update.
              if (queued.status !== 'success' && queued.status !== 'error')
                return

              // We have a response, we can unsubscribe from the listener.
              listeners.delete(listener)

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
            }

            listeners.add(listener)
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

        if (request.method !== 'wallet_addFunds')
          throw new Error('Cannot add funds for method: ' + request.method)

        const provider = getProvider(store)
        return await provider.request(request)
      },

      async createAccount(parameters) {
        const { internal } = parameters
        const { client, config, request, store } = internal
        const { storage } = config

        const provider = getProvider(store)

        const account = await (async () => {
          if (request.method === 'wallet_connect') {
            // Extract the capabilities from the request.
            const [{ capabilities, chainIds }] = request._decoded.params ?? [{}]

            const authUrl = getAuthUrl(
              capabilities?.signInWithEthereum?.authUrl ?? config.authUrl,
              { storage },
            )

            const signInWithEthereum =
              request.params?.[0]?.capabilities?.signInWithEthereum

            // Parse the authorize key into a structured key.
            const key = await PermissionsRequest.toKey(
              capabilities?.grantPermissions,
              {
                chainId: client.chain.id,
              },
            )

            // Convert the key into a permission.
            const permissionsRequest = key
              ? z.encode(
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
                    signInWithEthereum:
                      authUrl || signInWithEthereum
                        ? {
                            ...signInWithEthereum,
                            authUrl: authUrl!,
                          }
                        : undefined,
                  },
                  chainIds: chainIds?.map((chainId) => Hex.fromNumber(chainId)),
                },
              ],
            })

            const [account] = accounts
            if (!account) throw new Error('no account found.')

            // Build keys to assign onto the account.
            const adminKeys = account.capabilities?.admins
              ?.map((admin) => Key.from(admin, { chainId: client.chain.id }))
              .filter(Boolean) as readonly Key.Key[] | undefined

            const sessionKeys = account.capabilities?.permissions
              ?.map((permission) => {
                try {
                  const key_permission = Permissions.toKey(
                    z.decode(Permissions.Schema, permission),
                  )
                  if (key_permission.id === key?.id)
                    return {
                      ...key_permission,
                      ...key,
                      permissions: key_permission.permissions,
                    }
                  return key_permission
                } catch {
                  return undefined
                }
              })
              .filter(Boolean) as readonly Key.Key[] | undefined

            const signInWithEthereum_response = await (async () => {
              if (!account.capabilities?.signInWithEthereum) return
              const { message, signature } =
                account.capabilities.signInWithEthereum

              if (!authUrl)
                return {
                  message,
                  signature,
                }

              const { token } = await Siwe.authenticate({
                address: account.address,
                authUrl,
                message,
                publicKey: account.capabilities?.admins?.[0]?.publicKey,
                signature,
              })
              return {
                message,
                signature,
                token,
              }
            })()

            return {
              ...Account.from({
                address: account.address,
                keys: [...(adminKeys ?? []), ...(sessionKeys ?? [])],
              }),
              signInWithEthereum: signInWithEthereum_response,
            }
          }

          throw new Error(
            `Account creation not supported on method: ${request.method}`,
          )
        })()

        return {
          account,
        }
      },

      async disconnect(parameters) {
        const { internal } = parameters
        const { config } = internal
        const { storage } = config

        const authUrl_storage =
          (await storage.getItem<Siwe.AuthUrl | undefined>('porto.authUrl')) ||
          undefined
        const authUrl = getAuthUrl(config.authUrl ?? authUrl_storage, {
          storage,
        })

        if (authUrl)
          await fetch(authUrl.logout, {
            credentials: 'include',
            method: 'POST',
          }).catch(() => {})
      },

      async getAccountVersion(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (request.method !== 'wallet_getAccountVersion')
          throw new Error('Cannot get version for method: ' + request.method)

        if (!renderer.supportsHeadless)
          return fallback.actions.getAccountVersion(parameters)

        const provider = getProvider(store)
        const result = await provider.request(request)
        return result
      },

      async getAssets(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (request.method !== 'wallet_getAssets')
          throw new Error('Cannot get assets for method: ' + request.method)

        if (!renderer.supportsHeadless)
          return fallback.actions.getAssets(parameters)

        const provider = getProvider(store)
        const result = await provider.request(request)
        return z.decode(RpcSchema_porto.wallet_getAssets.Response, result)
      },

      async getCallsStatus(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (request.method !== 'wallet_getCallsStatus')
          throw new Error('Cannot get status for method: ' + request.method)

        if (!renderer.supportsHeadless)
          return fallback.actions.getCallsStatus(parameters)

        const provider = getProvider(store)
        const result = await provider.request(request)
        return result
      },

      async getCapabilities(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (request.method !== 'wallet_getCapabilities')
          throw new Error(
            'Cannot get capabilities for method: ' + request.method,
          )

        if (!renderer.supportsHeadless)
          return fallback.actions.getCapabilities(parameters)

        const provider = getProvider(store)
        const result = await provider.request(request)
        return result
      },

      async getKeys(parameters) {
        const { account, chainIds, internal } = parameters
        const { store } = internal

        const keys = await (async () => {
          if (!renderer.supportsHeadless)
            return fallback.actions.getKeys(parameters)

          const provider = getProvider(store)
          const result = await provider.request({
            method: 'wallet_getKeys',
            params: [
              z.encode(RpcSchema_porto.wallet_getKeys.Parameters, {
                address: account.address,
                chainIds,
              }),
            ],
          })

          return z.decode(RpcSchema_porto.wallet_getKeys.Response, result)
        })()

        return U.uniqBy(
          [...keys, ...(account.keys ?? [])],
          (key) => key.publicKey,
        )
      },

      async grantAdmin(parameters) {
        const { internal } = parameters
        const { request, store } = internal

        if (request.method !== 'wallet_grantAdmin')
          throw new Error(
            'Cannot authorize admin for method: ' + request.method,
          )

        const [params] = request._decoded.params

        const key = Key.from(params.key)
        if (!key) throw new Error('no key found.')

        const feeToken = await resolveFeeToken(internal, parameters)

        // Send a request off to the dialog to authorize the admin.
        const provider = getProvider(store)
        await provider.request({
          method: 'wallet_grantAdmin',
          params: [
            {
              ...request.params?.[0],
              capabilities: {
                ...request.params?.[0]?.capabilities,
                feeToken,
              },
            },
          ],
        })

        return { key }
      },

      async grantPermissions(parameters) {
        const { internal } = parameters
        const { client, request, store } = internal

        if (request.method !== 'wallet_grantPermissions')
          throw new Error(
            'Cannot grant permissions for method: ' + request.method,
          )

        const [{ address, ...permissions }] = request._decoded.params

        // Parse permissions request into a structured key.
        const key = await PermissionsRequest.toKey(permissions, {
          chainId: client.chain.id,
        })
        if (!key) throw new Error('no key found.')

        const permissionsRequest = z.encode(
          PermissionsRequest.Schema,
          PermissionsRequest.fromKey(key),
        )

        // Send a request off to the dialog to grant the permissions.
        const provider = getProvider(store)
        await provider.request({
          method: 'wallet_grantPermissions',
          params: [permissionsRequest],
        })

        return { key }
      },

      async loadAccounts(parameters) {
        const { internal } = parameters
        const { client, config, store } = internal
        const { storage } = config

        const provider = getProvider(store)

        const request = internal.request as z.input<
          typeof RpcSchema_porto.wallet_connect.Request
        > & {
          _decoded: RpcSchema_porto.wallet_connect.Request
        }

        if (
          request.method !== 'wallet_connect' &&
          request.method !== 'eth_requestAccounts'
        )
          throw new Error('Cannot load accounts for method: ' + request.method)

        const accounts = await (async () => {
          const [params] = request._decoded.params ?? []
          const { capabilities } = params ?? {}

          const authUrl = getAuthUrl(
            capabilities?.signInWithEthereum?.authUrl ?? config.authUrl,
            { storage },
          )

          const signInWithEthereum =
            request.params?.[0]?.capabilities?.signInWithEthereum

          // Parse provided (RPC) key into a structured key.
          const key = await PermissionsRequest.toKey(
            capabilities?.grantPermissions,
            {
              chainId: client.chain.id,
            },
          )

          // Convert the key into a permissions request.
          const permissionsRequest = key
            ? z.encode(
                PermissionsRequest.Schema,
                PermissionsRequest.fromKey(key),
              )
            : undefined

          // Send a request to the dialog.
          const { accounts } = await provider.request({
            method: 'wallet_connect',
            params: [
              {
                ...request.params?.[0],
                capabilities: {
                  ...request.params?.[0]?.capabilities,
                  grantPermissions: permissionsRequest,
                  signInWithEthereum:
                    authUrl || signInWithEthereum
                      ? {
                          ...signInWithEthereum,
                          authUrl: authUrl!,
                        }
                      : undefined,
                },
              },
            ],
          })

          return Promise.all(
            accounts.map(async (account) => {
              const adminKeys = account.capabilities?.admins
                ?.map((key) => Key.from(key))
                .filter(Boolean) as readonly Key.Key[] | undefined
              const sessionKeys = account.capabilities?.permissions
                ?.map((permission) => {
                  try {
                    const key_permission = Permissions.toKey(
                      z.decode(Permissions.Schema, permission),
                    )
                    if (key_permission.id === key?.id)
                      return {
                        ...key_permission,
                        ...key,
                        permissions: key_permission.permissions,
                      }
                    return key_permission
                  } catch {
                    return undefined
                  }
                })
                .filter(Boolean) as readonly Key.Key[] | undefined

              const signInWithEthereum_response = await (async () => {
                if (!account.capabilities?.signInWithEthereum) return
                const { message, signature } =
                  account.capabilities.signInWithEthereum

                if (!authUrl)
                  return {
                    message,
                    signature,
                  }

                const { token } = await Siwe.authenticate({
                  address: account.address,
                  authUrl,
                  message,
                  publicKey: account.capabilities?.admins?.[0]?.publicKey,
                  signature,
                })
                return {
                  message,
                  signature,
                  token,
                }
              })()

              return {
                ...Account.from({
                  address: account.address,
                  keys: [...(adminKeys ?? []), ...(sessionKeys ?? [])],
                }),
                signInWithEthereum: signInWithEthereum_response,
              } as const
            }),
          )
        })()

        return {
          accounts,
        }
      },

      async prepareCalls(parameters) {
        const { account, internal } = parameters
        const { store, request } = internal

        if (request.method !== 'wallet_prepareCalls')
          throw new Error('Cannot prepare calls for method: ' + request.method)

        if (!renderer.supportsHeadless)
          return fallback.actions.prepareCalls(parameters)

        const feeToken = await resolveFeeToken(internal, parameters)

        const provider = getProvider(store)
        const result = z.decode(
          RpcSchema_porto.wallet_prepareCalls.Response,
          await provider.request({
            ...request,
            params: [
              {
                ...request.params?.[0],
                capabilities: {
                  ...request.params?.[0]?.capabilities,
                  feeToken,
                },
              },
            ],
          }),
        )

        return {
          account,
          chainId: Number(result.chainId),
          context: result.context as any,
          digest: result.digest,
          key: result.key,
          typedData: result.typedData,
        }
      },

      async prepareUpgradeAccount(parameters) {
        const { internal } = parameters
        const { client, store, request } = internal

        if (request.method !== 'wallet_prepareUpgradeAccount')
          throw new Error(
            'Cannot prepare upgrade for method: ' + request.method,
          )

        if (!renderer.supportsHeadless)
          return fallback.actions.prepareUpgradeAccount(parameters)

        // Extract the capabilities from the request.
        const [{ capabilities }] = request._decoded.params ?? [{}]

        // Parse the authorize key into a structured key.
        const key = await PermissionsRequest.toKey(
          capabilities?.grantPermissions,
          {
            chainId: client.chain.id,
          },
        )

        // Convert the key into a permission.
        const permissionsRequest = key
          ? z.encode(PermissionsRequest.Schema, PermissionsRequest.fromKey(key))
          : undefined

        // Send a request off to the dialog to prepare the upgrade.
        const provider = getProvider(store)
        const { context, digests } = await provider.request({
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

        type Context = { account: Account.Account }
        const keys = (context as Context).account.keys?.map((k) => {
          if (k.id === key?.id) return { ...k, ...key }
          return k
        })

        return {
          context: {
            ...(context as Context),
            account: { ...(context as Context).account, keys },
          },
          digests,
        }
      },

      async revokeAdmin(parameters) {
        const { account, id, internal } = parameters
        const { store, request } = internal

        if (request.method !== 'wallet_revokeAdmin')
          throw new Error('Cannot revoke admin for method: ' + request.method)

        const key = account.keys?.find((key) => key.id === id)
        if (!key) return

        // Cannot revoke the only WebAuthn key left
        if (
          key.type === 'webauthn-p256' &&
          account.keys?.filter((key) => key.type === 'webauthn-p256').length ===
            1
        )
          throw new Error('revoke the only WebAuthn key left.')

        const feeToken = await resolveFeeToken(internal, parameters)

        const provider = getProvider(store)
        return await provider.request({
          ...request,
          params: [
            {
              ...request.params?.[0],
              capabilities: {
                ...request.params?.[0]?.capabilities,
                feeToken,
              },
            },
          ],
        })
      },

      async revokePermissions(parameters) {
        const { account, id, internal } = parameters
        const { store, request } = internal

        if (request.method !== 'wallet_revokePermissions')
          throw new Error(
            'Cannot revoke permissions for method: ' + request.method,
          )

        const key = account.keys?.find((key) => key.id === id)
        if (!key) return

        // We shouldn't be able to revoke admins.
        if (key.role === 'admin') throw new Error('cannot revoke permissions.')

        const provider = getProvider(store)
        return await provider.request(request)
      },

      async sendCalls(parameters) {
        const {
          account,
          asTxHash,
          calls,
          chainId,
          internal,
          merchantUrl,
          requiredFunds,
        } = parameters
        const { client, store, request } = internal

        const provider = getProvider(store)

        const feeToken = await resolveFeeToken(internal, parameters)

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
          if (!renderer.supportsHeadless)
            return fallback.actions.sendCalls(parameters)

          try {
            // TODO: use eventual Viem Action.
            const req = await provider.request(
              z.encode(RpcSchema_porto.wallet_prepareCalls.Request, {
                method: 'wallet_prepareCalls',
                params: [
                  {
                    calls,
                    capabilities: {
                      ...(request._decoded.method === 'wallet_sendCalls'
                        ? request._decoded.params?.[0]?.capabilities
                        : undefined),
                      feeToken,
                      merchantUrl,
                      requiredFunds,
                    },
                    chainId,
                    from: account.address,
                    key,
                  },
                ],
              }),
            )

            const quotes = req.capabilities?.quote?.quotes ?? []
            const hasFeeDeficit = quotes.some((quote, index) => {
              const isMultichainDestination =
                index === quotes.length - 1 && quotes.length > 1
              if (isMultichainDestination) return false
              return Hex.toBigInt(quote.feeTokenDeficit) > 0n
            })
            if (hasFeeDeficit) throw new Error('insufficient funds')

            const signature = await Key.sign(key, {
              address: null,
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

            const response = result[0]
            if (!response) throw new Error('id not found')

            if (asTxHash) {
              const { id, receipts, status } = await waitForCallsStatus(
                client,
                {
                  id: response.id,
                  pollingInterval: 500,
                },
              )
              if (!receipts?.[0]) {
                if (status === 'success')
                  throw new Provider.UnknownBundleIdError({
                    message: 'Call bundle with id: ' + id + ' not found.',
                  })
                throw new RpcResponse.TransactionRejectedError({
                  message:
                    'Transaction failed under call bundle id: ' + id + '.',
                })
              }
              return {
                id: receipts[0].transactionHash,
              }
            }

            return response
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
                  feeToken,
                  merchantUrl,
                },
                ...(chainId ? { chainId: Hex.fromNumber(chainId) } : {}),
              },
            ],
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
                  feeToken,
                  merchantUrl,
                },
                ...(chainId ? { chainId: Hex.fromNumber(chainId) } : {}),
              },
            ],
          })

          return result
        }

        throw new Error('Cannot execute for method: ' + request.method)
      },

      async sendPreparedCalls(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (request.method !== 'wallet_sendPreparedCalls')
          throw new Error(
            'Cannot send prepared calls for method: ' + request.method,
          )

        if (!renderer.supportsHeadless)
          return fallback.actions.sendPreparedCalls(parameters)

        const provider = getProvider(store)
        const result = await provider.request(request)

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

      async switchChain(parameters) {
        const { internal } = parameters
        const { store, request } = internal

        if (request.method !== 'wallet_switchEthereumChain')
          throw new Error('Cannot switch chain for method: ' + request.method)

        if (!renderer.supportsHeadless) return

        const provider = getProvider(store)
        return await provider.request(request)
      },

      async upgradeAccount(parameters) {
        const { account, internal } = parameters
        const { store, request } = internal

        if (request.method !== 'wallet_upgradeAccount')
          throw new Error(
            'Cannot upgrade account for method: ' + request.method,
          )

        const provider = getProvider(store)
        await provider.request(request)

        return { account }
      },

      async verifyEmail(parameters) {
        const { internal } = parameters
        const { request, store } = internal

        if (request.method !== 'account_verifyEmail')
          throw new Error('Cannot verify email for method: ' + request.method)

        const provider = getProvider(store)
        return await provider.request(request)
      },
    },
    config: parameters,
    name: 'dialog',
    setup(parameters) {
      const { internal } = parameters
      const { store } = internal

      const dialog = renderer.setup({
        host,
        internal,
        theme,
        themeController,
      })

      const unsubscribe = store.subscribe(
        (x) => x.requestQueue,
        (requestQueue) => {
          for (const listener of listeners) listener(requestQueue)

          const requests = requestQueue
            .map((x) => (x.status === 'pending' ? x : undefined))
            .filter(Boolean) as readonly QueuedRequest[]
          dialog.syncRequests(requests).catch(() => {})
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
     * Mode to fall back to if the renderer does not support background
     * operations (e.g. popups and web views).
     *
     * @default `Mode.relay()`
     */
    fallback?: Mode.Mode | undefined
    /**
     * URL of the dialog embed.
     * @default 'http://id.porto.sh/dialog'
     */
    host?: string | undefined
    /**
     * Dialog renderer.
     * @default Dialog.iframe()
     */
    renderer?: Dialog.Dialog | undefined
    /**
     * Theme to apply to the dialog.
     * @default undefined
     */
    theme?: ThemeFragment | undefined
    /**
     * Theme controller.
     * @default undefined
     */
    themeController?: Dialog.ThemeController | undefined
  }
}

export async function resolveFeeToken(
  internal: Mode.ActionsInternal,
  parameters?: {
    feeToken?: Token.Symbol | Address.Address | undefined
  },
) {
  const {
    config: { feeToken },
  } = internal
  const { feeToken: overrideFeeToken } = parameters ?? {}
  return overrideFeeToken ?? feeToken
}

function getAuthUrl(
  apiUrl: string | Siwe.AuthUrl | undefined,
  { storage }: { storage: Storage },
) {
  if (!apiUrl) return undefined

  const authUrl = Siwe.resolveAuthUrl(
    apiUrl,
    typeof window !== 'undefined' ? window.location.origin : undefined,
  )

  // Store the resolved auth URL for future use (e.g., disconnect)
  if (authUrl) storage.setItem('porto.authUrl', authUrl)

  return authUrl
}
