import * as Primitive from '../typebox/primitive.js'
import * as Schema from '../typebox/schema.js'
import { Type } from '../typebox/schema.js'

export const Base = Type.Object({
  /** The expiry of the key. */
  expiry: Primitive.Number,
  /** The hash of the key. */
  hash: Primitive.Hex,
  /** The id of the key. */
  id: Schema.Optional(Primitive.Hex),
  /** Public key. */
  publicKey: Primitive.Hex,
  /** Role. */
  role: Type.Union([Type.Literal('admin'), Type.Literal('session')]),
  /** Key type. */
  type: Type.Union([
    Type.Literal('address'),
    Type.Literal('p256'),
    Type.Literal('secp256k1'),
    Type.Literal('webauthn-p256'),
  ]),
})
export type Base = Schema.StaticDecode<typeof Base>

export const CallPermissions = Type.Array(
  Type.Union([
    Type.Object({
      signature: Type.String(),
      to: Primitive.Address,
    }),
    Type.Object({
      signature: Type.String(),
      to: Schema.Optional(Type.Undefined()),
    }),
    Type.Object({
      signature: Schema.Optional(Type.Undefined()),
      to: Primitive.Address,
    }),
  ]),
  { minItems: 1 },
)
export type CallPermissions = Schema.StaticDecode<typeof CallPermissions>

export const SignatureVerificationPermission = Type.Object({
  addresses: Type.Array(Primitive.Address),
})
export type SignatureVerificationPermission = Schema.StaticDecode<
  typeof SignatureVerificationPermission
>

export const SpendPermissions = Type.Array(
  Type.Object({
    limit: Primitive.BigInt,
    period: Type.Union([
      Type.Literal('minute'),
      Type.Literal('hour'),
      Type.Literal('day'),
      Type.Literal('week'),
      Type.Literal('month'),
      Type.Literal('year'),
    ]),
    token: Schema.Optional(Primitive.Address),
  }),
)
export type SpendPermissions = Schema.StaticDecode<typeof SpendPermissions>

export const Permissions = Type.Object({
  calls: Schema.Optional(CallPermissions),
  signatureVerification: Schema.Optional(SignatureVerificationPermission),
  spend: Schema.Optional(SpendPermissions),
})
export type Permissions = Schema.StaticDecode<typeof Permissions>
