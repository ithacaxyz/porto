/**
 * JSON-RPC Schemas.
 *
 * @see https://github.com/ithacaxyz/relay/tree/main/src/types/rpc
 */

import * as Primitive from '../../typebox/primitive.js'
import * as Typebox from '../../typebox/typebox.js'
import { Type } from '../../typebox/typebox.js'
import * as C from './capabilities.js'
import * as Key from './key.js'
import * as PreCall from './preCall.js'
import * as Quote from './quote.js'

const Authorization = Type.Object({
  address: Primitive.Address,
  chainId: Primitive.Number,
  nonce: Primitive.Number,
})

const Call = Type.Object({
  data: Typebox.Optional(Primitive.Hex),
  to: Primitive.Address,
  value: Typebox.Optional(Primitive.BigInt),
})

export namespace health {
  export const Request = Type.Object({
    method: Type.Literal('health'),
    params: Type.Undefined(),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.String()
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_getAccounts {
  /** Parameters for `wallet_getAccounts` request. */
  export const Parameters = Type.Object({
    /** Target chain ID. */
    // TODO: `Primitive.Number`
    chainId: Type.Number(),
    /** Key identifier. */
    id: Primitive.Hex,
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  /** Request for `wallet_getAccounts`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_getAccounts'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  /** Response for `wallet_getAccounts`. */
  export const Response = Type.Array(
    Type.Object({
      /** Account address. */
      address: Primitive.Address,
      /** Keys authorized on the account. */
      keys: C.authorizeKeys.Response,
    }),
  )
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_getCapabilities {
  /** Request for `wallet_getCapabilities`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_getCapabilities'),
    params: Type.Tuple([Type.Array(Type.Number())]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  const VersionedContract = Type.Object({
    address: Primitive.Address,
    version: Typebox.Optional(Type.Union([Type.String(), Type.Null()])),
  })

  export const Response = Type.Record(
    Primitive.Hex,
    Type.Object({
      contracts: Type.Object({
        /** Account implementation address. */
        accountImplementation: VersionedContract,
        /** Account proxy address. */
        accountProxy: VersionedContract,
        /** Legacy account implementation address. */
        legacyAccountImplementations: Type.Array(VersionedContract),
        /** Legacy orchestrator address. */
        legacyOrchestrators: Type.Array(VersionedContract),
        /** Orchestrator address. */
        orchestrator: VersionedContract,
        /** Simulator address. */
        simulator: VersionedContract,
      }),
      fees: Type.Object({
        /** Fee recipient address. */
        quoteConfig: Type.Object({
          /** Sets a constant rate for the price oracle. Used for testing. */
          constantRate: Typebox.Optional(
            Type.Union([Type.Number(), Type.Null()]),
          ),
          /** Gas estimate configuration. */
          gas: Typebox.Optional(
            Type.Object({
              /** Extra buffer added to Intent gas estimates. */
              intentBuffer: Typebox.Optional(Type.Number()),
              /** Extra buffer added to transaction gas estimates. */
              txBuffer: Typebox.Optional(Type.Number()),
            }),
          ),
          /** The lifetime of a price rate. */
          rateTtl: Type.Number(),
          /** The lifetime of a fee quote. */
          ttl: Type.Number(),
        }),
        /** Quote configuration. */
        recipient: Primitive.Address,
        /** Tokens the fees can be paid in. */
        tokens: Type.Array(
          Type.Object({
            address: Primitive.Address,
            decimals: Type.Number(),
            kind: Type.String(),
            nativeRate: Typebox.Optional(Primitive.BigInt),
            symbol: Type.String(),
          }),
        ),
      }),
    }),
  )
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_getCallsStatus {
  export const Request = Type.Object({
    method: Type.Literal('wallet_getCallsStatus'),
    params: Type.Tuple([Primitive.Hex]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export const Response = Type.Object({
    id: Type.String(),
    receipts: Typebox.Optional(
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
  export type Response = Typebox.StaticDecode<typeof Response>
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
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  /** Request for `wallet_getKeys`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_getKeys'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  /** Response for `wallet_getKeys`. */
  export const Response = C.authorizeKeys.Response
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_prepareCalls {
  /** Capabilities for `wallet_prepareCalls` request. */
  export const Capabilities = Type.Object({
    /** Keys to authorize on the account. */
    authorizeKeys: Typebox.Optional(C.authorizeKeys.Request),
    /** Metadata for the call bundle. */
    meta: C.meta.Request,
    /** Whether the call bundle is to be considered a preCall. */
    preCall: Typebox.Optional(Type.Boolean()),
    /** Optional preCalls to execute before signature verification. */
    preCalls: Typebox.Optional(Type.Array(PreCall.PreCall)),
    /** Keys to revoke on the account. */
    revokeKeys: Typebox.Optional(C.revokeKeys.Request),
  })
  export type Capabilities = Typebox.StaticDecode<typeof Capabilities>

  /** Capabilities for `wallet_prepareCalls` response. */
  export const ResponseCapabilities = Type.Object({
    /** Asset diff. */
    assetDiff: Typebox.Optional(
      Type.Array(
        Type.Tuple([
          Primitive.Address,
          Type.Array(
            Type.Union([
              Type.Object({
                address: Typebox.Optional(
                  Type.Union([Primitive.Address, Type.Null()]),
                ),
                decimals: Typebox.Optional(
                  Type.Union([Type.Number(), Type.Null()]),
                ),
                direction: Type.Union([
                  Type.Literal('incoming'),
                  Type.Literal('outgoing'),
                ]),
                name: Typebox.Optional(
                  Type.Union([Type.String(), Type.Null()]),
                ),
                symbol: Type.String(),
                type: Type.Literal('erc20'),
                value: Type.Transform(Type.String())
                  .Decode((value) => BigInt(value))
                  .Encode((value) => value.toString()),
              }),
              Type.Object({
                address: Typebox.Optional(
                  Type.Union([Primitive.Address, Type.Null()]),
                ),
                direction: Type.Union([
                  Type.Literal('incoming'),
                  Type.Literal('outgoing'),
                ]),
                name: Typebox.Optional(
                  Type.Union([Type.String(), Type.Null()]),
                ),
                symbol: Type.String(),
                type: Type.Literal('erc721'),
                uri: Type.String(),
                value: Type.Transform(Type.String())
                  .Decode((value) => BigInt(value))
                  .Encode((value) => value.toString()),
              }),
              Type.Object({
                address: Type.Null(),
                decimals: Typebox.Optional(
                  Type.Union([Type.Number(), Type.Null()]),
                ),
                direction: Type.Union([
                  Type.Literal('incoming'),
                  Type.Literal('outgoing'),
                ]),
                name: Type.Null(),
                symbol: Type.String(),
                type: Type.Null(),
                uri: Type.Null(),
                value: Type.Transform(Type.String())
                  .Decode((value) => BigInt(value))
                  .Encode((value) => value.toString()),
              }),
            ]),
          ),
        ]),
      ),
    ),
    /** Keys authorized on the account. */
    authorizeKeys: Typebox.Optional(
      Type.Union([C.authorizeKeys.Response, Type.Null()]),
    ),
    /** Fee signature. */
    feeSignature: Typebox.Optional(Primitive.Hex),
    /** Keys revoked on the account. */
    revokeKeys: Typebox.Optional(
      Type.Union([C.revokeKeys.Response, Type.Null()]),
    ),
  })
  export type ResponseCapabilities = Typebox.StaticDecode<
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
    from: Typebox.Optional(Primitive.Address),
    /** Key that will be used to sign the call bundle. */
    key: Typebox.Optional(
      Type.Object({
        prehash: Type.Boolean(),
        publicKey: Primitive.Hex,
        type: Key.Key.properties.type,
      }),
    ),
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  /** Request for `wallet_prepareCalls`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_prepareCalls'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  /** Response for `wallet_prepareCalls`. */
  export const Response = Type.Object({
    /** Capabilities. */
    capabilities: ResponseCapabilities,
    /** Quote for the call bundle. */
    context: Type.Object({
      /** Quote for the call bundle. */
      preCall: Typebox.Optional(Type.Partial(PreCall.PreCall)),
      /** The call bundle. */
      quote: Typebox.Optional(Type.Partial(Quote.Signed)),
    }),
    /** Digest to sign over. */
    digest: Primitive.Hex,
    /** Key that will be used to sign the call bundle. */
    key: Type.Union([Parameters.properties.key, Type.Null()]),
    /** EIP-712 typed data digest. */
    typedData: Type.Object({
      domain: Type.Object({
        chainId: Primitive.Number,
        name: Type.String(),
        verifyingContract: Primitive.Address,
        version: Type.String(),
      }),
      message: Type.Record(Type.String(), Type.Unknown()),
      primaryType: Type.String(),
      types: Type.Record(Type.String(), Type.Unknown()),
    }),
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_prepareUpgradeAccount {
  /** Capabilities for `wallet_prepareUpgradeAccount` request. */
  export const Capabilities = Type.Object({
    /** Keys to authorize on the account. */
    authorizeKeys: C.authorizeKeys.Request,
  })
  export type Capabilities = Typebox.StaticDecode<typeof Capabilities>

  /** Parameters for `wallet_prepareUpgradeAccount` request. */
  export const Parameters = Type.Object({
    /** Address of the EOA to upgrade. */
    address: Primitive.Address,
    /** Chain ID to initialize the account on. */
    // TODO: `Primitive.Number`
    capabilities: Capabilities,
    /** Capabilities. */
    chainId: Typebox.Optional(Type.Number()),
    /** Contract address to delegate to. */
    delegation: Primitive.Address,
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  /** Request for `wallet_prepareUpgradeAccount`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_prepareUpgradeAccount'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  /** Response for `wallet_prepareUpgradeAccount`. */
  export const Response = Type.Object({
    /** Capabilities. */
    capabilities: Capabilities,
    /** Chain ID to initialize the account on. */
    chainId: Type.Number(),
    /** Context. */
    context: Type.Object({
      /** Address of the EOA to upgrade. */
      address: Primitive.Address,
      /** Unsigned authorization object to be signed by the EOA root key. */
      authorization: Authorization,
      /** Chain ID to initialize the account on. */
      chainId: Primitive.Number,
      /** Unsigned pre-call to be signed by the EOA root key. */
      preCall: PreCall.PreCall,
    }),
    /** Digests to sign over. */
    digests: Type.Object({
      /** Digest of the authorization object. */
      auth: Primitive.Hex,
      /** Digest of the pre-call. */
      exec: Primitive.Hex,
    }),
    /** EIP-712 typed data digest. */
    typedData: Type.Object({
      domain: Type.Object({
        chainId: Typebox.Optional(Primitive.Number),
        name: Type.String(),
        verifyingContract: Primitive.Address,
        version: Type.String(),
      }),
      message: Type.Record(Type.String(), Type.Unknown()),
      primaryType: Type.String(),
      types: Type.Record(Type.String(), Type.Unknown()),
    }),
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_feeTokens {
  /** Request for `wallet_feeTokens`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_feeTokens'),
    params: Typebox.Optional(Type.Undefined()),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  /** Response for `wallet_feeTokens`. */
  export const Response = Type.Record(
    Primitive.Hex,
    Type.Array(
      Type.Object({
        address: Primitive.Address,
        decimals: Type.Number(),
        nativeRate: Typebox.Optional(Primitive.BigInt),
        symbol: Type.String(),
      }),
    ),
  )
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_sendPreparedCalls {
  /** Parameters for `wallet_sendPreparedCalls` request. */
  export const Parameters = Type.Object({
    /** Capabilities. */
    capabilities: Typebox.Optional(
      Type.Object({
        /** Fee signature. */
        feeSignature: Typebox.Optional(Primitive.Hex),
      }),
    ),
    /** Quote for the call bundle. */
    context: Type.Object({
      /** The call bundle. */
      preCall: Typebox.Optional(Type.Partial(PreCall.PreCall)),
      /** Quote for the call bundle. */
      quote: Typebox.Optional(Type.Partial(Quote.Signed)),
    }),
    /** Key that was used to sign the call bundle. */
    key: Type.Object({
      prehash: Type.Boolean(),
      publicKey: Primitive.Hex,
      type: Key.Key.properties.type,
    }),
    /** Signature. */
    signature: Primitive.Hex,
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  /** Request for `wallet_sendPreparedCalls`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_sendPreparedCalls'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  /** Response for `wallet_sendPreparedCalls`. */
  export const Response = Type.Object({
    /** The ID of the call bundle. */
    id: Primitive.Hex,
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}

export namespace wallet_upgradeAccount {
  export const Parameters = Type.Object({
    /** Context. */
    context: Type.Object({
      /** Address of the EOA to upgrade. */
      address: Primitive.Address,
      /** Unsigned authorization object to be signed by the EOA root key. */
      authorization: Authorization,
      /** Chain ID to initialize the account on. */
      chainId: Primitive.Number,
      /** Unsigned pre-call to be signed by the EOA root key. */
      preCall: PreCall.PreCall,
    }),
    /** Signatures of the `wallet_prepareUpgradeAccount` digests. */
    signatures: Type.Object({
      auth: Primitive.Hex,
      exec: Primitive.Hex,
    }),
  })
  export type Parameters = Typebox.StaticDecode<typeof Parameters>

  /** Request for `wallet_sendPreparedCalls`. */
  export const Request = Type.Object({
    method: Type.Literal('wallet_upgradeAccount'),
    params: Type.Tuple([Parameters]),
  })
  export type Request = Typebox.StaticDecode<typeof Request>

  export type Response = undefined
}

export namespace wallet_verifySignature {
  export const Parameters = Type.Object({
    /** Account address. */
    address: Primitive.Hex,
    /** Chain ID of the account with the given key configured. */
    chainId: Type.Number(),
    /** Digest of the message to verify. */
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
    /** Proof that can be used to verify the signature. */
    proof: Typebox.Optional(
      Type.Union([
        Type.Object({
          /** Address of an account (either delegated or stored) that the signature was verified against. */
          account: Primitive.Address,
          /** The key hash that signed the digest. */
          initPreCall: Typebox.Optional(PreCall.PreCall),
          /** Initialization precall. Provided, if account is a stored account which has not been delegated. */
          keyHash: Primitive.Hex,
        }),
        Type.Null(),
      ]),
    ),
    /** Whether the signature is valid. */
    valid: Type.Boolean(),
  })
  export type Response = Typebox.StaticDecode<typeof Response>
}
