/**
 * JSON-RPC Schema.
 *
 * @see https://github.com/ithacaxyz/relay/blob/77d1e54e3c7b7268d4e9e9bd89a42637125d9b89/src/rpc.rs#L59-L142
 */

import type * as RpcSchema_ox from 'ox/RpcSchema'
import type * as RpcSchema_viem from '../../../viem/RpcSchema.js'
import type { Static } from '../typebox/typebox.js'
import type * as Rpc from './typebox/rpc.js'

export * from './typebox/rpc.js'

export type Schema = RpcSchema_ox.From<
  | {
      Request: Static<typeof Rpc.account_setEmail.Request>
      ReturnType: Static<typeof Rpc.account_setEmail.Response>
    }
  | {
      Request: Static<typeof Rpc.account_verifyEmail.Request>
      ReturnType: Static<typeof Rpc.account_verifyEmail.Response>
    }
  | {
      Request: Static<typeof Rpc.health.Request>
      ReturnType: Static<typeof Rpc.health.Response>
    }
  | {
      Request: Static<typeof Rpc.wallet_feeTokens.Request>
      ReturnType: Static<typeof Rpc.wallet_feeTokens.Response>
    }
  | {
      Request: Static<typeof Rpc.wallet_getAccounts.Request>
      ReturnType: Static<typeof Rpc.wallet_getAccounts.Response>
    }
  | {
      Request: Static<typeof Rpc.wallet_getCapabilities.Request>
      ReturnType: Static<typeof Rpc.wallet_getCapabilities.Response>
    }
  | {
      Request: Static<typeof Rpc.wallet_getCallsStatus.Request>
      ReturnType: Static<typeof Rpc.wallet_getCallsStatus.Response>
    }
  | {
      Request: Static<typeof Rpc.wallet_getKeys.Request>
      ReturnType: Static<typeof Rpc.wallet_getKeys.Response>
    }
  | {
      Request: Static<typeof Rpc.wallet_prepareCalls.Request>
      ReturnType: Static<typeof Rpc.wallet_prepareCalls.Response>
    }
  | {
      Request: Static<typeof Rpc.wallet_prepareUpgradeAccount.Request>
      ReturnType: Static<typeof Rpc.wallet_prepareUpgradeAccount.Response>
    }
  | {
      Request: Static<typeof Rpc.wallet_sendPreparedCalls.Request>
      ReturnType: Static<typeof Rpc.wallet_sendPreparedCalls.Response>
    }
  | {
      Request: Static<typeof Rpc.wallet_upgradeAccount.Request>
      ReturnType: undefined
    }
  | {
      Request: Static<typeof Rpc.wallet_verifySignature.Request>
      ReturnType: Static<typeof Rpc.wallet_verifySignature.Response>
    }
>

export type Viem = RpcSchema_viem.Server
