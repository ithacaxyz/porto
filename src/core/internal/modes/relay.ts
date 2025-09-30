import * as Bytes from 'ox/Bytes'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as Provider from 'ox/Provider'
import * as PublicKey from 'ox/PublicKey'
import * as RpcResponse from 'ox/RpcResponse'
import * as Secp256k1 from 'ox/Secp256k1'
import * as TypedData from 'ox/TypedData'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import { waitForCallsStatus } from 'viem/actions'
import * as Account from '../../../viem/Account.js'
import * as ContractActions from '../../../viem/ContractActions.js'
import * as RelayActions_internal from '../../../viem/internal/relayActions.js'
import * as Key from '../../../viem/Key.js'
import * as RelayActions from '../../../viem/RelayActions.js'
import * as Erc8010 from '../erc8010.js'
import * as Mode from '../mode.js'
import * as PermissionsRequest from '../permissionsRequest.js'
import * as RequiredFunds from '../requiredFunds.js'
import * as Siwe from '../siwe.js'
import * as Tokens from '../tokens.js'
import * as U from '../utils.js'

/**
 * Mode for a WebAuthn-based environment that interacts with the Porto
 * Relay. Account management, signing, and execution is coordinated
 * between the library and the Relay.
 *
 * @param parameters - Parameters.
 * @returns Mode.
 */
export function relay(parameters: relay.Parameters = {}) {
  const config = parameters
  const { mock, multichain = true, webAuthn } = config

  let address_internal: Hex.Hex | undefined
  let email_internal: string | undefined

  const keystoreHost = (() => {
    if (config.keystoreHost === 'self') return undefined
    if (
      typeof window !== 'undefined' &&
      window.location?.hostname === 'localhost'
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

        const feeTokens = await Tokens.getTokens(client)

        const adminKey = !mock
          ? await Key.createWebAuthnP256({
              createFn: webAuthn?.createFn,
              label:
                label ||
                `${eoa.address.slice(0, 8)}\u2026${eoa.address.slice(-6)}`,
              rpId: keystoreHost,
              userId: Bytes.from(eoa.address),
            })
          : Key.createHeadlessWebAuthnP256()
        const sessionKey = await PermissionsRequest.toKey(permissions, {
          chainId: client.chain.id,
          feeTokens,
        })

        const adminKeys = admins?.map((admin) => Key.from(admin))

        const account = await RelayActions.upgradeAccount(client, {
          account: eoa,
          authorizeKeys: [
            adminKey,
            ...(adminKeys ?? []),
            ...(sessionKey ? [sessionKey] : []),
          ],
        })

        address_internal = eoa.address

        if (email && label)
          await RelayActions.setEmail(client, {
            email: label,
            walletAddress: account.address,
          })

        const signInWithEthereum_response = await (async () => {
          if (!signInWithEthereum) return undefined

          const message = await Siwe.buildMessage(client, signInWithEthereum, {
            address: account.address,
          })
          const signature = await Account.sign(eoa, {
            payload: PersonalMessage.getSignPayload(Hex.fromString(message)),
          })
          const signature_erc8010 = await Erc8010.wrap(client, {
            address: account.address,
            signature,
          })

          return { message, signature: signature_erc8010 }
        })()

        return {
          account: {
            ...account,
            signInWithEthereum: signInWithEthereum_response,
          },
        }
      },

      async getAccountVersion(parameters) {
        const { address, internal } = parameters
        const { client } = internal

        const { contracts } = await RelayActions.getCapabilities(client)
        const { accountImplementation } = contracts

        const latest = await ContractActions.getEip712Domain(client, {
          account: Account.from(accountImplementation),
        }).then((x) => x.version)

        const current = await ContractActions.getEip712Domain(client, {
          account: address,
        })
          .then((x) => x.version)
          // TODO: get counterfactual account version via Relay.
          .catch(() => latest)

        if (!current || !latest) throw new Error('version not found.')

        return { current, latest }
      },

      async getAssets(parameters) {
        const { account, chainFilter, assetFilter, assetTypeFilter, internal } =
          parameters
        const { client } = internal

        const result = await RelayActions.getAssets(client, {
          account,
          assetFilter,
          assetTypeFilter,
          chainFilter,
        })

        return result
      },

      async getCallsStatus(parameters) {
        const { id, internal } = parameters
        const { client } = internal

        const result = await RelayActions_internal.getCallsStatus(client, {
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
        const { client } = internal

        const base = {
          atomic: {
            status: 'supported',
          },
          atomicBatch: {
            supported: true,
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
          requiredFunds: {
            supported: Boolean(multichain),
            tokens: [],
          },
        } as const

        const capabilities = await RelayActions.getCapabilities(client, {
          chainIds: chainIds ? chainIds.map((id) => Hex.toNumber(id)) : 'all',
          raw: true,
        })

        return Object.entries(capabilities).reduce(
          (acc, [chainId, capabilities]) => ({
            // biome-ignore lint/performance/noAccumulatingSpread: _
            ...acc,
            [chainId]: {
              ...base,
              ...capabilities,
              feeToken: {
                supported: true,
                tokens: capabilities.fees.tokens,
              },
              requiredFunds: {
                supported: Boolean(multichain),
                tokens: multichain
                  ? capabilities.fees.tokens.filter((token) => token.interop)
                  : [],
              },
            },
          }),
          {} as Record<Hex.Hex, typeof base>,
        ) as Record<Hex.Hex, typeof base>
      },

      async getKeys(parameters) {
        const { account, chainIds, internal } = parameters
        const { client } = internal

        const keys = await RelayActions.getKeys(client, {
          account,
          chainIds,
        })

        return U.uniqBy(
          [...keys, ...(account.keys ?? [])],
          (key) => key.publicKey,
        )
      },

      async grantAdmin(parameters) {
        const { account, internal } = parameters
        const { client } = internal

        const authorizeKey = Key.from(parameters.key, {
          chainId: client.chain.id,
        })

        const feeToken = await Tokens.resolveFeeToken(client, {
          addressOrSymbol: parameters.feeToken,
          store: internal.store,
        })

        const { id } = await RelayActions.sendCalls(client, {
          account,
          authorizeKeys: [authorizeKey],
          feeToken: feeToken?.address,
          webAuthn,
        })
        await waitForCallsStatus(client, {
          id,
          pollingInterval: 500,
        })

        return { key: authorizeKey }
      },

      async grantPermissions(parameters) {
        const { account, internal, permissions } = parameters
        const { client } = internal

        const feeTokens = await Tokens.getTokens(client)

        // Parse permissions request into a structured key.
        const authorizeKey = await PermissionsRequest.toKey(permissions, {
          chainId: client.chain.id,
          feeTokens,
        })
        if (!authorizeKey) throw new Error('key to authorize not found.')

        const adminKey = account.keys?.find(
          (key) => key.role === 'admin' && key.privateKey,
        )
        if (!adminKey) throw new Error('admin key not found.')

        const { context, digest } = await RelayActions.prepareCalls(client, {
          account,
          authorizeKeys: [authorizeKey],
          key: adminKey,
          preCalls: true,
        })
        const signature = await Key.sign(adminKey, {
          address: null,
          payload: digest,
        })
        await RelayActions.sendPreparedCalls(client, {
          context,
          key: adminKey,
          signature,
        })

        return { key: authorizeKey }
      },

      async loadAccounts(parameters) {
        const { internal, permissions, signInWithEthereum } = parameters
        const { client } = internal

        const feeTokens = await Tokens.getTokens(client)

        const authorizeKey = await PermissionsRequest.toKey(permissions, {
          chainId: client.chain.id,
          feeTokens,
        })

        // Prepare calls to sign over the session key or SIWE message to authorize.
        // TODO: figure out with relay if we can prepare the "precall" here also.
        // prepareCalls requires the EOA address, but we don't know it here.
        const { digest, digestType, message } = await (async () => {
          if (signInWithEthereum && parameters.address) {
            const message = await Siwe.buildMessage(
              client,
              signInWithEthereum,
              {
                address: parameters.address,
              },
            )
            return {
              context: undefined,
              digest: PersonalMessage.getSignPayload(Hex.fromString(message)),
              digestType: 'siwe',
              message,
            } as const
          }
          return {
            context: undefined,
            digest: '0x',
            message: undefined,
          } as const
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
            if (parameters.address && parameters.key)
              return {
                address: parameters.address,
                credentialId: parameters.key.credentialId,
              }

            // Discovery step. We need to do this to extract the key id
            // to query for the Account.
            // We will also optionally sign over a digest to authorize
            // a session key if the user has provided one.
            const webAuthnSignature = await WebAuthnP256.sign({
              challenge: digest,
              getFn: webAuthn?.getFn,
              rpId: keystoreHost,
            })
            const response = webAuthnSignature.raw
              .response as AuthenticatorAssertionResponse

            const address = Bytes.toHex(new Uint8Array(response.userHandle!))
            const credentialId = webAuthnSignature.raw.id

            return { address, credentialId, webAuthnSignature }
          })()

        const keys = await RelayActions.getKeys(client, {
          account: address,
          chainIds: [client.chain.id],
        })

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
                    rpId: keystoreHost,
                  })
              }
              return key
            },
          ),
        })

        const adminKey = Account.getKey(account, { role: 'admin' })!

        // Get the signature of the authorize session key pre-call.
        const signature = await (async () => {
          // If we don't have a digest, we never signed over anything.
          if (digest === '0x') return undefined

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
            address: account.address,
            payload: digest,
          })
        })()

        // Prepare and send the authorize key pre-call.
        if (authorizeKey) {
          const { context, digest } = await RelayActions.prepareCalls(client, {
            account,
            authorizeKeys: [authorizeKey],
            preCalls: true,
          })
          const signature = await Key.sign(adminKey, {
            address: null,
            payload: digest,
          })
          await RelayActions.sendPreparedCalls(client, {
            context,
            key: adminKey,
            signature,
          })
        }

        const signInWithEthereum_response = await (async () => {
          if (!signInWithEthereum) return undefined

          if (digestType === 'siwe' && message && signature) {
            const signature_erc8010 = await Erc8010.wrap(client, {
              address: account.address,
              signature,
            })
            return { message, signature: signature_erc8010 }
          }

          {
            const message = await Siwe.buildMessage(
              client,
              signInWithEthereum,
              {
                address: account.address,
              },
            )
            const signature = await Account.sign(account, {
              payload: PersonalMessage.getSignPayload(Hex.fromString(message)),
              role: 'admin',
            })
            const signature_erc8010 = await Erc8010.wrap(client, {
              address: account.address,
              signature,
            })
            return {
              message,
              signature: signature_erc8010,
            }
          }
        })()

        return {
          accounts: [
            {
              ...account,
              signInWithEthereum: signInWithEthereum_response,
            },
          ],
        }
      },

      async prepareCalls(parameters) {
        const { account, calls, internal, merchantUrl } = parameters
        const { client } = internal

        // Try and extract an authorized key to sign the calls with.
        const key =
          parameters.key ??
          (await Mode.getAuthorizedExecuteKey({
            account,
            calls,
          }))
        if (!key) throw new Error('cannot find authorized key to sign with.')

        const [tokens, feeToken] = await Promise.all([
          Tokens.getTokens(client),
          Tokens.resolveFeeToken(client, {
            addressOrSymbol: parameters.feeToken,
            store: internal.store,
          }),
        ])

        const requiredFunds = RequiredFunds.toRelay(
          parameters.requiredFunds ?? [],
          {
            tokens,
          },
        )

        const { capabilities, context, digest, typedData } =
          await RelayActions.prepareCalls(client, {
            account,
            calls,
            feeToken: feeToken?.address,
            key,
            merchantUrl,
            requiredFunds: multichain ? requiredFunds : undefined,
          })

        const quotes = context.quote?.quotes ?? []
        const outputQuote = quotes[quotes.length - 1]

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
            nonce: outputQuote?.intent.nonce,
          },
          digest,
          key,
          typedData,
        }
      },

      async prepareUpgradeAccount(parameters) {
        const { address, email, label, internal, permissions } = parameters
        const { client } = internal

        const [tokens, feeToken] = await Promise.all([
          Tokens.getTokens(client),
          Tokens.resolveFeeToken(client, {
            store: internal.store,
          }),
        ])

        const adminKey = !mock
          ? await Key.createWebAuthnP256({
              createFn: webAuthn?.createFn,
              label:
                label || `${address.slice(0, 8)}\u2026${address.slice(-6)}`,
              rpId: keystoreHost,
              userId: Bytes.from(address),
            })
          : Key.createHeadlessWebAuthnP256()
        const sessionKey = await PermissionsRequest.toKey(permissions, {
          chainId: client.chain.id,
          feeTokens: tokens,
        })

        const { context, digests } = await RelayActions.prepareUpgradeAccount(
          client,
          {
            address,
            authorizeKeys: [adminKey, ...(sessionKey ? [sessionKey] : [])],
            feeToken: feeToken?.address,
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
          const feeToken = await Tokens.resolveFeeToken(client, {
            addressOrSymbol: parameters.feeToken,
            store: internal.store,
          })
          const { id } = await RelayActions.sendCalls(client, {
            account,
            feeToken: feeToken?.address,
            revokeKeys: [key],
            webAuthn,
          })
          await waitForCallsStatus(client, {
            id,
          })
        } catch (e) {
          const error = e as RelayActions.sendCalls.ErrorType
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
          const feeToken = await Tokens.resolveFeeToken(client, {
            addressOrSymbol: parameters.feeToken,
            store: internal.store,
          })
          const { id } = await RelayActions.sendCalls(client, {
            account,
            feeToken: feeToken?.address,
            revokeKeys: [key],
            webAuthn,
          })
          await waitForCallsStatus(client, {
            id,
          })
        } catch (e) {
          const error = e as RelayActions.sendCalls.ErrorType
          if (
            error.name === 'Rpc.ExecutionError' &&
            error.abiError?.name === 'KeyDoesNotExist'
          )
            return
          throw e
        }
      },

      async sendCalls(parameters) {
        const { account, asTxHash, calls, internal, merchantUrl } = parameters
        const { client } = internal

        // Try and extract an authorized key to sign the calls with.
        const key = await Mode.getAuthorizedExecuteKey({
          account,
          calls,
          permissionsId: parameters.permissionsId,
        })

        // Resolve fee token to use.
        const [tokens, feeToken] = await Promise.all([
          Tokens.getTokens(client),
          Tokens.resolveFeeToken(client, {
            addressOrSymbol: parameters.feeToken,
            store: internal.store,
          }),
        ])

        const requiredFunds = RequiredFunds.toRelay(
          parameters.requiredFunds ?? [],
          {
            tokens,
          },
        )

        // Execute the calls (with the key if provided, otherwise it will
        // fall back to an admin key).
        const result = await RelayActions.sendCalls(client, {
          account,
          calls,
          feeToken: feeToken?.address,
          key,
          merchantUrl,
          requiredFunds: multichain ? requiredFunds : undefined,
          webAuthn,
        })

        if (asTxHash) {
          const { id, receipts, status } = await waitForCallsStatus(client, {
            id: result.id,
            pollingInterval: 500,
          })
          if (!receipts?.[0]) {
            if (status === 'success')
              throw new Provider.UnknownBundleIdError({
                message: 'Call bundle with id: ' + id + ' not found.',
              })
            throw new RpcResponse.TransactionRejectedError({
              message: 'Transaction failed under call bundle id: ' + id + '.',
            })
          }
          return {
            id: receipts[0].transactionHash,
          }
        }

        return result
      },

      async sendPreparedCalls(parameters) {
        const { context, key, internal, signature } = parameters
        const { client } = internal

        const { id } = await RelayActions.sendPreparedCalls(client, {
          context: context as never,
          key,
          signature,
        })

        return id
      },

      async signPersonalMessage(parameters) {
        const { account, data, internal } = parameters
        const { client } = internal

        // Only admin keys can sign personal messages.
        const key = account.keys?.find(
          (key) => key.role === 'admin' && key.privateKey,
        )
        if (!key) throw new Error('cannot find admin key to sign with.')

        const signature = await Account.sign(account, {
          key,
          payload: PersonalMessage.getSignPayload(data),
          webAuthn,
        })

        return Erc8010.wrap(client, { address: account.address, signature })
      },

      async signTypedData(parameters) {
        const { account, internal } = parameters
        const { client } = internal

        // Only admin keys can sign typed data.
        const key = account.keys?.find(
          (key) => key.role === 'admin' && key.privateKey,
        )
        if (!key) throw new Error('cannot find admin key to sign with.')

        const data = Json.parse(parameters.data)
        const isOrchestrator = data.domain?.name === 'Orchestrator'
        const signature = await Account.sign(account, {
          key,
          payload: TypedData.getSignPayload(data),
          // If the domain is the Orchestrator, we don't need to replay-safe sign.
          replaySafe: !isOrchestrator,
          webAuthn,
        })

        return isOrchestrator
          ? signature
          : Erc8010.wrap(client, { address: account.address, signature })
      },

      async upgradeAccount(parameters) {
        const { account, context, internal, signatures } = parameters
        const { client } = internal

        await RelayActions.upgradeAccount(client, {
          context: context as any,
          signatures,
        })

        if (email_internal)
          await RelayActions.setEmail(client, {
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
          webAuthn,
        })

        return await RelayActions.verifyEmail(client, {
          chainId,
          email,
          signature,
          token,
          walletAddress,
        })
      },
    },
    config: parameters,
    name: 'rpc',
  })
}

export declare namespace relay {
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
     * Whether to support multichain.
     * @default true
     */
    multichain?: boolean | undefined
    /**
     * WebAuthn configuration.
     */
    webAuthn?:
      | {
          createFn?:
            | WebAuthnP256.createCredential.Options['createFn']
            | undefined
          getFn?: WebAuthnP256.sign.Options['getFn'] | undefined
        }
      | undefined
  }
}
