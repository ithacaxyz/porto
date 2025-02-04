import * as AbiConstructor from 'ox/AbiConstructor'
import * as AbiError from 'ox/AbiError'
import * as AbiFunction from 'ox/AbiFunction'
import * as AbiParameters from 'ox/AbiParameters'
import type * as Address from 'ox/Address'
import * as Authorization from 'ox/Authorization'
import * as Errors from 'ox/Errors'
import * as Hex from 'ox/Hex'
import * as Signature from 'ox/Signature'
import * as TypedData from 'ox/TypedData'
import {
  type AbiStateMutability,
  type Account,
  BaseError,
  type Chain,
  type Client,
  type Log,
  type MulticallResults,
  type Narrow,
  type SendTransactionParameters,
  type Transport,
  zeroAddress,
} from 'viem'
import {
  type SimulateParameters,
  createAccessList,
  getEip712Domain as getEip712Domain_viem,
  readContract,
  sendTransaction,
  simulate as simulate_viem,
} from 'viem/actions'
import {
  type Authorization as Authorization_viem,
  prepareAuthorization,
} from 'viem/experimental'
import {
  type EncodeExecuteDataParameters,
  encodeExecuteData,
  getExecuteError as getExecuteError_viem,
} from 'viem/experimental/erc7821'

import * as DelegatedAccount from './account.js'
import * as Call from './call.js'
import { delegationAbi } from './generated.js'
import * as Key from './key.js'
import type { Mutable, OneOf } from './types.js'

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
  parameters: execute.Parameters<calls, account>,
): Promise<execute.ReturnType> {
  // Block expression to obtain the execution request and signatures.
  const { request, signatures } = await (async () => {
    const { account, nonce, key, signatures } = parameters

    // If an execution has been prepared, we can early return the request and signatures.
    if (nonce && signatures) return { request: parameters, signatures }

    // Otherwise, we need to prepare the execution (compute payloads and sign over them).
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
    throw getExecuteError(e as BaseError, { calls })
  }
}

export declare namespace execute {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
    account extends DelegatedAccount.Account = DelegatedAccount.Account,
  > = Pick<EncodeExecuteDataParameters<calls>, 'calls'> & {
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

  // Structure calls into EIP-7821 execution format.
  const calls = parameters.calls.map((call: any) => ({
    data: call.data ?? '0x',
    target: call.to === Call.self ? account.address : call.to,
    value: call.value ?? 0n,
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

  const multichain = nonce & 1n

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
        { name: 'multichain', type: 'bool' },
        { name: 'calls', type: 'Call[]' },
        { name: 'nonce', type: 'uint256' },
        { name: 'nonceSalt', type: 'uint256' },
      ],
    },
    message: {
      multichain: Boolean(multichain),
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
  parameters: prepareExecute.Parameters<calls, account>,
): Promise<prepareExecute.ReturnType<calls>> {
  const { account, delegation, executor, ...rest } = parameters

  const calls = parameters.calls.map((call: any) => ({
    data: call.data ?? '0x',
    to: call.to === Call.self ? account.address : call.to,
    value: call.value ?? 0n,
  }))

  let nonce = Hex.toBigInt(Hex.random(32))
  if (nonce & 1n) nonce += 1n // even nonce (no chain replay) // TODO: enable replay for `authorize` calls

  // Compute the signing payloads for execution and EIP-7702 authorization (optional).
  const [executePayload, [authorization, authorizationPayload]] =
    await Promise.all([
      getExecuteSignPayload(client, {
        account,
        calls,
        nonce,
      }),

      // Only need to compute an authorization payload if we are delegating to an EOA.
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
    account extends DelegatedAccount.Account = DelegatedAccount.Account,
  > = Pick<execute.Parameters<calls, account>, 'calls'> & {
    /**
     * The delegated account to execute the calls on.
     */
    account: account | DelegatedAccount.Account
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
    executor?: Account | undefined
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

/**
 * Simulates a set of calls.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Simulate parameters.
 * @returns Simulate results.
 */
export async function simulate<
  const calls extends readonly unknown[],
  chain extends Chain | undefined,
  account extends DelegatedAccount.Account,
>(
  client: Client<Transport, chain>,
  parameters: simulate.Parameters<calls>,
): Promise<simulate.ReturnType> {
  const { account, stateOverrides } = parameters

  // Derive bytecode to extract ETH balance via a contract call.
  const getBalanceData = AbiConstructor.encode(
    AbiConstructor.from('constructor(bytes, bytes)'),
    {
      bytecode: deploylessCallCode,
      args: [
        getBalanceCode,
        AbiFunction.encodeData(
          AbiFunction.from('function getBalance(address)'),
          [account.address],
        ),
      ],
    },
  )

  // Fetch ERC20 addresses that were "touched" from the calls.
  const erc20Addresses = await Promise.all(
    parameters.calls.map(async (call: any) => {
      if (!call.data && !call.abi) return
      const { accessList } = await createAccessList(client, {
        account: account.address,
        ...call,
        data: call.abi
          ? AbiFunction.encodeData(
              AbiFunction.fromAbi(call.abi, call.functionName),
              call.args,
            )
          : call.data,
      })
      return accessList.map(({ address, storageKeys }) =>
        storageKeys.length > 0 ? address : null,
      )
    }),
  ).then((x) => x.flat().filter(Boolean))

  const [
    block_ethPre,
    block_erc20Pre,
    block_results,
    block_ethPost,
    block_erc20Post,
    block_decimals,
    block_symbols,
  ] = await simulate_viem(client, {
    blocks: [
      // ETH pre balances
      {
        calls: [{ data: getBalanceData }],
        stateOverrides,
      },

      // ERC20 pre balances
      {
        calls: erc20Addresses.map((address, i) => ({
          abi: [
            AbiFunction.from('function balanceOf(address) returns (uint256)'),
          ],
          functionName: 'balanceOf',
          args: [account.address],
          to: address,
          from: zeroAddress,
          nonce: i,
        })),
        stateOverrides: [
          {
            address: zeroAddress,
            nonce: 0,
          },
        ],
      },

      // Perform calls
      {
        calls: [...parameters.calls, {}].map((call, i) => ({
          ...(call as any),
          from: account.address,
          nonce: i,
        })),
        stateOverrides: [
          {
            address: account.address,
            nonce: 0,
          },
        ],
      },

      // ETH post balances
      {
        calls: [{ data: getBalanceData }],
      },

      // ERC20 post balances
      {
        calls: erc20Addresses.map((address, i) => ({
          abi: [
            AbiFunction.from('function balanceOf(address) returns (uint256)'),
          ],
          functionName: 'balanceOf',
          args: [account.address],
          to: address,
          from: zeroAddress,
          nonce: i,
        })),
        stateOverrides: [
          {
            address: zeroAddress,
            nonce: 0,
          },
        ],
      },

      // ERC20 decimals
      {
        calls: erc20Addresses.map((address, i) => ({
          to: address,
          abi: [AbiFunction.from('function decimals() returns (uint256)')],
          functionName: 'decimals',
          from: zeroAddress,
          nonce: i,
        })),
        stateOverrides: [
          {
            address: zeroAddress,
            nonce: 0,
          },
        ],
      },

      // ERC20 symbols
      {
        calls: erc20Addresses.map((address, i) => ({
          to: address,
          abi: [AbiFunction.from('function symbol() returns (string)')],
          functionName: 'symbol',
          from: zeroAddress,
          nonce: i,
        })),
        stateOverrides: [
          {
            address: zeroAddress,
            nonce: 0,
          },
        ],
      },
    ],
  })

  // Extract call results from the simulation.
  const results = block_results?.calls.slice(0, -1) ?? []

  // Extract pre-execution ETH and ERC20 balances.
  const ethPre = block_ethPre?.calls ?? []
  const erc20Pre = block_erc20Pre?.calls ?? []
  const balancesPre = [...ethPre, ...erc20Pre].map((call) =>
    call.status === 'success' ? Hex.toBigInt(call.data) : null,
  )

  // Extract post-execution ETH and ERC20 balances.
  const ethPost = block_ethPost?.calls ?? []
  const erc20Post = block_erc20Post?.calls ?? []
  const balancesPost = [...ethPost, ...erc20Post].map((call) =>
    call.status === 'success' ? Hex.toBigInt(call.data) : null,
  )

  // Extract ERC20 symbols & decimals.
  const decimals = (block_decimals?.calls ?? []).map((x) =>
    x.status === 'success' ? x.result : null,
  ) as (number | null)[]
  const symbols = (block_symbols?.calls ?? []).map((x) =>
    x.status === 'success' ? x.result : null,
  ) as (string | null)[]

  const balances: Mutable<simulate.ReturnType['balances']> = []
  for (const [i, balancePost] of balancesPost.entries()) {
    const balancePre = balancesPre[i]

    if (typeof balancePost !== 'bigint') continue
    if (typeof balancePre !== 'bigint') continue

    const decimals_ = decimals[i - 1]
    const symbol_ = symbols[i - 1]

    const token = (() => {
      if (i === 0)
        return {
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' as const,
          decimals: 18,
          symbol: 'ETH',
        }
      if (!decimals_ || !symbol_)
        throw new BaseError('invalid decimals or symbol')
      return {
        address: erc20Addresses[i - 1]! as Address.Address,
        decimals: decimals_,
        symbol: symbol_,
      }
    })()

    if (balances.some((balance) => balance.token.address === token.address))
      continue

    balances.push({
      token,
      value: {
        pre: balancePre,
        post: balancePost,
        diff: balancePost - balancePre,
      },
    })
  }

  return { balances, results }
}

export declare namespace simulate {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
  > = Pick<EncodeExecuteDataParameters<calls>, 'calls'> & {
    /**
     * The delegated account to simulate the calls on.
     */
    account: DelegatedAccount.Account
    /**
     * State overrides.
     */
    stateOverrides?:
      | SimulateParameters['blocks'][number]['stateOverrides']
      | undefined
  }

  export type ReturnType<
    calls extends readonly unknown[] = readonly unknown[],
  > = {
    balances: readonly {
      token: {
        address: Address.Address
        decimals: number
        symbol: string
      }
      value: { pre: bigint; post: bigint; diff: bigint }
    }[]
    results: MulticallResults<
      Narrow<calls>,
      true,
      {
        extraProperties: {
          data: Hex.Hex
          gasUsed: bigint
          logs?: Log[] | undefined
        }
        error: Error
        mutability: AbiStateMutability
      }
    >
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

///////////////////////////////////////////////////////////////////////////
// Internal
///////////////////////////////////////////////////////////////////////////

export const getBalanceCode =
  '0x6080604052348015600e575f80fd5b5061016d8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063f8b2cb4f1461002d575b5f80fd5b610047600480360381019061004291906100db565b61005d565b604051610054919061011e565b60405180910390f35b5f8173ffffffffffffffffffffffffffffffffffffffff16319050919050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6100aa82610081565b9050919050565b6100ba816100a0565b81146100c4575f80fd5b50565b5f813590506100d5816100b1565b92915050565b5f602082840312156100f0576100ef61007d565b5b5f6100fd848285016100c7565b91505092915050565b5f819050919050565b61011881610106565b82525050565b5f6020820190506101315f83018461010f565b9291505056fea26469706673582212203b9fe929fe995c7cf9887f0bdba8a36dd78e8b73f149b17d2d9ad7cd09d2dc6264736f6c634300081a0033'

export const deploylessCallCode =
  '0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe'

function getExecuteError<const calls extends readonly unknown[]>(
  e: BaseError,
  { calls }: { calls: execute.Parameters<calls>['calls'] },
) {
  const getAbiError = (error: BaseError) => {
    const cause = error.walk((e) => 'data' in (e as BaseError))
    if (!cause) return undefined

    let data: Hex.Hex | undefined
    if (cause instanceof BaseError) {
      const [, match] = cause.details.match(/"(0x[0-9a-f]{8})"/) || []
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
      return AbiError.fromAbi(delegationAbi, data)
    } catch {
      return undefined
    }
  }
  const error = getExecuteError_viem(e as BaseError, { calls })
  return new ExecutionError(error, { abiError: getAbiError(error) })
}
