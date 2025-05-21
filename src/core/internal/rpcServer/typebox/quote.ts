/**
 * RPC quote.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/types/quote.rs
 */

import * as Primitive from '../../typebox/primitive.js'
import * as Typebox from '../../typebox/typebox.js'
import { Type } from '../../typebox/typebox.js'
import * as Intent from './intent.js'

/** A quote from the RPC for a given `Intent`. */
export const Quote = Type.Object({
  /**
   * An optional unsigned authorization item.
   * The account in `eoa` will be delegated to this address.
   */
  authorizationAddress: Typebox.OneOf([
    Typebox.Optional(Primitive.Address),
    Type.Null(),
  ]),
  /** Chain ID the quote is for. */
  // TODO: `Primitive.Number`
  chainId: Type.Number(),
  /** The price (in wei) of ETH in the payment token. */
  ethPrice: Primitive.BigInt,
  /** Extra payment for e.g L1 DA fee that is paid on top of the execution gas. */
  extraPayment: Primitive.BigInt,
  /** The fee estimate for the bundle in the destination chains native token. */
  intent: Intent.Intent,
  /** The `Intent` the quote is for. */
  nativeFeeEstimate: Type.Object({
    /** The maximum fee per gas for the bundle. */
    maxFeePerGas: Primitive.BigInt,
    /** The maximum priority fee per gas for the bundle. */
    maxPriorityFeePerGas: Primitive.BigInt,
  }),
  /** The orchestrator for the quote. */
  orchestrator: Primitive.Address,
  /** The decimals of the payment token. */
  paymentTokenDecimals: Type.Number(),
  /** The time-to-live of the quote. */
  ttl: Type.Number(),
  /** The recommended gas limit for the bundle. */
  txGas: Primitive.BigInt,
})
export type Quote = Typebox.StaticDecode<typeof Quote>

export const Signed = Type.Intersect([
  Quote,
  Type.Object({
    hash: Primitive.Hex,
    r: Primitive.Hex,
    s: Primitive.Hex,
    v: Typebox.Optional(Primitive.Hex),
    yParity: Typebox.Optional(Primitive.Hex),
  }),
])
export type Signed = Typebox.StaticDecode<typeof Signed>
