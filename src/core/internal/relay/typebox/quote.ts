/**
 * Relay quote.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/types/quote.rs
 */

import * as Primitive from '../../typebox/primitive.js'
import * as Schema from '../../typebox/schema.js'
import { Type } from '../../typebox/schema.js'
import * as UserOp from './userOp.js'

/** A quote from a relay for a given `UserOp`. */
export const Quote = Type.Object({
  /**
   * An optional unsigned authorization item.
   * The account in `eoa` will be delegated to this address.
   */
  authorizationAddress: Schema.Optional(Primitive.Address),
  /** Chain ID the quote is for. */
  // TODO: `Primitive.Number`
  chainId: Type.Number(),
  /** The `UserOp` the quote is for. */
  op: UserOp.UserOp,
  /** The fee estimate for the bundle in the destination chains native token. */
  nativeFeeEstimate: Type.Object({
    /** The maximum fee per gas for the bundle. */
    maxFeePerGas: Primitive.BigInt,
    /** The maximum priority fee per gas for the bundle. */
    maxPriorityFeePerGas: Primitive.BigInt,
  }),
  /** The time-to-live of the quote. */
  ttl: Type.Number(),
  /** The recommended gas limit for the bundle. */
  txGas: Primitive.BigInt,
})

export const Signed = Type.Intersect([
  Quote,
  Type.Object({
    hash: Primitive.Hex,
    r: Primitive.Hex,
    s: Primitive.Hex,
    v: Schema.Optional(Primitive.Hex),
    yParity: Schema.Optional(Primitive.Hex),
  }),
])
