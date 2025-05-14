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
  /**
   * Optional array of encoded UserOps that will be verified and executed
   * after PREP (if any) and before the validation of the overall UserOp.
   *
   * A PreOp will NOT have its gas limit or payment applied.
   * The overall UserOp's gas limit and payment will be applied, encompassing all its PreOps.
   * The execution of a PreOp will check and increment the nonce in the PreOp.
   * If at any point, any PreOp cannot be verified to be correct, or fails in execution,
   * the overall UserOp will revert before validation, and execute will return a non-zero error.
   * A PreOp can contain PreOps, forming a tree structure.
   * The `executionData` tree will be executed in post-order (i.e. left -> right -> current).
   * The `encodedPreOps` are included in the EIP712 signature, which enables execution order
   * to be enforced on-the-fly even if the nonces are from different sequences.
   */
  encodedPreOps: Type.Array(Primitive.Hex),
  /** Users address. */
  eoa: Primitive.Address,
  /**
   * An encoded array of calls, using ERC7579 batch execution encoding.
   *
   * The format is `abi.encode(calls)`, where `calls` is an array of type `Call[]`.
   * This allows for more efficient safe forwarding to the EOA.
   */
  executionData: Primitive.Hex,
  /**
   * Optional data for `initPREP` on the delegation.
   *
   * This is encoded using ERC7821 style batch execution encoding.
   * (ERC7821 is a variant of ERC7579).
   * `abi.encode(calls, abi.encodePacked(bytes32(saltAndDelegation)))`,
   * where `calls` is of type `Call[]`,
   * and `saltAndDelegation` is `bytes32((uint256(salt) << 160) | uint160(delegation))`.
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
   * The payment recipient for the ERC20 token.
   *
   * Excluded from signature. The filler can replace this with their own address.
   *
   * This enables multiple fillers, allowing for competitive filling, better uptime.
   * If `address(0)`, the payment will be accrued by the entry point.
   */
  paymentRecipient: Primitive.Address,
  /**
   * Optional payment signature to be passed into the `compensate` function
   * on the `payer`. This signature is NOT included in the EIP712 signature.
   */
  paymentSignature: Primitive.Hex,
  /** The ERC20 or native token used to pay for gas. */
  paymentToken: Primitive.Address,
  /**
   * The actual pre payment amount, requested by the filler.
   * MUST be less than or equal to `prePaymentMaxAmount`.
   */
  prePaymentAmount: Primitive.BigInt,
  /**
   * The amount of the token to pay, before the call batch is executed.
   * This will be required to be less than `totalPaymentMaxAmount`.
   */
  prePaymentMaxAmount: Primitive.BigInt,
  /**
   * The actual total payment amount, requested by the filler.
   * MUST be less than or equal to `totalPaymentMaxAmount`
   */
  signature: Primitive.Hex,
  /**
   * The maximum amount of the token to pay.
   */
  supportedDelegationImplementation: Primitive.Address,
  /**
   * The wrapped signature.
   *
   * The format is `abi.encodePacked(innerSignature, keyHash, prehash)` for most signatures,
   * except if it is signed by the EOA root key, in which case `abi.encodePacked(r, s, v)` is valid as well.
   */
  totalPaymentAmount: Primitive.BigInt,
  /**
   * Optional. If non-zero, the EOA must use `supportedDelegationImplementation`.
   * Otherwise, if left as `address(0)`, any EOA implementation will be supported.
   * This field is NOT included in the EIP712 signature.
   */
  totalPaymentMaxAmount: Primitive.BigInt,
})
export type UserOp = Schema.StaticDecode<typeof UserOp>

export const Partial = Type.Object({
  eoa: Primitive.Address,
  executionData: Primitive.Hex,
  initData: Primitive.Hex,
  nonce: Primitive.BigInt,
})
export type Partial = Schema.StaticDecode<typeof Partial>

export const PreOp = Type.Object({
  /**
   * The user's address.
   *
   * This can be set to `address(0)`, which allows it to be
   * coalesced to the parent UserOp's EOA.
   */
  eoa: Primitive.Address,
  /**
   * An encoded array of calls, using ERC7579 batch execution encoding.
   *
   * `abi.encode(calls)`, where `calls` is of type `Call[]`.
   * This allows for more efficient safe forwarding to the EOA.
   */
  executionData: Primitive.Hex,
  /**
   * Per delegated EOA. Same logic as the `nonce` in UserOp.
   *
   * A nonce of `type(uint256).max` skips the check, incrementing,
   * and the emission of the {UserOpExecuted} event.
   */
  nonce: Primitive.BigInt,
  /**
   * The wrapped signature.
   *
   * `abi.encodePacked(innerSignature, keyHash, prehash)`.
   */
  signature: Primitive.Hex,
})
export type PreOp = Schema.StaticDecode<typeof PreOp>
