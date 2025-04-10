export const defaultEnv = 'prod'

export const envs = ['anvil', 'stg', 'prod'] as const
export type Env = 'anvil' | 'stg' | 'prod'

export function get(): Env {
  if (typeof window === 'undefined') return defaultEnv

  const url = new URL(window.location.href)
  const env = url.searchParams.get('env') ?? window.location.host.split('.')[0]
  if (env && envs.includes(env as Env)) return env as Env

  return defaultEnv
}
