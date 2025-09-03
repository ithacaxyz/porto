<<<<<<< HEAD
import * as z from 'zod/mini'
import * as u from '../../schema/utils.js'

export const Token = z.object({
  address: u.address(),
  decimals: z.number(),
  feeToken: z.optional(z.boolean()),
  interop: z.optional(z.boolean()),
  nativeRate: z.optional(u.bigint()),
  symbol: z.string(),
  uid: z.string(),
})
export type Token = z.infer<typeof Token>

export const Symbol = z.string().check(z.regex(/^[A-Z0-9]+$/))
export type Symbol = z.infer<typeof Symbol>
||||||| parent of bc3f8c7c (refactor: `Tokens` module)
=======
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
>>>>>>> bc3f8c7c (refactor: `Tokens` module)
