import type * as RpcSchema_ox from 'ox/RpcSchema'

import type * as RpcSchema from '../../RpcSchema.js'
import type { Static } from '../typebox/schema.js'
import type { UnionToTuple } from '../types.js'
import type * as Rpc from './typebox/rpc.js'

export type Schema = RpcSchema_ox.From<
  | {
      Request: Static<typeof Rpc.wallet_createAccount.Request>
      ReturnType: Static<typeof Rpc.wallet_createAccount.Response>
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
      ReturnType: Static<typeof Rpc.wallet_upgradeAccount.Response>
    }
>

export type ToViem = RpcSchema.MapSchema<UnionToTuple<Schema>>
