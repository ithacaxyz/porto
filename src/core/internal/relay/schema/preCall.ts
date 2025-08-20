import * as Schema from 'effect/Schema'
import * as Primitive from '../../schema/primitive.js'

export const PreCall = Schema.Struct({
  /**
   * The user's address.
   *
   * This can be set to `address(0)`, which allows it to be
   * coalesced to the parent Intent's EOA.
   */
  eoa: Primitive.Address,
  /**
   * An encoded array of calls, using ERC7579 batch execution encoding.
   *
   * `abi.encode(calls)`, where `calls` is of type `Call[]`.
   * This allows for more efficient safe forwarding to the EOA.
   */
  executionData: Primitive.Hex,
  /**
   * Per delegated EOA. Same logic as the `nonce` in Intent.
   *
   * A nonce of `type(uint256).max` skips the check, incrementing,
   * and the emission of the {IntentExecuted} event.
   */
  nonce: Primitive.BigInt,
  /**
   * The wrapped signature.
   *
   * `abi.encodePacked(innerSignature, keyHash, prehash)`.
   */
  signature: Primitive.Hex,
})
export type PreCall = typeof PreCall.Type
