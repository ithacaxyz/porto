import { Button, Details, Spinner, TokenIcon } from '@porto/ui'
import { a, useTransition } from '@react-spring/web'
import { Value } from 'ox'
import type * as Capabilities from 'porto/core/internal/relay/schema/capabilities'
import * as React from 'react'
import { type Chain, erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'
import { CopyButton } from '~/components/CopyButton'
import { PriceFormatter, StringFormatter } from '~/utils'
import LucideLockKeyholeOpen from '~icons/lucide/lock-keyhole-open'
import { Layout } from './Layout'
import { ActionRequest } from './ActionRequest'

export function Approve(props: Approve.Props) {
  const {
    amount,
    approving,
    chainsPath,
    expiresAt,
    fees,
    loading,
    onApprove,
    onReject,
    spender,
    tokenAddress,
    unlimited,
  } = props

  const { feeTotalFormatted, feeTotalFormattedFull } = React.useMemo(() => {
    if (!fees)
      return {
        feeTotalFormatted: undefined,
        feeTotalFormattedFull: undefined,
      }
    const feeTotal = fees['0x0']?.value
    if (!feeTotal)
      return {
        feeTotalFormatted: undefined,
        feeTotalFormattedFull: undefined,
      }
    const feeNumber = Number(feeTotal)
    return {
      feeTotalFormatted: PriceFormatter.format(feeNumber),
      feeTotalFormattedFull: new Intl.NumberFormat('en-US', {
        currency: 'USD',
        maximumFractionDigits: 8,
        minimumFractionDigits: 2,
        style: 'currency',
      }).format(feeNumber),
    }
  }, [fees])

  const chainId = chainsPath[0]?.id

  const tokenResult = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        abi: erc20Abi,
        address: tokenAddress,
        chainId: chainId as never,
        functionName: 'decimals',
      },
      {
        abi: erc20Abi,
        address: tokenAddress,
        chainId: chainId as never,
        functionName: 'name',
      },
      {
        abi: erc20Abi,
        address: tokenAddress,
        chainId: chainId as never,
        functionName: 'symbol',
      },
    ],
  })

  const [decimals, name, symbol] = tokenResult.data || []

  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          icon={LucideLockKeyholeOpen}
          title="Allow spend"
          variant="default"
        />
      </Layout.Header>

      <Layout.Content>
        <div className="-mb-[4px] flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[10px] rounded-th_medium bg-th_base-alt p-[10px]">
            <Approve.AllowanceRow
              amount={
                tokenResult.data &&
                (unlimited ? 'Any amount' : Value.format(amount, decimals))
              }
              error={tokenResult.error}
              expiresAt={expiresAt}
              loading={tokenResult.isLoading}
              name={name}
              symbol={symbol}
              unlimited={unlimited}
            />
          </div>
          <Details loading={loading}>
            <div className="flex h-[18px] items-center justify-between text-[14px]">
              <span className="text-th_base-secondary">Requested by</span>
              <div
                className="flex items-center gap-[8px] font-medium"
                title={spender}
              >
                {StringFormatter.truncate(spender)}
                <CopyButton value={spender} />
              </div>
            </div>
            {feeTotalFormatted && (
              <div className="flex h-[18px] items-center justify-between text-[14px]">
                <div className="text-th_base-secondary">Fees (est.)</div>
                <div className="font-medium" title={feeTotalFormattedFull}>
                  {feeTotalFormatted}
                </div>
              </div>
            )}
            <ActionRequest.ChainsPath chainsPath={chainsPath} />
          </Details>
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
    approving?: boolean | undefined
    chainsPath: readonly Chain[]
    expiresAt?: Date
    fees?: Capabilities.feeTotals.Response | undefined
    loading?: boolean | undefined
    onApprove: () => void
    onReject: () => void
    spender: `0x${string}`
    tokenAddress: `0x${string}`
    unlimited?: boolean | undefined
  }

  export function AllowanceRow({
    amount,
    error,
    expiresAt,
    loading,
    name,
    symbol,
    unlimited,
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
                <div className="font-medium text-[14px] text-th_base">
                  {name || 'Unknown'}
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
                {unlimited
                  ? 'Any amount'
                  : amount &&
                    `${Intl.NumberFormat('en-US', {
                      maximumFractionDigits: 4,
                    }).format(Number(amount))} ${symbol}`}
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
      unlimited?: boolean | undefined
      loading: boolean
      name?: string | undefined
      symbol?: string | undefined
    }
  }
}
