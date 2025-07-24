import { PortoConfig } from '@porto/apps'
import { Dialog, Mode } from 'porto'
import { porto } from 'porto/wagmi'
import { createConfig, createStorage } from 'wagmi'

const portoConfig = PortoConfig.getConfig()

export const portoDialogThemeController = Dialog.createThemeController()

export const portoDialog = Mode.dialog({
  host: PortoConfig.getDialogHost(),
  renderer: Dialog.iframe(),
  themeController: portoDialogThemeController,
})

export const connector = porto({
  ...portoConfig,
  mode: portoDialog,
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
