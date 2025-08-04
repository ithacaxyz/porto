import type { Config } from '@wagmi/core'

import type { getAdmins, getAssets, getPermissions } from './core.js'
import { filterQueryOptions } from './utils.js'

export function getAdminsQueryKey<config extends Config>(
  options: getAdmins.Parameters<config> = {},
) {
  const { connector, ...parameters } = options
  return [
    'admins',
    { ...filterQueryOptions(parameters), connectorUid: connector?.uid },
  ] as const
}

export declare namespace getAdminsQueryKey {
  type Value<config extends Config> = ReturnType<
    typeof getAdminsQueryKey<config>
  >
}

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

export function getAssetsQueryKey<config extends Config>(
  options: getAssets.Parameters,
) {
  const { connector, ...parameters } = options
  return [
    'assets',
    { ...filterQueryOptions(parameters), connectorUid: connector?.uid },
  ] as const
}

export declare namespace getAssetsQueryKey {
  type Value<config extends Config> = ReturnType<
    typeof getAssetsQueryKey<config>
  >
}
