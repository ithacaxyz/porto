import { onlineManager } from '@tanstack/react-query'
import * as Network from 'expo-network'
import * as React from 'react'
import { AppState, type AppStateStatus, Platform } from 'react-native'

export function useOnlineManager() {
  React.useEffect(() => {
    if (Platform.OS === 'web') return

    const eventSubscription = Network.addNetworkStateListener((state) =>
      onlineManager.setOnline(!!state.isConnected),
    )

    return () => eventSubscription.remove()
  }, [])
}

export function useAppState(onChange: (status: AppStateStatus) => void) {
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', onChange)
    return () => {
      subscription.remove()
    }
  }, [onChange])
}
