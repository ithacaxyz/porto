import { createStore, del, get, set } from 'idb-keyval'
import type { MaybePromise } from './internal/types.js'

export type Storage = {
  getItem: <value>(name: string) => MaybePromise<value | null>
  removeItem: (name: string) => MaybePromise<void>
  setItem: (name: string, value: unknown) => MaybePromise<void>
}

export function from(storage: Storage): Storage {
  return storage
}

export function idb() {
  const store =
    typeof indexedDB !== 'undefined' ? createStore('porto', 'store') : undefined
  return from({
    async getItem(name) {
      const value = await get(name, store)
      if (value === null) return null
      return value
    },
    async removeItem(name) {
      await del(name, store)
    },
    async setItem(name, value) {
      await set(name, value, store)
    },
  })
}

export function memory() {
  const store = new Map<string, any>()
  return from({
    getItem(name) {
      return store.get(name) ?? null
    },
    removeItem(name) {
      store.delete(name)
    },
    setItem(name, value) {
      store.set(name, value)
    },
  })
}
