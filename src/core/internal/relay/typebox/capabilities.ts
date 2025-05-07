/**
 * Relay capabilities.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/types/capabilities.rs
 */

import * as Primitive from '../../typebox/primitive.js'
import * as Schema from '../../typebox/schema.js'
import { Type } from '../../typebox/schema.js'
import * as Key from './key.js'

export namespace authorizeKeys {
  /** Represents a key authorization request. */
  export const Request = Type.Array(Key.WithPermissions)
  export type Request = Schema.StaticDecode<typeof Request>

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
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace meta {
  /** Represents metadata for a call bundle. */
  export const Request = Type.Object({
    /** The address of the fee payer. */
    feePayer: Schema.Optional(Primitive.Address),
    /** The token to pay for the call bundle. If `None`, defaults to native token (ETH). */
    feeToken: Schema.Optional(Primitive.Address),
    /** The hash of the key that will be used to sign over the bundle. */
    keyHash: Primitive.Hex,
    /** The nonce for the bundle. */
    nonce: Schema.Optional(Primitive.BigInt),
  })
  export type Request = Schema.StaticDecode<typeof Request>
}

export namespace revokeKeys {
  /** Represents a key revocation request. */
  export const Request = Type.Array(
    Type.Object({
      /** The hash of the key to revoke. */
      hash: Primitive.Hex,
    }),
  )
  export type Request = Schema.StaticDecode<typeof Request>

  /** Represents a key revocation response. */
  export const Response = Type.Array(
    Type.Object({
      /** The hash of the revoked key. */
      hash: Primitive.Hex,
    }),
  )
  export type Response = Schema.StaticDecode<typeof Response>
}
