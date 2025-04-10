import { PortoConfig } from '@porto/apps'
import { createConfig, createStorage, injected, type Transport } from 'wagmi'
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
    (acc, [key, value]) => ({
      ...(acc as any),
      [key]: 'default' in value ? value.default : value,
    }),
    {} as Record<PortoConfig.ChainId, Transport>,
  ),
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
