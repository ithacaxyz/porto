// Refs:
// https://github.com/ithacaxyz/relay/blob/main/src/types/rpc/account.rs

import * as Primitive from '../../typebox/primitive.js'
import { Type } from '../../typebox/schema.js'
import { authorizeKey } from './capabilities.js'

export namespace wallet_createAccount {
  export const Request = Type.Object({
    method: Type.Literal('wallet_createAccount'),
    params: Type.Tuple([wallet_createAccount.Parameters]),
  })

  export const Parameters = Type.Object({
    capabilities: wallet_createAccount.Capabilities,
  })

  export const ReturnType = Type.Object({
    address: Primitive.Address,
    capabilities: wallet_createAccount.ResponseCapabilities,
  })

  export const Capabilities = Type.Object({
    authorizeKeys: Type.Array(authorizeKey.Request, { minItems: 1 }),
    delegation: Primitive.Address,
  })

  export const ResponseCapabilities = Type.Object({
    authorizeKeys: Type.Array(authorizeKey.Response),
    delegation: Primitive.Address,
  })
}
