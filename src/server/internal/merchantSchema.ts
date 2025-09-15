import * as z from 'zod/mini'
import * as Rpc_relay from '../../core/internal/relay/schema/rpc.js'
import * as RpcRequest from '../../core/internal/schema/request.js'

export { wallet_prepareCalls } from '../../core/internal/relay/schema/rpc.js'
export { validate } from '../../core/internal/schema/request.js'

export const JsonRpcRequest = RpcRequest.schemaWithJsonRpc(
  z.discriminatedUnion('method', [Rpc_relay.wallet_prepareCalls.Request]),
)
export type JsonRpcRequest = RpcRequest.WithDecoded<typeof JsonRpcRequest>
