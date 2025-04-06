import { Mode, Porto } from 'porto'
import { createConfig, createStorage, http } from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'

const DISABLE_DIALOG = import.meta.env.VITE_DISABLE_DIALOG === 'true'

const mode = DISABLE_DIALOG
  ? Mode.contract()
  : Mode.dialog({
      host: import.meta.env.VITE_DIALOG_HOST,
    })

Porto.create({ mode })

export const wagmiConfig = createConfig({
  chains: [odysseyTestnet],
  storage: createStorage({ storage: localStorage }),
  transports: {
    [odysseyTestnet.id]: http(),
  },
})
