import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { focusManager, QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import type * as React from 'react'
import { Platform } from 'react-native'
import { WagmiProvider } from 'wagmi'

import { config } from './config.ts'
import { useAppState, useOnlineManager } from './hooks.tsx'

export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
      retry: 2,
    },
  },
})

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
})

export function Providers({ children }: { children: React.ReactNode }) {
  useOnlineManager()

  useAppState((status) => {
    if (Platform.OS !== 'web') focusManager.setFocused(status === 'active')
  })

  return (
    <WagmiProvider config={config}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        {children}
      </PersistQueryClientProvider>
    </WagmiProvider>
  )
}
