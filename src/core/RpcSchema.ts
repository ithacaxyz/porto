import type * as RpcSchema from 'ox/RpcSchema'

import type * as Rpc from './internal/typebox/rpc.js'
import type { Static } from './internal/typebox/schema.js'
import type { DeepReadonly } from './internal/types.js'

export type Schema = RpcSchema.From<
  | Exclude<
      DeepReadonly<RpcSchema.Default>,
      { Request: { method: 'wallet_sendCalls' } }
    >
  | {
      Request: Static<typeof Rpc.porto_ping.Request>
      ReturnType: Static<typeof Rpc.porto_ping.ReturnType>
    }
  | {
      Request: Static<typeof Rpc.experimental_createAccount.Request>
      ReturnType: Static<typeof Rpc.experimental_createAccount.ReturnType>
    }
  | {
      Request: Static<typeof Rpc.experimental_grantPermissions.Request>
      ReturnType: Static<typeof Rpc.experimental_grantPermissions.ReturnType>
    }
  | {
      Request: Static<typeof Rpc.experimental_prepareCreateAccount.Request>
      ReturnType: Static<
        typeof Rpc.experimental_prepareCreateAccount.ReturnType
      >
    }
  | {
      Request: Static<typeof Rpc.experimental_permissions.Request>
      ReturnType: Static<typeof Rpc.experimental_permissions.ReturnType>
    }
  | {
      Request: Static<typeof Rpc.experimental_revokePermissions.Request>
      ReturnType: undefined
    }
  | {
      Request: Static<typeof Rpc.wallet_connect.Request>
      ReturnType: Static<typeof Rpc.wallet_connect.ReturnType>
    }
  | {
      Request: Static<typeof Rpc.wallet_disconnect.Request>
      ReturnType: undefined
    }
  | {
      Request: Static<typeof Rpc.wallet_prepareCalls.Request>
      ReturnType: Static<typeof Rpc.wallet_prepareCalls.ReturnType>
    }
  | {
      Request: Static<typeof Rpc.wallet_sendPreparedCalls.Request>
      ReturnType: Static<typeof Rpc.wallet_sendPreparedCalls.ReturnType>
    }
  | {
      Request: Static<typeof Rpc.wallet_sendCalls.Request>
      ReturnType: Static<typeof Rpc.wallet_sendCalls.ReturnType>
    }
>
