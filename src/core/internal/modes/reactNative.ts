import * as Dialog from '../../Dialog.js'
import { createReactNativePasskeyAdapter } from '../../react-native/passkeyAdapter.js'
import type { PasskeysModule } from '../../react-native/passkeys.js'
import { isReactNative } from '../../react-native/utils.js'
import * as Mode from '../mode.js'
import * as Relay from '../modes/relay.js'
import { dialog } from './dialog.js'

type RelayParameters = NonNullable<Parameters<typeof Relay.relay>[0]>

export function reactNative(parameters: reactNative.Parameters = {}) {
  if (!isReactNative())
    return (
      parameters.fallback ??
      Mode.from({ actions: Relay.relay().actions, name: 'relay' })
    )

  const {
    fallback: fallbackParameter,
    redirectUri,
    requestOptions,
    supportAccountUpgrades,
    ...dialogParameters
  } = parameters

  const { keystoreHost, webAuthn } = createReactNativePasskeyAdapter({
    keyStoreHost: supportAccountUpgrades?.keyStoreHost,
    passkeysModule: supportAccountUpgrades?.passkeysModule,
    webAuthn: supportAccountUpgrades?.webAuthn,
  })

  const fallbackMode =
    fallbackParameter ??
    Relay.relay({
      ...(keystoreHost ? { keystoreHost } : {}),
      webAuthn,
    })

  const dialogMode = dialog({
    ...dialogParameters,
    fallback: fallbackMode,
    renderer: Dialog.authSession({ redirectUri, requestOptions }),
  })

  const fallbackOverrides = fallbackMode
    ? {
        grantAdmin: fallbackMode.actions.grantAdmin,
        grantPermissions: fallbackMode.actions.grantPermissions,
        revokeAdmin: fallbackMode.actions.revokeAdmin,
        revokePermissions: fallbackMode.actions.revokePermissions,
      }
    : {}

  return Mode.from({
    ...dialogMode,
    actions: {
      ...dialogMode.actions,
      ...(fallbackMode
        ? { upgradeAccount: fallbackMode.actions.upgradeAccount }
        : {}),
      ...fallbackOverrides,
    },
    name: 'reactNative',
  })
}

export declare namespace reactNative {
  export type Parameters = (
    | (Omit<dialog.Parameters, 'renderer'> & Dialog.authSession.Options)
    | undefined
  ) & {
    supportAccountUpgrades?:
      | {
          keyStoreHost?: RelayParameters['keystoreHost']
          passkeysModule?: PasskeysModule | null | undefined
          webAuthn?: RelayParameters['webAuthn']
        }
      | undefined
  }
}
