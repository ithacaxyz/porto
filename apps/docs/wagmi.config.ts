import { PortoConfig } from '@porto/apps'
import { Chains, Dialog, Mode, Porto } from 'porto'
import { createConfig, createStorage, http } from 'wagmi'

if (typeof window !== 'undefined')
  Porto.create({
    ...PortoConfig.getConfig(),
    mode: Mode.dialog({
      host: PortoConfig.getDialogHost(),
      renderer: Dialog.iframe(),
    }),
  })

export const config = createConfig({
  chains: [Chains.baseSepolia, Chains.portoDev],
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
