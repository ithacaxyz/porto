import * as Hex_ox from 'ox/Hex'
import * as z from 'zod/mini'
import type * as zc from 'zod/v4/core'
import type { OneOf } from '../types.js'

export const address = () => z.templateLiteral(['0x', z.string()])
export const hex = () => z.templateLiteral(['0x', z.string()])
export const number = () =>
  z.codec(hex(), z.number(), {
    decode: (value) => Hex_ox.toNumber(value),
    encode: (value) => Hex_ox.fromNumber(value),
  })
export const bigint = () =>
  z.codec(hex(), z.bigint(), {
    decode: (value) => Hex_ox.toBigInt(value),
    encode: (value) => Hex_ox.fromNumber(value),
  })

export const is = <schema>(
  schema: z.ZodMiniType,
  message: unknown,
): message is z.infer<schema> => {
  try {
    schema.parse(message)
    return true
  } catch {
    return false
  }
}

export function oneOf<const type extends readonly zc.SomeType[]>(
  options: type,
): Omit<z.ZodMiniUnion<type>, '_zod'> & {
  _zod: Omit<z.ZodMiniUnion<type>['_zod'], 'output'> & {
    output: z.ZodMiniUnion<type>['_zod']['output'] extends object
      ? OneOf<z.ZodMiniUnion<type>['_zod']['output']>
      : z.ZodMiniUnion<type>['_zod']['output']
  }
} {
  return z.union(options) as never
}
