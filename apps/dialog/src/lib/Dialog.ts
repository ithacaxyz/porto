import { Messenger } from 'porto'
import * as Zustand from 'zustand'
import { useShallow } from 'zustand/shallow'
import { createStore } from 'zustand/vanilla'

export const store = createStore<store.State>(() => ({
  mode: 'popup-standalone',
  referrer: undefined,
}))

export declare namespace store {
  type State = {
    mode: Payload['mode']
    referrer:
      | (Payload['referrer'] & {
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
