import * as z from 'zod/mini'
import * as u from '../../schema/utils.js'

export const CallPermission = z.object({
  /** The selector of the function this permission applies to. */
  selector: u.hex(),
  /** The address of the contract this permission applies to. */
  to: u.address(),
  /** Permission type. */
  type: z.literal('call'),
})
export type CallPermission = z.infer<typeof CallPermission>

export const SpendPermission = z.object({
  /** The maximum amount that can be spent in the given period. */
  limit: u.bigint(),
  /** The period of the limit. */
  period: z.union([
    z.literal('minute'),
    z.literal('hour'),
    z.literal('day'),
    z.literal('week'),
    z.literal('month'),
    z.literal('year'),
  ]),
  /** The token this permission applies to. If `None`, defaults to native token (ETH). */
  token: z.optional(z.union([u.address(), z.null()])),
  /** Permission type. */
  type: z.literal('spend'),
})
export type SpendPermission = z.infer<typeof SpendPermission>

export const Permission = z.union([CallPermission, SpendPermission])
export type Permission = z.infer<typeof Permission>
