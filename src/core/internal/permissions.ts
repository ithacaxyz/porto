import type * as Address from 'ox/Address'

import * as Key from '../Key.js'
import * as Permissions_ from './typebox/permissions.js'
import type { StaticDecode } from './typebox/typebox.js'

export const Schema = Permissions_.Permissions

export type Permissions = StaticDecode<typeof Schema>

export function fromKey(key: Key.Key, options: fromKey.Options): Permissions {
  const { expiry, permissions, publicKey, type } = key
  const { address, chainId } = options
  return {
    address,
    chainId,
    expiry,
    id: publicKey,
    key: {
      publicKey,
      type,
    },
    permissions: (permissions ?? {}) as never,
  }
}

export declare namespace fromKey {
  export type Options = {
    address: Address.Address
    chainId?: number | undefined
  }
}

export function getActiveFromKeys(
  keys: readonly Key.Key[],
  options: getActiveFromKeys.Options,
): readonly Permissions[] {
  const { address, chainId } = options

  return keys
    .map((key) => {
      if (key.role !== 'session') return undefined
      if (key.expiry > 0 && key.expiry < BigInt(Math.floor(Date.now() / 1000)))
        return undefined
      try {
        return fromKey(key, { address, chainId })
      } catch {
        return undefined
      }
    })
    .filter(Boolean) as never
}

export declare namespace getActiveFromKeys {
  export type Options = {
    address: Address.Address
    chainId?: number | undefined
  }
}

export function toKey(permissions: Permissions): Key.Key {
  const { expiry, key } = permissions
  return Key.from({
    expiry,
    permissions: permissions.permissions ?? {},
    publicKey: key.publicKey,
    role: 'session',
    type: key.type,
  })
}
