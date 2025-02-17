import type * as Address from 'ox/Address'
import * as Authorization from 'ox/Authorization'
import * as Hex from 'ox/Hex'
import type { Client } from 'viem'
import {
  type Authorization as Authorization_viem,
  prepareAuthorization,
} from 'viem/experimental'

import * as Account from '../account.js'
import type * as Key from '../key.js'
import type { Compute } from '../types.js'
import * as Quote from './quote.js'
import * as UserOp from './userOp.js'
import * as UserOpRequest from './userOpRequest.js'

export type Action<
  signed extends boolean = boolean,
  bigintType = bigint,
  numberType = number,
> = {
  /**
   * EIP-7702 Authorization object.
   */
  authorization?: Authorization_viem<numberType, signed> | undefined
  /**
   * User operation.
   */
  userOp: UserOp.UserOp<signed, bigintType>
}

export type Rpc = {
  /**
   * EIP-7702 Authorization object.
   */
  auth?: Authorization.Rpc | undefined
  /**
   * User operation.
   */
  op: UserOp.Rpc
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
  const request = UserOpRequest.prepare({
    account,
    calls,
  })

  // Get the quote to execute the Action.
  const quote = await Quote.estimateFee(client, {
    request,
    token: gasToken,
  })

  const userOp = UserOp.from({
    ...request,
    combinedGas: quote.gasEstimate,
    paymentAmount: quote.amount,
    paymentToken: quote.token,
  })

  // Compute the signing payloads for execution and EIP-7702 authorization (optional).
  const [userOpPayload, [authorization, authorizationPayload]] =
    await Promise.all([
      UserOp.getSignPayload(client, userOp),

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
      authorization,
      quote,
      userOp,
    },
    signPayloads: [
      userOpPayload,
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
  > = Pick<UserOpRequest.prepare.Parameters<calls>, 'calls'> & {
    account: account | Account.Account | Address.Address
    delegation?: Address.Address | undefined
    gasToken?: Address.Address | undefined
  }

  type ReturnType<
    account extends Account.Account | Address.Address =
      | Account.Account
      | Address.Address,
  > = {
    context: Compute<
      Action<false> & {
        quote: Quote.Quote<true>
      }
    >
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
  const [userOpSignature, _authSignature] = parameters.signatures ?? []

  const userOp = UserOp.from(parameters.userOp, {
    signature: userOpSignature!,
  })

  const request = toRpc({
    // TODO: authorization
    userOp,
  })
  const quote = Quote.toRpc(parameters.quote)

  const hash = await client.request<any>({
    method: 'relay_sendAction',
    params: [request, quote],
  })

  return hash
}

export declare namespace sendPrepared {
  type Parameters = Action & {
    quote: Quote.Quote<true>
    signatures: readonly Hex.Hex[]
  }
}

export function toRpc(action: Action<true>): Rpc {
  return {
    auth: action.authorization
      ? {
          address: action.authorization.contractAddress,
          chainId: Hex.fromNumber(action.authorization.chainId),
          nonce: Hex.fromNumber(action.authorization.nonce),
          r: action.authorization.r,
          s: action.authorization.s,
          yParity: Hex.fromNumber(action.authorization.yParity!),
        }
      : undefined,
    op: UserOp.toRpc(action.userOp),
  }
}
