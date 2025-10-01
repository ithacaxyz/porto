export function isReactNativeRequest() {
  if (typeof window === 'undefined') return false
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.has('redirectUri')
}
