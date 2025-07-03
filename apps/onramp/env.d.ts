interface EnvironmentVariables {
  ENVIRONMENT: 'sandbox' | 'production'
  readonly SDK_PARTNER_TOKEN: string
  readonly WIDGET_ID: string
  readonly AUTH_SECRET_KEY: string
  readonly AUTH_SIGN_KEY: string
  readonly API_BASE_URL: string
  readonly WIDGET_URL: string

  readonly SANDBOX_SDK_PARTNER_TOKEN: string
  readonly SANDBOX_WIDGET_ID: string
  readonly SANDBOX_AUTH_SECRET_KEY: string
  readonly SANDBOX_AUTH_SIGN_KEY: string
  readonly SANDBOX_API_BASE_URL: string
  readonly SANDBOX_WIDGET_URL: string
}

namespace Cloudflare {
  interface Env extends EnvironmentVariables {
    readonly RATE_LIMITER: {
      limit: (params: { key: string }) => Promise<{ success: boolean }>
    }
  }
}

namespace NodeJS {
  interface ProcessEnv extends EnvironmentVariables {
    readonly NODE_ENV: 'development' | 'production'
  }
}
