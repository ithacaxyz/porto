import { Button, ButtonArea, Details, TokenIcon } from '@porto/ui'
import { a, useTransition } from '@react-spring/web'
import type * as Capabilities from 'porto/core/internal/relay/schema/capabilities'
import * as React from 'react'
import type { Chain } from 'viem'
import { CopyButton } from '~/components/CopyButton'
import { PriceFormatter, StringFormatter, ValueFormatter } from '~/utils'
import ArrowDown from '~icons/lucide/arrow-down'
import LucideSendToBack from '~icons/lucide/send-to-back'
import Star from '~icons/ph/star-four-bold'
import { ActionRequest } from './ActionRequest'
import { Layout } from './Layout'

export function Swap(props: Swap.Props) {
  const {
    assetIn,
    assetOut,
    chainsPath,
    contractAddress,
    fees,
    loading,
    onApprove,
    onReject,
    swapType,
    swapping,
  } = props

  const [fiatDisplay, setFiatDisplay] = React.useState(swapType !== 'convert')

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

  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          icon={swapType === 'convert' ? Star : LucideSendToBack}
          title={swapType === 'convert' ? 'Convert' : 'Review swap'}
          variant="default"
        />
      </Layout.Header>

      <Layout.Content>
        <div className="-mb-[4px] flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[12px] rounded-th_medium bg-th_base-alt px-[10px] py-[12px]">
            <Swap.AssetRow
              asset={assetOut}
              fiatDisplay={fiatDisplay}
              onFiatDisplayChange={setFiatDisplay}
            />
            <div className="-mx-[10px] relative flex justify-center">
              <hr className="absolute top-1/2 w-full border-th_separator border-dashed" />
              <div className="relative flex size-[24px] items-center justify-center rounded-full bg-th_badge">
                <ArrowDown className="size-[16px] text-th_badge" />
              </div>
            </div>
            <Swap.AssetRow
              asset={assetIn}
              fiatDisplay={fiatDisplay}
              onFiatDisplayChange={setFiatDisplay}
            />
            {swapType === 'swap' && contractAddress && (
              <>
                <hr className="-mx-[10px] border-th_separator" />
                <div className="flex flex-row items-center gap-[16px]">
                  <div className="whitespace-nowrap font-medium text-[14px] text-th_base-secondary">
                    Requested by
                  </div>
                  <div
                    className="flex flex-grow items-center justify-end gap-[8px] text-[14px] text-th_base"
                    title={contractAddress}
                  >
                    {StringFormatter.truncate(contractAddress)}
                    <CopyButton value={contractAddress} />
                  </div>
                </div>
              </>
            )}
          </div>
          <Details loading={loading}>
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
            disabled={swapping}
            onClick={onReject}
            variant="negative-secondary"
            width="grow"
          >
            Cancel
          </Button>
          <Button
            disabled={!onApprove}
            loading={swapping && 'Swapping…'}
            onClick={onApprove}
            variant="positive"
            width="grow"
          >
            Swap
          </Button>
        </Layout.Footer.Actions>
      </Layout.Footer>
    </Layout>
  )
}

export namespace Swap {
  export type Props = {
    assetIn: ActionRequest.CoinAsset
    assetOut: ActionRequest.CoinAsset
    chainsPath: readonly Chain[]
    contractAddress?: `0x${string}` | undefined
    fees?: Capabilities.feeTotals.Response | undefined
    loading: boolean
    onApprove: () => void
    onReject: () => void
    swapType: 'swap' | 'convert'
    swapping?: boolean | undefined
  }

  export function AssetRow(props: AssetRow.Props) {
    const { asset, fiatDisplay, onFiatDisplayChange } = props

    const decimals = asset.decimals ?? 18

    const fiatValue = asset.fiat
      ? PriceFormatter.format(Math.abs(asset.fiat.value))
      : null

    const tokenValue = `${ValueFormatter.format(
      asset.value < 0n ? -asset.value : asset.value,
      decimals,
    )} ${asset.symbol}`

    const transition = useTransition(asset.fiat ? fiatDisplay : true, {
      config: { friction: 70, tension: 1300 },
      enter: { opacity: 1, transform: 'scale(1)' },
      from: { opacity: 0, transform: 'scale(0.7)' },
      initial: { opacity: 1, transform: 'scale(1)' },
      leave: { immediate: true, opacity: 0 },
    })

    const assetName = asset.name || asset.symbol || 'Unknown'

    return (
      <div className="flex w-full flex-row items-center gap-[4px]">
        <div className="shrink-0">
          <TokenIcon size={24} symbol={asset.symbol} />
        </div>
        <div className="flex h-[24px] min-w-0 flex-grow items-center gap-[8px]">
          <div className="flex min-w-[120px] items-center gap-[4px]">
            <div
              className="max-w-[120px] truncate font-medium text-[14px] text-th_base"
              title={assetName}
            >
              {assetName}
            </div>
            <div className="flex h-[20px] items-center rounded-th_small bg-th_field px-[4px] font-medium text-[12px] text-th_base-secondary">
              {asset.symbol}
            </div>
          </div>
          <ButtonArea
            className="relative h-full min-w-0 rounded-[4px] font-medium text-[14px] text-th_base-secondary"
            disabled={!asset.fiat}
            onClick={() => onFiatDisplayChange(!fiatDisplay)}
            style={{ flex: '1 1 auto' }}
          >
            {transition((style, fiatDisplay) => {
              const value = fiatDisplay && fiatValue ? fiatValue : tokenValue
              return (
                <div className="absolute inset-0 flex items-center justify-end">
                  <a.span className="truncate" style={style} title={value}>
                    {value}
                  </a.span>
                </div>
              )
            })}
          </ButtonArea>
        </div>
      </div>
    )
  }

  export namespace AssetRow {
    export type Props = {
      asset: ActionRequest.CoinAsset
      fiatDisplay: boolean
      onFiatDisplayChange: (fiatDisplay: boolean) => void
    }
  }
}
