import type * as Address from 'ox/Address'
import type * as Fee from 'ox/Fee'
import * as Hex from 'ox/Hex'
import * as Signature from 'ox/Signature'
import type { Client } from 'viem'

import type * as Key from '../key.js'
import type { Undefined } from '../types.js'
import * as ActionRequest from './actionRequest.js'

/**
 * Quote type.
 * Mirrors the `Quote` type on the Relay.
 */
export type Quote<
  signed extends boolean = boolean,
  bigintType = bigint,
  numberType = number,
> = {
  /** The amount of the token to pay. */
  amount: bigintType
  /** The address of the authorization contract. */
  authorizationAddress: Address.Address
  /** The digest of the `UserOp`. */
  digest: Hex.Hex
  /** The estimated amount of gas the action will consume. */
  gasEstimate: {
    op: bigintType
    tx: bigintType
  }
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

export async function estimateFee(
  client: Client,
  options: estimateFee.Options,
): Promise<Quote<true>> {
  const {
    action,
    delegation,
    keyType = 'secp256k1',
    token = '0x0000000000000000000000000000000000000000',
  } = options

  const request = ActionRequest.toRpc(action, {
    chainId: client.chain?.id ?? 0,
  })

  const toKeyType = {
    p256: 'p256',
    secp256k1: 'secp256k1',
    'webauthn-p256': 'webauthnp256',
  } as const satisfies Record<Key.Key['type'], string>

  const result = await client.request<any>({
    method: 'relay_estimateFee',
    params: [
      request,
      token,
      ...(delegation ? [delegation] : [undefined]),
      toKeyType[keyType],
    ],
  })

  return fromRpc(result) as never
}

export declare namespace estimateFee {
  type Options = {
    action: ActionRequest.ActionRequest
    delegation?: Address.Address | undefined
    keyType?: Key.Key['type'] | undefined
    token?: Address.Address | undefined
  }
}

export function fromRpc<signed extends boolean = boolean>(
  rpc: Rpc<signed>,
): Quote<signed> {
  const signature = Signature.extract(rpc)
  return {
    amount: BigInt(rpc.amount),
    authorizationAddress: rpc.authorizationAddress,
    digest: rpc.digest,
    gasEstimate: {
      op: BigInt(rpc.gasEstimate.op),
      tx: BigInt(rpc.gasEstimate.tx),
    },
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
    authorizationAddress: quote.authorizationAddress,
    digest: quote.digest,
    gasEstimate: {
      op: Hex.fromNumber(quote.gasEstimate.op),
      tx: Hex.fromNumber(quote.gasEstimate.tx),
    },
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
