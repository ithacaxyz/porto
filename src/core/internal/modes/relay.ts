import type * as Address from 'ox/Address'
import * as Bytes from 'ox/Bytes'
import * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as Provider from 'ox/Provider'
import * as PublicKey from 'ox/PublicKey'
import * as TypedData from 'ox/TypedData'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import { waitForCallsStatus } from 'viem/experimental'

import type * as Storage from '../../Storage.js'
import * as Account from '../account.js'
import * as HumanId from '../humanId.js'
import * as Key from '../key.js'
import * as Mode from '../mode.js'
import * as PermissionsRequest from '../permissionsRequest.js'
import type { Client } from '../porto.js'
import * as Relay from '../relay.js'
import * as Relay_viem from '../viem/relay.js'

/**
 * Mode for a WebAuthn-based environment that interacts with the Porto
 * Relay. Account management, signing, and execution is coordinated
 * between the library and the Relay.
 *
 * @param parameters - Parameters.
 * @returns Mode.
 */
export function relay(config: relay.Parameters = {}) {
  const { mock } = config

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

  const resolveFeeToken = (
    client: Client,
    feeToken_?: Address.Address | undefined,
  ) => {
    const { chain } = client
    return (
      config.feeTokens?.[chain.id]?.find((feeToken) =>
        // If no fee token is provided, default to the first one.
        feeToken_ ? feeToken.address === feeToken_ : true,
      ) ?? { address: feeToken_ }
    )
  }

  return Mode.from({
    actions: {
      async addFunds() {
        throw new Provider.UnsupportedMethodError()
      },

      async createAccount(parameters) {
        const { permissions } = parameters
        const { client } = parameters.internal

        let id: Hex.Hex | undefined
        const account = await Relay.createAccount(client, {
          async keys({ ids }) {
            id = ids[0]!
            const label =
              parameters.label ??
              HumanId.create({
                capitalize: true,
                separator: ' ',
              })

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

        const feeToken = resolveFeeToken(client)
        const authorizeKey = await PermissionsRequest.toKey(permissions, {
          feeToken,
        })
        if (authorizeKey)
          // TODO(relay): remove double webauthn sign.
          await preauthKey(client, {
            account,
            authorizeKey,
            feeToken: feeToken.address,
            storage: parameters.internal.config.storage,
          })

        return {
          account: Account.from({
            ...account,
            keys: [...account.keys, ...(authorizeKey ? [authorizeKey] : [])],
          }),
        }
      },

      async getCallsStatus(parameters) {
        const { id, internal } = parameters
        const { client } = internal

        const result = await Relay_viem.getCallsStatus(client, {
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
        const { account, feeToken, internal } = parameters
        const { client } = internal

        const authorizeKey = Key.from(parameters.key)

        const { id } = await Relay.sendCalls(client, {
          account,
          authorizeKeys: [authorizeKey],
          feeToken: resolveFeeToken(client, feeToken)?.address,
        })
        await waitForCallsStatus(client, {
          id,
        })

        return { key: authorizeKey }
      },

      async grantPermissions(parameters) {
        const { account, permissions, internal } = parameters
        const { client } = internal

        const feeToken = resolveFeeToken(client)

        // Parse permissions request into a structured key.
        const authorizeKey = await PermissionsRequest.toKey(permissions, {
          feeToken,
        })
        if (!authorizeKey) throw new Error('key to authorize not found.')

        await preauthKey(client, {
          account,
          authorizeKey,
          feeToken: feeToken.address,
          storage: internal.config.storage,
        })

        return { key: authorizeKey }
      },

      async loadAccounts(parameters) {
        const { internal, permissions } = parameters
        const { client } = internal

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

        const feeToken = resolveFeeToken(client)

        const [accounts, authorizeKey] = await Promise.all([
          Relay.getAccounts(client, { keyId }),
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

        if (authorizeKey)
          await preauthKey(client, {
            account,
            authorizeKey,
            feeToken: feeToken.address,
            storage: internal.config.storage,
          })

        return {
          accounts: [account],
        }
      },

      async prepareCalls(parameters) {
        const { account, calls, internal, feeToken, key } = parameters
        const {
          client,
          config: { storage },
        } = internal

        // Get pre-authorized keys to assign to the call bundle.
        const pre = await PreBundles.get({
          address: account.address,
          storage,
        })

        const { context, digest } = await Relay.prepareCalls(client, {
          account,
          calls,
          feeToken: resolveFeeToken(client, feeToken)?.address,
          key,
          pre,
        })

        return {
          account,
          context: {
            ...context,
            account,
            calls,
            nonce: context.op.nonce,
          },
          key,
          signPayloads: [digest],
        }
      },

      async prepareUpgradeAccount(parameters) {
        const { address, permissions } = parameters
        const { client } = parameters.internal

        const feeToken = resolveFeeToken(client, parameters.feeToken)

        const authorizeKey = await PermissionsRequest.toKey(permissions, {
          feeToken,
        })
        const { context, digests } = await Relay.prepareUpgradeAccount(client, {
          address,
          feeToken: feeToken.address,
          async keys({ ids }) {
            const id = ids[0]!
            const label =
              parameters.label ??
              HumanId.create({
                capitalize: true,
                separator: ' ',
              })

            const key = !mock
              ? await Key.createWebAuthnP256({
                  label,
                  rpId: keystoreHost,
                  userId: Bytes.from(id),
                })
              : Key.createHeadlessWebAuthnP256()

            return [key, ...(authorizeKey ? [authorizeKey] : [])]
          },
        })

        return {
          context,
          signPayloads: digests,
        }
      },

      async revokeAdmin(parameters) {
        const { account, id, feeToken, internal } = parameters
        const { client } = internal

        const key = account.keys?.find(
          (key) => key.publicKey === id || key.id === id,
        )
        if (!key) return

        try {
          const { id } = await Relay.sendCalls(client, {
            account,
            feeToken: resolveFeeToken(client, feeToken)?.address,
            revokeKeys: [key],
          })
          await waitForCallsStatus(client, {
            id,
          })
        } catch (e) {
          const error = e as Relay.sendCalls.ErrorType
          if (
            error.name === 'Relay.ExecutionError' &&
            error.abiError?.name === 'KeyDoesNotExist'
          )
            return
          throw e
        }
      },

      async revokePermissions(parameters) {
        const { account, id, feeToken, internal } = parameters
        const { client } = internal

        const key = account.keys?.find(
          (key) => key.publicKey === id || key.id === id,
        )
        if (!key) return

        // We shouldn't be able to revoke the admin keys.
        if (key.role === 'admin') throw new Error('cannot revoke admins.')

        try {
          const { id } = await Relay.sendCalls(client, {
            account,
            feeToken: resolveFeeToken(client, feeToken)?.address,
            revokeKeys: [key],
          })
          await waitForCallsStatus(client, {
            id,
          })
        } catch (e) {
          const error = e as Relay.sendCalls.ErrorType
          if (
            error.name === 'Relay.ExecutionError' &&
            error.abiError?.name === 'KeyDoesNotExist'
          )
            return
          throw e
        }
      },

      async sendCalls(parameters) {
        const { account, calls, internal, feeToken } = parameters
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
        const pre = await PreBundles.get({
          address: account.address,
          storage,
        })

        // Execute the calls (with the key if provided, otherwise it will
        // fall back to an admin key).
        const result = await Relay.sendCalls(client, {
          account,
          calls,
          feeToken: resolveFeeToken(client, feeToken)?.address,
          key,
          pre,
        })

        await PreBundles.clear({
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

        const { id } = await Relay.sendCalls(client, {
          context: {
            ...context,
            key,
          } as never,
          signature,
        })

        if ((context?.account as any)?.address)
          await PreBundles.clear({
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

        const [signature] = await Account.sign(account, {
          key,
          payloads: [PersonalMessage.getSignPayload(data)],
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

        const [signature] = await Account.sign(account, {
          key,
          payloads: [TypedData.getSignPayload(Json.parse(data))],
        })

        return signature
      },

      async upgradeAccount(parameters) {
        const { account, context, internal, signatures } = parameters
        const { client } = internal

        await Relay.upgradeAccount(client, {
          context: context as any,
          signatures,
        })

        return { account }
      },
    },
    name: 'relay',
  })
}

export declare namespace relay {
  type Parameters = {
    /**
     * Chain-aware ERC20 fee token configuration.
     */
    feeTokens?:
      | Record<
          number,
          readonly NonNullable<PermissionsRequest.toKey.Options['feeToken']>[]
        >
      | undefined
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

async function preauthKey(client: Client, parameters: preauthKey.Parameters) {
  const { account, authorizeKey, feeToken } = parameters

  const adminKey = account.keys?.find(
    (key) => key.role === 'admin' && key.privateKey,
  )
  if (!adminKey) throw new Error('admin key not found.')

  const { context, digest } = await Relay.prepareCalls(client, {
    account,
    authorizeKeys: [authorizeKey],
    feeToken,
    key: adminKey,
    pre: true,
  })
  const signature = await Key.sign(adminKey, {
    payload: digest,
  })

  await PreBundles.upsert([{ context, signature }], {
    address: account.address,
    storage: parameters.storage,
  })
}

namespace preauthKey {
  export type Parameters = {
    account: Account.Account
    authorizeKey: Key.Key
    feeToken?: Address.Address | undefined
    storage: Storage.Storage
  }
}

export namespace PreBundles {
  export type PreBundles = readonly {
    context: Relay.prepareCalls.ReturnType['context']
    signature: Hex.Hex
  }[]

  export const storageKey = (address: Address.Address) => `porto.pre.${address}`

  export async function upsert(pre: PreBundles, parameters: upsert.Parameters) {
    const { address } = parameters

    const storage = (() => {
      const storages = parameters.storage.storages ?? [parameters.storage]
      return storages.find((x) => x.sizeLimit > 1024 * 1024 * 4)
    })()

    const value = await storage?.getItem<PreBundles>(storageKey(address))
    await storage?.setItem(storageKey(address), [...(value ?? []), ...pre])
  }

  namespace upsert {
    export type Parameters = {
      address: Address.Address
      storage: Storage.Storage
    }
  }

  export async function get(parameters: get.Parameters) {
    const { address, storage } = parameters
    const pre = await storage?.getItem<PreBundles>(storageKey(address))
    return pre || undefined
  }

  export namespace get {
    export type Parameters = {
      address: Address.Address
      storage: Storage.Storage
    }
  }

  export async function clear(parameters: clear.Parameters) {
    const { address, storage } = parameters
    await storage?.removeItem(storageKey(address))
  }

  namespace clear {
    export type Parameters = {
      address: Address.Address
      storage: Storage.Storage
    }
  }
}
