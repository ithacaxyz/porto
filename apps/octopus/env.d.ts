interface EnvironmentVariables {
  readonly ENVIRONMENT: 'development' | 'production'
  readonly STRIPE_API_KEY: string
  readonly STRIPE_PUBLISHABLE_KEY: string
  readonly SANDBOX_STRIPE_API_KEY: string
  readonly SANDBOX_STRIPE_PUBLISHABLE_KEY: string
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
