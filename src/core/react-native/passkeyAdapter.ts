import type { relay } from '../internal/modes/relay.js'
import { createPasskeyAdapter } from './passkeys.js'

type RelayParameters = NonNullable<Parameters<typeof relay>[0]>

/**
 * Creates a React Native passkey adapter compatible with the Relay mode.
 */
export function createReactNativePasskeyAdapter<
  P extends RelayParameters = RelayParameters,
>(options?: {
  keyStoreHost?: string | undefined
}): {
  keystoreHost?: P['keystoreHost']
  webAuthn: NonNullable<P['webAuthn']>
} {
  return createPasskeyAdapter({ keyStoreHost: options?.keyStoreHost })
}
