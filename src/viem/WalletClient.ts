import {
  type Address,
  type ClientConfig,
  createClient,
  custom,
  type JsonRpcAccount,
  type Transport,
  type Client as viem_Client,
} from 'viem'
import type * as Chains from '../core/Chains.js'
import type { Internal } from '../core/internal/porto.js'
import type * as Provider from '../core/internal/provider.js'
import type * as Account from './Account.js'
import type * as RpcSchema from './RpcSchema.js'

export type WalletClient<
  transport extends Transport = Transport,
  chain extends Chains.Chain | undefined = Chains.Chain | undefined,
  account extends Account.Account | Address | undefined =
    | Account.Account
    | Address
    | undefined,
> = viem_Client<
  transport,
  chain,
  account extends Address ? JsonRpcAccount<account> : account,
  RpcSchema.Wallet
>

const clientCache = new Map<string, any>()

/**
 * Extracts a Viem Client from a Porto instance.
 *
 * @param porto - Porto instance.
 * @returns Client.
 */
export function fromPorto<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
  chain extends Chains.Chain | undefined = undefined,
  account extends Account.Account | Address | undefined = undefined,
>(
  porto: {
    _internal: Internal<chains>
    provider: Provider.Provider
  },
  config: fromPorto.Config<chain, account> = {},
): WalletClient<Transport, chain, account> {
  const { provider } = porto
  const { id } = porto._internal

  const key = ['provider', id].filter(Boolean).join(':')
  if (clientCache.has(key)) return clientCache.get(key)!
  const client = createClient({
    ...config,
    pollingInterval: 1_000,
    transport: custom(provider),
  })
  clientCache.set(key, client)
  return client as never
}

export declare namespace fromPorto {
  type Config<
    chain extends Chains.Chain | undefined = Chains.Chain | undefined,
    account extends Account.Account | Address | undefined =
      | Account.Account
      | Address
      | undefined,
  > = Pick<
    ClientConfig<Transport, chain, account>,
    'account' | 'cacheTime' | 'chain' | 'key' | 'name' | 'pollingInterval'
  >
}
