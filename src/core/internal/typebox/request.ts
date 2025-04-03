import * as C from './capabilities.js'
import * as Key from './key.js'
import * as Permissions from './permissions.js'
import * as Primitive from './primitive.js'
import * as Schema from './schema.js'
import { Type } from './schema.js'

export namespace experimental_addFunds {
  export const Parameters = Type.Object({
    address: Primitive.Address,
    token: Primitive.Address,
    value: Primitive.BigInt,
  })

  export type Parameters = Schema.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('experimental_addFunds'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Primitive.Hex
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace eth_accounts {
  export const Request = Type.Object({
    method: Type.Literal('eth_accounts'),
    params: Schema.Optional(Type.Undefined()),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Type.Array(Primitive.Address)
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace eth_chainId {
  export const Request = Type.Object({
    method: Type.Literal('eth_chainId'),
    params: Schema.Optional(Type.Undefined()),
  })
  export type Request = Schema.StaticDecode<typeof Request>
  export const Response = Primitive.Hex
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace eth_requestAccounts {
  export const Request = Type.Object({
    method: Type.Literal('eth_requestAccounts'),
    params: Schema.Optional(Type.Undefined()),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Type.Array(Primitive.Address)
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace eth_sendTransaction {
  export const Request = Type.Object({
    method: Type.Literal('eth_sendTransaction'),
    params: Type.Tuple([
      Type.Object({
        chainId: Schema.Optional(Primitive.Number),
        data: Schema.Optional(Primitive.Hex),
        from: Schema.Optional(Primitive.Address),
        to: Primitive.Address,
        value: Schema.Optional(Primitive.BigInt),
      }),
    ]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Primitive.Hex
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace eth_signTypedData_v4 {
  export const Request = Type.Object({
    method: Type.Literal('eth_signTypedData_v4'),
    params: Type.Tuple([Primitive.Address, Type.String()]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Primitive.Hex
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace experimental_getAdmins {
  export const Parameters = Type.Object({
    address: Schema.Optional(Primitive.Address),
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('experimental_getAdmins'),
    params: Schema.Optional(Type.Tuple([Parameters])),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Type.Object({
    address: Primitive.Address,
    keys: Type.Array(Type.Pick(Key.Base, ['id', 'publicKey', 'type'])),
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace experimental_grantAdmin {
  export const Capabilities = Type.Object({
    feeToken: Schema.Optional(Primitive.Address),
  })
  export type Capabilities = Schema.StaticDecode<typeof Capabilities>

  export const Parameters = Type.Object({
    /** Address of the account to authorize the admin for. */
    address: Schema.Optional(Primitive.Address),
    /** Capabilities. */
    capabilities: Schema.Optional(Capabilities),
    /** Chain ID. */
    chainId: Schema.Optional(Primitive.Number),
    /** Admin Key to authorize. */
    key: Type.Object({
      /** Public key. */
      publicKey: Key.Base.properties.publicKey,
      /** Key type. */
      type: Key.Base.properties.type,
    }),
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('experimental_grantAdmin'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Type.Object({
    address: Primitive.Address,
    chainId: Primitive.Hex,
    key: experimental_getAdmins.Response.properties.keys.items,
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace experimental_createAccount {
  export const Parameters = Type.Intersect([
    Type.Object({
      chainId: Schema.Optional(Primitive.Number),
      label: Schema.Optional(Type.String()),
    }),
  ])
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('experimental_createAccount'),
    params: Schema.Optional(Type.Tuple([Parameters])),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const ResponseCapabilities = Type.Object({
    admins: Schema.Optional(experimental_getAdmins.Response.properties.keys),
    permissions: Schema.Optional(C.permissions.Response),
  })
  export type ResponseCapabilities = Schema.StaticDecode<
    typeof ResponseCapabilities
  >

  export const Response = Type.Object({
    address: Primitive.Address,
    capabilities: Schema.Optional(ResponseCapabilities),
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace experimental_grantPermissions {
  export const Parameters = Permissions.Request
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('experimental_grantPermissions'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Permissions.Permissions
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace experimental_getPermissions {
  export const Parameters = Type.Object({
    address: Schema.Optional(Primitive.Address),
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('experimental_getPermissions'),
    params: Schema.Optional(Type.Tuple([Parameters])),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = C.permissions.Response
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace experimental_prepareUpgradeAccount {
  export const Capabilities = Type.Object({
    feeToken: Schema.Optional(Primitive.Address),
    grantPermissions: Schema.Optional(C.grantPermissions.Request),
  })
  export type Capabilities = Schema.StaticDecode<typeof Capabilities>

  export const Parameters = Type.Object({
    address: Primitive.Address,
    capabilities: Schema.Optional(Capabilities),
    chainId: Schema.Optional(Primitive.Number),
    label: Schema.Optional(Type.String()),
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('experimental_prepareUpgradeAccount'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Type.Object({
    context: Type.Unknown(),
    signPayloads: Type.Array(Primitive.Hex),
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace experimental_revokeAdmin {
  export const Capabilities = Type.Object({
    feeToken: Schema.Optional(Primitive.Address),
  })
  export type Capabilities = Schema.StaticDecode<typeof Capabilities>

  export const Parameters = Type.Object({
    address: Schema.Optional(Primitive.Address),
    capabilities: Schema.Optional(Capabilities),
    chainId: Schema.Optional(Primitive.Number),
    id: Primitive.Hex,
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('experimental_revokeAdmin'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = undefined
}

export namespace experimental_revokePermissions {
  export const Capabilities = Type.Object({
    feeToken: Schema.Optional(Primitive.Address),
  })
  export type Capabilities = Schema.StaticDecode<typeof Capabilities>

  export const Parameters = Type.Object({
    address: Schema.Optional(Primitive.Address),
    capabilities: Schema.Optional(Capabilities),
    id: Primitive.Hex,
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('experimental_revokePermissions'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = undefined
}

export namespace experimental_upgradeAccount {
  export const Parameters = Type.Object({
    context: Type.Unknown(),
    signatures: Type.Array(Primitive.Hex),
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('experimental_upgradeAccount'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const ResponseCapabilities = Type.Object({
    permissions: Schema.Optional(C.permissions.Response),
  })
  export type ResponseCapabilities = Schema.StaticDecode<
    typeof ResponseCapabilities
  >

  export const Response = Type.Object({
    address: Primitive.Address,
    capabilities: Schema.Optional(ResponseCapabilities),
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace personal_sign {
  export const Request = Type.Object({
    method: Type.Literal('personal_sign'),
    params: Type.Tuple([Primitive.Hex, Primitive.Address]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Primitive.Hex
}

export namespace porto_ping {
  export const Request = Type.Object({
    method: Type.Literal('porto_ping'),
    params: Schema.Optional(Type.Undefined()),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Type.Literal('pong')
}

export namespace wallet_connect {
  export const Capabilities = Type.Object({
    createAccount: Schema.Optional(C.createAccount.Request),
    grantPermissions: Schema.Optional(C.grantPermissions.Request),
    selectAccount: Schema.Optional(Type.Boolean()),
  })
  export type Capabilities = Schema.StaticDecode<typeof Capabilities>

  export const Request = Type.Object({
    method: Type.Literal('wallet_connect'),
    params: Schema.Optional(
      Type.Tuple([
        Type.Object({
          capabilities: Schema.Optional(Capabilities),
        }),
      ]),
    ),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const ResponseCapabilities = Type.Object({
    admins: Schema.Optional(experimental_getAdmins.Response.properties.keys),
    permissions: Schema.Optional(C.permissions.Response),
  })
  export type ResponseCapabilities = Schema.StaticDecode<
    typeof ResponseCapabilities
  >

  export const Response = Type.Object({
    accounts: Type.Array(
      Type.Object({
        address: Primitive.Address,
        capabilities: Schema.Optional(ResponseCapabilities),
      }),
    ),
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_disconnect {
  export const Request = Type.Object({
    method: Type.Literal('wallet_disconnect'),
    params: Schema.Optional(Type.Undefined()),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = undefined
}

export namespace wallet_getCallsStatus {
  export const Request = Type.Object({
    method: Type.Literal('wallet_getCallsStatus'),
    params: Type.Tuple([Primitive.Hex]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Type.Object({
    receipts: Schema.Optional(
      Type.Array(
        Type.Object({
          blockHash: Primitive.Hex,
          blockNumber: Primitive.Hex,
          gasUsed: Primitive.Hex,
          logs: Type.Array(
            Type.Object({
              address: Primitive.Address,
              data: Primitive.Hex,
              topics: Type.Array(Primitive.Hex),
            }),
          ),
          status: Primitive.Hex,
          transactionHash: Primitive.Hex,
        }),
      ),
    ),
    status: Type.Union([Type.Literal('CONFIRMED'), Type.Literal('PENDING')]),
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_getCapabilities {
  export const Request = Type.Object({
    method: Type.Literal('wallet_getCapabilities'),
    params: Schema.Optional(Type.Undefined()),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Type.Record(
    Primitive.Hex,
    Type.Object({
      atomicBatch: Type.Object({
        supported: Type.Boolean(),
      }),
      createAccount: Type.Object({
        supported: Type.Boolean(),
      }),
      permissions: Type.Object({
        supported: Type.Boolean(),
      }),
    }),
  )
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_prepareCalls {
  export const Capabilities = Type.Object({
    feeToken: Schema.Optional(Primitive.Address),
    permissions: Schema.Optional(C.permissions.Request),
  })
  export type Capabilities = Schema.StaticDecode<typeof Capabilities>

  export const Parameters = Type.Object({
    calls: Type.Array(
      Type.Object({
        data: Schema.Optional(Primitive.Hex),
        to: Primitive.Address,
        value: Schema.Optional(Primitive.BigInt),
      }),
    ),
    capabilities: Schema.Optional(Capabilities),
    chainId: Schema.Optional(Primitive.Number),
    from: Schema.Optional(Primitive.Address),
    key: Type.Object({
      prehash: Schema.Optional(Type.Boolean()),
      publicKey: Primitive.Hex,
      type: Type.Union([
        Type.Literal('p256'),
        Type.Literal('secp256k1'),
        Type.Literal('webauthn-p256'),
        Type.Literal('address'),
      ]),
    }),
    version: Schema.Optional(Type.String()),
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_prepareCalls'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Type.Object({
    capabilities: Schema.Optional(Type.Record(Type.String(), Type.Any())),
    chainId: Primitive.Hex,
    context: Type.Object({
      account: Type.Object({
        address: Primitive.Address,
      }),
      calls: Parameters.properties.calls,
      nonce: Primitive.BigInt,
    }),
    digest: Primitive.Hex,
    key: Parameters.properties.key,
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_sendCalls {
  export const Request = Type.Object({
    method: Type.Literal('wallet_sendCalls'),
    params: Type.Tuple([Type.Omit(wallet_prepareCalls.Parameters, ['key'])]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Primitive.Hex
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_sendPreparedCalls {
  export const Parameters = Type.Object({
    capabilities: wallet_prepareCalls.Response.properties.capabilities,
    chainId: Primitive.Hex,
    context: wallet_prepareCalls.Response.properties.context,
    key: wallet_prepareCalls.Response.properties.key,
    signature: Primitive.Hex,
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_sendPreparedCalls'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Type.Array(
    Type.Object({
      capabilities: Schema.Optional(Type.Record(Type.String(), Type.Any())),
      id: Primitive.Hex,
    }),
  )
  export type Response = Schema.StaticDecode<typeof Response>
}
