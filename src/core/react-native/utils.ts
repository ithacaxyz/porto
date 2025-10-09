export function isReactNative() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative')
    return true

  if (
    typeof window !== 'undefined' &&
    Object.hasOwn(window, 'ReactNativeWebView')
  )
    return true

  if (
    typeof globalThis !== 'undefined' &&
    Object.hasOwn(globalThis, 'HermesEngine')
  )
    return true

  return false
}
