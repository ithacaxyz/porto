import { Env, Porto as PortoConfig } from '@porto/apps'
import { Dialog, Mode, Porto } from 'porto'
import { createConfig, createStorage, http } from 'wagmi'
import { base, baseSepolia, odysseyTestnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const env = Env.get()
const host = PortoConfig.dialogHosts[env]

export type ModeType =
  | 'contract'
  | 'iframe-dialog'
  | 'inline-dialog'
  | 'popup-dialog'
  | 'relay'

export const modes = {
  contract: Mode.contract(),
  'iframe-dialog': Mode.dialog({
    host,
  }),
  'inline-dialog': Mode.dialog({
    host,
    renderer: Dialog.experimental_inline({
      element: () => document.getElementById('porto')!,
    }),
  }),
  'popup-dialog': Mode.dialog({
    host,
    renderer: Dialog.popup(),
  }),
  relay: Mode.relay(),
} as { [K in ModeType]: Mode.Mode }

export const porto = Porto.create({
  ...PortoConfig.config[env],
  mode: modes.relay,
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
