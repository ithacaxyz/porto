import { Button, ButtonArea, Details } from '@porto/ui'
import { a, useTransition } from '@react-spring/web'
import type * as Capabilities from 'porto/core/internal/relay/schema/capabilities'
import * as React from 'react'
import type { Chain } from 'viem'
import { CopyButton } from '~/components/CopyButton'
import { PriceFormatter, StringFormatter, ValueFormatter } from '~/utils'
import LucideArrowUpRight from '~icons/lucide/arrow-up-right'
import LucideSendHorizontal from '~icons/lucide/send-horizontal'
import { ActionRequest } from './ActionRequest'
import { Layout } from './Layout'

export function Send(props: Send.Props) {
  const { asset, chainsPath, fees, loading, onApprove, onReject, sending, to } =
    props

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
              <div className="flex flex-grow flex-col justify-center">
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
            disabled={loading || sending}
            onClick={onReject}
            variant="negative-secondary"
            width="grow"
          >
            Deny
          </Button>
          <Button
            disabled={!onApprove}
            loading={sending && 'Sending…'}
            onClick={onApprove}
            variant="positive"
            width="grow"
          >
            Send
          </Button>
        </Layout.Footer.Actions>
      </Layout.Footer>
    </Layout>
  )
}

export namespace Send {
  type SendAsset = Exclude<
    Capabilities.assetDiffs.AssetDiffAsset,
    { type: 'erc721' }
  >

  export type Props = {
    asset: SendAsset
    chainsPath: readonly Chain[]
    fees?: Capabilities.feeTotals.Response | undefined
    loading: boolean
    onApprove: () => void
    onReject: () => void
    sending?: boolean | undefined
    to: `0x${string}`
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

    const transition = useTransition(currencyType, {
      config: { friction: 50, tension: 1400 },
      enter: { opacity: 1, transform: 'scale(1)' },
      from: { opacity: 0, transform: 'scale(0.8)' },
      initial: { opacity: 1, transform: 'scale(1)' },
      leave: { immediate: true, opacity: 0 },
    })

    return (
      <ButtonArea
        className="relative min-w-0 rounded-[4px] font-medium text-[14px] text-th_base-secondary"
        disabled={!asset.fiat}
        onClick={onToggleCurrency}
        style={{ flex: '1 1 auto' }}
      >
        <div className="invisible truncate whitespace-nowrap">
          {fiatValue && tokenValue.length > fiatValue.length
            ? tokenValue
            : fiatValue || tokenValue}
        </div>
        {transition((style, item) => {
          const value = item === 'fiat' && fiatValue ? fiatValue : tokenValue
          return (
            <a.div
              className="absolute inset-0 flex origin-[100%_50%] items-center justify-end"
              style={style}
              title={value}
            >
              <span className="truncate">{value}</span>
            </a.div>
          )
        })}
      </ButtonArea>
    )
  }

  export namespace AmountButton {
    export type Props = {
      asset: SendAsset
      currencyType: 'fiat' | 'token'
      onToggleCurrency: () => void
    }
  }
}
