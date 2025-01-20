// cloudflare workers types
interface Environment {
  PORT: string
  KV: KVNamespace
  ENVIRONMENT: 'development' | 'production'
}

declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    ENVIRONMENT: 'development' | 'production'
  }
}
