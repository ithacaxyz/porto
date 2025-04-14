/// <reference types="vite/client" />

interface ImportMetaEnv extends Environment {
  readonly VITE_DIALOG_HOST: string
  readonly VITE_WALLETCONNECT_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
