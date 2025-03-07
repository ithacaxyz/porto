import type * as RpcSchema from 'ox/RpcSchema'

import type { Static } from '../typebox/schema.js'
import type * as Rpc from './typebox/rpc.js'

export type Schema = RpcSchema.From<
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
      Request: Static<typeof Rpc.wallet_sendPreparedCalls.Request>
      ReturnType: Static<typeof Rpc.wallet_sendPreparedCalls.Response>
    }
>
