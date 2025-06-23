import type * as Typebox from './typebox.js'
import { Type } from './typebox.js'

export const Kind = Type.Union([
  Type.Literal('ETH'),
  Type.Literal('USDC'),
  Type.Literal('USDT'),
])
export type Kind = Typebox.StaticDecode<typeof Kind>

export const Symbol = Type.String()
export type Symbol = 'ETH' | 'EXP' | 'USDC' | (string & {})
