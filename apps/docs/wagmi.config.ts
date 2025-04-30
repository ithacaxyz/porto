import { PortoConfig } from '@porto/apps'
import { Chains, Dialog, Mode, Porto } from 'porto'
import { createConfig, createStorage, http } from 'wagmi'
import { createStore } from 'zustand/vanilla'

export const store = createStore<{
  renderer: Dialog.Dialog | undefined
  renderers: Dialog.Dialog[]
}>(() => ({
  renderer: undefined,
  renderers: [],
}))

export let porto: Porto.Porto<(typeof config)['chains']> | undefined
if (typeof window !== 'undefined') {
  const config = PortoConfig.getConfig()
  const host = PortoConfig.getDialogHost()

  const renderer = Dialog.iframe()
  porto = Porto.create({
    ...config,
    mode: Mode.dialog({ host, renderer }),
  }) as never

  store.setState((x) => ({
    ...x,
    renderer,
    renderers: [
      renderer,
      Dialog.experimental_inline({
        element: () => document.getElementById('porto')!,
      }),
    ],
  }))
}

export const config = createConfig({
  chains: [Chains.baseSepolia, Chains.portoDev],
  storage: createStorage({
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  }),
  transports: {
    [Chains.baseSepolia.id]: http(),
    [Chains.portoDev.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
