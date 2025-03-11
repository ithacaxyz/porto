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
    /** Capabilities for the account. */
    capabilities: Capabilities,
  })
  export type Parameters = Schema.StaticDecode<typeof Parameters>

  /** Request for `wallet_createAccount`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_createAccount'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Schema.StaticDecode<typeof Request>

  /** Response for `wallet_createAccount`. */
  export const Response = Type.Object({
    address: Primitive.Address,
    capabilities: ResponseCapabilities,
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_getKeys {
  /** Parameters for `wallet_getKeys` request. */
  export const Parameters = Type.Object({
    /** The address to get the keys for. */
    address: Primitive.Address,
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

export namespace wallet_prepareCalls {
  /** Capabilities for `wallet_prepareCalls` request. */
  export const Capabilities = Type.Object({
    /** Keys to authorize on the account. */
    authorizeKeys: Schema.Optional(C.authorizeKeys.Request),
    /** Metadata for the call bundle. */
    meta: C.meta.Request,
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
    /** The calls to prepare. */
    calls: Type.Array(
      Type.Object({
        to: Primitive.Address,
        data: Schema.Optional(Primitive.Hex),
        value: Schema.Optional(Primitive.BigInt),
      }),
    ),
    /** Capabilities for the account. */
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
    context: Quote.Signed,
    /** Digest to sign over. */
    digest: Primitive.Hex,
    /** Capabilities. */
    capabilities: ResponseCapabilities,
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
  })
  export type Capabilities = Schema.StaticDecode<typeof Capabilities>

  /** Parameters for `wallet_prepareUpgradeAccount` request. */
  export const Parameters = Type.Object({
    /** Address of the EOA to upgrade. */
    address: Primitive.Address,
    /** Chain ID to initialize the account on. */
    // TODO: `Primitive.Number`
    chainId: Type.Number(),
    /** Capabilities. */
    capabilities: Capabilities,
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

export namespace wallet_sendPreparedCalls {
  /** Parameters for `wallet_sendPreparedCalls` request. */
  export const Parameters = Type.Object({
    /** Quote for the call bundle. */
    context: Quote.Signed,
    /** Signature properties. */
    signature: Type.Object({
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
    id: Type.String(),
  })
  export type Response = Schema.StaticDecode<typeof Response>
}

export namespace wallet_upgradeAccount {
  export const Parameters = Type.Object({
    /** Signed authorization. */
    authorization: Type.Object({
      address: Primitive.Address,
      chainId: Primitive.Number,
      nonce: Primitive.Number,
      r: Primitive.Hex,
      s: Primitive.Hex,
      v: Schema.Optional(Primitive.BigInt),
      yParity: Schema.Optional(Primitive.Number),
    }),
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
