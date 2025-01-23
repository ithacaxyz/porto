import { useStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/shallow'
import { createStore } from 'zustand/vanilla'

export const appStore = createStore(
  import.meta.env.DEV
    ? persist(getInitialState, {
        name: 'porto.app',
        partialize(state) {
          return {
            targetOrigin: state.targetOrigin,
          }
        },
      })
    : getInitialState,
)

export declare namespace appStore {
  type State = {
    mode: 'iframe' | 'popup'
    targetOrigin: string
  }
}

function getInitialState(): appStore.State {
  return {
    mode: undefined as never,
    targetOrigin: undefined as never,
  }
}

export function useAppStore<slice = appStore.State>(
  selector: Parameters<typeof useStore<typeof appStore, slice>>[1] = (state) =>
    state as slice,
) {
  return useStore(appStore, useShallow(selector))
}
