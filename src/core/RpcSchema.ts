import type * as RpcSchema from 'ox/RpcSchema'
import type * as RpcSchema_viem from '../viem/RpcSchema.js'
import type * as Rpc from './internal/typebox/request.js'
import type { Static } from './internal/typebox/typebox.js'
import type { DeepReadonly } from './internal/types.js'

export * from './internal/typebox/rpc.js'

export type Schema =
  | RpcSchema.Eth
  | Exclude<
      DeepReadonly<RpcSchema.Wallet>,
      {
        Request: {
          method:
            | 'wallet_getCapabilities'
            | 'wallet_getCallsStatus'
            | 'wallet_getPermissions'
            | 'wallet_grantPermissions'
            | 'wallet_revokePermissions'
            | 'wallet_sendCalls'
            | 'wallet_prepareCalls'
            | 'wallet_sendPreparedCalls'
        }
      }
    >
  | RpcSchema.From<
      | {
          Request: Static<typeof Rpc.wallet_addFunds.Request>
          ReturnType: Static<typeof Rpc.wallet_addFunds.Response>
        }
      | {
          Request: Static<typeof Rpc.porto_ping.Request>
          ReturnType: Static<typeof Rpc.porto_ping.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_grantAdmin.Request>
          ReturnType: Static<typeof Rpc.wallet_grantAdmin.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_grantPermissions.Request>
          ReturnType: Static<typeof Rpc.wallet_grantPermissions.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_prepareUpgradeAccount.Request>
          ReturnType: Static<typeof Rpc.wallet_prepareUpgradeAccount.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_upgradeAccount.Request>
          ReturnType: Static<typeof Rpc.wallet_upgradeAccount.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_getAdmins.Request>
          ReturnType: Static<typeof Rpc.wallet_getAdmins.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_getAccountVersion.Request>
          ReturnType: Static<typeof Rpc.wallet_getAccountVersion.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_getPermissions.Request>
          ReturnType: Static<typeof Rpc.wallet_getPermissions.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_revokeAdmin.Request>
          ReturnType: undefined
        }
      | {
          Request: Static<typeof Rpc.wallet_revokePermissions.Request>
          ReturnType: undefined
        }
      | {
          Request: Static<typeof Rpc.wallet_updateAccount.Request>
          ReturnType: Static<typeof Rpc.wallet_updateAccount.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_connect.Request>
          ReturnType: Static<typeof Rpc.wallet_connect.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_disconnect.Request>
          ReturnType: undefined
        }
      | {
          Request: Static<typeof Rpc.wallet_getCapabilities.Request>
          ReturnType: Static<typeof Rpc.wallet_getCapabilities.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_getKeys.Request>
          ReturnType: Static<typeof Rpc.wallet_getKeys.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_getCallsStatus.Request>
          ReturnType: Static<typeof Rpc.wallet_getCallsStatus.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_prepareCalls.Request>
          ReturnType: Static<typeof Rpc.wallet_prepareCalls.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_sendPreparedCalls.Request>
          ReturnType: Static<typeof Rpc.wallet_sendPreparedCalls.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_sendCalls.Request>
          ReturnType: Static<typeof Rpc.wallet_sendCalls.Response>
        }
      | {
          Request: Static<typeof Rpc.wallet_verifySignature.Request>
          ReturnType: Static<typeof Rpc.wallet_verifySignature.Response>
        }
    >

export type Viem = RpcSchema_viem.Wallet
