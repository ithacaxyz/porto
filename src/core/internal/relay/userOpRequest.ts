import type * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import { encodeCalls } from 'viem/experimental/erc7821'

import * as Account from '../account.js'
import * as Call from '../call.js'

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

export function prepare(parameters: prepare.Parameters): UserOpRequest {
  const { account, calls, multichain = false } = parameters

  const eoa = Account.from(account).address

  const executionData = encodeCalls(
    calls.map((c) => ({
      ...c,
      to: c.to === Call.self ? eoa : c.to,
    })),
  )

  let nonce = parameters.nonce
  if (!nonce) {
    nonce = Hex.toBigInt(Hex.random(32))
    if (multichain && !(nonce & 1n)) nonce += 1n
    else if (!multichain) nonce += nonce & 1n
  }
  if (multichain && !(nonce & 1n))
    throw new Error('multichain nonce must be odd')
  if (!multichain && nonce & 1n)
    throw new Error('single chain nonce must be even')

  return {
    eoa,
    executionData,
    nonce,
  }
}

export declare namespace prepare {
  type Parameters = {
    account: Account.Account | Address.Address
    calls: readonly Call.Call[]
    multichain?: boolean | undefined
    nonce?: bigint | undefined
  }
}
