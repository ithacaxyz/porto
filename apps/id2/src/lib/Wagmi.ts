import type { PortoConfig } from '@porto/apps'
import { Chains } from 'porto'
import { porto as portoConnector } from 'porto/wagmi'
import {
  cookieStorage,
  createConfig,
  createStorage,
  deserialize,
  serialize,
} from 'wagmi'
import * as Porto from './Porto.ts'

export type ChainId = PortoConfig.ChainId

export const config = createConfig({
  chains: Porto.config.chains,
  connectors: [portoConnector()],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  storage: createStorage({ deserialize, serialize, storage: cookieStorage }),
  transports: Porto.config.transports,
})

export const getChainConfig = (chainId: number) =>
  Porto.config.chains.find((chain) => chain.id === chainId)

export const mipdConfig = createConfig({
  chains: [Chains.base, Chains.baseSepolia],
  multiInjectedProviderDiscovery: true,
  storage: null,
  transports: {
    [Chains.base.id]: config._internal.transports[Chains.base.id],
    [Chains.baseSepolia.id]: config._internal.transports[Chains.baseSepolia.id],
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
