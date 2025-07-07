import * as Schema from 'effect/Schema'

export const Kind = Schema.Union(
  Schema.Literal('ETH'),
  Schema.Literal('USDC'),
  Schema.Literal('USDT'),
)
export type Kind = typeof Kind.Type

export const Symbol = Schema.String
export type Symbol = typeof Symbol.Type
