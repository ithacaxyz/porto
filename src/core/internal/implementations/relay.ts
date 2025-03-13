import * as Address from 'ox/Address'
import * as Bytes from 'ox/Bytes'
import * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as PublicKey from 'ox/PublicKey'
import * as Secp256k1 from 'ox/Secp256k1'
import * as TypedData from 'ox/TypedData'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import { readContract } from 'viem/actions'

import * as DelegationContract from '../_generated/contracts/Delegation.js'
import * as Account from '../account.js'
import * as Delegation from '../delegation.js'
import * as Implementation from '../implementation.js'
import * as Key from '../key.js'
import * as PermissionsRequest from '../permissionsRequest.js'
import * as Relay from '../relay.js'

// TODO: remove this
export const tmp: {
  setBalance: ((address: Address.Address) => Promise<void>) | null
} = {
  setBalance: null,
}

/**
 * Implementation for a WebAuthn-based Relay environment. Account management,
 * signing, and execution is coordinated between the library and the Relay.
 *
 * @param parameters - Parameters.
 * @returns Implementation.
 */
export function relay(config: relay.Parameters = {}) {
  const { feeToken, mock } = config

  let address_internal: Address.Address | undefined
  // TODO
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

  async function prepareAccountKeys(parameters: {
    address: Address.Address
    label?: string | undefined
    keystoreHost?: string | undefined
    mock?: boolean | undefined
    permissions: PermissionsRequest.PermissionsRequest | undefined
  }) {
    const { address, keystoreHost, mock, permissions } = parameters

    const label =
      parameters.label ?? `${address.slice(0, 8)}\u2026${address.slice(-6)}`

    const key = !mock
      ? await Key.createWebAuthnP256({
          label,
          role: 'admin',
          rpId: keystoreHost,
          userId: Bytes.from(address),
        })
      : Key.createP256({
          role: 'admin',
        })

    const extraKey = await PermissionsRequest.toKey(permissions)

    const keys = [key, ...(extraKey ? [extraKey] : [])]

    return keys
  }

  return Implementation.from({
    actions: {
      async createAccount(parameters) {
        const { label, internal, permissions } = parameters
        const { client } = internal

        ///////////////////////////////////////////////////////////////////////////
        // START TODO: remove this when refactored to Relay.createAccount
        ///////////////////////////////////////////////////////////////////////////

        // Generate a random private key and derive the address.
        // The address here will be the address of the account.
        const privateKey = Secp256k1.randomPrivateKey()
        const address = Address.fromPublicKey(
          Secp256k1.getPublicKey({ privateKey }),
        )

        ///////////////////////////////////////////////////////////////////////////
        // END TODO
        ///////////////////////////////////////////////////////////////////////////

        // Prepare account keys to be authorized.
        const keys = await prepareAccountKeys({
          address,
          keystoreHost,
          label,
          mock,
          permissions,
        })

        const delegation = client.chain.contracts.delegation.address

        ///////////////////////////////////////////////////////////////////////////
        // START TODO: remove this when refactored to Relay.createAccount
        ///////////////////////////////////////////////////////////////////////////

        await tmp.setBalance?.(address)

        const { context, digests } = await Relay.prepareUpgradeAccount(client, {
          address,
          keys,
          delegation,
          feeToken,
        })

        const account = Account.fromPrivateKey(privateKey, {
          keys: context.account.keys,
        })
        const signatures = await Account.sign(account, {
          payloads: digests,
        })

        await Relay.upgradeAccount(client, {
          context,
          signatures,
        })

        ///////////////////////////////////////////////////////////////////////////
        // END TODO
        ///////////////////////////////////////////////////////////////////////////

        address_internal = address

        return { account }
      },

      async grantPermissions(parameters) {
        const { permissions } = parameters

        // Parse permissions request into a structured key.
        const key = await PermissionsRequest.toKey(permissions, {
          // We are going to authorize the key at time of next call bundle
          // so the user doesn't need to pay fees.
          initialized: false,
        })
        if (!key) throw new Error('key not found.')

        return { key }
      },

      async loadAccounts(parameters) {
        const { internal, permissions } = parameters
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
            abi: DelegationContract.abi,
            address,
            functionName: 'keyCount',
          }),
          PermissionsRequest.toKey(permissions, {
            // We are going to authorize the key at time of next call bundle
            // so the user doesn't need to pay fees.
            initialized: false,
          }),
        ])
        const keys = await Promise.all(
          Array.from({ length: Number(keyCount) }, (_, index) =>
            Delegation.keyAt(client, { account: address, index }),
          ),
        )

        // Instantiate the account based off the extracted address and keys.
        const account = Account.from({
          address,
          keys: [...keys, ...(extraKey ? [extraKey] : [])].map((key, i) => {
            const credential = {
              id: credentialId!,
              publicKey: PublicKey.fromHex(key.publicKey),
            }
            // Assume that the first key is the admin WebAuthn key.
            if (i === 0) {
              if (key.type === 'webauthn-p256')
                return Key.fromWebAuthnP256({ ...key, credential })
            }
            // Add credential to session key to be able to restore from storage later
            if ((key.type === 'p256' && key.role === 'session') || mock)
              return { ...key, credential } as typeof key
            return key
          }),
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
        const { client } = internal

        const { context, digest } = await Relay.prepareCalls(client, {
          account,
          calls,
          feeToken,
          key,
          // TODO: remove this when relay supports optional nonce
          nonce: randomNonce(),
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
        // TODO: implement
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
          // TODO: remove this when relay supports optional nonce
          nonce: randomNonce(),
        })
      },

      async sendCalls(parameters) {
        const {
          account,
          calls,
          internal,
          feeToken = config.feeToken,
        } = parameters
        const { client } = internal

        // Try and extract an authorized key to sign the calls with.
        const key = await Implementation.getAuthorizedExecuteKey({
          account,
          calls,
          permissionsId: parameters.permissionsId,
        })

        // Get uninitialized keys to authorize.
        const authorizeKeys = account.keys?.filter((key) => !key.initialized)

        // TODO: remove this when relay support batch authorize + calls
        await Relay.sendCalls(client, {
          account,
          authorizeKeys,
          feeToken,
          // TODO: remove this when relay supports optional nonce
          nonce: randomNonce(),
        })

        // Execute the calls (with the key if provided, otherwise it will
        // fall back to an admin key).
        const { id } = await Relay.sendCalls(client, {
          account,
          calls,
          feeToken,
          key,
          // TODO: remove this when relay supports optional nonce
          nonce: randomNonce(),
        })

        return id as Hex.Hex
      },

      async sendPreparedCalls(parameters) {
        const { context, key, internal } = parameters
        const { client } = internal

        // TODO: remove this once relay uses `innerSignature` as signature.
        const signature = Key.wrapSignature(parameters.signature, {
          keyType: key.type,
          publicKey: key.publicKey,
        })

        // Execute the calls (with the key if provided, otherwise it will
        // fall back to an admin key).
        const { id } = await Relay.sendPreparedCalls(client, {
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
        // TODO: implement
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

// TODO: remove this
function randomNonce() {
  return Hex.toBigInt(
    Hex.concat(
      // multichain flag (0 = single chain, 0xc1d0 = multi-chain)
      Hex.fromNumber(0, { size: 2 }),
      // sequence key
      Hex.random(22),
      // sequential nonce
      Hex.fromNumber(0, { size: 8 }),
    ),
  )
}
