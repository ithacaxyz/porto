import { Porto as PortoConfig } from '@porto/apps'
import { Mode, Porto } from 'porto'
import { createConfig, createStorage, http } from 'wagmi'
import { base, baseSepolia, odysseyTestnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const env = 'stg'
const host = PortoConfig.dialogHosts[env]

export type ModeType = 'dialog' | 'direct'

export const modes = {
  dialog: Mode.dialog({ host }),
  direct: Mode.relay(),
}

export const porto = Porto.create({
  ...PortoConfig.config[env],
  mode: modes.direct,
})

export const chainIds = [base.id, odysseyTestnet.id, baseSepolia.id] as const
export type ChainId = (typeof chainIds)[number]

export const config = createConfig({
  chains: [
    //
    base,
    odysseyTestnet,
    baseSepolia,
  ],
  connectors: [
    injected({
      target: () => ({
        id: 'porto',
        name: 'Porto',
        provider: porto.provider as never,
      }),
    }),
  ],
  storage: createStorage({ storage: localStorage }),
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
