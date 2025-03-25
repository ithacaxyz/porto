/**
 * User operation.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/types/op.rs
 */

import * as Primitive from '../../typebox/primitive.js'
import type * as Schema from '../../typebox/schema.js'
import { Type } from '../../typebox/schema.js'

export const UserOp = Type.Object({
  /** The combined gas limit for payment, verification, and calling the EOA. */
  combinedGas: Primitive.BigInt,
  /** Users address. */
  eoa: Primitive.Address,
  /**
   * Optional array of encoded UserOps that will be verified and executed
   * after PREP (if any) and before the validation of the overall UserOp.
   */
  encodedPreOps: Type.Array(Primitive.Hex),
  /**
   * An encoded array of calls, using ERC7579 batch execution encoding.
   *
   * The format is `abi.encode(calls)`, where `calls` is an array of type `Call[]`.
   * This allows for more efficient safe forwarding to the EOA.
   */
  executionData: Primitive.Hex,
  /**
   * Optional data for `initPREP` on the delegation.
   * Excluded from signature.
   */
  initData: Primitive.Hex,
  /** Per delegated EOA.
   *
   * # Memory layout
   *
   * Each nonce has the following memory layout:
   *
   *      ,----------------------------------------------------.
   * bits | 0-191 (192 bits)                | 192-255 (64 bits)|
   *      |---------------------------------|------------------|
   * desc | sequence key                    | sequential nonce |
   *      `----------------.----------------|------------------'
   *                       |
   *                       v
   *      ,-------------------------------------.
   * bits | 0-15 (16 bits)  | 16-191 (176 bits) |
   *      |-------------------------------------|
   * desc | multichain flag | remainder         |
   *      `-------------------------------------'
   *
   * If the upper 16 bits of the sequence key is `0xc1d0`, then the EIP-712 has
   * of the UserOp will exlude the chain ID.
   *
   * # Ordering
   *
   * Ordering matters within a sequence key, but not between sequence keys.
   *
   * This means that users who do not care about the order of specific userops
   * can sign their userops using a random sequence key. On the other hand, if
   * they do care about ordering, they would use the same sequence key.
   */
  nonce: Primitive.BigInt,
  /**
   * The account paying the payment token.
   * If this is `address(0)`, it defaults to the `eoa`.
   */
  payer: Primitive.Address,
  /**
   * The amount of the token to pay.
   *
   * Excluded from signature.
   *
   * This will be required to be less than `paymentMaxAmount`.
   */
  paymentAmount: Primitive.BigInt,
  /** The maximum amount of the token to pay. */
  paymentMaxAmount: Primitive.BigInt,
  /**
   * The amount of ERC20 to pay per gas spent. For calculation of refunds.
   *
   * If this is left at zero, it will be treated as infinity (i.e. no refunds).
   */
  paymentPerGas: Primitive.BigInt,
  /**
   * The payment recipient for the ERC20 token.
   *
   * Excluded from signature. The filler can replace this with their own address.
   *
   * This enables multiple fillers, allowing for competitive filling, better uptime.
   * If `address(0)`, the payment will be accrued by the entry point.
   */
  paymentRecipient: Primitive.Address,
  /** The ERC20 or native token used to pay for gas. */
  paymentToken: Primitive.Address,
  /**
   * The wrapped signature.
   *
   * The format is `abi.encodePacked(innerSignature, keyHash, prehash)` for most signatures,
   * except if it is signed by the EOA root key, in which case `abi.encodePacked(r, s, v)` is valid as well.
   */
  signature: Primitive.Hex,
})
export type UserOp = Schema.StaticDecode<typeof UserOp>

export const Partial = Type.Object({
  eoa: Primitive.Address,
  executionData: Primitive.Hex,
  initData: Primitive.Hex,
  nonce: Primitive.BigInt,
})
export type Partial = Schema.StaticDecode<typeof Partial>
