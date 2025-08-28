import * as Schema from 'effect/Schema'

const SchemaAddress = Schema.TemplateLiteral('0x', Schema.String)

// EIP-712
export const TypedMessageSchema = Schema.Struct({
  domain: Schema.Struct({
    chainId: Schema.optional(Schema.Union(Schema.Number, Schema.BigInt)),
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

// ERC-2612
export const PermitSchema = Schema.Struct({
  ...TypedMessageSchema.fields,
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
