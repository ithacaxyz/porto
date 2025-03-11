/**
 * Wrapper for Relay JSON-RPC methods.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/rpc.rs
 */

import { AssertError, TransformEncodeCheckError } from '@sinclair/typebox/value'
import * as AbiFunction from 'ox/AbiFunction'
import type * as Address from 'ox/Address'
import * as Errors from 'ox/Errors'
import * as Json from 'ox/Json'
import type { Calls, Narrow } from 'viem'

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
    throw getError(error)
  }
}

export namespace createAccount {
  export type Parameters = Rpc.wallet_createAccount.Parameters
  export type ReturnType = Rpc.wallet_createAccount.Response
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
    throw getError(error)
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
}

export async function prepareUpgradeAccount(
  client: Client,
  parameters: prepareUpgradeAccount.Parameters,
): Promise<prepareUpgradeAccount.ReturnType> {
  const { address, capabilities, chainId = client.chain.id } = parameters

  try {
    const result = await client.request({
      method: 'wallet_prepareUpgradeAccount',
      params: [
        Value.Encode(Rpc.wallet_prepareUpgradeAccount.Parameters, {
          address,
          capabilities,
          chainId,
        }),
      ],
    })
    return Value.Parse(Rpc.wallet_prepareUpgradeAccount.Response, result)
  } catch (error) {
    throw getError(error)
  }
}
export namespace prepareUpgradeAccount {
  export type Parameters = {
    address: Address.Address
    capabilities: Rpc.wallet_prepareUpgradeAccount.Capabilities
    chainId?: number | undefined
  }

  export type ReturnType = Rpc.wallet_prepareUpgradeAccount.Response
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
    throw getError(error)
  }
}

export namespace sendPreparedCalls {
  export type Parameters = Rpc.wallet_sendPreparedCalls.Parameters
  export type ReturnType = Rpc.wallet_sendPreparedCalls.Response
}

export async function upgradeAccount(
  client: Client,
  parameters: upgradeAccount.Parameters,
): Promise<upgradeAccount.ReturnType> {
  const { authorization, context, signature } = parameters
  try {
    const result = await client.request({
      method: 'wallet_upgradeAccount',
      params: [
        Value.Encode(Rpc.wallet_upgradeAccount.Parameters, {
          authorization,
          context,
          signature,
        }),
      ],
    })
    return Value.Parse(Rpc.wallet_upgradeAccount.Response, result)
  } catch (error) {
    throw getError(error)
  }
}

export namespace upgradeAccount {
  export type Parameters = Rpc.wallet_upgradeAccount.Parameters
  export type ReturnType = Rpc.wallet_upgradeAccount.Response
}

function getError(error: unknown) {
  if (error instanceof TransformEncodeCheckError)
    return new SchemaCoderError(error)
  if (error instanceof AssertError) return new SchemaCoderError(error)
  return error
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
