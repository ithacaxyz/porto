import * as Schema from 'effect/Schema'
import * as Hex_ox from 'ox/Hex'

export const Address = Schema.TemplateLiteral('0x', Schema.String)
export const Hex = Schema.TemplateLiteral('0x', Schema.String)
export const Number = Schema.transform(Hex, Schema.Number, {
  decode: (value) => Hex_ox.toNumber(value),
  encode: (value) => Hex_ox.fromNumber(value),
})
export const BigInt = Schema.transform(Hex, Schema.BigIntFromSelf, {
  decode: (value) => Hex_ox.toBigInt(value),
  encode: (value) => Hex_ox.fromNumber(value),
})
