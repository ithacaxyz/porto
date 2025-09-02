import type * as Address from 'ox/Address'
import * as SignatureErc8010 from 'ox/erc8010/SignatureErc8010'
import type * as Hex from 'ox/Hex'
import type { Client } from 'viem'
import * as RelayActions from '../../viem/RelayActions.js'

/**
 * Wraps a signature in ERC-8010 format to enable pre-delegated signature verification.
 *
 * @param client - The client to use.
 * @param parameters - The parameters for the wrap function.
 * @returns The wrapped signature.
 */
export async function wrap(client: Client, parameters: wrap.Parameters) {
  const { address } = parameters

  // Obtain the account's authorization and init data.
  const { authorization, data, to } = await RelayActions.getAuthorization(
    client,
    {
      address,
    },
  )

  // Wrap the signature.
  return SignatureErc8010.wrap({
    authorization: {
      ...authorization,
      nonce: BigInt(authorization.nonce),
      r: BigInt(authorization.r),
      s: BigInt(authorization.s),
    },
    data,
    signature: parameters.signature,
    to,
  })
}

export namespace wrap {
  export type Parameters = {
    address: Address.Address
    signature: Hex.Hex
  }
}
