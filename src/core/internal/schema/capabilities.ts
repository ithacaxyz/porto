<<<<<<< HEAD
import * as z from 'zod/mini'
||||||| parent of bc3f8c7c (refactor: `Tokens` module)
import * as Schema from 'effect/Schema'
import * as FeeToken from './feeToken.js'
=======
import * as Schema from 'effect/Schema'
>>>>>>> bc3f8c7c (refactor: `Tokens` module)
import * as Token from '../schema/token.js'
import * as Permissions from './permissions.js'
import * as u from './utils.js'

export namespace atomic {
  export const GetCapabilitiesResponse = z.object({
    status: z.union([z.literal('supported'), z.literal('unsupported')]),
  })
  export type GetCapabilitiesResponse = z.infer<typeof GetCapabilitiesResponse>
}

export namespace createAccount {
  export const Request = z.union([
    z.boolean(),
    z.object({
      chainId: z.optional(u.number()),
      label: z.optional(z.string()),
    }),
  ])
  export type Request = z.infer<typeof Request>
}

export namespace signInWithEthereum {
  export const Request = u.oneOf([
    /** Standard EIP-4361 request object. */
    z.object({
      chainId: z.optional(z.number()),
      domain: z.optional(z.string()),
      expirationTime: z.optional(z.date()),
      issuedAt: z.optional(z.date()),
      nonce: z.string(),
      notBefore: z.optional(z.date()),
      requestId: z.optional(z.string()),
      resources: z.optional(z.readonly(z.array(z.string()))),
      scheme: z.optional(z.string()),
      statement: z.optional(z.string()),
      uri: z.optional(z.string()),
      version: z.optional(z.literal('1')),
    }),
    /**
     * EIP-4361 request object with an additional `authUrl` field, used
     * to fetch and infer the `nonce`.
     */
    z.object({
      authUrl: z.union([
        z.string(),
        z.object({
          logout: z.string(),
          nonce: z.string(),
          verify: z.string(),
        }),
      ]),
      chainId: z.optional(u.number()),
      domain: z.optional(z.string()),
      expirationTime: z.optional(z.date()),
      issuedAt: z.optional(z.date()),
      notBefore: z.optional(z.date()),
      requestId: z.optional(z.string()),
      resources: z.optional(z.readonly(z.array(z.string()))),
      scheme: z.optional(z.string()),
      statement: z.optional(z.string()),
      uri: z.optional(z.string()),
      version: z.optional(z.literal('1')),
    }),
  ])
  export type Request = z.infer<typeof Request>

  export const Response = z.object({
    message: z.string(),
    signature: u.hex(),
    token: z.optional(z.string()),
  })
  export type Response = z.infer<typeof Response>
}

export namespace feeToken {
<<<<<<< HEAD
  export const GetCapabilitiesResponse = z.object({
    supported: z.boolean(),
    tokens: z.readonly(z.array(Token.Token)),
||||||| parent of bc3f8c7c (refactor: `Tokens` module)
  export const GetCapabilitiesResponse = Schema.Struct({
    supported: Schema.Boolean,
    tokens: Schema.Array(
      Schema.Struct({
        address: Primitive.Address,
        decimals: Schema.Number,
        interop: Schema.optional(Schema.Boolean),
        nativeRate: Schema.optional(Primitive.BigInt),
        symbol: Schema.String,
        uid: Schema.String,
      }),
    ),
=======
  export const GetCapabilitiesResponse = Schema.Struct({
    supported: Schema.Boolean,
    tokens: Schema.Array(Token.Token),
>>>>>>> bc3f8c7c (refactor: `Tokens` module)
  })
  export type GetCapabilitiesResponse = z.infer<typeof GetCapabilitiesResponse>

<<<<<<< HEAD
  export const Request = z.union([Token.Symbol, u.address()])
  export type Request = z.infer<typeof Request>
||||||| parent of bc3f8c7c (refactor: `Tokens` module)
  export const Request = Schema.Union(FeeToken.Symbol, Primitive.Address)
  export type Request = typeof Request.Type
=======
  export const Request = Schema.Union(Token.Symbol, Primitive.Address)
  export type Request = typeof Request.Type
>>>>>>> bc3f8c7c (refactor: `Tokens` module)
}

export namespace grantPermissions {
  export const Request = Permissions.Request
  export type Request = z.infer<typeof Request>
}

export namespace merchant {
  export const GetCapabilitiesResponse = z.object({
    supported: z.boolean(),
  })
  export type GetCapabilitiesResponse = z.infer<typeof GetCapabilitiesResponse>
}

export namespace permissions {
  export const GetCapabilitiesResponse = z.object({
    supported: z.boolean(),
  })
  export type GetCapabilitiesResponse = z.infer<typeof GetCapabilitiesResponse>

  export const Request = z.object({
    id: z.optional(z.union([u.hex(), z.null()])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.readonly(z.array(Permissions.Permissions))
  export type Response = z.infer<typeof Response>
}

export namespace preCalls {
  export const Request = z.readonly(
    z.array(
      z.object({
        context: z.unknown(),
        signature: u.hex(),
      }),
    ),
  )
  export type Request = z.infer<typeof Request>

  export const Response = Request
  export type Response = z.infer<typeof Response>
}

export namespace merchantUrl {
  export const Request = z.string()
  export type Request = z.infer<typeof Request>
}

export namespace requiredFunds {
<<<<<<< HEAD
  export const GetCapabilitiesResponse = z.object({
    supported: z.boolean(),
    tokens: z.readonly(z.array(Token.Token)),
||||||| parent of bc3f8c7c (refactor: `Tokens` module)
  export const GetCapabilitiesResponse = Schema.Struct({
    supported: Schema.Boolean,
    tokens: Schema.Array(
      Schema.Struct({
        address: Primitive.Address,
        decimals: Schema.Number,
        interop: Schema.optional(Schema.Boolean),
        nativeRate: Schema.optional(Primitive.BigInt),
        symbol: Schema.String,
        uid: Schema.String,
      }),
    ),
=======
  export const GetCapabilitiesResponse = Schema.Struct({
    supported: Schema.Boolean,
    tokens: Schema.Array(Token.Token),
>>>>>>> bc3f8c7c (refactor: `Tokens` module)
  })
  export type GetCapabilitiesResponse = z.infer<typeof GetCapabilitiesResponse>

<<<<<<< HEAD
  export const Request = z.readonly(
    z.array(
      u.oneOf([
        z.object({
          address: u.address(),
          value: u.bigint(),
        }),
        z.object({
          symbol: Token.Symbol,
          value: z
            .union([
              z.templateLiteral([z.number(), '.', z.number()]),
              z.templateLiteral([z.number()]),
            ])
            .check(z.regex(/^\d+(\.\d+)?$/)),
        }),
      ]),
||||||| parent of bc3f8c7c (refactor: `Tokens` module)
  export const Request = Schema.Array(
    OneOf(
      Schema.Struct({
        address: Primitive.Address,
        value: Primitive.BigInt,
      }),
      Schema.Struct({
        symbol: FeeToken.Symbol,
        value: Schema.Union(
          Schema.TemplateLiteral(Schema.Number, '.', Schema.Number),
          Schema.TemplateLiteral(Schema.Number),
        ).pipe(Schema.pattern(/^\d+(\.\d+)?$/)),
      }),
=======
  export const Request = Schema.Array(
    OneOf(
      Schema.Struct({
        address: Primitive.Address,
        value: Primitive.BigInt,
      }),
      Schema.Struct({
        symbol: Token.Symbol,
        value: Schema.Union(
          Schema.TemplateLiteral(Schema.Number, '.', Schema.Number),
          Schema.TemplateLiteral(Schema.Number),
        ).pipe(Schema.pattern(/^\d+(\.\d+)?$/)),
      }),
>>>>>>> bc3f8c7c (refactor: `Tokens` module)
    ),
  )
  export type Request = z.infer<typeof Request>
}
