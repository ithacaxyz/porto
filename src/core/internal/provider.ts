import * as Mipd from 'mipd'
import type { RpcSchema } from 'ox'
import * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import * as ox_Provider from 'ox/Provider'
import * as RpcResponse from 'ox/RpcResponse'

import type * as Chains from '../Chains.js'
import * as Porto from '../Porto.js'
import type * as Call from './call.js'
import * as Key from './key.js'
import type * as Schema from './rpcSchema.js'

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

        case 'experimental_authorizeKey': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ address, key: keyToAuthorize }] = request.params ?? [{}]

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient()

          const { key } = await implementation.actions.authorizeKey({
            account,
            key: keyToAuthorize,
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
            data: getActiveKeys([...(account.keys ?? []), key]),
            type: 'keysChanged',
          })

          return {
            callScopes: key.callScopes,
            expiry: key.expiry,
            publicKey: key.publicKey,
            role: key.role,
            type: key.type,
          } satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'experimental_authorizeKey'
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

          store.setState((x) => ({ ...x, accounts: [account] }))

          emitter.emit('connect', {
            chainId: Hex.fromNumber(client.chain.id),
          })
          return {
            address: account.address,
            capabilities: {
              keys: account.keys ? getActiveKeys(account.keys) : [],
            },
          } satisfies RpcSchema.ExtractReturnType<
            Schema.Schema,
            'experimental_createAccount'
          >
        }

        case 'experimental_prepareCreateAccount': {
          const [{ address, capabilities, label }] = request.params ?? [{}]

          const { authorizeKey } = capabilities ?? {}

          const authorizeKeys = authorizeKey ? [authorizeKey] : undefined

          const client = getClient()

          const { context, signPayloads } =
            await implementation.actions.prepareCreateAccount({
              address,
              authorizeKeys,
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

        case 'experimental_keys': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ address }] = request.params ?? [{}]

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]

          return getActiveKeys(account?.keys ?? [])
        }

        case 'experimental_revokeKey': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ address, publicKey }] = request.params

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient()

          await implementation.actions.revokeKey({
            account,
            publicKey,
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          const keys = account.keys?.filter(
            (key) => key.publicKey !== publicKey,
          )

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
            data: getActiveKeys(keys ?? []),
            type: 'keysChanged',
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

          const { createAccount, authorizeKey } = capabilities ?? {}

          const authorizeKeys = authorizeKey ? [authorizeKey] : undefined
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
                authorizeKeys,
                label,
                internal,
              })
              return { accounts: [account] }
            }
            const account = state.accounts[0]
            const address = account?.address
            const credentialId = (() => {
              for (const key of account?.keys ?? []) {
                if (key.expiry < BigInt(Math.floor(Date.now() / 1000))) continue
                if (!key.credential) continue
                return key.credential.id
              }
              return undefined
            })()
            const loadAccountsParams = {
              authorizeKeys,
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
                keys: account.keys ? getActiveKeys(account.keys) : [],
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
            keys: {
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

        case 'wallet_sendCalls': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [parameters] = request.params
          const { capabilities, chainId, from } = parameters

          const client = getClient(chainId)

          if (chainId && Hex.toNumber(chainId) !== client.chain.id)
            throw new ox_Provider.ChainDisconnectedError()

          requireParameter(from, 'from')

          const account = state.accounts.find((account) =>
            Address.isEqual(account.address, from),
          )
          if (!account) throw new ox_Provider.UnauthorizedError()

          const calls = parameters.calls.map((x) => {
            requireParameter(x, 'to')
            return x
          }) as Call.Call[]

          const hash = await implementation.actions.execute({
            account,
            calls,
            key: capabilities?.key,
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
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTk1IiBoZWlnaHQ9IjU5NSIgdmlld0JveD0iMCAwIDU5NSA1OTUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1OTUiIGhlaWdodD0iNTk1IiBmaWxsPSIjMTQ1QUM2Ii8+CjxwYXRoIGQ9Ik0zNzMuMzI1IDMwNS44NTJDMzgyLjQ4NyAzMDMuMTA5IDM5Mi4zMyAzMDcuMDA1IDM5Ny4xNjMgMzE1LjI4N0w0NTAuNjAxIDQwNi44NTVDNDU3LjM1NyA0MTguNDMyIDQ0OS4wNDIgNDMzIDQzNS42NzggNDMzSDE2MC4zMjdDMTQ2LjI4NCA0MzMgMTM4LjA5NSA0MTcuMDg3IDE0Ni4yMTkgNDA1LjU4N0wxNzAuNTIxIDM3MS4xODhDMTczLjIwNCAzNjcuMzkxIDE3Ny4wNzYgMzY0LjYwNCAxODEuNTE5IDM2My4yNzRMMzczLjMyNSAzMDUuODUyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggb3BhY2l0eT0iMC43NSIgZD0iTTI3NC4zOTggMTc2LjcxOUMyNzguMzQzIDE2OS42NiAyODguOTE0IDE3MS4zODMgMjkwLjQzMyAxNzkuMzMzTDMxMi45OTYgMjk3LjQ0MUMzMTQuMTYxIDMwMy41MzkgMzEwLjU2MiAzMDkuNTM5IDMwNC42NDggMzExLjM1NUwxOTcuOSAzNDQuMTUyQzE5MC40NCAzNDYuNDQzIDE4NC4wMSAzMzguNDI5IDE4Ny44MjggMzMxLjU5OUwyNzQuMzk4IDE3Ni43MTlaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBvcGFjaXR5PSIwLjUiIGQ9Ik0zMDEuNjc1IDE2OS4yMTlDMzAwLjU2NiAxNjMuNDUyIDMwOC4zMjggMTYwLjUzNyAzMTEuMjYgMTY1LjYyTDM3OS4wNDggMjgzLjEzM0MzODAuNzUgMjg2LjA4MyAzNzkuMjE4IDI4OS44NTEgMzc1Ljk0NyAyOTAuNzY0TDMzNi42NzcgMzAxLjcxNkMzMzEuODEyIDMwMy4wNzMgMzI2LjgyOSAyOTkuOTc0IDMyNS44NzEgMjk0Ljk5N0wzMDEuNjc1IDE2OS4yMTlaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
      name: 'Porto',
      rdns: 'xyz.ithaca.porto',
      uuid: crypto.randomUUID(),
    },
    provider: provider as any,
  })
}

function getActiveKeys(keys: readonly Key.Key[]): readonly Key.Rpc[] {
  return keys
    .map((key) => {
      if (key.expiry > 0 && key.expiry < BigInt(Math.floor(Date.now() / 1000)))
        return undefined
      return Key.toRpc(key)
    })
    .filter(Boolean) as never
}

function requireParameter(
  param: unknown,
  details: string,
): asserts param is NonNullable<typeof param> {
  if (typeof param === 'undefined')
    throw new RpcResponse.InvalidParamsError({
      message: `Missing required parameter: ${details}`,
    })
}
