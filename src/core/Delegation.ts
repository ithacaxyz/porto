import * as AbiConstructor from 'ox/AbiConstructor'
import * as AbiFunction from 'ox/AbiFunction'
import type * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import * as Value from 'ox/Value'
import {
  type AbiStateMutability,
  BaseError,
  type Chain,
  type Client,
  type Log,
  type MulticallResults,
  type Narrow,
  type Transport,
  zeroAddress,
} from 'viem'
import {
  type SimulateParameters,
  createAccessList,
  simulate as simulate_viem,
} from 'viem/actions'
import type { EncodeExecuteDataParameters } from 'viem/experimental/erc7821'

import * as DelegatedAccount from './internal/account.js'
import type { Mutable } from './internal/types.js'

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
>(
  client: Client<Transport, chain>,
  parameters: simulate.Parameters<calls>,
): Promise<simulate.ReturnType<calls>> {
  const { stateOverrides } = parameters

  const account = DelegatedAccount.from(parameters.account)

  const balance_tmp = Value.fromEther('99999999')

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
        stateOverrides: [
          ...(stateOverrides ?? []),
          {
            address: zeroAddress,
            balance: balance_tmp,
            nonce: 0,
          },
        ],
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
        blockOverrides: {
          baseFeePerGas: 0n,
        },
        calls: [...parameters.calls, {}].map((call, i) => ({
          ...(call as any),
          from: account.address,
          nonce: i,
        })),
        stateOverrides: [
          {
            address: account.address,
            balance: balance_tmp,
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
  const balancesPre = [...ethPre, ...erc20Pre].map((call, index) =>
    call.status === 'success'
      ? Hex.toBigInt(call.data) + (index === 0 ? balance_tmp : 0n)
      : null,
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
        decimals: Number(decimals_),
        symbol: symbol_,
      }
    })()

    if (balances.some((balance) => balance.token.address === token.address))
      continue

    let diff = balancePost - balancePre
    const diff_abs = diff < 0n ? -diff : diff
    // TODO: this is a temporary. we will remove this & execute
    // via 7702 to get more accurate result
    if (
      token.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' &&
      diff_abs >= 0 &&
      diff_abs < Value.fromEther('0.000001')
    )
      diff = 0n

    balances.push({
      token,
      value: {
        pre: balancePre,
        post: balancePost,
        diff,
      },
    })
  }

  return { balances, results: results as never }
}

export declare namespace simulate {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
  > = Pick<EncodeExecuteDataParameters<calls>, 'calls'> & {
    /**
     * The delegated account to simulate the calls on.
     */
    account: DelegatedAccount.Account | Address.Address
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

export const getBalanceCode =
  '0x6080604052348015600e575f80fd5b5061016d8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063f8b2cb4f1461002d575b5f80fd5b610047600480360381019061004291906100db565b61005d565b604051610054919061011e565b60405180910390f35b5f8173ffffffffffffffffffffffffffffffffffffffff16319050919050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6100aa82610081565b9050919050565b6100ba816100a0565b81146100c4575f80fd5b50565b5f813590506100d5816100b1565b92915050565b5f602082840312156100f0576100ef61007d565b5b5f6100fd848285016100c7565b91505092915050565b5f819050919050565b61011881610106565b82525050565b5f6020820190506101315f83018461010f565b9291505056fea26469706673582212203b9fe929fe995c7cf9887f0bdba8a36dd78e8b73f149b17d2d9ad7cd09d2dc6264736f6c634300081a0033'

export const deploylessCallCode =
  '0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe'
