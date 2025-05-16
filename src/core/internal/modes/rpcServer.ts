import type * as Address from 'ox/Address'
import * as Bytes from 'ox/Bytes'
import * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as Provider from 'ox/Provider'
import * as PublicKey from 'ox/PublicKey'
import * as TypedData from 'ox/TypedData'
import * as Value from 'ox/Value'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import { waitForCallsStatus } from 'viem/actions'
import * as Account from '../../Account.js'
import * as Key from '../../Key.js'
import type * as Porto from '../../Porto.js'
import * as RpcServer from '../../RpcServer.js'
import * as Call from '../call.js'
import * as Delegation from '../delegation.js'
import * as Mode from '../mode.js'
import * as PermissionsRequest from '../permissionsRequest.js'
import type { Client } from '../porto.js'
import * as PreCalls from '../preCalls.js'
import * as RpcServer_viem from '../viem/actions.js'

export const defaultConfig = {
  feeToken: 'EXP',
  permissionFeeSpendLimit: {
    ETH: {
      limit: Value.fromEther('0.0001'),
      period: 'day',
    },
    EXP: {
      limit: Value.fromEther('5'),
      period: 'day',
    },
    EXP1: {
      limit: Value.fromEther('5'),
      period: 'day',
    },
  },
} as const satisfies rpcServer.Parameters

/**
 * Mode for a WebAuthn-based environment that interacts with the Porto
 * RPC Server. Account management, signing, and execution is coordinated
 * between the library and the RPC Server.
 *
 * @param parameters - Parameters.
 * @returns Mode.
 */
export function rpcServer(parameters: rpcServer.Parameters = {}) {
  const config = { ...defaultConfig, ...parameters }
  const { mock, persistPreCalls = true } = config

  let id_internal: Hex.Hex | undefined

  const keystoreHost = (() => {
    if (config.keystoreHost === 'self') return undefined
    if (
      typeof window !== 'undefined' &&
      window.location.hostname === 'localhost'
    )
      return undefined
    return config.keystoreHost
  })()

  return Mode.from({
    actions: {
      async addFunds() {
        throw new Provider.UnsupportedMethodError()
      },

      async createAccount(parameters) {
        const { internal, permissions } = parameters
        const { client } = parameters.internal
        const { storage } = internal.config

        let id: Hex.Hex | undefined
        const account = await RpcServer.createAccount(client, {
          async keys({ ids }) {
            id = ids[0]!
            const label = parameters.label ?? 'Porto Account'

            const key = !mock
              ? await Key.createWebAuthnP256({
                  label,
                  rpId: keystoreHost,
                  userId: Bytes.from(id),
                })
              : Key.createHeadlessWebAuthnP256()

            return [key]
          },
        })

        if (id) id_internal = id

        const feeToken = await resolveFeeToken(internal)
        const authorizeKey = await PermissionsRequest.toKey(permissions, {
          feeToken,
        })

        const preCalls = authorizeKey
          ? // TODO(rpcServer): remove double webauthn sign.
            await getAuthorizeKeyPreCalls(client, {
              account,
              authorizeKey,
              feeToken: feeToken.address,
            })
          : []
        if (persistPreCalls)
          await PreCalls.add(preCalls, {
            address: account.address,
            storage,
          })

        return {
          account: Account.from({
            ...account,
            keys: [...account.keys, ...(authorizeKey ? [authorizeKey] : [])],
          }),
          preCalls,
        }
      },

      async getAccountVersion(parameters) {
        const { address, internal } = parameters
        const { client } = internal

        const { contracts } = await RpcServer.getCapabilities(client)
        const { delegationImplementation } = contracts

        const latest = await Delegation.getEip712Domain(client, {
          account: delegationImplementation,
        }).then((x) => x.version)

        const current = await Delegation.getEip712Domain(client, {
          account: address,
        })
          .then((x) => x.version)
          // TODO: get counterfactual account delegation via rpc server.
          .catch(() => latest)

        if (!current || !latest) throw new Error('version not found.')

        return { current, latest }
      },

      async getCallsStatus(parameters) {
        const { id, internal } = parameters
        const { client } = internal

        const result = await RpcServer_viem.getCallsStatus(client, {
          id,
        })

        return {
          atomic: true,
          chainId: Hex.fromNumber(client.chain.id),
          id,
          receipts: result.receipts?.map((receipt) => ({
            blockHash: receipt.blockHash,
            blockNumber: Hex.fromNumber(receipt.blockNumber),
            gasUsed: Hex.fromNumber(receipt.gasUsed),
            logs: receipt.logs,
            status: receipt.status,
            transactionHash: receipt.transactionHash,
          })),
          status: result.status,
          version: '1.0',
        }
      },

      async grantAdmin(parameters) {
        const { account, internal } = parameters
        const { client } = internal

        const authorizeKey = Key.from(parameters.key)

        const feeToken = await resolveFeeToken(internal, parameters)
        const { id } = await RpcServer.sendCalls(client, {
          account,
          authorizeKeys: [authorizeKey],
          feeToken: feeToken.address,
        })
        await waitForCallsStatus(client, {
          id,
        })

        return { key: authorizeKey }
      },

      async grantPermissions(parameters) {
        const { account, permissions, internal } = parameters
        const {
          client,
          config: { storage },
        } = internal

        const feeToken = await resolveFeeToken(internal)

        // Parse permissions request into a structured key.
        const authorizeKey = await PermissionsRequest.toKey(permissions, {
          feeToken,
        })
        if (!authorizeKey) throw new Error('key to authorize not found.')

        const preCalls = await getAuthorizeKeyPreCalls(client, {
          account,
          authorizeKey,
          feeToken: feeToken.address,
        })
        if (persistPreCalls)
          await PreCalls.add(preCalls, {
            address: account.address,
            storage,
          })

        return { key: authorizeKey, preCalls }
      },

      async loadAccounts(parameters) {
        const { internal, permissions } = parameters
        const {
          client,
          config: { storage },
        } = internal

        const { credentialId, keyId } = await (async () => {
          if (mock) {
            if (!id_internal) throw new Error('id_internal not found.')
            return {
              credentialId: undefined,
              keyId: id_internal,
            } as const
          }

          // If the address and credentialId are provided, we can skip the
          // WebAuthn discovery step.
          if (parameters.keyId && parameters.credentialId)
            return {
              credentialId: parameters.credentialId,
              keyId: parameters.keyId,
            }

          // Discovery step. We will sign a random challenge. We need to do this
          // to extract the user id (ie. the address) to query for the Account's keys.
          const credential = await WebAuthnP256.sign({
            challenge: '0x',
            rpId: keystoreHost,
          })
          const response = credential.raw
            .response as AuthenticatorAssertionResponse

          const keyId = Bytes.toHex(new Uint8Array(response.userHandle!))
          const credentialId = credential.raw.id

          return { credentialId, keyId }
        })()

        const feeToken = await resolveFeeToken(internal)

        const [accounts, authorizeKey] = await Promise.all([
          RpcServer.getAccounts(client, { keyId }),
          PermissionsRequest.toKey(permissions, {
            feeToken,
          }),
        ])
        if (!accounts[0]) throw new Error('account not found')

        // Instantiate the account based off the extracted address and keys.
        const account = Account.from({
          ...accounts[0],
          keys: [
            ...accounts[0].keys,
            ...(authorizeKey ? [authorizeKey] : []),
          ].map((key, i) => {
            // Assume that the first key is the admin WebAuthn key.
            if (i === 0) {
              if (key.type === 'webauthn-p256')
                return Key.fromWebAuthnP256({
                  ...key,
                  credential: {
                    id: credentialId!,
                    publicKey: PublicKey.fromHex(key.publicKey),
                  },
                  id: keyId,
                })
            }
            return key
          }),
        })

        const preCalls = authorizeKey
          ? await getAuthorizeKeyPreCalls(client, {
              account,
              authorizeKey,
              feeToken: feeToken.address,
            })
          : []
        if (persistPreCalls)
          await PreCalls.add(preCalls, {
            address: account.address,
            storage,
          })

        return {
          accounts: [account],
          preCalls,
        }
      },

      async prepareCalls(parameters) {
        const { account, calls, internal, key } = parameters
        const {
          client,
          config: { storage },
        } = internal

        // Get pre-authorized keys to assign to the call bundle.
        const preCalls =
          parameters.preCalls ??
          (await PreCalls.get({
            address: account.address,
            storage,
          }))

        const feeToken = await resolveFeeToken(internal, parameters)

        const { capabilities, context, digest } = await RpcServer.prepareCalls(
          client,
          {
            account,
            calls,
            feeToken: feeToken.address,
            key,
            preCalls,
          },
        )

        return {
          account,
          capabilities: {
            ...capabilities,
            quote: context.quote as any,
          },
          context: {
            ...context,
            account,
            calls,
            nonce: context.quote?.op!.nonce,
          },
          key,
          signPayloads: [digest],
        }
      },

      async prepareUpgradeAccount(parameters) {
        const { address, internal, permissions } = parameters
        const { client } = internal

        const feeToken = await resolveFeeToken(internal, parameters)

        const authorizeKey = await PermissionsRequest.toKey(permissions, {
          feeToken,
        })
        const { context, digests } = await RpcServer.prepareUpgradeAccount(
          client,
          {
            address,
            feeToken: feeToken.address,
            async keys({ ids }) {
              const id = ids[0]!
              const label = parameters.label ?? 'Porto Account'

              const key = !mock
                ? await Key.createWebAuthnP256({
                    label,
                    rpId: keystoreHost,
                    userId: Bytes.from(id),
                  })
                : Key.createHeadlessWebAuthnP256()

              return [key, ...(authorizeKey ? [authorizeKey] : [])]
            },
          },
        )

        return {
          context,
          signPayloads: digests,
        }
      },

      async revokeAdmin(parameters) {
        const { account, id, internal } = parameters
        const { client } = internal

        const key = account.keys?.find(
          (key) => key.publicKey === id || key.id === id,
        )
        if (!key) return

        try {
          const feeToken = await resolveFeeToken(internal, parameters)
          const { id } = await RpcServer.sendCalls(client, {
            account,
            feeToken: feeToken.address,
            revokeKeys: [key],
          })
          await waitForCallsStatus(client, {
            id,
          })
        } catch (e) {
          const error = e as RpcServer.sendCalls.ErrorType
          if (
            error.name === 'Rpc.ExecutionError' &&
            error.abiError?.name === 'KeyDoesNotExist'
          )
            return
          throw e
        }
      },

      async revokePermissions(parameters) {
        const { account, id, internal } = parameters
        const { client } = internal

        const key = account.keys?.find(
          (key) => key.publicKey === id || key.id === id,
        )
        if (!key) return

        // We shouldn't be able to revoke the admin keys.
        if (key.role === 'admin') throw new Error('cannot revoke admins.')

        try {
          const feeToken = await resolveFeeToken(internal, parameters)
          const { id } = await RpcServer.sendCalls(client, {
            account,
            feeToken: feeToken.address,
            revokeKeys: [key],
          })
          await waitForCallsStatus(client, {
            id,
          })
        } catch (e) {
          const error = e as RpcServer.sendCalls.ErrorType
          if (
            error.name === 'Rpc.ExecutionError' &&
            error.abiError?.name === 'KeyDoesNotExist'
          )
            return
          throw e
        }
      },

      async sendCalls(parameters) {
        const { account, calls, internal } = parameters
        const {
          client,
          config: { storage },
        } = internal

        // Try and extract an authorized key to sign the calls with.
        const key = await Mode.getAuthorizedExecuteKey({
          account,
          calls,
          permissionsId: parameters.permissionsId,
        })

        // Get pre-authorized keys to assign to the call bundle.
        const preCalls =
          parameters.preCalls ??
          (await PreCalls.get({
            address: account.address,
            storage,
          }))

        // Resolve fee token to use.
        const feeToken = await resolveFeeToken(internal, parameters)

        // Execute the calls (with the key if provided, otherwise it will
        // fall back to an admin key).
        const result = await RpcServer.sendCalls(client, {
          account,
          calls,
          feeToken: feeToken.address,
          key,
          preCalls,
        })

        await PreCalls.clear({
          address: account.address,
          storage,
        })

        return result
      },

      async sendPreparedCalls(parameters) {
        const { context, key, internal, signature } = parameters
        const {
          client,
          config: { storage },
        } = internal

        const { id } = await RpcServer.sendCalls(client, {
          context: context as never,
          key,
          signature,
        })

        if ((context?.account as any)?.address)
          await PreCalls.clear({
            address: (context.account as any).address,
            storage,
          })

        return id
      },

      async signPersonalMessage(parameters) {
        const { account, data } = parameters

        // Only admin keys can sign personal messages.
        const key = account.keys?.find(
          (key) => key.role === 'admin' && key.privateKey,
        )
        if (!key) throw new Error('cannot find admin key to sign with.')

        const signature = await Account.sign(account, {
          key,
          payload: PersonalMessage.getSignPayload(data),
        })

        return signature
      },

      async signTypedData(parameters) {
        const { account, data } = parameters

        // Only admin keys can sign typed data.
        const key = account.keys?.find(
          (key) => key.role === 'admin' && key.privateKey,
        )
        if (!key) throw new Error('cannot find admin key to sign with.')

        const signature = await Account.sign(account, {
          key,
          payload: TypedData.getSignPayload(Json.parse(data)),
        })

        return signature
      },

      async updateAccount(parameters) {
        const { account, internal } = parameters
        const {
          client,
          config: { storage: _ },
        } = internal

        const key = account.keys?.find(
          (key) => key.role === 'admin' && key.privateKey,
        )
        if (!key) throw new Error('admin key not found.')

        const { contracts } = await RpcServer.getCapabilities(client)
        const { delegationImplementation: delegation } = contracts
        if (!delegation) throw new Error('delegation not found.')

        const feeToken = await resolveFeeToken(internal)

        return await RpcServer.sendCalls(client, {
          account,
          calls: [
            Call.upgradeProxyDelegation({
              delegation,
              to: account.address,
            }),
          ],
          feeToken: feeToken.address,
          key,
        })
      },

      async upgradeAccount(parameters) {
        const { account, context, internal, signatures } = parameters
        const { client } = internal

        await RpcServer.upgradeAccount(client, {
          context: context as any,
          signatures,
        })

        return { account }
      },
    },
    name: 'rpc',
    setup(parameters) {
      const { internal } = parameters
      const { store } = internal
      const { feeToken = 'ETH', permissionFeeSpendLimit } = config

      function setState() {
        store.setState((x) => ({
          ...x,
          feeToken,
          permissionFeeSpendLimit,
        }))
      }

      if (store.persist.hasHydrated()) setState()
      else store.persist.onFinishHydration(() => setState())

      return () => {}
    },
  })
}

export declare namespace rpcServer {
  type Parameters = {
    /**
     * Fee token to use by default (e.g. "USDC", "ETH").
     * @default "ETH"
     */
    feeToken?: Porto.State['feeToken'] | undefined
    /**
     * Keystore host (WebAuthn relying party).
     * @default 'self'
     */
    keystoreHost?: 'self' | (string & {}) | undefined
    /**
     * Mock mode. Testing purposes only.
     * @default false
     * @internal @deprecated
     */
    mock?: boolean | undefined
    /**
     * Spending limit to pay for fees on permissions.
     */
    permissionFeeSpendLimit?: Porto.State['permissionFeeSpendLimit'] | undefined
    /**
     * Whether to store pre-calls in a persistent storage.
     *
     * If this is set to `false`, it is expected that the consumer
     * will manually store pre-calls, and provide them to actions
     * that support a `preCalls` parameter.
     *
     * @default true
     */
    persistPreCalls?: boolean | undefined
  }
}

async function resolveFeeToken(
  internal: Mode.ActionsInternal,
  parameters?:
    | {
        feeToken?: Address.Address | undefined
      }
    | undefined,
) {
  const { client, store } = internal
  const { chain } = client
  const { feeToken: defaultFeeToken, permissionFeeSpendLimit } =
    store.getState()
  const { feeToken: address } = parameters ?? {}

  const chainId = Hex.fromNumber(chain.id)

  const feeTokens = await RpcServer_viem.getCapabilities(client).then(
    (capabilities) => capabilities.fees.tokens[chainId],
  )
  const feeToken = feeTokens?.find((feeToken) => {
    if (address) return feeToken.address === address
    if (defaultFeeToken) return defaultFeeToken === feeToken.symbol
    return feeToken.symbol === 'ETH'
  })

  const permissionSpendLimit = feeToken?.symbol
    ? permissionFeeSpendLimit?.[feeToken.symbol]
    : undefined

  if (!feeToken)
    throw new Error(
      `fee token ${address ?? defaultFeeToken} not found. Available: ${feeTokens?.map((x) => `${x.symbol} (${x.address})`).join(', ')}`,
    )
  return {
    address: feeToken.address,
    decimals: feeToken.decimals,
    permissionSpendLimit,
    symbol: feeToken.symbol,
  }
}

async function getAuthorizeKeyPreCalls(
  client: Client,
  parameters: getAuthorizeKeyPreCalls.Parameters,
) {
  const { account, authorizeKey, feeToken } = parameters

  const adminKey = account.keys?.find(
    (key) => key.role === 'admin' && key.privateKey,
  )
  if (!adminKey) throw new Error('admin key not found.')

  const { context, digest } = await RpcServer.prepareCalls(client, {
    account,
    authorizeKeys: [authorizeKey],
    feeToken,
    key: adminKey,
    preCalls: true,
  })
  const signature = await Key.sign(adminKey, {
    payload: digest,
  })

  return [{ context, signature }] satisfies PreCalls.PreCalls
}

namespace getAuthorizeKeyPreCalls {
  export type Parameters = {
    account: Account.Account
    authorizeKey: Key.Key
    feeToken?: Address.Address | undefined
  }
}
