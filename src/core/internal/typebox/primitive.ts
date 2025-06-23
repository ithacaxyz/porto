import * as Hex_ox from 'ox/Hex'

import { Type } from './typebox.js'

// biome-ignore lint/suspicious/noTemplateCurlyInString: expected
export const Address = Type.TemplateLiteral('0x${string}')
// biome-ignore lint/suspicious/noTemplateCurlyInString: expected
export const Hex = Type.TemplateLiteral('0x${string}')
export const Number = Type.Transform(Hex)
  .Decode((value) => Hex_ox.toNumber(value))
  .Encode((value) => Hex_ox.fromNumber(value))
export const BigInt = Type.Transform(Hex)
  .Decode((value) => Hex_ox.toBigInt(value))
  .Encode((value) => Hex_ox.fromNumber(value))
