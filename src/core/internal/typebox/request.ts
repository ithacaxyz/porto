import * as C from './capabilities.js'
import * as Permissions from './permissions.js'
import * as Primitive from './primitive.js'
import * as Schema from './schema.js'
import { Type } from './schema.js'

export namespace eth_accounts {
  export const Request = Type.Object({
    method: Type.Literal('eth_accounts'),
    params: Schema.Optional(Type.Undefined()),
  })

  export const Response = Type.Array(Primitive.Address)
}

export namespace eth_chainId {
  export const Request = Type.Object({
    method: Type.Literal('eth_chainId'),
    params: Schema.Optional(Type.Undefined()),
  })

  export const Response = Primitive.Hex
}

export namespace eth_requestAccounts {
  export const Request = Type.Object({
    method: Type.Literal('eth_requestAccounts'),
    params: Schema.Optional(Type.Undefined()),
  })

  export const Response = Type.Array(Primitive.Address)
}

export namespace eth_sendTransaction {
  export const Request = Type.Object({
    method: Type.Literal('eth_sendTransaction'),
    params: Type.Tuple([
      Type.Object({
        chainId: Schema.Optional(Primitive.Number),
        data: Schema.Optional(Primitive.Hex),
        from: Primitive.Address,
        to: Primitive.Address,
        value: Schema.Optional(Primitive.BigInt),
      }),
    ]),
  })

  export const Response = Primitive.Hex
}

export namespace eth_signTypedData_v4 {
  export const Request = Type.Object({
    method: Type.Literal('eth_signTypedData_v4'),
    params: Type.Tuple([Primitive.Address, Type.String()]),
  })

  export const Response = Primitive.Hex
}

export namespace experimental_grantPermissions {
  export const Parameters = Permissions.Request

  export const Request = Type.Object({
    method: Type.Literal('experimental_grantPermissions'),
    params: Type.Tuple([Parameters]),
  })

  export const Response = Permissions.Permissions
}

export namespace experimental_permissions {
  export const Parameters = Type.Object({
    address: Schema.Optional(Primitive.Address),
  })

  export const Request = Type.Object({
    method: Type.Literal('experimental_permissions'),
    params: Schema.Optional(Type.Tuple([Parameters])),
  })

  export const Response = C.permissions.Response
}

export namespace experimental_prepareCreateAccount {
  export const Capabilities = Type.Object({
    grantPermissions: Schema.Optional(C.grantPermissions.Request),
  })

  export const Parameters = Type.Object({
    address: Primitive.Address,
    chainId: Schema.Optional(Primitive.Number),
    capabilities: Schema.Optional(Capabilities),
    label: Schema.Optional(Type.String()),
  })

  export const Request = Type.Object({
    method: Type.Literal('experimental_prepareCreateAccount'),
    params: Type.Tuple([Parameters]),
  })

  export const Response = Type.Object({
    context: Type.Unknown(),
    signPayloads: Type.Array(Primitive.Hex),
  })
}

export namespace experimental_createAccount {
  export const Parameters = Type.Intersect([
    Type.Object({
      chainId: Schema.Optional(Primitive.Number),
    }),
    Schema.OneOf([
      Type.Object({
        label: Schema.Optional(Type.String()),
      }),
      Type.Object({
        context: Type.Unknown(),
        signatures: Type.Array(Primitive.Hex),
      }),
    ]),
  ])

  export const Request = Type.Object({
    method: Type.Literal('experimental_createAccount'),
    params: Schema.Optional(Type.Tuple([Parameters])),
  })

  export const ResponseCapabilities = Type.Object({
    permissions: Schema.Optional(C.permissions.Response),
  })

  export const Response = Type.Object({
    address: Primitive.Address,
    capabilities: Schema.Optional(ResponseCapabilities),
  })
}

export namespace experimental_revokePermissions {
  export const Parameters = Type.Object({
    address: Schema.Optional(Primitive.Address),
    id: Primitive.Hex,
  })

  export const Request = Type.Object({
    method: Type.Literal('experimental_revokePermissions'),
    params: Type.Tuple([Parameters]),
  })

  export const Response = undefined
}

export namespace personal_sign {
  export const Request = Type.Object({
    method: Type.Literal('personal_sign'),
    params: Type.Tuple([Primitive.Hex, Primitive.Address]),
  })

  export const Response = Primitive.Hex
}

export namespace porto_ping {
  export const Request = Type.Object({
    method: Type.Literal('porto_ping'),
    params: Schema.Optional(Type.Undefined()),
  })

  export const Response = Type.Literal('pong')
}

export namespace wallet_connect {
  export const Capabilities = Type.Object({
    createAccount: Schema.Optional(C.createAccount.Request),
    grantPermissions: Schema.Optional(C.grantPermissions.Request),
  })

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

  export const ResponseCapabilities = Type.Object({
    permissions: Schema.Optional(C.permissions.Response),
  })

  export const Response = Type.Object({
    accounts: Type.Array(
      Type.Object({
        address: Primitive.Address,
        capabilities: Schema.Optional(ResponseCapabilities),
      }),
    ),
  })
}

export namespace wallet_disconnect {
  export const Request = Type.Object({
    method: Type.Literal('wallet_disconnect'),
    params: Schema.Optional(Type.Undefined()),
  })

  export const Response = undefined
}

export namespace wallet_getCallsStatus {
  export const Request = Type.Object({
    method: Type.Literal('wallet_getCallsStatus'),
    params: Type.Tuple([Primitive.Hex]),
  })

  export const Response = Type.Object({
    receipts: Schema.Optional(
      Type.Array(
        Type.Object({
          logs: Type.Array(
            Type.Object({
              address: Primitive.Address,
              data: Primitive.Hex,
              topics: Type.Array(Primitive.Hex),
            }),
          ),
          status: Primitive.Hex,
          blockHash: Primitive.Hex,
          blockNumber: Primitive.Hex,
          gasUsed: Primitive.Hex,
          transactionHash: Primitive.Hex,
        }),
      ),
    ),
    status: Type.Union([Type.Literal('CONFIRMED'), Type.Literal('PENDING')]),
  })
}

export namespace wallet_getCapabilities {
  export const Request = Type.Object({
    method: Type.Literal('wallet_getCapabilities'),
    params: Schema.Optional(Type.Undefined()),
  })

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
}

export namespace wallet_prepareCalls {
  export const Capabilities = Type.Object({
    permissions: Schema.Optional(C.permissions.Request),
  })

  export const Parameters = Type.Object({
    calls: Type.Array(
      Type.Object({
        to: Primitive.Address,
        data: Schema.Optional(Primitive.Hex),
        value: Schema.Optional(Primitive.BigInt),
      }),
    ),
    capabilities: Schema.Optional(Capabilities),
    chainId: Schema.Optional(Primitive.Number),
    from: Schema.Optional(Primitive.Address),
    version: Schema.Optional(Type.Literal('1')),
  })

  export const Request = Type.Object({
    method: Type.Literal('wallet_prepareCalls'),
    params: Type.Tuple([Parameters]),
  })

  export const Response = Type.Object({
    capabilities: Schema.Optional(Type.Record(Type.String(), Type.Any())),
    chainId: Schema.Optional(Primitive.Hex),
    context: Type.Object({
      account: Type.Object({
        address: Primitive.Address,
        type: Type.Literal('delegated'),
      }),
      calls: Parameters.properties.calls,
      nonce: Primitive.BigInt,
    }),
    digest: Primitive.Hex,
    version: Schema.Optional(Type.String()),
  })
}

export namespace wallet_sendCalls {
  export const Request = Type.Object({
    method: Type.Literal('wallet_sendCalls'),
    params: Type.Tuple([wallet_prepareCalls.Parameters]),
  })

  export const Response = Primitive.Hex
}

export namespace wallet_sendPreparedCalls {
  export const Parameters = Type.Intersect([
    Type.Omit(wallet_prepareCalls.Response, ['digest']),
    Type.Object({
      signature: Type.Object({
        publicKey: Primitive.Hex,
        type: Type.String(),
        value: Primitive.Hex,
      }),
    }),
  ])

  export const Request = Type.Object({
    method: Type.Literal('wallet_sendPreparedCalls'),
    params: Type.Tuple([Parameters]),
  })

  export const Response = Type.Array(
    Type.Object({
      id: Type.String(),
      capabilities: Schema.Optional(Type.Record(Type.String(), Type.Any())),
    }),
  )
}
