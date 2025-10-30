import { Buffer } from 'buffer'

globalThis.Buffer = Buffer

import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { baseSepolia } from 'viem/chains'

import { App } from './App.tsx'
import { config } from './config.ts'

const queryClient = new QueryClient()

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID
if (!PRIVY_APP_ID) throw new Error('VITE_PRIVY_APP_ID is not set')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        defaultChain: baseSepolia,
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        loginMethods: ['wallet', 'passkey', 'farcaster', 'email'],
        supportedChains: [baseSepolia],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <App />
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  </StrictMode>,
)
