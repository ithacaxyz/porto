import { custom, type PublicRpcSchema, type Transport } from 'viem'
import { createClient, type Client as viem_Client } from 'viem'
import type * as Chains from '../core/Chains.js'
import type { Internal } from '../core/internal/porto.js'
import type * as Provider from '../core/internal/provider.js'
import type { Account } from './Account.js'
import type * as RpcSchema from './RpcSchema.js'

export type WalletClient<
  transport extends Transport = Transport,
  chain extends Chains.Chain = Chains.Chain,
  account extends Account | undefined = Account | undefined,
> = viem_Client<
  transport,
  chain,
  account,
  [...PublicRpcSchema, ...RpcSchema.Wallet]
>

const clientCache = new Map<string, any>()
/**
 * Extracts a Viem Client from a Porto EIP-1193 Provider instance.
 *
 * @param porto - Porto instance.
 * @returns Client.
 */
export function fromPorto<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(porto: {
  _internal: Internal<chains>
  provider: Provider.Provider
}): WalletClient<Transport, chains[number]> {
  const { provider } = porto
  const { id } = porto._internal

  const key = ['provider', id].filter(Boolean).join(':')
  if (clientCache.has(key)) return clientCache.get(key)!
  const client = createClient({
    pollingInterval: 1_000,
    transport: custom(provider),
  })
  clientCache.set(key, client)
  return client as never
}
