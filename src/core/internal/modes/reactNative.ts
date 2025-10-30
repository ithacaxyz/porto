import * as Dialog from '../../Dialog.js'
import { createReactNativePasskeyAdapter } from '../../react-native/passkeyAdapter.js'
import { isReactNative } from '../../react-native/utils.js'
import * as Mode from '../mode.js'
import * as Relay from '../modes/relay.js'
import { dialog } from './dialog.js'

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
  })

  const fallback =
    fallbackParameter ??
    Relay.relay({
      ...(keystoreHost ? { keystoreHost } : {}),
      webAuthn,
    })

  return Mode.from({
    ...dialog({
      ...dialogParameters,
      fallback,
      renderer: Dialog.authSession({ redirectUri, requestOptions }),
    }),
    name: 'reactNative',
  })
}

export declare namespace reactNative {
  export type Parameters = (
    | (Omit<dialog.Parameters, 'renderer'> & Dialog.authSession.Options)
    | undefined
  ) & {
    supportAccountUpgrades?: { keyStoreHost: string } | undefined
  }
}
