import * as z from 'zod/mini'
import * as u from '../../schema/utils.js'

export const PreCall = z.object({
  /**
   * The user's address.
   *
   * This can be set to `address(0)`, which allows it to be
   * coalesced to the parent Intent's EOA.
   */
  eoa: u.address(),
  /**
   * An encoded array of calls, using ERC7579 batch execution encoding.
   *
   * `abi.encode(calls)`, where `calls` is of type `Call[]`.
   * This allows for more efficient safe forwarding to the EOA.
   */
  executionData: u.hex(),
  /**
   * Per delegated EOA. Same logic as the `nonce` in Intent.
   *
   * A nonce of `type(uint256).max` skips the check, incrementing,
   * and the emission of the {IntentExecuted} event.
   */
  nonce: u.hex(),
  /**
   * The wrapped signature.
   *
   * `abi.encodePacked(innerSignature, keyHash, prehash)`.
   */
  signature: u.hex(),
})
export type PreCall = z.infer<typeof PreCall>

export const Context = z.object({
  ...PreCall.shape,
  chainId: u.number(),
})
export type Context = z.infer<typeof Context>
