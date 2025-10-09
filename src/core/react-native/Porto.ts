import type { ExactPartial } from '../internal/types.js'
import * as Mode from '../Mode.js'
import * as Porto from '../Porto.js'

export const defaultConfig = {
  ...Porto.defaultConfig,
  mode: Mode.reactNative(),
} as const satisfies Partial<Porto.Config>

export function create(
  parameters: ExactPartial<Porto.Config> | undefined = {},
): Porto.Porto {
  return Porto.create({
    ...parameters,
    mode: parameters.mode ?? defaultConfig.mode,
  })
}

export type { Porto }
