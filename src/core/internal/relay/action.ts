import type * as Authorization from 'ox/Authorization'
import type { Authorization as Authorization_viem } from 'viem/experimental'

import * as Hex from 'ox/Hex'
import * as UserOp from './userOp.js'

export type Action<bigintType = bigint, numberType = number> = {
  authorization?: Authorization_viem<numberType, true> | undefined
  userOp: UserOp.UserOp<bigintType>
}

export type Rpc = {
  auth?: Authorization.Rpc | undefined
  op: UserOp.Rpc
}

export function fromRpc(rpc: Rpc): Action {
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
    userOp: UserOp.fromRpc(rpc.op),
  }
}

export function toRpc(action: Action): Rpc {
  return {
    auth: action.authorization
      ? {
          address: action.authorization.contractAddress,
          chainId: Hex.fromNumber(action.authorization.chainId),
          nonce: Hex.fromNumber(action.authorization.nonce),
          r: action.authorization.r,
          s: action.authorization.s,
          yParity: Hex.fromNumber(action.authorization.yParity!),
        }
      : undefined,
    op: UserOp.toRpc(action.userOp),
  }
}
