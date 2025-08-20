import * as Schema from 'effect/Schema'
import * as Primitive from '../../schema/primitive.js'

export const CallPermission = Schema.Struct({
  /** The selector of the function this permission applies to. */
  selector: Primitive.Hex,
  /** The address of the contract this permission applies to. */
  to: Primitive.Address,
  /** Permission type. */
  type: Schema.Literal('call'),
})
export type CallPermission = typeof CallPermission.Type

export const SpendPermission = Schema.Struct({
  /** The maximum amount that can be spent in the given period. */
  limit: Primitive.BigInt,
  /** The period of the limit. */
  period: Schema.Union(
    Schema.Literal('minute'),
    Schema.Literal('hour'),
    Schema.Literal('day'),
    Schema.Literal('week'),
    Schema.Literal('month'),
    Schema.Literal('year'),
  ),
  /** The token this permission applies to. If `None`, defaults to native token (ETH). */
  token: Schema.optional(Schema.Union(Primitive.Address, Schema.Null)),
  /** Permission type. */
  type: Schema.Literal('spend'),
})
export type SpendPermission = typeof SpendPermission.Type

export const Permission = Schema.Union(CallPermission, SpendPermission)
export type Permission = typeof Permission.Type
