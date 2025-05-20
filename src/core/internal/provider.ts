import * as Mipd from 'mipd'
import * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import * as ox_Provider from 'ox/Provider'
import * as RpcResponse from 'ox/RpcResponse'
import { verifyHash } from 'viem/actions'
import * as Account from '../Account.js'
import type * as Chains from '../Chains.js'
import type * as Key from '../Key.js'
import type * as Porto from '../Porto.js'
import type * as RpcSchema from '../RpcSchema.js'
import * as Permissions from './permissions.js'
import * as Porto_internal from './porto.js'
import * as RpcRequest from './typebox/request.js'
import * as Rpc from './typebox/rpc.js'
import * as Typebox from './typebox/typebox.js'
import * as Actions from './viem/actions.js'

export type Provider = ox_Provider.Provider<{
  includeEvents: true
  schema: RpcSchema.Schema
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
  const { config, getMode, store } = parameters
  const { announceProvider } = config

  function getClient(chainId_?: Hex.Hex | number | undefined) {
    const chainId =
      typeof chainId_ === 'string' ? Hex.toNumber(chainId_) : chainId_
    return Porto_internal.getClient({ _internal: parameters }, { chainId })
  }

  const preparedAccounts_internal: Account.Account[] = []

  const emitter = ox_Provider.createEmitter()
  const provider = ox_Provider.from({
    ...emitter,
    async request(request_) {
      let request: RpcRequest.parseRequest.ReturnType
      try {
        request = RpcRequest.parseRequest(request_)
      } catch (e) {
        const unsupportedCode = 62
        if ((e as any).error?.type !== unsupportedCode) throw e

        // catch unsupported methods
        if ((request_ as { method: string }).method.startsWith('wallet_'))
          throw new ox_Provider.UnsupportedMethodError()
        return getClient().request(request_ as any)
      }

      const state = store.getState()

      switch (request.method) {
        case 'experimental_addFunds': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const { address, value, token } = request.params[0] ?? {}

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient()

          return await getMode().actions.addFunds({
            address: account.address,
            internal: {
              client,
              config,
              request,
              store,
            },
            token,
            value: value ? Hex.toBigInt(value) : undefined,
          })
        }

        case 'eth_accounts': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()
          return state.accounts.map(
            (account) => account.address,
          ) satisfies Typebox.Static<typeof Rpc.eth_accounts.Response>
        }

        case 'eth_chainId': {
          return Hex.fromNumber(state.chainId) satisfies Typebox.Static<
            typeof Rpc.eth_chainId.Response
          >
        }

        case 'eth_requestAccounts': {
          if (state.accounts.length > 0)
            return state.accounts.map(
              (account) => account.address,
            ) satisfies Typebox.Static<typeof Rpc.eth_requestAccounts.Response>

          const client = getClient()

          const { accounts } = await getMode().actions.loadAccounts({
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
          ) satisfies Typebox.Static<typeof Rpc.eth_requestAccounts.Response>
        }

        case 'eth_sendTransaction': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ capabilities, chainId, data = '0x', from, to, value }] =
            request._decoded.params

          const client = getClient(chainId)

          if (chainId && chainId !== client.chain.id)
            throw new ox_Provider.ChainDisconnectedError()

          const account = from
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, from),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const { id } = await getMode().actions.sendCalls({
            account,
            calls: [
              {
                data,
                to,
                value,
              },
            ],
            internal: {
              client,
              config,
              request,
              store,
            },
            preCalls: capabilities?.preCalls as any,
          })

          return id satisfies Typebox.Static<
            typeof Rpc.eth_sendTransaction.Response
          >
        }

        case 'eth_signTypedData_v4': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [address, data] = request._decoded.params

          const account = state.accounts.find((account) =>
            Address.isEqual(account.address, address),
          )
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient()

          const signature = await getMode().actions.signTypedData({
            account,
            data,
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          return signature satisfies Typebox.Static<
            typeof Rpc.eth_signTypedData_v4.Response
          >
        }

        case 'experimental_grantAdmin': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ address, capabilities, chainId, key: keyToAuthorize }] =
            request._decoded.params ?? [{}]

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient(chainId)

          const keyExists = getAdmins([...(account.keys ?? [])])?.some(
            (key) =>
              key.publicKey?.toLowerCase() ===
              keyToAuthorize.publicKey.toLowerCase(),
          )
          if (keyExists)
            throw new RpcResponse.InvalidParamsError({
              message: 'Key already granted as admin.',
            })

          const { key } = await getMode().actions.grantAdmin({
            account,
            feeToken: capabilities?.feeToken,
            internal: {
              client,
              config,
              request,
              store,
            },
            key: keyToAuthorize,
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

          const admins = getAdmins([...(account.keys ?? []), key])

          emitter.emit('message', {
            data: admins,
            type: 'adminsChanged',
          })

          return Typebox.Encode(Rpc.experimental_grantAdmin.Response, {
            address: account.address,
            chainId: Hex.fromNumber(client.chain.id),
            key: admins.at(-1)!,
          } satisfies Rpc.experimental_grantAdmin.Response) satisfies Typebox.Static<
            typeof Rpc.experimental_grantAdmin.Response
          >
        }

        case 'experimental_grantPermissions': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ address, chainId, ...permissions }] = request._decoded
            .params ?? [{}]

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient(chainId)

          const { key, preCalls } = await getMode().actions.grantPermissions({
            account,
            internal: {
              client,
              config,
              request,
              store,
            },
            permissions,
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

          return Typebox.Encode(Rpc.experimental_grantPermissions.Response, {
            ...Permissions.fromKey(key, {
              address: account.address,
            }),
            chainId: client.chain.id,
            ...(preCalls
              ? {
                  capabilities: {
                    preCalls,
                  },
                }
              : {}),
          } satisfies Rpc.experimental_grantPermissions.Response) satisfies Typebox.Static<
            typeof Rpc.experimental_grantPermissions.Response
          >
        }

        case 'experimental_createAccount': {
          const [{ chainId, label }] = request._decoded.params ?? [{}]

          const client = getClient(chainId)

          const { account, preCalls } = await getMode().actions.createAccount({
            internal: {
              client,
              config,
              request,
              store,
            },
            label,
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
              admins: getAdmins(account.keys ?? []),
              ...(permissions.length > 0 ? { permissions } : {}),
              preCalls,
            },
          } satisfies Typebox.Static<
            typeof Rpc.experimental_createAccount.Response
          >
        }

        case 'experimental_getAdmins': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ address }] = request._decoded.params ?? [{}]

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const keys = getAdmins(account.keys ?? [])

          return Typebox.Encode(Rpc.experimental_getAdmins.Response, {
            address: account.address,
            keys,
          } satisfies Rpc.experimental_getAdmins.Response) satisfies Typebox.Static<
            typeof Rpc.experimental_getAdmins.Response
          >
        }

        case 'experimental_prepareUpgradeAccount': {
          const [{ address, capabilities, chainId, label }] = request._decoded
            .params ?? [{}]

          const { grantPermissions: permissions } = capabilities ?? {}

          const client = getClient(chainId)

          const { context, signPayloads } =
            await getMode().actions.prepareUpgradeAccount({
              address,
              feeToken: capabilities?.feeToken,
              internal: {
                client,
                config,
                request,
                store,
              },
              label,
              permissions,
            })

          preparedAccounts_internal.push((context as any).account)

          return {
            context,
            signPayloads: signPayloads.map((x) => x as never),
          } satisfies Typebox.Static<
            typeof Rpc.experimental_prepareUpgradeAccount.Response
          >
        }

        case 'experimental_getAccountVersion': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ address }] = request._decoded.params ?? [{}]

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient()

          const { current, latest } = await getMode().actions.getAccountVersion(
            {
              address: account.address,
              internal: {
                client,
                config,
                request,
                store,
              },
            },
          )

          return {
            current,
            latest,
          } satisfies Typebox.Static<
            typeof Rpc.experimental_getAccountVersion.Response
          >
        }

        case 'experimental_getPermissions': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ address }] = request._decoded.params ?? [{}]

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]

          return getActivePermissions(account?.keys ?? [], {
            address: account!.address,
          })
        }

        case 'experimental_revokeAdmin': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ address, capabilities, id }] = request._decoded.params

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient()

          await getMode().actions.revokeAdmin({
            account,
            feeToken: capabilities?.feeToken,
            id,
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          const keys = account.keys?.filter(
            (key) => key.publicKey !== id && key.id !== id,
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
            data: getAdmins(keys ?? []),
            type: 'adminsChanged',
          })

          return
        }

        case 'experimental_revokePermissions': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ address, capabilities, id }] = request._decoded.params

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient()

          await getMode().actions.revokePermissions({
            account,
            feeToken: capabilities?.feeToken,
            id,
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          const keys = account.keys?.filter(
            (key) => key.publicKey !== id && key.id !== id,
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
            data: getActivePermissions(keys ?? [], {
              address: account.address,
            }),
            type: 'permissionsChanged',
          })

          return
        }

        case 'experimental_updateAccount': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [{ address }] = request._decoded.params ?? [{}]

          const account = address
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, address),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient()

          const { id } = await getMode().actions.updateAccount({
            account,
            internal: { client, config, request, store },
          })

          return { id } satisfies Typebox.Static<
            typeof Rpc.experimental_updateAccount.Response
          >
        }

        case 'experimental_upgradeAccount': {
          const [{ context, signatures }] = request._decoded.params ?? [{}]

          const client = getClient()

          const account_ = preparedAccounts_internal.find((account) =>
            Address.isEqual(account.address, (context as any).account.address),
          )
          if (!account_) throw new ox_Provider.UnauthorizedError()

          const { account } = await getMode().actions.upgradeAccount({
            account: account_,
            context,
            internal: {
              client,
              config,
              request,
              store,
            },
            signatures,
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
          } satisfies Typebox.Static<
            typeof Rpc.experimental_createAccount.Response
          >
        }

        case 'porto_ping': {
          return 'pong' satisfies Typebox.Static<typeof Rpc.porto_ping.Response>
        }

        case 'personal_sign': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [data, address] = request._decoded.params

          const account = state.accounts.find((account) =>
            Address.isEqual(account.address, address),
          )
          if (!account) throw new ox_Provider.UnauthorizedError()

          const client = getClient()

          const signature = await getMode().actions.signPersonalMessage({
            account,
            data,
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          return signature satisfies Typebox.Static<
            typeof Rpc.personal_sign.Response
          >
        }

        case 'wallet_connect': {
          const [{ capabilities }] = request._decoded.params ?? [{}]

          const client = getClient()

          const {
            createAccount,
            grantPermissions: permissions,
            selectAccount,
          } = capabilities ?? {}

          const internal = {
            client,
            config,
            request,
            store,
          }

          const { accounts, preCalls } = await (async () => {
            if (createAccount) {
              const { label = undefined } =
                typeof createAccount === 'object' ? createAccount : {}
              const { account, preCalls } =
                await getMode().actions.createAccount({
                  internal,
                  label,
                  permissions,
                })
              return { accounts: [account], preCalls }
            }
            const account = state.accounts[0]
            const { credentialId, keyId } = (() => {
              if (capabilities?.keyId && capabilities.credentialId)
                return {
                  credentialId: capabilities.credentialId,
                  keyId: capabilities.keyId,
                }
              if (selectAccount)
                return { credentialId: undefined, keyId: undefined }
              for (const key of account?.keys ?? []) {
                if (key.type === 'webauthn-p256' && key.role === 'admin')
                  return {
                    credentialId:
                      (key as any).credentialId ??
                      key.privateKey?.credential?.id,
                    keyId: key.id,
                  }
              }
              return { credentialId: undefined, keyId: undefined }
            })()
            const loadAccountsParams = {
              internal,
              permissions,
            }
            try {
              // try to restore from stored account (`keyId`/`credentialId`) to avoid multiple prompts
              return await getMode().actions.loadAccounts({
                credentialId,
                keyId,
                ...loadAccountsParams,
              })
            } catch (error) {
              if (error instanceof ox_Provider.UserRejectedRequestError)
                throw error

              // error with `keyId`/`credentialId` likely means one or both are stale, retry
              if (keyId && credentialId)
                return await getMode().actions.loadAccounts(loadAccountsParams)
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
                admins: account.keys ? getAdmins(account.keys) : [],
                permissions: account.keys
                  ? getActivePermissions(account.keys, {
                      address: account.address,
                    })
                  : [],
                preCalls,
              },
            })),
          } satisfies Typebox.Static<typeof Rpc.wallet_connect.Response>
        }

        case 'wallet_disconnect': {
          store.setState((x) => ({ ...x, accounts: [] }))
          emitter.emit('disconnect', new ox_Provider.DisconnectedError())
          return
        }

        case 'wallet_getCallsStatus': {
          const [id] = request._decoded.params ?? []

          const client = getClient()

          const response = await getMode().actions.getCallsStatus({
            id,
            internal: {
              client,
              config,
              request,
              store,
            },
          })

          return response satisfies Typebox.Static<
            typeof Rpc.wallet_getCallsStatus.Response
          >
        }

        case 'wallet_getCapabilities': {
          const value = {
            atomic: {
              status: 'supported',
            },
            feeToken: {
              supported: true,
            },
            permissions: {
              supported: true,
            },
          } as const

          const capabilities = {} as Record<Hex.Hex, typeof value>
          for (const chain of config.chains)
            capabilities[Hex.fromNumber(chain.id)] = value

          return capabilities satisfies Typebox.Static<
            typeof Rpc.wallet_getCapabilities.Response
          >
        }

        case 'wallet_prepareCalls': {
          const [parameters] = request._decoded.params
          const { calls, capabilities, chainId, key, from } = parameters

          const client = getClient(chainId)

          const account = from ?? state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          if (chainId && chainId !== client.chain.id)
            throw new ox_Provider.ChainDisconnectedError()

          const { signPayloads, ...rest } =
            await getMode().actions.prepareCalls({
              account: Account.from(account),
              calls,
              feeToken: capabilities?.feeToken,
              internal: {
                client,
                config,
                request,
                store,
              },
              key,
              preCalls: capabilities?.preCalls as any,
            })

          return Typebox.Encode(Rpc.wallet_prepareCalls.Response, {
            capabilities: rest.capabilities,
            chainId: Hex.fromNumber(client.chain.id),
            context: {
              ...rest.context,
              account: {
                address: rest.account.address,
              },
              calls: rest.context.calls,
              nonce: rest.context.nonce,
            },
            digest: signPayloads[0]!,
            key,
          }) satisfies Typebox.Static<typeof Rpc.wallet_prepareCalls.Response>
        }

        case 'wallet_sendPreparedCalls': {
          const [parameters] = request._decoded.params
          const { chainId, context, key, signature } = parameters
          const { account } = parameters.context

          const client = getClient(chainId)

          if (chainId && Hex.toNumber(chainId) !== client.chain.id)
            throw new ox_Provider.ChainDisconnectedError()

          const hash = await getMode().actions.sendPreparedCalls({
            account,
            context,
            internal: {
              client,
              config,
              request,
              store,
            },
            key,
            signature,
          })

          return [{ id: hash }] satisfies Typebox.Static<
            typeof Rpc.wallet_sendPreparedCalls.Response
          >
        }

        case 'wallet_sendCalls': {
          if (state.accounts.length === 0)
            throw new ox_Provider.DisconnectedError()

          const [parameters] = request._decoded.params
          const { calls, capabilities, chainId, from } = parameters

          const client = getClient(chainId)

          if (chainId && chainId !== client.chain.id)
            throw new ox_Provider.ChainDisconnectedError()

          const account = from
            ? state.accounts.find((account) =>
                Address.isEqual(account.address, from),
              )
            : state.accounts[0]
          if (!account) throw new ox_Provider.UnauthorizedError()

          const { id } = await getMode().actions.sendCalls({
            account,
            calls,
            feeToken: capabilities?.feeToken,
            internal: {
              client,
              config,
              request,
              store,
            },
            permissionsId: capabilities?.permissions?.id,
            preCalls: capabilities?.preCalls as any,
          })

          return { id } satisfies Typebox.Static<
            typeof Rpc.wallet_sendCalls.Response
          >
        }

        case 'wallet_verifySignature': {
          const [parameters] = request._decoded.params
          const { address, chainId, digest, signature } = parameters

          const client = getClient(chainId)

          const result = await Actions.verifySignature(client, {
            address,
            chainId,
            digest,
            signature,
          }).catch(async () => {
            const valid = await verifyHash(client, {
              address,
              hash: digest,
              signature,
            })
            return {
              proof: null,
              valid,
            }
          })

          return {
            ...result,
            address,
            chainId: Hex.fromNumber(client.chain.id),
          } satisfies Typebox.Static<typeof Rpc.wallet_verifySignature.Response>
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
      (state) => state.chainId,
      (chainId, previousChainId) => {
        if (chainId === previousChainId) return
        emitter.emit('chainChanged', Hex.fromNumber(chainId))
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
  > = Porto_internal.Internal<chains> & { store: Porto.Store }
}

function announce(provider: Provider) {
  if (typeof window === 'undefined' || !window.dispatchEvent) return () => {}
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

function getAdmins(
  keys: readonly Key.Key[],
): Typebox.Static<typeof Rpc.experimental_getAdmins.Response>['keys'] {
  return keys
    .map((key) => {
      if (key.role !== 'admin') return undefined
      try {
        return Typebox.Encode(
          Rpc.experimental_getAdmins.Response.properties.keys.items,
          {
            id: key.id ?? key.publicKey,
            publicKey: key.publicKey,
            type: key.type,
            ...(key.type === 'webauthn-p256'
              ? {
                  credentialId: key.privateKey?.credential?.id,
                }
              : {}),
          } satisfies Rpc.experimental_getAdmins.Response['keys'][number],
        )
      } catch {
        return undefined
      }
    })
    .filter(Boolean) as never
}

function getActivePermissions(
  keys: readonly Key.Key[],
  {
    address,
    chainId,
  }: { address: Address.Address; chainId?: number | undefined },
): Typebox.Static<typeof Rpc.experimental_getPermissions.Response> {
  return keys
    .map((key) => {
      if (key.role !== 'session') return undefined
      if (key.expiry > 0 && key.expiry < BigInt(Math.floor(Date.now() / 1000)))
        return undefined
      try {
        return Typebox.Encode(
          Permissions.Schema,
          Permissions.fromKey(key, { address, chainId }),
        )
      } catch {
        return undefined
      }
    })
    .filter(Boolean) as never
}
