import { Spinner } from '@porto/apps/components'
import { useMemo } from 'react'
import { erc20Abi, zeroAddress } from 'viem'
import { useReadContract } from 'wagmi'
import { ValueFormatter } from '~/utils'
import LucideBanknote from '~icons/lucide/banknote'
import LucideShieldCheck from '~icons/lucide/shield-check'

export function Permissions(props: Permissions.Props) {
  const { calls = [], spend = [], title } = props

  if (spend.length === 0 && calls.length === 0) return null

  return (
    <div className="px-3 pb-1">
      {title && (
        <div className="flex items-center gap-3 text-[13px] text-th_base-secondary">
          <span>{title}</span>
          <div className="h-px flex-1 border-th_base border-t" />
        </div>
      )}
      <div className="divide-y divide-th_separator">
        {spend.map((spend) => (
          <SpendPermission
            key={`spend-${spend.token}-${spend.limit}-${spend.period}`}
            {...spend}
          />
        ))}
        {calls.length > 0 && <ContractAccessPermission />}
      </div>
    </div>
  )
}

export declare namespace Permissions {
  type Props = {
    calls?:
      | readonly {
          signature?: string
          to?: `0x${string}`
        }[]
      | undefined
    spend?: readonly SpendPermission.Props[]
    title?: string | undefined
  }
}

function SpendPermission(props: SpendPermission.Props) {
  const { limit, period, token } = props

  const symbol = useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: 'symbol',
    query: {
      enabled: !!token && token !== zeroAddress,
    },
  })
  const decimals = useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: 'decimals',
    query: {
      enabled: !!token && token !== zeroAddress,
    },
  })

  const displayAmount = useMemo(() => {
    if (token === zeroAddress) return ValueFormatter.format(limit, 18)
    if (!decimals.data) return null
    return ValueFormatter.format(limit, decimals.data)
  }, [limit, decimals.data, token])

  const isLoading = token && !displayAmount

  return (
    <div className="flex items-center gap-2 py-3 text-[15px] text-th_base-secondary">
      <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-th_badge">
        {isLoading ? (
          <div className="size-[16px]">
            <Spinner />
          </div>
        ) : (
          <LucideBanknote className="size-[16px]" />
        )}
      </div>
      <div>
        Spend up to{' '}
        <span className="font-medium text-th_base">
          {isLoading ? '' : displayAmount} {symbol.data ?? 'ETH'}
        </span>{' '}
        per {period}
      </div>
    </div>
  )
}

declare namespace SpendPermission {
  type Props = {
    limit: bigint
    period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
    token?: `0x${string}`
  }
}

function ContractAccessPermission() {
  return (
    <div className="flex items-center gap-2 py-3 text-[15px] text-th_base-secondary">
      <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-th_badge">
        <LucideShieldCheck className="size-[14px]" />
      </div>
      <div>Perform actions on your behalf</div>
    </div>
  )
}
