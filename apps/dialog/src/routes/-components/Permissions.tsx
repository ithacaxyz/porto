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
import WalletIcon from '~icons/lucide/wallet-cards'

export function Permissions(props: Permissions.Props) {
  const { capabilities } = props

  if (
    (capabilities?.grantPermissions?.permissions.spend?.length ?? 0) === 0 &&
    (capabilities?.grantPermissions?.permissions.calls?.length ?? 0) === 0
  ) {
    return null
  }

  return (
    <div className="px-3">
      <div className="flex items-center gap-3 text-[13px] text-secondary">
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
    <div className="flex items-center gap-2 py-3 text-[15px] text-secondary">
      <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-surface">
        <LucidePiggyBank />
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
        className="flex items-center gap-2 py-3 text-[15px] text-secondary"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-surface">
          <LucideKey />
        </div>
        <span className="flex-1 text-left">Access-related permissions</span>
        {isOpen ? (
          <LucideChevronUp className="h-4 w-4" />
        ) : (
          <LucideChevronDown className="h-4 w-4" />
        )}
      </button>
      {isOpen && (
        <div className="space-y-2 pl-2">
          <div className="flex items-center font-medium text-secondary text-sm">
            <div className="flex-1 pl-8">
              <span>Contract</span>
            </div>
            <div className="w-[8.75rem]">
              <span>Function</span>
            </div>
          </div>
          {calls.map((call) => (
            <div
              className="flex items-center text-secondary text-xs"
              key={`call-${call.signature}-${call.to}`}
            >
              <div className="flex flex-1 items-center">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-jade4">
                  <WalletIcon className="h-4 w-4 text-jade9" />
                </div>
                <span className="ml-2 font-mono text-xs">
                  {call.to ? StringFormatter.truncate(call.to) : 'Any contract'}
                </span>
              </div>
              <div className="w-[8.75rem] font-mono">
                {call.signature || 'Any function'}
              </div>
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
