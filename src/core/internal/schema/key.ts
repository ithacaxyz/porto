import * as z from 'zod/mini'
import * as Token from './token.js'
import * as u from './utils.js'

export const Base = z.object({
  /** Chain ID the key belongs to. If not provided, the key is valid on all chains. */
  chainId: z.optional(u.number()),
  /** The expiry of the key. */
  expiry: u.number(),
  /** The hash of the key. */
  hash: u.hex(),
  /** The id of the key. */
  id: u.hex(),
  /** Whether digests should be prehashed. */
  prehash: z.optional(z.boolean()),
  /** Public key. */
  publicKey: u.hex(),
  /** Role. */
  role: z.union([z.literal('admin'), z.literal('session')]),
  /** Key type. */
  type: z.union([
    z.literal('address'),
    z.literal('p256'),
    z.literal('secp256k1'),
    z.literal('webauthn-p256'),
  ]),
})
export type Base = z.infer<typeof Base>

export const CallPermissions = z.readonly(
  z
    .array(
      u.oneOf([
        z.object({
          signature: z.string(),
          to: u.address(),
        }),
        z.object({
          signature: z.string(),
        }),
        z.object({
          to: u.address(),
        }),
      ]),
    )
    .check(z.minLength(1)),
)
export type CallPermissions = z.infer<typeof CallPermissions>

export const FeeToken = z.object({
  limit: z
    .union([
      z.templateLiteral([z.number(), '.', z.number()]),
      z.templateLiteral([z.number()]),
    ])
    .check(z.regex(/^\d+(\.\d+)?$/)),
  symbol: z.optional(z.union([z.literal('native'), Token.Symbol])),
})
export type FeeToken = z.infer<typeof FeeToken>

export const SignatureVerificationPermission = z.object({
  addresses: z.readonly(z.array(u.address())),
})
export type SignatureVerificationPermission = z.infer<
  typeof SignatureVerificationPermission
>

export const SpendPermissions = z.readonly(
  z.array(
    z.object({
      limit: u.bigint(),
      period: z.union([
        z.literal('minute'),
        z.literal('hour'),
        z.literal('day'),
        z.literal('week'),
        z.literal('month'),
        z.literal('year'),
      ]),
      token: z.optional(u.address()),
    }),
  ),
)
export type SpendPermissions = z.infer<typeof SpendPermissions>

export const Permissions = z.object({
  calls: z.optional(CallPermissions),
  signatureVerification: z.optional(SignatureVerificationPermission),
  spend: z.optional(SpendPermissions),
})
export type Permissions = z.infer<typeof Permissions>

export const WithPermissions = z.object({
  ...Base.shape,
  feeToken: z.optional(z.nullable(FeeToken)),
  permissions: z.optional(Permissions),
})
export type WithPermissions = z.infer<typeof WithPermissions>
