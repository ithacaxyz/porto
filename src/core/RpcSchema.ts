import type * as RpcSchema from 'ox/RpcSchema'
import type { PublicRpcSchema } from 'viem'

import type * as Rpc from './internal/typebox/rpc.js'
import type { Static } from './internal/typebox/schema.js'
import type { DeepReadonly, UnionToTuple } from './internal/types.js'

export type Schema =
  | RpcSchema.Eth
  | Exclude<
      DeepReadonly<RpcSchema.Wallet>,
      {
        Request: {
          method:
            | 'wallet_sendCalls'
            | 'wallet_prepareCalls'
            | 'wallet_sendPreparedCalls'
        }
      }
    >
  | RpcSchema.From<
      | {
          Request: Static<typeof Rpc.experimental_addFunds.Request>
          ReturnType: Static<typeof Rpc.experimental_addFunds.Response>
        }
      | {
          Request: Static<typeof Rpc.porto_ping.Request>
          ReturnType: Static<typeof Rpc.porto_ping.Response>
        }
      | {
          Request: Static<typeof Rpc.experimental_createAccount.Request>
          ReturnType: Static<typeof Rpc.experimental_createAccount.Response>
        }
      | {
          Request: Static<typeof Rpc.experimental_grantAdmin.Request>
          ReturnType: Static<typeof Rpc.experimental_grantAdmin.Response>
        }
      | {
          Request: Static<typeof Rpc.experimental_grantPermissions.Request>
          ReturnType: Static<typeof Rpc.experimental_grantPermissions.Response>
        }
      | {
          Request: Static<typeof Rpc.experimental_prepareUpgradeAccount.Request>
          ReturnType: Static<
            typeof Rpc.experimental_prepareUpgradeAccount.Response
          >
        }
      | {
          Request: Static<typeof Rpc.experimental_upgradeAccount.Request>
          ReturnType: Static<typeof Rpc.experimental_upgradeAccount.Response>
        }
      | {
          Request: Static<typeof Rpc.experimental_getAdmins.Request>
          ReturnType: Static<typeof Rpc.experimental_getAdmins.Response>
        }
      | {
          Request: Static<typeof Rpc.experimental_getPermissions.Request>
          ReturnType: Static<typeof Rpc.experimental_getPermissions.Response>
        }
      | {
          Request: Static<typeof Rpc.experimental_revokeAdmin.Request>
          ReturnType: undefined
        }
      | {
          Request: Static<typeof Rpc.experimental_revokePermissions.Request>
          ReturnType: undefined
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
    >

export type Viem = [
  ...PublicRpcSchema,
  ...ToViem<Exclude<Schema, RpcSchema.Eth>>,
]

export type ToViem<schema extends RpcSchema.Generic> =
  UnionToTuple<schema> extends [
    infer head extends RpcSchema.Generic,
    ...infer tail extends RpcSchema.Generic[],
  ]
    ? [
        {
          Method: head['Request']['method']
          Parameters: head['Request']['params']
          ReturnType: head['ReturnType']
        },
        ...ToViem<tail[number]>,
      ]
    : []
