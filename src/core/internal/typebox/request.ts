import type { Union } from '@sinclair/typebox/type'
import * as Json from 'ox/Json'
import * as RpcResponse from 'ox/RpcResponse'
import * as U from '../utils.js'
import * as RpcRequest from './rpc.js'
import { type StaticDecode, type StaticEncode, Type, Value } from './typebox.js'

export * from './rpc.js'

export const Request = Type.Union([
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
  RpcRequest.wallet_updateAccount.Request,
  RpcRequest.wallet_upgradeAccount.Request,
  RpcRequest.personal_sign.Request,
  RpcRequest.porto_ping.Request,
  RpcRequest.wallet_connect.Request,
  RpcRequest.wallet_disconnect.Request,
  RpcRequest.wallet_getCallsStatus.Request,
  RpcRequest.wallet_getCapabilities.Request,
  RpcRequest.wallet_getKeys.Request,
  RpcRequest.wallet_prepareCalls.Request,
  RpcRequest.wallet_sendCalls.Request,
  RpcRequest.wallet_sendPreparedCalls.Request,
  RpcRequest.wallet_verifySignature.Request,
])

export function parseRequest(request: unknown): parseRequest.ReturnType {
  const raw = Value.Convert(Request, U.normalizeValue(request))

  const method = RpcRequest[(raw as any).method as keyof typeof RpcRequest]
  if (method) {
    const error = Value.Errors(method.Request, raw).First()
    const message = [
      error?.message,
      '',
      'Path: ' + error?.path.slice(1).replaceAll('/', '.'),
      error?.value && 'Value: ' + Json.stringify(error.value),
    ]
      .filter((x) => typeof x === 'string')
      .join('\n')
    if (error) throw new RpcResponse.InvalidParamsError({ message })
  }

  Value.Assert(Request, raw)
  const _decoded = Value.Decode(Request, raw)

  return {
    ...raw,
    _decoded,
  } as never
}

export declare namespace parseRequest {
  export type ReturnType = typeof Request extends Union<infer U>
    ? {
        [K in keyof U]: StaticEncode<U[K]> & {
          _decoded: StaticDecode<U[K]>
        }
      }[number]
    : never
}
