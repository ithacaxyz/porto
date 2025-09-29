import {
  Button,
  ButtonArea,
  ChainsPath,
  CopyButton,
  Details,
  TokenIcon,
} from '@porto/ui'
import type { Address } from 'ox'
import type * as Rpc from 'porto/core/internal/schema/request'
import * as React from 'react'
import type { Chain } from 'viem'
import { AddressFormatter, PriceFormatter, ValueFormatter } from '~/utils'
import ArrowDown from '~icons/lucide/arrow-down'
import LucideSendToBack from '~icons/lucide/send-to-back'
import Star from '~icons/ph/star-four-bold'
import { ActionPreview } from './ActionPreview'
import type { ActionRequest } from './ActionRequest'
import { Layout } from './Layout'

export function Swap(props: Swap.Props) {
  const {
    address,
    assetIn,
    assetOut,
    capabilities,
    chainsPath,
    contractAddress,
    fetchingQuote,
    onApprove,
    onReject,
    refreshingQuote,
    swapType,
    swapping,
  } = props

  const [fiatDisplay, setFiatDisplay] = React.useState(swapType !== 'convert')
  const fees = capabilities?.feeTotals
  const loading = !capabilities

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
    <ActionPreview
      account={address}
      actions={
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
            disabled={!onApprove || fetchingQuote || loading}
            loading={
              refreshingQuote
                ? 'Refreshing quote…'
                : swapping
                  ? 'Swapping…'
                  : undefined
            }
            onClick={onApprove}
            variant="positive"
            width="grow"
          >
            Swap
          </Button>
        </Layout.Footer.Actions>
      }
      header={
        <Layout.Header.Default
          icon={swapType === 'convert' ? Star : LucideSendToBack}
          title={swapType === 'convert' ? 'Convert' : 'Review swap'}
          variant="default"
        />
      }
      onReject={onReject}
      quotes={capabilities?.quote?.quotes}
    >
      <div className="flex flex-col gap-[8px]">
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
                  className="-mr-[4px] flex flex-grow items-center justify-end gap-[2px] text-[14px] text-th_base"
                  title={contractAddress}
                >
                  {AddressFormatter.shorten(contractAddress)}
                  <CopyButton value={contractAddress} />
                </div>
              </div>
            </>
          )}
        </div>
        <Details loading={fetchingQuote || loading}>
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

export namespace Swap {
  export type Props = {
    address?: Address.Address | undefined
    assetIn: ActionRequest.CoinAsset
    assetOut: ActionRequest.CoinAsset
    capabilities?: Rpc.wallet_prepareCalls.Response['capabilities']
    chainsPath: readonly Chain[]
    contractAddress?: Address.Address | undefined
    fetchingQuote?: boolean | undefined
    onApprove: () => void
    onReject: () => void
    refreshingQuote?: boolean | undefined
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

    const assetName = asset.name || asset.symbol || 'Unknown'

    return (
      <div className="flex w-full flex-row items-center gap-[4px]">
        <div className="shrink-0">
          <TokenIcon border={3} size={24} symbol={asset.symbol} />
        </div>
        <div className="flex h-[24px] min-w-0 flex-grow items-center justify-between gap-[8px]">
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
            className="h-full min-w-0 rounded-[4px] font-medium text-[14px] text-th_base-secondary"
            disabled={!asset.fiat}
            onClick={() => onFiatDisplayChange(!fiatDisplay)}
            style={{ flex: '1 1 auto' }}
          >
            <div className="flex w-full items-center justify-end">
              <span
                className="truncate"
                title={fiatDisplay && fiatValue ? fiatValue : tokenValue}
              >
                {fiatDisplay && fiatValue ? fiatValue : tokenValue}
              </span>
            </div>
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
