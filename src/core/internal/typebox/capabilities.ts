import * as Permissions from './permissions.js'
import * as Primitive from './primitive.js'
import * as Typebox from './typebox.js'
import { Type } from './typebox.js'

export namespace createAccount {
  export const Request = Type.Union([
    Type.Boolean(),
    Type.Object({
      chainId: Typebox.Optional(Primitive.Number),
      label: Typebox.Optional(Type.String()),
    }),
  ])
  export type Request = Typebox.StaticDecode<typeof Request>
}

export namespace grantPermissions {
  export const Request = Permissions.Request
  export type Request = Typebox.StaticDecode<typeof Request>
}

export namespace permissions {
  export const Request = Type.Object({
    id: Typebox.Optional(Primitive.Hex),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Array(Permissions.Permissions)
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace preCalls {
  export const Request = Type.Array(
    Type.Object({
      context: Type.Unknown(),
      signature: Primitive.Hex,
    }),
  )
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Request
  export type Response = Typebox.StaticDecode<typeof Response>
}
