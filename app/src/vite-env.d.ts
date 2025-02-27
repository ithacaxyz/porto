/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LAUNCH_MODE: 'app' | 'dialog'
  readonly VERCEL_ENV: 'production' | 'preview' | 'development'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
