/// <reference types="vite/client" />

// biome-ignore lint/suspicious/noEmptyInterface:
interface ImportMetaEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
