import type * as Address from 'ox/Address'
import type * as Fee from 'ox/Fee'
import * as Hex from 'ox/Hex'
import * as Signature from 'ox/Signature'
import type { Undefined } from '../types.js'

export type Quote<
  signed extends boolean = boolean,
  bigintType = bigint,
  numberType = number,
> = {
  /** The amount of the token to pay. */
  amount: bigintType
  /** The digest of the `UserOp`. */
  digest: Hex.Hex
  /** The estimated amount of gas the action will consume. */
  gasEstimate: bigintType
  /** The fee estimate for the action in the destination chains native token. */
  nativeFeeEstimate: Fee.FeeValuesEip1559<bigintType>
  /** The fee token address. */
  token: Address.Address
  /** UNIX timestamp of the time-to-live of the quote. */
  ttl: number
} & (signed extends true
  ? Signature.Signature<true, bigintType, numberType> & { hash: Hex.Hex }
  : Undefined<Signature.Signature> & { hash?: undefined })

export type Rpc<signed extends boolean = boolean> = Quote<
  signed,
  Hex.Hex,
  Hex.Hex
>

export function fromRpc<signed extends boolean = boolean>(
  rpc: Rpc<signed>,
): Quote<signed> {
  const signature = Signature.extract(rpc)
  return {
    amount: BigInt(rpc.amount),
    digest: rpc.digest,
    gasEstimate: BigInt(rpc.gasEstimate),
    hash: rpc.hash,
    nativeFeeEstimate: {
      maxFeePerGas: BigInt(rpc.nativeFeeEstimate.maxFeePerGas),
      maxPriorityFeePerGas: BigInt(rpc.nativeFeeEstimate.maxPriorityFeePerGas),
    },
    token: rpc.token,
    ttl: Number(rpc.ttl),
    ...signature,
  } as never
}

export function toRpc<signed extends boolean = boolean>(
  quote: Quote<signed>,
): Rpc<signed> {
  const signature = Signature.extract(quote)
  return {
    amount: Hex.fromNumber(quote.amount),
    digest: quote.digest,
    gasEstimate: Hex.fromNumber(quote.gasEstimate),
    hash: quote.hash,
    nativeFeeEstimate: {
      maxFeePerGas: Hex.fromNumber(quote.nativeFeeEstimate.maxFeePerGas),
      maxPriorityFeePerGas: Hex.fromNumber(
        quote.nativeFeeEstimate.maxPriorityFeePerGas,
      ),
    },
    token: quote.token,
    ttl: quote.ttl,
    ...(signature ? Signature.toRpc(signature) : {}),
  } as never
}
