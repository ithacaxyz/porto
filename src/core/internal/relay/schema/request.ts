import * as effect_Schema from 'effect/Schema'
import {
  type Request as Request_internal,
  validate_internal,
} from '../../schema/request.js'
import * as RpcRequest from './rpc.js'

export * from './rpc.js'

export type Request = Request_internal<typeof Schema>

export const Schema = effect_Schema
  .extend(
    effect_Schema.Union(
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
    ),
    effect_Schema.Struct({
      _returnType: effect_Schema.Unknown,
      id: effect_Schema.Number,
      jsonrpc: effect_Schema.Literal('2.0'),
    }),
  )
  .annotations({
    identifier: 'Request.Request',
    parseOptions: {},
  })

export function validate(value: unknown) {
  return validate_internal(Schema)(value)
}

export namespace validate {
  export type ReturnType = validate_internal.ReturnType<typeof Schema>
  export type Error = validate_internal.Error
}
