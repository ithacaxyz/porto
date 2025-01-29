// cloudflare workers types
interface Env {
  Bindings: {
    KV: KVNamespace
    KEYS_01: KVNamespace
    PORT: string
    ENVIRONMENT: 'development' | 'production'
  }
  Variables: {
    KEY: string
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    ENVIRONMENT: 'development' | 'production'
  }
}
