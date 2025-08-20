import { PortoConfig } from '@porto/apps'
import { Dialog, Mode } from 'porto'
import { porto } from 'porto/wagmi'
import { createConfig, createStorage, http } from 'wagmi'
import { baseSepolia, optimismSepolia } from 'wagmi/chains'

const portoConfig = PortoConfig.getConfig()

export const portoDialogThemeController = Dialog.createThemeController()

export const portoDialog = Mode.dialog({
  host: PortoConfig.getDialogHost(),
  renderer: Dialog.iframe(),
  themeController: portoDialogThemeController,
})

export const connector = porto({
  ...portoConfig,
  feeToken: 'EXP',
  mode: portoDialog,
})

export const config = createConfig({
  chains: [baseSepolia, optimismSepolia],
  connectors: [connector],
  multiInjectedProviderDiscovery: false,
  storage: createStorage({
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  }),
  transports: {
    [baseSepolia.id]: http(),
    [optimismSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
