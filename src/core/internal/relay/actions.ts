// Ref:
// https://github.com/ithacaxyz/relay/blob/main/src/rpc.rs

import { TransformEncodeCheckError } from '@sinclair/typebox/value'
import * as AbiFunction from 'ox/AbiFunction'
import type * as Address from 'ox/Address'
import * as Errors from 'ox/Errors'
import * as Json from 'ox/Json'
import type { Calls, Narrow } from 'viem'

import type { Client } from '../porto.js'
import { type StaticDecode, Value } from '../typebox/schema.js'
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
    throw getError(error)
  }
}

export namespace createAccount {
  export type Parameters = StaticDecode<
    typeof Rpc.wallet_createAccount.Parameters
  >

  export type ReturnType = StaticDecode<
    typeof Rpc.wallet_createAccount.Response
  >
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
      target: call.to,
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
    throw getError(error)
  }
}

export namespace prepareCalls {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
  > = {
    account: Address.Address
    calls: Calls<Narrow<calls>>
    capabilities: StaticDecode<typeof Rpc.wallet_prepareCalls.Capabilities>
    chainId?: number | undefined
  }

  export type ReturnType = StaticDecode<typeof Rpc.wallet_prepareCalls.Response>
}

function getError(error: unknown) {
  console.error(error)
  if (error instanceof TransformEncodeCheckError)
    return new SchemaCoderError(error)
  return error
}

export class SchemaCoderError extends Errors.BaseError<TransformEncodeCheckError> {
  override readonly name = 'Actions.SchemaCoderError'

  constructor(cause: TransformEncodeCheckError) {
    const message = (() => {
      let reason = cause.error.errors[0]?.First()
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
