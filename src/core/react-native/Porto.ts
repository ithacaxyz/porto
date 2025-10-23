import type { ExactPartial } from '../internal/types.js'
import * as Mode from '../Mode.js'
import * as Porto from '../Porto.js'

export const defaultConfig = {
  ...Porto.defaultConfig,
  mode: Mode.reactNative(),
} as const satisfies Partial<Porto.Config>

/**
 * Instantiates a Porto instance with React Native mode.
 */
export function create(
  parameters: ExactPartial<Porto.Config> | undefined = {},
): Porto.Porto {
  return Porto.create({
    ...parameters,
    mode: parameters.mode ?? defaultConfig.mode,
  })
}
