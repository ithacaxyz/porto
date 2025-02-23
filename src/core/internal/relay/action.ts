import * as AbiParameters from 'ox/AbiParameters'
import type * as Address from 'ox/Address'
import * as Authorization from 'ox/Authorization'
import * as Hex from 'ox/Hex'
import * as Signature from 'ox/Signature'
import * as TypedData from 'ox/TypedData'
import type { Client } from 'viem'
import { readContract } from 'viem/actions'
import {
  type Authorization as Authorization_viem,
  prepareAuthorization,
} from 'viem/experimental'

import * as Account from '../account.js'
import * as Call from '../call.js'
import { delegationAbi } from '../generated.js'
import type * as Key from '../key.js'
import type { PartialBy } from '../types.js'
import * as ActionRequest from './actionRequest.js'
import * as EntryPoint from './entryPoint.js'
import * as Quote from './quote.js'

/**
 * Action.
 * Mirrors a `UserOp` struct on Account contract.
 */
export type Action<signed extends boolean = boolean, bigintType = bigint> = {
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

export type Rpc = {
  /**
   * Chain ID of the action.
   */
  chainId: number
  /**
   * User operation.
   */
  op: Action<true, Hex.Hex>
}

export function from<
  const action extends from.Value,
  const signature extends Hex.Hex | undefined = undefined,
>(
  action: action | from.Value,
  options: from.Options<signature> = {},
): from.ReturnType<action, signature> {
  return {
    ...action,
    payer: action.payer ?? '0x0000000000000000000000000000000000000000',
    paymentMaxAmount: action.paymentMaxAmount ?? action.paymentAmount,
    paymentPerGas: action.paymentPerGas ?? 0n,
    paymentRecipient:
      action.paymentRecipient ?? '0x0000000000000000000000000000000000000000',
    signature: options.signature,
  } as Action as never
}

export declare namespace from {
  type Value = PartialBy<
    Action,
    'payer' | 'paymentMaxAmount' | 'paymentPerGas' | 'paymentRecipient'
  >

  type Options<signature extends Hex.Hex | undefined = undefined> = {
    signature?: signature | Hex.Hex | undefined
  }

  type ReturnType<
    action extends from.Value = from.Value,
    signature extends Hex.Hex | undefined = undefined,
  > = Action<signature extends Hex.Hex ? true : false> & action
}

export function fromRpc(rpc: Rpc): Action {
  return {
    ...rpc,
    ...rpc.op,
    combinedGas: BigInt(rpc.op.combinedGas),
    nonce: BigInt(rpc.op.nonce),
    paymentAmount: BigInt(rpc.op.paymentAmount),
    paymentMaxAmount: BigInt(rpc.op.paymentMaxAmount),
    paymentPerGas: BigInt(rpc.op.paymentPerGas),
  }
}

export async function getSignPayload(
  client: Client,
  action: Action,
): Promise<Hex.Hex> {
  const [c] = AbiParameters.decode(
    AbiParameters.from([
      'struct Call { address target; uint256 value; bytes data; }',
      'Call[] calls',
    ]),
    action.executionData,
  )
  const calls = c.map((call) => ({
    ...call,
    target: call.target === Call.self ? action.eoa : call.target,
  }))

  const domain = EntryPoint.getEip712Domain(client)
  const multichain = action.nonce & 1n
  const nonceSalt =
    multichain > 0n
      ? 0n
      : await readContract(client, {
          abi: delegationAbi,
          address: action.eoa,
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
      ...action,
      multichain: Boolean(multichain),
      calls,
      nonceSalt,
    },
    primaryType: 'UserOp',
  })
}

/**
 * Prepares the payloads to sign over and fills the request to send an Action.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Prepare action parameters.
 * @returns Prepared properties.
 */
export async function prepare<
  const calls extends readonly unknown[],
  account extends Account.Account | Address.Address,
>(
  client: Client,
  parameters: prepare.Parameters<calls, account>,
): Promise<prepare.ReturnType<account>> {
  const { delegation, calls, gasToken } = parameters

  const account = Account.from(parameters.account)

  // Prepare the User Operation request.
  const request = ActionRequest.prepare({
    account,
    calls,
    delegation,
  })

  // Get the quote to execute the Action.
  const quote = await Quote.estimateFee(client, {
    action: request,
    delegation,
    token: gasToken,
  })

  const action = from({
    ...request,
    combinedGas: quote.gasEstimate,
    paymentAmount: quote.amount,
    paymentToken: quote.token,
  })

  // Compute the signing payloads for execution and EIP-7702 authorization (optional).
  const [actionPayload, [authorization, authorizationPayload]] =
    await Promise.all([
      getSignPayload(client, action),

      // Only need to compute an authorization payload if we are delegating to an EOA.
      (async () => {
        if (!delegation) return []

        const authorization = await prepareAuthorization(client, {
          account: account.address,
          chainId: 0,
          contractAddress: delegation,
          sponsor: true,
        })
        return [
          authorization,
          Authorization.getSignPayload({
            address: authorization.contractAddress,
            chainId: authorization.chainId,
            nonce: BigInt(authorization.nonce),
          }),
        ]
      })(),
    ])

  return {
    context: {
      action,
      authorization,
      quote,
    },
    signPayloads: [
      actionPayload,
      ...(authorizationPayload ? [authorizationPayload] : []),
    ] as never,
  }
}

export declare namespace prepare {
  type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
    account extends Account.Account | Address.Address =
      | Account.Account
      | Address.Address,
  > = Pick<ActionRequest.prepare.Parameters<calls>, 'calls'> & {
    /**
     * Account to prepare the action for.
     */
    account: account | Account.Account | Address.Address
    /**
     * Contract address to delegate to.
     */
    delegation?: Address.Address | undefined
    /**
     * ERC20 or native token to pay for gas.
     * If left empty, the native token will be used.
     */
    gasToken?: Address.Address | undefined
  }

  type ReturnType<
    account extends Account.Account | Address.Address =
      | Account.Account
      | Address.Address,
  > = {
    context: {
      action: Action<false>
      authorization?: Authorization_viem | undefined
      quote: Quote.Quote<true>
    }
    signPayloads: account extends {
      sign: NonNullable<Account.Account['sign']>
    }
      ?
          | [userOpPayload: Hex.Hex]
          | [userOpPayload: Hex.Hex, authorizationPayload: Hex.Hex]
      : [userOpPayload: Hex.Hex]
  }
}

/**
 * Sends an Action to the Relay.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Send action parameters.
 * @returns Transaction hash.
 */
export async function send<const calls extends readonly unknown[]>(
  client: Client,
  options: send.Options<calls>,
): Promise<Hex.Hex> {
  const account = Account.from(options.account)

  // Prepare the action.
  const { context, signPayloads } = await prepare(client, options)

  // Sign the payloads.
  const signatures = await Account.sign(account, {
    key: options.key,
    payloads: signPayloads,
  })

  // Send the action.
  return sendPrepared(client, {
    ...context,
    signatures,
  })
}

export declare namespace send {
  type Options<calls extends readonly unknown[] = readonly unknown[]> =
    prepare.Parameters<calls> & {
      /**
       * Key to use for execution.
       */
      key?: number | Key.Key | undefined
    }
}

/**
 * Sends a prepared & signed Action to the Relay.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function sendPrepared(
  client: Client,
  parameters: sendPrepared.Parameters,
): Promise<Hex.Hex> {
  const [userOpSignature, authSignature] = parameters.signatures ?? []

  const action = from(parameters.action, {
    signature: userOpSignature!,
  })

  const authorization = (() => {
    if (!authSignature) return undefined
    if (!parameters.authorization) throw new Error('authorization is required.')
    const { contractAddress, chainId, nonce } = parameters.authorization
    const signature = Signature.from(authSignature)
    return {
      address: contractAddress,
      chainId,
      nonce,
      r: Hex.fromNumber(signature.r),
      s: Hex.fromNumber(signature.s),
      yParity: signature.yParity,
    } as const
  })()

  const request = toRpc(action, {
    chainId: client.chain?.id ?? 0,
  })
  const quote = Quote.toRpc(parameters.quote)

  const hash = await client.request<any>({
    method: 'relay_sendAction',
    params: [request, quote, ...(authorization ? [authorization] : [])],
  })

  return hash
}

export declare namespace sendPrepared {
  type Parameters = {
    action: Action<false>
    authorization?: Authorization_viem<number, false> | undefined
    quote: Quote.Quote<true>
    signatures: readonly Hex.Hex[]
  }
}

export function toRpc(action: Action<true>, options: toRpc.Options): Rpc {
  const { chainId } = options
  return {
    chainId,
    op: {
      combinedGas: Hex.fromNumber(action.combinedGas),
      eoa: action.eoa,
      executionData: action.executionData,
      nonce: Hex.fromNumber(action.nonce),
      payer: action.payer,
      paymentAmount: Hex.fromNumber(action.paymentAmount),
      paymentMaxAmount: Hex.fromNumber(action.paymentMaxAmount),
      paymentPerGas: Hex.fromNumber(action.paymentPerGas),
      paymentRecipient: action.paymentRecipient,
      paymentToken: action.paymentToken,
      signature: action.signature,
    },
  }
}

export declare namespace toRpc {
  type Options = {
    chainId: number
  }
}
