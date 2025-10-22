/**
 * JSON-RPC Schemas.
 *
 * @see https://github.com/ithacaxyz/relay/tree/main/src/types/rpc
 */

import * as z from 'zod/mini'
import * as u from '../../schema/utils.js'
import * as c from './capabilities.js'
import * as Key from './key.js'
import * as PreCall from './preCall.js'
import * as Quotes from './quotes.js'
import * as Token from './token.js'

const Authorization = z.object({
  address: u.address(),
  chainId: u.number(),
  nonce: u.number(),
})

const SignedAuthorization = z.object({
  ...Authorization.shape,
  r: u.hex(),
  s: u.hex(),
  yParity: u.number(),
})

const Call = z.object({
  data: z.optional(u.hex()),
  to: u.address(),
  value: z.optional(u.bigint()),
})

export namespace account_getOnrampContactInfo {
  /** Parameters for `account_getOnrampContactInfo` request. */
  export const Parameters = z.object({
    /** Address to get onramp status for. */
    address: u.address(),
    secret: z.string(),
  })

  export type Parameters = z.infer<typeof Parameters>

  /** Request for `account_getOnrampContactInfo`. */
  export const Request = z.object({
    method: z.literal('account_getOnrampContactInfo'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  /** Response for `account_getOnrampContactInfo`. */
  export const Response = z.object({
    email: z.optional(z.string()),
    phone: z.optional(z.string()),
    phoneVerifiedAt: z.optional(z.number()),
  })
  export type Response = z.infer<typeof Response>
}

export namespace account_onrampStatus {
  /** Parameters for `account_onrampStatus` request. */
  export const Parameters = z.object({
    /** Address to get onramp status for. */
    address: u.address(),
  })

  export type Parameters = z.infer<typeof Parameters>

  /** Request for `account_onrampStatus`. */
  export const Request = z.object({
    method: z.literal('account_onrampStatus'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  /** Response for `account_onrampStatus`. */
  export const Response = z.object({
    email: z.optional(z.number()),
    phone: z.optional(z.number()),
  })
  export type Response = z.infer<typeof Response>
}

export namespace account_resendVerifyPhone {
  /** Parameters for `account_resendVerifyPhone` request. */
  export const Parameters = z.object({
    /** Phone to set for wallet address. */
    phone: z.string(),
    /** Address to set phone. */
    walletAddress: u.address(),
  })

  export type Parameters = z.infer<typeof Parameters>

  /** Request for `account_resendVerifyPhone`. */
  export const Request = z.object({
    method: z.literal('account_resendVerifyPhone'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  /** Response for `account_resendVerifyPhone`. */
  export const Response = z.null()
  export type Response = z.infer<typeof Response>
}

export namespace account_setEmail {
  /** Parameters for `account_setEmail` request. */
  export const Parameters = z.object({
    /** Email to set for wallet address. */
    email: z.string().check(z.regex(/^.*@.*$/)),
    /** Address to set email. */
    walletAddress: u.address(),
  })

  export type Parameters = z.infer<typeof Parameters>

  /** Request for `account_setEmail`. */
  export const Request = z.object({
    method: z.literal('account_setEmail'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  /** Response for `account_setEmail`. */
  export const Response = z.null()
  export type Response = z.infer<typeof Response>
}

export namespace account_setPhone {
  /** Parameters for `account_setPhone` request. */
  export const Parameters = z.object({
    /** Phone to set for wallet address. */
    phone: z.string(),
    /** Address to set phone. */
    walletAddress: u.address(),
  })

  export type Parameters = z.infer<typeof Parameters>

  /** Request for `account_setPhone`. */
  export const Request = z.object({
    method: z.literal('account_setPhone'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  /** Response for `account_setPhone`. */
  export const Response = z.null()
  export type Response = z.infer<typeof Response>
}

export namespace account_verifyEmail {
  /** Parameters for `account_verifyEmail` request. */
  export const Parameters = z.object({
    chainId: u.number(),
    email: z.string(),
    signature: u.hex(),
    token: z.string(),
    walletAddress: u.address(),
  })
  export type Parameters = z.infer<typeof Parameters>

  /** Request for `account_verifyEmail`. */
  export const Request = z.object({
    method: z.literal('account_verifyEmail'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  /** Response for `account_verifyEmail`. */
  export const Response = z.null()
  export type Response = z.infer<typeof Response>
}

export namespace account_verifyPhone {
  /** Parameters for `account_verifyPhone` request. */
  export const Parameters = z.object({
    code: z.string(),
    phone: z.string(),
    walletAddress: u.address(),
  })
  export type Parameters = z.infer<typeof Parameters>

  /** Request for `account_verifyPhone`. */
  export const Request = z.object({
    method: z.literal('account_verifyPhone'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  /** Response for `account_verifyPhone`. */
  export const Response = z.null()
  export type Response = z.infer<typeof Response>
}

export namespace health {
  export const Request = z.object({
    method: z.literal('health'),
    params: z.undefined(),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.object({
    quoteSigner: u.address(),
    status: z.string(),
    version: z.string(),
  })
  export type Response = z.infer<typeof Response>
}

export namespace wallet_addFaucetFunds {
  export const Parameters = z.object({
    address: u.address(),
    chainId: u.number(),
    tokenAddress: u.address(),
    value: u.bigint(),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_addFaucetFunds'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.object({
    message: z.optional(z.string()),
    transactionHash: u.hex(),
  })
  export type Response = z.infer<typeof Response>
}

export namespace wallet_getAccounts {
  /** Parameters for `wallet_getAccounts` request. */
  export const Parameters = z.object({
    /** Target chain ID. */
    chainId: u.number(),
    /** Key identifier. */
    id: u.hex(),
  })
  export type Parameters = z.infer<typeof Parameters>

  /** Request for `wallet_getAccounts`. */
  export const Request = z.object({
    method: z.literal('wallet_getAccounts'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  /** Response for `wallet_getAccounts`. */
  export const Response = z.readonly(
    z.array(
      z.object({
        /** Account address. */
        address: u.address(),
        /** Keys authorized on the account. */
        keys: c.authorizeKeys.Response,
      }),
    ),
  )
  export type Response = z.infer<typeof Response>
}

export namespace wallet_getAuthorization {
  export const Parameters = z.object({
    address: u.address(),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_getAuthorization'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.object({
    authorization: SignedAuthorization,
    data: u.hex(),
    to: u.address(),
  })
  export type Response = z.infer<typeof Response>
}

export namespace wallet_getCapabilities {
  /** Request for `wallet_getCapabilities`. */
  export const Request = z.object({
    method: z.literal('wallet_getCapabilities'),
    params: z.optional(z.tuple([z.readonly(z.array(z.number()))])),
  })
  export type Request = z.infer<typeof Request>

  const VersionedContract = z.object({
    address: u.address(),
    version: z.optional(z.union([z.string(), z.null()])),
  })

  export const Response = z.record(
    u.hex(),
    z.object({
      contracts: z.object({
        /** Account implementation address. */
        accountImplementation: VersionedContract,
        /** Account proxy address. */
        accountProxy: VersionedContract,
        /** Legacy account implementation address. */
        legacyAccountImplementations: z.readonly(z.array(VersionedContract)),
        /** Legacy orchestrator address. */
        legacyOrchestrators: z.readonly(
          z.array(
            z.union([
              z.object({
                orchestrator: VersionedContract,
                simulator: VersionedContract,
              }),
              VersionedContract,
            ]),
          ),
        ),
        /** Orchestrator address. */
        orchestrator: VersionedContract,
        /** Simulator address. */
        simulator: VersionedContract,
      }),
      fees: z.object({
        /** Fee recipient address. */
        quoteConfig: z.object({
          /** Sets a constant rate for the price oracle. Used for testing. */
          constantRate: z.optional(z.union([z.number(), z.null()])),
          /** Gas estimate configuration. */
          gas: z.optional(
            z.object({
              /** Extra buffer added to Intent gas estimates. */
              intentBuffer: z.optional(z.number()),
              /** Extra buffer added to transaction gas estimates. */
              txBuffer: z.optional(z.number()),
            }),
          ),
          /** The lifetime of a price rate. */
          rateTtl: z.number(),
          /** The lifetime of a fee quote. */
          ttl: z.number(),
        }),
        /** Quote configuration. */
        recipient: u.address(),
        /** Tokens the fees can be paid in. */
        tokens: z.readonly(z.array(Token.Token)),
      }),
    }),
  )
  export type Response = z.infer<typeof Response>
}

export namespace wallet_getAssets {
  /** Parameters  */
  const AssetType = z.union([
    z.literal('native'),
    z.literal('erc20'),
    z.literal('erc721'),
    z.string(),
  ])
  export const Parameters = z.object({
    account: u.address(),
    assetFilter: z.optional(
      z.record(
        u.hex(),
        z.readonly(
          z.array(
            z.object({
              address: z.union([u.address(), z.literal('native')]),
              type: AssetType,
            }),
          ),
        ),
      ),
    ),
    assetTypeFilter: z.optional(z.readonly(z.array(AssetType))),
    chainFilter: z.optional(z.readonly(z.array(u.number()))),
  })
  export type Parameters = z.infer<typeof Parameters>

  /** Request for `wallet_getAssets`. */
  export const Request = z.object({
    method: z.literal('wallet_getAssets'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Price = z.object({
    currency: z.string(),
    value: z.codec(z.string(), z.number(), {
      decode: (value) => Number(value),
      encode: (value) => String(value),
    }),
  })

  export type Price = z.infer<typeof Price>

  /** Response for `wallet_getAssets`. */
  export const Response = z.record(
    z.string(),
    z.readonly(
      z.array(
        u.oneOf([
          z.object({
            address: u.address(),
            balance: u.bigint(),
            metadata: z.nullable(
              z.object({
                decimals: z.number(),
                fiat: z.nullish(Price),
                name: z.string(),
                symbol: z.string(),
              }),
            ),
            type: z.literal('erc20'),
          }),
          z.object({
            address: z.nullable(z.literal('native')),
            balance: u.bigint(),
            metadata: z.nullable(
              z.object({
                decimals: z.number(),
                fiat: z.nullish(Price),
                name: z.optional(z.string()),
                symbol: z.optional(z.string()),
              }),
            ),
            type: z.literal('native'),
          }),
        ]),
      ),
    ),
  )
  export type Response = z.infer<typeof Response>
}

export namespace wallet_getCallsStatus {
  export const Request = z.object({
    method: z.literal('wallet_getCallsStatus'),
    params: z.readonly(z.tuple([u.hex()])),
  })

  export type Request = z.infer<typeof Request>

  export const Response = z.object({
    id: z.string(),
    receipts: z.optional(
      z.readonly(
        z.array(
          z.object({
            blockHash: u.hex(),
            blockNumber: u.number(),
            chainId: u.number(),
            gasUsed: u.number(),
            logs: z.readonly(
              z.array(
                z.object({
                  address: u.address(),
                  data: u.hex(),
                  topics: z.readonly(z.array(u.hex())),
                }),
              ),
            ),
            status: u.hex(),
            transactionHash: u.hex(),
          }),
        ),
      ),
    ),
    status: z.number(),
  })

  export type Response = z.infer<typeof Response>
}

export namespace wallet_getKeys {
  /** Parameters for `wallet_getKeys` request. */
  export const Parameters = z.object({
    /** The address to get the keys for. */
    address: u.address(),
    /** Target chain IDs. */
    chainIds: z.optional(z.readonly(z.array(u.number()))),
  })

  export type Parameters = z.infer<typeof Parameters>

  /** Request for `wallet_getKeys`. */
  export const Request = z.object({
    method: z.literal('wallet_getKeys'),
    params: z.readonly(z.tuple([Parameters])),
  })

  export type Request = z.infer<typeof Request>

  /** Response for `wallet_getKeys`. */
  export const Response = z.record(u.hex(), c.authorizeKeys.Response)
  export type Response = z.infer<typeof Response>
}

export namespace wallet_prepareCalls {
  /** Capabilities for `wallet_prepareCalls` request. */
  export const Capabilities = z.object({
    /** Keys to authorize on the account. */
    authorizeKeys: z.optional(c.authorizeKeys.Request),
    /** Metadata for the call bundle. */
    meta: c.meta.Request,
    /** Whether the call bundle is to be considered a preCall. */
    preCall: z.optional(z.boolean()),
    /** Optional preCalls to execute before signature verification. */
    preCalls: z.optional(z.readonly(z.array(PreCall.PreCall))),
    /** Required funds on the target chain. */
    requiredFunds: z.optional(c.requiredFunds.Request),
    /** Keys to revoke on the account. */
    revokeKeys: z.optional(c.revokeKeys.Request),
  })

  export type Capabilities = z.infer<typeof Capabilities>

  /** Capabilities for `wallet_prepareCalls` response. */
  export const ResponseCapabilities = z.object({
    /** Asset diff. */
    assetDiffs: z.optional(c.assetDiffs.Response),
    /** Keys authorized on the account. */
    authorizeKeys: z.nullish(c.authorizeKeys.Response),
    /** Digest for the fee payer. */
    feePayerDigest: z.optional(u.hex()),
    /** Fee signature. */
    feeSignature: z.optional(u.hex()),
    /** Fee totals. */
    feeTotals: z.optional(c.feeTotals.Response),
    /** Keys revoked on the account. */
    revokeKeys: z.nullish(c.revokeKeys.Response),
  })

  export type ResponseCapabilities = z.infer<typeof ResponseCapabilities>

  /** Parameters for `wallet_prepareCalls` request. */
  export const Parameters = z.object({
    /** Capabilities for the account. */
    calls: z.readonly(z.array(Call)),
    /** The calls to prepare. */
    capabilities: Capabilities,
    /** The chain ID of the call bundle. */
    chainId: u.number(),
    /** The address of the account to prepare the calls for. */
    from: z.optional(u.address()),
    /** Key that will be used to sign the call bundle. */
    key: z.optional(
      z.object({
        prehash: z.boolean(),
        publicKey: u.hex(),
        type: Key.Key.shape.type,
      }),
    ),
  })

  export type Parameters = z.infer<typeof Parameters>

  /** Request for `wallet_prepareCalls`. */
  export const Request = z.object({
    method: z.literal('wallet_prepareCalls'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  /** Response for `wallet_prepareCalls`. */
  export const Response = z.object({
    /** Capabilities. */
    capabilities: ResponseCapabilities,
    /** Quote for the call bundle. */
    context: z.object({
      /** Quote for the call bundle. */
      preCall: z.optional(z.partial(PreCall.Context)),
      /** The call bundle. */
      quote: z.optional(z.partial(Quotes.Signed)),
    }),
    /** Digest to sign over. */
    digest: u.hex(),
    /** Key that will be used to sign the call bundle. */
    key: z.nullish(
      z.object({
        prehash: z.boolean(),
        publicKey: u.hex(),
        type: Key.Key.shape.type,
      }),
    ),
    /** Signature of the response for verifying the integrity of Relay response. */
    signature: u.hex(),
    /** EIP-712 typed data digest. */
    typedData: z.object({
      domain: z.union([
        z.object({
          chainId: z.union([u.number(), z.number()]),
          name: z.string(),
          verifyingContract: u.address(),
          version: z.string(),
        }),
        z.object({}),
      ]),
      message: z.record(z.string(), z.unknown()),
      primaryType: z.string(),
      types: z.record(z.string(), z.unknown()),
    }),
  })
  export type Response = z.infer<typeof Response>
}

export namespace wallet_prepareUpgradeAccount {
  /** Capabilities for `wallet_prepareUpgradeAccount` request. */
  export const Capabilities = z.object({
    /** Keys to authorize on the account. */
    authorizeKeys: c.authorizeKeys.Request,
  })

  export type Capabilities = z.infer<typeof Capabilities>

  /** Parameters for `wallet_prepareUpgradeAccount` request. */
  export const Parameters = z.object({
    /** Address of the EOA to upgrade. */
    address: u.address(),
    /** Chain ID to initialize the account on. */
    // TODO: `u.number()`
    capabilities: Capabilities,
    /** Capabilities. */
    chainId: z.optional(z.number()),
    /** Contract address to delegate to. */
    delegation: u.address(),
  })
  export type Parameters = z.infer<typeof Parameters>

  /** Request for `wallet_prepareUpgradeAccount`. */
  export const Request = z.object({
    method: z.literal('wallet_prepareUpgradeAccount'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  /** Response for `wallet_prepareUpgradeAccount`. */
  export const Response = z.object({
    /** Capabilities. */
    capabilities: Capabilities,
    /** Chain ID to initialize the account on. */
    chainId: u.number(),
    /** Context. */
    context: z.object({
      /** Address of the EOA to upgrade. */
      address: u.address(),
      /** Unsigned authorization object to be signed by the EOA root key. */
      authorization: Authorization,
      /** Chain ID to initialize the account on. */
      chainId: u.number(),
      /** Unsigned pre-call to be signed by the EOA root key. */
      preCall: PreCall.PreCall,
    }),
    /** Digests to sign over. */
    digests: z.object({
      /** Digest of the authorization object. */
      auth: u.hex(),
      /** Digest of the pre-call. */
      exec: u.hex(),
    }),
    /** EIP-712 typed data digest. */
    typedData: z.object({
      domain: z.union([
        z.object({
          chainId: z.union([u.number(), z.number()]),
          name: z.string(),
          verifyingContract: u.address(),
          version: z.string(),
        }),
        z.object({}),
      ]),
      message: z.record(z.string(), z.unknown()),
      primaryType: z.string(),
      types: z.record(z.string(), z.unknown()),
    }),
  })
  export type Response = z.infer<typeof Response>
}

export namespace wallet_feeTokens {
  /** Request for `wallet_feeTokens`. */
  export const Request = z.object({
    method: z.literal('wallet_feeTokens'),
    params: z.optional(z.undefined()),
  })

  export type Request = z.infer<typeof Request>

  /** Response for `wallet_feeTokens`. */
  export const Response = z.record(
    u.hex(),
    z.readonly(
      z.array(
        z.object({
          address: u.address(),
          decimals: z.number(),
          nativeRate: z.optional(u.bigint()),
          symbol: z.string(),
        }),
      ),
    ),
  )
  export type Response = z.infer<typeof Response>
}

export namespace wallet_sendPreparedCalls {
  /** Parameters for `wallet_sendPreparedCalls` request. */
  export const Parameters = z.object({
    /** Capabilities. */
    capabilities: z.optional(
      z.object({
        /** Fee signature. */
        feeSignature: z.optional(u.hex()),
      }),
    ),
    /** Quote for the call bundle. */
    context: z.object({
      /** The call bundle. */
      preCall: z.optional(z.partial(PreCall.Context)),
      /** Quote for the call bundle. */
      quote: z.optional(z.partial(Quotes.Signed)),
    }),
    /** Key that was used to sign the call bundle. */
    key: z.optional(
      z.object({
        prehash: z.boolean(),
        publicKey: u.hex(),
        type: Key.Key.shape.type,
      }),
    ),
    /** Signature. */
    signature: u.hex(),
  })
  export type Parameters = z.infer<typeof Parameters>

  /** Request for `wallet_sendPreparedCalls`. */
  export const Request = z.object({
    method: z.literal('wallet_sendPreparedCalls'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  /** Response for `wallet_sendPreparedCalls`. */
  export const Response = z.object({
    /** The ID of the call bundle. */
    id: u.hex(),
  })
  export type Response = z.infer<typeof Response>
}

export namespace wallet_upgradeAccount {
  export const Parameters = z.object({
    /** Context. */
    context: z.object({
      /** Address of the EOA to upgrade. */
      address: u.address(),
      /** Unsigned authorization object to be signed by the EOA root key. */
      authorization: Authorization,
      /** Chain ID to initialize the account on. */
      chainId: u.number(),
      /** Unsigned pre-call to be signed by the EOA root key. */
      preCall: PreCall.PreCall,
    }),
    /** Signatures of the `wallet_prepareUpgradeAccount` digests. */
    signatures: z.object({
      auth: u.hex(),
      exec: u.hex(),
    }),
  })
  export type Parameters = z.infer<typeof Parameters>

  /** Request for `wallet_sendPreparedCalls`. */
  export const Request = z.object({
    method: z.literal('wallet_upgradeAccount'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.undefined()
  export type Response = z.infer<typeof Response>
}

export namespace wallet_verifySignature {
  export const Parameters = z.object({
    /** Account address. */
    address: u.hex(),
    /** Chain ID of the account with the given key configured. */
    chainId: u.number(),
    /** Digest of the message to verify. */
    digest: u.hex(),
    /** Signature to verify. */
    signature: u.hex(),
  })
  export type Parameters = z.infer<typeof Parameters>

  /** Request for `wallet_verifySignature`. */
  export const Request = z.object({
    method: z.literal('wallet_verifySignature'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  /** Response for `wallet_verifySignature`. */
  export const Response = z.object({
    /** Proof that can be used to verify the signature. */
    proof: z.nullish(
      z.object({
        /** Address of an account (either delegated or stored) that the signature was verified against. */
        account: u.address(),
        /** Initialization precall. Provided, if account is a stored account which has not been delegated. */
        initPreCall: z.nullish(PreCall.PreCall),
        /** The key hash that signed the digest. */
        keyHash: u.hex(),
      }),
    ),
    /** Whether the signature is valid. */
    valid: z.boolean(),
  })
  export type Response = z.infer<typeof Response>
}
