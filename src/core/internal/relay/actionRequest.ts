import type * as Address from 'ox/Address'
import * as UserOpRequest from './userOpRequest.js'

export type ActionRequest = {
  authorization?: Address.Address | undefined
  request: UserOpRequest.UserOpRequest
}

export type Rpc = {
  auth?: Address.Address | undefined
  op: UserOpRequest.Rpc
}

export function fromRpc(rpc: Rpc): ActionRequest {
  return {
    authorization: rpc.auth,
    request: UserOpRequest.fromRpc(rpc.op),
  }
}

export function toRpc(actionRequest: ActionRequest): Rpc {
  return {
    auth: actionRequest.authorization,
    op: UserOpRequest.toRpc(actionRequest.request),
  }
}
