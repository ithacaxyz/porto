import * as Mipd from 'mipd'
import type { RpcSchema } from 'ox'
import * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import * as ox_Provider from 'ox/Provider'
import * as RpcResponse from 'ox/RpcResponse'

import type { Delegation } from 'porto'
import type * as Chains from '../Chains.js'
import * as Porto from '../Porto.js'
import type * as Schema from '../RpcSchema.js'
import * as Account from './account.js'
import type * as Call from './call.js'
import * as Key from './key.js'
import * as Permissions from './permissions.js'
import type * as Schema_internal from './rpcSchema.js'

export type Provider = ox_Provider.Provider<{
  includeEvents: true
  schema: Schema.Schema
}> & {
  /**
   * Not part of versioned API, proceed with caution.
   * @deprecated
   */
  _internal: {
    destroy: () => void
  }
}

export function from<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
>(parameters: from.Parameters<chains>): Provider {
  const { config, store } = parameters
  const { announceProvider, implementation } = config

  function getClient(chainId_?: Hex.Hex | number | undefined) {
    const chainId =
      typeof chainId_ === 'string' ? Hex.toNumber(chainId_) : chainId_
    return Porto.getClient({ _internal: parameters }, { chainId })
  }

  const emitter = ox_Provider.createEmitter()
  const provider = ox_Provider.from({
    ...emitter,
    async request(request_) {
      const request = request_ as RpcSchema.ExtractRequest<Schema.Schema>
      const state = store.getState()

      switch (request.method) {
        case 'eth_accounts': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()
          return state.accounts.map(
            (account) => account.address,
          ) satisfies RpcSchema.ExtractReturnType<Schema.Schema, 'eth_accounts'>
        }

        case 'eth_chainId': {
          return Hex.fromNumber(
            state.chain.id,
          ) satisfies RpcSchema.ExtractReturnType<Schema.Schema, 'eth_chainId'>
        }

        case 'eth_requestAccounts': {
          if (state.accounts.length > 0)
            return state.accounts.map(
              (account) => account.address,
            ) satisfies RpcSchema.ExtractReturnType<
              Schema.Schema,
              'eth_requestAccounts'
            >

          const client = getClient()

          const { accounts } = await implementation.actions.loadAccounts({
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          store.setState((x) => ({ ...x, accounts }))

          emitter.emit('connect', {
            chainId: Hex.fromNumber(client.chain.id),
          })

          return accounts.map(
            (account) => account.address,
          ) satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'eth_requestAccounts'
          >
        }

        case 'eth_sendTransaction': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ chainId, data = '0x', from, to, value = '0x0' }] =
            request.params

          const client = getClient(chainId)

          if (chainId && Hex.toNumber(chainId) !== client.chain.id)
            throw new ox_Provider.ChainDisconnectedError()

          requireParameter(to, 'to')
          requireParameter(from, 'from')

          const account = state.accounts.find((account) =>
            Address.isEqual(account.address, from),
          )
          if (!account) throw new ox_Provider.UnauthorizedError()

          const hash = await implementation.actions.execute({
            account,
            calls: [
              {
                data,
                to,
                value: Hex.toBigInt(value),
              },
            ],
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          return hash satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'eth_sendTransaction'
          >
        }

        case 'eth_signTypedData_v4': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [address, data] = request.params

          const account = state.accounts.find((account) =>
            Address.isEqual(account.address, address),
          )
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient()

          const signature = await implementation.actions.signTypedData({
            account,
            data,
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          return signature satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'eth_signTypedData_v4'
          >
        }

        case 'experimental_grantPermissions': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ address, chainId, ...permissions }] = request.params ?? [{}]

          assertPermissions(permissions)

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient(chainId)

          const { key } = await implementation.actions.grantPermissions({
            account,
            permissions,
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          store.setState((x) => {
            const index = x.accounts.findIndex((x) =>
              account ? Address.isEqual(x.address, account.address) : true,
            )
            if (index === -1) return x
            return {
              ...x,
              accounts: x.accounts.map((account, i) =>
                i === index
                  ? { ...account, keys: [...(account.keys ?? []), key] }
                  : account,
              ),
            }
          })

          emitter.emit('message', {
            data: getActivePermissions([...(account.keys ?? []), key], {
              address: account.address,
            }),
            type: 'permissionsChanged',
          })

          return Permissions.fromKey(key, {
            address: account.address,
          }) satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'experimental_grantPermissions'
          >
        }

        case 'experimental_createAccount': {
          const [{ chainId, label, context, signatures }] = request.params ?? [
            {},
          ]

          const client = getClient(chainId)

          const { account } = await implementation.actions.createAccount({
            context,
            label,
            signatures,
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          const permissions = getActivePermissions(account.keys ?? [], {
            address: account.address,
          })

          store.setState((x) => ({ ...x, accounts: [account] }))

          emitter.emit('connect', {
            chainId: Hex.fromNumber(client.chain.id),
          })
          return {
            address: account.address,
            capabilities: {
              ...(permissions.length > 0 ? { permissions } : {}),
            },
          } satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'experimental_createAccount'
          >
        }

        case 'experimental_prepareCreateAccount': {
          const [{ address, capabilities, chainId, label }] =
            request.params ?? [{}]

          const { grantPermissions: permissions } = capabilities ?? {}

          if (permissions) assertPermissions(permissions)

          const client = getClient(chainId)

          const { context, signPayloads } =
            await implementation.actions.prepareCreateAccount({
              address,
              permissions,
              label,
              internal: {
                client,
                config,
                request,
                store,
              },
            })

          return {
            context,
            signPayloads,
          } satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'experimental_prepareCreateAccount'
          >
        }

        case 'experimental_permissions': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ address }] = request.params ?? [{}]

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]

          return getActivePermissions(account?.keys ?? [], {
            address: account!.address,
          })
        }

        case 'experimental_revokePermissions': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ address, id }] = request.params

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient()

          await implementation.actions.revokePermissions({
            account,
            id,
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          const keys = account.keys?.filter((key) => key.publicKey !== id)

          store.setState((x) => ({
            ...x,
            accounts: x.accounts.map((x) =>
              Address.isEqual(x.address, account.address)
                ? {
                    ...x,
                    keys,
                  }
                : x,
            ),
          }))

          emitter.emit('message', {
            data: getActivePermissions(keys ?? [], {
              address: account.address,
            }),
            type: 'permissionsChanged',
          })

          return
        }

        case 'porto_ping': {
          return 'pong' satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'porto_ping'
          >
        }

        case 'personal_sign': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [data, address] = request.params

          const account = state.accounts.find((account) =>
            Address.isEqual(account.address, address),
          )
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient()

          const signature = await implementation.actions.signPersonalMessage({
            account,
            data,
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          return signature satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'personal_sign'
          >
        }

        case 'wallet_connect': {
          const [{ capabilities }] = request.params ?? [{}]

          const client = getClient()

          const { createAccount, grantPermissions: permissions } =
            capabilities ?? {}

          if (permissions) assertPermissions(permissions)

          const internal = {
            client,
            config,
            request,
            store,
          }

          const { accounts } = await (async () => {
            if (createAccount) {
              const { label = undefined } =
                typeof createAccount === 'object' ? createAccount : {}
              const { account } = await implementation.actions.createAccount({
                permissions,
                label,
                internal,
              })
              return { accounts: [account] }
            }
            const account = state.accounts[0]
            const address = account?.address
            const credentialId = (() => {
              for (const key of account?.keys ?? []) {
                if (
                  key.expiry > 0 &&
                  key.expiry < BigInt(Math.floor(Date.now() / 1000))
                )
                  continue
                if (!key.credential) continue
                return key.credential.id
              }
              return undefined
            })()
            const loadAccountsParams = {
              permissions,
              internal,
            }
            try {
              // try to restore from stored account (`address`/`credentialId`) to avoid multiple prompts
              return await implementation.actions.loadAccounts({
                address,
                credentialId,
                ...loadAccountsParams,
              })
            } catch (error) {
              // error with `address`/`credentialId` likely means one or both are stale, retry
              if (address && credentialId)
                return await implementation.actions.loadAccounts(
                  loadAccountsParams,
                )
              throw error
            }
          })()

          store.setState((x) => ({ ...x, accounts }))

          emitter.emit('connect', {
            chainId: Hex.fromNumber(client.chain.id),
          })

          return {
            accounts: accounts.map((account) => ({
              address: account.address,
              capabilities: {
                permissions: account.keys
                  ? getActivePermissions(account.keys, {
                      address: account.address,
                    })
                  : [],
              },
            })),
          } satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'wallet_connect'
          >
        }

        case 'wallet_disconnect': {
          store.setState((x) => ({ ...x, accounts: [] }))
          emitter.emit('disconnect', new ox_Provider.DisconnectedError())
          return
        }

        case 'wallet_getCallsStatus': {
          const [id] = request.params ?? []

          const client = getClient()

          const receipt = await client.request({
            method: 'eth_getTransactionReceipt',
            params: [id! as Hex.Hex],
          })

          if (!receipt) return { receipts: [], status: 'PENDING' }
          return {
            receipts: [receipt],
            status: 'CONFIRMED',
          } satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'wallet_getCallsStatus'
          >
        }

        case 'wallet_getCapabilities': {
          const value = {
            atomicBatch: {
              supported: true,
            },
            createAccount: {
              supported: true,
            },
            permissions: {
              supported: true,
            },
          }

          const capabilities = {} as Record<Hex.Hex, typeof value>
          for (const chain of config.chains)
            capabilities[Hex.fromNumber(chain.id)] = value

          return capabilities satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'wallet_getCapabilities'
          >
        }

        case 'wallet_prepareCalls': {
          const [parameters] = request.params
          const { chainId, from, version = '1.0' } = parameters

          const client = getClient(chainId)

          const account = from
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, from),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          if (chainId && Hex.toNumber(chainId) !== client.chain.id)
            throw new ox_Provider.ChainDisconnectedError()

          const calls = parameters.calls.map((x) => {
            requireParameter(x, 'to')
            return x
          }) as Call.Call[]

          const { signPayloads, request: context } =
            await implementation.actions.prepareExecute({
              calls,
              client,
              request,
              account: Account.from(account),
            })

          return {
            chainId,
            version,
            context,
            digest: signPayloads.at(0)!,
          } satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'wallet_prepareCalls'
          >
        }

        case 'wallet_sendPreparedCalls': {
          const [parameters] = request.params
          const { signature, chainId } = parameters
          const context =
            parameters.context as Delegation.prepareExecute.ReturnType['request']

          const client = getClient(chainId)

          if (chainId && Hex.toNumber(chainId) !== client.chain.id)
            throw new ox_Provider.ChainDisconnectedError()

          const calls = context.calls.map((x) => {
            requireParameter(x, 'to')
            return x
          }) as Call.Call[]

          const wrappedSignature = Key.wrapSignature(signature.value, {
            keyType: signature.type as never,
            publicKey: signature.publicKey,
          })

          const hash = await implementation.actions.execute({
            account: context.account,
            calls,
            nonce: context.nonce,
            signature: wrappedSignature,
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          return [{ id: hash }] satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'wallet_sendPreparedCalls'
          >
        }

        case 'wallet_sendCalls': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [parameters] = request.params
          const { capabilities, chainId, from } = parameters

          const client = getClient(chainId)

          if (chainId && Hex.toNumber(chainId) !== client.chain.id)
            throw new ox_Provider.ChainDisconnectedError()

          const account = from
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, from),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const calls = parameters.calls.map((x) => {
            requireParameter(x, 'to')
            return x
          }) as Call.Call[]

          const hash = await implementation.actions.execute({
            account,
            calls,
            permissionsId: capabilities?.permissions?.id,
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          return hash satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'wallet_sendCalls'
          >
        }

        default: {
          if (request.method.startsWith('wallet_'))
            throw new ox_Provider.UnsupportedMethodError()
          return getClient().request(request as any)
        }
      }
    },
  })

  function setup() {
    const unsubscribe_accounts = store.subscribe(
      (state) => state.accounts,
      (accounts) => {
        emitter.emit(
          'accountsChanged',
          accounts.map((account) => account.address),
        )
      },
    )

    const unsubscribe_chain = store.subscribe(
      (state) => state.chain,
      (chain) => {
        emitter.emit('chainChanged', Hex.fromNumber(chain.id))
      },
    )

    const unwatch = announceProvider ? announce(provider as Provider) : () => {}

    return () => {
      unsubscribe_accounts()
      unsubscribe_chain()
      unwatch()
    }
  }
  const destroy = setup()

  return Object.assign(provider, {
    _internal: {
      destroy,
    },
  })
}

export declare namespace from {
  export type Parameters<
    chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
      Chains.Chain,
      ...Chains.Chain[],
    ],
  > = {
    config: Porto.Config<chains>
    store: Porto.Store
  }
}

export function announce(provider: Provider) {
  if (typeof window === 'undefined') return () => {}
  return Mipd.announceProvider({
    info: {
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIyIiBoZWlnaHQ9IjQyMiIgdmlld0JveD0iMCAwIDQyMiA0MjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MjIiIGhlaWdodD0iNDIyIiBmaWxsPSJibGFjayIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMV8xNSkiPgo8cGF0aCBkPSJNODEgMjg2LjM2NkM4MSAyODAuODkzIDg1LjQ1MDUgMjc2LjQ1NSA5MC45NDA0IDI3Ni40NTVIMzI5LjUxMUMzMzUuMDAxIDI3Ni40NTUgMzM5LjQ1MiAyODAuODkzIDMzOS40NTIgMjg2LjM2NlYzMDYuMTg4QzMzOS40NTIgMzExLjY2MiAzMzUuMDAxIDMxNi4wOTkgMzI5LjUxMSAzMTYuMDk5SDkwLjk0MDRDODUuNDUwNSAzMTYuMDk5IDgxIDMxMS42NjIgODEgMzA2LjE4OFYyODYuMzY2WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOTAuOTQwNCAyMzQuODI4Qzg1LjQ1MDUgMjM0LjgyOCA4MSAyMzkuMjY2IDgxIDI0NC43MzlWMjcxLjUzMUM4My44NDMyIDI2OS42MzMgODcuMjYyMiAyNjguNTI2IDkwLjk0MDQgMjY4LjUyNkgzMjkuNTExQzMzMy4xODggMjY4LjUyNiAzMzYuNjA4IDI2OS42MzMgMzM5LjQ1MiAyNzEuNTMxVjI0NC43MzlDMzM5LjQ1MiAyMzkuMjY2IDMzNS4wMDEgMjM0LjgyOCAzMjkuNTExIDIzNC44MjhIOTAuOTQwNFpNMzM5LjQ1MiAyODYuMzY2QzMzOS40NTIgMjgwLjg5MyAzMzUuMDAxIDI3Ni40NTUgMzI5LjUxMSAyNzYuNDU1SDkwLjk0MDRDODUuNDUwNSAyNzYuNDU1IDgxIDI4MC44OTMgODEgMjg2LjM2NlYzMDYuMTlDODEgMzExLjY2NCA4NS40NTA1IDMxNi4xMDEgOTAuOTQwNCAzMTYuMTAxSDMyOS41MTFDMzM1LjAwMSAzMTYuMTAxIDMzOS40NTIgMzExLjY2NCAzMzkuNDUyIDMwNi4xOVYyODYuMzY2WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC41Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOTAuOTQwNCAxOTMuMjAxQzg1LjQ1MDUgMTkzLjIwMSA4MSAxOTcuNjM4IDgxIDIwMy4xMTJWMjI5LjkwM0M4My44NDMyIDIyOC4wMDYgODcuMjYyMiAyMjYuODk5IDkwLjk0MDQgMjI2Ljg5OUgzMjkuNTExQzMzMy4xODggMjI2Ljg5OSAzMzYuNjA4IDIyOC4wMDYgMzM5LjQ1MiAyMjkuOTAzVjIwMy4xMTJDMzM5LjQ1MiAxOTcuNjM4IDMzNS4wMDEgMTkzLjIwMSAzMjkuNTExIDE5My4yMDFIOTAuOTQwNFpNMzM5LjQ1MiAyNDQuNzM5QzMzOS40NTIgMjM5LjI2NSAzMzUuMDAxIDIzNC44MjggMzI5LjUxMSAyMzQuODI4SDkwLjk0MDRDODUuNDUwNSAyMzQuODI4IDgxIDIzOS4yNjUgODEgMjQ0LjczOVYyNzEuNTNDODEuMjE3NSAyNzEuMzg1IDgxLjQzODMgMjcxLjI0NSA4MS42NjI0IDI3MS4xMDlDODMuODMyNSAyNjkuNzk0IDg2LjMwNTQgMjY4LjkyNyA4OC45NTIzIDI2OC42MzVDODkuNjA1MSAyNjguNTYzIDkwLjI2ODQgMjY4LjUyNiA5MC45NDA0IDI2OC41MjZIMzI5LjUxMUMzMzAuMTgzIDI2OC41MjYgMzMwLjg0NiAyNjguNTYzIDMzMS40OTggMjY4LjYzNUMzMzQuNDE5IDI2OC45NTcgMzM3LjEyOCAyNjkuOTggMzM5LjQ1MiAyNzEuNTNWMjQ0LjczOVpNMzM5LjQ1MiAyODYuMzY2QzMzOS40NTIgMjgxLjAyMSAzMzUuMjA2IDI3Ni42NjMgMzI5Ljg5MyAyNzYuNDYyQzMyOS43NjcgMjc2LjQ1NyAzMjkuNjQgMjc2LjQ1NSAzMjkuNTExIDI3Ni40NTVIOTAuOTQwNEM4NS40NTA1IDI3Ni40NTUgODEgMjgwLjg5MyA4MSAyODYuMzY2VjMwNi4xODhDODEgMzExLjY2MiA4NS40NTA1IDMxNi4xMDEgOTAuOTQwNCAzMTYuMTAxSDMyOS41MTFDMzM1LjAwMSAzMTYuMTAxIDMzOS40NTIgMzExLjY2MiAzMzkuNDUyIDMwNi4xODhWMjg2LjM2NloiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPgo8cGF0aCBvcGFjaXR5PSIwLjMiIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOTguMDE0NiAxMDRDODguNjE3NyAxMDQgODEgMTExLjU5NSA4MSAxMjAuOTY1VjE4OC4yNzZDODMuODQzMiAxODYuMzc5IDg3LjI2MjIgMTg1LjI3MiA5MC45NDA0IDE4NS4yNzJIMzI5LjUxMUMzMzMuMTg4IDE4NS4yNzIgMzM2LjYwOCAxODYuMzc5IDMzOS40NTIgMTg4LjI3NlYxMjAuOTY1QzMzOS40NTIgMTExLjU5NSAzMzEuODMzIDEwNCAzMjIuNDM3IDEwNEg5OC4wMTQ2Wk0zMzkuNDUyIDIwMy4xMTJDMzM5LjQ1MiAxOTcuNjM4IDMzNS4wMDEgMTkzLjIwMSAzMjkuNTExIDE5My4yMDFIOTAuOTQwNEM4NS40NTA1IDE5My4yMDEgODEgMTk3LjYzOCA4MSAyMDMuMTEyVjIyOS45MDNDODEuMjE3NSAyMjkuNzU4IDgxLjQzODMgMjI5LjYxOCA4MS42NjI0IDIyOS40ODJDODMuODMyNSAyMjguMTY3IDg2LjMwNTQgMjI3LjMgODguOTUyMyAyMjcuMDA4Qzg5LjYwNTEgMjI2LjkzNiA5MC4yNjg0IDIyNi44OTkgOTAuOTQwNCAyMjYuODk5SDMyOS41MTFDMzMwLjE4MyAyMjYuODk5IDMzMC44NDYgMjI2LjkzNiAzMzEuNDk4IDIyNy4wMDhDMzM0LjQxOSAyMjcuMzMgMzM3LjEyOCAyMjguMzUyIDMzOS40NTIgMjI5LjkwM1YyMDMuMTEyWk0zMzkuNDUyIDI0NC43MzlDMzM5LjQ1MiAyMzkuMzkzIDMzNS4yMDYgMjM1LjAzNiAzMjkuODkzIDIzNC44MzVDMzI5Ljc2NyAyMzQuODMgMzI5LjY0IDIzNC44MjggMzI5LjUxMSAyMzQuODI4SDkwLjk0MDRDODUuNDUwNSAyMzQuODI4IDgxIDIzOS4yNjUgODEgMjQ0LjczOVYyNzEuNTNMODEuMDcwNyAyNzEuNDgzQzgxLjI2NTMgMjcxLjM1NSA4MS40NjI1IDI3MS4yMyA4MS42NjI0IDI3MS4xMDlDODEuOTA4MyAyNzAuOTYgODIuMTU4MSAyNzAuODE3IDgyLjQxMTcgMjcwLjY3OUM4NC4zOTUzIDI2OS42MDUgODYuNjA1NCAyNjguODk0IDg4Ljk1MjMgMjY4LjYzNUM4OS4wMDUyIDI2OC42MjkgODkuMDU4IDI2OC42MjQgODkuMTExIDI2OC42MThDODkuNzEyNSAyNjguNTU3IDkwLjMyMjggMjY4LjUyNiA5MC45NDA0IDI2OC41MjZIMzI5LjUxMUMzMjkuNzM4IDI2OC41MjYgMzI5Ljk2NSAyNjguNTMgMzMwLjE5MiAyNjguNTM5QzMzMC42MzEgMjY4LjU1NSAzMzEuMDY3IDI2OC41ODcgMzMxLjQ5OCAyNjguNjM1QzMzNC40MTkgMjY4Ljk1NyAzMzcuMTI4IDI2OS45OCAzMzkuNDUyIDI3MS41M1YyNDQuNzM5Wk0zMzkuNDUyIDI4Ni4zNjZDMzM5LjQ1MiAyODEuMDIxIDMzNS4yMDYgMjc2LjY2MyAzMjkuODkzIDI3Ni40NjJMMzI5Ljg2NSAyNzYuNDYxQzMyOS43NDggMjc2LjQ1NyAzMjkuNjI5IDI3Ni40NTUgMzI5LjUxMSAyNzYuNDU1SDkwLjk0MDRDODUuNDUwNSAyNzYuNDU1IDgxIDI4MC44OTMgODEgMjg2LjM2NlYzMDYuMTg4QzgxIDMxMS42NjIgODUuNDUwNSAzMTYuMTAxIDkwLjk0MDQgMzE2LjEwMUgzMjkuNTExQzMzNS4wMDEgMzE2LjEwMSAzMzkuNDUyIDMxMS42NjIgMzM5LjQ1MiAzMDYuMTg4VjI4Ni4zNjZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjY5Ljg2OCAxMzEuNzUyQzI2OS44NjggMTI2LjI3OCAyNzQuMzE4IDEyMS44NCAyNzkuODA4IDEyMS44NEgzMTEuNjE4QzMxNy4xMDggMTIxLjg0IDMyMS41NTggMTI2LjI3OCAzMjEuNTU4IDEzMS43NTJWMTYxLjQ4NUMzMjEuNTU4IDE2Ni45NTkgMzE3LjEwOCAxNzEuMzk2IDMxMS42MTggMTcxLjM5NkgyNzkuODA4QzI3NC4zMTggMTcxLjM5NiAyNjkuODY4IDE2Ni45NTkgMjY5Ljg2OCAxNjEuNDg1VjEzMS43NTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzFfMTUiPgo8cmVjdCB3aWR0aD0iMjU5IiBoZWlnaHQ9IjIxMyIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDgxIDEwNCkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K',
      name: 'Porto',
      rdns: 'xyz.ithaca.porto',
      uuid: crypto.randomUUID(),
    },
    provider: provider as any,
  })
}

function getActivePermissions(
  keys: readonly Key.Key[],
  {
    address,
    chainId,
  }: { address: Address.Address; chainId?: Hex.Hex | undefined },
): Schema_internal.PermissionsReturnType {
  return keys
    .map((key) => {
      if (key.role !== 'session') return undefined
      if (key.expiry > 0 && key.expiry < BigInt(Math.floor(Date.now() / 1000)))
        return undefined
      return Permissions.fromKey(key, { address, chainId })
    })
    .filter(Boolean) as never
}

export function requireParameter(
  param: unknown,
  details: string,
): asserts param is NonNullable<typeof param> {
  if (typeof param === 'undefined')
    throw new RpcResponse.InvalidParamsError({
      message: `Missing required parameter: ${details}`,
    })
}

function assertPermissions(
  permission: Schema_internal.GrantPermissionsParameters,
) {
  if (!permission.expiry) throw new Error('expiry is required.')
  if (
    !permission.permissions ||
    Object.keys(permission.permissions).length === 0
  )
    throw new Error('permissions are required.')
}
