/**
 * JSON-RPC Schemas for Relay.
 *
 * @see https://github.com/ithacaxyz/relay/tree/main/src/types/rpc
 */

import * as Primitive from '../../typebox/primitive.js'
import * as Schema from '../../typebox/schema.js'
import { Type } from '../../typebox/schema.js'
import * as C from './capabilities.js'
import * as Key from './key.js'
import * as Quote from './quote.js'
import * as UserOp from './userOp.js'

const Authorization = Type.Object({
  address: Primitive.Address,
  chainId: Primitive.Number,
  nonce: Primitive.Number,
  r: Primitive.Hex,
  s: Primitive.Hex,
  v: Schema.Optional(Primitive.BigInt),
  yParity: Schema.Optional(Primitive.Number),
})

const Call = Type.Object({
  data: Schema.Optional(Primitive.Hex),
  to: Primitive.Address,
  value: Schema.Optional(Primitive.BigInt),
})

export namespace relay_health {
  export const Request = Type.Object({
    method: Type.Literal('relay_health'),
    params: Type.Undefined(),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Type.Object({
    /** Delegation proxy address. */
    delegationProxy: Primitive.Address,
    /** Entrypoint address. */
    entrypoint: Primitive.Address,
    /** Quote configuration. */
    quoteConfig: Type.Object({
      /** Sets a constant rate for the price oracle. Used for testing. */
      constantRate: Schema.Optional(Type.Union([Type.Number(), Type.Null()])),
      /** Gas estimate configuration. */
      gas: Schema.Optional(
        Type.Object({
          /** Extra buffer added to transaction gas estimates. */
          txBuffer: Schema.Optional(Type.Number()),
          /** Extra buffer added to UserOp gas estimates. */
          userOpBuffer: Schema.Optional(Type.Number()),
        }),
      ),
      /** The lifetime of a price rate. */
      rateTtl: Type.Number(),
      /** The lifetime of a fee quote. */
      ttl: Type.Number(),
    }),
    /** Version of the relay. */
    version: Type.String(),
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_getAccounts {
  /** Parameters for `wallet_getAccounts` request. */
  export const Parameters = Type.Object({
    /** Key identifier. */
    chain_id: Type.Number(),
    /** Target chain ID. */
    // TODO: `Primitive.Number`
    id: Primitive.Hex,
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  /** Request for `wallet_getAccounts`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_getAccounts'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  /** Response for `wallet_getAccounts`. */
  export const Response = Type.Array(
    Type.Object({
      /** Account address. */
      address: Primitive.Address,
      /** Keys authorized on the account. */
      keys: C.authorizeKeys.Response,
    }),
  )
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_getCallsStatus {
  export const Request = Type.Object({
    method: Type.Literal('wallet_getCallsStatus'),
    params: Type.Tuple([Primitive.Hex]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  export const Response = Type.Object({
    id: Type.String(),
    receipts: Schema.Optional(
      Type.Array(
        Type.Object({
          blockHash: Primitive.Hex,
          blockNumber: Type.Number(),
          chainId: Type.Number(),
          gasUsed: Type.Number(),
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
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_getKeys {
  /** Parameters for `wallet_getKeys` request. */
  export const Parameters = Type.Object({
    /** The address to get the keys for. */
    address: Primitive.Address,
    /** Target chain ID. */
    // TODO: `Primitive.Number`
    chain_id: Type.Number(),
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  /** Request for `wallet_getKeys`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_getKeys'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  /** Response for `wallet_getKeys`. */
  export const Response = C.authorizeKeys.Response
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_prepareCreateAccount {
  /** Capabilities for `wallet_prepareCreateAccount` request. */
  export const Capabilities = Type.Object({
    /** Keys to authorize on the account. */
    authorizeKeys: C.authorizeKeys.Request,
    /** Contract address to delegate to. */
    delegation: Primitive.Address,
  })
  export type Capabilities = Schema.StaticDecode<typeof Capabilities>

  /** Capabilities for `wallet_prepareCreateAccount` response. */
  export const ResponseCapabilities = Type.Object({
    /** Keys authorized on the account. */
    authorizeKeys: C.authorizeKeys.Response,
    /** Contract address delegated to. */
    delegation: Primitive.Address,
  })
  export type ResponseCapabilities = Schema.StaticDecode<
    typeof ResponseCapabilities
  >

  /** Parameters for `wallet_prepareCreateAccount` request. */
  export const Parameters = Type.Object({
    /** Capabilities for the account. */
    capabilities: Capabilities,
    /** The chain ID to create the account on. */
    chainId: Primitive.Number,
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  /** Request for `wallet_prepareCreateAccount`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_prepareCreateAccount'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  /** Response for `wallet_prepareCreateAccount`. */
  export const Response = Type.Object({
    address: Primitive.Address,
    capabilities: ResponseCapabilities,
    context: Type.Object({
      account: Type.Object({
        address: Primitive.Address,
        initCalls: Type.Array(Call),
        salt: Type.Number(),
        signedAuthorization: Authorization,
      }),
      chainId: Primitive.Number,
    }),
    digests: Type.Array(Primitive.Hex),
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_createAccount {
  /** Capabilities for `wallet_createAccount` request. */
  export const Capabilities = Type.Object({
    /** Keys to authorize on the account. */
    authorizeKeys: C.authorizeKeys.Request,
    /** Contract address to delegate to. */
    delegation: Primitive.Address,
  })
  export type Capabilities = Schema.StaticDecode<typeof Capabilities>

  /** Capabilities for `wallet_createAccount` response. */
  export const ResponseCapabilities = Type.Object({
    /** Keys authorized on the account. */
    authorizeKeys: C.authorizeKeys.Response,
    /** Contract address delegated to. */
    delegation: Primitive.Address,
  })
  export type ResponseCapabilities = Schema.StaticDecode<
    typeof ResponseCapabilities
  >

  /** Parameters for `wallet_createAccount` request. */
  export const Parameters = Type.Object({
    /** Context. */
    context: wallet_prepareCreateAccount.Response.properties.context,
    /** Signatures. */
    signatures: Type.Array(
      Type.Object({
        /** Whether the digest was prehashed. */
        prehash: Schema.Optional(Type.Boolean()),
        /** The public key of the account. */
        publicKey: Primitive.Hex,
        /** The type of the account. */
        type: Key.Key.properties.type,
        /** The value of the account. */
        value: Primitive.Hex,
      }),
    ),
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  /** Request for `wallet_createAccount`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_createAccount'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  /** Response for `wallet_createAccount`. */
  export const Response = Type.Undefined()
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_prepareCalls {
  /** Capabilities for `wallet_prepareCalls` request. */
  export const Capabilities = Type.Object({
    /** Keys to authorize on the account. */
    authorizeKeys: Schema.Optional(C.authorizeKeys.Request),
    /** Metadata for the call bundle. */
    meta: C.meta.Request,
    /** Optional preOps to execute before signature verification. */
    preOp: Schema.Optional(Type.Boolean()),
    /** Whether the call bundle is to be considered a preop. */
    preOps: Schema.Optional(Type.Array(UserOp.UserOp)),
    /** Keys to revoke on the account. */
    revokeKeys: Schema.Optional(C.revokeKeys.Request),
  })
  export type Capabilities = Schema.StaticDecode<typeof Capabilities>

  /** Capabilities for `wallet_prepareCalls` response. */
  export const ResponseCapabilities = Type.Object({
    /** Keys authorized on the account. */
    authorizeKeys: Schema.Optional(
      Type.Union([C.authorizeKeys.Response, Type.Null()]),
    ),
    /** Keys revoked on the account. */
    revokeKeys: Schema.Optional(
      Type.Union([C.revokeKeys.Response, Type.Null()]),
    ),
  })
  export type ResponseCapabilities = Schema.StaticDecode<
    typeof ResponseCapabilities
  >

  /** Parameters for `wallet_prepareCalls` request. */
  export const Parameters = Type.Object({
    /** Capabilities for the account. */
    calls: Type.Array(Call),
    /** The calls to prepare. */
    capabilities: Capabilities,
    /** The chain ID of the call bundle. */
    // TODO: `Primitive.Number`
    chainId: Type.Number(),
    /** The address of the account to prepare the calls for. */
    from: Primitive.Address,
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  /** Request for `wallet_prepareCalls`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_prepareCalls'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  /** Response for `wallet_prepareCalls`. */
  export const Response = Type.Object({
    /** Quote for the call bundle. */
    capabilities: ResponseCapabilities,
    /** Digest to sign over. */
    context: Quote.Signed,
    /** Capabilities. */
    digest: Primitive.Hex,
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_prepareUpgradeAccount {
  /** Capabilities for `wallet_prepareUpgradeAccount` request. */
  export const Capabilities = Type.Object({
    /** Keys to authorize on the account. */
    authorizeKeys: C.authorizeKeys.Request,
    /** Contract address to delegate to. */
    delegation: Primitive.Address,
    /**
     * ERC20 token to pay for the gas of the calls.
     * If `None`, the native token will be used.
     */
    feeToken: Schema.Optional(Primitive.Address),
    /** Optional preOps to execute before signature verification. */
    preOps: Schema.Optional(Type.Array(UserOp.UserOp)),
  })
  export type Capabilities = Schema.StaticDecode<typeof Capabilities>

  /** Parameters for `wallet_prepareUpgradeAccount` request. */
  export const Parameters = Type.Object({
    /** Address of the EOA to upgrade. */
    address: Primitive.Address,
    /** Chain ID to initialize the account on. */
    // TODO: `Primitive.Number`
    capabilities: Capabilities,
    /** Capabilities. */
    chainId: Type.Number(),
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  /** Request for `wallet_prepareUpgradeAccount`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_prepareUpgradeAccount'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  /** Response for `wallet_prepareUpgradeAccount`. */
  export const Response = wallet_prepareCalls.Response
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_feeTokens {
  /** Request for `wallet_feeTokens`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_feeTokens'),
    params: Schema.Optional(Type.Undefined()),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  /** Response for `wallet_feeTokens`. */
  export const Response = Type.Record(
    Primitive.Hex,
    Type.Array(
      Type.Object({
        address: Primitive.Address,
        coin: Type.String(),
        decimals: Type.Number(),
      }),
    ),
  )
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_sendPreparedCalls {
  /** Parameters for `wallet_sendPreparedCalls` request. */
  export const Parameters = Type.Object({
    /** Quote for the call bundle. */
    context: Quote.Signed,
    /** Signature properties. */
    signature: Type.Object({
      /** Whether the digest was prehashed. */
      prehash: Schema.Optional(Type.Boolean()),
      /** The public key of the account. */
      publicKey: Primitive.Hex,
      /** The type of the account. */
      type: Key.Key.properties.type,
      /** The value of the account. */
      value: Primitive.Hex,
    }),
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  /** Request for `wallet_sendPreparedCalls`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_sendPreparedCalls'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  /** Response for `wallet_sendPreparedCalls`. */
  export const Response = Type.Object({
    /** The ID of the call bundle. */
    id: Primitive.Hex,
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_upgradeAccount {
  export const Parameters = Type.Object({
    /** Signed authorization. */
    authorization: Authorization,
    /** Signed quote of the prepared bundle. */
    context: Quote.Signed,
    /** Signature of the `wallet_prepareUpgradeAccount` digest. */
    signature: Primitive.Hex,
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  /** Request for `wallet_sendPreparedCalls`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_upgradeAccount'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  /** Response for `wallet_sendPreparedCalls`. */
  export const Response = Type.Object({
    /** Call bundles that were executed. */
    bundles: Type.Array(wallet_sendPreparedCalls.Response),
  })
  export type Response = Schema.StaticDecode<typeof Response>
}
