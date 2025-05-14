import * as Key from './key.js'
import * as Primitive from './primitive.js'
import * as Typebox from './typebox.js'
import { Type } from './typebox.js'

export const Permissions = Type.Object({
  address: Primitive.Address,
  chainId: Typebox.Optional(Primitive.Number),
  expiry: Type.Number(),
  id: Primitive.Hex,
  key: Type.Pick(Key.Base, ['publicKey', 'type']),
  permissions: Type.Object({
    calls: Key.CallPermissions,
    signatureVerification: Typebox.Optional(
      Key.SignatureVerificationPermission,
    ),
    spend: Typebox.Optional(Key.SpendPermissions),
  }),
})
export type Permissions = Typebox.StaticDecode<typeof Permissions>

export const Request = Type.Object({
  address: Typebox.Optional(Primitive.Address),
  chainId: Typebox.Optional(Primitive.Number),
  expiry: Type.Number({ minimum: 1 }),
  key: Typebox.Optional(Permissions.properties.key),
  permissions: Permissions.properties.permissions,
})
export type Request = Typebox.StaticDecode<typeof Request>
