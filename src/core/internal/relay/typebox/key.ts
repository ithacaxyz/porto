/**
 * Relay key.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/types/key.rs
 */

import * as Primitive from '../../typebox/primitive.js'
import { Type } from '../../typebox/schema.js'

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
