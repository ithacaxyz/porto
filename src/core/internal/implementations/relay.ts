import type * as Address from 'ox/Address'
import * as Bytes from 'ox/Bytes'
import type * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as PublicKey from 'ox/PublicKey'
import * as TypedData from 'ox/TypedData'
import * as WebAuthnP256 from 'ox/WebAuthnP256'

import type * as Storage from '../../Storage.js'
import * as Account from '../account.js'
import * as HumanId from '../humanId.js'
import * as Implementation from '../implementation.js'
import * as Key from '../key.js'
import * as PermissionsRequest from '../permissionsRequest.js'
import type { Client } from '../porto.js'
import * as Relay from '../relay.js'

/**
 * Implementation for a WebAuthn-based Relay environment. Account management,
 * signing, and execution is coordinated between the library and the Relay.
 *
 * @param parameters - Parameters.
 * @returns Implementation.
 */
export function relay(config: relay.Parameters = {}) {
  const { mock } = config

  let id_internal: Hex.Hex | undefined
  // TODO(relay)
  // const preparedAccounts_internal: Account.Account[] = []

  const keystoreHost = (() => {
    if (config.keystoreHost === 'self') return undefined
    if (
      typeof window !== 'undefined' &&
      window.location.hostname === 'localhost'
    )
      return undefined
    return config.keystoreHost
  })()

  return Implementation.from({
    actions: {
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
                  role: 'admin',
                  rpId: keystoreHost,
                  userId: Bytes.from(id),
                })
              : Key.createP256({
                  role: 'admin',
                })

            return [key]
          },
        })

        if (id) id_internal = id

        const authorizeKey = await PermissionsRequest.toKey(permissions)
        if (authorizeKey)
          await preauthKey(client, {
            account,
            authorizeKey,
            feeToken: config.feeToken,
            storage: parameters.internal.config.storage,
          })

        return {
          account: Account.from({
            ...account,
            keys: [...account.keys, ...(authorizeKey ? [authorizeKey] : [])],
          }),
        }
      },

      async grantPermissions(parameters) {
        const { account, permissions, internal } = parameters
        const { client } = internal

        // Parse permissions request into a structured key.
        const authorizeKey = await PermissionsRequest.toKey(permissions)
        if (!authorizeKey) throw new Error('key to authorize not found.')

        await preauthKey(client, {
          account,
          authorizeKey,
          feeToken: config.feeToken,
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
              keyId: id_internal,
              credentialId: undefined,
            } as const
          }

          // If the address and credentialId are provided, we can skip the
          // WebAuthn discovery step.
          if (parameters.address && parameters.credentialId)
            return {
              keyId: parameters.address,
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

          const keyId = Bytes.toHex(new Uint8Array(response.userHandle!))
          const credentialId = credential.raw.id

          return { credentialId, keyId }
        })()

        const [accounts, authorizeKey] = await Promise.all([
          Relay.getAccounts(client, { keyId }),
          PermissionsRequest.toKey(permissions),
        ])
        if (!accounts[0]) throw new Error('account not found')

        // Instantiate the account based off the extracted address and keys.
        const account = Account.from({
          ...accounts[0],
          keys: [
            ...accounts[0].keys,
            ...(authorizeKey ? [authorizeKey] : []),
          ].map((key, i) => {
            const credential = {
              id: credentialId!,
              publicKey: PublicKey.fromHex(key.publicKey),
            }
            // Assume that the first key is the admin WebAuthn key.
            if (i === 0) {
              if (key.type === 'webauthn-p256')
                return Key.fromWebAuthnP256({
                  ...key,
                  credential,
                  id: keyId,
                })
            }
            // Add credential to session key to be able to restore from storage later
            if ((key.type === 'p256' && key.role === 'session') || mock)
              return { ...key, credential } as typeof key
            return key
          }),
        })

        if (authorizeKey)
          preauthKey(client, {
            account,
            authorizeKey,
            feeToken: config.feeToken,
            storage: internal.config.storage,
          })

        return {
          accounts: [account],
        }
      },

      async prepareCalls(parameters) {
        const {
          account,
          calls,
          internal,
          feeToken = config.feeToken,
          key,
        } = parameters
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
          feeToken,
          key,
          pre,
        })

        await PreBundles.clear({
          address: account.address,
          storage,
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

      async prepareUpgradeAccount(_parameters) {
        // TODO(relay): implement
        return null as any
      },

      async revokePermissions(parameters) {
        const { account, id, feeToken = config.feeToken, internal } = parameters
        const { client } = internal

        const key = account.keys?.find((key) => key.publicKey === id)
        if (!key) return

        // We shouldn't be able to revoke the admin keys.
        if (key.role === 'admin') throw new Error('cannot revoke permissions.')

        await Relay.sendCalls(client, {
          account,
          revokeKeys: [key],
          feeToken,
        })
      },

      async sendCalls(parameters) {
        const {
          account,
          calls,
          internal,
          feeToken = config.feeToken,
        } = parameters
        const {
          client,
          config: { storage },
        } = internal

        // Try and extract an authorized key to sign the calls with.
        const key = await Implementation.getAuthorizedExecuteKey({
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
        const { id } = await Relay.sendCalls(client, {
          account,
          calls,
          feeToken,
          key,
          pre,
        })

        await PreBundles.clear({
          address: account.address,
          storage,
        })

        return id as Hex.Hex
      },

      async sendPreparedCalls(parameters) {
        const { context, key, internal } = parameters
        const { client } = internal

        // TODO(relay): remove this once relay uses `innerSignature` as signature.
        const signature = Key.wrapSignature(parameters.signature, {
          keyType: key.type,
          publicKey: key.publicKey,
        })

        // Execute the calls (with the key if provided, otherwise it will
        // fall back to an admin key).
        const { id } = await Relay.sendCalls(client, {
          context: {
            ...context,
            key,
          } as never,
          signature,
        })

        return id as Hex.Hex
      },

      async signPersonalMessage(parameters) {
        const { account, data } = parameters

        // Only admin keys can sign personal messages.
        const key = account.keys?.find(
          (key) => key.role === 'admin' && key.canSign,
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
          (key) => key.role === 'admin' && key.canSign,
        )
        if (!key) throw new Error('cannot find admin key to sign with.')

        const [signature] = await Account.sign(account, {
          key,
          payloads: [TypedData.getSignPayload(Json.parse(data))],
        })

        return signature
      },

      async upgradeAccount(_parameters) {
        // TODO(relay): implement
        return null as any
      },
    },
  })
}

export declare namespace relay {
  type Parameters = {
    /**
     * ERC20 token to use for fees. Defaults to ETH.
     */
    feeToken?: Address.Address | undefined
    /**
     * Mock implementation. Testing purposes only.
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
    (key) => key.role === 'admin' && key.canSign,
  )
  if (!adminKey) throw new Error('admin key not found.')

  const { context, digest } = await Relay.prepareCalls(client, {
    account,
    authorizeKeys: [authorizeKey],
    key: adminKey,
    pre: true,
    feeToken,
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
      return storages.find((x) => x.sizeLimit > 1024 * 1024 * 5)
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
