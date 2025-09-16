import type * as RpcSchema_ox from 'ox/RpcSchema'
import * as z from 'zod/mini'
import * as Rpc_relay from '../../core/internal/relay/schema/rpc.js'
import * as Key from '../../core/internal/schema/key.js'
import * as Permissions from '../../core/internal/schema/permissions.js'
import * as RpcRequest from '../../core/internal/schema/request.js'
import type { ToViem } from '../../viem/RpcSchema.js'

export { wallet_prepareCalls } from '../../core/internal/relay/schema/rpc.js'
export { validate } from '../../core/internal/schema/request.js'

export namespace merchant_getKeys {
  export const Request = z.object({
    method: z.literal('merchant_getKeys'),
    params: z.optional(z.unknown()),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.readonly(
    z.array(z.pick(Key.Base, { publicKey: true, type: true })),
  )
  export type Response = z.infer<typeof Response>
}

export namespace merchant_schedule {
  export const Parameters = z.discriminatedUnion('type', [
    z.object({
      context: z.optional(z.unknown()),
      payload: Permissions.Permissions,
      type: z.literal('permissions'),
    }),
  ])
  export type Parameters = z.infer<typeof Parameters>

  export const Request = z.object({
    method: z.literal('merchant_schedule'),
    params: z.readonly(z.tuple([Parameters])),
  })
  export type Request = z.infer<typeof Request>

  export const Response = z.void()
  export type Response = z.infer<typeof Response>
}

export const JsonRpcRequest = RpcRequest.schemaWithJsonRpc(
  z.discriminatedUnion('method', [
    merchant_getKeys.Request,
    merchant_schedule.Request,
    Rpc_relay.wallet_prepareCalls.Request,
  ]),
)
export type JsonRpcRequest = RpcRequest.WithDecoded<typeof JsonRpcRequest>

export type Schema = RpcSchema_ox.From<
  | {
      Request: z.input<typeof Rpc_relay.wallet_prepareCalls.Request>
      ReturnType: z.input<typeof Rpc_relay.wallet_prepareCalls.Response>
    }
  | {
      Request: z.input<typeof merchant_getKeys.Request>
      ReturnType: z.input<typeof merchant_getKeys.Response>
    }
  | {
      Request: z.input<typeof merchant_schedule.Request>
      ReturnType: z.input<typeof merchant_schedule.Response>
    }
>

export type Viem = ToViem<Schema>
