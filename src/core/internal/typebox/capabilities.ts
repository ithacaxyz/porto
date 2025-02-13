import * as Permissions from './permissions.js'
import * as Primitive from './primitive.js'
import * as Schema from './schema.js'
import { Type } from './schema.js'

export const Connect = Type.Object({
  createAccount: Schema.Optional(
    Type.Union([
      Type.Boolean(),
      Type.Object({
        chainId: Schema.Optional(Primitive.Number),
        label: Schema.Optional(Type.String()),
      }),
    ]),
  ),
  grantPermissions: Schema.Optional(Permissions.Request),
})

export const SendCalls = Type.Object({
  permissions: Schema.Optional(
    Type.Object({
      id: Schema.Optional(Primitive.Hex),
    }),
  ),
})
