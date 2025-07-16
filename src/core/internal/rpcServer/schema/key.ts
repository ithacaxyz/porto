/**
 * RPC account key.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/types/key.rs
 */

import * as Schema from 'effect/Schema'
import * as Primitive from '../../schema/primitive.js'
import * as Permission from './permission.js'

export const Key = Schema.Struct({
  /** The expiry of the key. */
  expiry: Primitive.Number,
  /** Whether the digest was prehashed. */
  prehash: Schema.optional(Schema.Boolean),
  /** Public key. */
  publicKey: Primitive.Hex,
  /** Role. */
  role: Schema.Union(Schema.Literal('admin'), Schema.Literal('normal')),
  /** Key type. */
  type: Schema.Union(
    Schema.Literal('p256'),
    Schema.Literal('secp256k1'),
    Schema.Literal('webauthnp256'),
  ),
})
export type Key = typeof Key.Type

export const WithPermissions = Schema.extend(
  Key,
  Schema.Struct({
    /** Represents key permissions. */
    permissions: Schema.Array(Permission.Permission),
  }),
)
export type WithPermissions = typeof WithPermissions.Type
