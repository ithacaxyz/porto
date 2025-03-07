/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LAUNCH_MODE: 'app' | 'dialog'
  readonly VITE_ENVIRONMENT: 'development' | 'production'
  readonly VERCEL_ENV: 'production' | 'preview' | 'development'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
