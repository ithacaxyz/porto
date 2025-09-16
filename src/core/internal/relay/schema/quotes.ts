/**
 * RPC quote.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/types/quote.rs
 */

import { z } from 'zod/mini'
import * as u from '../../schema/utils.js'
import * as Intent from './intent.js'

export const AssetDeficit = z.object({
  /** Asset address. null represents the native token. */
  address: z.union([u.address(), z.null()]),
  /** Token decimals. */
  decimals: z.optional(z.number()),
  /** Deficit for the asset. */
  deficit: u.bigint(),
  /** Token name. */
  name: z.optional(z.string()),
  /** Required amount for the asset. */
  required: u.bigint(),
  /** Token symbol. */
  symbol: z.optional(z.string()),
})
export type AssetDeficit = z.infer<typeof AssetDeficit>

/** A quote from the RPC for a given `Intent`. */
export const Quote = z.object({
  /** Assets missing for the intent to execute. */
  assetDeficits: z.optional(z.array(AssetDeficit)),
  /**
   * An optional unsigned authorization item.
   * The account in `eoa` will be delegated to this address.
   */
  authorizationAddress: z.optional(z.union([u.address(), z.null()])),
  /** Chain ID the quote is for. */
  chainId: u.number(),
  /** The price (in wei) of ETH in the payment token. */
  ethPrice: u.bigint(),
  /** Extra payment for e.g L1 DA fee that is paid on top of the execution gas. */
  extraPayment: u.bigint(),
  /** The deficit of the fee token. */
  feeTokenDeficit: u.bigint(),
  /** The fee estimate for the bundle in the destination chains native token. */
  intent: Intent.Intent,
  /** The `Intent` the quote is for. */
  nativeFeeEstimate: z.object({
    /** The maximum fee per gas for the bundle. */
    maxFeePerGas: u.bigint(),
    /** The maximum priority fee per gas for the bundle. */
    maxPriorityFeePerGas: u.bigint(),
  }),
  /** The orchestrator for the quote. */
  orchestrator: u.address(),
  /** The decimals of the payment token. */
  paymentTokenDecimals: z.number(),
  /** The recommended gas limit for the bundle. */
  txGas: u.bigint(),
})
export type Quote = z.infer<typeof Quote>

export const Quotes = z.object({
  /** Merkle root if it's a multichain workflow. */
  multiChainRoot: z.optional(z.union([u.hex(), z.null()])),
  /**
   * A quote for each intent.
   *
   * - For a single-chain workflow, this will have exactly one item, the output intent.
   * - For a multi-chain workflow, this will have multiple items, where the last one is the output
   *   intent.
   */
  quotes: z.readonly(z.array(Quote)).check(z.minLength(1)),
  /** The time-to-live (UNIX timestamp) of the quotes. */
  ttl: z.number(),
})

export const Signed = z.object({
  ...Quotes.shape,
  hash: u.hex(),
  r: u.hex(),
  s: u.hex(),
  v: z.optional(u.hex()),
  yParity: z.optional(u.hex()),
})
export type Signed = z.infer<typeof Signed>
