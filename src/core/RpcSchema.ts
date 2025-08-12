import type * as RpcSchema from 'ox/RpcSchema'
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
          Request: typeof Rpc.account_verifyEmail.Request.Encoded
          ReturnType: typeof Rpc.account_verifyEmail.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_addFunds.Request.Encoded
          ReturnType: typeof Rpc.wallet_addFunds.Response.Encoded
        }
      | {
          Request: typeof Rpc.porto_ping.Request.Encoded
          ReturnType: typeof Rpc.porto_ping.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_grantAdmin.Request.Encoded
          ReturnType: typeof Rpc.wallet_grantAdmin.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_grantPermissions.Request.Encoded
          ReturnType: typeof Rpc.wallet_grantPermissions.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_prepareUpgradeAccount.Request.Encoded
          ReturnType: typeof Rpc.wallet_prepareUpgradeAccount.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_upgradeAccount.Request.Encoded
          ReturnType: typeof Rpc.wallet_upgradeAccount.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_getAdmins.Request.Encoded
          ReturnType: typeof Rpc.wallet_getAdmins.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_getAccountVersion.Request.Encoded
          ReturnType: typeof Rpc.wallet_getAccountVersion.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_getPermissions.Request.Encoded
          ReturnType: typeof Rpc.wallet_getPermissions.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_revokeAdmin.Request.Encoded
          ReturnType: undefined
        }
      | {
          Request: typeof Rpc.wallet_revokePermissions.Request.Encoded
          ReturnType: undefined
        }
      | {
          Request: typeof Rpc.wallet_updateAccount.Request.Encoded
          ReturnType: typeof Rpc.wallet_updateAccount.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_connect.Request.Encoded
          ReturnType: typeof Rpc.wallet_connect.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_disconnect.Request.Encoded
          ReturnType: undefined
        }
      | {
          Request: typeof Rpc.wallet_getCapabilities.Request.Encoded
          ReturnType: typeof Rpc.wallet_getCapabilities.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_getKeys.Request.Encoded
          ReturnType: typeof Rpc.wallet_getKeys.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_getAssets.Request.Encoded
          ReturnType: typeof Rpc.wallet_getAssets.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_getCallsStatus.Request.Encoded
          ReturnType: typeof Rpc.wallet_getCallsStatus.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_prepareCalls.Request.Encoded
          ReturnType: typeof Rpc.wallet_prepareCalls.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_sendPreparedCalls.Request.Encoded
          ReturnType: typeof Rpc.wallet_sendPreparedCalls.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_sendCalls.Request.Encoded
          ReturnType: typeof Rpc.wallet_sendCalls.Response.Encoded
        }
      | {
          Request: typeof Rpc.wallet_switchEthereumChain.Request.Encoded
          ReturnType: undefined
        }
      | {
          Request: typeof Rpc.wallet_verifySignature.Request.Encoded
          ReturnType: typeof Rpc.wallet_verifySignature.Response.Encoded
        }
    >

export type Viem = RpcSchema_viem.Wallet
