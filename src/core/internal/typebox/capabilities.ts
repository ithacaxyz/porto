import * as Permissions from './permissions.js'
import * as Primitive from './primitive.js'
import * as Schema from './schema.js'
import { Type } from './schema.js'

export namespace createAccount {
  export const Request = Type.Union([
    Type.Boolean(),
    Type.Object({
      chainId: Schema.Optional(Primitive.Number),
      label: Schema.Optional(Type.String()),
    }),
  ])
  export type Request = Schema.StaticDecode<typeof Request>
}

export namespace grantPermissions {
  export const Request = Permissions.Request
  export type Request = Schema.StaticDecode<typeof Request>
}

export namespace permissions {
  export const Request = Type.Object({
    id: Schema.Optional(Primitive.Hex),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Type.Array(
    Type.Object({
      address: Primitive.Address,
      chainId: Schema.Optional(Primitive.Hex),
      expiry: Type.Number(),
      id: Primitive.Hex,
      key: Type.Object({
        publicKey: Primitive.Hex,
        type: Type.String(),
      }),
      permissions: Type.Object({
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
      }),
    }),
  )
  export type Response = Schema.StaticDecode<typeof Response>
}
