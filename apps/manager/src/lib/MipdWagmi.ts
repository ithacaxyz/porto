import { Porto as SharedPorto } from '@porto/apps'
import { Mode, Porto } from 'porto'
import {
  createConfig,
  createStorage,
  fallback,
  http,
  unstable_connector,
} from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const porto = import.meta.env.DEV
  ? Porto.create({
      mode: Mode.contract(),
    })
  : SharedPorto.porto

export const mipdConfig = createConfig({
  chains: [odysseyTestnet],
  multiInjectedProviderDiscovery: true,
  storage: createStorage({ storage: localStorage }),
  transports: {
    [odysseyTestnet.id]: fallback([unstable_connector(injected), http()]),
  },
})
