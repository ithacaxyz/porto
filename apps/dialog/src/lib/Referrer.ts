import { useQuery } from '@tanstack/react-query'

import * as Dialog from '~/lib/Dialog'

export function useVerify() {
  const hostname = Dialog.useStore((state) => state.referrer?.url.hostname)

  return useQuery<useVerify.Data>({
    queryFn: async () => {
      if (!hostname) return { status: 'unknown' }

      const response = (await fetch(
        (import.meta.env.VITE_VERIFY_URL ||
          'https://verify.porto.workers.dev') + `?hostname=${hostname}`,
      )
        .then((x) => x.json())
        .catch(() => ({}))) as {
        whitelist?: string[] | undefined
        blacklist?: string[] | undefined
      }

      const whitelisted =
        response.whitelist?.some((h) => hostname.endsWith(h)) ||
        extraConfig.whitelist.some((h) => hostname.endsWith(h))
      const blacklisted =
        response.blacklist?.some((h) => hostname.endsWith(h)) ||
        extraConfig.blacklist.some((h) => hostname.endsWith(h))

      if (blacklisted) return { status: 'danger' }
      if (whitelisted) return { status: 'verified' }
      return { status: 'unknown' }
    },
    queryKey: ['verify', hostname],
  })
}

export declare namespace useVerify {
  type Data = {
    status: 'verified' | 'danger' | 'development' | 'unknown'
  }
}

const extraConfig = {
  blacklist: [],
  whitelist: ['porto.sh'],
} as const
