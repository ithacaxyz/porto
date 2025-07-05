interface EnvironmentVariables {
  readonly ENVIRONMENT: 'development' | 'production'
  /** `/onramp` route */
  readonly STRIPE_API_KEY: string
  readonly STRIPE_PUBLISHABLE_KEY: string
  readonly SANDBOX_STRIPE_API_KEY: string
  readonly SANDBOX_STRIPE_PUBLISHABLE_KEY: string

  /** `/faucet` route */
  readonly DRIP_PRIVATE_KEY: `0x${string}`

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
