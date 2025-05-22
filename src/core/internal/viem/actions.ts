/**
 * Viem Actions for JSON-RPC methods.
 *
 * @see https://github.com/ithacaxyz/relay/blob/main/src/rpc.rs
 */

import { AssertError, TransformEncodeCheckError } from '@sinclair/typebox/value'
import * as AbiError from 'ox/AbiError'
import * as AbiFunction from 'ox/AbiFunction'
import type * as Address from 'ox/Address'
import * as Authorization from 'ox/Authorization'
import * as Errors from 'ox/Errors'
import * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import * as Signature from 'ox/Signature'
import {
  type Authorization as Authorization_viem,
  BaseError,
  type Calls,
  type Chain,
  type Client,
  type Narrow,
  withCache,
} from 'viem'
import { prepareAuthorization } from 'viem/actions'
import {
  type GetExecuteErrorReturnType,
  getExecuteError,
} from 'viem/experimental/erc7821'
import type { sendCalls } from '../../RpcServer.js'
import * as RpcSchema from '../rpcServer/rpcSchema.js'
import * as Typebox from '../typebox/typebox.js'
import { Value } from '../typebox/typebox.js'

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
  const { context, signatures } = parameters
  try {
    const method = 'wallet_createAccount' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    await client.request<Schema>(
      {
        method,
        params: [
          Value.Encode(RpcSchema.wallet_createAccount.Parameters, {
            context: {
              account: context.account,
              chainId: context.chainId,
            },
            signatures,
          } satisfies RpcSchema.wallet_createAccount.Parameters),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return undefined
  } catch (error) {
    parseSchemaError(error)
    throw error
  }
}

export namespace createAccount {
  export type Parameters = RpcSchema.wallet_createAccount.Parameters

  export type ReturnType = RpcSchema.wallet_createAccount.Response

  export type ErrorType = parseSchemaError.ErrorType | Errors.GlobalErrorType
}

/**
 * Gets the accounts for a given key identifier.
 *
 * @example
 * TODO
 *
 * @param client - The client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function getAccounts(
  client: Client,
  parameters: getAccounts.Parameters,
): Promise<getAccounts.ReturnType> {
  const { chain = client.chain, keyId: id } = parameters
  try {
    const method = 'wallet_getAccounts' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>({
      method,
      params: [
        Value.Encode(RpcSchema.wallet_getAccounts.Parameters, {
          chainId: chain?.id,
          id,
        }),
      ],
    })
    return Value.Parse(RpcSchema.wallet_getAccounts.Response, result)
  } catch (error) {
    parseSchemaError(error)
    throw error
  }
}

export namespace getAccounts {
  export type Parameters = {
    chain?: Chain | undefined
    keyId: Hex.Hex
  }

  export type ReturnType = RpcSchema.wallet_getAccounts.Response

  export type ErrorType = parseSchemaError.ErrorType | Errors.GlobalErrorType
}

export async function getCapabilities<const raw extends boolean = false>(
  client: Client,
  options: getCapabilities.Options<raw> = {},
): Promise<getCapabilities.ReturnType<raw>> {
  try {
    const method = 'wallet_getCapabilities' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await withCache(
      () =>
        client.request<Schema>({
          method,
        }),
      { cacheKey: method },
    )
    if (options.raw) return result as never
    return Value.Parse(
      RpcSchema.wallet_getCapabilities.Response,
      result,
    ) as never
  } catch (error) {
    parseSchemaError(error)
    throw error
  }
}

export namespace getCapabilities {
  export type Options<raw extends boolean = false> = {
    /**
     * Whether to return the raw, non-decoded response.
     * @default false
     */
    raw?: raw | boolean | undefined
  }

  export type ReturnType<raw extends boolean = false> = raw extends true
    ? Typebox.Static<typeof RpcSchema.wallet_getCapabilities.Response>
    : RpcSchema.wallet_getCapabilities.Response

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
export async function getKeys(
  client: Client,
  parameters: getKeys.Parameters,
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
  export type Parameters = Omit<
    RpcSchema.wallet_getKeys.Parameters,
    'chain_id'
  > & {
    chain?: Chain | undefined
  }

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
  const method = 'relay_health' as const
  type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
  const result = await withCache(
    () =>
      client.request<Schema>({
        method,
      }),
    { cacheKey: method },
  )
  return Value.Parse(RpcSchema.relay_health.Response, result)
}

export namespace health {
  export type ReturnType = RpcSchema.relay_health.Response

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
            chainId: chain!.id,
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
  > = {
    address?: Address.Address | undefined
    calls: Calls<Narrow<calls>>
    capabilities: RpcSchema.wallet_prepareCalls.Capabilities
    chain?: Chain | undefined
    key: RpcSchema.wallet_prepareCalls.Parameters['key']
  }

  export type ReturnType = RpcSchema.wallet_prepareCalls.Response

  export type ErrorType =
    | parseSchemaError.ErrorType
    | parseExecutionError.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Prepares a new account creation.
 *
 * @example
 * TODO
 *
 * @param client - The client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function prepareCreateAccount(
  client: Client,
  parameters: prepareCreateAccount.Parameters,
): Promise<prepareCreateAccount.ReturnType> {
  const { capabilities, chain = client.chain } = parameters
  try {
    const method = 'wallet_prepareCreateAccount' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          Value.Encode(RpcSchema.wallet_prepareCreateAccount.Parameters, {
            capabilities,
            chainId: chain?.id,
          }),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return Value.Parse(RpcSchema.wallet_prepareCreateAccount.Response, result)
  } catch (error) {
    parseSchemaError(error)
    throw error
  }
}

export namespace prepareCreateAccount {
  export type Parameters = Omit<
    RpcSchema.wallet_prepareCreateAccount.Parameters,
    'chainId'
  > & {
    chain?: Chain | undefined
  }

  export type ReturnType = RpcSchema.wallet_prepareCreateAccount.Response

  export type ErrorType = parseSchemaError.ErrorType | Errors.GlobalErrorType
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
  const { address, capabilities, chain = client.chain } = parameters

  try {
    const method = 'wallet_prepareUpgradeAccount' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const [result, [authorization, authorizationDigest]] = await Promise.all([
      client.request<Schema>(
        {
          method,
          params: [
            Value.Encode(RpcSchema.wallet_prepareUpgradeAccount.Parameters, {
              address,
              capabilities,
              chainId: chain?.id,
            }),
          ],
        },
        {
          retryCount: 0,
        },
      ),
      (async () => {
        const authorization = await prepareAuthorization(client, {
          account: address,
          chainId: 0,
          contractAddress: capabilities.delegation,
        })
        return [
          authorization,
          Authorization.getSignPayload({
            address: authorization.address,
            chainId: authorization.chainId,
            nonce: BigInt(authorization.nonce),
          }),
        ]
      })(),
    ])
    const parsed = Value.Parse(
      RpcSchema.wallet_prepareUpgradeAccount.Response,
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
    parseExecutionError(error)
    throw error
  }
}
export namespace prepareUpgradeAccount {
  export type Parameters = {
    address: Address.Address
    capabilities: RpcSchema.wallet_prepareUpgradeAccount.Capabilities
    chain?: Chain | undefined
  }

  export type ReturnType = Omit<
    RpcSchema.wallet_prepareUpgradeAccount.Response,
    'context' | 'digest'
  > & {
    context: RpcSchema.wallet_prepareUpgradeAccount.Response['context'] & {
      authorization: Authorization_viem
    }
    digests: [execute: Hex.Hex, auth: Hex.Hex]
  }

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
    const { address, chainId, nonce } = context.authorization
    const signature = Signature.from(signatures[1]!)
    return {
      address,
      chainId,
      nonce,
      r: Hex.fromNumber(signature.r),
      s: Hex.fromNumber(signature.s),
      yParity: signature.yParity,
    } as const
  })()

  try {
    const method = 'wallet_upgradeAccount' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          Value.Encode(RpcSchema.wallet_upgradeAccount.Parameters, {
            authorization,
            context: {
              preCall: context.preCall,
              quote: context.quote,
            },
            signature: signatures[0]!,
          } satisfies RpcSchema.wallet_upgradeAccount.Parameters),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return Value.Parse(RpcSchema.wallet_upgradeAccount.Response, result)
  } catch (error) {
    parseSchemaError(error)
    parseExecutionError(error)
    throw error
  }
}

export namespace upgradeAccount {
  export type Parameters = {
    context: RpcSchema.wallet_upgradeAccount.Parameters['context'] & {
      authorization: Authorization_viem<number, false>
    }
    signatures: readonly Hex.Hex[]
  }

  export type ReturnType = RpcSchema.wallet_upgradeAccount.Response

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
export async function verifySignature(
  client: Client,
  parameters: verifySignature.Parameters,
): Promise<verifySignature.ReturnType> {
  const { address, chainId = client.chain?.id, digest, signature } = parameters
  try {
    const method = 'wallet_verifySignature' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          Value.Encode(RpcSchema.wallet_verifySignature.Parameters, {
            chainId,
            digest,
            keyIdOrAddress: address,
            signature,
          }),
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
  export type Parameters = Omit<
    RpcSchema.wallet_verifySignature.Parameters,
    'chainId' | 'keyIdOrAddress'
  > & {
    address: Address.Address
    chainId?: number | undefined
  }

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
