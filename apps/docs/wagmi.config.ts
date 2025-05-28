import { PortoConfig } from '@porto/apps'
import { Dialog, Mode } from 'porto'
import { porto } from 'porto/wagmi'
import { createConfig, createStorage } from 'wagmi'

const portoConfig = PortoConfig.getConfig()

export const connector = porto({
  ...portoConfig,
  mode: Mode.dialog({
    host: PortoConfig.getDialogHost(),
    renderer: Dialog.iframe(),
  }),
})

export const config = createConfig({
  chains: portoConfig.chains,
  connectors: [connector],
  multiInjectedProviderDiscovery: false,
  storage: createStorage({
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  }),
  transports: portoConfig.transports,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
