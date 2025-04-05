import type * as Address from 'ox/Address'

import * as Key from './key.js'
import * as Permissions_ from './typebox/permissions.js'
import type { StaticDecode } from './typebox/schema.js'

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
