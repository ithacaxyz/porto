interface EnvironmentVariables {
  readonly SDK_PARTNER_TOKEN: string

  readonly MERCURYO_API_KEY: string
  readonly AUTH_SECRET_KEY: string
  readonly AUTH_SIGN_KEY: string
  readonly MERCURYO_BASE_URL: string
  readonly SDK_PARTNER_TOKEN: string
  readonly MERCURYO_SANDBOX_BASE_URL: string
  readonly WIDGET_ID: string
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
