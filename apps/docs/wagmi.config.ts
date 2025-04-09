import { Env, PortoConfig } from '@porto/apps'
import { Mode, Porto } from 'porto'
import { createConfig, createStorage, http } from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'

if (typeof window !== 'undefined') {
  const env = Env.get()
  const host = PortoConfig.dialogHosts[env]
  Porto.create({
    mode: Mode.dialog({
      host,
    }),
  })
}

export const config = createConfig({
  chains: [odysseyTestnet],
  storage: createStorage({
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  }),
  transports: {
    [odysseyTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
