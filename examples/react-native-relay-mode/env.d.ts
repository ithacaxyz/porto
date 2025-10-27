interface EnvironmentVariables {
  readonly PORT: string
  readonly NODE_ENV: 'development' | 'production'

  readonly JWT_SECRET: string

  readonly EXPO_PUBLIC_ENV: 'development' | 'production'
  readonly EXPO_PUBLIC_LOG_LEVEL: string
  readonly EXPO_TUNNEL_SUBDOMAIN: string

  readonly EXPO_PUBLIC_SIWE_URL: string
  readonly EXPO_PUBLIC_SERVER_URL: string
}

declare namespace NodeJS {
  interface ProcessEnv extends EnvironmentVariables {}
}

declare namespace Bun {
  interface Env extends EnvironmentVariables {}
}

interface ImportMetaEnv extends Environment {}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
