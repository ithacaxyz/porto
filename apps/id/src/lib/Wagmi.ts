import { PortoConfig } from '@porto/apps'
import { Mode, Storage } from 'porto'
import { porto } from 'porto/wagmi'
import { createConfig, createStorage } from 'wagmi'

const config = PortoConfig.getConfig()

export const wagmiConfig = createConfig({
  chains: config.chains,
  connectors: [
    porto({
      ...config,
      chains: config.chains,
      mode: Mode.dialog({
        host: PortoConfig.getDialogHost(),
      }),
      storage: Storage.combine(Storage.cookie(), Storage.localStorage()),
    }),
  ],
  multiInjectedProviderDiscovery: false,
  storage: createStorage({ storage: localStorage }),
  transports: config.transports,
})

export const mipdConfig = createConfig({
  chains: config.chains,
  multiInjectedProviderDiscovery: true,
  storage: null,
  transports: config.transports,
})

export const getChainConfig = (chainId: number) =>
  config.chains.find((c) => c.id === chainId)

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
