import * as Schema from 'effect/Schema'
import * as Quote from '../rpcServer/schema/quote.js'
import * as Rpc_server from '../rpcServer/schema/rpc.js'
import * as C from './capabilities.js'
import * as Key from './key.js'
import * as Permissions from './permissions.js'
import * as Primitive from './primitive.js'

const KeyWithCredentialId = Schema.extend(
  Key.Base.pick('id', 'publicKey', 'type'),
  Schema.Struct({
    credentialId: Schema.optional(Schema.String),
  }),
)

export namespace account_setEmail {
  export const Parameters = Schema.Struct({
    email: Schema.String,
    walletAddress: Primitive.Address,
  }).annotations({
    identifier: 'Rpc.account_setEmail.Parameters',
  })

  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('account_setEmail'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.account_setEmail.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Null.annotations({
    identifier: 'Rpc.account_setEmail.Response',
  })
  export type Response = typeof Response.Type
}

export namespace account_verifyEmail {
  export const Parameters = Schema.Struct({
    chainId: Primitive.Number,
    email: Schema.String,
    token: Schema.String,
    walletAddress: Primitive.Address,
  }).annotations({
    identifier: 'Rpc.account_verifyEmail.Parameters',
  })

  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('account_verifyEmail'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.account_verifyEmail.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Null.annotations({
    identifier: 'Rpc.account_verifyEmail.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_addFunds {
  export const Parameters = Schema.Struct({
    address: Schema.optional(Primitive.Address),
    token: Schema.optional(Primitive.Address),
    value: Schema.optional(Primitive.BigInt),
  }).annotations({
    identifier: 'Rpc.wallet_addFunds.Parameters',
  })

  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_addFunds'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_addFunds.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Struct({
    id: Primitive.Hex,
  }).annotations({
    identifier: 'Rpc.wallet_addFunds.Response',
  })
  export type Response = typeof Response.Type
}

export namespace eth_accounts {
  export const Request = Schema.Struct({
    method: Schema.Literal('eth_accounts'),
    params: Schema.optional(Schema.Undefined),
  }).annotations({
    identifier: 'Rpc.eth_accounts.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Array(Primitive.Address).annotations({
    identifier: 'Rpc.eth_accounts.Response',
  })
  export type Response = typeof Response.Type
}

export namespace eth_chainId {
  export const Request = Schema.Struct({
    method: Schema.Literal('eth_chainId'),
    params: Schema.optional(Schema.Undefined),
  }).annotations({
    identifier: 'Rpc.eth_chainId.Request',
  })
  export type Request = typeof Request.Type
  export const Response = Primitive.Hex.annotations({
    identifier: 'Rpc.eth_chainId.Response',
  })
  export type Response = typeof Response.Type
}

export namespace eth_requestAccounts {
  export const Request = Schema.Struct({
    method: Schema.Literal('eth_requestAccounts'),
    params: Schema.optional(Schema.Undefined),
  }).annotations({
    identifier: 'Rpc.eth_requestAccounts.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Array(Primitive.Address).annotations({
    identifier: 'Rpc.eth_requestAccounts.Response',
  })
  export type Response = typeof Response.Type
}

export namespace eth_sendTransaction {
  export const Request = Schema.Struct({
    method: Schema.Literal('eth_sendTransaction'),
    params: Schema.Tuple(
      Schema.Struct({
        capabilities: Schema.optional(
          Schema.Struct({
            preCalls: Schema.optional(C.preCalls.Request),
          }),
        ),
        chainId: Schema.optional(Primitive.Number),
        data: Schema.optional(Primitive.Hex),
        from: Schema.optional(Primitive.Address),
        to: Primitive.Address,
        value: Schema.optional(Primitive.BigInt),
      }),
    ),
  }).annotations({
    identifier: 'Rpc.eth_sendTransaction.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Primitive.Hex.annotations({
    identifier: 'Rpc.eth_sendTransaction.Response',
  })
  export type Response = typeof Response.Type
}

export namespace eth_signTypedData_v4 {
  export const Request = Schema.Struct({
    method: Schema.Literal('eth_signTypedData_v4'),
    params: Schema.Tuple(Primitive.Address, Schema.String),
  }).annotations({
    identifier: 'Rpc.eth_signTypedData_v4.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Primitive.Hex.annotations({
    identifier: 'Rpc.eth_signTypedData_v4.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_getAdmins {
  export const Parameters = Schema.Struct({
    address: Schema.optional(Primitive.Address),
    chainId: Schema.optional(Primitive.Number),
  }).annotations({
    identifier: 'Rpc.wallet_getAdmins.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_getAdmins'),
    params: Schema.optional(Schema.Tuple(Parameters)),
  }).annotations({
    identifier: 'Rpc.wallet_getAdmins.Request',
  })
  export type Request = typeof Request.Type

  export const Key = KeyWithCredentialId

  export const Response = Schema.Struct({
    address: Primitive.Address,
    chainId: Primitive.Number,
    keys: Schema.Array(Key),
  }).annotations({
    identifier: 'Rpc.wallet_getAdmins.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_grantAdmin {
  export const Capabilities = Schema.Struct({
    feeToken: Schema.optional(C.feeToken.Request),
  }).annotations({
    identifier: 'Rpc.wallet_grantAdmin.Capabilities',
  })
  export type Capabilities = typeof Capabilities.Type

  export const Parameters = Schema.Struct({
    /** Address of the account to authorize the admin for. */
    address: Schema.optional(Primitive.Address),
    /** Capabilities. */
    capabilities: Schema.optional(Capabilities),
    /** Chain ID. */
    chainId: Schema.optional(Primitive.Number),
    /** Admin Key to authorize. */
    key: Key.Base.pick('publicKey', 'type'),
  }).annotations({
    identifier: 'Rpc.wallet_grantAdmin.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_grantAdmin'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_grantAdmin.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Struct({
    address: Primitive.Address,
    chainId: Primitive.Number,
    key: wallet_getAdmins.Key,
  }).annotations({
    identifier: 'Rpc.wallet_grantAdmin.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_grantPermissions {
  export const Parameters = Permissions.Request
  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_grantPermissions'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_grantPermissions.Request',
  })
  export type Request = typeof Request.Type

  export const ResponseCapabilities = Schema.Struct({
    preCalls: Schema.optional(C.preCalls.Response),
  }).annotations({
    identifier: 'Rpc.wallet_grantPermissions.ResponseCapabilities',
  })
  export type ResponseCapabilities = typeof ResponseCapabilities.Type

  export const Response = Schema.extend(
    Permissions.Permissions,
    Schema.Struct({
      capabilities: Schema.optional(Schema.Any),
    }),
  ).annotations({
    identifier: 'Rpc.wallet_grantPermissions.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_getAccountVersion {
  export const Parameters = Schema.Struct({
    address: Schema.optional(Primitive.Address),
  }).annotations({
    identifier: 'Rpc.wallet_getAccountVersion.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_getAccountVersion'),
    params: Schema.optional(Schema.Tuple(Parameters)),
  }).annotations({
    identifier: 'Rpc.wallet_getAccountVersion.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Struct({
    current: Schema.String,
    latest: Schema.String,
  }).annotations({
    identifier: 'Rpc.wallet_getAccountVersion.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_getPermissions {
  export const Parameters = Schema.Struct({
    address: Schema.optional(Primitive.Address),
    chainId: Schema.optional(Primitive.Number),
  }).annotations({
    identifier: 'Rpc.wallet_getPermissions.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_getPermissions'),
    params: Schema.optional(Schema.Tuple(Parameters)),
  }).annotations({
    identifier: 'Rpc.wallet_getPermissions.Request',
  })
  export type Request = typeof Request.Type

  export const Response = C.permissions.Response
  export type Response = typeof Response.Type
}

export namespace wallet_revokeAdmin {
  export const Capabilities = Schema.Struct({
    feeToken: Schema.optional(C.feeToken.Request),
  }).annotations({
    identifier: 'Rpc.wallet_revokeAdmin.Capabilities',
  })
  export type Capabilities = typeof Capabilities.Type

  export const Parameters = Schema.Struct({
    address: Schema.optional(Primitive.Address),
    capabilities: Schema.optional(Capabilities),
    chainId: Schema.optional(Primitive.Number),
    id: Primitive.Hex,
  }).annotations({
    identifier: 'Rpc.wallet_revokeAdmin.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_revokeAdmin'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_revokeAdmin.Request',
  })
  export type Request = typeof Request.Type

  export const Response = undefined
}

export namespace wallet_revokePermissions {
  export const Capabilities = Schema.Struct({
    feeToken: Schema.optional(C.feeToken.Request),
  }).annotations({
    identifier: 'Rpc.wallet_revokePermissions.Capabilities',
  })
  export type Capabilities = typeof Capabilities.Type

  export const Parameters = Schema.Struct({
    address: Schema.optional(Primitive.Address),
    capabilities: Schema.optional(Capabilities),
    id: Primitive.Hex,
  }).annotations({
    identifier: 'Rpc.wallet_revokePermissions.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_revokePermissions'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_revokePermissions.Request',
  })
  export type Request = typeof Request.Type

  export const Response = undefined
}

export namespace wallet_updateAccount {
  export const Parameters = Schema.Struct({
    address: Schema.optional(Primitive.Address),
  }).annotations({
    identifier: 'Rpc.wallet_updateAccount.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_updateAccount'),
    params: Schema.optional(Schema.Tuple(Parameters)),
  }).annotations({
    identifier: 'Rpc.wallet_updateAccount.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Struct({
    id: Schema.optional(Primitive.Hex),
  }).annotations({
    identifier: 'Rpc.wallet_updateAccount.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_upgradeAccount {
  export const Parameters = Schema.Struct({
    context: Schema.Unknown,
    signatures: Schema.Struct({
      auth: Primitive.Hex,
      exec: Primitive.Hex,
    }),
  }).annotations({
    identifier: 'Rpc.wallet_upgradeAccount.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_upgradeAccount'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_upgradeAccount.Request',
  })
  export type Request = typeof Request.Type

  export const ResponseCapabilities = Schema.Struct({
    admins: Schema.optional(Schema.Array(wallet_getAdmins.Key)),
    permissions: Schema.optional(C.permissions.Response),
  }).annotations({
    identifier: 'Rpc.wallet_upgradeAccount.ResponseCapabilities',
  })
  export type ResponseCapabilities = typeof ResponseCapabilities.Type

  export const Response = Schema.Struct({
    address: Primitive.Address,
    capabilities: Schema.optional(ResponseCapabilities),
  }).annotations({
    identifier: 'Rpc.wallet_upgradeAccount.Response',
  })
  export type Response = typeof Response.Type
}

export namespace personal_sign {
  export const Request = Schema.Struct({
    method: Schema.Literal('personal_sign'),
    params: Schema.Tuple(Primitive.Hex, Primitive.Address),
  }).annotations({
    identifier: 'Rpc.personal_sign.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Primitive.Hex.annotations({
    identifier: 'Rpc.personal_sign.Response',
  })
}

export namespace porto_ping {
  export const Request = Schema.Struct({
    method: Schema.Literal('porto_ping'),
    params: Schema.optional(Schema.Undefined),
  }).annotations({
    identifier: 'Rpc.porto_ping.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Literal('pong').annotations({
    identifier: 'Rpc.porto_ping.Response',
  })
}

export namespace wallet_connect {
  export const Capabilities = Schema.Struct({
    address: Schema.optional(Primitive.Address),
    createAccount: Schema.optional(C.createAccount.Request),
    credentialId: Schema.optional(Schema.String),
    email: Schema.optional(Schema.Boolean),
    grantAdmins: Schema.optional(
      Schema.Array(Key.Base.pick('publicKey', 'type')),
    ),
    grantPermissions: Schema.optional(C.grantPermissions.Request),
    preCalls: Schema.optional(C.preCalls.Request),
    selectAccount: Schema.optional(Schema.Boolean),
    signInWithEthereum: Schema.optional(C.signInWithEthereum.Request),
  }).annotations({
    identifier: 'Rpc.wallet_connect.Capabilities',
  })
  export type Capabilities = typeof Capabilities.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_connect'),
    params: Schema.optional(
      Schema.Tuple(
        Schema.Struct({
          capabilities: Schema.optional(Capabilities),
        }),
      ),
    ),
  }).annotations({
    identifier: 'Rpc.wallet_connect.Request',
  })
  export type Request = typeof Request.Type

  export const ResponseCapabilities = Schema.Struct({
    admins: Schema.optional(
      Schema.Array(
        Schema.extend(
          Key.Base.pick('id', 'publicKey', 'type'),
          Schema.Struct({
            credentialId: Schema.optional(Schema.String),
          }),
        ),
      ),
    ),
    permissions: Schema.optional(C.permissions.Response),
    preCalls: Schema.optional(C.preCalls.Response),
    signInWithEthereum: Schema.optional(C.signInWithEthereum.Response),
  }).annotations({
    identifier: 'Rpc.wallet_connect.ResponseCapabilities',
  })
  export type ResponseCapabilities = typeof ResponseCapabilities.Type

  export const Response = Schema.Struct({
    accounts: Schema.Array(
      Schema.Struct({
        address: Primitive.Address,
        capabilities: Schema.optional(ResponseCapabilities),
      }),
    ),
    chainIds: Schema.Array(Primitive.Number),
  }).annotations({
    identifier: 'Rpc.wallet_connect.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_disconnect {
  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_disconnect'),
    params: Schema.optional(Schema.Undefined),
  }).annotations({
    identifier: 'Rpc.wallet_disconnect.Request',
  })
  export type Request = typeof Request.Type

  export const Response = undefined
}

export namespace wallet_getCallsStatus {
  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_getCallsStatus'),
    params: Schema.Tuple(Primitive.Hex),
  }).annotations({
    identifier: 'Rpc.wallet_getCallsStatus.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Struct({
    atomic: Schema.Boolean,
    chainId: Primitive.Number,
    id: Schema.String,
    receipts: Schema.optional(
      Schema.Array(
        Schema.Struct({
          blockHash: Primitive.Hex,
          blockNumber: Primitive.Hex,
          gasUsed: Primitive.Hex,
          logs: Schema.Array(
            Schema.Struct({
              address: Primitive.Address,
              data: Primitive.Hex,
              topics: Schema.Array(Primitive.Hex),
            }),
          ),
          status: Primitive.Hex,
          transactionHash: Primitive.Hex,
        }),
      ),
    ),
    status: Schema.Number,
    version: Schema.String,
  }).annotations({
    identifier: 'Rpc.wallet_getCallsStatus.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_getCapabilities {
  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_getCapabilities'),
    params: Schema.optional(
      Schema.Union(
        Schema.Tuple(Primitive.Hex),
        Schema.Tuple(
          Schema.Union(Primitive.Hex, Schema.Undefined),
          Schema.Array(Primitive.Number),
        ),
      ),
    ),
  }).annotations({
    identifier: 'Rpc.wallet_getCapabilities.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Record({
    key: Primitive.Hex,
    value: Schema.Struct({
      atomic: C.atomic.GetCapabilitiesResponse,
      feeToken: C.feeToken.GetCapabilitiesResponse,
      merchant: C.merchant.GetCapabilitiesResponse,
      permissions: C.permissions.GetCapabilitiesResponse,
    }),
  }).annotations({
    identifier: 'Rpc.wallet_getCapabilities.Response',
  })
  export type Response = typeof Response.Type
  export type Response_raw = typeof Response.Type
}

export namespace wallet_getKeys {
  export const Parameters = Schema.Struct({
    address: Primitive.Address,
    chainId: Schema.optional(Primitive.Number),
  }).annotations({
    identifier: 'Rpc.wallet_getKeys.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_getKeys'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_getKeys.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Array(Key.WithPermissions).annotations({
    identifier: 'Rpc.wallet_getKeys.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_prepareCalls {
  export const Capabilities = Schema.Struct({
    feeToken: Schema.optional(C.feeToken.Request),
    merchantRpcUrl: Schema.optional(C.merchantRpcUrl.Request),
    permissions: Schema.optional(C.permissions.Request),
    preCalls: Schema.optional(C.preCalls.Request),
  }).annotations({
    identifier: 'Rpc.wallet_prepareCalls.Capabilities',
  })
  export type Capabilities = typeof Capabilities.Type

  export const Parameters = Schema.Struct({
    calls: Schema.Array(
      Schema.Struct({
        data: Schema.optional(Primitive.Hex),
        to: Primitive.Address,
        value: Schema.optional(Primitive.BigInt),
      }),
    ),
    capabilities: Schema.optional(Capabilities),
    chainId: Schema.optional(Primitive.Number),
    from: Schema.optional(Primitive.Address),
    key: Schema.optional(Key.Base.pick('prehash', 'publicKey', 'type')),
    version: Schema.optional(Schema.String),
  }).annotations({
    identifier: 'Rpc.wallet_prepareCalls.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_prepareCalls'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_prepareCalls.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Struct({
    capabilities: Schema.optional(
      Schema.extend(
        Rpc_server.wallet_prepareCalls.ResponseCapabilities,
        Schema.Struct({
          quote: Schema.optional(Quote.Signed),
        }),
      ),
    ),
    chainId: Primitive.Hex,
    context: Schema.Struct({
      account: Schema.Struct({
        address: Primitive.Address,
      }),
      calls: Parameters.fields.calls,
      nonce: Primitive.BigInt,
      quote: Schema.optional(Schema.partial(Quote.Signed)),
    }),
    digest: Primitive.Hex,
    key: Key.Base.pick('prehash', 'publicKey', 'type'),
    typedData: Schema.Struct({
      domain: Schema.Struct({
        chainId: Schema.Number,
        name: Schema.String,
        verifyingContract: Primitive.Address,
        version: Schema.String,
      }),
      message: Schema.Record({ key: Schema.String, value: Schema.Unknown }),
      primaryType: Schema.String,
      types: Schema.Record({ key: Schema.String, value: Schema.Unknown }),
    }),
  }).annotations({
    identifier: 'Rpc.wallet_prepareCalls.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_prepareUpgradeAccount {
  export const Capabilities = Schema.extend(
    wallet_connect.Capabilities,
    Schema.Struct({
      label: Schema.optional(Schema.String),
    }).annotations({
      identifier: 'Rpc.wallet_prepareUpgradeAccount.CapabilitiesExtension',
    }),
  ).annotations({
    identifier: 'Rpc.wallet_prepareUpgradeAccount.Capabilities',
  })
  export type Capabilities = typeof Capabilities.Type

  export const Parameters = Schema.Struct({
    address: Primitive.Address,
    capabilities: Schema.optional(Capabilities),
    chainId: Schema.optional(Primitive.Number),
  }).annotations({
    identifier: 'Rpc.wallet_prepareUpgradeAccount.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_prepareUpgradeAccount'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_prepareUpgradeAccount.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Struct({
    context: Schema.Unknown,
    digests: Schema.Struct({
      auth: Primitive.Hex,
      exec: Primitive.Hex,
    }),
  }).annotations({
    identifier: 'Rpc.wallet_prepareUpgradeAccount.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_sendCalls {
  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_sendCalls'),
    params: Schema.Tuple(wallet_prepareCalls.Parameters.omit('key')),
  }).annotations({
    identifier: 'Rpc.wallet_sendCalls.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Struct({
    id: Primitive.Hex,
  }).annotations({
    identifier: 'Rpc.wallet_sendCalls.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_sendPreparedCalls {
  export const Parameters = Schema.Struct({
    capabilities: wallet_prepareCalls.Response.fields.capabilities,
    chainId: Primitive.Hex,
    context: wallet_prepareCalls.Response.fields.context,
    key: wallet_prepareCalls.Response.fields.key,
    signature: Primitive.Hex,
  }).annotations({
    identifier: 'Rpc.wallet_sendPreparedCalls.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_sendPreparedCalls'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_sendPreparedCalls.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Array(
    Schema.Struct({
      capabilities: Schema.optional(
        Schema.Record({ key: Schema.String, value: Schema.Any }),
      ),
      id: Primitive.Hex,
    }),
  ).annotations({
    identifier: 'Rpc.wallet_sendPreparedCalls.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_verifySignature {
  export const Parameters = Schema.Struct({
    /** Address of the account. */
    address: Primitive.Address,
    /** Chain ID. */
    chainId: Schema.optional(Primitive.Number),
    /** Digest to verify. */
    digest: Primitive.Hex,
    /** Signature to verify. */
    signature: Primitive.Hex,
  }).annotations({
    identifier: 'Rpc.wallet_verifySignature.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  /** Request for `wallet_verifySignature`. */
  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_verifySignature'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_verifySignature.Request',
  })
  export type Request = typeof Request.Type

  /** Response for `wallet_verifySignature`. */
  export const Response = Schema.Struct({
    /** Address of the account. */
    address: Primitive.Address,
    /** Chain ID. */
    chainId: Primitive.Number,
    /** Proof that can be used to verify the signature. */
    proof: Schema.optional(Schema.Unknown),
    /** Whether the signature is valid. */
    valid: Schema.Boolean,
  }).annotations({
    identifier: 'Rpc.wallet_verifySignature.Response',
  })
  export type Response = typeof Response.Type
}
