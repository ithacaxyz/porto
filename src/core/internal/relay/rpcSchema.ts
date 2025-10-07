/**
 * JSON-RPC Schema.
 *
 * @see https://github.com/ithacaxyz/relay/blob/77d1e54e3c7b7268d4e9e9bd89a42637125d9b89/src/rpc.rs#L59-L142
 */

import type * as RpcSchema_ox from 'ox/RpcSchema'
import type * as z from 'zod/mini'
import type * as RpcSchema_viem from '../../../viem/RpcSchema.js'
import type * as Rpc from './schema/rpc.js'

export * from './schema/rpc.js'

export type Schema = RpcSchema_ox.From<
  | {
      Request: z.input<typeof Rpc.account_getOnrampContactInfo.Request>
      ReturnType: z.input<typeof Rpc.account_getOnrampContactInfo.Response>
    }
  | {
      Request: z.input<typeof Rpc.account_onrampStatus.Request>
      ReturnType: z.input<typeof Rpc.account_onrampStatus.Response>
    }
  | {
      Request: z.input<typeof Rpc.account_resendVerifyPhone.Request>
      ReturnType: z.input<typeof Rpc.account_resendVerifyPhone.Response>
    }
  | {
      Request: z.input<typeof Rpc.account_setEmail.Request>
      ReturnType: z.input<typeof Rpc.account_setEmail.Response>
    }
  | {
      Request: z.input<typeof Rpc.account_setPhone.Request>
      ReturnType: z.input<typeof Rpc.account_setPhone.Response>
    }
  | {
      Request: z.input<typeof Rpc.account_verifyEmail.Request>
      ReturnType: z.input<typeof Rpc.account_verifyEmail.Response>
    }
  | {
      Request: z.input<typeof Rpc.account_verifyPhone.Request>
      ReturnType: z.input<typeof Rpc.account_verifyPhone.Response>
    }
  | {
      Request: z.input<typeof Rpc.health.Request>
      ReturnType: z.input<typeof Rpc.health.Response>
    }
  | {
      Request: z.input<typeof Rpc.wallet_addFaucetFunds.Request>
      ReturnType: z.input<typeof Rpc.wallet_addFaucetFunds.Response>
    }
  | {
      Request: z.input<typeof Rpc.wallet_feeTokens.Request>
      ReturnType: z.input<typeof Rpc.wallet_feeTokens.Response>
    }
  | {
      Request: z.input<typeof Rpc.wallet_getAccounts.Request>
      ReturnType: z.input<typeof Rpc.wallet_getAccounts.Response>
    }
  | {
      Request: z.input<typeof Rpc.wallet_getAuthorization.Request>
      ReturnType: z.input<typeof Rpc.wallet_getAuthorization.Response>
    }
  | {
      Request: z.input<typeof Rpc.wallet_getCapabilities.Request>
      ReturnType: z.input<typeof Rpc.wallet_getCapabilities.Response>
    }
  | {
      Request: z.input<typeof Rpc.wallet_getAssets.Request>
      ReturnType: z.input<typeof Rpc.wallet_getAssets.Response>
    }
  | {
      Request: z.input<typeof Rpc.wallet_getCallsStatus.Request>
      ReturnType: z.input<typeof Rpc.wallet_getCallsStatus.Response>
    }
  | {
      Request: z.input<typeof Rpc.wallet_getKeys.Request>
      ReturnType: z.input<typeof Rpc.wallet_getKeys.Response>
    }
  | {
      Request: z.input<typeof Rpc.wallet_prepareCalls.Request>
      ReturnType: z.input<typeof Rpc.wallet_prepareCalls.Response>
    }
  | {
      Request: z.input<typeof Rpc.wallet_prepareUpgradeAccount.Request>
      ReturnType: z.input<typeof Rpc.wallet_prepareUpgradeAccount.Response>
    }
  | {
      Request: z.input<typeof Rpc.wallet_sendPreparedCalls.Request>
      ReturnType: z.input<typeof Rpc.wallet_sendPreparedCalls.Response>
    }
  | {
      Request: z.input<typeof Rpc.wallet_upgradeAccount.Request>
      ReturnType: undefined
    }
  | {
      Request: z.input<typeof Rpc.wallet_verifySignature.Request>
      ReturnType: z.input<typeof Rpc.wallet_verifySignature.Response>
    }
>

export type Viem = RpcSchema_viem.Relay
