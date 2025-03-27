import { Porto as SharedPorto } from '@porto/apps'
import { Implementation, Porto } from 'porto'
import { http, createConfig, createStorage } from 'wagmi'
import { baseSepolia, odysseyTestnet, optimismSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const porto = import.meta.env.DEV
  ? Porto.create({
      implementation: Implementation.dialog({
        host: 'https://id.porto.sh/dialog',
      }),
    })
  : SharedPorto.porto

export const config = createConfig({
  chains: [odysseyTestnet, optimismSepolia, baseSepolia],
  storage: createStorage({ storage: localStorage }),
  multiInjectedProviderDiscovery: false,
  connectors: [
    injected({
      target: () => ({
        id: 'porto',
        name: 'Porto',
        provider: porto.provider as never,
      }),
    }),
  ],
  transports: {
    [odysseyTestnet.id]: http(),
    [optimismSepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
