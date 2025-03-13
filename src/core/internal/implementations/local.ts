import * as Address from 'ox/Address'
import * as Bytes from 'ox/Bytes'
import * as Json from 'ox/Json'
import * as PersonalMessage from 'ox/PersonalMessage'
import * as PublicKey from 'ox/PublicKey'
import * as Secp256k1 from 'ox/Secp256k1'
import * as TypedData from 'ox/TypedData'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import { readContract } from 'viem/actions'

import * as DelegationContract from '../_generated/contracts/Delegation.js'
import * as Account from '../account.js'
import * as Call from '../call.js'
import * as Delegation from '../delegation.js'
import * as Implementation from '../implementation.js'
import * as Key from '../key.js'
import * as PermissionsRequest from '../permissionsRequest.js'
import type * as Porto from '../porto.js'

/**
 * Implementation for a WebAuthn-based local environment. Account management
 * and signing is handled locally.
 *
 * @param parameters - Parameters.
 * @returns Implementation.
 */
export function local(parameters: local.Parameters = {}) {
  const { mock } = parameters

  let address_internal: Address.Address | undefined
  const preparedAccounts_internal: Account.Account[] = []

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
    client: Porto.Client
    label?: string | undefined
    keystoreHost?: string | undefined
    mock?: boolean | undefined
    permissions: PermissionsRequest.PermissionsRequest | undefined
  }) {
    const { address, client, keystoreHost, mock, permissions } = parameters

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

    const account = Account.from({
      address,
      keys,
    })
    preparedAccounts_internal.push(account)

    const delegation = client.chain.contracts.delegation.address

    const { request, signPayloads } = await Delegation.prepareExecute(client, {
      account,
      calls: Implementation.getAuthorizeCalls(account.keys),
      delegation,
    })

    return { context: request, signPayloads }
  }

  return Implementation.from({
    actions: {
      async createAccount(parameters) {
        const { label, internal, permissions } = parameters
        const { client } = internal

        // Generate a random private key and derive the address.
        // The address here will be the address of the account.
        const privateKey = Secp256k1.randomPrivateKey()
        const address = Address.fromPublicKey(
          Secp256k1.getPublicKey({ privateKey }),
        )

        // Prepare the account for creation.
        const { context, signPayloads } = await prepareUpgradeAccount({
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
        const signatures = await Account.sign(account, {
          payloads: signPayloads,
        })

        // Execute the account creation.
        // TODO: wait for tx to be included?
        await Delegation.execute(client, {
          ...(context as any),
          account,
          signatures,
        })

        address_internal = account.address

        return { account }
      },

      async grantPermissions(parameters) {
        const { account, permissions, internal } = parameters
        const { client } = internal

        // Parse permissions request into a structured key.
        const key = await PermissionsRequest.toKey(permissions)
        if (!key) throw new Error('key not found.')

        // TODO: wait for tx to be included?
        await Delegation.execute(client, {
          account,
          // Extract calls to authorize the key.
          calls: Implementation.getAuthorizeCalls([key]),
        })

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
          PermissionsRequest.toKey(permissions),
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

        // If there is an extra key to authorize, we need to authorize it.
        if (extraKey)
          // TODO: wait for tx to be included?
          await Delegation.execute(client, {
            account,
            calls: Implementation.getAuthorizeCalls([extraKey]),
          })

        return {
          accounts: [account],
        }
      },

      async prepareCalls(parameters) {
        const { internal, key } = parameters
        const { client } = internal

        const { request, signPayloads } = await Delegation.prepareExecute(
          client,
          parameters,
        )

        return {
          account: request.account,
          context: { calls: request.calls, nonce: request.nonce },
          key,
          signPayloads,
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

      async revokePermissions(parameters) {
        const { account, id, internal } = parameters
        const { client } = internal

        const key = account.keys?.find((key) => key.publicKey === id)
        if (!key) return

        // We shouldn't be able to revoke the admin keys.
        if (key.role === 'admin') throw new Error('cannot revoke permissions.')

        await Delegation.execute(client, {
          account,
          calls: [Call.setCanExecute({ key, enabled: false })],
        })
      },

      async sendCalls(parameters) {
        const { account, calls, internal } = parameters
        const { client } = internal

        // Try and extract an authorized key to sign the calls with.
        const key = await Implementation.getAuthorizedExecuteKey({
          account,
          calls,
          permissionsId: parameters.permissionsId,
        })

        // Execute the calls (with the key if provided, otherwise it will
        // fall back to an admin key).
        const hash = await Delegation.execute(client, {
          account,
          calls,
          key,
        })

        return hash
      },

      async sendPreparedCalls(parameters) {
        const { account, context, key, internal } = parameters
        const { client } = internal

        if (!context.calls) throw new Error('calls is required.')
        if (!context.nonce) throw new Error('nonce is required.')

        const signature = Key.wrapSignature(parameters.signature, {
          keyType: key.type,
          publicKey: key.publicKey,
        })

        const hash = await Delegation.execute(client, {
          account,
          calls: context.calls,
          nonce: context.nonce,
          signatures: [signature],
        })

        return hash
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

      async upgradeAccount(parameters) {
        const { context, internal, signatures } = parameters
        const { client } = internal

        const address = (context as any).account.address

        // Execute the account creation.
        // TODO: wait for tx to be included?
        await Delegation.execute(client, {
          ...(context as any),
          signatures,
        })

        const account = preparedAccounts_internal.find(
          (account) => account.address === address,
        )
        if (!account) throw new Error('prepared account not found')

        address_internal = address

        return { account }
      },
    },
  })
}

export declare namespace local {
  type Parameters = {
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
