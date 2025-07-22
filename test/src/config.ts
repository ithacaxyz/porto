<<<<<<< HEAD
import { type Chains, Mode, Porto, Storage } from 'porto'
import { http } from 'viem'
import * as ServerClient from '../../src/viem/ServerClient.js'
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
    rpcUrl?: string | undefined
  } = {},
) {
  const {
    mode = Mode.rpcServer,
    merchantRpcUrl,
    rpcUrl: overrideRpcUrl = process.env.VITE_RPC_URL,
  } = parameters

  return Porto.create({
    chains,
    feeToken: 'EXP',
    merchantRpcUrl,
    mode: mode({
      mock: true,
      multichain: env !== 'anvil',
    }),
    storage: Storage.memory(),
    transports: chains.reduce(
      (transports, chain) => {
        const rpcUrl =
          overrideRpcUrl ||
          `${chain.rpcUrls.default.http[0]}${env === 'anvil' ? `/${poolId}` : ''}`
||||||| parent of 39b82d78 (feat: relay v15 (#604))
=======
import { Chains, Mode, Porto, Storage } from 'porto'
import { http } from 'viem'
import * as ServerClient from '../../src/viem/ServerClient.js'
import * as WalletClient from '../../src/viem/WalletClient.js'
import * as Contracts from './_generated/contracts.js'
import * as Anvil from './anvil.js'
import { poolId } from './prool.js'

const envRpcUrl = process.env.VITE_RPC_URL

export const chains = (() => {
  if (Anvil.enabled)
    return [Chains.anvilParos, Chains.anvilTinos, Chains.anvilLeros] as const
  if (envRpcUrl?.includes('base-mainnet')) return [Chains.base] as const
  if (envRpcUrl?.includes('base-sepolia')) return [Chains.baseSepolia] as const
  return [
    Chains.portoDevParos,
    Chains.portoDevTinos,
    Chains.portoDevLeros,
  ] as const
})()
export type ChainId = (typeof chains)[number]['id']

export function getPorto(
  parameters: {
    mode?: (parameters: { mock: boolean }) => Mode.Mode | undefined
    merchantRpcUrl?: string | undefined
    rpcUrl?: string | undefined
  } = {},
) {
  const {
    mode = Mode.rpcServer,
    merchantRpcUrl,
    rpcUrl: overrideRpcUrl = envRpcUrl,
  } = parameters

  return Porto.create({
    chains,
    feeToken: 'EXP',
    merchantRpcUrl,
    mode: mode({
      mock: true,
    }),
    storage: Storage.memory(),
    transports: chains.reduce(
      (transports, chain) => {
        const rpcUrl =
          overrideRpcUrl || `${chain.rpcUrls.default.http[0]}/${poolId}`
>>>>>>> 39b82d78 (feat: relay v15 (#604))

        return {
          // biome-ignore lint/performance/noAccumulatingSpread: _
          ...transports,
          [chain.id]: http(rpcUrl, {
            async onFetchRequest(_, init) {
              if (process.env.VITE_RPC_DEBUG !== 'true') return
              console.log(`curl \\
  ${rpcUrl} \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(JSON.parse(init.body as string))}'`)
            },
            async onFetchResponse(response) {
              if (process.env.VITE_RPC_DEBUG !== 'true') return
              console.log('> ' + JSON.stringify(await response.clone().json()))
            },
          }),
        }
      },
      {} as Porto.Config['transports'],
    ),
  })
}

export function getServerClient<
  const chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(porto: Porto.Porto<chains>, options: { chainId?: number | undefined } = {}) {
  const { chainId } = options
  return ServerClient.fromPorto(porto, { chainId }).extend(() => ({
    mode: 'anvil',
  }))
}

export function getWalletClient<
  const chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(porto: Porto.Porto<chains>) {
  return WalletClient.fromPorto(porto)
}

export function getContracts<
  const chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(porto: Porto.Porto<chains>, options: { chainId?: number | undefined } = {}) {
  const { chainId = porto._internal.store.getState().chainId } = options

  const chain = chains.find((chain) => chain.id === chainId)
  if (!chain) throw new Error(`Chain not found: ${chainId}`)

  return {
    delegation: {
      address: chain.contracts!.portoAccount!.address,
    },
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
