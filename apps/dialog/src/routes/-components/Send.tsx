import { Button, ButtonArea, ChainsPath, CopyButton, Details } from '@porto/ui'
import type * as Capabilities from 'porto/core/internal/relay/schema/capabilities'
import * as React from 'react'
import type { Chain } from 'viem'
import { PriceFormatter, StringFormatter, ValueFormatter } from '~/utils'
import LucideArrowUpRight from '~icons/lucide/arrow-up-right'
import LucideSendHorizontal from '~icons/lucide/send-horizontal'
import type { ActionRequest } from './ActionRequest'
import { Layout } from './Layout'

export function Send(props: Send.Props) {
  const {
    asset,
    chainsPath,
    fees,
    fetchingQuote,
    onApprove,
    onReject,
    onAddFunds,
    refreshingQuote,
    sending,
    to,
    hasDeficit,
  } = props

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
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          icon={LucideSendHorizontal}
          title="Review send"
          variant="default"
        />
      </Layout.Header>

      <Layout.Content>
        <div className="-mb-[4px] flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[10px] rounded-th_medium bg-th_base-alt px-[10px] py-[10px]">
            <div className="flex w-full flex-row items-center gap-[8px]">
              <div className="shrink-0">
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
                  <span title={to}>{StringFormatter.truncate(to)}</span>
                  <CopyButton value={to} />
                </div>
              </div>
              <Send.AmountButton
                asset={asset}
                currencyType={currencyType}
                onToggleCurrency={toggle}
              />
            </div>
          </div>
          <Details loading={fetchingQuote && !hasDeficit}>
            {feeFormatted && (
              <Details.Item
                label="Fees (est.)"
                value={
                  <div title={feeFormatted.full}>{feeFormatted.short}</div>
                }
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
          {hasDeficit && (
            <div className="rounded-th_medium border border-th_warning bg-th_warning px-3 py-[10px] text-center text-sm text-th_warning">
              You do not have enough funds.
            </div>
          )}
        </div>
      </Layout.Content>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            disabled={sending}
            onClick={onReject}
            variant="negative-secondary"
            width="grow"
          >
            Cancel
          </Button>
          {hasDeficit ? (
            <Button
              data-testid="add-funds"
              disabled={!onAddFunds}
              onClick={onAddFunds}
              variant="primary"
              width="grow"
            >
              Add funds
            </Button>
          ) : (
            <Button
              disabled={!onApprove || fetchingQuote}
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
          )}
        </Layout.Footer.Actions>
      </Layout.Footer>
    </Layout>
  )
}

export namespace Send {
  export type Props = {
    asset: ActionRequest.CoinAsset
    chainsPath: readonly Chain[]
    fees?: Capabilities.feeTotals.Response | undefined
    fetchingQuote: boolean
    onApprove: () => void
    onReject: () => void
    onAddFunds?: () => void
    refreshingQuote?: boolean | undefined
    sending?: boolean | undefined
    to: `0x${string}`
    hasDeficit?: boolean | undefined
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
        className="min-w-0 rounded-[4px] font-medium text-[14px] text-th_base-secondary"
        disabled={!asset.fiat}
        onClick={onToggleCurrency}
        style={{ flex: '1 1 auto' }}
      >
        <div className="invisible truncate whitespace-nowrap">
          {fiatValue && tokenValue.length > fiatValue.length
            ? tokenValue
            : fiatValue || tokenValue}
        </div>
        <div
          className="flex items-center justify-end"
          title={currencyType === 'fiat' && fiatValue ? fiatValue : tokenValue}
        >
          <span className="truncate">
            {currencyType === 'fiat' && fiatValue ? fiatValue : tokenValue}
          </span>
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
