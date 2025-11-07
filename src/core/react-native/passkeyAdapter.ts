import type { relay } from '../internal/modes/relay.js'
import { createPasskeyAdapter, type PasskeysModule } from './passkeys.js'

type RelayParameters = NonNullable<Parameters<typeof relay>[number]>

/**
 * Creates a React Native passkey adapter compatible with the Relay mode.
 */
export function createReactNativePasskeyAdapter<
  P extends RelayParameters = RelayParameters,
>(options?: {
  keyStoreHost?: string | undefined
  passkeysModule?: PasskeysModule | null | undefined
  webAuthn?: NonNullable<RelayParameters['webAuthn']>
}): {
  keystoreHost?: P['keystoreHost']
  webAuthn: NonNullable<P['webAuthn']>
} {
  return createPasskeyAdapter({
    keyStoreHost: options?.keyStoreHost,
    passkeysModule: options?.passkeysModule,
    webAuthn: options?.webAuthn ?? undefined,
  }) as {
    keystoreHost?: P['keystoreHost']
    webAuthn: NonNullable<P['webAuthn']>
  }
}
