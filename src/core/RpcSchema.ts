import type * as Hex from 'ox/Hex'
import type * as RpcSchema from 'ox/RpcSchema'

import type * as internal from './internal/rpcSchema.js'

export type Schema = RpcSchema.From<
  | Exclude<RpcSchema.Default, { Request: { method: 'wallet_sendCalls' } }>
  | {
      Request: {
        method: 'porto_ping'
      }
      ReturnType: string
    }
  | {
      Request: {
        method: 'experimental_createAccount'
        params?: [internal.CreateAccountParameters] | undefined
      }
      ReturnType: internal.CreateAccountReturnType
    }
  | {
      Request: {
        method: 'experimental_grantPermissions'
        params: [internal.GrantPermissionsParameters]
      }
      ReturnType: internal.GrantPermissionsReturnType
    }
  | {
      Request: {
        method: 'experimental_prepareCreateAccount'
        params: [internal.PrepareCreateAccountParameters]
      }
      ReturnType: internal.PrepareCreateAccountReturnType
    }
  | {
      Request: {
        method: 'experimental_permissions'
        params?: [internal.PermissionsParameters] | undefined
      }
      ReturnType: internal.PermissionsReturnType
    }
  | {
      Request: {
        method: 'experimental_revokePermissions'
        params: [internal.RevokePermissionsParameters]
      }
      ReturnType: undefined
    }
  | {
      Request: {
        method: 'wallet_connect'
        params?: [internal.ConnectParameters] | undefined
      }
      ReturnType: internal.ConnectReturnType
    }
  | {
      Request: {
        method: 'wallet_disconnect'
      }
      ReturnType: undefined
    }
  | {
      Request: {
        method: 'wallet_prepareCalls'
        params: [internal.WalletPrepareCallsParameters]
      }
      ReturnType: internal.WalletPrepareCallsReturnType
    }
  | {
      Request: {
        method: 'wallet_sendPreparedCalls'
        params: [internal.WalletSendPreparedCallsParameters]
      }
      ReturnType: internal.WalletSendPreparedCallsReturnType
    }
  | {
      Request: {
        method: 'wallet_sendCalls'
        params: [
          Omit<
            RpcSchema.ExtractParams<
              RpcSchema.Wallet,
              'wallet_sendCalls'
            >[number],
            'capabilities'
          > & {
            capabilities?:
              | {
                  permissions?: {
                    id: Hex.Hex | undefined
                  }
                }
              | undefined
          },
        ]
      }
      ReturnType: RpcSchema.ExtractReturnType<
        RpcSchema.Wallet,
        'wallet_sendCalls'
      >
    }
>
