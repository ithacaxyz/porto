import type { Theme } from '@porto/apps'
import type { Address } from 'ox'
import type { Messenger } from 'porto'
import * as Zustand from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/shallow'
import { createStore } from 'zustand/vanilla'

export const store = createStore(
  devtools(
    persist<store.State>(
      () => ({
        accountMetadata: {},
        customTheme: undefined,
        display: 'full',
        error: null,
        mode: 'popup-standalone',
        referrer: undefined,
      }),
      {
        name: 'porto.dialog',
        partialize(state) {
          return {
            accountMetadata: state.accountMetadata,
          } as store.State
        },
      },
    ),
  ),
)

export declare namespace store {
  type State = {
    accountMetadata: Record<
      Address.Address,
      {
        email?: string | undefined
      }
    >
    customTheme: Theme.TailwindCustomTheme | undefined
    // reflects how the dialog window gets displayed:
    // - 'full': uses the full space available (popup, popup-standalone) (default)
    // - 'floating': as a floating window, with space around it (iframe)
    // - 'drawer': as a drawer (iframe with small viewports)
    display: 'floating' | 'drawer' | 'full'
    error: {
      action: 'close' | 'retry-in-popup'
      message: string
      name: string
      secondaryMessage?: string
      title: string
    } | null
    mode: Payload['mode']
    referrer:
      | (Payload['referrer'] & {
          origin: string
          url?: URL | undefined
        })
      | undefined
  }
}
type Payload = Extract<Messenger.Payload<'__internal'>, { type: 'init' }>

export function useStore<slice = store.State>(
  selector: Parameters<typeof Zustand.useStore<typeof store, slice>>[1] = (
    state,
  ) => state as slice,
) {
  return Zustand.useStore(store, useShallow(selector))
}
