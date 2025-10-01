import * as Dialog from '../../Dialog.js'
import * as Mode from '../mode.js'
import { dialog } from './dialog.js'

const isReactNativeRuntime =
  typeof navigator !== 'undefined' && navigator.product === 'ReactNative'

function createNativeMode(parameters: reactNative.Parameters) {
  const native = (parameters as { native?: Dialog.authSession.Options }).native
  const authSessionOptions: Dialog.authSession.Options = {
    ...native,
    redirectPath: native?.redirectPath ?? 'auth',
  }
  const baseParameters = { ...parameters } as Record<string, unknown>
  delete baseParameters.native
  const base = dialog({
    ...(baseParameters as dialog.Parameters),
    renderer: Dialog.authSession(authSessionOptions),
  })

  return Mode.from({
    ...base,
    name: 'reactNative',
  })
}

function createBrowserMode(parameters: reactNative.Parameters) {
  const baseParameters = { ...parameters } as Record<string, unknown>
  delete baseParameters.native
  const browserParameters = baseParameters as reactNative.BrowserParameters
  const renderer = browserParameters.renderer ?? Dialog.popup()

  const base = dialog({
    ...browserParameters,
    renderer,
  })

  return Mode.from({
    ...base,
    name: 'reactNative',
  })
}

export function reactNative(parameters: reactNative.Parameters = {}) {
  return isReactNativeRuntime
    ? createNativeMode(parameters)
    : createBrowserMode(parameters)
}

export declare namespace reactNative {
  export type BrowserParameters = dialog.Parameters
  export type Parameters = Omit<dialog.Parameters, 'renderer'> & {
    native?: Dialog.authSession.Options | undefined
  }
}
