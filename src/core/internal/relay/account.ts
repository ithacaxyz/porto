import type * as Address from 'ox/Address'
import type * as Errors from 'ox/Errors'
import type * as Hex from 'ox/Hex'

import * as Account from '../account.js'
import * as Key from '../key.js'
import type { Client } from '../porto.js'
import * as Actions from './actions.js'

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
export async function create(client: Client, parameters: create.Parameters) {
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

export namespace create {
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
 * Prepares an account upgrade.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function prepareUpgrade(
  client: Client,
  parameters: prepareUpgrade.Parameters,
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

export declare namespace prepareUpgrade {
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
 * Broadcasts an account upgrade.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function upgrade(client: Client, parameters: upgrade.Parameters) {
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

export declare namespace upgrade {
  export type Parameters = {
    context: prepareUpgrade.ReturnType['context']
    signatures: readonly Hex.Hex[]
  }

  export type ReturnType = Actions.upgradeAccount.ReturnType & {
    account: Account.Account
  }

  export type ErrorType =
    | Actions.upgradeAccount.ErrorType
    | Errors.GlobalErrorType
}
