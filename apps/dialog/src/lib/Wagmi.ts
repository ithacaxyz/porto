import { Porto } from '@porto/apps'
import { http, createConfig, createStorage } from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'

const porto = Porto.porto

export const config = createConfig({
  chains: porto._internal.config.chains,
  storage: createStorage({ storage: localStorage }),
  multiInjectedProviderDiscovery: false,
  transports: {
    [odysseyTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
