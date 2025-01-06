import * as Address from 'ox/Address'
import * as Bytes from 'ox/Bytes'
import * as Secp256k1 from 'ox/Secp256k1'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import type { Client, Hash, Transport } from 'viem'
import { readContract } from 'viem/actions'

import type { RpcRequest } from 'ox'
import type * as Chains from './Chains.js'
import type { Config } from './Porto.js'
import * as Account from './internal/account.js'
import * as Call from './internal/call.js'
import * as Delegation from './internal/delegation.js'
import { delegationAbi } from './internal/generated.js'
import * as Key from './internal/key.js'
import type { Compute } from './internal/types.js'

export type Implementation = {
  createAccount: (parameters: {
    /** Viem Client. */
    client: Client<Transport, Chains.Chain>
    /** Porto config. */
    config: Config
    /** Label to associate with the WebAuthn credential. */
    label?: string | undefined
    /** RPC Request. */
    request: Pick<RpcRequest.RpcRequest, 'method' | 'params'>
  }) => Promise<{
    /** Account. */
    account: Account.Account
    /** Transaction hash. */
    hash: Hash
  }>

  loadAccounts: (parameters: {
    /** Address of the account to load. */
    address?: Address.Address | undefined
    /** Extra keys to authorize. */
    authorizeKeys?: readonly Key.Key[] | undefined
    /** Viem Client. */
    client: Client<Transport, Chains.Chain>
    /** Porto config. */
    config: Config
    /** Credential ID to use to load an existing account. */
    credentialId?: string | undefined
    /** RPC Request. */
    request: Pick<RpcRequest.RpcRequest, 'method' | 'params'>
  }) => Promise<{
    /** Accounts. */
    accounts: readonly Account.Account[]
  }>
}

/**
 * Instantiates an implementation.
 *
 * @param implementation - Implementation.
 * @returns Implementation.
 */
export function from<const implementation extends Implementation>(
  implementation: implementation | Implementation,
): Compute<implementation> {
  return implementation as implementation
}

/**
 * Implementation for a WebAuthn-based local environment. Account management
 * and signing is handled locally.
 *
 * @param parameters - Parameters.
 * @returns Implementation.
 */
export function local(parameters: local.Parameters = {}) {
  const keystoreHost = (() => {
    if (parameters.keystoreHost === 'self') return undefined
    if (
      typeof window !== 'undefined' &&
      window.location.hostname === 'localhost'
    )
      return undefined
    return parameters.keystoreHost
  })()

  return from({
    async createAccount(parameters) {
      const { client } = parameters

      const privateKey = Secp256k1.randomPrivateKey()
      const address = Address.fromPublicKey(
        Secp256k1.getPublicKey({ privateKey }),
      )

      const label =
        parameters.label ?? `${address.slice(0, 8)}\u2026${address.slice(-6)}`

      const key = await Key.createWebAuthnP256({
        label,
        role: 'admin',
        rpId: keystoreHost,
        userId: Bytes.from(address),
      })

      const account = Account.fromPrivateKey(privateKey, { keys: [key] })
      const delegation = client.chain.contracts.delegation.address

      // TODO: wait for tx to be included?
      const hash = await Delegation.execute(client, {
        account,
        calls: [Call.setCanExecute({ key }), Call.authorize({ key })],
        delegation,
      })

      return { account, hash }
    },
    async loadAccounts(parameters) {
      const { client } = parameters

      // We will sign a random challenge. We need to do this to extract the
      // user id (ie. the address) to query for the Account's keys.
      const credential = await WebAuthnP256.sign({
        challenge: '0x',
        rpId: keystoreHost,
      })
      const response = credential.raw.response as AuthenticatorAssertionResponse

      const address = Bytes.toHex(new Uint8Array(response.userHandle!))

      // Fetch the delegated account's keys.
      const keyCount = await readContract(client, {
        abi: delegationAbi,
        address,
        functionName: 'keyCount',
      })
      const keys = await Promise.all(
        Array.from({ length: Number(keyCount) }, (_, index) =>
          Delegation.keyAt(client, { account: address, index }),
        ),
      )

      // Instantiate the account based off the extracted address and keys.
      const account = Account.from({
        address,
        keys,
      })

      return {
        accounts: [account],
      }
    },
  })
}

export declare namespace local {
  type Parameters = {
    /**
     * Keystore host (WebAuthn relying party).
     * @default 'self'
     */
    keystoreHost?: 'self' | (string & {}) | undefined
  }
}

// TODO
export function iframe() {
  throw new Error('Not implemented.')
}
