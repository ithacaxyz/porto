import { Env, Porto as PortoConfig } from '@porto/apps'
import { Mode, Porto } from 'porto'
import { createConfig, createStorage, http } from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'

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

export const chainIds = [odysseyTestnet.id] as const
export type ChainId = (typeof chainIds)[number]

export const config = createConfig({
  chains: [odysseyTestnet],
  storage: createStorage({ storage: localStorage }),
  transports: {
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
