import { PortoConfig } from '@porto/apps'
import { Chains, Mode, Porto } from 'porto'
import { createConfig, createStorage, http } from 'wagmi'

if (typeof window !== 'undefined') {
  const config = PortoConfig.getConfig()
  const host = PortoConfig.getDialogHost()
  Porto.create({
    ...config,
    mode: Mode.dialog({
      host,
    }),
  })
}

export const config = createConfig({
  chains: [Chains.odysseyTestnet, Chains.odysseyDevnet, Chains.baseSepolia],
  storage: createStorage({
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  }),
  transports: {
    [Chains.odysseyTestnet.id]: http(),
    [Chains.odysseyDevnet.id]: http(),
    [Chains.baseSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
