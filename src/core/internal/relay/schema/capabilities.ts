/**
 * RPC capabilities.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/types/capabilities.rs
 */

import * as z from 'zod/mini'
import * as u from '../../schema/utils.js'
import * as Key from './key.js'

export namespace assetDiffs {
  export const AssetDiffAsset = z.union([
    z.object({
      address: z.optional(z.union([u.address(), z.null()])),
      decimals: z.optional(z.union([z.number(), z.null()])),
      direction: z.union([z.literal('incoming'), z.literal('outgoing')]),
      fiat: z.optional(
        z.object({
          currency: z.string(),
          value: z.codec(z.string(), z.number(), {
            decode: (value) => Number(value),
            encode: (value) => String(value),
          }),
        }),
      ),
      name: z.optional(z.union([z.string(), z.null()])),
      symbol: z.string(),
      type: z.literal('erc20'),
      value: u.bigint(),
    }),
    z.object({
      address: z.optional(z.union([u.address(), z.null()])),
      direction: z.union([z.literal('incoming'), z.literal('outgoing')]),
      fiat: z.optional(
        z.object({
          currency: z.string(),
          value: z.codec(z.string(), z.number(), {
            decode: (value) => Number(value),
            encode: (value) => String(value),
          }),
        }),
      ),
      name: z.optional(z.union([z.string(), z.null()])),
      symbol: z.string(),
      type: z.literal('erc721'),
      uri: z.string(),
      value: u.bigint(),
    }),
    z.object({
      address: z.null(),
      decimals: z.optional(z.union([z.number(), z.null()])),
      direction: z.union([z.literal('incoming'), z.literal('outgoing')]),
      fiat: z.optional(
        z.object({
          currency: z.string(),
          value: z.codec(z.string(), z.number(), {
            decode: (value) => Number(value),
            encode: (value) => String(value),
          }),
        }),
      ),
      symbol: z.string(),
      type: z.null(),
      value: u.bigint(),
    }),
  ])
  export type AssetDiffAsset = z.infer<typeof AssetDiffAsset>

  export const Response = z.record(
    u.hex(),
    z.readonly(
      z.array(
        z.readonly(z.tuple([u.address(), z.readonly(z.array(AssetDiffAsset))])),
      ),
    ),
  )
  export type Response = z.infer<typeof Response>
}

export namespace authorizeKeys {
  /** Represents a key authorization request. */
  export const Request = z.readonly(z.array(Key.WithPermissions))
  export type Request = z.infer<typeof Request>

  /** Represents a key authorization response. */
  export const Response = z.readonly(
    z.array(
      z.object({
        ...Key.WithPermissions.shape,
        /** The hash of the authorized key. */
        hash: u.hex(),
      }),
    ),
  )
  export type Response = z.infer<typeof Response>
}

export namespace feeTotals {
  export const Response = z.record(
    u.hex(),
    z.object({
      currency: z.string(),
      value: z.string(),
    }),
  )
  export type Response = z.infer<typeof Response>
}

export namespace meta {
  /** Represents metadata for a call bundle. */
  export const Request = z.object({
    /** The address of the fee payer. */
    feePayer: z.optional(u.address()),
    /** The token to pa  for the call bundle. If `None`, defaults to native token (ETH). */
    feeToken: z.optional(u.address()),
    /** The nonce for the bundle. */
    nonce: z.optional(u.bigint()),
  })
  export type Request = z.infer<typeof Request>
}

export namespace requiredFunds {
  export const Request = z.readonly(
    z.array(
      z.object({
        address: u.address(),
        value: u.bigint(),
      }),
    ),
  )
  export type Request = z.infer<typeof Request>
}

export namespace revokeKeys {
  /** Represents a key revocation request. */
  export const Request = z.readonly(
    z.array(
      z.object({
        /** The hash of the key to revoke. */
        hash: u.hex(),
      }),
    ),
  )
  export type Request = z.infer<typeof Request>

  /** Represents a key revocation response. */
  export const Response = z.readonly(
    z.array(
      z.object({
        /** The hash of the revoked key. */
        hash: u.hex(),
      }),
    ),
  )
  export type Response = z.infer<typeof Response>
}
