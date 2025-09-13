/**
 * Intent.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/types/intent.rs
 */

import * as z from 'zod/mini'
import * as u from '../../schema/utils.js'

export const Intent = z.union([
  z.object({
    combinedGas: u.bigint(),
    encodedFundTransfers: z.readonly(z.array(u.hex())),
    encodedPreCalls: z.readonly(z.array(u.hex())),
    eoa: u.address(),
    executionData: u.hex(),
    expiry: u.bigint(),
    funder: u.address(),
    funderSignature: u.hex(),
    isMultichain: z.boolean(),
    nonce: u.bigint(),
    payer: u.address(),
    paymentAmount: u.bigint(),
    paymentMaxAmount: u.bigint(),
    paymentRecipient: u.address(),
    paymentSignature: u.hex(),
    paymentToken: u.address(),
    settler: u.address(),
    settlerContext: u.hex(),
    signature: u.hex(),
    supportedAccountImplementation: u.address(),
  }),
  z.object({
    /** The combined gas limit for payment, verification, and calling the EOA. */
    combinedGas: u.bigint(),
    /** Only relevant for multi chain intents. */
    encodedFundTransfers: z.readonly(z.array(u.hex())),
    /**
     * Optional array of encoded Intents that will be verified and executed
     * before the validation of the overall Intent.
     *
     * A PreCall will NOT have its gas limit or payment applied.
     * The overall Intent's gas limit and payment will be applied, encompassing all its PreCalls.
     * The execution of a PreCall will check and increment the nonce in the PreCall.
     * If at any point, any PreCall cannot be verified to be correct, or fails in execution,
     * the overall Intent will revert before validation, and execute will return a non-zero error.
     * A PreCall can contain PreCalls, forming a tree structure.
     * The `executionData` tree will be executed in post-order (i.e. left -> right -> current).
     * The `encodedPreCalls` are included in the EIP712 signature, which enables execution order
     * to be enforced on-the-fly even if the nonces are from different sequences.
     */
    encodedPreCalls: z.readonly(z.array(u.hex())),
    /** Users address. */
    eoa: u.address(),
    /**
     * An encoded array of calls, using ERC7579 batch execution encoding.
     *
     * The format is `abi.encode(calls)`, where `calls` is an array of type `Call[]`.
     * This allows for more efficient safe forwarding to the EOA.
     */
    executionData: u.hex(),
    /** The expiration time of the intent. */
    expiry: u.bigint(),
    /** The funder address. */
    funder: u.address(),
    /** The funder's signature. */
    funderSignature: u.hex(),
    /** Whether the intent is a multi-chain intent. */
    isMultichain: z.boolean(),
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
     * of the Intent will exlude the chain ID.
     *
     * # Ordering
     *
     * Ordering matters within a sequence key, but not between sequence keys.
     *
     * This means that users who do not care about the order of specific intents
     * can sign their intents using a random sequence key. On the other hand, if
     * they do care about ordering, they would use the same sequence key.
     */
    nonce: u.bigint(),
    /**
     * The account paying the payment token.
     * If this is `address(0)`, it defaults to the `eoa`.
     */
    payer: u.address(),
    /**
     * The payment recipient for the ERC20 token.
     *
     * Excluded from signature. The filler can replace this with their own address.
     *
     * This enables multiple fillers, allowing for competitive filling, better uptime.
     * If `address(0)`, the payment will be accrued by the entry point.
     */
    paymentRecipient: u.address(),
    /**
     * Optional payment signature to be passed into the `compensate` function
     * on the `payer`. This signature is NOT included in the EIP712 signature.
     */
    paymentSignature: u.hex(),
    /** The ERC20 or native token used to pay for gas. */
    paymentToken: u.address(),
    /**
     * The actual pre payment amount, requested by the filler.
     * MUST be less than or equal to `prePaymentMaxAmount`.
     */
    prePaymentAmount: u.bigint(),
    /**
     * The amount of the token to pay, before the call batch is executed.
     * This will be required to be less than `totalPaymentMaxAmount`.
     */
    prePaymentMaxAmount: u.bigint(),
    /**
     * The address of the settler.
     */
    settler: u.address(),
    /**
     * Context data passed to the settler for processing attestations.
     *
     * This data is ABI-encoded and contains information needed by the settler
     * to process the multichain intent (e.g., list of chain IDs).
     */
    settlerContext: u.hex(),
    /**
     * The actual total payment amount, requested by the filler.
     * MUST be less than or equal to `totalPaymentMaxAmount`
     */
    signature: u.hex(),
    /**
     * Optional. If non-zero, the EOA must use `supportedAccountImplementation`.
     * Otherwise, if left as `address(0)`, any EOA implementation will be supported.
     * This field is NOT included in the EIP712 signature.
     */
    supportedAccountImplementation: u.address(),
    /**
     * The wrapped signature.
     *
     * The format is `abi.encodePacked(innerSignature, keyHash, prehash)` for most signatures,
     * except if it is signed by the EOA root key, in which case `abi.encodePacked(r, s, v)` is valid as well.
     */
    totalPaymentAmount: u.bigint(),
    /**
     * The maximum amount of the token to pay.
     */
    totalPaymentMaxAmount: u.bigint(),
  }),
])
export type Intent = z.infer<typeof Intent>

export const Partial = z.object({
  eoa: u.address(),
  executionData: u.hex(),
  nonce: u.bigint(),
})
export type Partial = z.infer<typeof Partial>
