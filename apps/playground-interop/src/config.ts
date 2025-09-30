import 'porto/register'
import { PortoConfig } from '@porto/apps'
import { type Chains, Mode } from 'porto'
import { porto } from 'porto/wagmi'
import { createConfig, createStorage } from 'wagmi'

export const config = PortoConfig.getConfig()

export const testnet = new URLSearchParams(window.location.search).get(
  'testnets',
)

export const wagmiConfig = createConfig({
  chains: config.chains.filter((c) =>
    testnet ? c.testnet : !c.testnet,
  ) as unknown as [Chains.Chain, ...Chains.Chain[]],
  connectors: [
    porto({
      ...config,
      mode: Mode.dialog({
        host: PortoConfig.getDialogHost(),
      }),
    }),
  ],
  multiInjectedProviderDiscovery: false,
  storage: createStorage({ storage: localStorage }),
  transports: config.transports,
})

export type ChainId = (typeof config.chains)[number]['id'] | 0

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
