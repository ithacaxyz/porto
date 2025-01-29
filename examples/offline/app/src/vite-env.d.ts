/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string
  readonly VITE_ENVIRONMENT: 'development' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
