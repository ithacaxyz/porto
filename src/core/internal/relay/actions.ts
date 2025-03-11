/**
 * Wrapper for Relay JSON-RPC methods.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/rpc.rs
 */

import { AssertError, TransformEncodeCheckError } from '@sinclair/typebox/value'
import * as AbiFunction from 'ox/AbiFunction'
import type * as Address from 'ox/Address'
import * as Authorization from 'ox/Authorization'
import * as Errors from 'ox/Errors'
import * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import * as Signature from 'ox/Signature'
import type { Calls, Narrow } from 'viem'
import {
  type Authorization as Authorization_viem,
  prepareAuthorization,
} from 'viem/experimental'

import * as Delegation from '../delegation.js'
import type { Client } from '../porto.js'
import { Value } from '../typebox/schema.js'
import * as Rpc from './typebox/rpc.js'

/**
 * Creates a new account.
 *
 * @example
 * TODO
 *
 * @param client - The client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function createAccount(
  client: Client,
  parameters: createAccount.Parameters,
): Promise<createAccount.ReturnType> {
  const { capabilities } = parameters
  try {
    const result = await client.request({
      method: 'wallet_createAccount',
      params: [
        Value.Encode(Rpc.wallet_createAccount.Parameters, {
          capabilities,
        }),
      ],
    })
    return Value.Parse(Rpc.wallet_createAccount.Response, result)
  } catch (error) {
    parseSchemaError(error)
    throw error
  }
}

export namespace createAccount {
  export type Parameters = Rpc.wallet_createAccount.Parameters

  export type ReturnType = Rpc.wallet_createAccount.Response

  export type ErrorType = parseSchemaError.ErrorType | Errors.GlobalErrorType
}

/**
 * Prepares a call bundle.
 *
 * @example
 * TODO
 *
 * @param client - The client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function prepareCalls<const calls extends readonly unknown[]>(
  client: Client,
  parameters: prepareCalls.Parameters<calls>,
): Promise<prepareCalls.ReturnType> {
  const { account, capabilities, chainId = client.chain.id } = parameters

  const calls = parameters.calls.map((call: any) => {
    return {
      data: call.abi
        ? AbiFunction.encodeData(
            AbiFunction.fromAbi(call.abi, call.functionName),
            call.args,
          )
        : (call.data ?? '0x'),
      to: call.to,
      value: call.value ?? 0n,
    }
  })

  try {
    const result = await client.request({
      method: 'wallet_prepareCalls',
      params: [
        Value.Encode(Rpc.wallet_prepareCalls.Parameters, {
          calls,
          capabilities,
          chainId,
          from: account,
        }),
      ],
    })
    return Value.Parse(Rpc.wallet_prepareCalls.Response, result)
  } catch (error) {
    parseSchemaError(error)
    Delegation.parseExecutionError(error, { calls: parameters.calls })
    throw error
  }
}

export namespace prepareCalls {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
  > = {
    account: Address.Address
    calls: Calls<Narrow<calls>>
    capabilities: Rpc.wallet_prepareCalls.Capabilities
    chainId?: number | undefined
  }

  export type ReturnType = Rpc.wallet_prepareCalls.Response

  export type ErrorType =
    | parseSchemaError.ErrorType
    | Delegation.parseExecutionError.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Prepares an account upgrade.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function prepareUpgradeAccount(
  client: Client,
  parameters: prepareUpgradeAccount.Parameters,
): Promise<prepareUpgradeAccount.ReturnType> {
  const { address, capabilities, chainId = client.chain.id } = parameters

  try {
    const [result, [authorization, authorizationDigest]] = await Promise.all([
      client.request({
        method: 'wallet_prepareUpgradeAccount',
        params: [
          Value.Encode(Rpc.wallet_prepareUpgradeAccount.Parameters, {
            address,
            capabilities,
            chainId,
          }),
        ],
      }),
      (async () => {
        const authorization = await prepareAuthorization(client, {
          account: address,
          chainId: 0,
          contractAddress: capabilities.delegation,
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
    const parsed = Value.Parse(
      Rpc.wallet_prepareUpgradeAccount.Response,
      result,
    )
    return {
      ...parsed,
      context: {
        ...parsed.context,
        authorization,
      },
      digests: [parsed.digest, authorizationDigest],
    }
  } catch (error) {
    parseSchemaError(error)
    Delegation.parseExecutionError(error)
    throw error
  }
}
export namespace prepareUpgradeAccount {
  export type Parameters = {
    address: Address.Address
    capabilities: Rpc.wallet_prepareUpgradeAccount.Capabilities
    chainId?: number | undefined
  }

  export type ReturnType = Omit<
    Rpc.wallet_prepareUpgradeAccount.Response,
    'context' | 'digest'
  > & {
    context: Rpc.wallet_prepareUpgradeAccount.Response['context'] & {
      authorization: Authorization_viem
    }
    digests: [execute: Hex.Hex, auth: Hex.Hex]
  }

  export type ErrorType =
    | parseSchemaError.ErrorType
    | Delegation.parseExecutionError.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Broadcasts a signed call bundle.
 *
 * @example
 * TODO
 *
 * @param client - The client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function sendPreparedCalls(
  client: Client,
  parameters: sendPreparedCalls.Parameters,
): Promise<sendPreparedCalls.ReturnType> {
  const { context, signature } = parameters
  try {
    const result = await client.request({
      method: 'wallet_sendPreparedCalls',
      params: [
        Value.Encode(Rpc.wallet_sendPreparedCalls.Parameters, {
          context,
          signature,
        }),
      ],
    })
    return Value.Parse(Rpc.wallet_sendPreparedCalls.Response, result)
  } catch (error) {
    parseSchemaError(error)
    Delegation.parseExecutionError(error)
    throw error
  }
}

export namespace sendPreparedCalls {
  export type Parameters = Rpc.wallet_sendPreparedCalls.Parameters

  export type ReturnType = Rpc.wallet_sendPreparedCalls.Response

  export type ErrorType =
    | parseSchemaError.ErrorType
    | Delegation.parseExecutionError.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Broadcasts an account upgrade.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function upgradeAccount(
  client: Client,
  parameters: upgradeAccount.Parameters,
): Promise<upgradeAccount.ReturnType> {
  const { context, signatures } = parameters

  const authorization = (() => {
    const { contractAddress, chainId, nonce } = context.authorization
    const signature = Signature.from(signatures[1]!)
    return {
      address: contractAddress,
      chainId,
      nonce,
      r: Hex.fromNumber(signature.r),
      s: Hex.fromNumber(signature.s),
      yParity: signature.yParity,
    } as const
  })()

  try {
    const result = await client.request({
      method: 'wallet_upgradeAccount',
      params: [
        Value.Encode(Rpc.wallet_upgradeAccount.Parameters, {
          authorization,
          context,
          signature: signatures[0],
        }),
      ],
    })
    return Value.Parse(Rpc.wallet_upgradeAccount.Response, result)
  } catch (error) {
    parseSchemaError(error)
    Delegation.parseExecutionError(error)
    throw error
  }
}

export namespace upgradeAccount {
  export type Parameters = {
    context: Rpc.wallet_upgradeAccount.Parameters['context'] & {
      authorization: Authorization_viem<number, false>
    }
    signatures: readonly Hex.Hex[]
  }

  export type ReturnType = Rpc.wallet_upgradeAccount.Response

  export type ErrorType =
    | parseSchemaError.ErrorType
    | Delegation.parseExecutionError.ErrorType
    | Errors.GlobalErrorType
}

export function parseSchemaError(e: unknown) {
  if (e instanceof TransformEncodeCheckError) throw new SchemaCoderError(e)
  if (e instanceof AssertError) throw new SchemaCoderError(e)
}

export declare namespace parseSchemaError {
  type ErrorType = SchemaCoderError
}

/** Thrown when schema validation fails. */
export declare namespace parseSchemaError {
  type Options = {
    calls?: readonly unknown[] | undefined
  }
}

export class SchemaCoderError extends Errors.BaseError<
  AssertError | TransformEncodeCheckError
> {
  override readonly name = 'Actions.SchemaCoderError'

  constructor(cause: AssertError | TransformEncodeCheckError) {
    const message = (() => {
      let reason = cause.error?.errors[0]?.First()
      if (!reason) reason = cause.error
      if (!reason) return cause.message
      return [
        reason?.message,
        '',
        'Path: ' + reason?.path.slice(1).replaceAll('/', '.'),
        reason?.value && 'Value: ' + Json.stringify(reason.value),
      ]
        .filter((x) => typeof x === 'string')
        .join('\n')
    })()

    super(message, {
      cause,
    })
  }
}
