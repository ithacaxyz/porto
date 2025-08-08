/// <reference types="vite/client" />

declare const __APP_VERSION__: string

interface Environment {
  readonly VERCEL_GIT_COMMIT_SHA: string
  readonly VITE_VERCEL_ENV: 'production' | 'preview' | 'development'
}

interface ImportMetaEnv extends Environment {}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv extends Environment {}
}

declare module 'virtual:chain-icons' {
  import type { ComponentType } from 'react'

  export const icons: Record<number, ComponentType>
  export type Icons = typeof icons
}
