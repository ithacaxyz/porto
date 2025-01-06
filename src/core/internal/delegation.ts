import * as AbiError from 'ox/AbiError'
import * as AbiParameters from 'ox/AbiParameters'
import type * as Address from 'ox/Address'
import * as Authorization from 'ox/Authorization'
import * as Errors from 'ox/Errors'
import * as Hex from 'ox/Hex'
import * as Signature from 'ox/Signature'
import * as TypedData from 'ox/TypedData'
import type { Account, BaseError, Chain, Client, Transport } from 'viem'
import {
  getEip712Domain as getEip712Domain_viem,
  readContract,
} from 'viem/actions'
import {
  type Authorization as Authorization_viem,
  prepareAuthorization,
} from 'viem/experimental'
import {
  type ExecuteParameters,
  type ExecuteReturnType,
  execute as execute_viem,
} from 'viem/experimental/erc7821'

import * as DelegatedAccount from './account.js'
import * as Call from './call.js'
import { delegationAbi } from './generated.js'
import * as Key from './key.js'
import type { OneOf } from './types.js'

export const domainNameAndVersion = {
  name: 'Delegation',
  version: '0.0.1',
} as const

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
  account extends DelegatedAccount.Account,
>(
  client: Client<Transport, chain>,
  parameters: execute.Parameters<calls, chain, account>,
): Promise<execute.ReturnType> {
  const { request, signatures } = await (async () => {
    const { account, nonce, key, signatures } = parameters

    if (nonce && signatures) return { request: parameters, signatures }

    const { request, signPayloads: payloads } = await prepareExecute(
      client,
      parameters,
    )
    return {
      request,
      signatures: await DelegatedAccount.sign(account, {
        key,
        payloads: payloads as any,
      }),
    }
  })()

  const { account, authorization, executor, nonce, ...rest } = request

  const [executeSignature, authorizationSignature] =
    (signatures as [Hex.Hex, Hex.Hex]) || []

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

  const opData = AbiParameters.encodePacked(
    ['uint256', 'bytes'],
    [nonce, executeSignature],
  )

  try {
    return await execute_viem(client, {
      ...rest,
      address: account.address,
      account: typeof executor === 'undefined' ? null : executor,
      authorizationList,
      opData,
    } as ExecuteParameters)
  } catch (e) {
    const error = e as BaseError
    const abiError = (() => {
      const cause = error.walk((e) => 'data' in (e as BaseError))
      if (!cause) return undefined
      if (!('data' in cause)) return undefined
      if (cause.data === '0x') return undefined
      return AbiError.fromAbi(delegationAbi, cause.data as Hex.Hex)
    })()
    throw new ExecutionError(error, { abiError })
  }
}

export declare namespace execute {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
    chain extends Chain | undefined = Chain | undefined,
    account extends DelegatedAccount.Account = DelegatedAccount.Account,
  > = Omit<
    ExecuteParameters<calls, chain>,
    'account' | 'address' | 'authorizationList' | 'opData'
  > & {
    /**
     * The delegated account to execute the calls on.
     */
    account: account | DelegatedAccount.Account
    /**
     * Contract address to delegate to.
     */
    delegation?: account extends {
      sign: NonNullable<DelegatedAccount.Account['sign']>
    }
      ? Address.Address | undefined
      : undefined
    /**
     * The executor of the execute transaction.
     *
     * - `Account`: execution will be attempted with the specified account.
     * - `undefined`: the transaction will be filled by the JSON-RPC server.
     */
    executor?: Account | undefined
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

  export type ReturnType = ExecuteReturnType
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
  account extends DelegatedAccount.Account,
>(
  client: Client<Transport, chain>,
  parameters: prepareExecute.Parameters<calls, chain, account>,
): Promise<prepareExecute.ReturnType<calls, chain>> {
  const {
    account,
    delegation,
    executor,
    nonce = Hex.toBigInt(Hex.random(32)),
    ...rest
  } = parameters

  const calls = parameters.calls.map((call: any) => ({
    ...call,
    to: call.to === Call.self ? account.address : call.to,
  }))

  const [[authorization, authorizationPayload], executePayload] =
    await Promise.all([
      (async () => {
        if (!delegation) return []

        const authorization = await prepareAuthorization(client, {
          account: account.address,
          contractAddress: delegation,
          delegate: !executor || executor,
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
      getExecuteSignPayload(client, {
        account,
        calls,
        nonce,
      }),
    ])

  return {
    signPayloads: [
      executePayload,
      ...(authorizationPayload ? [authorizationPayload] : []),
    ],
    request: {
      ...rest,
      account,
      authorization,
      calls,
      executor,
      nonce,
    },
  } as never
}

export declare namespace prepareExecute {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
    chain extends Chain | undefined = Chain | undefined,
    account extends DelegatedAccount.Account = DelegatedAccount.Account,
  > = Omit<
    ExecuteParameters<calls, chain>,
    'account' | 'address' | 'authorizationList' | 'opData'
  > & {
    /**
     * The delegated account to execute the calls on.
     */
    account: account | DelegatedAccount.Account
    /**
     * Contract address to delegate to.
     */
    delegation?: account extends {
      sign: NonNullable<DelegatedAccount.Account['sign']>
    }
      ? Address.Address | undefined
      : undefined
    /**
     * The executor of the execute transaction.
     *
     * - `Account`: execution will be attempted with the specified account.
     * - `undefined`: the transaction will be filled by the JSON-RPC server.
     */
    executor?: Account | undefined
    /**
     * Nonce to use for execution that will be invalidated by the delegated account.
     */
    nonce?: bigint | undefined
  }

  export type ReturnType<
    calls extends readonly unknown[] = readonly unknown[],
    chain extends Chain | undefined = Chain | undefined,
  > = {
    request: Parameters<calls, chain> & {
      authorization?: Authorization_viem | undefined
      nonce: bigint
    }
    signPayloads:
      | [executePayload: Hex.Hex]
      | [executePayload: Hex.Hex, authorizationPayload: Hex.Hex]
  }
}

/**
 * Returns the EIP-712 domain for a delegated account.
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns EIP-712 domain.
 */
export async function getEip712Domain<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getEip712Domain.Parameters,
): Promise<TypedData.Domain> {
  const { account } = parameters

  const {
    domain: { name, version },
  } = await getEip712Domain_viem(client, {
    address: account.address,
  }).catch(() => ({ domain: domainNameAndVersion }))

  if (!client.chain) throw new Error('client.chain is required')
  return {
    chainId: client.chain.id,
    name,
    version,
    verifyingContract: account.address,
  }
}

export declare namespace getEip712Domain {
  export type Parameters = {
    /**
     * The delegated account to get the EIP-712 domain for.
     */
    account: DelegatedAccount.Account
  }
}

/**
 * Computes the digest to sign in order to execute a set of calls on a delegated account.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Sign digest.
 */
export async function getExecuteSignPayload<
  const calls extends readonly unknown[],
  chain extends Chain | undefined,
>(
  client: Client<Transport, chain>,
  parameters: getExecuteSignPayload.Parameters<calls>,
): Promise<Hex.Hex> {
  const { account, nonce } = parameters

  const calls = parameters.calls.map((call: any) => ({
    value: call.value ?? 0n,
    target: call.to,
    data: call.data ?? '0x',
  }))

  const [nonceSalt, domain] = await Promise.all([
    parameters.nonceSalt ??
      (await readContract(client, {
        abi: delegationAbi,
        address: account.address,
        functionName: 'nonceSalt',
      }).catch(() => 0n)),
    getEip712Domain(client, { account }),
  ])

  if (!client.chain) throw new Error('chain is required.')
  return TypedData.getSignPayload({
    domain: {
      name: domain.name,
      chainId: client.chain.id,
      verifyingContract: account.address,
      version: domain.version,
    },
    types: {
      Call: [
        { name: 'target', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
      ],
      Execute: [
        { name: 'calls', type: 'Call[]' },
        { name: 'nonce', type: 'uint256' },
        { name: 'nonceSalt', type: 'uint256' },
      ],
    },
    message: {
      calls,
      nonce,
      nonceSalt,
    },
    primaryType: 'Execute',
  })
}

export declare namespace getExecuteSignPayload {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
  > = {
    /**
     * The delegated account to execute the calls on.
     */
    account: DelegatedAccount.Account
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

  const account = DelegatedAccount.from(parameters.account)

  const key = await readContract(client, {
    abi: delegationAbi,
    address: account.address,
    functionName: 'keyAt',
    args: [BigInt(index)],
  })

  return Key.deserialize(key)
}

export declare namespace keyAt {
  export type Parameters = {
    /**
     * The delegated account to extract the key from.
     */
    account: DelegatedAccount.Account | Address.Address
    /**
     * Index of the key to extract.
     */
    index: number
  }
}

/** Thrown when the execution fails. */
export class ExecutionError extends Errors.BaseError<BaseError> {
  override readonly name = 'Delegation.ExecutionError'

  abiError?: AbiError.AbiError | undefined

  constructor(
    cause: BaseError,
    { abiError }: { abiError?: AbiError.AbiError | undefined } = {},
  ) {
    super('An error occurred while executing calls.', {
      cause,
      metaMessages: [abiError && 'Reason: ' + abiError.name].filter(Boolean),
    })

    this.abiError = abiError
  }
}
