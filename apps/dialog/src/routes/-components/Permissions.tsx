import { Spinner } from '@porto/apps/components'
import { Hex } from 'ox'
import { Hooks } from 'porto/remote'
import { useMemo, useState } from 'react'
import { erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'
import { porto } from '~/lib/Porto'
import { StringFormatter, ValueFormatter } from '~/utils'
import LucideChevronDown from '~icons/lucide/chevron-down'
import LucideChevronUp from '~icons/lucide/chevron-up'
import ExternalLinkIcon from '~icons/lucide/external-link'
import LucideKey from '~icons/lucide/key'
import LucidePiggyBank from '~icons/lucide/piggy-bank'
import WalletIcon from '~icons/lucide/wallet-cards'

export function Permissions(props: Permissions.Props) {
  const { spend = [], calls = [] } = props

  if (spend.length === 0 && calls.length === 0) return null

  return (
    <div className="px-3">
      <div className="flex items-center gap-3 text-[13px] text-secondary">
        <span>Permissions requested</span>
        <div className="h-px flex-1 border-primary border-t"></div>
      </div>
      <div className="divide-y divide-[color:var(--border-color-primary)]">
        {spend.map((spend) => (
          <SpendPermission
            key={`spend-${spend.token}-${spend.limit}-${spend.period}`}
            {...spend}
          />
        ))}
        {calls.length > 0 && <ContractAccessPermission calls={calls} />}
      </div>
    </div>
  )
}

export declare namespace Permissions {
  type Props = {
    spend?: readonly SpendPermission.Props[]
    calls?: ContractAccessPermission.Props['calls']
  }
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

  const isLoading = token && !displayAmount

  return (
    <div className="flex items-center gap-2 py-3 text-[15px] text-secondary">
      <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-surface">
        {isLoading ? (
          <div className="size-[16px]">
            <Spinner />
          </div>
        ) : (
          <LucidePiggyBank className="size-[16px]" />
        )}
      </div>
      <div>
        Spend{' '}
        <span className="font-medium text-primary">
          {isLoading ? '' : displayAmount} {symbol.data ?? 'ETH'}
        </span>{' '}
        per {period}
      </div>
    </div>
  )
}

declare namespace SpendPermission {
  type Props = {
    limit: `0x${string}`
    period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
    token?: `0x${string}`
  }
}

function ContractAccessPermission(props: ContractAccessPermission.Props) {
  const { calls } = props

  const [isOpen, setIsOpen] = useState(false)

  const chain = Hooks.useChain(porto)
  const explorerUrl = chain?.blockExplorers?.default?.url

  return (
    <div className="flex flex-col">
      <button
        className="flex items-center gap-2 py-3 text-[15px] text-secondary"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-surface">
          <LucideKey className="size-[14px]" />
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
          <div className="flex items-center font-medium text-secondary text-xs">
            <div className="w-[60%] pl-8">
              <span>Contract</span>
            </div>
            <div className="w-[40%]">
              <span>Function</span>
            </div>
          </div>
          {calls.map((call) => (
            <div
              className="flex items-center text-xs"
              key={`call-${call.signature}-${call.to}`}
            >
              <div className="flex w-[60%] min-w-0 items-center">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-jade4">
                  <WalletIcon className="h-4 w-4 text-jade9" />
                </div>
                <span className="ml-2 truncate font-mono text-xs">
                  {call.to ? (
                    <a
                      className="inline-flex cursor-pointer items-center whitespace-nowrap transition-colors hover:text-primary hover:underline"
                      href={
                        explorerUrl
                          ? `${explorerUrl}/address/${call.to}`
                          : undefined
                      }
                      rel="noreferrer"
                      target="_blank"
                    >
                      {StringFormatter.truncate(call.to)}
                      <ExternalLinkIcon className="ml-1 h-3 w-3 flex-shrink-0" />
                    </a>
                  ) : (
                    'Any contract'
                  )}
                </span>
              </div>
              <div className="w-[40%] font-mono">
                {call.signature || 'Any function'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

declare namespace ContractAccessPermission {
  type Props = {
    calls: readonly {
      signature?: string
      to?: `0x${string}`
    }[]
  }
}
