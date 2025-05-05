import { PortoConfig } from '@porto/apps'
import { Chains, Dialog, Mode, Porto } from 'porto'
import { createConfig, createStorage, http } from 'wagmi'

export let porto: Porto.Porto<(typeof config)['chains']> | undefined
if (typeof window !== 'undefined') {
  const config = PortoConfig.getConfig()
  const host = PortoConfig.getDialogHost()
  const renderer = Dialog.iframe()
  porto = Porto.create({
    ...config,
    mode: Mode.dialog({ host, renderer }),
  }) as never
}

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
