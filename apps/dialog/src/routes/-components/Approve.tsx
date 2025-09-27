import {
  Button,
  ChainsPath,
  CopyButton,
  Details,
  Spinner,
  TextButton,
  TokenIcon,
} from '@porto/ui'
import { type Address, Value } from 'ox'
import type * as Rpc from 'porto/core/internal/schema/request'
import * as React from 'react'
import { type Chain, erc20Abi, maxUint256 } from 'viem'
import { useReadContracts } from 'wagmi'
import { PriceFormatter, StringFormatter } from '~/utils'
import LucideLockKeyholeOpen from '~icons/lucide/lock-keyhole-open'
import { ActionPreview } from './ActionPreview'
import { Layout } from './Layout'

export function Approve(props: Approve.Props) {
  const {
    address,
    amount,
    approving,
    capabilities,
    chainsPath,
    expiresAt,
    fetchingQuote,
    onApprove,
    onReject,
    refreshingQuote,
    spender,
    tokenAddress,
  } = props

  const fees = capabilities?.feeTotals
  const loading = !capabilities

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
    <ActionPreview
      account={address}
      actions={
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
            disabled={
              tokenInfo.isLoading ||
              tokenInfo.isError ||
              fetchingQuote ||
              loading
            }
            loading={
              refreshingQuote
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
      }
      header={
        <Layout.Header.Default
          icon={LucideLockKeyholeOpen}
          title="Allow spend"
          variant="default"
        />
      }
      onReject={onReject}
      quotes={capabilities?.quote?.quotes}
    >
      <div className="flex flex-col gap-[8px]">
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
        <Details loading={fetchingQuote || loading}>
          <Details.Item
            label="Requested by"
            value={
              <div className="flex items-center gap-[8px]" title={spender}>
                {StringFormatter.truncate(spender)}
                <CopyButton value={spender} />
              </div>
            }
          />
          {feeFormatted && (
            <Details.Item
              label="Fees (est.)"
              value={<div title={feeFormatted.full}>{feeFormatted.short}</div>}
            />
          )}
          {chainsPath.length > 0 && (
            <Details.Item
              label={`Network${chainsPath.length > 1 ? 's' : ''}`}
              value={
                <ChainsPath chainIds={chainsPath.map((chain) => chain.id)} />
              }
            />
          )}
        </Details>
      </div>
    </ActionPreview>
  )
}

export namespace Approve {
  export type Props = {
    address?: Address.Address | undefined
    amount: bigint
    approving?: boolean | undefined
    capabilities?: Rpc.wallet_prepareCalls.Response['capabilities']
    chainsPath: readonly Chain[]
    expiresAt?: Date
    fetchingQuote?: boolean | undefined
    onApprove: () => void
    onReject: () => void
    refreshingQuote?: boolean | undefined
    spender: Address.Address
    tokenAddress: Address.Address
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
          <div className="absolute flex h-full w-full items-center gap-[8px]">
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
      tokenAddress: Address.Address
      unlimited?: boolean | undefined
    }
  }
}
