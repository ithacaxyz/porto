/**
 * Intent.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/types/intent.rs
 */

import * as Schema from 'effect/Schema'
import * as Primitive from '../../schema/primitive.js'

export const Intent = Schema.Struct({
  combinedGas: Primitive.BigInt,
  encodedFundTransfers: Schema.Array(Primitive.Hex),
  encodedPreCalls: Schema.Array(Primitive.Hex),
  eoa: Primitive.Address,
  executionData: Primitive.Hex,
  expiry: Primitive.BigInt,
  funder: Primitive.Address,
  funderSignature: Primitive.Hex,
  isMultichain: Schema.Boolean,
  nonce: Primitive.BigInt,
  payer: Primitive.Address,
  paymentAmount: Primitive.BigInt,
  paymentMaxAmount: Primitive.BigInt,
  paymentRecipient: Primitive.Address,
  paymentSignature: Primitive.Hex,
  paymentToken: Primitive.Address,
  settler: Primitive.Address,
  settlerContext: Primitive.Hex,
  signature: Primitive.Hex,
  supportedAccountImplementation: Primitive.Address,
})
export type Intent = typeof Intent.Type

export const Partial = Schema.Struct({
  eoa: Primitive.Address,
  executionData: Primitive.Hex,
  nonce: Primitive.BigInt,
})
export type Partial = typeof Partial.Type
