import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'

import type * as Key from './key.js'

/** A delegated account. */
export type Account = {
  address: Address.Address
  delegation: Address.Address
  keys?: readonly Key.Key[] | undefined
  label?: string | undefined
  sign?: (parameters: { payload: Hex.Hex }) => Hex.Hex | undefined
}

/**
 * Instantiates a delegated account.
 *
 * @param account - Account to instantiate.
 * @returns An instantiated delegated account.
 */
export function from<const account extends Account>(
  account: account | Account,
): account {
  return account as never
}
