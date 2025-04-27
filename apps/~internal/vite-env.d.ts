/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VERCEL_ENV: string
  readonly VITE_VERCEL_BRANCH_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
