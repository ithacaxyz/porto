import { PortoConfig } from '@porto/apps'
import { createConfig, createStorage, injected, Transport } from 'wagmi'
import { porto } from './Porto'

export const config = createConfig({
  chains: porto._internal.config.chains,
  connectors: [
    injected({
      target: () => ({
        id: 'porto',
        name: 'Porto',
        provider: porto.provider as never,
      }),
    }),
  ],
  multiInjectedProviderDiscovery: false,
  storage: createStorage({ storage: localStorage }),
  transports: Object.entries(porto._internal.config.transports).reduce(
    (transports, [chainId, transport]) => ({
      // biome-ignore lint/performance/noAccumulatingSpread:
      ...transports,
      [chainId]: 'default' in transport ? transport.default : transport,
    }),
    {} as Record<PortoConfig.ChainId, Transport>,
  ),
})

export const mipdConfig = createConfig({
  chains: config.chains,
  storage: null,
  transports: config._internal.transports,
})

export const getChainConfig = (chainId: PortoConfig.ChainId) =>
  config.chains.find((c) => c.id === chainId)

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
