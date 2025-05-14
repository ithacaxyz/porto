import type { StaticDecode } from '@sinclair/typebox/type'

import * as Primitive from '../../typebox/primitive.js'
import * as Typebox from '../../typebox/typebox.js'
import { Type } from '../../typebox/typebox.js'

export const CallPermission = Type.Object({
  /** The selector of the function this permission applies to. */
  selector: Primitive.Hex,
  /** The address of the contract this permission applies to. */
  to: Primitive.Address,
  /** Permission type. */
  type: Type.Literal('call'),
})
export type CallPermission = StaticDecode<typeof CallPermission>

export const SpendPermission = Type.Object({
  /** The maximum amount that can be spent in the given period. */
  limit: Primitive.BigInt,
  /** The period of the limit. */
  period: Type.Union([
    Type.Literal('minute'),
    Type.Literal('hour'),
    Type.Literal('day'),
    Type.Literal('week'),
    Type.Literal('month'),
    Type.Literal('year'),
  ]),
  /** The token this permission applies to. If `None`, defaults to native token (ETH). */
  token: Typebox.Optional(Typebox.OneOf([Primitive.Address, Type.Null()])),
  /** Permission type. */
  type: Type.Literal('spend'),
})
export type SpendPermission = StaticDecode<typeof SpendPermission>

export const Permission = Type.Union([CallPermission, SpendPermission])
export type Permission = StaticDecode<typeof Permission>
