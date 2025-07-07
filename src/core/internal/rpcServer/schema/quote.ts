/**
 * RPC quote.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/types/quote.rs
 */

import * as Schema from 'effect/Schema'
import * as Primitive from '../../schema/primitive.js'
import * as Intent from './intent.js'

/** A quote from the RPC for a given `Intent`. */
export const Quote = Schema.Struct({
  /**
   * An optional unsigned authorization item.
   * The account in `eoa` will be delegated to this address.
   */
  authorizationAddress: Schema.optional(
    Schema.Union(Primitive.Address, Schema.Null),
  ),
  /** Chain ID the quote is for. */
  // TODO: `Primitive.Number`
  chainId: Schema.Number,
  /** The price (in wei) of ETH in the payment token. */
  ethPrice: Primitive.BigInt,
  /** Extra payment for e.g L1 DA fee that is paid on top of the execution gas. */
  extraPayment: Primitive.BigInt,
  /** The fee estimate for the bundle in the destination chains native token. */
  intent: Intent.Intent,
  /** The `Intent` the quote is for. */
  nativeFeeEstimate: Schema.Struct({
    /** The maximum fee per gas for the bundle. */
    maxFeePerGas: Primitive.BigInt,
    /** The maximum priority fee per gas for the bundle. */
    maxPriorityFeePerGas: Primitive.BigInt,
  }),
  /** The orchestrator for the quote. */
  orchestrator: Primitive.Address,
  /** The decimals of the payment token. */
  paymentTokenDecimals: Schema.Number,
  /** The time-to-live of the quote. */
  ttl: Schema.Number,
  /** The recommended gas limit for the bundle. */
  txGas: Primitive.BigInt,
})
export type Quote = typeof Quote.Type

export const Signed = Schema.extend(
  Quote,
  Schema.Struct({
    hash: Primitive.Hex,
    r: Primitive.Hex,
    s: Primitive.Hex,
    v: Schema.optional(Primitive.Hex),
    yParity: Schema.optional(Primitive.Hex),
  }),
)
export type Signed = typeof Signed.Type
