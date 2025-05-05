/// <reference types="vite/client" />

declare const __APP_VERSION__: string

interface Environment {
  readonly VERCEL_GIT_COMMIT_SHA: string
}

interface ImportMetaEnv extends Environment {
  readonly VITE_FLAGS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
