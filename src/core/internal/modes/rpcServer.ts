import * as Address from 'ox/Address'
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
import * as RpcServer from '../../RpcServer.js'
import * as AccountContract from '../accountContract.js'
import * as Call from '../call.js'
import * as Mode from '../mode.js'
import * as PermissionsRequest from '../permissionsRequest.js'
import type { Client } from '../porto.js'
import * as PreCalls from '../preCalls.js'
import * as RpcServer_viem from '../viem/actions.js'

export const defaultPermissionsFeeLimit = {
  ETH: Value.fromEther('0.0001'),
  EXP: Value.fromEther('1'),
}

/**
 * Mode for a WebAuthn-based environment that interacts with the Porto
 * RPC Server. Account management, signing, and execution is coordinated
 * between the library and the RPC Server.
 *
 * @param parameters - Parameters.
 * @returns Mode.
 */
export function rpcServer(parameters: rpcServer.Parameters = {}) {
  const config = parameters
  const {
    mock,
    permissionsFeeLimit = defaultPermissionsFeeLimit,
    persistPreCalls = true,
  } = config

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

        const feeToken = await resolveFeeToken(internal, {
          permissionsFeeLimit,
        })
        const authorizeKey = await PermissionsRequest.toKey(permissions)

        const preCalls = authorizeKey
          ? // TODO(rpcServer): remove double webauthn sign.
            await getAuthorizeKeyPreCalls(client, {
              account,
              authorizeKey,
              feeToken,
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
        const { accountImplementation } = contracts

        const latest = await AccountContract.getEip712Domain(client, {
          account: accountImplementation,
        }).then((x) => x.version)

        const current = await AccountContract.getEip712Domain(client, {
          account: address,
        })
          .then((x) => x.version)
          // TODO: get counterfactual account version via rpc server.
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

      async getCapabilities(parameters) {
        const { chainIds, internal } = parameters
        const { getClient } = internal

        const base = {
          atomic: {
            status: 'supported',
          },
          feeToken: {
            supported: true,
            tokens: [],
          },
          permissions: {
            supported: true,
          },
          sponsor: {
            supported: true,
          },
        } as const

        const capabilities = await Promise.all(
          chainIds.map(async (chainId) => {
            const capabilities = await (async () => {
              try {
                return await RpcServer.getCapabilities(getClient(chainId), {
                  raw: true,
                })
              } catch (e) {
                return null
              }
            })()
            if (!capabilities) return {}
            return {
              [chainId]: {
                ...base,
                feeToken: {
                  supported: true,
                  tokens: capabilities.fees.tokens[chainId]!,
                },
              },
            } as const
          }),
          // biome-ignore lint/performance/noAccumulatingSpread:
        ).then((x) => x.reduce((acc, curr) => ({ ...acc, ...curr }), {}))

        return capabilities
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
        const { account, internal, permissions } = parameters
        const {
          client,
          config: { storage },
        } = internal

        const feeToken = await resolveFeeToken(internal, {
          permissionsFeeLimit,
        })

        // Parse permissions request into a structured key.
        const authorizeKey = await PermissionsRequest.toKey(permissions)
        if (!authorizeKey) throw new Error('key to authorize not found.')

        const preCalls = await getAuthorizeKeyPreCalls(client, {
          account,
          authorizeKey,
          feeToken,
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

        const feeToken = await resolveFeeToken(internal, {
          permissionsFeeLimit,
        })
        const authorizeKey = await PermissionsRequest.toKey(permissions)

        // Prepare calls to sign over the session key to authorize.
        const { context, digest } = authorizeKey
          ? await RpcServer.prepareCalls(client, {
              authorizeKeys: [authorizeKey],
              feeToken: feeToken.address,
              permissionsFeeLimit: feeToken.permissionsFeeLimit,
              preCalls: true,
            })
          : ({ context: undefined, digest: '0x' } as const)

        const { credentialId, keyId, webAuthnSignature } = await (async () => {
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

          // Discovery step. We need to do this to extract the key id
          // to query for the Account.
          // We will also optionally sign over a digest to authorize
          // a session key if the user has provided one.
          const webAuthnSignature = await WebAuthnP256.sign({
            challenge: digest,
            rpId: keystoreHost,
          })
          const response = webAuthnSignature.raw
            .response as AuthenticatorAssertionResponse

          const keyId = Bytes.toHex(new Uint8Array(response.userHandle!))
          const credentialId = webAuthnSignature.raw.id

          return { credentialId, keyId, webAuthnSignature }
        })()

        const accounts = await RpcServer.getAccounts(client, { keyId })
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

        // Get the signature of the authorize session key pre-call.
        const signature = await (async () => {
          // If we don't have a digest, we never signed over anything.
          if (digest === '0x') return undefined

          const adminKey = Account.getKey(account, { role: 'admin' })!

          // If we signed to authorize the session key at credential
          // discovery, we will need to form the signature and store it
          // as a signed pre-call.
          if (webAuthnSignature)
            return Key.wrapSignature(
              Key.serializeWebAuthnSignature(webAuthnSignature),
              {
                keyType: 'webauthn-p256',
                publicKey: adminKey.publicKey,
              },
            )

          // Otherwise, we will sign over the digest for authorizing
          // the session key.
          return await Key.sign(adminKey, {
            payload: digest,
          })
        })()

        const preCalls = context && signature ? [{ context, signature }] : []

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
        const { account, calls, internal, key, sponsorUrl } = parameters
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
            sponsorUrl,
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
            nonce: context.quote?.intent!.nonce,
          },
          key,
          signPayloads: [digest],
        }
      },

      async prepareUpgradeAccount(parameters) {
        const { address, internal, permissions } = parameters
        const { client } = internal

        const feeToken = await resolveFeeToken(internal, {
          ...parameters,
          permissionsFeeLimit,
        })

        const authorizeKey = await PermissionsRequest.toKey(permissions)
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
            permissionsFeeLimit: feeToken.permissionsFeeLimit,
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
        const { account, calls, internal, sponsorUrl } = parameters
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
          sponsorUrl,
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
        const { accountImplementation } = contracts
        if (!accountImplementation)
          throw new Error('accountImplementation not found.')

        const feeToken = await resolveFeeToken(internal)

        return await RpcServer.sendCalls(client, {
          account,
          calls: [
            Call.upgradeProxyAccount({
              address: accountImplementation.address,
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
  })
}

export declare namespace rpcServer {
  type Parameters = {
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
     * Fee limit to use for permissions.
     */
    permissionsFeeLimit?: Record<string, bigint> | undefined
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
    feeToken: feeToken.address,
    key: adminKey,
    permissionsFeeLimit: feeToken.permissionsFeeLimit,
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
    feeToken: {
      address: Address.Address
      permissionsFeeLimit?: bigint | undefined
    }
  }
}

async function resolveFeeToken(
  internal: Mode.ActionsInternal,
  parameters?:
    | {
        feeToken?: Address.Address | undefined
        permissionsFeeLimit?: Record<string, bigint> | undefined
      }
    | undefined,
) {
  const { client, store } = internal
  const { chain } = client
  const { feeToken: defaultFeeToken } = store.getState()
  const { feeToken: address } = parameters ?? {}

  const chainId = Hex.fromNumber(chain.id)

  const feeTokens = await RpcServer_viem.getCapabilities(client).then(
    (capabilities) => capabilities.fees.tokens[chainId],
  )
  const feeToken = feeTokens?.find((feeToken) => {
    if (address) return Address.isEqual(feeToken.address, address)
    if (defaultFeeToken) return defaultFeeToken === feeToken.symbol
    return feeToken.symbol === 'ETH'
  })

  const permissionsFeeLimit = feeToken?.symbol
    ? parameters?.permissionsFeeLimit?.[feeToken.symbol]
    : undefined

  if (!feeToken)
    throw new Error(
      `fee token ${address ?? defaultFeeToken} not found. Available: ${feeTokens?.map((x) => `${x.symbol} (${x.address})`).join(', ')}`,
    )
  return {
    address: feeToken.address,
    decimals: feeToken.decimals,
    permissionsFeeLimit,
    symbol: feeToken.symbol,
  }
}
