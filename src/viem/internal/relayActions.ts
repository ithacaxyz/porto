/**
 * Actions for Porto Relay.
 *
 * @see https://porto.sh/relay
 */

import * as AbiError from 'ox/AbiError'
import * as AbiFunction from 'ox/AbiFunction'
import type * as Address from 'ox/Address'
import * as Errors from 'ox/Errors'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'
import * as Secp256k1 from 'ox/Secp256k1'
import * as Signature from 'ox/Signature'
import {
  BaseError,
  type Calls,
  type Chain,
  type Client,
  type Narrow,
  type Transport,
  type ValueOf,
  withCache,
} from 'viem'
import { verifyHash } from 'viem/actions'
import {
  type GetExecuteErrorReturnType,
  getExecuteError,
} from 'viem/experimental/erc7821'
import * as z from 'zod/mini'
import * as RpcSchema from '../../core/internal/relay/rpcSchema.js'
import * as u from '../../core/internal/schema/utils.js'
import type { IsUndefined, OneOf } from '../../core/internal/types.js'
import * as U from '../../core/internal/utils.js'
import type { sendCalls } from '../RelayActions.js'
import type { GetChainParameter } from './utils.js'

/**
 * Gets the authorization for a given address.
 *
 * @example
 * TODO
 *
 * @param client - The client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function getAuthorization(
  client: Client,
  parameters: getAuthorization.Parameters,
): Promise<getAuthorization.ReturnType> {
  try {
    const method = 'wallet_getAuthorization' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await withCache(
      () =>
        client.request<Schema>({
          method,
          params: [
            z.encode(RpcSchema.wallet_getAuthorization.Parameters, parameters),
          ],
        }),
      { cacheKey: `${client.uid}.${method}.${parameters.address}` },
    )
    return z.decode(RpcSchema.wallet_getAuthorization.Response, result)
  } catch (error) {
    parseSchemaError(error)
    throw error
  }
}

export namespace getAuthorization {
  export type Parameters = RpcSchema.wallet_getAuthorization.Parameters
  export type ReturnType = RpcSchema.wallet_getAuthorization.Response
}

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
  const chainIds extends 'all' | readonly number[] | undefined = undefined,
  const raw extends boolean = false,
>(
  client: Client<Transport>,
  options: getCapabilities.Options<chainIds, raw> = {},
): Promise<getCapabilities.ReturnType<chainIds, raw>> {
  const chainIds = (() => {
    if (options.chainId) return [options.chainId]
    if (options.chainIds === 'all') return undefined
    if (options.chainIds) return options.chainIds as readonly number[]
    return [client.chain!.id]
  })()

  try {
    const method = 'wallet_getCapabilities' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await withCache(
      () =>
        client.request<Schema>(
          {
            method,
            params: chainIds ? [chainIds] : undefined,
          },
          {
            retryCount: 0,
          },
        ),
      {
        cacheKey: `${client.uid}.${method}.${chainIds?.join(',')}`,
      },
    )
    const parsed = (() => {
      if (options.raw) return result as never
      return z.decode(RpcSchema.wallet_getCapabilities.Response, result)
    })()
    if (options.chainIds) return parsed as never
    return Object.values(parsed)[0]! as never
  } catch (error) {
    parseSchemaError(error)
    throw error
  }
}

export namespace getCapabilities {
  export type Options<
    chainIds extends 'all' | readonly number[] | undefined = undefined,
    raw extends boolean = false,
  > = {
    /**
     * Whether to return the raw, non-decoded response.
     * @default false
     */
    raw?: raw | boolean | undefined
  } & OneOf<
    | {
        /**
         * Chain IDs to get the capabilities for.
         * `"all"` will return the capabilities for all supported chains.
         */
        chainIds?: chainIds | 'all' | readonly number[] | undefined
      }
    | {
        /**
         * Chain ID to get the capabilities for.
         */
        chainId?: number | undefined
      }
  >

  export type ReturnType<
    chainIds extends 'all' | readonly number[] | undefined = undefined,
    raw extends boolean = false,
    //
    value = raw extends true
      ? z.input<typeof RpcSchema.wallet_getCapabilities.Response>
      : RpcSchema.wallet_getCapabilities.Response,
  > = IsUndefined<chainIds> extends true ? ValueOf<value> : value

  export type ErrorType = parseSchemaError.ErrorType | Errors.GlobalErrorType
}

/**
 * Get assets owned by user in given chain IDs.
 */
export async function getAssets(
  client: Client,
  parameters: getAssets.Parameters,
): Promise<getAssets.ReturnType> {
  const { account, assetFilter, assetTypeFilter, chainFilter } = parameters

  try {
    const method = 'wallet_getAssets' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>({
      method,
      params: [
        z.encode(RpcSchema.wallet_getAssets.Parameters, {
          account,
          assetFilter,
          assetTypeFilter,
          chainFilter,
        }),
      ],
    })

    const value = z.decode(RpcSchema.wallet_getAssets.Response, result)
    const decoded = Object.entries(value).reduce(
      (acc, [key, value]) => {
        acc[Hex.toNumber(key as `0x${string}`)] = value
        return acc
      },
      {} as Record<number, ValueOf<typeof value>>,
    )

    const aggregated = {} as Record<string, ValueOf<typeof decoded>[number]>
    for (const value of Object.values(decoded)) {
      for (const item of value) {
        const key = JSON.stringify(item.metadata)
        aggregated[key] = {
          ...item,
          balance: item.balance + (aggregated[key]?.balance ?? 0n),
        }
      }
    }

    return {
      ...decoded,
      '0': Object.values(aggregated),
    }
  } catch (error) {
    parseSchemaError(error)
    throw error
  }
}

export namespace getAssets {
  export type Parameters = RpcSchema.wallet_getAssets.Parameters
  export type ReturnType = RpcSchema.wallet_getAssets.Response
}

/**
 * Requests faucet funds to be sent to an address on the Relay.
 */
export async function addFaucetFunds<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: addFaucetFunds.Parameters<chain>,
): Promise<RpcSchema.wallet_addFaucetFunds.Response> {
  const { address, chain = client.chain, tokenAddress, value } = parameters
  try {
    const method = 'wallet_addFaucetFunds' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          z.encode(RpcSchema.wallet_addFaucetFunds.Parameters, {
            address,
            chainId: chain?.id!,
            tokenAddress,
            value,
          }),
        ],
      },
      {
        retryCount: 0,
      },
    )
    // relay state can be behind node state. wait to ensure sync.
    // TODO: figure out how to resolve.
    await new Promise((resolve) => setTimeout(resolve, 2_000))
    return result
  } catch (error) {
    parseSchemaError(error)
    throw error
  }
}

export namespace addFaucetFunds {
  export type Parameters<chain extends Chain | undefined = Chain | undefined> =
    Omit<RpcSchema.wallet_addFaucetFunds.Parameters, 'chainId'> &
      GetChainParameter<chain>
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
    return z.decode(RpcSchema.wallet_getCallsStatus.Response, result)
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
  const { address, chainIds } = parameters

  try {
    const method = 'wallet_getKeys' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>({
      method,
      params: [
        z.encode(RpcSchema.wallet_getKeys.Parameters, {
          address,
          chainIds,
        }),
      ],
    })
    return z.decode(RpcSchema.wallet_getKeys.Response, result)
  } catch (error) {
    parseSchemaError(error)
    throw error
  }
}

export namespace getKeys {
  export type Parameters = RpcSchema.wallet_getKeys.Parameters

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
    { cacheKey: `${client.uid}.${method}` },
  )
  return z.decode(RpcSchema.health.Response, result)
}

export namespace health {
  export type ReturnType = RpcSchema.health.Response

  export type ErrorType = Errors.GlobalErrorType
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
          z.encode(RpcSchema.wallet_prepareCalls.Parameters, {
            calls,
            capabilities: {
              ...capabilities,
              meta: {
                ...capabilities?.meta,
              },
            },
            chainId: chain?.id!,
            from: address,
            key: key
              ? {
                  prehash: key.prehash,
                  publicKey: key.publicKey,
                  type: key.type,
                }
              : undefined,
          }),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return Object.assign(
      z.decode(RpcSchema.wallet_prepareCalls.Response, result),
      { _raw: result },
    )
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
    capabilities?: RpcSchema.wallet_prepareCalls.Capabilities | undefined
    key: RpcSchema.wallet_prepareCalls.Parameters['key']
  } & GetChainParameter<chain>

  export type ReturnType = RpcSchema.wallet_prepareCalls.Response & {
    _raw: z.input<typeof RpcSchema.wallet_prepareCalls.Response>
  }

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
          z.encode(
            RpcSchema.wallet_prepareUpgradeAccount.Parameters,
            U.normalizeValue({
              address,
              capabilities,
              chainId: chain?.id,
              delegation,
            }),
          ),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return z.decode(RpcSchema.wallet_prepareUpgradeAccount.Response, result)
  } catch (error) {
    parseSchemaError(error)
    parseExecutionError(error)
    throw error
  }
}
export namespace prepareUpgradeAccount {
  export type Parameters<chain extends Chain | undefined = Chain | undefined> =
    RpcSchema.wallet_prepareUpgradeAccount.Parameters['capabilities'] &
      Omit<
        RpcSchema.wallet_prepareUpgradeAccount.Parameters,
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
          z.encode(RpcSchema.wallet_sendPreparedCalls.Parameters, {
            capabilities,
            context: {
              preCall: context.preCall,
              quote: context.quote,
            },
            key: key
              ? {
                  prehash: key.prehash,
                  publicKey: key.publicKey,
                  type: key.type,
                }
              : undefined,
            signature,
          }),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return z.decode(RpcSchema.wallet_sendPreparedCalls.Response, result)
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
 * NOTE: SHOULD ONLY BE USED ON SERVER.
 *
 * Gets onramp contact info for address.
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function getOnrampContactInfo(
  client: Client,
  parameters: getOnrampContactInfo.Parameters,
): Promise<getOnrampContactInfo.ReturnType> {
  const { address, secret } = parameters

  try {
    const method = 'account_getOnrampContactInfo' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          z.encode(RpcSchema.account_getOnrampContactInfo.Parameters, {
            address,
            secret,
          }),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return z.decode(RpcSchema.account_getOnrampContactInfo.Response, result)
  } catch (error) {
    parseSchemaError(error)
    parseExecutionError(error)
    throw error
  }
}

export namespace getOnrampContactInfo {
  export type Parameters = RpcSchema.account_getOnrampContactInfo.Parameters

  export type ReturnType = RpcSchema.account_getOnrampContactInfo.Response

  export type ErrorType =
    | parseSchemaError.ErrorType
    | parseExecutionError.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Gets onramp status for address
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function onrampStatus(
  client: Client,
  parameters: onrampStatus.Parameters,
): Promise<onrampStatus.ReturnType> {
  const { address } = parameters

  try {
    const method = 'account_onrampStatus' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          z.encode(RpcSchema.account_onrampStatus.Parameters, {
            address,
          }),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return z.decode(RpcSchema.account_onrampStatus.Response, result)
  } catch (error) {
    parseSchemaError(error)
    parseExecutionError(error)
    throw error
  }
}

export namespace onrampStatus {
  export type Parameters = RpcSchema.account_onrampStatus.Parameters

  export type ReturnType = RpcSchema.account_onrampStatus.Response

  export type ErrorType =
    | parseSchemaError.ErrorType
    | parseExecutionError.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Resends phone verification for address
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function resendVerifyPhone(
  client: Client,
  parameters: resendVerifyPhone.Parameters,
): Promise<resendVerifyPhone.ReturnType> {
  const { phone, walletAddress } = parameters

  try {
    const method = 'account_resendVerifyPhone' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          z.encode(RpcSchema.account_resendVerifyPhone.Parameters, {
            phone,
            walletAddress,
          }),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return z.decode(RpcSchema.account_resendVerifyPhone.Response, result)
  } catch (error) {
    parseSchemaError(error)
    parseExecutionError(error)
    throw error
  }
}

export namespace resendVerifyPhone {
  export type Parameters = RpcSchema.account_resendVerifyPhone.Parameters

  export type ReturnType = RpcSchema.account_resendVerifyPhone.Response

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
          z.encode(RpcSchema.account_setEmail.Parameters, {
            email,
            walletAddress,
          }),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return z.decode(RpcSchema.account_setEmail.Response, result)
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
 * Sets phone for address
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function setPhone(
  client: Client,
  parameters: setPhone.Parameters,
): Promise<setPhone.ReturnType> {
  const { phone, walletAddress } = parameters

  try {
    const method = 'account_setPhone' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          z.encode(RpcSchema.account_setPhone.Parameters, {
            phone,
            walletAddress,
          }),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return z.decode(RpcSchema.account_setPhone.Response, result)
  } catch (error) {
    parseSchemaError(error)
    parseExecutionError(error)
    throw error
  }
}

export namespace setPhone {
  export type Parameters = RpcSchema.account_setPhone.Parameters

  export type ReturnType = RpcSchema.account_setPhone.Response

  export type ErrorType =
    | parseSchemaError.ErrorType
    | parseExecutionError.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Submits an account upgrade to the Relay.
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
          z.encode(RpcSchema.wallet_upgradeAccount.Parameters, {
            context,
            signatures,
          }),
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
          z.encode(RpcSchema.account_verifyEmail.Parameters, {
            chainId,
            email,
            signature,
            token,
            walletAddress,
          }),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return z.decode(RpcSchema.account_verifyEmail.Response, result)
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
 * Verifies email for address
 *
 * @example
 * TODO
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Result.
 */
export async function verifyPhone(
  client: Client,
  parameters: verifyPhone.Parameters,
): Promise<verifyPhone.ReturnType> {
  const { code, phone, walletAddress } = parameters

  try {
    const method = 'account_verifyPhone' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await client.request<Schema>(
      {
        method,
        params: [
          z.encode(RpcSchema.account_verifyPhone.Parameters, {
            code,
            phone,
            walletAddress,
          }),
        ],
      },
      {
        retryCount: 0,
      },
    )
    return z.decode(RpcSchema.account_verifyPhone.Response, result)
  } catch (error) {
    parseSchemaError(error)
    parseExecutionError(error)
    throw error
  }
}

export namespace verifyPhone {
  export type Parameters = RpcSchema.account_verifyPhone.Parameters

  export type ReturnType = RpcSchema.account_verifyPhone.Response

  export type ErrorType =
    | parseSchemaError.ErrorType
    | parseExecutionError.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Verifies a prepare calls response.
 *
 * @param client - Client to use.
 * @param parameters - Parameters.
 * @returns Whether or not the response is valid.
 */
export async function verifyPrepareCallsResponse(
  client: Client,
  parameters: verifyPrepareCallsResponse.Parameters,
) {
  const { signature } = parameters
  const {
    signature: _,
    capabilities: { feeSignature: __, ...capabilities },
    ...response
  } = parameters.response

  const sorted = sortKeys({ capabilities, ...response })

  const payload = Hash.keccak256(Hex.fromString(JSON.stringify(sorted)))
  const address = Secp256k1.recoverAddress({
    payload,
    signature: Signature.fromHex(signature),
  })
  const { quoteSigner } = await health(client)
  return address === quoteSigner
}

export namespace verifyPrepareCallsResponse {
  export type Parameters = {
    response: z.input<typeof RpcSchema.wallet_prepareCalls.Response>
    signature: Hex.Hex
  }
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
    async function fallback() {
      const valid = await verifyHash(client, {
        address,
        hash: digest,
        signature,
      })
      return {
        proof: null,
        valid,
      }
    }

    const method = 'wallet_verifySignature' as const
    type Schema = Extract<RpcSchema.Viem[number], { Method: typeof method }>
    const result = await (async () => {
      const result = await client
        .request<Schema>(
          {
            method,
            params: [
              z.encode(RpcSchema.wallet_verifySignature.Parameters, {
                address,
                chainId: chain?.id!,
                digest,
                signature,
              }),
            ],
          },
          {
            retryCount: 0,
          },
        )
        .catch(fallback)
      if (result.valid) return result
      return fallback()
    })()
    return z.decode(RpcSchema.wallet_verifySignature.Response, result)
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

export function sortKeys<value>(value: value): value {
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) return value.map(sortKeys) as value
    const result = {} as Record<string, unknown>
    for (const key of Object.keys(value).sort())
      result[key] = sortKeys(value[key as keyof typeof value])
    return result as value
  }
  return value
}

export declare namespace parseExecutionError {
  export type ErrorType = ExecutionError | Errors.GlobalErrorType
}

/** Thrown when schema validation fails. */
export function parseSchemaError(e: unknown) {
  if ((e as any).name === '$ZodError') throw u.toValidationError(e)
}

export declare namespace parseSchemaError {
  type ErrorType = u.ValidationError | Errors.GlobalErrorType
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
