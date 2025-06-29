// import { env as process.env } from 'cloudflare:workers'

export const env = {
  get AUTH_SECRET_KEY() {
    const key = process.env.AUTH_SECRET_KEY
    if (!key) throw new Error('AUTH_SECRET_KEY is not set')
    return key
  },
  get AUTH_SIGN_KEY() {
    const key = process.env.AUTH_SIGN_KEY
    if (!key) throw new Error('AUTH_SIGN_KEY is not set')
    return key
  },
  get MERCURYO_BASE_URL() {
    const url = process.env.MERCURYO_BASE_URL
    if (!url) throw new Error('MERCURYO_BASE_URL is not set')
    return url
  },
  get MERCURYO_SANDBOX_BASE_URL() {
    const url = process.env.MERCURYO_SANDBOX_BASE_URL
    if (!url) throw new Error('MERCURYO_SANDBOX_BASE_URL is not set')
    return url
  },
  get SDK_PARTNER_TOKEN() {
    const token = process.env.SDK_PARTNER_TOKEN
    if (!token) throw new Error('SDK_PARTNER_TOKEN is not set')
    return token
  },
  termsOfService: 'https://mercuryo.io/legal/terms',
  get WIDGET_ID() {
    const id = process.env.WIDGET_ID
    if (!id) throw new Error('WIDGET_ID is not set')
    return id
  },
}
