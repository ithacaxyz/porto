import { type Address, type Hex, isHex } from 'viem'

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
  DeadlineExpired: 'This transaction deadline has expired.',
  ExceededSpendLimit: 'Transaction exceeds the spending limit for this token.',
  FnSelectorNotRecognized:
    'The requested function is not recognized by this contract.',
  InsufficientAllowance: 'This transaction requires a token approval.',
  InsufficientGas:
    'Not enough gas to complete this transaction. Try increasing the gas limit.',
  InvalidSignature: 'The signature for this transaction is invalid.',
  KeyDoesNotExist: 'The key used for this transaction does not exist.',
  NoSpendPermissions: 'No spending permissions configured for this token.',
  Paused: 'This contract is currently paused.',
  PaymentError: 'Unable to process payment for this transaction.',
  PreCallError: 'Unable to execute prerequisite transaction step.',
  PreCallVerificationError: 'Unable to verify prerequisite transaction step.',
  SimulateExecuteFailed:
    'Transaction simulation failed. Try providing more gas or check transaction parameters.',
  Unauthorized: 'The account does not have permission to perform this action.',
  UnauthorizedCall: 'This key is not authorized to perform this action.',
  UnauthorizedCallContext:
    'This operation cannot be called from the current context.',
  UnsupportedAccountImplementation:
    'This account implementation is not supported.',
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

export function createCallError(
  error: Error,
  calls?: readonly {
    to?: Address
    data?: Hex
    value?: bigint
  }[],
): CallError | RelayError {
  const err = error as any

  const errorMessage = err.details || err.message || ''

  if (errorMessage && !err.abiError) return createRelayError(error)

  const abiErrorName = err.abiError?.name
  const title = abiErrorName || 'Simulation error'

  const message =
    (abiErrorName && abiErrors[abiErrorName as keyof typeof abiErrors]) ||
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
