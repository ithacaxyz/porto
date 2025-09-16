import type * as Address from 'ox/Address'
import type * as z from 'zod/mini'

import * as Key from '../../viem/Key.js'
import * as Permissions_ from './schema/permissions.js'

export const Schema = Permissions_.Permissions

export type Permissions = z.infer<typeof Schema>

export function fromKey(key: Key.Key, options: fromKey.Options): Permissions {
  const { chainId, expiry, permissions, id, publicKey, type } = key
  const { address } = options
  return {
    address,
    chainId,
    expiry,
    id,
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
  }
}

export function toKey(permissions: Permissions): Key.Key {
  const { chainId, expiry, key } = permissions
  return Key.from({
    chainId,
    expiry,
    permissions: permissions.permissions ?? {},
    publicKey: key.publicKey,
    role: 'session',
    type: key.type,
  })
}
