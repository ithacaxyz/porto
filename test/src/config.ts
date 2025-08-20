import { type Account, type Chains, Mode, Porto, Storage } from 'porto'
import { type HttpTransportConfig, http } from 'viem'
import { relayUrls } from '../../src/core/Transport.js'
import * as RelayActions from '../../src/viem/internal/relayActions.js'
import * as RelayClient from '../../src/viem/RelayClient.js'
import * as WalletClient from '../../src/viem/WalletClient.js'
import * as Contracts from './_generated/contracts.js'
import { getChains } from './chains.js'
import { poolId } from './prool.js'

const env = process.env.VITE_DEFAULT_ENV!
export const chains = getChains(env)

export function getPorto(
  parameters: {
    mode?: (parameters: { mock: boolean }) => Mode.Mode | undefined
    merchantRpcUrl?: string | undefined
    relayRpcUrl?: string | undefined
  } = {},
) {
  const {
    mode = Mode.relay,
    merchantRpcUrl,
    relayRpcUrl: overrideRelayRpcUrl = process.env.VITE_RELAY_URL,
  } = parameters

  const relayRpcUrl =
    overrideRelayRpcUrl ||
    relayUrls[env as keyof typeof relayUrls].http +
      (env === 'anvil' ? `/${poolId}` : '')

  return Porto.create({
    chains,
    feeToken: 'EXP',
    merchantRpcUrl,
    mode: mode({
      mock: true,
      multichain: env !== 'anvil',
    }),
    relay: http(
      relayRpcUrl,
      debugOptions({
        enabled: process.env.VITE_RPC_DEBUG === 'true',
        rpcUrl: relayRpcUrl,
      }),
    ),
    storage: Storage.memory(),
    transports: chains.reduce(
      (transports, chain) => {
        const rpcUrl = `${chain.rpcUrls.default.http[0]}${env === 'anvil' ? `/${poolId}` : ''}`
        return {
          // biome-ignore lint/performance/noAccumulatingSpread: _
          ...transports,
          [chain.id]: http(
            rpcUrl,
            debugOptions({
              enabled: process.env.VITE_RPC_DEBUG === 'true',
              rpcUrl,
            }),
          ),
        }
      },
      {} as Porto.Config['transports'],
    ),
  })
}

export function getRelayClient<
  const chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(porto: Porto.Porto<chains>, options: { chainId?: number | undefined } = {}) {
  const { chainId } = options
  return RelayClient.fromPorto(porto, { chainId }).extend(() => ({
    mode: 'anvil',
  }))
}

export function getWalletClient<
  const chains extends readonly [Chains.Chain, ...Chains.Chain[]],
  chain extends Chains.Chain | undefined = undefined,
  account extends Account.Account | undefined = undefined,
>(
  porto: Porto.Porto<chains>,
  config: WalletClient.fromPorto.Config<chain, account> = {},
) {
  return WalletClient.fromPorto(porto, config)
}

export async function getContracts<
  const chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(porto: Porto.Porto<chains>, options: { chainId?: number | undefined } = {}) {
  const { chainId = porto._internal.store.getState().chainIds[0] } = options

  const chain = chains.find((chain) => chain.id === chainId)
  if (!chain) throw new Error(`Chain not found: ${chainId}`)

  const client = getRelayClient(porto, { chainId })
  const { contracts } = await RelayActions.getCapabilities(client)

  return {
    ...contracts,
    exp1: {
      abi: Contracts.exp1Abi,
      address: Contracts.exp1Address[chain.id],
    },
    exp2: {
      abi: Contracts.exp2Abi,
      address: Contracts.exp2Address[chain.id],
    },
  } as const
}

function debugOptions({
  enabled,
  rpcUrl,
}: {
  enabled: boolean
  rpcUrl: string
}): HttpTransportConfig | undefined {
  if (!enabled) return undefined
  return {
    async onFetchRequest(_, init) {
      console.log(`curl \\
${rpcUrl} \\
-X POST \\
-H "Content-Type: application/json" \\
-d '${JSON.stringify(JSON.parse(init.body as string))}'`)
    },
    async onFetchResponse(response) {
      console.log('> ' + JSON.stringify(await response.clone().json()))
    },
  }
}
