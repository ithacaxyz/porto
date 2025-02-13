import * as Capabilities from './capabilities.js'
import * as Permissions from './permissions.js'
import * as Primitive from './primitive.js'
import * as Schema from './schema.js'
import { Type } from './schema.js'

export const eth_accounts = {
  Request: Type.Object({
    method: Type.Literal('eth_accounts'),
    params: Schema.Optional(Type.Undefined()),
  }),
  ReturnType: Type.Array(Primitive.Address),
}

export const eth_chainId = {
  Request: Type.Object({
    method: Type.Literal('eth_chainId'),
    params: Schema.Optional(Type.Undefined()),
  }),
  ReturnType: Primitive.Hex,
}

export const eth_requestAccounts = {
  Request: Type.Object({
    method: Type.Literal('eth_requestAccounts'),
    params: Schema.Optional(Type.Undefined()),
  }),
  ReturnType: Type.Array(Primitive.Address),
}

export const eth_sendTransaction = {
  Request: Type.Object({
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
  }),
  ReturnType: Primitive.Hex,
}

export const eth_signTypedData_v4 = {
  Request: Type.Object({
    method: Type.Literal('eth_signTypedData_v4'),
    params: Type.Tuple([Primitive.Address, Type.String()]),
  }),
  ReturnType: Primitive.Hex,
}

export const experimental_grantPermissionsParams0 = Permissions.Request
export const experimental_grantPermissionsReturnType = Permissions.Permissions
export const experimental_grantPermissions = {
  Request: Type.Object({
    method: Type.Literal('experimental_grantPermissions'),
    params: Type.Tuple([experimental_grantPermissionsParams0]),
  }),
  ReturnType: experimental_grantPermissionsReturnType,
}

export const experimental_permissionsParams0 = Type.Object({
  address: Schema.Optional(Primitive.Address),
})
export const experimental_permissionsReturnType = Type.Array(
  Type.Object({
    address: Primitive.Address,
    chainId: Schema.Optional(Primitive.Hex),
    expiry: Type.Number(),
    id: Primitive.Hex,
    key: Type.Object({
      publicKey: Primitive.Hex,
      type: Type.String(),
    }),
    permissions: Type.Object({
      calls: Schema.Optional(
        Type.Array(
          Type.Union([
            Type.Object({
              signature: Type.String(),
              to: Primitive.Address,
            }),
            Type.Object({
              signature: Type.String(),
            }),
            Type.Object({
              to: Primitive.Address,
            }),
          ]),
        ),
      ),
      signatureVerification: Schema.Optional(
        Type.Object({
          addresses: Type.Array(Primitive.Address),
        }),
      ),
      spend: Schema.Optional(
        Type.Array(
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
        ),
      ),
    }),
  }),
)
export const experimental_permissions = {
  Request: Type.Object({
    method: Type.Literal('experimental_permissions'),
    params: Schema.Optional(Type.Tuple([experimental_permissionsParams0])),
  }),
  ReturnType: experimental_permissionsReturnType,
}

export const experimental_prepareCreateAccountParams0 = Type.Object({
  address: Primitive.Address,
  chainId: Schema.Optional(Primitive.Number),
  capabilities: Schema.Optional(
    Type.Object({
      grantPermissions: Schema.Optional(Permissions.Request),
    }),
  ),
  label: Schema.Optional(Type.String()),
})
export const experimental_prepareCreateAccountReturnType = Type.Object({
  context: Type.Unknown(),
  signPayloads: Type.Array(Primitive.Hex),
})
export const experimental_prepareCreateAccount = {
  Request: Type.Object({
    method: Type.Literal('experimental_prepareCreateAccount'),
    params: Type.Tuple([experimental_prepareCreateAccountParams0]),
  }),
  ReturnType: experimental_prepareCreateAccountReturnType,
}

export const experimental_createAccountParams0 = Type.Intersect([
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
export const experimental_createAccountReturnType = Type.Object({
  address: Primitive.Address,
  capabilities: Schema.Optional(
    Type.Object({
      permissions: Schema.Optional(experimental_permissionsReturnType),
    }),
  ),
})
export const experimental_createAccount = {
  Request: Type.Object({
    method: Type.Literal('experimental_createAccount'),
    params: Schema.Optional(Type.Tuple([experimental_createAccountParams0])),
  }),
  ReturnType: experimental_createAccountReturnType,
}

export const experimental_revokePermissionsParams0 = Type.Object({
  address: Schema.Optional(Primitive.Address),
  id: Primitive.Hex,
})
export const experimental_revokePermissions = {
  Request: Type.Object({
    method: Type.Literal('experimental_revokePermissions'),
    params: Type.Tuple([experimental_revokePermissionsParams0]),
  }),
  ReturnType: undefined,
}

export const personal_sign = {
  Request: Type.Object({
    method: Type.Literal('personal_sign'),
    params: Type.Tuple([Primitive.Hex, Primitive.Address]),
  }),
  ReturnType: Primitive.Hex,
}

export const porto_ping = {
  Request: Type.Object({
    method: Type.Literal('porto_ping'),
    params: Schema.Optional(Type.Undefined()),
  }),
  ReturnType: Type.Literal('pong'),
}

export const wallet_connect = {
  Request: Type.Object({
    method: Type.Literal('wallet_connect'),
    params: Schema.Optional(
      Type.Tuple([
        Type.Object({
          capabilities: Schema.Optional(Capabilities.Connect),
        }),
      ]),
    ),
  }),
  ReturnType: Type.Object({
    accounts: Type.Array(
      Type.Object({
        address: Primitive.Address,
        capabilities: Schema.Optional(
          Type.Object({
            permissions: Schema.Optional(experimental_permissionsReturnType),
          }),
        ),
      }),
    ),
  }),
}

export const wallet_disconnect = {
  Request: Type.Object({
    method: Type.Literal('wallet_disconnect'),
    params: Schema.Optional(Type.Undefined()),
  }),
  ReturnType: undefined,
}

export const wallet_getCallsStatusReturnType = Type.Object({
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
export const wallet_getCallsStatus = {
  Request: Type.Object({
    method: Type.Literal('wallet_getCallsStatus'),
    params: Type.Tuple([Primitive.Hex]),
  }),
  ReturnType: wallet_getCallsStatusReturnType,
}

export const wallet_getCapabilities = {
  Request: Type.Object({
    method: Type.Literal('wallet_getCapabilities'),
    params: Schema.Optional(Type.Undefined()),
  }),
  ReturnType: Type.Record(
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
  ),
}

export const wallet_prepareCallsParams0 = Type.Object({
  calls: Type.Array(
    Type.Object({
      to: Primitive.Address,
      data: Schema.Optional(Primitive.Hex),
      value: Schema.Optional(Primitive.BigInt),
    }),
    { minItems: 1 },
  ),
  capabilities: Schema.Optional(Capabilities.SendCalls),
  chainId: Schema.Optional(Primitive.Number),
  from: Schema.Optional(Primitive.Address),
  version: Schema.Optional(Type.Literal('1')),
})
export const wallet_prepareCallsReturnType = Type.Object({
  capabilities: Schema.Optional(Type.Record(Type.String(), Type.Any())),
  chainId: Schema.Optional(Primitive.Hex),
  context: Type.Object({
    account: Type.Object({
      address: Primitive.Address,
      type: Type.Literal('delegated'),
    }),
    calls: wallet_prepareCallsParams0.properties.calls,
    nonce: Primitive.BigInt,
  }),
  digest: Primitive.Hex,
  version: Schema.Optional(Type.String()),
})
export const wallet_prepareCalls = {
  Request: Type.Object({
    method: Type.Literal('wallet_prepareCalls'),
    params: Type.Tuple([wallet_prepareCallsParams0]),
  }),
  ReturnType: wallet_prepareCallsReturnType,
}

export const wallet_sendCallsParams0 = wallet_prepareCallsParams0
export const wallet_sendCalls = {
  Request: Type.Object({
    method: Type.Literal('wallet_sendCalls'),
    params: Type.Tuple([wallet_sendCallsParams0]),
  }),
  ReturnType: Primitive.Hex,
}

export const wallet_sendPreparedCallsParams0 = Type.Intersect([
  Type.Omit(wallet_prepareCallsReturnType, ['digest']),
  Type.Object({
    signature: Type.Object({
      publicKey: Primitive.Hex,
      type: Type.String(),
      value: Primitive.Hex,
    }),
  }),
])
export const wallet_sendPreparedCallsReturnType = Type.Array(
  Type.Object({
    id: Type.String(),
    capabilities: Schema.Optional(Type.Record(Type.String(), Type.Any())),
  }),
)
export const wallet_sendPreparedCalls = {
  Request: Type.Object({
    method: Type.Literal('wallet_sendPreparedCalls'),
    params: Type.Tuple([wallet_sendPreparedCallsParams0]),
  }),
  ReturnType: wallet_sendPreparedCallsReturnType,
}
