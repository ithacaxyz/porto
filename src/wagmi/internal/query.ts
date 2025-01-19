import type { Config } from '@wagmi/core'

import type { keys } from './core.js'
import { filterQueryOptions } from './utils.js'

export function keysQueryKey<config extends Config>(
  options: keys.Parameters<config> = {},
) {
  const { connector, ...parameters } = options
  return [
    'keys',
    { ...filterQueryOptions(parameters), connectorUid: connector?.uid },
  ] as const
}

export declare namespace keysQueryKey {
  type Value<config extends Config> = ReturnType<typeof keysQueryKey<config>>
}
