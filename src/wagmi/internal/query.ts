import type { Config } from '@wagmi/core'

import type { getPermissions } from './core.js'
import { filterQueryOptions } from './utils.js'

export function getPermissionsQueryKey<config extends Config>(
  options: getPermissions.Parameters<config> = {},
) {
  const { connector, ...parameters } = options
  return [
    'permissions',
    { ...filterQueryOptions(parameters), connectorUid: connector?.uid },
  ] as const
}

export declare namespace getPermissionsQueryKey {
  type Value<config extends Config> = ReturnType<
    typeof getPermissionsQueryKey<config>
  >
}
