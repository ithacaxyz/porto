/// <reference types="vite/client" />

interface ImportMetaEnv extends Environment {
  readonly VITE_DIALOG_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
