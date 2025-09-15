import * as z from 'zod/mini'
import * as Key from './key.js'
import * as u from './utils.js'

export const Permissions = z.object({
  address: u.address(),
  chainId: z.optional(u.number()),
  expiry: z.number(),
  id: u.hex(),
  key: z.pick(Key.Base, { publicKey: true, type: true }),
  permissions: z.object({
    calls: Key.CallPermissions,
    signatureVerification: z.optional(Key.SignatureVerificationPermission),
    spend: z.optional(Key.SpendPermissions),
  }),
})
export type Permissions = z.infer<typeof Permissions>

export const Request = z.object({
  address: z.optional(u.address()),
  chainId: z.optional(u.number()),
  expiry: z.number().check(z.gte(1)),
  feeToken: z.nullable(Key.FeeToken),
  key: z.optional(z.pick(Key.Base, { publicKey: true, type: true })),
  permissions: z.object({
    calls: Key.CallPermissions,
    signatureVerification: z.optional(Key.SignatureVerificationPermission),
    spend: z.optional(Key.SpendPermissions),
  }),
})
export type Request = z.infer<typeof Request>
