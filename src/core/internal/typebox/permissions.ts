import * as Primitive from './primitive.js'
import * as Schema from './schema.js'
import { Type } from './schema.js'

export const Permissions = Type.Object({
  address: Primitive.Address,
  chainId: Schema.Optional(Primitive.Number),
  expiry: Type.Number(),
  id: Primitive.Hex,
  key: Type.Object({
    publicKey: Primitive.Hex,
    type: Type.Union([
      Type.Literal('p256'),
      Type.Literal('secp256k1'),
      Type.Literal('webauthn-p256'),
      Type.Literal('contract'),
    ]),
  }),
  permissions: Type.Object(
    {
      calls: Schema.Optional(
        Type.Array(
          Type.Union([
            Type.Object({
              signature: Type.String(),
              to: Primitive.Address,
            }),
            Type.Object({
              signature: Type.String(),
            }),
            Type.Object({
              to: Primitive.Address,
            }),
          ]),
        ),
      ),
      signatureVerification: Schema.Optional(
        Type.Object({
          addresses: Type.Array(Primitive.Address),
        }),
      ),
      spend: Schema.Optional(
        Type.Array(
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
          }),
        ),
      ),
    },
    { minProperties: 1 },
  ),
})

export const Request = Type.Object({
  address: Schema.Optional(Primitive.Address),
  chainId: Schema.Optional(Primitive.Number),
  expiry: Type.Number({ minimum: 1 }),
  key: Schema.Optional(Permissions.properties.key),
  permissions: Permissions.properties.permissions,
})
