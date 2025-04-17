export const defaultEnv =
  import.meta.env.VITE_VERCEL_ENV === 'preview' ? 'stg' : 'prod'

export const envs = ['anvil', 'prod', 'stg', 'testnet'] as const
export type Env = 'anvil' | 'prod' | 'stg' | 'testnet'

export function get(): Env {
  if (typeof window === 'undefined') return defaultEnv

  const url = new URL(window.location.href)
  const env = url.searchParams.get('env') ?? window.location.host.split('.')[0]
  if (env && envs.includes(env as Env)) return env as Env

  return defaultEnv
}
