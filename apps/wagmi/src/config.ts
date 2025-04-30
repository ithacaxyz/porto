import { Mode } from 'porto'
import { porto } from 'porto/wagmi'
import { createConfig, createStorage, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    porto({
      mode: Mode.dialog({
        host: import.meta.env.VITE_DIALOG_HOST,
      }),
    }),
  ],
  storage: createStorage({ storage: localStorage }),
  transports: {
    [baseSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
