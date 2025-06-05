import * as Primitive from '../typebox/primitive.js'
import * as Typebox from './typebox.js'
import { Type } from './typebox.js'

export const Base = Type.Object({
  /** The expiry of the key. */
  expiry: Primitive.Number,
  /** The hash of the key. */
  hash: Primitive.Hex,
  /** The id of the key. */
  id: Primitive.Hex,
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
export type Base = Typebox.StaticDecode<typeof Base>

export const CallPermissions = Type.Array(
  Type.Union([
    Type.Object({
      signature: Type.String(),
      to: Primitive.Address,
    }),
    Type.Object({
      signature: Type.String(),
      to: Typebox.Optional(Type.Undefined()),
    }),
    Type.Object({
      signature: Typebox.Optional(Type.Undefined()),
      to: Primitive.Address,
    }),
  ]),
  { minItems: 1 },
)
export type CallPermissions = Typebox.StaticDecode<typeof CallPermissions>

export const SignatureVerificationPermission = Type.Object({
  addresses: Type.Array(Primitive.Address),
})
export type SignatureVerificationPermission = Typebox.StaticDecode<
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
    token: Typebox.Optional(Primitive.Address),
  }),
)
export type SpendPermissions = Typebox.StaticDecode<typeof SpendPermissions>

export const Permissions = Type.Object({
  calls: Typebox.Optional(CallPermissions),
  signatureVerification: Typebox.Optional(SignatureVerificationPermission),
  spend: Typebox.Optional(SpendPermissions),
})
export type Permissions = Typebox.StaticDecode<typeof Permissions>

export const WithPermissions = Type.Intersect([
  Base,
  Type.Object({
    permissions: Typebox.Optional(Permissions),
  }),
])
export type WithPermissions = Typebox.StaticDecode<typeof WithPermissions>
