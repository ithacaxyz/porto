import type { Config } from '@wagmi/core'

import type { PartialBy } from '../../core/internal/types.js'

import type {
  getAdmins,
  getAssets,
  getCallsHistory,
  getPermissions,
} from './core.js'
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

export function getAssetsQueryKey<_config extends Config>(
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

export function getCallsHistoryQueryKey<_config extends Config>(
  options: getCallsHistoryQueryKey.Parameters = {},
) {
  const { connector, ...parameters } = options
  return [
    'callsHistory',
    { ...filterQueryOptions(parameters), connectorUid: connector?.uid },
  ] as const
}

export declare namespace getCallsHistoryQueryKey {
  type Parameters = PartialBy<
    getCallsHistory.Parameters,
    'account' | 'limit' | 'sort'
  >
  type Value<config extends Config> = ReturnType<
    typeof getCallsHistoryQueryKey<config>
  >
}
