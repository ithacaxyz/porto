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
