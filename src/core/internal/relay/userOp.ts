import type * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'

export type UserOp<bigintType = bigint> = {
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
  /**
   * The wrapped signature.
   * `abi.encodePacked(innerSignature, keyHash, prehash)`.
   */
  signature: Hex.Hex
}

export type Rpc = UserOp<Hex.Hex>

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
