import * as Schema from 'effect/Schema'
import * as FeeToken from './feeToken.js'
import * as Key from './key.js'
import * as Primitive from './primitive.js'

export const Permissions = Schema.Struct({
  address: Primitive.Address,
  chainId: Schema.optional(Primitive.Number),
  expiry: Schema.Number,
  id: Primitive.Hex,
  key: Key.Base.pick('publicKey', 'type'),
  permissions: Schema.Struct({
    calls: Key.CallPermissions,
    signatureVerification: Schema.optional(Key.SignatureVerificationPermission),
    spend: Schema.optional(Key.SpendPermissions),
  }),
})
export type Permissions = typeof Permissions.Type

export const Request = Schema.Struct({
  address: Schema.optional(Primitive.Address),
  chainId: Schema.optional(Primitive.Number),
  expiry: Schema.Number.pipe(Schema.greaterThanOrEqualTo(1)),
  feeLimit: Schema.optional(
    Schema.Union(
      Schema.Struct({
        currency: Schema.Union(FeeToken.Kind),
        value: Schema.Union(
          Schema.TemplateLiteral(Schema.Number, '.', Schema.Number),
          Schema.TemplateLiteral(Schema.Number),
        ).pipe(Schema.pattern(/^\d+(\.\d+)?$/)),
      }),
      Schema.Null,
    ),
  ),
  key: Schema.optional(Key.Base.pick('publicKey', 'type')),
  permissions: Schema.Struct({
    calls: Key.CallPermissions,
    signatureVerification: Schema.optional(Key.SignatureVerificationPermission),
    spend: Schema.optional(Key.SpendPermissions),
  }),
})
export type Request = typeof Request.Type
