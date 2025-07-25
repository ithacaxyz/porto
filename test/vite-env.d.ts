/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly VITE_DEFAULT_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
