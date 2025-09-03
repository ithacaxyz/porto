import { ChainIcon } from '@porto/apps/components'
import { ButtonArea, Button, TokenIcon } from '@porto/ui'
import { a, useTransition } from '@react-spring/web'
import type * as Capabilities from 'porto/core/internal/relay/schema/capabilities'
import * as React from 'react'
import { CopyButton } from '~/components/CopyButton'
import { porto } from '~/lib/Porto'
import { PriceFormatter, ValueFormatter, StringFormatter } from '~/utils'
import LucideInfo from '~icons/lucide/info'
import LucideSendHorizontal from '~icons/lucide/send-horizontal'
import LucideArrowUpRight from '~icons/lucide/arrow-up-right'
import { Layout } from './Layout'

export function Send(props: Send.Props) {
  const { asset, chainId, fees, loading, onApprove, onReject, sending, to } =
    props

  const [currencyType, setCurrencyType] = React.useState<'fiat' | 'token'>(
    asset.fiat ? 'fiat' : 'token',
  )
  const [showDetails, setShowDetails] = React.useState(false)

  const toggle = () => {
    if (!asset.fiat) return
    setCurrencyType(currencyType === 'fiat' ? 'token' : 'fiat')
  }

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
        <div className="flex flex-col gap-[8px]">
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

          {showDetails ? (
            <div className="flex w-full items-center justify-between gap-[6px] rounded-th_medium bg-th_base-alt px-[12px] text-[13px]">
              <div className="flex w-full flex-col gap-[6px] py-[8px]">
                <Send.Details chainId={chainId} fees={fees} loading={loading} />
              </div>
            </div>
          ) : (
            <ButtonArea
              className="flex h-[34px] w-full items-center justify-center gap-[6px] rounded-th_medium bg-th_base-alt text-[13px] text-th_base-secondary"
              onClick={() => setShowDetails(true)}
            >
              <LucideInfo className="size-[16px]" />
              <span>Show more details</span>
            </ButtonArea>
          )}
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
    chainId?: number | undefined
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
        className="relative font-medium text-[14px] text-th_base-secondary rounded-[4px] min-w-0"
        style={{ flex: '1 1 auto' }}
        onClick={onToggleCurrency}
        disabled={!asset.fiat}
      >
        <div className="invisible whitespace-nowrap truncate">
          {fiatValue && tokenValue.length > fiatValue.length
            ? tokenValue
            : fiatValue || tokenValue}
        </div>
        {transition((style, item) => {
          const value = item === 'fiat' && fiatValue ? fiatValue : tokenValue
          return (
            <a.div
              className="absolute inset-0 origin-[100%_50%] flex items-center justify-end"
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

  export function Details(props: Details.Props) {
    const { chainId, fees, loading } = props

    const feeFormatted = React.useMemo(() => {
      const feeTotal = fees?.['0x0']?.value
      if (!feeTotal) return null
      const feeNumber = Number(feeTotal)
      return {
        short: PriceFormatter.format(feeNumber),
        full: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 8,
          minimumFractionDigits: 2,
        }).format(feeNumber),
      }
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
        {feeFormatted && (
          <div className="flex h-[18px] items-center justify-between text-[14px]">
            <div className="text-th_base-secondary">Fees (est.)</div>
            <div className="font-medium" title={feeFormatted.full}>
              {feeFormatted.short}
            </div>
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
