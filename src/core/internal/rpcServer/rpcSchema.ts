/**
 * JSON-RPC Schema.
 *
 * @see https://github.com/ithacaxyz/relay/blob/77d1e54e3c7b7268d4e9e9bd89a42637125d9b89/src/rpc.rs#L59-L142
 */

import type * as RpcSchema_ox from 'ox/RpcSchema'
import type * as RpcSchema_viem from '../../../viem/RpcSchema.js'
import type * as Rpc from './schema/rpc.js'

export * from './schema/rpc.js'

export type Schema = RpcSchema_ox.From<
  | {
      Request: typeof Rpc.account_setEmail.Request.Encoded
      ReturnType: typeof Rpc.account_setEmail.Response.Encoded
    }
  | {
      Request: typeof Rpc.account_verifyEmail.Request.Encoded
      ReturnType: typeof Rpc.account_verifyEmail.Response.Encoded
    }
  | {
      Request: typeof Rpc.health.Request.Encoded
      ReturnType: typeof Rpc.health.Response.Encoded
    }
  | {
      Request: typeof Rpc.wallet_feeTokens.Request.Encoded
      ReturnType: typeof Rpc.wallet_feeTokens.Response.Encoded
    }
  | {
      Request: typeof Rpc.wallet_getAccounts.Request.Encoded
      ReturnType: typeof Rpc.wallet_getAccounts.Response.Encoded
    }
  | {
      Request: typeof Rpc.wallet_getCapabilities.Request.Encoded
      ReturnType: typeof Rpc.wallet_getCapabilities.Response.Encoded
    }
  | {
      Request: typeof Rpc.wallet_getCallsStatus.Request.Encoded
      ReturnType: typeof Rpc.wallet_getCallsStatus.Response.Encoded
    }
  | {
      Request: typeof Rpc.wallet_getKeys.Request.Encoded
      ReturnType: typeof Rpc.wallet_getKeys.Response.Encoded
    }
  | {
      Request: typeof Rpc.wallet_prepareCalls.Request.Encoded
      ReturnType: typeof Rpc.wallet_prepareCalls.Response.Encoded
    }
  | {
      Request: typeof Rpc.wallet_prepareUpgradeAccount.Request.Encoded
      ReturnType: typeof Rpc.wallet_prepareUpgradeAccount.Response.Encoded
    }
  | {
      Request: typeof Rpc.wallet_sendPreparedCalls.Request.Encoded
      ReturnType: typeof Rpc.wallet_sendPreparedCalls.Response.Encoded
    }
  | {
      Request: typeof Rpc.wallet_upgradeAccount.Request.Encoded
      ReturnType: undefined
    }
  | {
      Request: typeof Rpc.wallet_verifySignature.Request.Encoded
      ReturnType: typeof Rpc.wallet_verifySignature.Response.Encoded
    }
>

export type Viem = RpcSchema_viem.Server
