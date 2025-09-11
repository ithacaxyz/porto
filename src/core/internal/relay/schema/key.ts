/**
 * RPC account key.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/types/key.rs
 */

import * as z from 'zod/mini'
import * as u from '../../schema/utils.js'
import * as Permission from './permission.js'

export const Key = z.object({
  /** The expiry of the key. */
  expiry: u.number(),
  /** Whether the digest was prehashed. */
  prehash: z.optional(z.boolean()),
  /** Public key. */
  publicKey: u.hex(),
  /** Role. */
  role: z.union([z.literal('admin'), z.literal('normal')]),
  /** Key type. */
  type: z.union([
    z.literal('p256'),
    z.literal('secp256k1'),
    z.literal('webauthnp256'),
  ]),
})
export type Key = z.infer<typeof Key>

export const WithPermissions = z.object({
  ...Key.shape,
  /** Represents key permissions. */
  permissions: z.readonly(z.array(Permission.Permission)),
})
export type WithPermissions = z.infer<typeof WithPermissions>
