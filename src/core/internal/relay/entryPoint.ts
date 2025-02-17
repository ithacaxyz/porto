import type * as Address from 'ox/Address'
import type * as TypedData from 'ox/TypedData'
import type { Chain, Client, Transport } from 'viem'

import type * as Account from '../account.js'

export const domain = {
  name: 'EntryPoint',
  version: '0.0.1',
  verifyingContract: '0x5f54ec7361a3664557d708e4ae43e3aedd0fbc76',
} as const satisfies TypedData.Domain

/**
 * Returns the EIP-712 domain for the EntryPoint.
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns EIP-712 domain.
 */
export function getEip712Domain<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
): TypedData.Domain {
  if (!client.chain) throw new Error('client.chain is required')
  return {
    ...domain,
    chainId: client.chain.id,
  }
}

export declare namespace getEip712Domain {
  export type Parameters = {
    /**
     * The delegated account to get the EIP-712 domain for.
     */
    account: Account.Account | Address.Address
  }
}
