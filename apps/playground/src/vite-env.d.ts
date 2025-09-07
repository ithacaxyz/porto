/// <reference types="vite/client" />

declare const __APP_VERSION__: string

interface EnvironmentVariables {
  readonly NODE_ENV: 'development' | 'production'
  readonly VERCEL_ENV: 'development' | 'production' | 'preview'
}

declare namespace NodeJS {
  interface ProcessEnv extends EnvironmentVariables {}
}

interface ImportMetaEnv extends Environment {}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'virtual:chain-icons' {
  import type { ComponentType } from 'react'

  export const icons: Record<number, ComponentType>
  export type Icons = typeof icons
}
