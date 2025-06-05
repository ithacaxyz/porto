import * as Quote from '../rpcServer/typebox/quote.js'
import * as Rpc_server from '../rpcServer/typebox/rpc.js'
import * as C from './capabilities.js'
import * as Key from './key.js'
import * as Permissions from './permissions.js'
import * as Primitive from './primitive.js'
import * as Typebox from './typebox.js'
import { Type } from './typebox.js'

export namespace wallet_addFunds {
  export const Parameters = Type.Object({
    address: Typebox.Optional(Primitive.Address),
    token: Primitive.Address,
    value: Typebox.Optional(Primitive.BigInt),
  })

  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_addFunds'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Object({
    id: Primitive.Hex,
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace eth_accounts {
  export const Request = Type.Object({
    method: Type.Literal('eth_accounts'),
    params: Typebox.Optional(Type.Undefined()),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Array(Primitive.Address)
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace eth_chainId {
  export const Request = Type.Object({
    method: Type.Literal('eth_chainId'),
    params: Typebox.Optional(Type.Undefined()),
  })
  export type Request = Typebox.StaticDecode<typeof Request>
  export const Response = Primitive.Hex
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace eth_requestAccounts {
  export const Request = Type.Object({
    method: Type.Literal('eth_requestAccounts'),
    params: Typebox.Optional(Type.Undefined()),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Array(Primitive.Address)
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace eth_sendTransaction {
  export const Request = Type.Object({
    method: Type.Literal('eth_sendTransaction'),
    params: Type.Tuple([
      Type.Object({
        capabilities: Typebox.Optional(
          Type.Object({
            preCalls: Typebox.Optional(C.preCalls.Request),
          }),
        ),
        chainId: Typebox.Optional(Primitive.Number),
        data: Typebox.Optional(Primitive.Hex),
        from: Typebox.Optional(Primitive.Address),
        to: Primitive.Address,
        value: Typebox.Optional(Primitive.BigInt),
      }),
    ]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Primitive.Hex
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace eth_signTypedData_v4 {
  export const Request = Type.Object({
    method: Type.Literal('eth_signTypedData_v4'),
    params: Type.Tuple([Primitive.Address, Type.String()]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Primitive.Hex
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_getAdmins {
  export const Parameters = Type.Object({
    address: Typebox.Optional(Primitive.Address),
    chainId: Typebox.Optional(Primitive.Number),
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_getAdmins'),
    params: Typebox.Optional(Type.Tuple([Parameters])),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Object({
    address: Primitive.Address,
    chainId: Primitive.Number,
    keys: Type.Array(
      Type.Intersect([
        Type.Pick(Key.Base, ['id', 'publicKey', 'type']),
        Type.Object({
          credentialId: Typebox.Optional(Type.String()),
        }),
      ]),
    ),
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_grantAdmin {
  export const Capabilities = Type.Object({
    feeToken: Typebox.Optional(C.feeToken.Request),
  })
  export type Capabilities = Typebox.StaticDecode<typeof Capabilities>

  export const Parameters = Type.Object({
    /** Address of the account to authorize the admin for. */
    address: Typebox.Optional(Primitive.Address),
    /** Capabilities. */
    capabilities: Typebox.Optional(Capabilities),
    /** Chain ID. */
    chainId: Typebox.Optional(Primitive.Number),
    /** Admin Key to authorize. */
    key: Type.Object({
      /** Public key. */
      publicKey: Key.Base.properties.publicKey,
      /** Key type. */
      type: Key.Base.properties.type,
    }),
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_grantAdmin'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Object({
    address: Primitive.Address,
    chainId: Primitive.Number,
    key: wallet_getAdmins.Response.properties.keys.items,
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_grantPermissions {
  export const Parameters = Permissions.Request
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_grantPermissions'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const ResponseCapabilities = Type.Object({
    preCalls: Typebox.Optional(C.preCalls.Response),
  })
  export type ResponseCapabilities = Typebox.StaticDecode<
    typeof ResponseCapabilities
  >

  export const Response = Type.Intersect([
    Permissions.Permissions,
    Type.Object({
      capabilities: Typebox.Optional(Type.Any()),
    }),
  ])
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_getAccountVersion {
  export const Parameters = Type.Object({
    address: Typebox.Optional(Primitive.Address),
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_getAccountVersion'),
    params: Typebox.Optional(Type.Tuple([Parameters])),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Object({
    current: Type.String(),
    latest: Type.String(),
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_getPermissions {
  export const Parameters = Type.Object({
    address: Typebox.Optional(Primitive.Address),
    chainId: Typebox.Optional(Primitive.Number),
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_getPermissions'),
    params: Typebox.Optional(Type.Tuple([Parameters])),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = C.permissions.Response
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_prepareUpgradeAccount {
  export const Capabilities = Type.Object({
    feeToken: Typebox.Optional(C.feeToken.Request),
    grantPermissions: Typebox.Optional(C.grantPermissions.Request),
  })
  export type Capabilities = Typebox.StaticDecode<typeof Capabilities>

  export const Parameters = Type.Object({
    address: Primitive.Address,
    capabilities: Typebox.Optional(Capabilities),
    chainId: Typebox.Optional(Primitive.Number),
    label: Typebox.Optional(Type.String()),
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_prepareUpgradeAccount'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Object({
    context: Type.Unknown(),
    digests: Type.Object({
      auth: Primitive.Hex,
      exec: Primitive.Hex,
    }),
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_revokeAdmin {
  export const Capabilities = Type.Object({
    feeToken: Typebox.Optional(C.feeToken.Request),
  })
  export type Capabilities = Typebox.StaticDecode<typeof Capabilities>

  export const Parameters = Type.Object({
    address: Typebox.Optional(Primitive.Address),
    capabilities: Typebox.Optional(Capabilities),
    chainId: Typebox.Optional(Primitive.Number),
    id: Primitive.Hex,
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_revokeAdmin'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = undefined
}

export namespace wallet_revokePermissions {
  export const Capabilities = Type.Object({
    feeToken: Typebox.Optional(C.feeToken.Request),
  })
  export type Capabilities = Typebox.StaticDecode<typeof Capabilities>

  export const Parameters = Type.Object({
    address: Typebox.Optional(Primitive.Address),
    capabilities: Typebox.Optional(Capabilities),
    id: Primitive.Hex,
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_revokePermissions'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = undefined
}

export namespace wallet_updateAccount {
  export const Parameters = Type.Object({
    address: Typebox.Optional(Primitive.Address),
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_updateAccount'),
    params: Typebox.Optional(Type.Tuple([Parameters])),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Object({
    id: Typebox.Optional(Primitive.Hex),
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_upgradeAccount {
  export const Parameters = Type.Object({
    context: Type.Unknown(),
    signatures: Type.Object({
      auth: Primitive.Hex,
      exec: Primitive.Hex,
    }),
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_upgradeAccount'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const ResponseCapabilities = Type.Object({
    permissions: Typebox.Optional(C.permissions.Response),
  })
  export type ResponseCapabilities = Typebox.StaticDecode<
    typeof ResponseCapabilities
  >

  export const Response = Type.Object({
    address: Primitive.Address,
    capabilities: Typebox.Optional(ResponseCapabilities),
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace personal_sign {
  export const Request = Type.Object({
    method: Type.Literal('personal_sign'),
    params: Type.Tuple([Primitive.Hex, Primitive.Address]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Primitive.Hex
}

export namespace porto_ping {
  export const Request = Type.Object({
    method: Type.Literal('porto_ping'),
    params: Typebox.Optional(Type.Undefined()),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Literal('pong')
}

export namespace wallet_connect {
  export const Capabilities = Type.Object({
    address: Typebox.Optional(Primitive.Address),
    createAccount: Typebox.Optional(C.createAccount.Request),
    credentialId: Typebox.Optional(Type.String()),
    grantPermissions: Typebox.Optional(C.grantPermissions.Request),
    preCalls: Typebox.Optional(C.preCalls.Request),
    selectAccount: Typebox.Optional(Type.Boolean()),
  })
  export type Capabilities = Typebox.StaticDecode<typeof Capabilities>

  export const Request = Type.Object({
    method: Type.Literal('wallet_connect'),
    params: Typebox.Optional(
      Type.Tuple([
        Type.Object({
          capabilities: Typebox.Optional(Capabilities),
        }),
      ]),
    ),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const ResponseCapabilities = Type.Object({
    admins: Typebox.Optional(wallet_getAdmins.Response.properties.keys),
    permissions: Typebox.Optional(C.permissions.Response),
    preCalls: Typebox.Optional(C.preCalls.Response),
  })
  export type ResponseCapabilities = Typebox.StaticDecode<
    typeof ResponseCapabilities
  >

  export const Response = Type.Object({
    accounts: Type.Array(
      Type.Object({
        address: Primitive.Address,
        capabilities: Typebox.Optional(ResponseCapabilities),
      }),
    ),
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_disconnect {
  export const Request = Type.Object({
    method: Type.Literal('wallet_disconnect'),
    params: Typebox.Optional(Type.Undefined()),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = undefined
}

export namespace wallet_getCallsStatus {
  export const Request = Type.Object({
    method: Type.Literal('wallet_getCallsStatus'),
    params: Type.Tuple([Primitive.Hex]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Object({
    atomic: Type.Boolean(),
    chainId: Primitive.Number,
    id: Type.String(),
    receipts: Typebox.Optional(
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
    status: Type.Number(),
    version: Type.String(),
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_getCapabilities {
  export const Request = Type.Object({
    method: Type.Literal('wallet_getCapabilities'),
    params: Typebox.Optional(
      Type.Union([
        Type.Tuple([Primitive.Hex]),
        Type.Tuple([
          Type.Union([Primitive.Hex, Type.Undefined()]),
          Type.Array(Primitive.Number),
        ]),
      ]),
    ),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Record(
    Primitive.Hex,
    Type.Object({
      atomic: C.atomic.GetCapabilitiesResponse,
      feeToken: C.feeToken.GetCapabilitiesResponse,
      permissions: C.permissions.GetCapabilitiesResponse,
      sponsor: C.sponsor.GetCapabilitiesResponse,
    }),
  )
  export type Response = Typebox.StaticDecode<typeof Response>
  export type Response_raw = Typebox.Static<typeof Response>
}

export namespace wallet_getKeys {
  export const Parameters = Type.Object({
    address: Primitive.Address,
    chainId: Typebox.Optional(Primitive.Number),
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_getKeys'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Array(Key.WithPermissions)
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_prepareCalls {
  export const Capabilities = Type.Object({
    feeToken: Typebox.Optional(C.feeToken.Request),
    permissions: Typebox.Optional(C.permissions.Request),
    preCalls: Typebox.Optional(C.preCalls.Request),
    sponsorUrl: Typebox.Optional(C.sponsorUrl.Request),
  })
  export type Capabilities = Typebox.StaticDecode<typeof Capabilities>

  export const Parameters = Type.Object({
    calls: Type.Array(
      Type.Object({
        data: Typebox.Optional(Primitive.Hex),
        to: Primitive.Address,
        value: Typebox.Optional(Primitive.BigInt),
      }),
    ),
    capabilities: Typebox.Optional(Capabilities),
    chainId: Typebox.Optional(Primitive.Number),
    from: Typebox.Optional(Primitive.Address),
    key: Type.Object({
      prehash: Typebox.Optional(Type.Boolean()),
      publicKey: Primitive.Hex,
      type: Type.Union([
        Type.Literal('p256'),
        Type.Literal('secp256k1'),
        Type.Literal('webauthn-p256'),
        Type.Literal('address'),
      ]),
    }),
    version: Typebox.Optional(Type.String()),
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_prepareCalls'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Object({
    capabilities: Typebox.Optional(
      Type.Intersect([
        Rpc_server.wallet_prepareCalls.ResponseCapabilities,
        Type.Object({
          quote: Typebox.Optional(Quote.Quote),
        }),
      ]),
    ),
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
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_sendCalls {
  export const Request = Type.Object({
    method: Type.Literal('wallet_sendCalls'),
    params: Type.Tuple([Type.Omit(wallet_prepareCalls.Parameters, ['key'])]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Object({
    id: Primitive.Hex,
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_sendPreparedCalls {
  export const Parameters = Type.Object({
    capabilities: wallet_prepareCalls.Response.properties.capabilities,
    chainId: Primitive.Hex,
    context: wallet_prepareCalls.Response.properties.context,
    key: wallet_prepareCalls.Response.properties.key,
    signature: Primitive.Hex,
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  export const Request = Type.Object({
    method: Type.Literal('wallet_sendPreparedCalls'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Array(
    Type.Object({
      capabilities: Typebox.Optional(Type.Record(Type.String(), Type.Any())),
      id: Primitive.Hex,
    }),
  )
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_verifySignature {
  export const Parameters = Type.Object({
    /** Address of the account. */
    address: Primitive.Address,
    /** Chain ID. */
    chainId: Typebox.Optional(Primitive.Number),
    /** Digest to verify. */
    digest: Primitive.Hex,
    /** Signature to verify. */
    signature: Primitive.Hex,
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  /** Request for `wallet_verifySignature`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_verifySignature'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  /** Response for `wallet_verifySignature`. */
  export const Response = Type.Object({
    /** Address of the account. */
    address: Primitive.Address,
    /** Chain ID. */
    chainId: Primitive.Number,
    /** Proof that can be used to verify the signature. */
    proof: Typebox.Optional(Type.Unknown()),
    /** Whether the signature is valid. */
    valid: Type.Boolean(),
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}
