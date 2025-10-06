import { type Address, type Hex, isHex } from 'viem'

export type RuntimeError = {
  type: 'error'
  title: string
  message: string
  stack?: string
}

export type ExecutionError = {
  type: 'execution'
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

export type DialogError = RuntimeError | ExecutionError

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

const abiErrors: Record<string, string> = {
  DeadlineExpired: 'This transaction deadline has expired.',
  InsufficientAllowance: 'This transaction requires a token approval.',
  InvalidSignature: 'The signature for this transaction is invalid.',
  Paused: 'This contract is currently paused.',
  Unauthorized: 'The account does not have permission to perform this action.',
}

export function createCallError(
  error: Error,
  calls?: readonly {
    to?: Address
    data?: Hex
    value?: bigint
  }[],
): ExecutionError {
  const err = error as any

  const abiErrorName = err.abiError?.name
  const title = abiErrorName || 'Simulation error'

  const message =
    (abiErrorName && abiErrors?.[abiErrorName]) ||
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
    type: 'execution',
  }
}
