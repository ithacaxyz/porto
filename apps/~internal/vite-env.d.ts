/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_CHAIN_ID: string
  readonly VITE_DEV_RPC_URL: string
  readonly VITE_DIALOG_HOST: string
  readonly VITE_DEFAULT_ENV: string
  readonly VITE_VERCEL_ENV: string
  readonly VITE_VERCEL_BRANCH_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
