interface EnvironmentVariables {
  readonly DRIP_ADDRESS: `0x${string}`
  readonly DRIP_PRIVATE_KEY: `0x${string}`
  readonly DRIP_AMOUNT: string
}

namespace Cloudflare {
  interface Env extends EnvironmentVariables {}
}

namespace NodeJS {
  interface ProcessEnv extends EnvironmentVariables {
    readonly NODE_ENV: 'development' | 'production'
  }
}
