import { porto as portoConnector } from 'porto/wagmi'
import { createConfig, createStorage } from 'wagmi'
import * as Porto from './Porto'

export const config = createConfig({
  chains: Porto.config.chains,
  connectors: [portoConnector(Porto.config)],
  multiInjectedProviderDiscovery: false,
  storage: createStorage({ storage: localStorage }),
  transports: Porto.config.transports,
})

export const mipdConfig = createConfig({
  chains: Porto.config.chains,
  multiInjectedProviderDiscovery: true,
  storage: null,
  transports: config._internal.transports,
})

// export const client = getWalletClient(config)
export const getChainConfig = (chainId: number) =>
  config.chains.find((c) => c.id === chainId)

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
