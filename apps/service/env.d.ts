interface EnvironmentVariables {
  readonly ENVIRONMENT: 'local' | 'production'

  readonly APP_VERSION: string

  /** `/onramp` route */
  readonly CB_API_KEY_ID: string
  readonly CB_API_KEY_SECRET: string

  /** `/verify` route */
  readonly VERIFY_CONFIG_URL: string
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
