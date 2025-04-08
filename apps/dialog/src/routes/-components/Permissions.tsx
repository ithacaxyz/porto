import { Spinner } from '@porto/apps/components'
import { Hex } from 'ox'
import { useMemo, useState } from 'react'
import { erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'
import { StringFormatter, ValueFormatter } from '~/utils'
import LucideChevronDown from '~icons/lucide/chevron-down'
import LucideChevronUp from '~icons/lucide/chevron-up'
import LucideKey from '~icons/lucide/key'
import LucidePiggyBank from '~icons/lucide/piggy-bank'

export function Permissions(props: Permissions.Props) {
  const { capabilities } = props

  if (
    (capabilities?.grantPermissions?.permissions.spend?.length ?? 0) === 0 &&
    (capabilities?.grantPermissions?.permissions.calls?.length ?? 0) === 0
  ) {
    return null
  }

  return (
    <div className="px-4 py-3">
      <div className="mb-2 flex items-center gap-3 text-secondary text-sm">
        <span>Permissions requested</span>
        <div className="h-px flex-1 border-primary border-t"></div>
      </div>
      <div className="divide-y divide-[color:var(--border-color-primary)]">
        {capabilities?.grantPermissions?.permissions.spend?.map((spend) => (
          <SpendPermission
            key={`spend-${spend.token}-${spend.limit}-${spend.period}`}
            {...spend}
          />
        ))}
        {capabilities?.grantPermissions?.permissions.calls &&
          capabilities.grantPermissions.permissions.calls.length > 0 && (
            <ContractAccessPermission
              calls={capabilities.grantPermissions.permissions.calls}
            />
          )}
      </div>
    </div>
  )
}

function SpendPermission(props: SpendPermission.Props) {
  const { limit, period, token } = props

  const symbol = useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: 'symbol',
    query: {
      enabled: !!token,
    },
  })
  const decimals = useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: 'decimals',
    query: {
      enabled: !!token,
    },
  })

  const displayAmount = useMemo(() => {
    if (!decimals.data && token) return null
    return ValueFormatter.format(Hex.toBigInt(limit), decimals.data)
  }, [limit, decimals.data, token])

  return (
    <div className="flex items-center gap-2 py-3 text-secondary text-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface">
        <LucidePiggyBank className="h-5 w-5" />
      </div>
      {displayAmount || !token ? (
        <>
          Spend {displayAmount} {symbol.data ?? 'ETH'} per {period}
        </>
      ) : (
        <Spinner className="text-secondary" />
      )}
    </div>
  )
}

function ContractAccessPermission(props: ContractAccessPermission.Props) {
  const { calls } = props
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col">
      <button
        type="button"
        className="flex items-center gap-2 py-3 text-secondary text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface">
          <LucideKey className="h-5 w-5" />
        </div>
        <span className="flex-1 text-left">Access-related permissions</span>
        {isOpen ? (
          <LucideChevronUp className="h-4 w-4" />
        ) : (
          <LucideChevronDown className="h-4 w-4" />
        )}
      </button>
      {isOpen && (
        <div className="space-y-2 pl-10">
          {calls.map((call) => (
            <div
              className="flex items-center justify-between text-secondary text-sm"
              key={`call-${call.signature}-${call.to}`}
            >
              <span className="font-mono">
                {call.signature || 'Any function'}
              </span>
              <span className="font-mono text-xs">
                {call.to ? StringFormatter.truncate(call.to) : 'Any contract'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

declare namespace Permissions {
  type Props = {
    capabilities?: {
      grantPermissions?: {
        permissions: {
          spend?: readonly {
            limit: `0x${string}`
            period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
            token?: `0x${string}`
          }[]
          calls?: readonly {
            signature?: string
            to?: `0x${string}`
          }[]
        }
      }
    }
  }
}

declare namespace SpendPermission {
  type Props = {
    limit: `0x${string}`
    period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
    token?: `0x${string}`
  }
}

declare namespace ContractAccessPermission {
  type Props = {
    calls: readonly {
      signature?: string
      to?: `0x${string}`
    }[]
  }
}
