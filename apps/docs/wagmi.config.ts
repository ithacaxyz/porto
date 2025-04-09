import { Env, PortoConfig } from '@porto/apps'
import { Chains, Mode, Porto } from 'porto'
import { createConfig, createStorage, http } from 'wagmi'

const env = Env.get()

if (typeof window !== 'undefined') {
  const host = PortoConfig.dialogHosts[env]
  Porto.create({
    mode: Mode.dialog({
      host,
    }),
  })
}

export const config = createConfig({
  chains: [Chains.odysseyTestnet, Chains.odysseyDevnet],
  storage: createStorage({
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  }),
  transports: {
    [Chains.odysseyTestnet.id]: http(),
    [Chains.odysseyDevnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
