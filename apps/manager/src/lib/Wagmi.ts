import { Porto as SharedPorto } from '@porto/apps'
import { Mode, Porto } from 'porto'
import { http, createConfig, createStorage } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const porto = import.meta.env.DEV
  ? Porto.create({
      mode: Mode.dialog({
        host: 'https://id.porto.sh/dialog',
      }),
    })
  : SharedPorto.porto

export const config = createConfig({
  chains: [base],
  storage: createStorage({ storage: localStorage }),
  multiInjectedProviderDiscovery: false,
  connectors: [
    injected({
      target: () => ({
        id: 'porto',
        name: 'Porto',
        provider: porto.provider as never,
      }),
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
