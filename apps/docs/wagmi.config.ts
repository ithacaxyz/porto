import { PortoConfig } from '@porto/apps'
import { Chains, Dialog, Mode, Porto } from 'porto'
import { createConfig, createStorage, http } from 'wagmi'

export let modes:
  | Record<'iframe-dialog' | 'inline-dialog', Mode.Mode>
  | undefined
export let porto: Porto.Porto<(typeof config)['chains']> | undefined
if (typeof window !== 'undefined') {
  const config = PortoConfig.getConfig()
  const host = PortoConfig.getDialogHost()

  modes = {
    'iframe-dialog': Mode.dialog({
      host,
    }),
    'inline-dialog': Mode.dialog({
      host,
      renderer: Dialog.experimental_inline({
        element: () => document.getElementById('porto')!,
      }),
    }),
  }

  porto = Porto.create({
    ...config,
    mode: modes['iframe-dialog'],
  }) as never
}

export const config = createConfig({
  chains: [Chains.odysseyTestnet, Chains.odysseyDevnet, Chains.baseSepolia],
  storage: createStorage({
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  }),
  transports: {
    [Chains.odysseyTestnet.id]: http(),
    [Chains.odysseyDevnet.id]: http(),
    [Chains.baseSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
