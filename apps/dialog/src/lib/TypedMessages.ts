import * as Schema from 'effect/Schema'

const SchemaAddress = Schema.TemplateLiteral('0x', Schema.String)
const SchemaNumberish = Schema.Union(
  Schema.Number,
  Schema.BigInt,
  Schema.String.pipe(Schema.pattern(/^\d+$/)),
)

// EIP-712
export const TypedMessageSchema = Schema.Struct({
  domain: Schema.Struct({
    chainId: Schema.optional(SchemaNumberish),
    name: Schema.optional(Schema.String),
    salt: Schema.optional(Schema.String),
    verifyingContract: Schema.optional(SchemaAddress),
    version: Schema.optional(Schema.String),
  }),
  message: Schema.Record({
    key: Schema.String,
    value: Schema.Unknown,
  }),
  primaryType: Schema.String,
  types: Schema.Record({
    key: Schema.String,
    value: Schema.Array(
      Schema.Struct({
        name: Schema.String,
        type: Schema.String,
      }),
    ),
  }),
})
export const isTypedMessage = Schema.is(TypedMessageSchema)

// ERC-2612 (Permit)
export const PermitSchema = Schema.Struct({
  ...TypedMessageSchema.fields,
  domain: Schema.Struct({
    ...TypedMessageSchema.fields.domain.fields,
    chainId: SchemaNumberish,
    verifyingContract: SchemaAddress,
  }),
  message: Schema.Struct({
    deadline: Schema.String,
    nonce: Schema.String,
    owner: SchemaAddress,
    spender: SchemaAddress,
    value: Schema.String,
  }),
  primaryType: Schema.Literal('Permit'),
})
export const isPermit = Schema.is(PermitSchema)

// Permit2
export const Permit2Schema = Schema.Struct({
  ...TypedMessageSchema.fields,
  domain: Schema.Struct({
    ...TypedMessageSchema.fields.domain.fields,
    name: Schema.Literal('Permit2'),
  }),
  message: Schema.Struct({
    details: Schema.Struct({
      amount: SchemaNumberish,
      expiration: SchemaNumberish,
      nonce: SchemaNumberish,
      token: SchemaAddress,
    }),
    sigDeadline: SchemaNumberish,
    spender: SchemaAddress,
  }),
  primaryType: Schema.Literal('PermitSingle'),
})
export const isPermit2 = Schema.is(Permit2Schema)
