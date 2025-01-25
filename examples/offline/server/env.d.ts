// cloudflare workers types
interface Env {
  Bindings: {
    KV: KVNamespace
    PORT: string
    ENVIRONMENT: 'development' | 'production'
  }
  Variables: {
    KEY_PAIR: string
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    ENVIRONMENT: 'development' | 'production'
  }
}
