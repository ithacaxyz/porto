import type { Messenger } from 'porto'
import * as Zustand from 'zustand'
import { useShallow } from 'zustand/shallow'
import { createStore } from 'zustand/vanilla'

export const store = createStore<store.State>(() => {
  const referrer = (() => {
    const referrer = new URLSearchParams(window.location.search).get('referrer')
    if (!referrer) return undefined
    try {
      return JSON.parse(referrer)
    } catch {}
    return undefined
  })()

  return {
    error: null,
    mode: 'popup-standalone',
    referrer: {
      ...referrer,
      url: referrer?.url ? new URL(referrer.url) : undefined,
    },
  }
})

export declare namespace store {
  type State = {
    mode: Payload['mode']
    referrer:
      | (Payload['referrer'] & {
          url?: URL | undefined
        })
      | undefined
    error: {
      action: 'close' | 'retry-in-popup'
      message: string
      name: string
      secondaryMessage?: string
      title: string
    } | null
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
