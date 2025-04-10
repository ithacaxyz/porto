import { Mode } from 'porto'
import { porto } from 'porto/wagmi'
import { createConfig, createStorage, http } from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'

const DISABLE_DIALOG = import.meta.env.VITE_DISABLE_DIALOG === 'true'

const mode = DISABLE_DIALOG
  ? Mode.contract()
  : Mode.dialog({
      host: import.meta.env.VITE_DIALOG_HOST,
    })

export const wagmiConfig = createConfig({
  chains: [odysseyTestnet],
  connectors: [porto({ mode })],
  storage: createStorage({ storage: localStorage }),
  transports: {
    [odysseyTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
