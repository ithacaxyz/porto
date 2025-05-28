type EnvironmentVariables = {}

namespace Cloudflare {
  interface Env extends EnvironmentVariables {
    VERIFY_CONFIG_URL: string
  }
}

namespace NodeJS {
  interface ProcessEnv extends EnvironmentVariables {
    readonly NODE_ENV: 'development' | 'production'
  }
}
