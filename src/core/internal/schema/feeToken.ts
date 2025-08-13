import * as Schema from 'effect/Schema'
import * as Primitive from './primitive.js'

export const FeeToken = Schema.Struct({
  address: Primitive.Address,
  decimals: Schema.Number,
  interop: Schema.optional(Schema.Boolean),
  nativeRate: Schema.optional(Primitive.BigInt),
  uid: Schema.String,
})
export type FeeToken = typeof FeeToken.Type

// TODO: Remove
export const Kind = Schema.Union(
  Schema.Literal('ETH'),
  Schema.Literal('USDC'),
  Schema.Literal('USDT'),
)
export type Kind = typeof Kind.Type

// TODO: Remove
export const Symbol = Schema.String
export type Symbol = typeof Symbol.Type
