import type * as Address from 'ox/Address'

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
}
