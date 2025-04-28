import * as Zustand from 'zustand'
import { useShallow } from 'zustand/shallow'
import { createStore } from 'zustand/vanilla'

export const store = createStore<store.State>(() => ({
  mode: 'popup-standalone',
  referrer: undefined,
}))

export declare namespace store {
  type State = {
    mode: 'iframe' | 'inline-iframe' | 'popup' | 'popup-standalone'
    referrer:
      | {
          icon?: string | { dark: string; light: string } | undefined
          title: string
          url: URL
        }
      | undefined
  }
}

export function useStore<slice = store.State>(
  selector: Parameters<typeof Zustand.useStore<typeof store, slice>>[1] = (
    state,
  ) => state as slice,
) {
  return Zustand.useStore(store, useShallow(selector))
}
