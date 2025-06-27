import * as Address from 'ox/Address'
import * as Bytes from 'ox/Bytes'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as Provider from 'ox/Provider'
import * as PublicKey from 'ox/PublicKey'
import * as Secp256k1 from 'ox/Secp256k1'
import * as Siwe from 'ox/Siwe'
import * as TypedData from 'ox/TypedData'
import * as Value from 'ox/Value'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import { waitForCallsStatus } from 'viem/actions'
import * as Account from '../../../viem/Account.js'
import * as ContractActions from '../../../viem/ContractActions.js'
import * as ServerActions_internal from '../../../viem/internal/serverActions.js'
import * as Key from '../../../viem/Key.js'
import * as ServerActions from '../../../viem/ServerActions.js'
import type { ServerClient } from '../../../viem/ServerClient.js'
import * as Call from '../call.js'
import * as Mode from '../mode.js'
import * as PermissionsRequest from '../permissionsRequest.js'
import * as PreCalls from '../preCalls.js'
import type * as FeeToken from '../typebox/feeToken.js'
import * as U from '../utils.js'

export const defaultPermissionsFeeLimit = {
  ETH: '0.0001',
  USDC: '1',
  USDT: '1',
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

  let address_internal: Hex.Hex | undefined
  let email_internal: string | undefined

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
        const {
          admins,
          email,
          label,
          permissions,
          internal,
          signInWithEthereum,
        } = parameters
        const { client } = internal

        const eoa = Account.fromPrivateKey(Secp256k1.randomPrivateKey())

        const adminKey = !mock
          ? await Key.createWebAuthnP256({
              label:
                label ||
                `${eoa.address.slice(0, 8)}\u2026${eoa.address.slice(-6)}`,
              rpId: keystoreHost,
              userId: Bytes.from(eoa.address),
            })
          : Key.createHeadlessWebAuthnP256()
        const sessionKey = await PermissionsRequest.toKey(permissions)

        const adminKeys = admins?.map((admin) => Key.from(admin))

        const feeToken = await resolveFeeToken(internal, {
          permissionsFeeLimit,
        })

        const account = await ServerActions.upgradeAccount(client, {
          account: eoa,
          authorizeKeys: [
            adminKey,
            ...(adminKeys ?? []),
            ...(sessionKey ? [sessionKey] : []),
          ],
          feeToken: feeToken.address,
          permissionsFeeLimit: feeToken.permissionsFeeLimit,
        })

        address_internal = eoa.address

        if (email && label)
          await ServerActions.setEmail(client, {
            email: label,
            walletAddress: account.address,
          })

        const { message, signature } = await (async () => {
          if (!signInWithEthereum) return {}
          const message = Siwe.createMessage({
            ...signInWithEthereum,
            address: account.address,
          })
          return {
            message,
            signature: await Account.sign(eoa, {
              payload: PersonalMessage.getSignPayload(Hex.fromString(message)),
            }),
          }
        })()

        return {
          account: {
            ...account,
            signInWithEthereum: signature ? { message, signature } : undefined,
          },
        }
      },

      async getAccountVersion(parameters) {
        const { address, internal } = parameters
        const { client } = internal

        const { contracts } = await ServerActions.getCapabilities(client)
        const { accountImplementation } = contracts

        const latest = await ContractActions.getEip712Domain(client, {
          account: Account.from(accountImplementation),
        }).then((x) => x.version)

        const current = await ContractActions.getEip712Domain(client, {
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

        const result = await ServerActions_internal.getCallsStatus(client, {
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
          merchant: {
            supported: true,
          },
          permissions: {
            supported: true,
          },
        } as const

        const capabilities = await Promise.all(
          chainIds.map(async (chainId) => {
            const capabilities = await (async () => {
              try {
                return await ServerActions.getCapabilities(getClient(chainId), {
                  raw: true,
                })
              } catch {
                return null
              }
            })()
            if (!capabilities) return {}
            return {
              [chainId]: {
                ...base,
                feeToken: {
                  supported: true,
                  tokens: capabilities.fees.tokens,
                },
              },
            } as const
          }),
          // biome-ignore lint/performance/noAccumulatingSpread: _
        ).then((x) => x.reduce((acc, curr) => ({ ...acc, ...curr }), {}))

        return capabilities
      },

      async getKeys(parameters) {
        const { account, internal } = parameters
        const { client } = internal

        const keys = await ServerActions.getKeys(client, { account })

        return U.uniqBy(
          [...(account.keys ?? []), ...keys],
          (key) => key.publicKey,
        )
      },

      async grantAdmin(parameters) {
        const { account, internal } = parameters
        const { client } = internal

        const authorizeKey = Key.from(parameters.key)

        const feeToken = await resolveFeeToken(internal, parameters)
        const { id } = await ServerActions.sendCalls(client, {
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
        const { internal, permissions, signInWithEthereum } = parameters
        const {
          client,
          config: { storage },
        } = internal

        const feeToken = await resolveFeeToken(internal, {
          permissionsFeeLimit,
        })
        const authorizeKey = await PermissionsRequest.toKey(permissions)

        // Prepare calls to sign over the session key or SIWE message to authorize.
        const { context, digest, digestType } = await (async () => {
          if (authorizeKey) {
            const { context, digest } = await ServerActions.prepareCalls(
              client,
              {
                authorizeKeys: [authorizeKey],
                feeToken: feeToken.address,
                permissionsFeeLimit: feeToken.permissionsFeeLimit,
                preCalls: true,
              },
            )
            return { context, digest, digestType: 'precall' } as const
          }
          if (signInWithEthereum && parameters.address) {
            const message = Siwe.createMessage({
              ...signInWithEthereum,
              address: parameters.address,
            })
            return {
              context: undefined,
              digest: PersonalMessage.getSignPayload(Hex.fromString(message)),
              digestType: 'siwe',
            } as const
          }
          return { context: undefined, digest: '0x' } as const
        })()

        const { address, credentialId, webAuthnSignature } =
          await (async () => {
            if (mock) {
              if (!address_internal)
                throw new Error('address_internal not found.')
              return {
                address: address_internal,
                credentialId: undefined,
              } as const
            }

            // If the address and credentialId are provided, we can skip the
            // WebAuthn discovery step.
            if (parameters.address && parameters.credentialId)
              return {
                address: parameters.address,
                credentialId: parameters.credentialId,
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

            const address = Bytes.toHex(new Uint8Array(response.userHandle!))
            const credentialId = webAuthnSignature.raw.id

            return { address, credentialId, webAuthnSignature }
          })()

        const keys = await ServerActions.getKeys(client, { account: address })

        // Instantiate the account based off the extracted address and keys.
        const account = Account.from({
          address,
          keys: [...keys, ...(authorizeKey ? [authorizeKey] : [])].map(
            (key, i) => {
              // Assume that the first key is the admin WebAuthn key.
              if (i === 0) {
                if (key.type === 'webauthn-p256')
                  return Key.fromWebAuthnP256({
                    ...key,
                    credential: {
                      id: credentialId!,
                      publicKey: PublicKey.fromHex(key.publicKey),
                    },
                    id: address,
                  })
              }
              return key
            },
          ),
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

        const preCalls =
          context && signature && digestType === 'precall'
            ? [{ context, signature }]
            : []

        if (persistPreCalls)
          await PreCalls.add(preCalls, {
            address: account.address,
            storage,
          })

        const siweResult = await (async () => {
          if (!signInWithEthereum) return {}

          const message = Siwe.createMessage({
            ...signInWithEthereum,
            address: account.address,
          })

          // If we have a signature, we already signed over the digest.
          if (digestType === 'siwe' && signature) return { message, signature }

          return {
            message,
            signature: await Account.sign(account, {
              payload: PersonalMessage.getSignPayload(Hex.fromString(message)),
              role: 'admin',
            }),
          }
        })()

        return {
          accounts: [
            {
              ...account,
              signInWithEthereum: siweResult.signature ? siweResult : undefined,
            },
          ],
          preCalls,
        }
      },

      async prepareCalls(parameters) {
        const { account, calls, internal, key, merchantRpcUrl } = parameters
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

        const { capabilities, context, digest } =
          await ServerActions.prepareCalls(client, {
            account,
            calls,
            feeToken: feeToken.address,
            key,
            merchantRpcUrl,
            preCalls,
          })

        return {
          account,
          capabilities: {
            ...capabilities,
            quote: context.quote as any,
          },
          chainId: client.chain.id,
          context: {
            ...context,
            account,
            calls,
            nonce: context.quote?.intent!.nonce,
          },
          digest,
          key,
        }
      },

      async prepareUpgradeAccount(parameters) {
        const { address, email, label, internal, permissions } = parameters
        const { client } = internal

        const adminKey = !mock
          ? await Key.createWebAuthnP256({
              label:
                label || `${address.slice(0, 8)}\u2026${address.slice(-6)}`,
              rpId: keystoreHost,
              userId: Bytes.from(address),
            })
          : Key.createHeadlessWebAuthnP256()
        const sessionKey = await PermissionsRequest.toKey(permissions)

        const feeToken = await resolveFeeToken(internal, {
          permissionsFeeLimit,
        })

        const { context, digests } = await ServerActions.prepareUpgradeAccount(
          client,
          {
            address,
            authorizeKeys: [adminKey, ...(sessionKey ? [sessionKey] : [])],
            feeToken: feeToken.address,
            permissionsFeeLimit: feeToken.permissionsFeeLimit,
          },
        )

        if (email) email_internal = label

        return {
          context,
          digests,
        }
      },

      async revokeAdmin(parameters) {
        const { account, id, internal } = parameters
        const { client } = internal

        const key = account.keys?.find((key) => key.id === id)
        if (!key) return

        // Cannot revoke the only WebAuthn key left
        if (
          key.type === 'webauthn-p256' &&
          account.keys?.filter((key) => key.type === 'webauthn-p256').length ===
            1
        )
          throw new Error('revoke the only WebAuthn key left.')

        try {
          const feeToken = await resolveFeeToken(internal, parameters)
          const { id } = await ServerActions.sendCalls(client, {
            account,
            feeToken: feeToken.address,
            revokeKeys: [key],
          })
          await waitForCallsStatus(client, {
            id,
          })
        } catch (e) {
          const error = e as ServerActions.sendCalls.ErrorType
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

        const key = account.keys?.find((key) => key.id === id)
        if (!key) return

        // We shouldn't be able to revoke the admin keys.
        if (key.role === 'admin') throw new Error('cannot revoke admins.')

        try {
          const feeToken = await resolveFeeToken(internal, parameters)
          const { id } = await ServerActions.sendCalls(client, {
            account,
            feeToken: feeToken.address,
            revokeKeys: [key],
          })
          await waitForCallsStatus(client, {
            id,
          })
        } catch (e) {
          const error = e as ServerActions.sendCalls.ErrorType
          if (
            error.name === 'Rpc.ExecutionError' &&
            error.abiError?.name === 'KeyDoesNotExist'
          )
            return
          throw e
        }
      },

      async sendCalls(parameters) {
        const { account, calls, internal, merchantRpcUrl } = parameters
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
        const result = await ServerActions.sendCalls(client, {
          account,
          calls,
          feeToken: feeToken.address,
          key,
          merchantRpcUrl,
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

        const { id } = await ServerActions.sendPreparedCalls(client, {
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

        const { contracts } = await ServerActions.getCapabilities(client)
        const { accountImplementation } = contracts
        if (!accountImplementation)
          throw new Error('accountImplementation not found.')

        const feeToken = await resolveFeeToken(internal)

        return await ServerActions.sendCalls(client, {
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

        await ServerActions.upgradeAccount(client, {
          context: context as any,
          signatures,
        })

        if (email_internal)
          await ServerActions.setEmail(client, {
            email: email_internal,
            walletAddress: account.address,
          })

        return { account }
      },

      async verifyEmail(parameters) {
        const { account, chainId, email, token, internal, walletAddress } =
          parameters
        const { client } = internal

        // Only allow admin keys can sign message.
        const key = account.keys?.find(
          (key) => key.role === 'admin' && key.privateKey,
        )
        if (!key) throw new Error('cannot find admin key to sign with.')

        const signature = await Account.sign(account, {
          key,
          payload: Hash.keccak256(Hex.fromString(`${email}${token}`)),
        })

        return await ServerActions.verifyEmail(client, {
          chainId,
          email,
          signature,
          token,
          walletAddress,
        })
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
    permissionsFeeLimit?: Record<FeeToken.Kind, string> | undefined
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
  client: ServerClient,
  parameters: getAuthorizeKeyPreCalls.Parameters,
) {
  const { account, authorizeKey, feeToken } = parameters

  const adminKey = account.keys?.find(
    (key) => key.role === 'admin' && key.privateKey,
  )
  if (!adminKey) throw new Error('admin key not found.')

  const { context, digest } = await ServerActions.prepareCalls(client, {
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

export async function resolveFeeToken(
  internal: Mode.ActionsInternal,
  parameters?:
    | {
        feeToken?: FeeToken.Symbol | Address.Address | undefined
        permissionsFeeLimit?: Record<string, string> | undefined
      }
    | undefined,
) {
  const { client, store } = internal
  const { feeToken: defaultFeeToken } = store.getState()
  const { feeToken: overrideFeeToken } = parameters ?? {}

  const feeTokens = await ServerActions_internal.getCapabilities(client).then(
    (capabilities) => capabilities.fees.tokens,
  )
  let feeToken = feeTokens?.find((feeToken) => {
    if (overrideFeeToken) {
      if (Address.validate(overrideFeeToken))
        return Address.isEqual(feeToken.address, overrideFeeToken)
      return overrideFeeToken === feeToken.symbol
    }
    if (defaultFeeToken) return defaultFeeToken === feeToken.symbol
    return feeToken.symbol === 'ETH'
  })

  const permissionsFeeLimit = feeToken?.kind
    ? Value.from(
        parameters?.permissionsFeeLimit?.[feeToken.kind] ?? '0',
        feeToken.decimals,
      )
    : undefined

  if (!feeToken) {
    feeToken = feeTokens?.[0]!
    console.warn(
      `Fee token ${overrideFeeToken ?? defaultFeeToken} not found. Falling back to ${feeToken?.symbol} (${feeToken?.address}).`,
    )
  }
  return {
    address: feeToken!.address,
    decimals: feeToken!.decimals,
    permissionsFeeLimit,
    symbol: feeToken!.symbol,
  }
}
