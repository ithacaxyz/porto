import { Implementation, Messenger, Porto, Storage } from 'porto'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'

export const porto = Porto.create({
  implementation: Implementation.local(),
  storage: Storage.localStorage(),
})

export const messenger = Messenger.bridge({
  from: Messenger.fromWindow(window),
  to: Messenger.fromWindow(window.opener ?? window.parent),
})

export function usePortoState<slice = Porto.State>(
  selector: Parameters<typeof useStore<Porto.Store, slice>>[1] = (state) =>
    state as slice,
) {
  return useStore(porto._internal.store, useShallow(selector))
}
