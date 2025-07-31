/**
 * RPC capabilities.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/types/capabilities.rs
 */

import * as Schema from 'effect/Schema'
import * as Primitive from '../../schema/primitive.js'
import * as Key from './key.js'

export namespace assetDiffs {
  export const AssetDiffAsset = Schema.Union(
    Schema.Struct({
      address: Schema.optional(Schema.Union(Primitive.Address, Schema.Null)),
      decimals: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
      direction: Schema.Union(
        Schema.Literal('incoming'),
        Schema.Literal('outgoing'),
      ),
      fiat: Schema.optional(
        Schema.Struct({
          currency: Schema.String,
          value: Schema.transform(Schema.String, Schema.Number, {
            decode: (value) => Number(value),
            encode: (value) => String(value),
          }),
        }),
      ),
      name: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      symbol: Schema.String,
      type: Schema.Literal('erc20'),
      value: Primitive.BigInt,
    }),
    Schema.Struct({
      address: Schema.optional(Schema.Union(Primitive.Address, Schema.Null)),
      direction: Schema.Union(
        Schema.Literal('incoming'),
        Schema.Literal('outgoing'),
      ),
      fiat: Schema.optional(
        Schema.Struct({
          currency: Schema.String,
          value: Schema.transform(Schema.String, Schema.Number, {
            decode: (value) => Number(value),
            encode: (value) => String(value),
          }),
        }),
      ),
      name: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      symbol: Schema.String,
      type: Schema.Literal('erc721'),
      uri: Schema.String,
      value: Primitive.BigInt,
    }),
    Schema.Struct({
      address: Schema.Null,
      decimals: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
      direction: Schema.Union(
        Schema.Literal('incoming'),
        Schema.Literal('outgoing'),
      ),
      fiat: Schema.optional(
        Schema.Struct({
          currency: Schema.String,
          value: Schema.transform(Schema.String, Schema.Number, {
            decode: (value) => Number(value),
            encode: (value) => String(value),
          }),
        }),
      ),
      symbol: Schema.String,
      type: Schema.Null,
      value: Primitive.BigInt,
    }),
  )
  export type AssetDiffAsset = typeof AssetDiffAsset.Type

  export const Response = Schema.Record({
    key: Primitive.Hex,
    value: Schema.Array(
      Schema.Tuple(Primitive.Address, Schema.Array(AssetDiffAsset)),
    ),
  })
  export type Response = typeof Response.Type
}

export namespace authorizeKeys {
  /** Represents a key authorization request. */
  export const Request = Schema.Array(Key.WithPermissions)
  export type Request = typeof Request.Type

  /** Represents a key authorization response. */
  export const Response = Schema.Array(
    Schema.extend(
      Key.WithPermissions,
      Schema.Struct({
        /** The hash of the authorized key. */
        hash: Primitive.Hex,
      }),
    ),
  )
  export type Response = typeof Response.Type
}

export namespace feeTotals {
  export const Response = Schema.Array(
    Schema.Struct({
      address: Primitive.Address,
      value: Primitive.BigInt,
    }),
  )
  export type Response = typeof Response.Type
}

export namespace meta {
  /** Represents metadata for a call bundle. */
  export const Request = Schema.Struct({
    /** The address of the fee payer. */
    feePayer: Schema.optional(Primitive.Address),
    /** The token to pay for the call bundle. If `None`, defaults to native token (ETH). */
    feeToken: Schema.optional(Primitive.Address),
    /** The nonce for the bundle. */
    nonce: Schema.optional(Primitive.BigInt),
  })
  export type Request = typeof Request.Type
}

export namespace requiredFunds {
  export const Request = Schema.Array(
    Schema.Struct({
      address: Primitive.Address,
      value: Primitive.BigInt,
    }),
  )
  export type Request = typeof Request.Type
}

export namespace revokeKeys {
  /** Represents a key revocation request. */
  export const Request = Schema.Array(
    Schema.Struct({
      /** The hash of the key to revoke. */
      hash: Primitive.Hex,
    }),
  )
  export type Request = typeof Request.Type

  /** Represents a key revocation response. */
  export const Response = Schema.Array(
    Schema.Struct({
      /** The hash of the revoked key. */
      hash: Primitive.Hex,
    }),
  )
  export type Response = typeof Response.Type
}
