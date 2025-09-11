import * as z from 'zod/mini'
import { validate_internal } from '../../schema/request.js'
import * as RpcRequest from './rpc.js'

export * from './rpc.js'

export type Request = typeof Schema extends z.ZodMiniIntersection<
  infer left,
  infer right
>
  ? left extends z.ZodMiniUnion<infer value>
    ? {
        [key in keyof value]: z.input<value[key]> & {
          _decoded: z.output<value[key]>
        }
      }[number] &
        z.infer<right>
    : never
  : never

export const Schema = z.intersection(
  z.discriminatedUnion('method', [
    RpcRequest.account_setEmail.Request,
    RpcRequest.account_verifyEmail.Request,
    RpcRequest.health.Request,
    RpcRequest.wallet_feeTokens.Request,
    RpcRequest.wallet_getAccounts.Request,
    RpcRequest.wallet_getCapabilities.Request,
    RpcRequest.wallet_getCallsStatus.Request,
    RpcRequest.wallet_getKeys.Request,
    RpcRequest.wallet_prepareCalls.Request,
    RpcRequest.wallet_prepareUpgradeAccount.Request,
    RpcRequest.wallet_sendPreparedCalls.Request,
    RpcRequest.wallet_upgradeAccount.Request,
    RpcRequest.wallet_verifySignature.Request,
  ]),
  z.object({
    _returnType: z.unknown(),
    id: z.number(),
    jsonrpc: z.literal('2.0'),
  }),
)

export function validate(value: unknown) {
  return validate_internal<Request>(Schema, value)
}

export namespace validate {
  export type ReturnType = validate_internal.ReturnType<typeof Schema>
  export type Error = validate_internal.Error
}
