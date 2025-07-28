/**
 * JSON-RPC Schemas.
 *
 * @see https://github.com/ithacaxyz/relay/tree/main/src/types/rpc
 */

import * as Schema from 'effect/Schema'
import * as Hex from 'ox/Hex'
import * as Primitive from '../../schema/primitive.js'
import * as C from './capabilities.js'
import * as Key from './key.js'
import * as PreCall from './preCall.js'
import * as Quotes from './quotes.js'

const Authorization = Schema.Struct({
  address: Primitive.Address,
  chainId: Primitive.Number,
  nonce: Primitive.Number,
})

const Call = Schema.Struct({
  data: Schema.optional(Primitive.Hex),
  to: Primitive.Address,
  value: Schema.optional(Primitive.BigInt),
})

export namespace account_setEmail {
  /** Parameters for `account_setEmail` request. */
  export const Parameters = Schema.Struct({
    /** Email to set for wallet address. */
    email: Schema.String.pipe(Schema.pattern(/^.*@.*$/)),
    /** Address to set email. */
    walletAddress: Primitive.Address,
  }).annotations({
    identifier: 'Rpc.account_setEmail.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  /** Request for `account_setEmail`. */
  export const Request = Schema.Struct({
    method: Schema.Literal('account_setEmail'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.account_setEmail.Request',
  })
  export type Request = typeof Request.Type

  /** Response for `account_setEmail`. */
  export const Response = Schema.Null
  export type Response = typeof Response.Type
}

export namespace account_verifyEmail {
  /** Parameters for `account_verifyEmail` request. */
  export const Parameters = Schema.Struct({
    // TODO: `Primitive.Number`
    chainId: Schema.Number,
    email: Schema.String,
    signature: Primitive.Hex,
    token: Schema.String,
    walletAddress: Primitive.Address,
  }).annotations({
    identifier: 'Rpc.account_verifyEmail.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  /** Request for `account_verifyEmail`. */
  export const Request = Schema.Struct({
    method: Schema.Literal('account_verifyEmail'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.account_verifyEmail.Request',
  })
  export type Request = typeof Request.Type

  /** Response for `account_verifyEmail`. */
  export const Response = Schema.Null
  export type Response = typeof Response.Type
}

export namespace health {
  export const Request = Schema.Struct({
    method: Schema.Literal('health'),
    params: Schema.Undefined,
  }).annotations({
    identifier: 'Rpc.health.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Struct({
    status: Schema.String,
    version: Schema.String,
  }).annotations({
    identifier: 'Rpc.health.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_getAccounts {
  /** Parameters for `wallet_getAccounts` request. */
  export const Parameters = Schema.Struct({
    /** Target chain ID. */
    // TODO: `Primitive.Number`
    chainId: Schema.Number,
    /** Key identifier. */
    id: Primitive.Hex,
  }).annotations({
    identifier: 'Rpc.wallet_getAccounts.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  /** Request for `wallet_getAccounts`. */
  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_getAccounts'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_getAccounts.Request',
  })
  export type Request = typeof Request.Type

  /** Response for `wallet_getAccounts`. */
  export const Response = Schema.Array(
    Schema.Struct({
      /** Account address. */
      address: Primitive.Address,
      /** Keys authorized on the account. */
      keys: C.authorizeKeys.Response,
    }),
  ).annotations({
    identifier: 'Rpc.wallet_getAccounts.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_getCapabilities {
  /** Request for `wallet_getCapabilities`. */
  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_getCapabilities'),
    params: Schema.Tuple(Schema.Array(Schema.Number)),
  }).annotations({
    identifier: 'Rpc.wallet_getCapabilities.Request',
  })
  export type Request = typeof Request.Type

  const VersionedContract = Schema.Struct({
    address: Primitive.Address,
    version: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  }).annotations({
    identifier: 'Rpc.wallet_getCapabilities.VersionedContract',
  })

  export const Response = Schema.Record({
    key: Primitive.Hex,
    value: Schema.Struct({
      contracts: Schema.Struct({
        /** Account implementation address. */
        accountImplementation: VersionedContract,
        /** Account proxy address. */
        accountProxy: VersionedContract,
        /** Legacy account implementation address. */
        legacyAccountImplementations: Schema.Array(VersionedContract),
        /** Legacy orchestrator address. */
        legacyOrchestrators: Schema.Array(VersionedContract),
        /** Orchestrator address. */
        orchestrator: VersionedContract,
        /** Simulator address. */
        simulator: VersionedContract,
      }),
      fees: Schema.Struct({
        /** Fee recipient address. */
        quoteConfig: Schema.Struct({
          /** Sets a constant rate for the price oracle. Used for testing. */
          constantRate: Schema.optional(
            Schema.Union(Schema.Number, Schema.Null),
          ),
          /** Gas estimate configuration. */
          gas: Schema.optional(
            Schema.Struct({
              /** Extra buffer added to Intent gas estimates. */
              intentBuffer: Schema.optional(Schema.Number),
              /** Extra buffer added to transaction gas estimates. */
              txBuffer: Schema.optional(Schema.Number),
            }),
          ),
          /** The lifetime of a price rate. */
          rateTtl: Schema.Number,
          /** The lifetime of a fee quote. */
          ttl: Schema.Number,
        }),
        /** Quote configuration. */
        recipient: Primitive.Address,
        /** Tokens the fees can be paid in. */
        tokens: Schema.Array(
          Schema.Struct({
            address: Primitive.Address,
            decimals: Schema.Number,
            interop: Schema.Boolean,
            kind: Schema.String,
            nativeRate: Schema.optional(Primitive.BigInt),
            symbol: Schema.String,
          }),
        ),
      }),
    }),
  }).annotations({
    identifier: 'Rpc.wallet_getCapabilities.Response',
  })
  export type Response = typeof Response.Type
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
    id: Schema.String,
    receipts: Schema.optional(
      Schema.Array(
        Schema.Struct({
          blockHash: Primitive.Hex,
          blockNumber: Schema.Number,
          chainId: Schema.Number,
          gasUsed: Schema.Number,
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
  }).annotations({
    identifier: 'Rpc.wallet_getCallsStatus.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_getKeys {
  /** Parameters for `wallet_getKeys` request. */
  export const Parameters = Schema.Struct({
    /** The address to get the keys for. */
    address: Primitive.Address,
    /** Target chain ID. */
    chainId: Primitive.Number,
  }).annotations({
    identifier: 'Rpc.wallet_getKeys.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  /** Request for `wallet_getKeys`. */
  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_getKeys'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_getKeys.Request',
  })
  export type Request = typeof Request.Type

  /** Response for `wallet_getKeys`. */
  export const Response = C.authorizeKeys.Response
  export type Response = typeof Response.Type
}

export namespace wallet_prepareCalls {
  export const AssetDiffAsset = Schema.Union(
    Schema.Struct({
      address: Schema.optional(Schema.Union(Primitive.Address, Schema.Null)),
      decimals: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
      direction: Schema.Union(
        Schema.Literal('incoming'),
        Schema.Literal('outgoing'),
      ),
      fiat: Schema.optional(
        Schema.Struct({
          currency: Schema.String,
          value: Schema.transform(Schema.String, Schema.Number, {
            decode: (value) => Number(value),
            encode: (value) => String(value),
          }),
        }),
      ),
      name: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      symbol: Schema.String,
      type: Schema.Literal('erc20'),
      value: Primitive.BigInt,
    }),
    Schema.Struct({
      address: Schema.optional(Schema.Union(Primitive.Address, Schema.Null)),
      direction: Schema.Union(
        Schema.Literal('incoming'),
        Schema.Literal('outgoing'),
      ),
      fiat: Schema.optional(
        Schema.Struct({
          currency: Schema.String,
          value: Schema.transform(Schema.String, Schema.Number, {
            decode: (value) => Number(value),
            encode: (value) => String(value),
          }),
        }),
      ),
      name: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      symbol: Schema.String,
      type: Schema.Literal('erc721'),
      uri: Schema.String,
      value: Primitive.BigInt,
    }),
    Schema.Struct({
      address: Schema.Null,
      decimals: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
      direction: Schema.Union(
        Schema.Literal('incoming'),
        Schema.Literal('outgoing'),
      ),
      fiat: Schema.optional(
        Schema.Struct({
          currency: Schema.String,
          value: Schema.transform(Schema.String, Schema.Number, {
            decode: (value) => Number(value),
            encode: (value) => String(value),
          }),
        }),
      ),
      symbol: Schema.String,
      type: Schema.Null,
      value: Primitive.BigInt,
    }),
  )
  export type AssetDiffAsset = typeof AssetDiffAsset.Type

  /** Capabilities for `wallet_prepareCalls` request. */
  export const Capabilities = Schema.Struct({
    /** Keys to authorize on the account. */
    authorizeKeys: Schema.optional(C.authorizeKeys.Request),
    /** Metadata for the call bundle. */
    meta: C.meta.Request,
    /** Whether the call bundle is to be considered a preCall. */
    preCall: Schema.optional(Schema.Boolean),
    /** Optional preCalls to execute before signature verification. */
    preCalls: Schema.optional(Schema.Array(PreCall.PreCall)),
    /** Keys to revoke on the account. */
    revokeKeys: Schema.optional(C.revokeKeys.Request),
  }).annotations({
    identifier: 'Rpc.wallet_prepareCalls.Capabilities',
  })
  export type Capabilities = typeof Capabilities.Type

  /** Capabilities for `wallet_prepareCalls` response. */
  export const ResponseCapabilities = Schema.Struct({
    /** Asset diff. */
    assetDiffs: Schema.optional(
      Schema.Record({
        key: Primitive.Hex,
        value: Schema.Array(
          Schema.Tuple(Primitive.Address, Schema.Array(AssetDiffAsset)),
        ),
      }),
    ),
    /** Keys authorized on the account. */
    authorizeKeys: Schema.optional(
      Schema.Union(C.authorizeKeys.Response, Schema.Null),
    ),
    /** Fee signature. */
    feeSignature: Schema.optional(Primitive.Hex),
    /** Keys revoked on the account. */
    revokeKeys: Schema.optional(
      Schema.Union(C.revokeKeys.Response, Schema.Null),
    ),
  }).annotations({
    identifier: 'Rpc.wallet_prepareCalls.ResponseCapabilities',
  })
  export type ResponseCapabilities = typeof ResponseCapabilities.Type

  /** Parameters for `wallet_prepareCalls` request. */
  export const Parameters = Schema.Struct({
    /** Capabilities for the account. */
    calls: Schema.Array(Call),
    /** The calls to prepare. */
    capabilities: Capabilities,
    /** The chain ID of the call bundle. */
    // TODO: `Primitive.Number`
    chainId: Schema.Number,
    /** The address of the account to prepare the calls for. */
    from: Schema.optional(Primitive.Address),
    /** Key that will be used to sign the call bundle. */
    key: Schema.optional(
      Schema.Struct({
        prehash: Schema.Boolean,
        publicKey: Primitive.Hex,
        type: Key.Key.fields.type,
      }),
    ),
    /** Required funds on the target chain. */
    // TODO: should be in `capabilities`.
    requiredFunds: Schema.optional(
      Schema.Array(
        Schema.transform(
          Schema.Tuple(Primitive.Address, Primitive.Hex),
          Schema.Struct({
            /** Token address. */
            address: Primitive.Address,
            /** Amount of tokens required. */
            value: Schema.BigInt,
          }),
          {
            decode: ([address, value]) => ({
              address,
              value: Hex.toBigInt(value),
            }),
            encode: ({ address, value }) => [
              address,
              Hex.fromNumber(BigInt(value)),
            ],
            strict: false,
          },
        ),
      ),
    ),
  }).annotations({
    identifier: 'wallet_prepareCalls.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  /** Request for `wallet_prepareCalls`. */
  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_prepareCalls'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_prepareCalls.Request',
  })
  export type Request = typeof Request.Type

  /** Response for `wallet_prepareCalls`. */
  export const Response = Schema.Struct({
    /** Capabilities. */
    capabilities: ResponseCapabilities,
    /** Quote for the call bundle. */
    context: Schema.Struct({
      /** Quote for the call bundle. */
      preCall: Schema.optional(Schema.partial(PreCall.PreCall)),
      /** The call bundle. */
      quote: Schema.optional(Schema.partial(Quotes.Signed)),
    }),
    /** Digest to sign over. */
    digest: Primitive.Hex,
    /** Key that will be used to sign the call bundle. */
    key: Schema.optional(
      Schema.Union(
        Schema.Struct({
          prehash: Schema.Boolean,
          publicKey: Primitive.Hex,
          type: Key.Key.fields.type,
        }),
        Schema.Null,
      ),
    ),
    /** EIP-712 typed data digest. */
    typedData: Schema.Struct({
      domain: Schema.Struct({
        chainId: Schema.optional(Primitive.Number),
        name: Schema.optional(Schema.String),
        verifyingContract: Schema.optional(Primitive.Address),
        version: Schema.optional(Schema.String),
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
  /** Capabilities for `wallet_prepareUpgradeAccount` request. */
  export const Capabilities = Schema.Struct({
    /** Keys to authorize on the account. */
    authorizeKeys: C.authorizeKeys.Request,
  }).annotations({
    identifier: 'Rpc.wallet_prepareUpgradeAccount.Capabilities',
  })
  export type Capabilities = typeof Capabilities.Type

  /** Parameters for `wallet_prepareUpgradeAccount` request. */
  export const Parameters = Schema.Struct({
    /** Address of the EOA to upgrade. */
    address: Primitive.Address,
    /** Chain ID to initialize the account on. */
    // TODO: `Primitive.Number`
    capabilities: Capabilities,
    /** Capabilities. */
    chainId: Schema.optional(Schema.Number),
    /** Contract address to delegate to. */
    delegation: Primitive.Address,
  }).annotations({
    identifier: 'Rpc.wallet_prepareUpgradeAccount.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  /** Request for `wallet_prepareUpgradeAccount`. */
  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_prepareUpgradeAccount'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_prepareUpgradeAccount.Request',
  })
  export type Request = typeof Request.Type

  /** Response for `wallet_prepareUpgradeAccount`. */
  export const Response = Schema.Struct({
    /** Capabilities. */
    capabilities: Capabilities,
    /** Chain ID to initialize the account on. */
    chainId: Primitive.Number,
    /** Context. */
    context: Schema.Struct({
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
    digests: Schema.Struct({
      /** Digest of the authorization object. */
      auth: Primitive.Hex,
      /** Digest of the pre-call. */
      exec: Primitive.Hex,
    }),
    /** EIP-712 typed data digest. */
    typedData: Schema.Struct({
      domain: Schema.Struct({
        chainId: Schema.optional(Primitive.Number),
        name: Schema.String,
        verifyingContract: Primitive.Address,
        version: Schema.String,
      }),
      message: Schema.Record({ key: Schema.String, value: Schema.Unknown }),
      primaryType: Schema.String,
      types: Schema.Record({ key: Schema.String, value: Schema.Unknown }),
    }),
  }).annotations({
    identifier: 'Rpc.wallet_prepareUpgradeAccount.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_feeTokens {
  /** Request for `wallet_feeTokens`. */
  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_feeTokens'),
    params: Schema.optional(Schema.Undefined),
  }).annotations({
    identifier: 'Rpc.wallet_feeTokens.Request',
  })
  export type Request = typeof Request.Type

  /** Response for `wallet_feeTokens`. */
  export const Response = Schema.Record({
    key: Primitive.Hex,
    value: Schema.Array(
      Schema.Struct({
        address: Primitive.Address,
        decimals: Schema.Number,
        nativeRate: Schema.optional(Primitive.BigInt),
        symbol: Schema.String,
      }),
    ),
  }).annotations({
    identifier: 'Rpc.wallet_feeTokens.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_sendPreparedCalls {
  /** Parameters for `wallet_sendPreparedCalls` request. */
  export const Parameters = Schema.Struct({
    /** Capabilities. */
    capabilities: Schema.optional(
      Schema.Struct({
        /** Fee signature. */
        feeSignature: Schema.optional(Primitive.Hex),
      }),
    ),
    /** Quote for the call bundle. */
    context: Schema.Struct({
      /** The call bundle. */
      preCall: Schema.optional(Schema.partial(PreCall.PreCall)),
      /** Quote for the call bundle. */
      quote: Schema.optional(Schema.partial(Quotes.Signed)),
    }),
    /** Key that was used to sign the call bundle. */
    key: Schema.Struct({
      prehash: Schema.Boolean,
      publicKey: Primitive.Hex,
      type: Key.Key.fields.type,
    }),
    /** Signature. */
    signature: Primitive.Hex,
  }).annotations({
    identifier: 'Rpc.wallet_sendPreparedCalls.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  /** Request for `wallet_sendPreparedCalls`. */
  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_sendPreparedCalls'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_sendPreparedCalls.Request',
  })
  export type Request = typeof Request.Type

  /** Response for `wallet_sendPreparedCalls`. */
  export const Response = Schema.Struct({
    /** The ID of the call bundle. */
    id: Primitive.Hex,
  }).annotations({
    identifier: 'Rpc.wallet_sendPreparedCalls.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_upgradeAccount {
  export const Parameters = Schema.Struct({
    /** Context. */
    context: Schema.Struct({
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
    signatures: Schema.Struct({
      auth: Primitive.Hex,
      exec: Primitive.Hex,
    }),
  }).annotations({
    identifier: 'Rpc.wallet_upgradeAccount.Parameters',
  })
  export type Parameters = typeof Parameters.Type

  /** Request for `wallet_sendPreparedCalls`. */
  export const Request = Schema.Struct({
    method: Schema.Literal('wallet_upgradeAccount'),
    params: Schema.Tuple(Parameters),
  }).annotations({
    identifier: 'Rpc.wallet_upgradeAccount.Request',
  })
  export type Request = typeof Request.Type

  export const Response = Schema.Undefined.annotations({
    identifier: 'Rpc.wallet_upgradeAccount.Response',
  })
  export type Response = typeof Response.Type
}

export namespace wallet_verifySignature {
  export const Parameters = Schema.Struct({
    /** Account address. */
    address: Primitive.Hex,
    /** Chain ID of the account with the given key configured. */
    chainId: Schema.Number,
    /** Digest of the message to verify. */
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
    /** Proof that can be used to verify the signature. */
    proof: Schema.optional(
      Schema.Union(
        Schema.Struct({
          /** Address of an account (either delegated or stored) that the signature was verified against. */
          account: Primitive.Address,
          /** Initialization precall. Provided, if account is a stored account which has not been delegated. */
          initPreCall: Schema.optional(
            Schema.Union(PreCall.PreCall, Schema.Null),
          ),
          /** The key hash that signed the digest. */
          keyHash: Primitive.Hex,
        }),
        Schema.Null,
      ),
    ),
    /** Whether the signature is valid. */
    valid: Schema.Boolean,
  }).annotations({
    identifier: 'Rpc.wallet_verifySignature.Response',
  })
  export type Response = typeof Response.Type
}
