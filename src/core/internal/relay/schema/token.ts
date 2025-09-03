import * as Schema from 'effect/Schema'
import * as Primitive from '../../schema/primitive.js'

export const Token = Schema.Struct({
  address: Primitive.Address,
  decimals: Schema.Number,
  feeToken: Schema.optional(Schema.Boolean),
  interop: Schema.optional(Schema.Boolean),
  nativeRate: Schema.optional(Primitive.BigInt),
  symbol: Schema.String,
  uid: Schema.String,
})
export type Token = typeof Token.Type

export const Symbol = Schema.String
export type Symbol = typeof Symbol.Type
