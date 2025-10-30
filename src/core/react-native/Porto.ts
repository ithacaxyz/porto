import type { ExactPartial } from '../internal/types.js'
import * as Mode from '../Mode.native.js'
import * as Porto from '../Porto.js'
import { createReactNativePasskeyAdapter } from './passkeyAdapter.js'

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
  const { keystoreHost, webAuthn } = createReactNativePasskeyAdapter()

  if (parameters?.mode)
    return Porto.create({ ...parameters, mode: parameters.mode })
  const mode = Mode.reactNative({
    fallback: Mode.relay({
      ...(keystoreHost ? { keystoreHost } : {}),
      webAuthn,
    }),
  })

  return Porto.create({
    ...parameters,
    mode,
  })
}

export { createReactNativePasskeyAdapter } from './passkeyAdapter.js'
