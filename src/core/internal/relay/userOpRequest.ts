import type * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'

export type UserOpRequest<bigintType = bigint> = {
  /**
   * The user's address.
   */
  eoa: Address.Address
  /**
   * An encoded array of calls, using ERC7579 batch execution encoding.
   * `abi.encode(calls)`, where `calls` is an array of type `Call[]`.
   * This allows for more efficient safe forwarding to the EOA.
   */
  executionData: Hex.Hex
  /**
   * Per delegated EOA.
   */
  nonce: bigintType
}

export type Rpc = UserOpRequest<Hex.Hex>

export function fromRpc(rpc: Rpc): UserOpRequest {
  return {
    eoa: rpc.eoa,
    executionData: rpc.executionData,
    nonce: BigInt(rpc.nonce),
  }
}

export function toRpc(userOp: UserOpRequest): Rpc {
  return {
    eoa: userOp.eoa,
    executionData: userOp.executionData,
    nonce: Hex.fromNumber(userOp.nonce),
  }
}
