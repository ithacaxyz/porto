import * as z from 'zod/mini'
import * as Quotes from '../relay/schema/quotes.js'
import * as Rpc_relay from '../relay/schema/rpc.js'
import * as C from './capabilities.js'
import * as Key from './key.js'
import * as Permissions from './permissions.js'
import * as u from './utils.js'

const KeyWithCredentialId = z.object({
  ...z.pick(Key.Base, { id: true, publicKey: true, type: true }).shape,
  credentialId: z.optional(z.string()),
  privateKey: z.optional(z.any()),
})

export namespace account_setEmail {
  export const Parameters = z.object({
    email: z.string(),
    walletAddress: u.address(),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('account_setEmail'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.null()
  export type Response = z.infer<typeof Response>
}

export namespace account_verifyEmail {
  export const Parameters = z.object({
    chainId: u.number(),
    email: z.string(),
    token: z.string(),
    walletAddress: u.address(),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('account_verifyEmail'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.null()
  export type Response = z.infer<typeof Response>
}

export namespace wallet_addFunds {
  export const Parameters = z.object({
    address: z.optional(u.address()),
    chainId: z.optional(u.number()),
    token: z.optional(u.address()),
    value: z.optional(z.string()),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_addFunds'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.object({
    id: u.hex(),
  })
  export type Response = z.infer<typeof Response>
}

export namespace eth_accounts {
  export const Request = z.object({
    method: z.literal('eth_accounts'),
    params: z.optional(z.unknown()),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.readonly(z.array(u.address()))
  export type Response = z.infer<typeof Response>
}

export namespace eth_chainId {
  export const Request = z.object({
    method: z.literal('eth_chainId'),
    params: z.optional(z.unknown()),
  })
  export type Request = z.infer<typeof Request>

  export const Response = u.hex()
  export type Response = z.infer<typeof Response>
}

export namespace eth_requestAccounts {
  export const Request = z.object({
    method: z.literal('eth_requestAccounts'),
    params: z.optional(z.unknown()),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.readonly(z.array(u.address()))
  export type Response = z.infer<typeof Response>
}

export namespace eth_sendTransaction {
  export const Request = z.object({
    method: z.literal('eth_sendTransaction'),
    params: z.readonly(
      z.tuple([
        z.object({
          capabilities: z.optional(
            z.object({
              feeToken: z.optional(C.feeToken.Request),
              merchantUrl: z.optional(C.merchantUrl.Request),
              preCalls: z.optional(C.preCalls.Request),
            }),
          ),
          chainId: z.optional(u.number()),
          data: z.optional(u.hex()),
          from: z.optional(u.address()),
          to: u.address(),
          value: z.optional(u.bigint()),
        }),
      ]),
    ),
  })
  export type Request = z.infer<typeof Request>

  export const Response = u.hex()
  export type Response = z.infer<typeof Response>
}

export namespace eth_signTypedData_v4 {
  export const Request = z.object({
    method: z.literal('eth_signTypedData_v4'),
    params: z.readonly(z.tuple([u.address(), z.string()])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = u.hex()
  export type Response = z.infer<typeof Response>
}

export namespace wallet_getAdmins {
  export const Parameters = z.object({
    address: z.optional(u.address()),
    chainId: z.optional(u.number()),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_getAdmins'),
    params: z.optional(z.readonly(z.tuple([Parameters]))),
  })
  export type Request = z.infer<typeof Request>

  export const Key = KeyWithCredentialId

  export const Response = z.object({
    address: u.address(),
    chainId: u.number(),
    keys: z.readonly(z.array(Key)),
  })
  export type Response = z.infer<typeof Response>
}

export namespace wallet_grantAdmin {
  export const Capabilities = z.object({
    feeToken: z.optional(C.feeToken.Request),
  })
  export type Capabilities = z.infer<typeof Capabilities>

  export const Parameters = z.object({
    /** Address of the account to authorize the admin for. */
    address: z.optional(u.address()),
    /** Capabilities. */
    capabilities: z.optional(Capabilities),
    /** Chain ID. */
    chainId: z.optional(u.number()),
    /** Admin Key to authorize. */
    key: z.pick(Key.Base, { publicKey: true, type: true }),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_grantAdmin'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.object({
    address: u.address(),
    chainId: u.number(),
    key: wallet_getAdmins.Key,
  })
  export type Response = z.infer<typeof Response>
}

export namespace wallet_grantPermissions {
  export const Parameters = Permissions.Request
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_grantPermissions'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const ResponseCapabilities = z.object({
    preCalls: z.optional(C.preCalls.Response),
  })
  export type ResponseCapabilities = z.infer<typeof ResponseCapabilities>

  export const Response = z.object({
    ...Permissions.Permissions.shape,
    capabilities: z.optional(z.any()),
  })
  export type Response = z.infer<typeof Response>
}

export namespace wallet_getAccountVersion {
  export const Parameters = z.object({
    address: z.optional(u.address()),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_getAccountVersion'),
    params: z.optional(z.readonly(z.tuple([Parameters]))),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.object({
    current: z.string(),
    latest: z.string(),
  })
  export type Response = z.infer<typeof Response>
}

export namespace wallet_getPermissions {
  export const Parameters = z.object({
    address: z.optional(u.address()),
    chainIds: z.optional(z.readonly(z.array(u.number()))),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_getPermissions'),
    params: z.optional(z.readonly(z.tuple([Parameters]))),
  })
  export type Request = z.infer<typeof Request>

  export const Response = C.permissions.Response
  export type Response = z.infer<typeof Response>
}

export namespace wallet_revokeAdmin {
  export const Capabilities = z.object({
    feeToken: z.optional(C.feeToken.Request),
  })
  export type Capabilities = z.infer<typeof Capabilities>

  export const Parameters = z.object({
    address: z.optional(u.address()),
    capabilities: z.optional(Capabilities),
    chainId: z.optional(u.number()),
    id: u.hex(),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_revokeAdmin'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = undefined
}

export namespace wallet_revokePermissions {
  export const Capabilities = z.object({
    feeToken: z.optional(C.feeToken.Request),
  })
  export type Capabilities = z.infer<typeof Capabilities>

  export const Parameters = z.object({
    address: z.optional(u.address()),
    capabilities: z.optional(Capabilities),
    id: u.hex(),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_revokePermissions'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = undefined
}

export namespace wallet_switchEthereumChain {
  export const Request = z.object({
    method: z.literal('wallet_switchEthereumChain'),
    params: z.readonly(
      z.tuple([
        z.object({
          chainId: u.hex(),
        }),
      ]),
    ),
  })
  export type Request = z.infer<typeof Request>
}

export namespace wallet_upgradeAccount {
  export const Parameters = z.object({
    context: z.unknown(),
    signatures: z.object({
      auth: u.hex(),
      exec: u.hex(),
    }),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_upgradeAccount'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const ResponseCapabilities = z.object({
    admins: z.optional(z.readonly(z.array(wallet_getAdmins.Key))),
    permissions: z.optional(C.permissions.Response),
  })
  export type ResponseCapabilities = z.infer<typeof ResponseCapabilities>

  export const Response = z.object({
    address: u.address(),
    capabilities: z.optional(ResponseCapabilities),
  })
  export type Response = z.infer<typeof Response>
}

export namespace personal_sign {
  export const Request = z.object({
    method: z.literal('personal_sign'),
    params: z.readonly(z.tuple([u.hex(), u.address()])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = u.hex()
  export type Response = z.infer<typeof Response>
}

export namespace porto_ping {
  export const Request = z.object({
    method: z.literal('porto_ping'),
    params: z.optional(z.undefined()),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.literal('pong')
  export type Response = z.infer<typeof Response>
}

export namespace wallet_connect {
  export const Capabilities = z.object({
    createAccount: z.optional(C.createAccount.Request),
    email: z.optional(z.boolean()),
    grantAdmins: z.optional(
      z.readonly(z.array(z.pick(Key.Base, { publicKey: true, type: true }))),
    ),
    grantPermissions: z.optional(C.grantPermissions.Request),
    preCalls: z.optional(C.preCalls.Request),
    selectAccount: z.optional(
      z.union([
        z.boolean(),
        z.object({
          address: u.address(),
          key: z.optional(
            z.object({
              credentialId: z.optional(z.string()),
              publicKey: u.hex(),
            }),
          ),
        }),
      ]),
    ),
    signInWithEthereum: z.optional(C.signInWithEthereum.Request),
  })
  export type Capabilities = z.infer<typeof Capabilities>

  export const Parameters = z.object({
    capabilities: z.optional(Capabilities),
    chainIds: z.optional(z.readonly(z.array(u.number()))),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_connect'),
    params: z.optional(z.readonly(z.tuple([Parameters]))),
  })
  export type Request = z.infer<typeof Request>

  export const ResponseCapabilities = z.object({
    admins: z.optional(
      z.readonly(
        z.array(
          z.object({
            ...z.pick(Key.Base, { id: true, publicKey: true, type: true })
              .shape,
            credentialId: z.optional(z.string()),
          }),
        ),
      ),
    ),
    permissions: z.optional(C.permissions.Response),
    preCalls: z.optional(C.preCalls.Response),
    signInWithEthereum: z.optional(C.signInWithEthereum.Response),
  })
  export type ResponseCapabilities = z.infer<typeof ResponseCapabilities>

  export const Response = z.object({
    accounts: z.readonly(
      z.array(
        z.object({
          address: u.address(),
          capabilities: z.optional(ResponseCapabilities),
        }),
      ),
    ),
    chainIds: z.readonly(z.array(u.number())),
  })
  export type Response = z.infer<typeof Response>
}

export namespace wallet_disconnect {
  export const Request = z.object({
    method: z.literal('wallet_disconnect'),
    params: z.optional(z.unknown()),
  })
  export type Request = z.infer<typeof Request>

  export const Response = undefined
}

export namespace wallet_getAssets {
  /** Parameters  */
  export const Parameters = Rpc_relay.wallet_getAssets.Parameters
  export type Parameters = z.infer<typeof Parameters>

  /** Request for `wallet_getAssets`. */
  export const Request = Rpc_relay.wallet_getAssets.Request
  export type Request = z.infer<typeof Request>

  /** Response for `wallet_getAssets`. */
  export const Response = Rpc_relay.wallet_getAssets.Response
  export type Response = z.infer<typeof Response>
}

export namespace wallet_getCallsStatus {
  export const Request = z.object({
    method: z.literal('wallet_getCallsStatus'),
    params: z.tuple([u.hex()]),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.object({
    atomic: z.boolean(),
    chainId: u.number(),
    id: z.string(),
    receipts: z.optional(
      z.readonly(
        z.array(
          z.object({
            blockHash: u.hex(),
            blockNumber: u.hex(),
            gasUsed: u.hex(),
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
    version: z.string(),
  })
  export type Response = z.infer<typeof Response>
}

export namespace wallet_getCapabilities {
  export const Request = z.object({
    method: z.literal('wallet_getCapabilities'),
    params: z.optional(
      z.union([
        z.readonly(z.tuple([z.union([u.hex(), z.undefined()])])),
        z.readonly(
          z.tuple([
            z.union([u.hex(), z.undefined()]),
            z.readonly(z.array(u.number())),
          ]),
        ),
      ]),
    ),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.record(
    u.hex(),
    z.object({
      atomic: C.atomic.GetCapabilitiesResponse,
      feeToken: C.feeToken.GetCapabilitiesResponse,
      merchant: C.merchant.GetCapabilitiesResponse,
      permissions: C.permissions.GetCapabilitiesResponse,
      requiredFunds: C.requiredFunds.GetCapabilitiesResponse,
    }),
  )
  export type Response = z.infer<typeof Response>
  export type Response_encoded = z.input<typeof Response>
}

export namespace wallet_getKeys {
  export const Parameters = z.object({
    address: u.address(),
    chainIds: z.optional(z.readonly(z.array(u.number()))),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_getKeys'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.readonly(z.array(Key.WithPermissions))
  export type Response = z.infer<typeof Response>
}

export namespace wallet_prepareCalls {
  export const Capabilities = z.object({
    feeToken: z.optional(C.feeToken.Request),
    merchantUrl: z.optional(C.merchantUrl.Request),
    permissions: z.optional(C.permissions.Request),
    preCalls: z.optional(C.preCalls.Request),
    requiredFunds: z.optional(C.requiredFunds.Request),
  })
  export type Capabilities = z.infer<typeof Capabilities>

  export const Parameters = z.object({
    calls: z.readonly(
      z.array(
        z.object({
          data: z.optional(u.hex()),
          to: u.address(),
          value: z.optional(u.bigint()),
        }),
      ),
    ),
    capabilities: z.optional(Capabilities),
    chainId: z.optional(u.number()),
    from: z.optional(u.address()),
    key: z.optional(
      z.pick(Key.Base, { prehash: true, publicKey: true, type: true }),
    ),
    version: z.optional(z.string()),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_prepareCalls'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.object({
    capabilities: z.optional(
      z.object({
        ...Rpc_relay.wallet_prepareCalls.ResponseCapabilities.shape,
        quote: z.optional(Quotes.Signed),
      }),
    ),
    chainId: u.hex(),
    context: z.object({
      account: z.object({
        address: u.address(),
      }),
      calls: Parameters.shape.calls,
      nonce: u.bigint(),
      quote: z.optional(z.partial(Quotes.Signed)),
    }),
    digest: u.hex(),
    key: z.pick(Key.Base, { prehash: true, publicKey: true, type: true }),
    typedData: z.object({
      domain: z.union([
        z.object({
          chainId: u.number(),
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
  export const Capabilities = z.object({
    ...wallet_connect.Capabilities.shape,
    label: z.optional(z.string()),
  })
  export type Capabilities = z.infer<typeof Capabilities>

  export const Parameters = z.object({
    address: u.address(),
    capabilities: z.optional(Capabilities),
    chainId: z.optional(u.number()),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_prepareUpgradeAccount'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.object({
    context: z.unknown(),
    digests: z.object({
      auth: u.hex(),
      exec: u.hex(),
    }),
  })
  export type Response = z.infer<typeof Response>
}

export namespace wallet_sendCalls {
  export const Capabilities = wallet_prepareCalls.Capabilities
  export type Capabilities = z.infer<typeof Capabilities>
  export type Capabilities_encoded = z.input<typeof Capabilities>

  export const Request = z.object({
    method: z.literal('wallet_sendCalls'),
    params: z.readonly(
      z.tuple([z.omit(wallet_prepareCalls.Parameters, { key: true })]),
    ),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.object({
    id: u.hex(),
  })
  export type Response = z.infer<typeof Response>
}

export namespace wallet_sendPreparedCalls {
  export const Parameters = z.object({
    capabilities: wallet_prepareCalls.Response.shape.capabilities,
    chainId: u.hex(),
    context: wallet_prepareCalls.Response.shape.context,
    key: wallet_prepareCalls.Response.shape.key,
    signature: u.hex(),
  })
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('wallet_sendPreparedCalls'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.readonly(
    z.array(
      z.object({
        capabilities: z.optional(z.record(z.string(), z.unknown())),
        id: u.hex(),
      }),
    ),
  )
  export type Response = z.infer<typeof Response>
}

export namespace wallet_verifySignature {
  export const Parameters = z.object({
    /** Address of the account. */
    address: u.address(),
    /** Chain ID. */
    chainId: z.optional(u.number()),
    /** Digest to verify. */
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
    /** Address of the account. */
    address: u.address(),
    /** Chain ID. */
    chainId: u.number(),
    /** Proof that can be used to verify the signature. */
    proof: z.optional(z.unknown()),
    /** Whether the signature is valid. */
    valid: z.boolean(),
  })
  export type Response = z.infer<typeof Response>
}
