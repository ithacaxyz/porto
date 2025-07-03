const environment = process.env.ENVIRONMENT
if (!environment) throw new Error('ENVIRONMENT is not set')

export const env = (env = environment) => ({
  get API_BASE_URL() {
    const url =
      env === 'sandbox'
        ? process.env.SANDBOX_API_BASE_URL
        : process.env.API_BASE_URL
    if (!url) throw new Error('API_BASE_URL is not set')
    return url
  },
  get AUTH_SECRET_KEY() {
    const key =
      env === 'sandbox'
        ? process.env.SANDBOX_AUTH_SECRET_KEY
        : process.env.AUTH_SECRET_KEY
    if (!key) throw new Error('AUTH_SECRET_KEY is not set')
    return key
  },
  get AUTH_SIGN_KEY() {
    const key =
      env === 'sandbox'
        ? process.env.SANDBOX_AUTH_SIGN_KEY
        : process.env.AUTH_SIGN_KEY
    if (!key) throw new Error('AUTH_SIGN_KEY is not set')
    return key
  },
  get SDK_PARTNER_TOKEN() {
    const token =
      env === 'sandbox'
        ? process.env.SANDBOX_SDK_PARTNER_TOKEN
        : process.env.SDK_PARTNER_TOKEN
    if (!token) throw new Error('SDK_PARTNER_TOKEN is not set')
    return token
  },
  termsOfService: 'https://mercuryo.io/legal/terms',
  get WIDGET_ID() {
    const id =
      env === 'sandbox' ? process.env.SANDBOX_WIDGET_ID : process.env.WIDGET_ID
    if (!id) throw new Error('WIDGET_ID is not set')
    return id
  },
  get WIDGET_URL() {
    const url =
      env === 'sandbox'
        ? process.env.SANDBOX_WIDGET_URL
        : process.env.WIDGET_URL
    if (!url) throw new Error('WIDGET_URL is not set')
    return url
  },
})
