import { Porto as SharedPorto } from '@porto/apps'
import { Mode, Porto } from 'porto'
import { http, createConfig, createStorage } from 'wagmi'
import { base, baseSepolia, odysseyTestnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const porto = import.meta.env.DEV
  ? Porto.create({
      mode: Mode.contract(),
    })
  : SharedPorto.porto

export const chainIds = [base.id, odysseyTestnet.id, baseSepolia.id] as const
export type ChainId = (typeof chainIds)[number]

export const config = createConfig({
  chains: [base, odysseyTestnet, baseSepolia],
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
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [odysseyTestnet.id]: http(),
  },
})

export const getChainConfig = (chainId: ChainId) =>
  config.chains.find((c) => c.id === chainId)

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
