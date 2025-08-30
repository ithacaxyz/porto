import { ChainIcon } from '@porto/apps/components'
import { Button, ButtonArea, Spinner, TokenIcon } from '@porto/ui'
import { a, useTransition } from '@react-spring/web'
import { Value } from 'ox'
import type * as Capabilities from 'porto/core/internal/relay/schema/capabilities'
import * as React from 'react'
import { erc20Abi, maxUint256 } from 'viem'
import { useReadContracts } from 'wagmi'
import { CopyButton } from '~/components/CopyButton'
import { porto } from '~/lib/Porto'
import { PriceFormatter, StringFormatter } from '~/utils'
import LucideInfo from '~icons/lucide/info'
import LucideLockKeyholeOpen from '~icons/lucide/lock-keyhole-open'
import { Layout } from './Layout'

export function Approve(props: Approve.Props) {
  const {
    amount,
    chainId,
    expiresAt,
    fees,
    loading,
    approving,
    onApprove,
    onReject,
    spender,
    tokenAddress,
  } = props

  const tokenResult = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        abi: erc20Abi,
        address: tokenAddress,
        functionName: 'decimals',
      },
      {
        abi: erc20Abi,
        address: tokenAddress,
        functionName: 'symbol',
      },
    ],
  })

  const [decimals, symbol] = tokenResult.data || []
  const [showDetails, setShowDetails] = React.useState(false)
  const infinite = amount === maxUint256

  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          icon={LucideLockKeyholeOpen}
          title="Authorize spend"
          variant="default"
        />
      </Layout.Header>

      <Layout.Content>
        <div className="flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[10px] rounded-th_medium bg-th_base-alt p-[10px]">
            <Approve.AllowanceRow
              amount={
                tokenResult.data &&
                (infinite ? 'Any amount' : Value.format(amount, decimals))
              }
              error={tokenResult.error}
              expiresAt={expiresAt}
              infinite={infinite}
              loading={tokenResult.isLoading}
              symbol={symbol}
            />
            <hr className="-mx-[10px] border-th_separator" />
            <div className="flex flex-row items-center gap-4">
              <div className="whitespace-nowrap font-medium text-[14px] text-th_base-secondary">
                {expiresAt ? 'Requested by' : 'Spender'}
              </div>
              <div
                className="flex flex-grow items-center justify-end gap-2 text-[14px] text-th_base"
                title={spender}
              >
                {StringFormatter.truncate(spender)}
                <CopyButton value={spender} />
              </div>
            </div>
          </div>
          {showDetails ? (
            <div className="flex w-full items-center justify-between gap-[6px] rounded-th_medium bg-th_base-alt px-[12px] text-[13px]">
              <div className="flex w-full flex-col gap-[6px] py-[8px]">
                <Approve.Details
                  chainId={chainId}
                  fees={fees}
                  loading={loading}
                />
              </div>
            </div>
          ) : (
            <ButtonArea
              className="flex h-[34px] w-full items-center justify-center gap-[6px] rounded-th_medium bg-th_base-alt text-[13px] text-th_base-secondary"
              onClick={() => setShowDetails(true)}
            >
              <LucideInfo className="size-4" />
              <span>Show more details</span>
            </ButtonArea>
          )}
        </div>
      </Layout.Content>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            disabled={approving}
            onClick={onReject}
            variant="negative-secondary"
            width="grow"
          >
            Deny
          </Button>
          <Button
            disabled={tokenResult.isLoading || tokenResult.isError}
            loading={approving && 'Approving…'}
            onClick={onApprove}
            variant="positive"
            width="grow"
          >
            Approve
          </Button>
        </Layout.Footer.Actions>
      </Layout.Footer>
    </Layout>
  )
}

export namespace Approve {
  export type Props = {
    amount: bigint
    chainId?: number | undefined
    expiresAt?: Date
    fees?: Capabilities.feeTotals.Response | undefined
    loading?: boolean | undefined
    approving?: boolean | undefined
    onApprove: () => void
    onReject: () => void
    spender: `0x${string}`
    tokenAddress: `0x${string}`
  }

  export function AllowanceRow({
    amount,
    error,
    expiresAt,
    infinite,
    loading,
    symbol,
  }: AllowanceRow.Props) {
    const loadingTransition = useTransition(
      { error, loading },
      {
        config: { friction: 60, tension: 1600 },
        enter: { opacity: 1, transform: 'scale(1)' },
        from: { opacity: 0, transform: 'scale(0.95)' },
        initial: { opacity: 1, transform: 'scale(1)' },
        keys: `${loading}-${error}`,
        leave: { immediate: true, opacity: 0 },
      },
    )
    return (
      <div className="relative flex h-[36px] items-center text-th_base">
        {loadingTransition((style, { loading, error }) =>
          loading || error ? (
            <a.div
              className="absolute grid h-full w-full select-none place-items-center"
              style={style}
            >
              <div className="flex items-center gap-2">
                {error ? (
                  <>{String(error)} </>
                ) : (
                  <>
                    <Spinner /> fetching token data…
                  </>
                )}
              </div>
            </a.div>
          ) : (
            <a.div
              className="absolute flex h-full w-full items-center gap-[8px]"
              style={style}
            >
              <TokenIcon className="shrink-0" symbol={symbol} />
              <div className="flex flex-1 flex-col gap-[4px]">
                <div className="text-nowrap font-medium text-[14px]">
                  Spend {symbol}
                </div>
                <div className="text-nowrap text-[12px] text-th_base-secondary">
                  Expires{' '}
                  {expiresAt ? (
                    <time
                      className="font-[600]"
                      dateTime={expiresAt.toISOString()}
                      title={expiresAt.toLocaleString('en-US')}
                    >
                      {expiresAt.toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                      })}
                    </time>
                  ) : (
                    <span className="font-[600]">never</span>
                  )}
                </div>
              </div>
              <div className="truncate font-medium text-[13px] text-th_base-secondary">
                {infinite
                  ? 'Any amount'
                  : amount &&
                    Intl.NumberFormat('en-US', {
                      maximumFractionDigits: 4,
                    }).format(Number(amount))}
              </div>
            </a.div>
          ),
        )}
      </div>
    )
  }

  export namespace AllowanceRow {
    export type Props = {
      amount?: string | undefined
      error: Error | null
      expiresAt?: Date
      infinite: boolean
      loading: boolean
      symbol?: string | undefined
    }
  }

  export function Details(props: Details.Props) {
    const { chainId, fees, loading } = props

    const feeTotal = React.useMemo(() => {
      if (!fees) return
      const feeTotal = fees['0x0']?.value
      if (!feeTotal) return
      return PriceFormatter.format(Number(feeTotal))
    }, [fees])

    const chain = React.useMemo(
      () => porto.config.chains.find((chain) => chain.id === chainId),
      [chainId],
    )

    if (loading)
      return (
        <div className="flex h-[18px] items-center justify-center text-[14px] text-th_base-secondary">
          Loading details…
        </div>
      )

    return (
      <>
        {fees && (
          <div className="flex h-[18px] items-center justify-between text-[14px]">
            <div className="text-th_base-secondary">Fees (est.)</div>
            <div className="font-medium">{feeTotal}</div>
          </div>
        )}
        {chain && (
          <div className="flex h-[18px] items-center justify-between text-[14px]">
            <span className="text-th_base-secondary">Network</span>
            <div className="flex items-center gap-[6px]">
              <ChainIcon chainId={chain.id} />
              <span className="font-medium">{chain.name}</span>
            </div>
          </div>
        )}
      </>
    )
  }

  export namespace Details {
    export type Props = {
      chainId?: number | undefined
      fees?: Capabilities.feeTotals.Response | undefined
      loading?: boolean | undefined
    }
  }
}
