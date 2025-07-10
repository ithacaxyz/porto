import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import type * as ServerActions from '../../viem/ServerActions.js'
import type * as Storage from '../Storage.js'

export type PreCalls = readonly {
  context: ServerActions.prepareCalls.ReturnType['context']
  signature: Hex.Hex
}[]

export const storageKey = (address: Address.Address) =>
  `porto.preCalls.${address}`

/**
 * Adds pre-calls to persistent storage.
 *
 * @param preCalls - Pre-calls.
 * @param options - Options.
 */
export async function add(preCalls: PreCalls, options: add.Options) {
  const { address } = options

  if (preCalls.length === 0) return

  const storage = (() => {
    const storages = options.storage.storages ?? [options.storage]
    return storages.find((x) => x.sizeLimit > 1024 * 1024 * 4)
  })()

  const value = await storage?.getItem<PreCalls>(storageKey(address))
  await storage?.setItem(storageKey(address), [...(value ?? []), ...preCalls])
}

export declare namespace add {
  export type Options = {
    address: Address.Address
    storage: Storage.Storage
  }
}

/**
 * Gets pre-calls from persistent storage.
 *
 * @param options - Options.
 * @returns Pre-calls.
 */
export async function get(options: get.Options) {
  const { address, storage } = options
  const preCalls = await storage?.getItem<PreCalls>(storageKey(address))
  return preCalls || undefined
}

export declare namespace get {
  export type Options = {
    address: Address.Address
    storage: Storage.Storage
  }
}

/**
 * Clears pre-calls from persistent storage.
 *
 * @param options - Options.
 */
export async function clear(options: clear.Options) {
  const { address, storage } = options
  await storage?.removeItem(storageKey(address))
}

export declare namespace clear {
  export type Options = {
    address: Address.Address
    storage: Storage.Storage
  }
}
