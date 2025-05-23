import { PortoConfig } from '@porto/apps'
import { Chains, Dialog, Mode } from 'porto'
import { porto } from 'porto/wagmi'
import { createConfig, createStorage, http } from 'wagmi'

export const connector = porto({
  ...PortoConfig.getConfig(),
  mode: Mode.dialog({
    host: PortoConfig.getDialogHost(),
    renderer: Dialog.iframe(),
  }),
})

export const config = createConfig({
  chains: [Chains.baseSepolia, Chains.portoDev],
  connectors: [connector],
  multiInjectedProviderDiscovery: false,
  storage: createStorage({
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  }),
  transports: {
    [Chains.baseSepolia.id]: http(),
    [Chains.portoDev.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
