import { useQuery } from '@tanstack/react-query'
import * as TrustedHosts from 'porto/trusted-hosts'
import * as React from 'react'

import * as Dialog from '~/lib/Dialog'

export function useTrusted(scopes?: readonly TrustedHosts.Scope[] | undefined) {
  const referrer = Dialog.useStore((state) => state.referrer)
  const verifyStatus = useVerify()

  return React.useMemo(() => {
    if (!referrer?.url?.hostname) return false
    if (verifyStatus.data?.status === 'whitelisted') return true
    return TrustedHosts.includes(referrer?.url?.hostname, scopes)
  }, [referrer, verifyStatus.data?.status])
}

export function useVerify() {
  const hostname = Dialog.useStore((state) => state.referrer?.url?.hostname)

  return useQuery<useVerify.Data>({
    queryFn: async () => {
      if (!hostname) return { status: 'unknown' }

      return (await fetch(
        import.meta.env.VITE_WORKERS_URL + `/verify?hostname=${hostname}`,
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
