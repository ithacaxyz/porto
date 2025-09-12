import type * as Errors from 'ox/Errors'
import * as RpcResponse from 'ox/RpcResponse'
import * as z from 'zod/mini'
import * as RpcRequest from './rpc.js'
import * as u from './utils.js'

export * from './rpc.js'

export type Request = typeof Schema extends z.ZodMiniUnion<infer U>
  ? {
      [K in keyof U]: z.input<U[K]> & {
        _decoded: z.output<U[K]>
      }
    }[number]
  : never

export const Schema = z.discriminatedUnion('method', [
  RpcRequest.account_verifyEmail.Request,
  RpcRequest.wallet_addFunds.Request,
  RpcRequest.eth_accounts.Request,
  RpcRequest.eth_chainId.Request,
  RpcRequest.eth_requestAccounts.Request,
  RpcRequest.eth_sendTransaction.Request,
  RpcRequest.eth_signTypedData_v4.Request,
  RpcRequest.wallet_getAccountVersion.Request,
  RpcRequest.wallet_getAdmins.Request,
  RpcRequest.wallet_getPermissions.Request,
  RpcRequest.wallet_grantAdmin.Request,
  RpcRequest.wallet_grantPermissions.Request,
  RpcRequest.wallet_prepareUpgradeAccount.Request,
  RpcRequest.wallet_revokeAdmin.Request,
  RpcRequest.wallet_revokePermissions.Request,
  RpcRequest.wallet_upgradeAccount.Request,
  RpcRequest.personal_sign.Request,
  RpcRequest.porto_ping.Request,
  RpcRequest.wallet_connect.Request,
  RpcRequest.wallet_disconnect.Request,
  RpcRequest.wallet_getAssets.Request,
  RpcRequest.wallet_getCallsStatus.Request,
  RpcRequest.wallet_getCapabilities.Request,
  RpcRequest.wallet_getKeys.Request,
  RpcRequest.wallet_prepareCalls.Request,
  RpcRequest.wallet_sendCalls.Request,
  RpcRequest.wallet_sendPreparedCalls.Request,
  RpcRequest.wallet_switchEthereumChain.Request,
  RpcRequest.wallet_verifySignature.Request,
])

export function validate(value: unknown) {
  return validate_internal<Request>(Schema, value)
}

export namespace validate {
  export type ReturnType = validate_internal.ReturnType<Request>
  export type Error = validate_internal.Error
}

/** @internal */
export function validate_internal<Request>(
  schema: z.ZodMiniType,
  value: unknown,
): validate_internal.ReturnType<Request> {
  const result = z.safeParse(schema, value)

  if (result.error) {
    const issue = result.error.issues.at(0)
    if (
      issue?.code === 'invalid_union' &&
      (issue as any).note === 'No matching discriminator'
    )
      throw new RpcResponse.MethodNotSupportedError()
    throw new RpcResponse.InvalidParamsError(u.toValidationError(result.error))
  }

  return {
    ...(value as any),
    _decoded: result.data,
  } as never
}

/** @internal */
export declare namespace validate_internal {
  export type ReturnType<Request> = Request

  export type Error = RpcResponse.InvalidParamsError | Errors.GlobalErrorType
}
