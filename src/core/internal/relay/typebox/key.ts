/**
 * Relay key.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/types/key.rs
 */

import * as Primitive from '../../typebox/primitive.js'
import type * as Schema from '../../typebox/schema.js'
import { Type } from '../../typebox/schema.js'
import * as Permission from './permission.js'

export const Key = Type.Object({
  /** The expiry of the key. */
  expiry: Primitive.Number,
  /** Public key. */
  publicKey: Primitive.Hex,
  /** Role. */
  role: Type.Union([Type.Literal('admin'), Type.Literal('normal')]),
  /** Key type. */
  type: Type.Union([
    Type.Literal('p256'),
    Type.Literal('secp256k1'),
    Type.Literal('webauthnp256'),
  ]),
})
export type Key = Schema.StaticDecode<typeof Key>

export const WithPermissions = Type.Intersect([
  /** The key to authorize or modify permissions for. */
  Key,
  /** The permissions for the key. */
  Type.Object({
    /** Represents key permissions. */
    permissions: Type.Array(Permission.Permission),
  }),
])
export type WithPermissions = Schema.StaticDecode<typeof WithPermissions>
