import * as Schema from 'effect/Schema'
import * as FeeToken from './feeToken.js'
import * as Permissions from './permissions.js'
import * as Primitive from './primitive.js'
import { OneOf } from './schema.js'

export namespace atomic {
  export const GetCapabilitiesResponse = Schema.Struct({
    status: Schema.Union(
      Schema.Literal('supported'),
      Schema.Literal('unsupported'),
    ),
  })
  export type GetCapabilitiesResponse = typeof GetCapabilitiesResponse.Type
}

export namespace createAccount {
  export const Request = Schema.Union(
    Schema.Boolean,
    Schema.Struct({
      chainId: Schema.optional(Primitive.Number),
      label: Schema.optional(Schema.String),
    }),
  )
  export type Request = typeof Request.Type
}

export namespace signInWithEthereum {
  export const Request = OneOf(
    /** Standard EIP-4361 request object. */
    Schema.Struct({
      chainId: Schema.optional(Schema.Number),
      domain: Schema.optional(Schema.String),
      expirationTime: Schema.optional(Schema.DateFromSelf),
      issuedAt: Schema.optional(Schema.DateFromSelf),
      nonce: Schema.String,
      notBefore: Schema.optional(Schema.DateFromSelf),
      requestId: Schema.optional(Schema.String),
      resources: Schema.optional(Schema.Array(Schema.String)),
      scheme: Schema.optional(Schema.String),
      statement: Schema.optional(Schema.String),
      uri: Schema.optional(Schema.String),
      version: Schema.optional(Schema.Literal('1')),
    }),
    /**
     * EIP-4361 request object with an additional `authUrl` field, used
     * to fetch and infer the `nonce`.
     */
    Schema.Struct({
      authUrl: Schema.Union(
        Schema.String,
        Schema.Struct({
          logout: Schema.String,
          nonce: Schema.String,
          verify: Schema.String,
        }),
      ),
      chainId: Schema.optional(Schema.Number),
      domain: Schema.optional(Schema.String),
      expirationTime: Schema.optional(Schema.DateFromSelf),
      issuedAt: Schema.optional(Schema.DateFromSelf),
      notBefore: Schema.optional(Schema.DateFromSelf),
      requestId: Schema.optional(Schema.String),
      resources: Schema.optional(Schema.Array(Schema.String)),
      scheme: Schema.optional(Schema.String),
      statement: Schema.optional(Schema.String),
      uri: Schema.optional(Schema.String),
      version: Schema.optional(Schema.Literal('1')),
    }),
  )
  export type Request = typeof Request.Type

  export const Response = Schema.Struct({
    message: Schema.String,
    signature: Primitive.Hex,
    token: Schema.optional(Schema.String),
  })
  export type Response = typeof Response.Type
}

export namespace feeToken {
  export const GetCapabilitiesResponse = Schema.Struct({
    supported: Schema.Boolean,
    tokens: Schema.Array(
      Schema.Struct({
        address: Primitive.Address,
        decimals: Schema.Number,
        kind: Schema.String,
        nativeRate: Schema.optional(Primitive.BigInt),
        symbol: Schema.String,
      }),
    ),
  })
  export type GetCapabilitiesResponse = typeof GetCapabilitiesResponse.Type

  export const Request = Schema.Union(FeeToken.Symbol, Primitive.Address)
  export type Request = typeof Request.Type
}

export namespace grantPermissions {
  export const Request = Permissions.Request
  export type Request = typeof Request.Type
}

export namespace merchant {
  export const GetCapabilitiesResponse = Schema.Struct({
    supported: Schema.Boolean,
  })
  export type GetCapabilitiesResponse = typeof GetCapabilitiesResponse.Type
}

export namespace permissions {
  export const GetCapabilitiesResponse = Schema.Struct({
    supported: Schema.Boolean,
  })
  export type GetCapabilitiesResponse = typeof GetCapabilitiesResponse.Type

  export const Request = Schema.Struct({
    id: Schema.optional(Primitive.Hex),
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Array(Permissions.Permissions)
  export type Response = typeof Response.Type
}

export namespace preCalls {
  export const Request = Schema.Array(
    Schema.Struct({
      context: Schema.Unknown,
      signature: Primitive.Hex,
    }),
  )
  export type Request = typeof Request.Type

  export const Response = Request
  export type Response = typeof Response.Type
}

export namespace merchantRpcUrl {
  export const Request = Schema.String
  export type Request = typeof Request.Type
}
