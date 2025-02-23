import * as AbiFunction from 'ox/AbiFunction'
import type * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import { encodeCalls } from 'viem/experimental/erc7821'
import type { EncodeExecuteDataParameters } from 'viem/experimental/erc7821'

import * as Account from '../account.js'
import * as Call from '../call.js'
import { delegationAbi } from '../generated.js'

/**
 * Action request.
 * Mirrors a "partial" `UserOp` struct on Account contract.
 */
export type ActionRequest<bigintType = bigint> = {
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

export type Rpc = {
  chainId: number
  op: Omit<ActionRequest<Hex.Hex>, 'authorization'>
}

export function prepare<const calls extends readonly unknown[]>(
  parameters: prepare.Parameters<calls>,
): ActionRequest {
  const { account, calls, delegation } = parameters

  const eoa = Account.from(account).address

  let multichain = parameters.multichain ?? Boolean(delegation)
  const executionData = encodeCalls(
    calls.map((c: any) => {
      const selector = Hex.slice(c.data ?? '0x', 0, 4)
      // if a non-authorize call exists, don't allow multichain.
      if (
        selector !==
        AbiFunction.getSelector(AbiFunction.fromAbi(delegationAbi, 'authorize'))
      )
        multichain = false

      return {
        ...c,
        to: c.to === Call.self ? eoa : c.to,
      }
    }),
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
  type Parameters<calls extends readonly unknown[] = readonly unknown[]> = Pick<
    EncodeExecuteDataParameters<calls>,
    'calls'
  > & {
    /**
     * Account to prepare the action for.
     */
    account: Account.Account | Address.Address
    /**
     * Contract address to delegate to.
     */
    delegation?: Address.Address | undefined
    /**
     * Whether to prepare a multichain Action.
     */
    multichain?: boolean | undefined
    /**
     * Nonce to use for the Action.
     */
    nonce?: bigint | undefined
  }
}

export function toRpc(
  actionRequest: ActionRequest,
  options: toRpc.Options,
): Rpc {
  return {
    chainId: options.chainId,
    op: {
      eoa: actionRequest.eoa,
      executionData: actionRequest.executionData,
      nonce: Hex.fromNumber(actionRequest.nonce),
    },
  }
}

export declare namespace toRpc {
  type Options = {
    /**
     * The destination chain ID.
     */
    chainId: number
  }
}
