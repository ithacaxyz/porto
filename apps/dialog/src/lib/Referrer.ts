import { useQuery } from '@tanstack/react-query'

import * as Dialog from '~/lib/Dialog'

export function useVerify() {
  const hostname = Dialog.useStore((state) => state.referrer?.url?.hostname)

  return useQuery<useVerify.Data>({
    queryFn: async () => {
      if (!hostname) return { status: 'unknown' }

      return (await fetch(
        (import.meta.env.VITE_VERIFY_URL ||
          'https://verify.porto.workers.dev') + `?hostname=${hostname}`,
      )
        .then((x) => x.json())
        .catch(() => ({}))) as useVerify.Data
    },
    queryKey: ['verify', hostname],
  })
}

export declare namespace useVerify {
  type Data = {
    status: 'whitelisted' | 'blacklisted' | 'unknown'
  }
}
