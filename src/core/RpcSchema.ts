import type * as RpcSchema from 'ox/RpcSchema'
import type * as z from 'zod/mini'
import type * as RpcSchema_viem from '../viem/RpcSchema.js'
import type * as Rpc from './internal/schema/request.js'
import type { DeepReadonly } from './internal/types.js'

export * from './internal/schema/rpc.js'

export type Schema =
  | RpcSchema.Eth
  | Exclude<
      DeepReadonly<RpcSchema.Wallet>,
      {
        Request: {
          method:
            | 'wallet_getCapabilities'
            | 'wallet_getAssets'
            | 'wallet_getCallsStatus'
            | 'wallet_getPermissions'
            | 'wallet_grantPermissions'
            | 'wallet_revokePermissions'
            | 'wallet_sendCalls'
            | 'wallet_prepareCalls'
            | 'wallet_sendPreparedCalls'
            | 'wallet_switchEthereumChain'
        }
      }
    >
  | RpcSchema.From<
      | {
          Request: z.input<typeof Rpc.account_verifyEmail.Request>
          ReturnType: z.input<typeof Rpc.account_verifyEmail.Response>
        }
      | {
          Request: z.input<typeof Rpc.wallet_addFunds.Request>
          ReturnType: z.input<typeof Rpc.wallet_addFunds.Response>
        }
      | {
          Request: z.input<typeof Rpc.porto_ping.Request>
          ReturnType: z.input<typeof Rpc.porto_ping.Response>
        }
      | {
          Request: z.input<typeof Rpc.wallet_grantAdmin.Request>
          ReturnType: z.input<typeof Rpc.wallet_grantAdmin.Response>
        }
      | {
          Request: z.input<typeof Rpc.wallet_grantPermissions.Request>
          ReturnType: z.input<typeof Rpc.wallet_grantPermissions.Response>
        }
      | {
          Request: z.input<typeof Rpc.wallet_prepareUpgradeAccount.Request>
          ReturnType: z.input<typeof Rpc.wallet_prepareUpgradeAccount.Response>
        }
      | {
          Request: z.input<typeof Rpc.wallet_upgradeAccount.Request>
          ReturnType: z.input<typeof Rpc.wallet_upgradeAccount.Response>
        }
      | {
          Request: z.input<typeof Rpc.wallet_getAdmins.Request>
          ReturnType: z.input<typeof Rpc.wallet_getAdmins.Response>
        }
      | {
          Request: z.input<typeof Rpc.wallet_getAccountVersion.Request>
          ReturnType: z.input<typeof Rpc.wallet_getAccountVersion.Response>
        }
      | {
          Request: z.input<typeof Rpc.wallet_getPermissions.Request>
          ReturnType: z.input<typeof Rpc.wallet_getPermissions.Response>
        }
      | {
          Request: z.input<typeof Rpc.wallet_revokeAdmin.Request>
          ReturnType: undefined
        }
      | {
          Request: z.input<typeof Rpc.wallet_revokePermissions.Request>
          ReturnType: undefined
        }
      | {
          Request: z.input<typeof Rpc.wallet_connect.Request>
          ReturnType: z.input<typeof Rpc.wallet_connect.Response>
        }
      | {
          Request: z.input<typeof Rpc.wallet_disconnect.Request>
          ReturnType: undefined
        }
      | {
          Request: z.input<typeof Rpc.wallet_getCapabilities.Request>
          ReturnType: z.input<typeof Rpc.wallet_getCapabilities.Response>
        }
      | {
          Request: z.input<typeof Rpc.wallet_getKeys.Request>
          ReturnType: z.input<typeof Rpc.wallet_getKeys.Response>
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
          Request: z.input<typeof Rpc.wallet_prepareCalls.Request>
          ReturnType: z.input<typeof Rpc.wallet_prepareCalls.Response>
        }
      | {
          Request: z.input<typeof Rpc.wallet_sendPreparedCalls.Request>
          ReturnType: z.input<typeof Rpc.wallet_sendPreparedCalls.Response>
        }
      | {
          Request: z.input<typeof Rpc.wallet_sendCalls.Request>
          ReturnType: z.input<typeof Rpc.wallet_sendCalls.Response>
        }
      | {
          Request: z.input<typeof Rpc.wallet_switchEthereumChain.Request>
          ReturnType: undefined
        }
      | {
          Request: z.input<typeof Rpc.wallet_verifySignature.Request>
          ReturnType: z.input<typeof Rpc.wallet_verifySignature.Response>
        }
    >

export type Viem = RpcSchema_viem.Wallet
