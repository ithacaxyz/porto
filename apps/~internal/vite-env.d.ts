/// <reference types="vite/client" />

declare const __APP_VERSION__: string

interface ImportMetaEnv extends Environment {}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
