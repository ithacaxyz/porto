/**
 * Actions for Porto RPC Server.
 *
 * @see https://porto.sh/rpc-server
 */

import { AssertError, TransformEncodeCheckError } from '@sinclair/typebox/value'
import * as AbiError from 'ox/AbiError'
import * as AbiFunction from 'ox/AbiFunction'
import type * as Address from 'ox/Address'
import * as Errors from 'ox/Errors'
import type * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import {
  BaseError,
  type Calls,
  type Chain,
  type Client,
  type GetChainParameter,
  type Narrow,
  type Transport,
  type ValueOf,
  withCache,
} from 'viem'
import {
  type GetExecuteErrorReturnType,
  getExecuteError,
} from 'viem/experimental/erc7821'
import * as RpcSchema from '../../core/internal/rpcServer/rpcSchema.js'
import type * as Typebox from '../../core/internal/typebox/typebox.js'
import { Value } from '../../core/internal/typebox/typebox.js'
import * as U from '../../core/internal/utils.js'
import type { sendCalls } from '../ServerActions.js'

/**
 * Gets the capabilities for a given chain ID.
 *
 * @example
 * TODO
 *
 * @param client - The client to use.
 * @param options - Options.
 * @returns Result.
 */
export async function getCapabilities<
  const chainIds extends readonly number[] | undefined = undefined,
  const raw extends boolean = false,
>(
  client: Client,
  options: getCapabilities.Options<chainIds, raw> = {},
): Promise<getCapabilities.ReturnType<chainIds, raw>> {
  const { chainIds = [client.chain!.id] } = options
  try {
    const method = 'wallet_getCapabilities' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await withCache(
      () =>
        client.request<Schema>({
          method,
          params: [chainIds],
        }),
      { cacheKey: method },
    )
    const parsed = (() => {
      if (options.raw) return result as never
      return Value.Parse(
        RpcSchema.wallet_getCapabilities.Response,
        result,
      ) as never
    })()
    if (options.chainIds) return parsed
    return Object.values(parsed)[0]! as never
  } catch (error) {
    parseSchemaError(error)
    throw error
  }
}

export namespace getCapabilities {
  export type Options<
    chainIds extends readonly number[] | undefined = undefined,
    raw extends boolean = false,
  > = {
    /**
     * Chain IDs to get capabilities for.
     * @default [client.chain.id]
     */
    chainIds?: chainIds | readonly number[] | undefined
    /**
     * Whether to return the raw, non-decoded response.
     * @default false
     */
    raw?: raw | boolean | undefined
  }

  export type ReturnType<
    chainIds extends readonly number[] | undefined = undefined,
    raw extends boolean = false,
    //
    value = raw extends true
      ? Typebox.Static<typeof RpcSchema.wallet_getCapabilities.Response>
      : RpcSchema.wallet_getCapabilities.Response,
  > = chainIds extends undefined ? ValueOf<value> : value

  export type ErrorType = parseSchemaError.ErrorType | Errors.GlobalErrorType
}

/**
 * Gets the status of a call bundle.
 *
 * @example
 * TODO
 *
 * @param client - The client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function getCallsStatus(
  client: Client,
  parameters: getCallsStatus.Parameters,
): Promise<getCallsStatus.ReturnType> {
  const { id } = parameters
  try {
    const method = 'wallet_getCallsStatus' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>({
      method,
      params: [id],
    })
    return Value.Parse(
      RpcSchema.wallet_getCallsStatus.Response,
      result satisfies Typebox.StaticEncode<
        typeof RpcSchema.wallet_getCallsStatus.Response
      >,
    )
  } catch (error) {
    parseSchemaError(error)
    throw error
  }
}

export namespace getCallsStatus {
  export type Parameters = {
    id: Hex.Hex
  }

  export type ReturnType = RpcSchema.wallet_getCallsStatus.Response

  export type ErrorType = parseSchemaError.ErrorType | Errors.GlobalErrorType
}

/**
 * Gets the keys for a given account.
 *
 * @example
 * TODO
 *
 * @param client - The client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function getKeys<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getKeys.Parameters<chain>,
): Promise<getKeys.ReturnType> {
  const { address, chain = client.chain } = parameters
  try {
    const method = 'wallet_getKeys' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>({
      method,
      params: [
        Value.Encode(RpcSchema.wallet_getKeys.Parameters, {
          address,
          chain_id: chain?.id,
        }),
      ],
    })
    return Value.Parse(RpcSchema.wallet_getKeys.Response, result)
  } catch (error) {
    parseSchemaError(error)
    throw error
  }
}

export namespace getKeys {
  export type Parameters<chain extends Chain | undefined = Chain | undefined> =
    Omit<RpcSchema.wallet_getKeys.Parameters, 'chain_id'> &
      GetChainParameter<chain>

  export type ReturnType = RpcSchema.wallet_getKeys.Response

  export type ErrorType = parseSchemaError.ErrorType | Errors.GlobalErrorType
}

/**
 * Gets the health of the RPC.
 *
 * @example
 * TODO
 *
 * @param client - The client to use.
 * @returns Result.
 */
export async function health(client: Client): Promise<health.ReturnType> {
  const method = 'health' as const
  type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
  const result = await withCache(
    () =>
      client.request<Schema>({
        method,
      }),
    { cacheKey: method },
  )
  return Value.Parse(RpcSchema.health.Response, result)
}

export namespace health {
  export type ReturnType = RpcSchema.health.Response

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
export async function prepareCalls<
  const calls extends readonly unknown[],
  chain extends Chain | undefined,
>(
  client: Client<Transport, chain>,
  parameters: prepareCalls.Parameters<calls, chain>,
): Promise<prepareCalls.ReturnType> {
  const { address, capabilities, chain = client.chain, key } = parameters

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
    const method = 'wallet_prepareCalls' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          Value.Encode(RpcSchema.wallet_prepareCalls.Parameters, {
            calls,
            capabilities,
            chainId: chain?.id!,
            from: address,
            key: key
              ? {
                  prehash: key.prehash,
                  publicKey: key.publicKey,
                  type: key.type,
                }
              : undefined,
          } satisfies RpcSchema.wallet_prepareCalls.Parameters),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return Value.Parse(RpcSchema.wallet_prepareCalls.Response, result)
  } catch (error) {
    parseSchemaError(error)
    parseExecutionError(error, { calls: parameters.calls })
    throw error
  }
}

export namespace prepareCalls {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
    chain extends Chain | undefined = Chain | undefined,
  > = {
    address?: Address.Address | undefined
    calls: Calls<Narrow<calls>>
    capabilities: RpcSchema.wallet_prepareCalls.Capabilities
    key: RpcSchema.wallet_prepareCalls.Parameters['key']
  } & GetChainParameter<chain>

  export type ReturnType = RpcSchema.wallet_prepareCalls.Response

  export type ErrorType =
    | parseSchemaError.ErrorType
    | parseExecutionError.ErrorType
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
export async function prepareUpgradeAccount<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: prepareUpgradeAccount.Parameters<chain>,
): Promise<prepareUpgradeAccount.ReturnType> {
  const {
    address,
    chain = client.chain,
    delegation,
    ...capabilities
  } = parameters

  try {
    const method = 'wallet_prepareUpgradeAccount' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          Value.Encode(
            RpcSchema.wallet_prepareUpgradeAccount.Parameters,
            Value.Clean(
              RpcSchema.wallet_prepareUpgradeAccount.Parameters,
              U.normalizeValue({
                address,
                capabilities,
                chainId: chain?.id,
                delegation,
              } satisfies RpcSchema.wallet_prepareUpgradeAccount.Parameters),
            ),
          ),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return Value.Parse(RpcSchema.wallet_prepareUpgradeAccount.Response, result)
  } catch (error) {
    parseSchemaError(error)
    parseExecutionError(error)
    throw error
  }
}
export namespace prepareUpgradeAccount {
  export type Parameters<chain extends Chain | undefined = Chain | undefined> =
    Typebox.StaticDecode<
      typeof RpcSchema.wallet_prepareUpgradeAccount.Parameters.properties.capabilities
    > &
      Omit<
        Typebox.StaticDecode<
          typeof RpcSchema.wallet_prepareUpgradeAccount.Parameters
        >,
        'capabilities' | 'chainId'
      > &
      GetChainParameter<chain>

  export type ReturnType = RpcSchema.wallet_prepareUpgradeAccount.Response

  export type ErrorType =
    | parseSchemaError.ErrorType
    | parseExecutionError.ErrorType
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
  const { capabilities, context, key, signature } = parameters
  try {
    const method = 'wallet_sendPreparedCalls' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          Value.Encode(RpcSchema.wallet_sendPreparedCalls.Parameters, {
            capabilities,
            context: {
              preCall: context.preCall,
              quote: context.quote,
            },
            key: {
              prehash: key.prehash,
              publicKey: key.publicKey,
              type: key.type,
            },
            signature,
          } satisfies RpcSchema.wallet_sendPreparedCalls.Parameters),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return Value.Parse(RpcSchema.wallet_sendPreparedCalls.Response, result)
  } catch (error) {
    parseSchemaError(error)
    parseExecutionError(error)
    throw error
  }
}

export namespace sendPreparedCalls {
  export type Parameters = RpcSchema.wallet_sendPreparedCalls.Parameters

  export type ReturnType = RpcSchema.wallet_sendPreparedCalls.Response

  export type ErrorType =
    | parseSchemaError.ErrorType
    | parseExecutionError.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Sets email for address
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function setEmail(
  client: Client,
  parameters: setEmail.Parameters,
): Promise<setEmail.ReturnType> {
  const { email, walletAddress } = parameters

  try {
    const method = 'account_setEmail' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          Value.Encode(
            RpcSchema.account_setEmail.Parameters,
            Value.Clean(RpcSchema.account_setEmail.Parameters, {
              email,
              walletAddress,
            } satisfies RpcSchema.account_setEmail.Parameters),
          ),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return Value.Parse(RpcSchema.account_setEmail.Response, result)
  } catch (error) {
    parseSchemaError(error)
    parseExecutionError(error)
    throw error
  }
}

export namespace setEmail {
  export type Parameters = RpcSchema.account_setEmail.Parameters

  export type ReturnType = RpcSchema.account_setEmail.Response

  export type ErrorType =
    | parseSchemaError.ErrorType
    | parseExecutionError.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Submits an account upgrade to the RPC Server.
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

  try {
    const method = 'wallet_upgradeAccount' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    await client.request<Schema>(
      {
        method,
        params: [
          Value.Encode(
            RpcSchema.wallet_upgradeAccount.Parameters,
            Value.Clean(RpcSchema.wallet_upgradeAccount.Parameters, {
              context,
              signatures,
            } satisfies RpcSchema.wallet_upgradeAccount.Parameters),
          ),
        ],
      },
      {
        retryCount: 0,
      },
    )
  } catch (error) {
    parseSchemaError(error)
    parseExecutionError(error)
    throw error
  }
}

export namespace upgradeAccount {
  export type Parameters = RpcSchema.wallet_upgradeAccount.Parameters

  export type ReturnType = RpcSchema.wallet_upgradeAccount.Response

  export type ErrorType =
    | parseSchemaError.ErrorType
    | parseExecutionError.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Verifies email for address
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function verifyEmail(
  client: Client,
  parameters: verifyEmail.Parameters,
): Promise<verifyEmail.ReturnType> {
  const { chainId, email, signature, token, walletAddress } = parameters

  try {
    const method = 'account_verifyEmail' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          Value.Encode(
            RpcSchema.account_verifyEmail.Parameters,
            Value.Clean(RpcSchema.account_verifyEmail.Parameters, {
              chainId,
              email,
              signature,
              token,
              walletAddress,
            } satisfies RpcSchema.account_verifyEmail.Parameters),
          ),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return Value.Parse(RpcSchema.account_verifyEmail.Response, result)
  } catch (error) {
    parseSchemaError(error)
    parseExecutionError(error)
    throw error
  }
}

export namespace verifyEmail {
  export type Parameters = RpcSchema.account_verifyEmail.Parameters

  export type ReturnType = RpcSchema.account_verifyEmail.Response

  export type ErrorType =
    | parseSchemaError.ErrorType
    | parseExecutionError.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Verifies a signature.
 *
 * @example
 * TODO
 *
 * @param client - The client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function verifySignature<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: verifySignature.Parameters<chain>,
): Promise<verifySignature.ReturnType> {
  const { address, chain = client.chain, digest, signature } = parameters
  try {
    const method = 'wallet_verifySignature' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          Value.Encode(RpcSchema.wallet_verifySignature.Parameters, {
            address,
            chainId: chain?.id,
            digest,
            signature,
          } as RpcSchema.wallet_verifySignature.Parameters),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return Value.Parse(RpcSchema.wallet_verifySignature.Response, result)
  } catch (error) {
    parseSchemaError(error)
    throw error
  }
}

export namespace verifySignature {
  export type Parameters<chain extends Chain | undefined = Chain | undefined> =
    Omit<
      RpcSchema.wallet_verifySignature.Parameters,
      'chainId' | 'keyIdOrAddress'
    > & {
      address: Address.Address
    } & GetChainParameter<chain>

  export type ReturnType = RpcSchema.wallet_verifySignature.Response

  export type ErrorType = parseSchemaError.ErrorType | Errors.GlobalErrorType
}

export function parseExecutionError<const calls extends readonly unknown[]>(
  e: unknown,
  { calls }: { calls?: sendCalls.Parameters<calls>['calls'] | undefined } = {},
) {
  if (!(e instanceof BaseError)) return

  const getAbiError = (error: GetExecuteErrorReturnType) => {
    try {
      if (error.name === 'ContractFunctionExecutionError') {
        const data =
          error.cause.name === 'ContractFunctionRevertedError'
            ? error.cause.data
            : undefined
        if (data)
          return AbiError.fromAbi(
            [data.abiItem],
            data.errorName,
          ) as AbiError.AbiError
      }

      const cause = error.walk(
        (e) =>
          !(e instanceof Error) &&
          (e as { code?: number | undefined }).code === 3,
      ) as (BaseError & { code: number; data: Hex.Hex }) | undefined
      if (!cause) return undefined

      const { data, message } = cause
      if (data === '0xd0d5039b') return AbiError.from('error Unauthorized()')
      return {
        inputs: [],
        name: (message ?? data).split('(')[0]!,
        type: 'error',
      } satisfies AbiError.AbiError
    } catch {
      return undefined
    }
  }
  const error = getExecuteError(e as BaseError, {
    calls: (calls ?? []) as any,
  })
  const abiError = getAbiError(error)
  if (error === e && !abiError) return
  throw new ExecutionError(Object.assign(error, { abiError }))
}

export declare namespace parseExecutionError {
  export type ErrorType = ExecutionError | Errors.GlobalErrorType
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

/** Thrown when the execution fails. */
export class ExecutionError extends Errors.BaseError<BaseError> {
  override readonly name = 'Rpc.ExecutionError'

  abiError?: AbiError.AbiError | undefined

  constructor(cause: BaseError & { abiError?: AbiError.AbiError | undefined }) {
    super('An error occurred while executing calls.', {
      cause,
      metaMessages: [cause.abiError && 'Reason: ' + cause.abiError.name].filter(
        Boolean,
      ),
    })

    this.abiError = cause.abiError
  }
}

export class SchemaCoderError extends Errors.BaseError<
  AssertError | TransformEncodeCheckError
> {
  override readonly name = 'Rpc.SchemaCoderError'

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
