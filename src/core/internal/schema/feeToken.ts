import * as Schema from 'effect/Schema'
import * as Primitive from './primitive.js'

export const FeeToken = Schema.Struct({
  address: Primitive.Address,
  decimals: Schema.Number,
  kind: Schema.String,
  nativeRate: Schema.optional(Primitive.BigInt),
  symbol: Schema.String,
})
export type FeeToken = typeof FeeToken.Type

export const Kind = Schema.Union(
  Schema.Literal('ETH'),
  Schema.Literal('USDC'),
  Schema.Literal('USDT'),
)
export type Kind = typeof Kind.Type

export const Symbol = Schema.String
export type Symbol = typeof Symbol.Type
