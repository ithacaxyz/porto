/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DIALOG_HOST: string
  readonly VITE_DEFAULT_ENV: string
  readonly VITE_VERCEL_ENV: string
  readonly VITE_VERCEL_BRANCH_URL: string

  readonly VITE_RPC_URL_ARBITRUM: string | undefined
  readonly VITE_RPC_URL_BASE: string | undefined
  readonly VITE_RPC_URL_BSC: string | undefined
  readonly VITE_RPC_URL_OPTIMISM: string | undefined
  readonly VITE_RPC_URL_POLYGON: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'virtual:chain-icons' {
  import type { ComponentType } from 'react'

  export const icons: Record<number, ComponentType>
  export type Icons = typeof icons
}
