import { Provider } from 'ox'
import * as Address from 'ox/Address'
import * as Bytes from 'ox/Bytes'
import * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as PublicKey from 'ox/PublicKey'
import * as Secp256k1 from 'ox/Secp256k1'
import * as TypedData from 'ox/TypedData'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import { encodeFunctionData, parseAbi } from 'viem'
import { call, readContract } from 'viem/actions'
import * as Account from '../../../viem/Account.js'
import * as ContractActions from '../../../viem/ContractActions.js'
import * as Key from '../../../viem/Key.js'
import type { ServerClient } from '../../../viem/ServerClient.js'
import * as Call from '../call.js'
import * as Mode from '../mode.js'
import * as PermissionsRequest from '../permissionsRequest.js'
import * as Siwe from '../siwe.js'
import * as U from '../utils.js'

/**
 * Mode for a WebAuthn-based environment that interacts directly
 * to the account contract. Account management and signing is handled locally.
 *
 * @param parameters - Parameters.
 * @returns Mode.
 */
export function contract(parameters: contract.Parameters = {}) {
  const { mock } = parameters

  let address_internal: Address.Address | undefined

  const keystoreHost = (() => {
    if (parameters.keystoreHost === 'self') return undefined
    if (
      typeof window !== 'undefined' &&
      window.location.hostname === 'localhost'
    )
      return undefined
    return parameters.keystoreHost
  })()

  async function prepareUpgradeAccount(parameters: {
    address: Address.Address
    client: ServerClient
    label?: string | undefined
    keystoreHost?: string | undefined
    mock?: boolean | undefined
    permissions: PermissionsRequest.PermissionsRequest | undefined
  }) {
    const { address, client, keystoreHost, mock, permissions } = parameters

    const label =
      parameters.label || `${address.slice(0, 8)}\u2026${address.slice(-6)}`

    const key = !mock
      ? await Key.createWebAuthnP256({
          label,
          rpId: keystoreHost,
          userId: Bytes.from(address),
        })
      : Key.createHeadlessWebAuthnP256()

    const extraKey = await PermissionsRequest.toKey(permissions)

    const keys = [key, ...(extraKey ? [extraKey] : [])]

    const account = Account.from({
      address,
      keys,
    })

    const delegation = client.chain.contracts?.portoAccount?.address
    if (!delegation)
      throw new Error(
        `contract \`portoAccount\` not found on chain ${client.chain.name}.`,
      )

    const { digests, request } = await ContractActions.prepareExecute(client, {
      account,
      calls: Mode.getAuthorizeCalls(account.keys),
      delegation,
    })

    return {
      context: U.normalizeValue(request),
      digests: {
        auth: digests.auth!,
        exec: digests.exec,
      },
    }
  }

  return Mode.from({
    actions: {
      async addFunds() {
        throw new Provider.UnsupportedMethodError()
      },
      async createAccount(parameters) {
        const { label, internal, permissions, signInWithEthereum } = parameters
        const { client } = internal

        // Generate a random private key and derive the address.
        // The address here will be the address of the account.
        const privateKey = Secp256k1.randomPrivateKey()
        const address = Address.fromPublicKey(
          Secp256k1.getPublicKey({ privateKey }),
        )

        // Prepare the account for creation.
        const { context, digests } = await prepareUpgradeAccount({
          address,
          client,
          keystoreHost,
          label,
          mock,
          permissions,
        })

        // Assign any keys to the account and sign over the payloads
        // required for account creation (e.g. 7702 auth and/or account initdata).
        const account = Account.fromPrivateKey(privateKey, {
          keys: context.account.keys,
        })
        const [exec, auth] = await Promise.all([
          account.sign?.({
            hash: digests.exec,
          }),
          digests.auth
            ? account.sign?.({
                hash: digests.auth,
              })
            : undefined,
        ])
        const signatures = {
          auth,
          exec,
        }

        // Execute the account creation.
        // TODO: wait for tx to be included?
        await ContractActions.execute(client, {
          ...context,
          account,
          signatures,
          storage: internal.config.storage,
        })

        address_internal = account.address

        const { message, signature } = await (async () => {
          if (!signInWithEthereum) return {}
          const message = await Siwe.buildMessage(client, signInWithEthereum, {
            address: account.address,
          })
          return {
            message,
            signature: await Account.sign(account, {
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

        const delegation = client.chain.contracts?.portoAccount?.address
        if (!delegation) throw new Error('portoAccount address not found.')

        const { data } = await call(client, {
          data: encodeFunctionData({
            abi: parseAbi(['function implementation() view returns (address)']),
            functionName: 'implementation',
          }),
          to: delegation,
        }).catch(() => ({ data: undefined }))

        const latest = await ContractActions.getEip712Domain(client, {
          account: data ? Hex.slice(data, 12) : delegation,
        }).then((x) => x.version)

        const current = await ContractActions.getEip712Domain(client, {
          account: address,
        })
          .then((x) => x.version)
          // If the account has not been delegated yet, use the latest version
          // as they will automatically be updated when delegated.
          .catch(() => latest)

        if (!current || !latest) throw new Error('version not found.')

        return { current, latest }
      },

      async getCallsStatus(parameters) {
        const { id, internal } = parameters
        const { client } = internal

        const receipt = await client.request({
          method: 'eth_getTransactionReceipt',
          params: [id! as Hex.Hex],
        })

        const response = {
          atomic: true,
          chainId: Hex.fromNumber(client.chain.id),
          id,
          receipts: [],
          status: 100,
          version: '1.0',
        }

        if (!receipt) return response
        return {
          ...response,
          receipts: [receipt],
          status: receipt.status === '0x0' ? 400 : 200,
        }
      },

      async getCapabilities(parameters) {
        const { internal } = parameters
        const { config } = internal

        const value = {
          atomic: {
            status: 'supported',
          },
          feeToken: {
            supported: false,
            tokens: [],
          },
          merchant: {
            supported: false,
          },
          permissions: {
            supported: true,
          },
        } as const

        const chainIds =
          parameters.chainIds ?? config.chains.map((x) => Hex.fromNumber(x.id))

        const capabilities = {} as Record<Hex.Hex, typeof value>
        for (const chainId of chainIds) {
          if (config.chains.find((x) => Hex.fromNumber(x.id) === chainId))
            capabilities[chainId] = value
        }

        return capabilities
      },

      async getKeys(parameters) {
        const { account, internal } = parameters
        const { client } = internal

        const keyCount = await readContract(client, {
          abi: ContractActions.abi,
          address: account.address,
          functionName: 'keyCount',
        })
        const keys = await Promise.all(
          Array.from({ length: Number(keyCount) }, (_, index) =>
            ContractActions.keyAt(client, { account: account.address, index }),
          ),
        )

        return U.uniqBy(
          [...(account.keys ?? []), ...keys],
          (key) => key.publicKey,
        )
      },

      async grantAdmin(parameters) {
        const { account, internal } = parameters
        const { client } = internal

        const authorizeKey = Key.from(parameters.key)

        // TODO: wait for tx to be included?
        await ContractActions.execute(client, {
          account,
          // Extract calls to authorize the key.
          calls: Mode.getAuthorizeCalls([authorizeKey]),
          storage: internal.config.storage,
        })

        return { key: authorizeKey }
      },

      async grantPermissions(parameters) {
        const { account, permissions, internal } = parameters
        const { client } = internal

        // Parse permissions request into a structured key.
        const key = await PermissionsRequest.toKey(permissions)
        if (!key) throw new Error('key not found.')

        // TODO: wait for tx to be included?
        await ContractActions.execute(client, {
          account,
          // Extract calls to authorize the key.
          calls: Mode.getAuthorizeCalls([key]),
          storage: internal.config.storage,
        })

        return { key }
      },

      async loadAccounts(parameters) {
        const { internal, permissions, signInWithEthereum } = parameters
        const { client } = internal

        const { address, credentialId } = await (async () => {
          if (mock && address_internal)
            return {
              address: address_internal,
              credentialId: undefined,
            } as const

          // If the address and credentialId are provided, we can skip the
          // WebAuthn discovery step.
          if (parameters.address && parameters.credentialId)
            return {
              address: parameters.address,
              credentialId: parameters.credentialId,
            }

          // Discovery step. We will sign a random challenge. We need to do this
          // to extract the user id (ie. the address) to query for the Account's keys.
          const credential = await WebAuthnP256.sign({
            challenge: '0x',
            rpId: keystoreHost,
          })
          const response = credential.raw
            .response as AuthenticatorAssertionResponse

          const address = Bytes.toHex(new Uint8Array(response.userHandle!))
          const credentialId = credential.raw.id

          return { address, credentialId }
        })()

        // Fetch the delegated account's keys.
        const [keyCount, extraKey] = await Promise.all([
          readContract(client, {
            abi: ContractActions.abi,
            address,
            functionName: 'keyCount',
          }),
          PermissionsRequest.toKey(permissions),
        ])
        const keys = await Promise.all(
          Array.from({ length: Number(keyCount) }, (_, index) =>
            ContractActions.keyAt(client, { account: address, index }),
          ),
        )

        // Instantiate the account based off the extracted address and keys.
        const account = Account.from({
          address,
          keys: [...keys, ...(extraKey ? [extraKey] : [])].map((key, i) => {
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
          }),
        })

        // If there is an extra key to authorize, we need to authorize it.
        if (extraKey)
          // TODO: wait for tx to be included?
          await ContractActions.execute(client, {
            account,
            calls: Mode.getAuthorizeCalls([extraKey]),
            storage: internal.config.storage,
          })

        const siweResult = await (async () => {
          if (!signInWithEthereum) return {}
          const key = account.keys?.find(
            (key) => key.role === 'admin' && key.privateKey,
          )
          if (!key) throw new Error('cannot find admin key to sign with.')
          const message = await Siwe.buildMessage(client, signInWithEthereum, {
            address: account.address,
          })
          return {
            message,
            signature: await Account.sign(account, {
              key,
              payload: PersonalMessage.getSignPayload(Hex.fromString(message)),
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
        }
      },

      async prepareCalls(parameters) {
        const { internal, key } = parameters
        const { client } = internal

        const { request, digests } = await ContractActions.prepareExecute(
          client,
          parameters,
        )

        return {
          account: request.account,
          chainId: client.chain.id,
          context: { calls: request.calls, nonce: request.nonce },
          digest: digests.exec,
          key,
        }
      },

      async prepareUpgradeAccount(parameters) {
        const { address, label, internal, permissions } = parameters
        const { client } = internal
        return await prepareUpgradeAccount({
          address,
          client,
          keystoreHost,
          label,
          mock,
          permissions,
        })
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

        await ContractActions.execute(client, {
          account,
          calls: [Call.revoke({ keyHash: key.hash })],
          storage: internal.config.storage,
        })
      },

      async revokePermissions(parameters) {
        const { account, id, internal } = parameters
        const { client } = internal

        const key = account.keys?.find((key) => key.id === id)
        if (!key) return

        // We shouldn't be able to revoke the admin keys.
        if (key.role === 'admin') throw new Error('cannot revoke permissions.')

        await ContractActions.execute(client, {
          account,
          calls: [Call.setCanExecute({ enabled: false, key })],
          storage: internal.config.storage,
        })
      },

      async sendCalls(parameters) {
        const { account, calls, internal } = parameters
        const { client } = internal

        // Try and extract an authorized key to sign the calls with.
        const key = await Mode.getAuthorizedExecuteKey({
          account,
          calls,
          permissionsId: parameters.permissionsId,
        })

        // Execute the calls (with the key if provided, otherwise it will
        // fall back to an admin key).
        const id = await ContractActions.execute(client, {
          account,
          calls,
          key,
          storage: internal.config.storage,
        })

        return { id }
      },

      async sendPreparedCalls(parameters) {
        const { account, context, internal } = parameters
        const { client } = internal

        if (!context.calls) throw new Error('calls is required.')
        if (!context.nonce) throw new Error('nonce is required.')

        const key = Key.from(parameters.key)
        const signature = Key.wrapSignature(parameters.signature, {
          keyType: key.type,
          prehash: key.prehash,
          publicKey: key.publicKey,
        })

        const hash = await ContractActions.execute(client, {
          account,
          calls: context.calls,
          nonce: context.nonce,
          signatures: {
            auth: undefined,
            exec: signature,
          },
          storage: internal.config.storage,
        })

        return hash
      },

      async signPersonalMessage(parameters) {
        const { account, data, internal } = parameters

        // Only admin keys can sign personal messages.
        const key = account.keys?.find(
          (key) => key.role === 'admin' && key.privateKey,
        )
        if (!key) throw new Error('cannot find admin key to sign with.')

        const signature = await Account.sign(account, {
          key,
          payload: PersonalMessage.getSignPayload(data),
          storage: internal.config.storage,
        })

        return signature
      },

      async signTypedData(parameters) {
        const { account, data, internal } = parameters

        // Only admin keys can sign typed data.
        const key = account.keys?.find(
          (key) => key.role === 'admin' && key.privateKey,
        )
        if (!key) throw new Error('cannot find admin key to sign with.')

        const signature = await Account.sign(account, {
          key,
          payload: TypedData.getSignPayload(Json.parse(data)),
          storage: internal.config.storage,
        })

        return signature
      },

      async updateAccount(_parameters) {
        throw new Error('Not implemented.')
      },

      async upgradeAccount(parameters) {
        const { account, context, internal, signatures } = parameters
        const { client } = internal

        // Execute the account creation.
        // TODO: wait for tx to be included?
        await ContractActions.execute(client, {
          ...(context as any),
          signatures,
          storage: internal.config.storage,
        })

        address_internal = account.address

        return { account }
      },

      async verifyEmail() {
        throw new Provider.UnsupportedMethodError()
      },
    },
    name: 'contract',
  })
}

export declare namespace contract {
  type Parameters = {
    /**
     * Mock mode. Testing purposes only.
     * @default false
     * @deprecated
     */
    mock?: boolean | undefined
    /**
     * Keystore host (WebAuthn relying party).
     * @default 'self'
     */
    keystoreHost?: 'self' | (string & {}) | undefined
  }
}
