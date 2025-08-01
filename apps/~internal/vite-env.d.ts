/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DIALOG_HOST: string
  readonly VITE_DEFAULT_ENV: string
  readonly VITE_VERCEL_ENV: string
  readonly VITE_VERCEL_BRANCH_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'virtual:chain-icons' {
  import type { ComponentType } from 'react'

  export const icons: Record<number, ComponentType>
  export type Icons = typeof icons
}
