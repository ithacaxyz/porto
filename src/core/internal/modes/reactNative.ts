import * as Dialog from '../../Dialog.js'
import * as Mode from '../mode.js'
import { dialog } from './dialog.js'

export function reactNative(parameters: reactNative.Parameters = {}) {
  const { redirectUri, requestOptions, ...baseParameters } = parameters

  return Mode.from({
    ...dialog({
      ...baseParameters,
      renderer: Dialog.authSession({ redirectUri, requestOptions }),
    }),
    name: 'reactNative',
  })
}

export declare namespace reactNative {
  export type Parameters =
    | (Omit<dialog.Parameters, 'renderer'> & Dialog.authSession.Options)
    | undefined
}
