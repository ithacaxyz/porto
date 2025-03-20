import { Implementation, Porto } from 'porto'
import { http, createConfig, createStorage } from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'

if (typeof window !== 'undefined')
  Porto.create({
    implementation: Implementation.dialog({
      host: import.meta.env.VITE_DIALOG_HOST,
    }),
  })

export const config = createConfig({
  chains: [odysseyTestnet],
  storage: createStorage({
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  }),
  transports: {
    [odysseyTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
