type EnvironmentVariables = {}

namespace Cloudflare {
  interface Env extends EnvironmentVariables {}
}

namespace NodeJS {
  interface ProcessEnv extends EnvironmentVariables {
    readonly NODE_ENV: 'development' | 'production'
  }
}
