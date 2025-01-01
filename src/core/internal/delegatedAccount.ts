import type * as Address from 'ox/Address'
import type { Account, Chain, Client, Transport } from 'viem'
import {
  type ExecuteParameters,
  type ExecuteReturnType,
  execute as execute_viem,
} from 'viem/experimental/erc7821'

import type * as Key from './key.js'

/** A delegated account. */
export type DelegatedAccount = {
  address: Address.Address
  keys: readonly Key.Key[]
  label?: string | undefined
}

/**
 * Executes a set of calls on a delegated account.
 *
 * @param client - Client.
 * @param parameters - Execution parameters.
 * @returns Transaction hash.
 */
export async function execute<
  const calls extends readonly unknown[],
  chain extends Chain | undefined,
>(
  client: Client<Transport, chain>,
  parameters: execute.Parameters<calls, chain>,
): Promise<execute.ReturnType> {
  const { account, executor, ...rest } = parameters
  try {
    return await execute_viem(client, {
      ...rest,
      address: account.address,
      account: typeof executor === 'undefined' ? account : executor,
    } as ExecuteParameters)
  } catch (error) {
    // biome-ignore lint/complexity/noUselessCatch: TODO: Handle contract errors
    throw error
  }
}

export declare namespace execute {
  export type Parameters<
    calls extends readonly unknown[] = readonly unknown[],
    chain extends Chain | undefined = Chain | undefined,
  > = Omit<
    ExecuteParameters<calls, chain>,
    'account' | 'address' | 'opData'
  > & {
    /**
     * The delegated account to execute the calls on.
     *
     * - `DelegatedAccount`: account that was instantiated with `Delegation.create` or `Delegation.from`.
     * - `Account`: Viem account that has delegated to Porto.
     */
    account: DelegatedAccount | Account
    /**
     * The executor of the execute transaction.
     *
     * - `Account`: execution will be attempted with the specified account.
     * - `null`: the transaction will be filled by the JSON-RPC server.
     * - `undefined`: execution will be attempted with the `account` value.
     */
    executor?: Account | undefined | null
    /**
     * The index of the key to use on the delegated account to sign the execution.
     */
    keyIndex?: number | undefined
  }

  export type ReturnType = ExecuteReturnType
}

/**
 * Instantiates a delegated account.
 *
 * @param account - Account to instantiate.
 * @returns An instantiated delegated account.
 */
export function from(account: DelegatedAccount): DelegatedAccount {
  return account
}
