import {
  Button,
  CopyButton,
  Details,
  Spinner,
  TextButton,
  TokenIcon,
} from '@porto/ui'
import { Value } from 'ox'
import type * as Capabilities from 'porto/core/internal/relay/schema/capabilities'
import * as React from 'react'
import { type Address, type Chain, erc20Abi, maxUint256 } from 'viem'
import { useReadContracts } from 'wagmi'
import { PriceFormatter, StringFormatter } from '~/utils'
import LucideLockKeyholeOpen from '~icons/lucide/lock-keyhole-open'
import { ActionRequest } from './ActionRequest'
import { Layout } from './Layout'

export function Approve(props: Approve.Props) {
  const {
    amount,
    approving,
    chainsPath,
    expiresAt,
    fees,
    fetchingQuote,
    onApprove,
    onReject,
    spender,
    tokenAddress,
  } = props

  let { unlimited } = props
  if (unlimited === undefined) {
    const precisionLossTolerance = 10n ** 64n
    unlimited =
      amount > (maxUint256 / precisionLossTolerance) * precisionLossTolerance
  }

  const feeFormatted = React.useMemo(() => {
    const feeTotal = fees?.['0x0']?.value
    if (!feeTotal) return null
    const feeNumber = Number(feeTotal)
    return {
      full: new Intl.NumberFormat('en-US', {
        currency: 'USD',
        maximumFractionDigits: 8,
        minimumFractionDigits: 2,
        style: 'currency',
      }).format(feeNumber),
      short: PriceFormatter.format(feeNumber),
    }
  }, [fees])

  const chainId = chainsPath[0]?.id

  const tokenInfo = useReadContracts({
    allowFailure: true,
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
    query: {
      select: ([decimals, name, symbol]) => ({
        decimals: decimals.result ?? 18,
        name: name.result,
        symbol: symbol.result,
      }),
    },
  })

  if (tokenInfo.isError) console.error(tokenInfo.error)

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
                unlimited
                  ? 'Any amount'
                  : tokenInfo.data &&
                    Value.format(amount, tokenInfo.data.decimals)
              }
              error={tokenInfo.error}
              expiresAt={expiresAt}
              loading={tokenInfo.isLoading}
              name={tokenInfo.data?.name}
              onRefetch={() => tokenInfo.refetch()}
              symbol={tokenInfo.data?.symbol}
              tokenAddress={tokenAddress}
              unlimited={unlimited}
            />
          </div>
          <Details loading={fetchingQuote}>
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
            {feeFormatted && (
              <div className="flex h-[18px] items-center justify-between text-[14px]">
                <div className="text-th_base-secondary">Fees (est.)</div>
                <div className="font-medium" title={feeFormatted.full}>
                  {feeFormatted.short}
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
            Cancel
          </Button>
          <Button
            disabled={fetchingQuote || tokenInfo.isLoading || tokenInfo.isError}
            loading={
              fetchingQuote
                ? 'Refreshing quote…'
                : approving
                  ? 'Approving…'
                  : undefined
            }
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
    fetchingQuote?: boolean | undefined
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
    onRefetch,
    symbol,
    tokenAddress,
    unlimited,
  }: AllowanceRow.Props) {
    return (
      <div className="relative flex h-[36px] items-center text-th_base">
        {loading || error ? (
          <div className="absolute grid h-full w-full select-none place-items-center">
            <div className="flex items-center gap-2">
              {error ? (
                <>
                  Error fetching token data.{' '}
                  <TextButton className="text-th_link!" onClick={onRefetch}>
                    Retry
                  </TextButton>
                </>
              ) : (
                <>
                  <Spinner /> fetching token data…
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center gap-[8px]">
            <TokenIcon className="shrink-0" symbol={symbol} />
            <div className="flex flex-1 flex-col gap-[4px]">
              <div
                className="text-nowrap font-medium text-[14px] text-th_base"
                title={name ? `${name} (${tokenAddress})` : tokenAddress}
              >
                {name ||
                  StringFormatter.truncate(tokenAddress, {
                    end: 3,
                    start: 5,
                  })}
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
                  }).format(Number(amount))} ${symbol ?? ''}`}
            </div>
          </div>
        )}
      </div>
    )
  }

  export namespace AllowanceRow {
    export type Props = {
      amount?: string | undefined
      error: Error | null
      expiresAt?: Date
      loading: boolean
      name?: string | undefined
      onRefetch?: (() => void) | undefined
      symbol?: string | undefined
      tokenAddress: Address
      unlimited?: boolean | undefined
    }
  }
}
