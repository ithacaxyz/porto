/// <reference types="vite/client" />

declare const __APP_VERSION__: string

interface ImportMetaEnv extends Environment {
  readonly VERCEL_GIT_COMMIT_SHA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
