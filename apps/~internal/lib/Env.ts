export const defaultEnv = (() => {
  if (import.meta.env.VITE_VERCEL_ENV === 'preview') return 'stg'
  if (import.meta.env.VITE_DEFAULT_ENV)
    return import.meta.env.VITE_DEFAULT_ENV as Env
  return 'stg'
})()

export const envs = ['prod', 'stg', 'anvil'] as const
export type Env = (typeof envs)[number]

export function get(): Env {
  if (typeof window === 'undefined') return defaultEnv

  const url = new URL(window.location.href)
  const env =
    url.searchParams.get('env') ?? window.location.host.split(/\.|-/)[0]
  if (env && envs.includes(env as Env)) return env as Env

  return defaultEnv
}
