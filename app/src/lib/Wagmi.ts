import {
  http,
  createConfig,
  createStorage,
  fallback,
  unstable_connector,
} from 'wagmi'
import { baseSepolia, odysseyTestnet, optimismSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
// import { porto } from './Porto'

export const config = createConfig({
  chains: [odysseyTestnet, optimismSepolia, baseSepolia],
  storage: createStorage({ storage: localStorage }),
  multiInjectedProviderDiscovery: true,
  // connectors: [
  //   injected(),
  //   walletConnect({
  //     projectId: '562ca4dfff573b4885cd05dbbb086860',
  //     name: 'Porto',
  //     metadata: {
  //       name: 'Porto',
  //       description: 'Porto',
  //       url: 'https://wallet.ithaca.xyz',
  //       icons: ['https://ithaca.xyz/icon.png'],
  //     },
  //   }),
  // ],
  transports: {
    [baseSepolia.id]: fallback([unstable_connector(injected), http()]),
    [odysseyTestnet.id]: fallback([unstable_connector(injected), http()]),
    [optimismSepolia.id]: fallback([unstable_connector(injected), http()]),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
