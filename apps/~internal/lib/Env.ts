export const defaultEnv = 'prod'

export const envs = ['anvil', 'stg', 'prod'] as const
export type Env = 'anvil' | 'stg' | 'prod'

export function get(): Env {
  if (typeof window === 'undefined') return defaultEnv
  const host_ = window.location.host.split('.')[0]
  return envs.includes(host_ as Env) ? (host_ as Env) : defaultEnv
}
