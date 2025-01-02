import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'

import type * as Key from './key.js'
import type { PartialBy } from './types.js'

/** A delegated account. */
export type Account = {
  address: Address.Address
  delegation: Address.Address
  keys?: readonly Key.Key[] | undefined
  label?: string | undefined
  sign?: (parameters: { payload: Hex.Hex }) => Hex.Hex | undefined
  type: 'delegated'
}

/**
 * Instantiates a delegated account.
 *
 * @param account - Account to instantiate.
 * @returns An instantiated delegated account.
 */
export function from<const account extends PartialBy<Account, 'type'>>(
  account: account | PartialBy<Account, 'type'>,
): account & { type: 'delegated' } {
  return { ...account, type: 'delegated' } as never
}
