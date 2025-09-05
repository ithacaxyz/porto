import { ChainIcon, Spinner } from '@porto/apps/components'
import { Button, ButtonArea, Details } from '@porto/ui'
import { a, useTransition } from '@react-spring/web'
import { cx } from 'cva'
import { type Address, Base64, type Hex } from 'ox'
import type * as Capabilities from 'porto/core/internal/relay/schema/capabilities'
import type * as Quote_schema from 'porto/core/internal/relay/schema/quotes'
import type * as Rpc from 'porto/core/internal/schema/request'
import type * as Token from 'porto/core/internal/schema/token.js'
import { Hooks } from 'porto/remote'
import * as React from 'react'
import {
  type Call,
  decodeAbiParameters,
  decodeFunctionData,
  erc20Abi,
  ethAddress,
} from 'viem'
import { CheckBalance } from '~/components/CheckBalance'
import * as Calls from '~/lib/Calls'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import { PriceFormatter, ValueFormatter } from '~/utils'
import ArrowDownLeft from '~icons/lucide/arrow-down-left'
import ArrowUpRight from '~icons/lucide/arrow-up-right'
import LucideFileText from '~icons/lucide/file-text'
import LucideMusic from '~icons/lucide/music'
import LucideSparkles from '~icons/lucide/sparkles'
import TriangleAlert from '~icons/lucide/triangle-alert'
import LucideVideo from '~icons/lucide/video'
import Star from '~icons/ph/star-four-bold'
import IconArrowRightCircle from '~icons/porto/arrow-right-circle'
import { Approve } from '../-components/Approve'
import { Send } from '../-components/Send'
import { Swap } from '../-components/Swap'

export function ActionRequest(props: ActionRequest.Props) {
  const {
    address,
    calls,
    chainId,
    feeToken,
    loading,
    merchantRpcUrl,
    onApprove,
    onReject,
    requiredFunds,
  } = props

  const account = Hooks.useAccount(porto, { address })

  const prepareCallsQuery = Calls.prepareCalls.useQuery({
    address,
    calls,
    chainId,
    feeToken,
    merchantRpcUrl,
    refetchInterval: ({ state }) => (state.error ? false : 15_000),
    requiredFunds,
  })

  const capabilities = prepareCallsQuery.data?.capabilities
  const { assetDiffs, feeTotals } = capabilities ?? {}

  const assetDiff = ActionRequest.AssetDiff.useAssetDiff({
    address: account?.address,
    assetDiff: assetDiffs,
  })

  const quotes = capabilities?.quote?.quotes ?? []
  const quote_destination = quotes.at(-1)
  const sponsored =
    quote_destination?.intent?.payer !==
    '0x0000000000000000000000000000000000000000'

  const identified = ActionRequest.useIdentifyTx(
    quote_destination?.intent.executionData ?? null,
    assetDiff,
  )

  const destinationChainId = quote_destination?.chainId

  return (
    <CheckBalance
      address={address}
      feeToken={feeToken}
      onReject={onReject}
      query={prepareCallsQuery}
    >
      {(() => {
        // Route to the appropriate view based on the identified transaction type.
        if (identified?.type === 'approve')
          return (
            <Approve
              amount={identified.amount}
              approving={loading}
              chainId={destinationChainId}
              fees={sponsored ? undefined : feeTotals}
              loading={prepareCallsQuery.isPending}
              onApprove={() => {
                if (prepareCallsQuery.isSuccess)
                  onApprove(prepareCallsQuery.data)
              }}
              onReject={onReject}
              spender={identified.spender}
              tokenAddress={identified.tokenAddress}
            />
          )

        if (identified?.type === 'swap' || identified?.type === 'convert')
          return (
            <Swap
              assetIn={identified.assetIn}
              assetOut={identified.assetOut}
              chainId={destinationChainId}
              contractAddress={calls[0]?.to}
              fees={sponsored ? undefined : feeTotals}
              loading={prepareCallsQuery.isPending}
              onApprove={() => {
                if (prepareCallsQuery.isSuccess)
                  onApprove(prepareCallsQuery.data)
              }}
              onReject={onReject}
              swapping={loading}
              swapType={identified.type}
            />
          )

        if (identified?.type === 'send' && identified.to)
          return (
            <Send
              asset={identified.asset}
              chainId={destinationChainId}
              fees={sponsored ? undefined : feeTotals}
              loading={prepareCallsQuery.isPending}
              onApprove={() => {
                if (prepareCallsQuery.isSuccess)
                  onApprove(prepareCallsQuery.data)
              }}
              onReject={onReject}
              sending={loading}
              to={identified.to}
            />
          )

        // Fall back to generic "Action Request" view.
        return (
          <Layout>
            <Layout.Header>
              <Layout.Header.Default
                icon={prepareCallsQuery.isError ? TriangleAlert : Star}
                title="Review action"
                variant={prepareCallsQuery.isError ? 'warning' : 'default'}
              />
            </Layout.Header>

            <Layout.Content className="pb-2!">
              <ActionRequest.PaneWithDetails
                error={prepareCallsQuery.error}
                errorMessage="An error occurred while simulating the action. Proceed with caution."
                feeTotals={feeTotals}
                quotes={quotes}
                status={
                  prepareCallsQuery.isPending
                    ? 'pending'
                    : prepareCallsQuery.isError
                      ? 'error'
                      : 'success'
                }
              >
                {assetDiff.length > 0 ? (
                  <ActionRequest.AssetDiff assetDiff={assetDiff} />
                ) : undefined}
              </ActionRequest.PaneWithDetails>
            </Layout.Content>

            <Layout.Footer>
              <Layout.Footer.Actions>
                <Button
                  disabled={prepareCallsQuery.isPending || loading}
                  onClick={onReject}
                  variant="negative-secondary"
                >
                  {prepareCallsQuery.isError ? 'Cancel' : 'Deny'}
                </Button>
                <Button
                  data-testid="confirm"
                  disabled={!prepareCallsQuery.isSuccess}
                  loading={loading && 'Sending…'}
                  onClick={() => {
                    if (prepareCallsQuery.isError) {
                      prepareCallsQuery.refetch()
                      return
                    }
                    if (prepareCallsQuery.isSuccess)
                      onApprove(prepareCallsQuery.data)
                  }}
                  variant={prepareCallsQuery.isError ? 'primary' : 'positive'}
                  width="grow"
                >
                  {prepareCallsQuery.isError ? 'Retry' : 'Approve'}
                </Button>
              </Layout.Footer.Actions>

              {account?.address && (
                <Layout.Footer.Account address={account.address} />
              )}
            </Layout.Footer>
          </Layout>
        )
      })()}
    </CheckBalance>
  )
}

export namespace ActionRequest {
  export type Props = {
    address?: Address.Address | undefined
    calls: readonly Call[]
    chainId?: number | undefined
    checkBalance?: boolean | undefined
    feeToken?: Token.Symbol | Address.Address | undefined
    loading?: boolean | undefined
    merchantRpcUrl?: string | undefined
    requiredFunds?:
      | Calls.prepareCalls.queryOptions.Options['requiredFunds']
      | undefined
    onApprove: (data: Calls.prepareCalls.useQuery.Data) => void
    onReject: () => void
  }

  export function AssetDiff(props: AssetDiff.Props) {
    const { assetDiff } = props
    if (assetDiff.length === 0) return null
    return (
      <div className="space-y-2">
        {assetDiff.map((balance) => {
          if (balance.type === 'erc721')
            return <AssetDiff.Erc721Row key={balance.symbol} {...balance} />
          return <AssetDiff.CoinRow key={balance.symbol} {...balance} />
        })}
      </div>
    )
  }

  export namespace AssetDiff {
    export type Props = {
      assetDiff: readonly Capabilities.assetDiffs.AssetDiffAsset[]
    }

    export function useAssetDiff(props: useAssetDiff.Props) {
      const { address, assetDiff } = props

      const account = Hooks.useAccount(porto, { address })

      return React.useMemo(() => {
        if (!assetDiff) return []

        const balances: Map<
          Address.Address,
          Capabilities.assetDiffs.AssetDiffAsset
        > = new Map()

        for (const chainDiff of Object.values(assetDiff)) {
          for (const [account_, assetDiff] of chainDiff) {
            if (account_ !== account?.address) continue
            for (const asset of assetDiff) {
              const address = asset.address ?? ethAddress
              const current = balances.get(address)

              const direction = asset.direction === 'incoming' ? 1n : -1n
              const fiat = asset.fiat
                ? {
                    ...asset.fiat,
                    value:
                      (current?.fiat?.value ?? 0) +
                      Number(direction) * asset.fiat.value,
                  }
                : undefined
              const value = (current?.value ?? 0n) + direction * asset.value

              balances.set(address, {
                ...asset,
                direction: value > 0 ? 'incoming' : 'outgoing',
                fiat,
                value,
              })
            }
          }
        }
        return Array.from(balances.values())
          .filter((balance) => balance.value !== BigInt(0))
          .sort((a, b) => (a.value > b.value ? 1 : -1))
      }, [assetDiff, account?.address])
    }

    export namespace useAssetDiff {
      export type Props = {
        address?: Address.Address | undefined
        assetDiff: NonNullable<
          Rpc.wallet_prepareCalls.Response['capabilities']
        >['assetDiffs']
      }
    }

    export function Erc721Row(props: Erc721Row.Props) {
      const { direction, name, symbol, uri = '', value } = props

      // Right now we only handle the ERC721 Metadata JSON Schema
      // TODO: Parse other content types (audio, video, document)
      const decoded = React.useMemo(() => {
        try {
          const base64Data = uri.split(',')[1]
          if (!base64Data) return
          const json = JSON.parse(Base64.toString(base64Data))
          if ('image' in json && typeof json.image === 'string')
            return { type: 'image', url: json.image as string }
        } catch {
          return
        }
      }, [uri])

      const receiving = direction === 'incoming'

      return (
        <div className="flex items-center gap-2 font-medium" key={symbol}>
          <div className="relative flex size-6 items-center justify-center overflow-hidden rounded-sm bg-th_badge">
            {decoded?.type === 'image' ? (
              <img
                alt=""
                className="size-6 rounded-sm object-cover"
                src={decoded.url}
              />
            ) : decoded?.type === 'audio' ? (
              <LucideMusic className="size-4 text-th_badge" />
            ) : decoded?.type === 'video' ? (
              <LucideVideo className="size-4 text-th_badge" />
            ) : decoded?.type === 'document' ? (
              <LucideFileText className="size-4 text-th_badge" />
            ) : (
              <LucideSparkles className="size-4 text-th_badge" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              {name || symbol ? (
                <div className="min-w-0 flex-1 truncate" title={name || symbol}>
                  <span className="text-th_base">{name || symbol}</span>
                </div>
              ) : (
                <span className="text-th_base-secondary">No name provided</span>
              )}
              <span className="shrink-0 text-th_base-tertiary">#{value}</span>
            </div>
            <div
              className={cx('shrink-0', {
                'text-th_base-positive': receiving,
                'text-th_base-secondary': !receiving,
              })}
            >
              {receiving ? '+' : '-'}1
            </div>
          </div>
        </div>
      )
    }

    export namespace Erc721Row {
      export type Props = {
        direction: 'incoming' | 'outgoing'
        name?: string | null | undefined
        symbol: string
        uri?: string | undefined
        value: bigint
      }
    }

    export function CoinRow(props: CoinRow.Props) {
      const { decimals, direction, fiat, symbol, value } = props

      const [currencyType, setCurrencyType] = React.useState<'fiat' | 'crypto'>(
        fiat ? 'fiat' : 'crypto',
      )

      const receiving = direction === 'incoming'

      const Icon = receiving ? ArrowDownLeft : ArrowUpRight

      const fiatValue = fiat
        ? PriceFormatter.format(Math.abs(fiat.value))
        : null
      const tokenValue = `${ValueFormatter.format(
        value < 0n ? -value : value,
        decimals ?? 0,
      )} ${symbol}`

      const transition = useTransition(currencyType, {
        config: { friction: 50, tension: 1400 },
        enter: { opacity: 1, transform: 'scale(1)' },
        from: { opacity: 0, transform: 'scale(0.8)' },
        initial: { opacity: 1, transform: 'scale(1)' },
        leave: { immediate: true, opacity: 0 },
      })

      return (
        <div
          className="relative flex w-full items-center justify-between gap-2 font-medium"
          key={symbol}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div
              className={cx(
                'flex size-6 shrink-0 items-center justify-center rounded-full',
                {
                  'bg-th_badge': !receiving,
                  'bg-th_badge-positive': receiving,
                },
              )}
            >
              <Icon
                className={cx('size-4 text-current', {
                  'text-th_badge': !receiving,
                  'text-th_badge-positive': receiving,
                })}
              />
            </div>
            <div className="truncate">
              {receiving ? 'Receive' : 'Spend'} {symbol}
            </div>
          </div>
          <ButtonArea
            className={cx(
              'relative max-w-[200px] rounded-[4px] font-medium text-[14px]',
              receiving ? 'text-th_base-positive' : 'text-th_base-secondary',
            )}
            disabled={!fiat}
            onClick={() => {
              if (!fiat) return
              setCurrencyType(currencyType === 'fiat' ? 'crypto' : 'fiat')
            }}
          >
            <div className="invisible truncate whitespace-nowrap">
              {fiatValue && tokenValue.length > fiatValue.length
                ? tokenValue
                : fiatValue || tokenValue}
            </div>
            {transition((style, item) => {
              const value =
                item === 'fiat' && fiatValue ? fiatValue : tokenValue
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
        </div>
      )
    }

    export namespace CoinRow {
      export type Props = {
        decimals?: number | null | undefined
        direction: 'incoming' | 'outgoing'
        fiat?: { value: number } | undefined
        symbol: string
        value: bigint
      }
    }
  }

  export function PaneWithDetails(props: PaneWithDetails.Props) {
    const {
      children,
      error,
      errorMessage = 'An error occurred. Proceed with caution.',
      feeTotals,
      quotes,
      status,
    } = props

    const hasChildren = React.useMemo(
      () => React.Children.count(children) > 0,
      [children],
    )
    const showOverview = React.useMemo(
      () => hasChildren || status !== 'success',
      [status, hasChildren],
    )

    const sponsored =
      quotes?.at(-1)?.intent?.payer !==
      '0x0000000000000000000000000000000000000000'
    const feeTotal = feeTotals?.['0x0']?.value
    const feeTotalFormatted = feeTotal
      ? PriceFormatter.format(Number(feeTotal))
      : undefined
    const [destinationChain, ...sourceChains] = React.useMemo(() => {
      if (!quotes) return []
      return quotes
        .map((quote) =>
          porto.config.chains.find((chain) => chain.id === quote.chainId),
        )
        .toReversed()
    }, [quotes])
    const hasDetails = (!sponsored && feeTotalFormatted) || destinationChain

    return (
      <div className="space-y-2">
        {showOverview && (
          <div
            className={cx('space-y-3 overflow-hidden rounded-lg px-3', {
              'bg-th_badge-warning py-2 text-th_badge-warning':
                status === 'error',
              'bg-th_base-alt py-3': status !== 'error',
            })}
          >
            {(() => {
              if (error)
                return (
                  <div className="space-y-2 text-[14px] text-th_base">
                    <p className="font-medium text-th_badge-warning">Error</p>
                    <p>{errorMessage}</p>
                    <p className="text-[11px]">
                      Details: {(error as any).shortMessage ?? error.message}{' '}
                      {(error as any).details}
                    </p>
                  </div>
                )

              if (status === 'pending')
                return (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex size-[24px] w-full items-center justify-center">
                      <Spinner className="text-th_base-secondary" />
                    </div>
                  </div>
                )

              return (
                <div className="fade-in animate-in space-y-3 duration-150">
                  {children}
                </div>
              )
            })()}
          </div>
        )}

        {status === 'success' && feeTotals && quotes && hasDetails && (
          <Details opened={!showOverview ? true : undefined}>
            {!sponsored && feeTotalFormatted && (
              <div className="flex h-[18px] items-center justify-between text-[14px]">
                <div className="text-th_base-secondary">Fees (est.)</div>
                <div className="font-medium">{feeTotalFormatted}</div>
              </div>
            )}
            {destinationChain && (
              <div className="flex h-[18px] items-center justify-between text-[14px]">
                <span className="text-th_base-secondary">
                  Network{sourceChains.length > 0 ? 's' : ''}
                </span>
                {sourceChains.length === 0 ? (
                  <div className="flex items-center gap-[6px]">
                    <ChainIcon chainId={destinationChain.id} />
                    <span className="font-medium">{destinationChain.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-[6px]">
                    {sourceChains.map((chain) => (
                      <div key={chain!.id}>
                        <ChainIcon chainId={chain!.id} className="size-4.5" />
                      </div>
                    ))}
                    <IconArrowRightCircle className="size-4" />
                    <div>
                      <ChainIcon
                        chainId={destinationChain.id}
                        className="size-4.5"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </Details>
        )}
      </div>
    )
  }

  export namespace PaneWithDetails {
    export type Props = {
      children?: React.ReactNode | undefined
      error?: Error | null | undefined
      feeTotals?: Capabilities.feeTotals.Response | undefined
      errorMessage?: string | undefined
      quotes?: readonly Quote_schema.Quote[] | undefined
      status: 'pending' | 'error' | 'success'
    }
  }

  export function useIdentifyTx(
    data: Hex.Hex | null,
    assetDiffs: Capabilities.assetDiffs.AssetDiffAsset[],
  ): useIdentifyTx.IdentifiedTx | null {
    return React.useMemo(() => {
      // assets diff based detection
      const assetDiffTx = useIdentifyTx.identifyTxFromAssetsDiff(assetDiffs)

      // calldata based detection
      if (data) {
        try {
          const [calls] = decodeAbiParameters(useIdentifyTx.CallsAbi, data)
          if (!calls.length) return assetDiffTx

          const lastCall = calls[calls.length - 1]
          if (!lastCall) return assetDiffTx

          // only show the approve screen for single-call approvals
          if (calls.length === 1) {
            const approve = useIdentifyTx.identifyApprove(lastCall)
            if (approve) return approve
          }

          if (assetDiffTx?.type === 'send') {
            const to = useIdentifyTx.getTransferToAddress(lastCall)
            if (to) return { ...assetDiffTx, to }
          }
        } catch {}
      }

      return assetDiffTx
    }, [data, assetDiffs])
  }

  export namespace useIdentifyTx {
    export function identifyApprove(call: {
      to: Address.Address
      data: Address.Address
    }): IdentifiedTx | null {
      try {
        const decoded = decodeFunctionData({
          abi: erc20Abi,
          data: call.data,
        })

        if (decoded.functionName === 'approve') {
          const [spender, amount] = decoded.args
          return {
            amount,
            spender,
            tokenAddress: call.to,
            type: 'approve',
          }
        }
      } catch {}
      return null
    }

    export function getTransferToAddress(call: {
      to: Address.Address
      data: Address.Address
      value?: bigint
    }): Address.Address | null {
      // native
      if (call.value && call.value > 0n && call.data === '0x') return call.to

      // erc20
      try {
        const decoded = decodeFunctionData({ abi: erc20Abi, data: call.data })
        if (decoded.functionName === 'transfer') return decoded.args[0]
        if (decoded.functionName === 'transferFrom') return decoded.args[1]
      } catch {}

      return null
    }

    export function identifyTxFromAssetsDiff(
      assetDiffs: Capabilities.assetDiffs.AssetDiffAsset[],
    ): IdentifiedTx | null {
      if (!assetDiffs.length) return null

      const outgoing = assetDiffs.filter(
        (diff) => diff.direction === 'outgoing',
      )
      const incoming = assetDiffs.filter(
        (diff) => diff.direction === 'incoming',
      )

      // swap: 1 out + 1 in
      const swap =
        outgoing.length === 1 &&
        incoming.length === 1 &&
        outgoing[0]?.type !== 'erc721' &&
        incoming[0]?.type !== 'erc721'

      // wrap / unwrap: ETH <> WETH swap
      const wrap =
        swap &&
        outgoing[0]?.type === null &&
        incoming[0]?.type === 'erc20' &&
        incoming[0]?.symbol === 'WETH'
      const unwrap =
        swap &&
        incoming[0]?.type === null &&
        outgoing[0]?.type === 'erc20' &&
        outgoing[0]?.symbol === 'WETH'
      if (wrap || unwrap)
        return {
          assetIn: incoming[0] as CoinAsset,
          assetOut: outgoing[0] as CoinAsset,
          direction: wrap ? 'wrap' : 'unwrap',
          type: 'convert',
        }

      // regular swap
      if (swap)
        return {
          assetIn: incoming[0] as CoinAsset,
          assetOut: outgoing[0] as CoinAsset,
          type: 'swap',
        }

      // send: 1 outgoing
      if (
        assetDiffs.length === 1 &&
        assetDiffs[0]?.direction === 'outgoing' &&
        assetDiffs[0].type !== 'erc721'
      )
        return {
          asset: assetDiffs[0],
          type: 'send',
        }

      return null
    }

    export const CallsAbi = [
      {
        components: [
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'data', type: 'bytes' },
        ],
        type: 'tuple[]',
      },
    ] as const

    type Asset = Capabilities.assetDiffs.AssetDiffAsset
    type CoinAsset = Exclude<Asset, { type: 'erc721' }>

    export type TxApprove = {
      type: 'approve'
      tokenAddress: Address.Address
      spender: Address.Address
      amount: bigint
    }

    export type TxSwap = {
      type: 'swap'
      assetIn: CoinAsset
      assetOut: CoinAsset
    }

    export type TxSend = {
      type: 'send'
      asset: CoinAsset
      to?: Address.Address
    }

    export type TxConvert = {
      assetIn: CoinAsset
      assetOut: CoinAsset
      direction: 'wrap' | 'unwrap'
      type: 'convert'
    }

    export type IdentifiedTx = TxApprove | TxSwap | TxSend | TxConvert
  }
}
