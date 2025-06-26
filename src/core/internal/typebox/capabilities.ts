import * as FeeToken from './feeToken.js'
import * as Permissions from './permissions.js'
import * as Primitive from './primitive.js'
import * as Typebox from './typebox.js'
import { Type } from './typebox.js'

export namespace atomic {
  export const GetCapabilitiesResponse = Type.Object({
    status: Type.Union([
      Type.Literal('supported'),
      Type.Literal('unsupported'),
    ]),
  })
  export type GetCapabilitiesResponse = Typebox.StaticDecode<
    typeof GetCapabilitiesResponse
  >
}

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

export namespace signInWithEthereum {
  export const Request = Type.Object({
    chainId: Type.Number(),
    domain: Typebox.Optional(Type.String()),
    expirationTime: Typebox.Optional(Type.Date()),
    issuedAt: Typebox.Optional(Type.Date()),
    nonce: Type.String(),
    notBefore: Typebox.Optional(Type.Date()),
    requestId: Typebox.Optional(Type.String()),
    resources: Typebox.Optional(Type.Array(Type.String())),
    scheme: Typebox.Optional(Type.String()),
    statement: Typebox.Optional(Type.String()),
    uri: Typebox.Optional(Type.String()),
    version: Typebox.Optional(Type.Literal('1')),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Object({
    message: Type.String(),
    signature: Primitive.Hex,
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace feeToken {
  export const GetCapabilitiesResponse = Type.Object({
    supported: Type.Boolean(),
    tokens: Type.Array(
      Type.Object({
        address: Primitive.Address,
        decimals: Type.Number(),
        kind: Type.String(),
        nativeRate: Typebox.Optional(Primitive.BigInt),
        symbol: Type.String(),
      }),
    ),
  })
  export type GetCapabilitiesResponse = Typebox.StaticDecode<
    typeof GetCapabilitiesResponse
  >

  export const Request = Type.Union([FeeToken.Symbol, Primitive.Address])
  export type Request = Typebox.StaticDecode<typeof Request>
}

export namespace grantPermissions {
  export const Request = Permissions.Request
  export type Request = Typebox.StaticDecode<typeof Request>
}

export namespace merchant {
  export const GetCapabilitiesResponse = Type.Object({
    supported: Type.Boolean(),
  })
  export type GetCapabilitiesResponse = Typebox.StaticDecode<
    typeof GetCapabilitiesResponse
  >
}

export namespace permissions {
  export const GetCapabilitiesResponse = Type.Object({
    supported: Type.Boolean(),
  })
  export type GetCapabilitiesResponse = Typebox.StaticDecode<
    typeof GetCapabilitiesResponse
  >

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

export namespace merchantRpcUrl {
  export const Request = Type.String()
  export type Request = Typebox.StaticDecode<typeof Request>
}
