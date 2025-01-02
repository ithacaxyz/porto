import type * as Address from 'ox/Address'

import type * as Key from './key.js'

/** A delegated account. */
export type Account = {
  address: Address.Address
  delegation: Address.Address
  keys?: readonly Key.Key[] | undefined
  label?: string | undefined
  type: 'delegated'
}

/**
 * Instantiates a delegated account.
 *
 * @param account - Account to instantiate.
 * @returns An instantiated delegated account.
 */
export function from<const account extends from.Parameters>(
  account: account | from.Parameters,
): account & { type: 'delegated' } {
  return { ...account, type: 'delegated' } as never
}

export declare namespace from {
  type Parameters = Omit<Account, 'type'>
}
