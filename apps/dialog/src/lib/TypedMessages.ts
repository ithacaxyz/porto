import * as Schema from 'effect/Schema'

export const TypedMessageSchema = Schema.Struct({
  domain: Schema.Struct({
    chainId: Schema.optional(Schema.Union(Schema.Number, Schema.BigInt)),
    name: Schema.optional(Schema.String),
    salt: Schema.optional(Schema.String),
    verifyingContract: Schema.optional(Schema.String),
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

export const PermitSchema = Schema.Struct({
  ...TypedMessageSchema.fields,
  message: Schema.Struct({
    deadline: Schema.String,
    nonce: Schema.String,
    owner: Schema.String,
    spender: Schema.String,
    value: Schema.String,
  }),
  primaryType: Schema.Literal('Permit'),
})
export const isPermit = Schema.is(PermitSchema)
