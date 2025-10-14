interface EnvironmentVariables {
  readonly PORT: string
  readonly NODE_ENV: 'development' | 'production'

  readonly EXPO_PUBLIC_SERVER_DOMAIN: string

  readonly EXPO_PUBLIC_ENV: 'development' | 'production'
  readonly EXPO_PUBLIC_LOG_LEVEL: string
  readonly EXPO_TUNNEL_SUBDOMAIN: string
  readonly EXPO_PUBLIC_SERVER_DOMAIN: string
}

declare namespace NodeJS {
  interface ProcessEnv extends EnvironmentVariables {}
}
