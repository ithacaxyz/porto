// Refs:
// https://github.com/ithacaxyz/relay/blob/main/src/types/capabilities.rs

import * as Primitive from '../../typebox/primitive.js'
import * as Schema from '../../typebox/schema.js'
import { Type } from '../../typebox/schema.js'

export namespace authorizeKey {
  export const Request = Type.Object({
    expiry: Type.Number(),
    permissions: Type.Array(
      Type.Union([
        Type.Object({
          selector: Primitive.Hex,
          to: Primitive.Address,
          type: Type.Literal('call'),
        }),
        Type.Object({
          limit: Primitive.BigInt,
          period: Type.Union([
            Type.Literal('minute'),
            Type.Literal('hour'),
            Type.Literal('day'),
            Type.Literal('week'),
            Type.Literal('month'),
            Type.Literal('year'),
          ]),
          token: Schema.Optional(Primitive.Address),
          type: Type.Literal('spend'),
        }),
      ]),
      {
        minItems: 2,
      },
    ),
    publicKey: Primitive.Hex,
    role: Type.Union([Type.Literal('admin'), Type.Literal('normal')]),
    type: Type.Union([
      Type.Literal('p256'),
      Type.Literal('secp256k1'),
      Type.Literal('webauthnp256'),
    ]),
  })

  export const Response = Type.Intersect([
    Request,
    Type.Object({
      hash: Primitive.Hex,
    }),
  ])
}
