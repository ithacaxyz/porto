import * as AbiError from 'ox/AbiError'
import * as AbiParameters from 'ox/AbiParameters'
import type * as Address from 'ox/Address'
import * as Authorization from 'ox/Authorization'
import * as Errors from 'ox/Errors'
import * as Hex from 'ox/Hex'
import * as Signature from 'ox/Signature'
import * as TypedData from 'ox/TypedData'
import {
  type Account as Account_viem,
  type Authorization as Authorization_viem,
  BaseError,
  type Chain,
  type Client,
  encodeFunctionData,
  parseAbi,
  type SendTransactionParameters,
  type Transport,
} from 'viem'
import {
  call,
  getEip712Domain as getEip712Domain_viem,
  prepareAuthorization,
  readContract,
  sendTransaction,
} from 'viem/actions'
import {
  type EncodeExecuteDataParameters,
  encodeExecuteData,
  getExecuteError as getExecuteError_viem,
} from 'viem/experimental/erc7821'
import * as Account from '../Account.js'
import * as Key from '../Key.js'
import type * as Storage from '../Storage.js'
import * as PortoAccount from './_generated/contracts/PortoAccount.js'
import * as Call from './call.js'
import type { OneOf } from './types.js'

export { abi, code } from './_generated/contracts/PortoAccount.js'

/**
 * Executes a set of calls on a delegated account.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Execution parameters.
 * @returns Transaction hash.
 */
export async function execute<
  const calls extends readonly unknown[],
  chain extends Chain | undefined,
  account extends Account.Account,
>(
  client: Client<Transport, chain>,
  parameters: execute.Parameters<calls, account>,
): Promise<execute.ReturnType> {
  // Block expression to obtain the execution request and signatures.
  const { request, signatures } = await (async () => {
    const { account, nonce, key, signatures, storage } = parameters

    // If an execution has been prepared, we can early return the request and signatures.
    if (nonce && signatures) return { request: parameters, signatures }

    // Otherwise, we need to prepare the execution (compute payloads and sign over them).
    const { request, signPayloads: payloads } = await prepareExecute(
      client,
      parameters,
    )

    const [executePayload, authorizationPayload] = payloads as [
      Hex.Hex,
      Hex.Hex | undefined,
    ]

    const executionSignature = await Account.sign(account, {
      key: authorizationPayload ? null : key,
      payload: executePayload,
      storage,
    })
    const authorizationSignature = authorizationPayload
      ? await account.sign?.({
          payload: authorizationPayload,
        })
      : undefined

    return {
      request,
      signatures: authorizationSignature
        ? [executionSignature, authorizationSignature]
        : [executionSignature],
    }
  })()

  const { account, authorization, calls, executor, nonce } = request

  const [executeSignature, authorizationSignature] =
    (signatures as [Hex.Hex, Hex.Hex]) || []

  // If an authorization signature is provided, it means that we will need to designate
  // the EOA to the delegation contract. We will need to construct an authorization list
  // to do so.
  const authorizationList = (() => {
    if (!authorizationSignature) return undefined
    const signature = Signature.from(authorizationSignature)
    return [
      {
        ...authorization,
        r: Hex.fromNumber(signature.r),
        s: Hex.fromNumber(signature.s),
        yParity: signature.yParity,
      },
    ]
  })()

  // Structure the operation data to be passed to EIP-7821 execution.
  // The operation data contains the nonce of the execution, as well as the
  // signature.
  const opData = AbiParameters.encodePacked(
    ['uint256', 'bytes'],
    [nonce, executeSignature],
  )

  try {
    return await sendTransaction(client, {
      account: typeof executor === 'undefined' ? null : executor,
      authorizationList,
      data: encodeExecuteData({ calls, opData }),
      to: account.address,
    } as SendTransactionParameters)
  } catch (e) {
    parseExecutionError(e, { calls })
    throw e
  }
}

export declare namespace execute {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
    account extends Account.Account = Account.Account,
  > = Pick<EncodeExecuteDataParameters<calls>, 'calls'> & {
    /**
     * The delegated account to execute the calls on.
     */
    account: account | Account.Account
    /**
     * Contract address to delegate to.
     */
    delegation?: account extends {
      sign: NonNullable<Account.Account['sign']>
    }
      ? Address.Address | undefined
      : undefined
    /**
     * The executor of the execute transaction.
     *
     * - `Account`: execution will be attempted with the specified account.
     * - `undefined`: the transaction will be filled by the JSON-RPC server.
     */
    executor?: Account_viem | undefined
    /**
     * Storage to use for keytype-specific caching (e.g. WebAuthn user verification).
     */
    storage?: Storage.Storage | undefined
  } & OneOf<
      | {
          /**
           * EIP-7702 Authorization to use for delegation.
           */
          authorization?: Authorization_viem | undefined
          /**
           * Nonce to use for execution that will be invalidated by the delegated account.
           */
          nonce: bigint
          /**
           * Signature for execution. Required if the `executor` is not the EOA.
           */
          signatures: readonly Hex.Hex[]
        }
      | {
          /**
           * Key to use for execution.
           */
          key?: number | Key.Key | undefined
        }
      | {}
    >

  export type ReturnType = Hex.Hex
}

/**
 * Returns the EIP-712 domain for a delegated account. Used for the execution
 * signing payload.
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns EIP-712 domain.
 */
export async function getEip712Domain<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getEip712Domain.Parameters,
): Promise<TypedData.Domain> {
  const account = Account.from(parameters.account)

  const {
    domain: { name, version },
  } = await getEip712Domain_viem(client, {
    address: account.address,
  })

  if (!client.chain) throw new Error('client.chain is required')
  return {
    chainId: client.chain.id,
    name,
    verifyingContract: account.address,
    version,
  }
}

export declare namespace getEip712Domain {
  export type Parameters = {
    /**
     * The delegated account to get the EIP-712 domain for.
     */
    account: Account.Account | Address.Address
  }
}

/**
 * Returns the key at the given index.
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Key.
 */
export async function keyAt<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: keyAt.Parameters,
) {
  const { index } = parameters

  const account = Account.from(parameters.account)

  const key = await readContract(client, {
    abi: PortoAccount.abi,
    address: account.address,
    args: [BigInt(index)],
    functionName: 'keyAt',
  })

  return Key.deserialize(key)
}

export declare namespace keyAt {
  export type Parameters = {
    /**
     * The delegated account to extract the key from.
     */
    account: Account.Account | Address.Address
    /**
     * Index of the key to extract.
     */
    index: number
  }
}

/**
 * Prepares the payloads to sign over and fills the request to execute a set of calls.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Prepared properties.
 */
export async function prepareExecute<
  const calls extends readonly unknown[],
  chain extends Chain | undefined,
  account extends Account.Account,
>(
  client: Client<Transport, chain>,
  parameters: prepareExecute.Parameters<calls, account>,
): Promise<prepareExecute.ReturnType<calls>> {
  const { account, delegation, executor, ...rest } = parameters

  const calls = parameters.calls.map((call: any) => ({
    data: call.data ?? '0x',
    to: call.to === Call.selfAddress ? account.address : call.to,
    value: call.value ?? 0n,
  }))

  const nonce = Hex.toBigInt(
    Hex.concat(
      // multichain flag (0 = single chain, 0xc1d0 = multi-chain) // TODO: enable multi-chain
      Hex.fromNumber(0, { size: 2 }),
      // sequence key
      Hex.random(22),
      // sequential nonce
      Hex.fromNumber(0, { size: 8 }),
    ),
  )

  // Compute the signing payloads for execution and EIP-7702 authorization (optional).
  const [executePayload, [authorization, authorizationPayload]] =
    await Promise.all([
      getExecuteSignPayload(client, {
        account,
        calls,
        delegation,
        nonce,
      }),

      // Only need to compute an authorization payload if we are delegating to an EOA.
      (async () => {
        if (!delegation) return []

        const authorization = await prepareAuthorization(client, {
          account: account.address,
          // chainId: 0,
          contractAddress: delegation,
          executor,
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

  return {
    request: {
      ...rest,
      account,
      authorization,
      calls,
      executor,
      nonce,
    },
    signPayloads: [
      executePayload,
      ...(authorizationPayload ? [authorizationPayload] : []),
    ],
  } as never
}

export declare namespace prepareExecute {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
    account extends Account.Account = Account.Account,
  > = Pick<execute.Parameters<calls, account>, 'calls'> & {
    /**
     * The delegated account to execute the calls on.
     */
    account: account | Account.Account
    /**
     * Contract address to delegate to.
     */
    delegation?: Address.Address | undefined
    /**
     * The executor of the execute transaction.
     *
     * - `Account`: execution will be attempted with the specified account.
     * - `undefined`: the transaction will be filled by the JSON-RPC server.
     */
    executor?: Account_viem | undefined
  }

  export type ReturnType<
    calls extends readonly unknown[] = readonly unknown[],
  > = {
    request: Omit<Parameters<calls>, 'delegation'> & {
      authorization?: Authorization_viem | undefined
      nonce: bigint
    }
    signPayloads:
      | [executePayload: Hex.Hex]
      | [executePayload: Hex.Hex, authorizationPayload: Hex.Hex]
  }
}

export function parseExecutionError<const calls extends readonly unknown[]>(
  e: unknown,
  { calls }: { calls?: execute.Parameters<calls>['calls'] | undefined } = {},
) {
  if (!(e instanceof BaseError)) return

  const getAbiError = (error: BaseError) => {
    const cause = error.walk((e) => 'data' in (e as BaseError))
    if (!cause) return undefined

    let data: Hex.Hex | undefined
    if (cause instanceof BaseError) {
      const [, match] = cause.details?.match(/"(0x[0-9a-f]{8})"/) || []
      if (match) data = match as Hex.Hex
    }

    if (!data) {
      if (!('data' in cause)) return undefined
      if (cause.data instanceof BaseError) return getAbiError(cause.data)
      if (typeof cause.data !== 'string') return undefined
      if (cause.data === '0x') return undefined
      data = cause.data as Hex.Hex
    }

    try {
      if (data === '0xd0d5039b') return AbiError.from('error Unauthorized()')
      return AbiError.fromAbi(
        [...PortoAccount.abi, AbiError.from('error CallError()')],
        data,
      )
    } catch {
      return undefined
    }
  }
  const error = getExecuteError_viem(e as BaseError, {
    calls: (calls ?? []) as any,
  })
  const abiError = getAbiError(error)
  if (error === e && !abiError) return
  throw new ExecutionError(Object.assign(error, { abiError }))
}

export declare namespace parseExecutionError {
  export type ErrorType = ExecutionError | Errors.GlobalErrorType
}

/** Thrown when the execution fails. */
export class ExecutionError extends Errors.BaseError<BaseError> {
  override readonly name = 'AccountContract.ExecutionError'

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

///////////////////////////////////////////////////////////////////////////
// Internal
///////////////////////////////////////////////////////////////////////////

/** @internal */
async function getExecuteSignPayload<
  const calls extends readonly unknown[],
  chain extends Chain | undefined,
>(
  client: Client<Transport, chain>,
  parameters: getExecuteSignPayload.Parameters<calls>,
): Promise<Hex.Hex> {
  const { account, delegation, nonce } = parameters

  // Structure calls into EIP-7821 execution format.
  const calls = parameters.calls.map((call: any) => ({
    data: call.data ?? '0x',
    to: call.to === Call.selfAddress ? account.address : call.to,
    value: call.value ?? 0n,
  }))

  const address = await (async () => {
    if (!delegation) return account.address
    const { data } = await call(client, {
      data: encodeFunctionData({
        abi: parseAbi(['function implementation() view returns (address)']),
        functionName: 'implementation',
      }),
      to: delegation!,
    } as never).catch(() => ({ data: undefined }))
    if (!data) throw new Error('delegation address not found.')
    return Hex.slice(data, 12)
  })()

  const domain = await getEip712Domain(client, { account: address })

  const multichain = nonce & 1n

  if (!client.chain) throw new Error('chain is required.')
  return TypedData.getSignPayload({
    domain: {
      chainId: client.chain.id,
      name: domain.name,
      verifyingContract: account.address,
      version: domain.version,
    },
    message: {
      calls,
      multichain: Boolean(multichain),
      nonce,
    },
    primaryType: 'Execute',
    types: {
      Call: [
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
      ],
      Execute: [
        { name: 'multichain', type: 'bool' },
        { name: 'calls', type: 'Call[]' },
        { name: 'nonce', type: 'uint256' },
      ],
    },
  })
}

export declare namespace getExecuteSignPayload {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
  > = {
    /**
     * The delegated account to execute the calls on.
     */
    account: Account.Account
    /**
     * Contract address to delegate to.
     */
    delegation?: Address.Address | undefined
    /**
     * Calls to execute.
     */
    calls: calls
    /**
     * Nonce to use for execution that will be invalidated by the delegated account.
     */
    nonce: bigint
    /**
     * Nonce salt.
     */
    nonceSalt?: bigint | undefined
  }
}
