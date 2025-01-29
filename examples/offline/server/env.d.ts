interface Env {
  Bindings: {
    KEYS_01: KVNamespace
    ENVIRONMENT: 'development' | 'production'
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    ENVIRONMENT: 'development' | 'production'
  }
}
