import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { walletConnectV2 } from 'porto/wallets/walletconnect-v2'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    walletConnectV2({
      projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Replace with your WalletConnect project ID
      metadata: {
        name: 'Porto WalletConnect v2 Example',
        description: 'Example app using Porto with WalletConnect v2',
        url: 'https://localhost:5178',
        icons: ['https://avatars.githubusercontent.com/u/37784886?s=200&v=4'],
      },
      qrModalOptions: {
        themeMode: 'light',
      },
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
