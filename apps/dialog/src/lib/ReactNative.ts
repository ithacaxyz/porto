export function performReactNativeRedirectURL(
  params: performReactNativeRedirectURL.Params,
) {
  const {
    redirectUri,
    payload = '{}',
    status = 'unknown',
    message = '',
  } = params

  if (!URL.canParse(redirectUri)) throw new Error('invalid redirectUri')

  const searchParams = new URLSearchParams({ message, payload, status })

  const redirectURL = `${redirectUri}?${searchParams.toString()}`
  window.location.href = redirectURL
}

declare namespace performReactNativeRedirectURL {
  export type Params = {
    redirectUri: string
    message?: string | undefined
    payload?: string | undefined
    os?: 'ios' | 'android' | 'web' | undefined
    status?: 'success' | 'error' | 'cancel' | 'unknown' | undefined
  }
}
