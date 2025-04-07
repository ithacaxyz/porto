import { Env, Porto as PortoConfig } from '@porto/apps'
import { Mode, Porto } from 'porto'
import { createConfig, createStorage, http, injected } from 'wagmi'
import { base, baseSepolia, odysseyTestnet } from 'wagmi/chains'

const env = Env.get()

const host = (() => {
  const url = new URL(PortoConfig.dialogHosts[env] as string)
  if (import.meta.env.DEV) url.port = window.location.port
  return url.href
})()

export const porto = Porto.create({
  ...PortoConfig.config[env],
  mode: Mode.dialog({
    host,
  }),
})

export const chainIds = [base.id, odysseyTestnet.id, baseSepolia.id] as const
export type ChainId = (typeof chainIds)[number]

export const config = createConfig({
  chains: [base, odysseyTestnet, baseSepolia],
  connectors: [
    injected({
      target: () => ({
        id: 'porto',
        name: 'Porto',
        provider: porto.provider as never,
      }),
    }),
  ],
  multiInjectedProviderDiscovery: false,
  storage: createStorage({ storage: localStorage }),
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [odysseyTestnet.id]: http(),
  },
})

export const mipdConfig = createConfig({
  chains: config.chains,
  storage: null,
  transports: config._internal.transports,
})

export const getChainConfig = (chainId: ChainId) =>
  config.chains.find((c) => c.id === chainId)

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
