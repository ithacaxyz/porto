import type * as Authorization from 'ox/Authorization'
import * as Hex from 'ox/Hex'
import type { Authorization as Authorization_viem } from 'viem/experimental'
import * as UserOpRequest from './userOpRequest.js'

export type ActionRequest = {
  authorization?: Authorization_viem<number, true> | undefined
  userOp: UserOpRequest.UserOpRequest
}

export type Rpc = {
  auth?: Authorization.Rpc | undefined
  op: UserOpRequest.Rpc
}

export function fromRpc(rpc: Rpc): ActionRequest {
  return {
    authorization: rpc.auth
      ? {
          chainId: Hex.toNumber(rpc.auth.chainId),
          contractAddress: rpc.auth.address,
          nonce: Hex.toNumber(rpc.auth.nonce),
          r: rpc.auth.r,
          s: rpc.auth.s,
          yParity: Hex.toNumber(rpc.auth.yParity!),
        }
      : undefined,
    userOp: UserOpRequest.fromRpc(rpc.op),
  }
}

export function toRpc(actionRequest: ActionRequest): Rpc {
  return {
    auth: actionRequest.authorization
      ? {
          address: actionRequest.authorization.contractAddress,
          chainId: Hex.fromNumber(actionRequest.authorization.chainId),
          nonce: Hex.fromNumber(actionRequest.authorization.nonce),
          r: actionRequest.authorization.r,
          s: actionRequest.authorization.s,
          yParity: Hex.fromNumber(actionRequest.authorization.yParity!),
        }
      : undefined,
    op: UserOpRequest.toRpc(actionRequest.userOp),
  }
}
