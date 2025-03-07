// Ref: https://github.com/ithacaxyz/relay/blob/main/src/types/capabilities.rs

import * as Primitive from '../../typebox/primitive.js'
import * as Schema from '../../typebox/schema.js'
import { Type } from '../../typebox/schema.js'
import * as Key from './key.js'

export namespace authorizeKeys {
  /** Represents a key authorization request. */
  export const Request = Type.Array(
    Type.Intersect([
      /** The key to authorize or modify permissions for. */
      Key.Key,
      /** The permissions for the key. */
      Type.Object({
        /** Represents key permissions. */
        permissions: Type.Array(
          Type.Union([
            /** Call permission. */
            Type.Object({
              /** The selector of the function this permission applies to. */
              selector: Primitive.Hex,
              /** The address of the contract this permission applies to. */
              to: Primitive.Address,
              /** Permission type. */
              type: Type.Literal('call'),
            }),

            /** Spend permission. */
            Type.Object({
              /** The maximum amount that can be spent in the given period. */
              limit: Primitive.BigInt,
              /** The period of the limit. */
              period: Type.Union([
                Type.Literal('minute'),
                Type.Literal('hour'),
                Type.Literal('day'),
                Type.Literal('week'),
                Type.Literal('month'),
                Type.Literal('year'),
              ]),
              /** The token this permission applies to. If `None`, defaults to native token (ETH). */
              token: Schema.Optional(Primitive.Address),
              /** Permission type. */
              type: Type.Literal('spend'),
            }),
          ]),
          {
            minItems: 2,
          },
        ),
      }),
    ]),
  )

  /** Represents a key authorization response. */
  export const Response = Type.Array(
    Type.Intersect([
      Request.items,
      Type.Object({
        /** The hash of the authorized key. */
        hash: Primitive.Hex,
      }),
    ]),
  )
}

export namespace meta {
  /** Represents metadata for a call bundle. */
  export const Request = Type.Object({
    /** The token to pay for the call bundle. If `None`, defaults to native token (ETH). */
    feeToken: Schema.Optional(Primitive.Address),
    /** The hash of the key that will be used to sign over the bundle. */
    keyHash: Primitive.Hex,
    /** The nonce for the bundle. */
    nonce: Primitive.BigInt,
  })
}

export namespace revokeKeys {
  /** Represents a key revocation request. */
  export const Request = Type.Array(
    Type.Object({
      /** The hash of the key to revoke. */
      hash: Primitive.Hex,
    }),
  )

  /** Represents a key revocation response. */
  export const Response = Type.Array(
    Type.Object({
      /** The hash of the revoked key. */
      hash: Primitive.Hex,
    }),
  )
}
