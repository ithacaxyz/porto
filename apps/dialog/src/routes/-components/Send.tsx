import { Button, ButtonArea, ChainsPath, CopyButton, Details } from '@porto/ui'
import type { Address } from 'ox'
import type * as Rpc from 'porto/core/internal/schema/request'
import * as React from 'react'
import type { Chain } from 'viem'
import { AddressFormatter, PriceFormatter, ValueFormatter } from '~/utils'
import LucideArrowUpRight from '~icons/lucide/arrow-up-right'
import LucideSendHorizontal from '~icons/lucide/send-horizontal'
import { ActionPreview } from './ActionPreview'
import type { ActionRequest } from './ActionRequest'
import { Layout } from './Layout'

export function Send(props: Send.Props) {
  const {
    address,
    asset,
    capabilities,
    chainsPath,
    fetchingQuote,
    onApprove,
    onReject,
    refreshingQuote,
    sending,
    to,
  } = props

  const fees = capabilities?.feeTotals
  const loading = !capabilities

  const [currencyType, setCurrencyType] = React.useState<'fiat' | 'token'>(
    asset.fiat ? 'fiat' : 'token',
  )

  const toggle = () => {
    if (!asset.fiat) return
    setCurrencyType(currencyType === 'fiat' ? 'token' : 'fiat')
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

  return (
    <ActionPreview
      account={address}
      actions={
        <Layout.Footer.Actions>
          <Button
            disabled={sending}
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
                : sending
                  ? 'Sending…'
                  : undefined
            }
            onClick={onApprove}
            variant="positive"
            width="grow"
          >
            Send
          </Button>
        </Layout.Footer.Actions>
      }
      header={
        <Layout.Header.Default
          icon={LucideSendHorizontal}
          title="Review send"
          variant="default"
        />
      }
      onReject={onReject}
      quotes={capabilities?.quote?.quotes}
    >
      <div className="flex flex-col gap-[8px]">
        <div className="flex flex-col gap-[10px] rounded-th_medium bg-th_base-alt px-[10px] py-[10px]">
          <div className="flex w-full flex-row items-stretch gap-[8px]">
            <div className="flex shrink-0 items-center">
              <div className="flex size-6 items-center justify-center rounded-full bg-th_badge">
                <LucideArrowUpRight className="size-4 text-th_badge" />
              </div>
            </div>
            <div className="flex flex-grow flex-col justify-center whitespace-nowrap">
              <div className="font-medium text-[14px] text-th_base">
                Send {asset.symbol}
              </div>
              <div className="flex items-center gap-[4px] text-[12px] text-th_base-secondary">
                <span>to</span>
                <span title={to}>{AddressFormatter.shorten(to)}</span>
                <CopyButton
                  className="-my-[2px] -ml-[1px]"
                  size="mini"
                  value={to}
                />
              </div>
            </div>
            <Send.AmountButton
              asset={asset}
              currencyType={currencyType}
              onToggleCurrency={toggle}
            />
          </div>
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

export namespace Send {
  export type Props = {
    address?: Address.Address | undefined
    asset: ActionRequest.CoinAsset
    capabilities?: Rpc.wallet_prepareCalls.Response['capabilities']
    chainsPath: readonly Chain[]
    fetchingQuote?: boolean | undefined
    onApprove: () => void
    onReject: () => void
    refreshingQuote?: boolean | undefined
    sending?: boolean | undefined
    to: Address.Address
  }

  export function AmountButton(props: AmountButton.Props) {
    const { asset, currencyType, onToggleCurrency } = props

    const decimals = asset.decimals ?? 18

    const fiatValue = asset.fiat
      ? PriceFormatter.format(Math.abs(asset.fiat.value))
      : null
    const tokenValue = `${ValueFormatter.format(
      asset.value < 0n ? -asset.value : asset.value,
      decimals,
    )} ${asset.symbol}`

    return (
      <ButtonArea
        className="min-w-0 items-center justify-end rounded-[4px] font-medium text-[14px] text-th_base-secondary"
        disabled={!asset.fiat}
        onClick={onToggleCurrency}
        style={{ flex: '1 1 auto' }}
      >
        <div
          className="truncate whitespace-nowrap"
          title={currencyType === 'fiat' && fiatValue ? fiatValue : tokenValue}
        >
          {currencyType === 'fiat' && fiatValue ? fiatValue : tokenValue}
        </div>
      </ButtonArea>
    )
  }

  export namespace AmountButton {
    export type Props = {
      asset: ActionRequest.CoinAsset
      currencyType: 'fiat' | 'token'
      onToggleCurrency: () => void
    }
  }
}
