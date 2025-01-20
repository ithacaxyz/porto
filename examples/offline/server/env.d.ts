// cloudflare workers types
interface Env {
  PORT: string
  ENVIRONMENT: 'development' | 'production'
}

declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    ENVIRONMENT: 'development' | 'production'
  }
}
