import * as Either from 'effect/Either'
import type { ParseIssue } from 'effect/ParseResult'
import * as Schema from 'effect/Schema'
import type * as Errors from 'ox/Errors'
import * as RpcResponse from 'ox/RpcResponse'
import * as RpcRequest from './rpc.js'
import { CoderError } from './schema.js'

export * from './rpc.js'

export const Request = Schema.Union(
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
  RpcRequest.wallet_switchEthereumChain.Request,
  RpcRequest.wallet_verifySignature.Request,
).annotations({
  identifier: 'Request.Request',
  parseOptions: {},
})

export function parseRequest(value: unknown): parseRequest.ReturnType {
  Schema.validateEither(Schema.encodedSchema(Request))(value)

  const _decoded = Schema.decodeUnknownEither(Request)(value).pipe(
    Either.getOrThrowWith((left) => {
      if (left.issue._tag === 'Composite') {
        const [parent] = left.issue.issues as readonly [ParseIssue]
        if (parent._tag === 'Composite' && !Array.isArray(parent.issues)) {
          const issue = parent.issues as ParseIssue
          if (issue._tag === 'Pointer' && issue.path === 'method')
            return new RpcResponse.MethodNotSupportedError()
        }
      }
      return new RpcResponse.InvalidParamsError(new CoderError(left))
    }),
  )

  return {
    ...(value as typeof Request.Encoded),
    _decoded,
  } as never
}

export declare namespace parseRequest {
  export type ReturnType = typeof Request extends Schema.Union<infer U>
    ? {
        [K in keyof U]: U[K]['Encoded'] & {
          _decoded: U[K]['Type']
        }
      }[number]
    : never

  export type Error = RpcResponse.InvalidParamsError | Errors.GlobalErrorType
}
