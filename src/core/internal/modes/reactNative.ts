import { isReactNative } from '../../../react-native/utils.js'
import * as Dialog from '../../Dialog.js'
import * as Mode from '../mode.js'
import * as Relay from '../modes/relay.js'
import { dialog } from './dialog.js'

export function reactNative(parameters: reactNative.Parameters = {}) {
  if (!isReactNative())
    return Mode.from({ actions: Relay.relay().actions, name: 'relay' })

  const { native, ...baseParameters } = parameters

  return Mode.from({
    ...dialog({
      ...baseParameters,
      host: Object.hasOwn(process.env, 'EXPO_PUBLIC_PORTO_HOST')
        ? process.env.EXPO_PUBLIC_PORTO_HOST
        : baseParameters.host,
      renderer: Dialog.authSession(native ?? {}),
    }),
    name: 'reactNative',
  })
}

export declare namespace reactNative {
  export type BrowserParameters = dialog.Parameters
  export type Parameters = Omit<dialog.Parameters, 'renderer' | 'fallback'> & {
    native?: Dialog.authSession.Options | undefined
  }
}
