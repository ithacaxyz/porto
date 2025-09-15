declare const __APP_VERSION__: string

interface EnvironmentVariables {
  readonly ENVIRONMENT: 'local' | 'production'

  /** Workers System Environment Variables */
  readonly WORKERS_CI_BRANCH: string
  readonly WORKERS_CI_COMMIT_SHA: string

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
