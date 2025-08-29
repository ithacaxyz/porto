import { Chains } from 'porto'
import { porto as portoConnector } from 'porto/wagmi'
import type { Chain } from 'viem'
import { createConfig, createStorage } from 'wagmi'
import { create } from 'zustand'
import * as Porto from './Porto'

// A chains store that we can update in special cases (eg. in recovery)
export const useChainsStore = create<{
  chains: readonly [Chain, ...Chain[]]
  addChain: (chain: Chain) => void
  removeChain: (chain: Chain) => void
  setChains: (chains: Chain[]) => void
}>()((set) => ({
  addChain: (chain: Chain) =>
    set((state) => ({ chains: [...state.chains, chain] })),
  chains: Porto.config.chains,
  removeChain: (chain: Chain) =>
    set((state) => ({
      chains: state.chains.filter((c) => c.id !== chain.id) as never,
    })),
  setChains: (chains: Chain[]) => set({ chains: chains as never }),
}))

export const config = createConfig({
  chains: useChainsStore.getState().chains,
  connectors: [portoConnector(Porto.config)],
  multiInjectedProviderDiscovery: false,
  storage: createStorage({ storage: localStorage }),
  transports: Porto.config.transports,
})

export const mipdConfig = createConfig({
  chains: [Chains.base, Chains.baseSepolia],
  multiInjectedProviderDiscovery: true,
  storage: null,
  transports: {
    [Chains.base.id]: config._internal.transports[Chains.base.id],
    [Chains.baseSepolia.id]: config._internal.transports[Chains.baseSepolia.id],
  },
})

export const getChainConfig = (chainId: number) =>
  config.chains.find((c) => c.id === chainId)

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
