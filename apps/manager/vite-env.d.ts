/// <reference types="vite/client" />

interface ImportMetaEnv extends Environment {
  readonly VITE_DIALOG_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

namespace NodeJS {
  interface ProcessEnv {
    readonly RANDOM_PORT: string
    readonly USE_RANDOM_PORT: string
  }
}
