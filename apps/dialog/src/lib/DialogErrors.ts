import { type Address, type Hex, isHex } from 'viem'
import { errorSelectors } from './generated-error-selectors'

export type RuntimeError = {
  type: 'error'
  title: string
  message: string
  stack?: string
}

export type CallError = {
  type: 'call'
  title: string
  message: string
  callInfo?: {
    revertData?: string
    contractAddress?: string
    functionSelector?: string
    value?: string
    callIndex?: number
  }
}

export type RelayError = {
  type: 'relay'
  title: string
  message: string
  details?: string
}

export type DialogError = RuntimeError | CallError | RelayError

export type DialogErrorContext = {
  chainId?: number
  timestamp: string
  appVersion: string
  mode?: string
  referrer?: string
}

export function formatDialogError(
  data: DialogError,
  context: DialogErrorContext,
): string {
  return JSON.stringify({ ...data, context }, null, 2)
}

export function createRuntimeError(error: Error): RuntimeError {
  return {
    message: error.message || 'An unexpected error occurred.',
    stack: error.stack,
    title: 'Error found',
    type: 'error',
  }
}

const abiErrors = {
  CallError: 'Unable to execute this transaction.',
  ConfigAlreadySet: 'This configuration is already initialized.',
  DeadlineExpired: 'This transaction deadline has expired.',
  ExceededSpendLimit: 'Transaction exceeds the spending limit for this token.',
  FnSelectorNotRecognized:
    'The requested function is not recognized by this contract.',
  InsufficientAllowance: 'This transaction requires a token approval.',
  InsufficientGas:
    'Not enough gas to complete this transaction. Try increasing the gas limit.',
  InvalidKeyHash: 'The key hash does not match the expected value.',
  InvalidNonce: 'Invalid transaction nonce.',
  InvalidPreCallEOA: 'Invalid account address.',
  InvalidPublicKey: 'The provided public key format is invalid.',
  InvalidSignature: 'The signature for this transaction is invalid.',
  InvalidThreshold: 'The threshold configuration is invalid.',
  KeyDoesNotExist: 'The key used for this transaction does not exist.',
  KeyHashIsZero: 'Key hash must not be zero.',
  NoSpendPermissions: 'No spending permissions configured for this token.',
  OrderAlreadyFilled: 'This order has already been filled.',
  OwnerNotFound: 'The specified owner was not found.',
  Paused: 'This contract is currently paused.',
  PaymentError: 'Unable to process payment for this transaction.',
  PreCallError: 'Unable to execute prerequisite transaction step.',
  PreCallVerificationError: 'Unable to verify prerequisite transaction step.',
  Reentrancy: 'Reentrancy detected.',
  SimulateExecuteFailed:
    'Transaction simulation failed. Try providing more gas or check transaction parameters.',
  StateOverrideError: 'State override error.',
  Unauthorized: 'The account does not have permission to perform this action.',
  UnauthorizedCall: 'This key is not authorized to perform this action.',
  UnauthorizedCallContext:
    'This operation cannot be called from the current context.',
  UnsupportedAccountImplementation:
    'This account implementation is not supported.',
  UnsupportedExecutionMode: 'This execution mode is not supported.',
  VerificationError:
    'Unable to verify this transaction. The operation may be invalid.',
  VerifiedCallError: 'Unable to verify and execute this transaction.',
} as const

export function createRelayError(error: Error): RelayError {
  const err = error as any
  const errorMessage = err.details || err.message || ''

  return {
    message: errorMessage || 'An error occurred.',
    title: 'Relay error',
    type: 'relay',
  }
}

export async function createCallError(
  error: Error,
  calls?: readonly {
    to?: Address
    data?: Hex
    value?: bigint
  }[],
): Promise<CallError | RelayError> {
  const err = error as any

  const errorMessage = err.details || err.message || ''

  if (errorMessage && !err.abiError) return createRelayError(error)

  let abiErrorName = err.abiError?.name
  if (!abiErrorName) {
    const rawError = err.message || err.details || ''
    const selector = (typeof rawError === 'string' ? rawError : '')
      .toLowerCase()
      .slice(0, 10)
    if (isHex(selector))
      abiErrorName =
        errorSelectors[selector] || (await fetchErrorSignature(selector))
  }

  const title = abiErrorName || 'Simulation error'

  const message =
    (abiErrorName && abiErrors[abiErrorName as keyof typeof abiErrors]) ||
    abiErrorName ||
    err.message ||
    'Execution simulation failed.'

  const revertData =
    // code 3 = execution error
    err.cause?.code === 3 && isHex(err.cause?.data) ? err.cause.data : undefined

  const last = calls?.at(-1)

  return {
    callInfo: {
      callIndex: calls ? calls.length - 1 : undefined,
      contractAddress: last?.to,
      revertData,
      value: last?.value?.toString(),
    },
    message,
    title,
    type: 'call',
  }
}

async function fetchErrorSignature(selector: Hex): Promise<string | null> {
  if (fetchErrorSignature.cache.has(selector))
    return fetchErrorSignature.cache.get(selector) || null

  const errorName =
    (await fetchErrorSignature.openChain(selector)) ||
    (await fetchErrorSignature.fourByte(selector))

  if (errorName) fetchErrorSignature.cache.set(selector, errorName)
  return errorName
}

namespace fetchErrorSignature {
  export const cache = new Map<Hex, string>()

  const fetchOptions = { signal: AbortSignal.timeout(3000) }

  export async function openChain(selector: Hex): Promise<string | null> {
    try {
      const res = await fetch(
        `https://api.openchain.xyz/signature-database/v1/lookup?function=${selector}`,
        fetchOptions,
      )
      const { result } = await res.json()
      const [signature] = result.function[selector]
      return signature.name.split('(')[0] ?? null
    } catch {}
    return null
  }

  export async function fourByte(selector: Hex): Promise<string | null> {
    try {
      const res = await fetch(
        `https://www.4byte.directory/api/v1/signatures/?hex_signature=${selector}`,
        fetchOptions,
      )
      const { results } = await res.json()
      return results[0].text_signature.split('(')[0] ?? null
    } catch {}
    return null
  }
}
