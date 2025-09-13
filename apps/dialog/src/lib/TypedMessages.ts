import * as u from 'porto/core/internal/schema/utils.js'
import * as z from 'zod/mini'

const SchemaAddress = z.templateLiteral(['0x', z.string()])
const SchemaNumberish = z.union([
  z.number(),
  z.bigint(),
  z.string().check(z.regex(/^\d+$/)),
])

// EIP-712
export const TypedMessageSchema = z.object({
  domain: z.object({
    chainId: z.optional(SchemaNumberish),
    name: z.optional(z.string()),
    salt: z.optional(z.string()),
    verifyingContract: z.optional(SchemaAddress),
    version: z.optional(z.string()),
  }),
  message: z.record(z.string(), z.unknown()),
  primaryType: z.string(),
  types: z.record(
    z.string(),
    z.array(
      z.object({
        name: z.string(),
        type: z.string(),
      }),
    ),
  ),
})
export const isTypedMessage = (message: unknown) =>
  u.is(TypedMessageSchema, message)

// ERC-2612 (Permit)
export const PermitSchema = z.object({
  ...TypedMessageSchema.shape,
  domain: z.object({
    ...TypedMessageSchema.shape.domain.shape,
    chainId: SchemaNumberish,
    verifyingContract: SchemaAddress,
  }),
  message: z.object({
    deadline: z.string(),
    nonce: z.string(),
    owner: SchemaAddress,
    spender: SchemaAddress,
    value: z.string(),
  }),
  primaryType: z.literal('Permit'),
})
export const isPermit = (message: unknown) => u.is(PermitSchema, message)

// Permit2
export const Permit2Schema = z.object({
  ...TypedMessageSchema.shape,
  domain: z.object({
    ...TypedMessageSchema.shape.domain.shape,
    name: z.literal('Permit2'),
  }),
  message: z.object({
    details: z.object({
      amount: SchemaNumberish,
      expiration: SchemaNumberish,
      nonce: SchemaNumberish,
      token: SchemaAddress,
    }),
    sigDeadline: SchemaNumberish,
    spender: SchemaAddress,
  }),
  primaryType: z.literal('PermitSingle'),
})
export const isPermit2 = (message: unknown) => u.is(Permit2Schema, message)
