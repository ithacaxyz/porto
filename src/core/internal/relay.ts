import type * as Address from 'ox/Address'
import type * as Errors from 'ox/Errors'
import type * as Hex from 'ox/Hex'

import * as Account from './account.js'
import * as Key from './key.js'
import type { Client } from './porto.js'
import type * as Capabilities from './relay/typebox/capabilities.js'
import * as Actions from './viem/relay.js'

/**
 * Creates a new Porto Account via the Relay.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function createAccount(
  client: Client,
  parameters: createAccount.Parameters,
) {
  const { delegation = client.chain.contracts.delegation.address, keys } =
    parameters

  const authorizeKeys = keys.map(Key.toRelay)

  const result = await Actions.createAccount(client, {
    capabilities: {
      authorizeKeys,
      delegation,
    },
  })

  return Account.from({
    address: result.address,
    keys,
  })
}

export namespace createAccount {
  export type Parameters = {
    /** Contract address to delegate to. */
    delegation?: Address.Address | undefined
    /** Keys to authorize. */
    keys: readonly Key.Key[]
  }

  export type ReturnType = Account.Account

  export type ErrorType =
    | Actions.createAccount.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Prepares the digest to sign over and fills the request to send a call bundle.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Prepare call bundle parameters.
 * @returns Prepared properties.
 */
export async function prepareCalls<const calls extends readonly unknown[]>(
  client: Client,
  parameters: prepareCalls.Parameters<calls>,
) {
  const { authorizeKeys, calls, key, feeToken, nonce, revokeKeys } = parameters
  const account = Account.from(parameters.account)
  const hash = Key.hash(key)
  const { capabilities, context, digest } = await Actions.prepareCalls(client, {
    account: account.address,
    calls: (calls ?? []) as any,
    capabilities: {
      authorizeKeys: authorizeKeys?.map(Key.toRelay),
      meta: {
        feeToken,
        keyHash: hash,
        nonce,
      },
      revokeKeys: revokeKeys?.map((key) => ({
        hash: key.hash,
      })),
    },
  })
  return {
    capabilities,
    context: { ...context, key },
    digest,
  }
}

export namespace prepareCalls {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
  > = {
    /** Additional keys to authorize on the account. */
    authorizeKeys?: readonly Key.Key[] | undefined
    /** Account to prepare the calls for. */
    account: Account.Account
    /** Key that will be used to sign the calls. */
    key: Pick<Key.Key, 'publicKey' | 'type'>
    /** Calls to prepare. */
    calls?: Actions.prepareCalls.Parameters<calls>['calls'] | undefined
    /** Additional keys to revoke from the account. */
    revokeKeys?: readonly Key.Key[] | undefined
  } & Omit<Capabilities.meta.Request, 'keyHash'>

  export type ReturnType = {
    capabilities: Actions.prepareCalls.ReturnType['capabilities']
    context: Actions.prepareCalls.ReturnType['context'] & {
      key: Parameters['key']
    }
    digest: Actions.prepareCalls.ReturnType['digest']
  }

  export type ErrorType =
    | Actions.prepareCalls.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Prepares an account upgrade.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function prepareUpgradeAccount(
  client: Client,
  parameters: prepareUpgradeAccount.Parameters,
) {
  const {
    address,
    delegation = client.chain.contracts.delegation.address,
    feeToken,
    keys,
  } = parameters

  const authorizeKeys = keys.map(Key.toRelay)

  const { capabilities, context, digests } =
    await Actions.prepareUpgradeAccount(client, {
      address,
      capabilities: {
        authorizeKeys,
        delegation,
        feeToken,
      },
    })

  const account = Account.from({
    address,
    keys,
  })

  return {
    capabilities,
    context: {
      ...context,
      account,
    },
    digests,
  }
}

export declare namespace prepareUpgradeAccount {
  export type Parameters = {
    /** Address of the account to upgrade. */
    address: Address.Address
    /** Contract address to delegate to. */
    delegation?: Address.Address | undefined
    /** Fee token. */
    feeToken?: Address.Address | undefined
    /** Keys to authorize. */
    keys: readonly Key.Key[]
  }

  export type ReturnType = Omit<
    Actions.prepareUpgradeAccount.ReturnType,
    'context'
  > & {
    context: Actions.prepareUpgradeAccount.ReturnType['context'] & {
      account: Account.Account
    }
  }

  export type ErrorType =
    | Actions.prepareUpgradeAccount.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Broadcasts a call bundle to the Relay.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Bundle identifier.
 */
export async function sendCalls<const calls extends readonly unknown[]>(
  client: Client,
  parameters: sendCalls.Parameters<calls>,
) {
  const account = Account.from(parameters.account)
  const key = parameters.key ?? Account.getKey(account, parameters)

  if (!key) throw new Error('key is required')

  const { context, digest } = await prepareCalls(client, {
    ...parameters,
    key,
  })

  const signature = await Key.sign(key, {
    payload: digest,
  })

  return await sendPreparedCalls(client, { context, signature })
}

export namespace sendCalls {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
  > = Omit<prepareCalls.Parameters<calls>, 'key'> & {
    /** Key to sign the call bundle with. */
    key?: Key.Key | undefined
  }

  export type ReturnType = sendPrepared.ReturnType

  export type ErrorType =
    | prepareCalls.ErrorType
    | sendPrepared.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Sends a prepared & signed call bundle to the Relay.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Bundle identifier.
 */
export async function sendPreparedCalls(
  client: Client,
  parameters: sendPrepared.Parameters,
) {
  const { context, signature } = parameters
  const key = Key.toRelay({
    ...context.key,
    expiry: 0,
    role: 'session',
  })
  return await Actions.sendPreparedCalls(client, {
    context,
    signature: {
      publicKey: key.publicKey,
      type: key.type,
      value: signature,
    },
  })
}

export namespace sendPrepared {
  export type Parameters = {
    /** Context. */
    context: prepareCalls.ReturnType['context']
    /** Signature. */
    signature: Hex.Hex
  }

  export type ReturnType = Actions.sendPreparedCalls.ReturnType

  export type ErrorType =
    | Actions.sendPreparedCalls.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Broadcasts an account upgrade.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function upgradeAccount(
  client: Client,
  parameters: upgradeAccount.Parameters,
) {
  const { context, signatures } = parameters

  const { bundles } = await Actions.upgradeAccount(client, {
    context,
    signatures,
  })

  return {
    account: context.account,
    bundles,
  }
}

export declare namespace upgradeAccount {
  export type Parameters = {
    context: prepareUpgradeAccount.ReturnType['context']
    signatures: readonly Hex.Hex[]
  }

  export type ReturnType = Actions.upgradeAccount.ReturnType & {
    account: Account.Account
  }

  export type ErrorType =
    | Actions.upgradeAccount.ErrorType
    | Errors.GlobalErrorType
}
