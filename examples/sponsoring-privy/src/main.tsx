import { Buffer } from 'buffer'

// @ts-expect-error
globalThis.Buffer = Buffer

import { PrivyProvider } from '@privy-io/react-auth'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { baseSepolia } from 'viem/chains'

import { App } from './App.tsx'

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
        externalWallets: {},
        supportedChains: [baseSepolia],
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>,
)
