import { AbiParameters, TypedData } from 'ox'
import type * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import type { Client } from 'viem'
import { readContract } from 'viem/actions'

import * as Call from '../call.js'
import { delegationAbi } from '../generated.js'
import type { Assign, PartialBy } from '../types.js'
import * as EntryPoint from './entryPoint.js'

export type UserOp<signed extends boolean = boolean, bigintType = bigint> = {
  /**
   * The combined gas limit for payment, verification, and calling the EOA.
   */
  combinedGas: bigintType
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
  /**
   * The account paying the payment token.
   * If this is `address(0)`, it defaults to the `eoa`.
   */
  payer: Address.Address
  /**
   * The ERC20 or native token used to pay for gas.
   */
  paymentToken: Address.Address
  /**
   * The payment recipient for the ERC20 token.
   * Excluded from signature. The filler can replace this with their own address.
   * This enables multiple fillers, allowing for competitive filling, better uptime.
   * If `address(0)`, the payment will be accrued by the entry point.
   */
  paymentRecipient: Address.Address
  /**
   * The amount of the token to pay.
   * Excluded from signature. This will be required to be less than `paymentMaxAmount`.
   */
  paymentAmount: bigintType
  /**
   * The maximum amount of the token to pay.
   */
  paymentMaxAmount: bigintType
  /**
   * The amount of ERC20 to pay per gas spent. For calculation of refunds.
   * If this is left at zero, it will be treated as infinity (i.e. no refunds).
   */
  paymentPerGas: bigintType
} & (signed extends true
  ? {
      /**
       * The wrapped signature.
       * `abi.encodePacked(innerSignature, keyHash, prehash)`.
       */
      signature: Hex.Hex
    }
  : { signature?: Hex.Hex | undefined })

export type Rpc<signed extends boolean = boolean> = UserOp<signed, Hex.Hex>

export function from<
  const userOp extends from.Value,
  const signature extends Hex.Hex | undefined = undefined,
>(
  userOp: userOp | from.Value,
  options: from.Options<signature> = {},
): from.ReturnType<userOp, signature> {
  return {
    ...userOp,
    payer: userOp.payer ?? '0x0000000000000000000000000000000000000000',
    paymentMaxAmount: userOp.paymentMaxAmount ?? userOp.paymentAmount,
    paymentPerGas: userOp.paymentPerGas ?? 0n,
    paymentRecipient:
      userOp.paymentRecipient ?? '0x0000000000000000000000000000000000000000',
    signature: options.signature,
  } as UserOp as never
}

export declare namespace from {
  type Value = PartialBy<
    UserOp,
    'payer' | 'paymentMaxAmount' | 'paymentPerGas' | 'paymentRecipient'
  >

  type Options<signature extends Hex.Hex | undefined = undefined> = {
    signature?: signature | Hex.Hex | undefined
  }

  type ReturnType<
    userOp extends from.Value = from.Value,
    signature extends Hex.Hex | undefined = undefined,
  > = Assign<
    UserOp & userOp,
    signature extends Hex.Hex ? Readonly<{ signature: Hex.Hex }> : {}
  >
}

export function fromRpc(rpc: Rpc): UserOp {
  return {
    ...rpc,
    combinedGas: BigInt(rpc.combinedGas),
    nonce: BigInt(rpc.nonce),
    paymentAmount: BigInt(rpc.paymentAmount),
    paymentMaxAmount: BigInt(rpc.paymentMaxAmount),
    paymentPerGas: BigInt(rpc.paymentPerGas),
  }
}

export async function getSignPayload(
  client: Client,
  userOp: UserOp,
): Promise<Hex.Hex> {
  const [c] = AbiParameters.decode(
    AbiParameters.from([
      'struct Call { address target; uint256 value; bytes data; }',
      'Call[] calls',
    ]),
    userOp.executionData,
  )
  const calls = c.map((call) => ({
    ...call,
    target: call.target === Call.self ? userOp.eoa : call.target,
  }))

  const domain = EntryPoint.getEip712Domain(client)
  const multichain = userOp.nonce & 1n
  const nonceSalt =
    multichain > 0n
      ? 0n
      : await readContract(client, {
          abi: delegationAbi,
          address: userOp.eoa,
          functionName: 'nonceSalt',
        }).catch(() => 0n)

  if (!client.chain) throw new Error('chain is required.')
  return TypedData.getSignPayload({
    domain: {
      name: domain.name,
      verifyingContract: domain.verifyingContract,
      version: domain.version,
      ...(!multichain ? { chainId: client.chain.id } : {}),
    },
    types: {
      Call: [
        { name: 'target', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
      ],
      UserOp: [
        { name: 'multichain', type: 'bool' },
        { name: 'eoa', type: 'address' },
        { name: 'calls', type: 'Call[]' },
        { name: 'nonce', type: 'uint256' },
        { name: 'nonceSalt', type: 'uint256' },
        { name: 'payer', type: 'address' },
        { name: 'paymentToken', type: 'address' },
        { name: 'paymentMaxAmount', type: 'uint256' },
        { name: 'paymentPerGas', type: 'uint256' },
        { name: 'combinedGas', type: 'uint256' },
      ],
    },
    message: {
      ...userOp,
      multichain: Boolean(multichain),
      calls,
      nonceSalt,
    },
    primaryType: 'UserOp',
  })
}

export function toRpc(userOp: UserOp): Rpc {
  return {
    combinedGas: Hex.fromNumber(userOp.combinedGas),
    eoa: userOp.eoa,
    executionData: userOp.executionData,
    nonce: Hex.fromNumber(userOp.nonce),
    payer: userOp.payer,
    paymentAmount: Hex.fromNumber(userOp.paymentAmount),
    paymentMaxAmount: Hex.fromNumber(userOp.paymentMaxAmount),
    paymentPerGas: Hex.fromNumber(userOp.paymentPerGas),
    paymentRecipient: userOp.paymentRecipient,
    paymentToken: userOp.paymentToken,
    signature: userOp.signature,
  }
}
