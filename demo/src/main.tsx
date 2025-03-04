import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'

import { App } from './App.js'
import { Query, Wagmi } from './config.ts'

import './main.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={Wagmi.config}>
      <PersistQueryClientProvider
        client={Query.client}
        persistOptions={{ persister: Query.persister }}
      >
        <App />
      </PersistQueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
