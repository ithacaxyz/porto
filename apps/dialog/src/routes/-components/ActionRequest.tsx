import { Button, ButtonArea, ChainsPath, Details } from '@porto/ui'
import { useQuery } from '@tanstack/react-query'
import { cx } from 'cva'
import { type Address, Base64, Value } from 'ox'
import type * as Capabilities from 'porto/core/internal/relay/schema/capabilities'
import type * as Quote_schema from 'porto/core/internal/relay/schema/quotes'
import type * as Rpc from 'porto/core/internal/schema/request'
import type * as Token from 'porto/core/internal/schema/token.js'
import { Hooks } from 'porto/remote'
import * as React from 'react'
import {
  type Call,
  type Chain,
  decodeFunctionData,
  erc20Abi,
  ethAddress,
} from 'viem'
import * as Calls from '~/lib/Calls'
import { porto } from '~/lib/Porto'
import * as Tokens from '~/lib/Tokens'
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
import { ActionPreview } from '../-components/ActionPreview'
import { AddFunds } from '../-components/AddFunds'
import { Approve } from '../-components/Approve'
import { InsufficientFunds } from '../-components/InsufficientFunds'
import { Send } from '../-components/Send'
import { Swap } from '../-components/Swap'

export function ActionRequest(props: ActionRequest.Props) {
  const {
    address,
    calls,
    chainId,
    feeToken,
    loading,
    merchantUrl,
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
    merchantUrl,
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

  const chainsPath = ActionRequest.useChainsPath(quotes)

  const identifiedFromCalls = React.useMemo(
    () => ActionRequest.txIdentity.identifyFromCalls(calls, chainId),
    [calls, chainId],
  )

  const identifiedFromRelay = React.useMemo(
    () => ActionRequest.txIdentity.identifyFromAssetDiffs(assetDiff, calls),
    [assetDiff, calls],
  )

  const identified = identifiedFromRelay || identifiedFromCalls

  const relayClient = Hooks.useRelayClient(porto, { chainId })
  const tokensQuery = useQuery(Tokens.getTokens.queryOptions(relayClient, {}))

  const requiredFundsData = React.useMemo(() => {
    if (!requiredFunds?.[0] || !tokensQuery.data) return null

    const [firstRequiredFunds] = requiredFunds

    const token = tokensQuery.data.find(
      (t) => t.symbol === firstRequiredFunds.symbol,
    )

    if (!token) return null

    const value =
      typeof firstRequiredFunds.value === 'bigint'
        ? firstRequiredFunds.value
        : Value.from(firstRequiredFunds.value, token.decimals)

    return {
      address: token.address,
      decimals: token.decimals,
      deficit: value,
      required: value,
      symbol: token.symbol,
    }
  }, [requiredFunds, tokensQuery.data])

  const insufficientFundsError = Boolean(
    prepareCallsQuery.error &&
      requiredFunds &&
      requiredFunds.length > 0 &&
      /insufficient/i.test(prepareCallsQuery.error.message ?? ''),
  )

  const [showAddFunds, setShowAddFunds] = React.useState(false)

  const addNativeCurrencyName = (asset: ActionRequest.CoinAsset) => {
    if (asset.type !== null) return asset
    return {
      ...asset,
      name: chainsPath[0]?.nativeCurrency.name,
    }
  }

  const fetchingQuote = prepareCallsQuery.isPending
  const refreshingQuote = prepareCallsQuery.isRefetching

  if (insufficientFundsError)
    return requiredFundsData ? (
      <InsufficientFunds
        account={account?.address}
        assetDeficit={requiredFundsData}
        chainId={chainId ?? relayClient.chain.id}
        onReject={onReject}
      />
    ) : showAddFunds ? (
      <AddFunds
        address={address}
        chainId={chainId ?? relayClient.chain.id}
        onApprove={() => setShowAddFunds(false)}
        onReject={() => setShowAddFunds(false)}
      />
    ) : (
      <InsufficientFunds
        account={account?.address}
        chainId={chainId ?? relayClient.chain.id}
        onAddFunds={() => setShowAddFunds(true)}
        onReject={onReject}
      />
    )

  if (identified?.type === 'approve')
    return (
      <Approve
        address={address}
        amount={identified.amount}
        approving={loading}
        capabilities={fetchingQuote ? undefined : capabilities}
        chainsPath={chainsPath}
        fetchingQuote={fetchingQuote}
        onApprove={() => {
          if (prepareCallsQuery.isSuccess) onApprove(prepareCallsQuery.data)
        }}
        onReject={onReject}
        refreshingQuote={refreshingQuote}
        spender={identified.spender}
        tokenAddress={identified.tokenAddress}
      />
    )

  if (identified?.type === 'swap' || identified?.type === 'convert')
    return (
      <Swap
        address={address}
        assetIn={addNativeCurrencyName(identified.assetIn)}
        assetOut={addNativeCurrencyName(identified.assetOut)}
        capabilities={fetchingQuote ? undefined : capabilities}
        chainsPath={chainsPath}
        contractAddress={calls[0]?.to}
        fetchingQuote={fetchingQuote}
        onApprove={() => {
          if (prepareCallsQuery.isSuccess) onApprove(prepareCallsQuery.data)
        }}
        onReject={onReject}
        refreshingQuote={refreshingQuote}
        swapping={loading}
        swapType={identified.type}
      />
    )

  if (identified?.type === 'send' && identified.to)
    return (
      <Send
        address={address}
        asset={identified.asset}
        capabilities={fetchingQuote ? undefined : capabilities}
        chainsPath={chainsPath}
        fetchingQuote={fetchingQuote}
        onApprove={() => {
          if (prepareCallsQuery.isSuccess) onApprove(prepareCallsQuery.data)
        }}
        onReject={onReject}
        refreshingQuote={refreshingQuote}
        sending={loading}
        to={identified.to}
      />
    )

  return (
    <ActionPreview
      account={account?.address}
      actions={
        <Layout.Footer.Actions>
          <Button
            disabled={fetchingQuote || loading}
            onClick={onReject}
            variant="negative-secondary"
          >
            Cancel
          </Button>
          <Button
            data-testid="confirm"
            disabled={!prepareCallsQuery.isSuccess || refreshingQuote}
            loading={
              refreshingQuote
                ? 'Refreshing quote…'
                : loading
                  ? 'Confirming…'
                  : undefined
            }
            onClick={() => {
              if (prepareCallsQuery.isSuccess) onApprove(prepareCallsQuery.data)
            }}
            variant="positive"
            width="grow"
          >
            Confirm
          </Button>
        </Layout.Footer.Actions>
      }
      error={prepareCallsQuery.error}
      header={
        <Layout.Header.Default
          icon={prepareCallsQuery.isError ? TriangleAlert : Star}
          title="Review action"
          variant={prepareCallsQuery.isError ? 'warning' : 'default'}
        />
      }
      onReject={onReject}
      queryParams={{ address, chainId }}
      quotes={
        prepareCallsQuery.isPending ? undefined : capabilities?.quote?.quotes
      }
    >
      <div className="flex flex-col gap-[8px]">
        <ActionRequest.PaneWithDetails
          error={prepareCallsQuery.error}
          errorMessage="An error occurred while simulating the action. Proceed with caution."
          feeTotals={feeTotals}
          hideDetails={false}
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
      </div>
    </ActionPreview>
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
    merchantUrl?: string | undefined
    requiredFunds?:
      | Calls.prepareCalls.queryOptions.Options['requiredFunds']
      | undefined
    onApprove: (data: Calls.prepareCalls.useQuery.Data) => void
    onReject: () => void
  }

  export type CoinAsset =
    | Extract<Capabilities.assetDiffs.AssetDiffAsset, { type: 'erc20' }>
    | (Extract<Capabilities.assetDiffs.AssetDiffAsset, { type: null }> & {
        name: string | undefined
      })

  export function AssetDiff(props: AssetDiff.Props) {
    const { assetDiff } = props
    return (
      assetDiff.length > 0 && (
        <div className="space-y-2">
          {assetDiff.map((balance) => {
            if (balance.type === 'erc721')
              return <AssetDiff.Erc721Row key={balance.symbol} {...balance} />
            return <AssetDiff.CoinRow key={balance.symbol} {...balance} />
          })}
        </div>
      )
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
              const fiat = asset.fiat && {
                ...asset.fiat,
                value:
                  (current?.fiat?.value ?? 0) +
                  Number(direction) * asset.fiat.value,
              }
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
          if ('image' in json && typeof json.image === 'string') {
            const url = json.image.startsWith('ipfs://')
              ? `https://ipfs.io/ipfs/${json.image.replace('ipfs://', '')}`
              : json.image
            return { type: 'image', url }
          }
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
              'max-w-[200px] rounded-[4px] font-medium text-[14px]',
              receiving ? 'text-th_base-positive' : 'text-th_base-secondary',
            )}
            disabled={!fiat}
            onClick={() => {
              if (!fiat) return
              setCurrencyType(currencyType === 'fiat' ? 'crypto' : 'fiat')
            }}
          >
            <div
              className="flex items-center justify-end"
              title={
                currencyType === 'fiat' && fiatValue ? fiatValue : tokenValue
              }
            >
              <span className="truncate">
                {currencyType === 'fiat' && fiatValue ? fiatValue : tokenValue}
              </span>
            </div>
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
      hideDetails,
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
    const feeTotalFormatted =
      feeTotal && PriceFormatter.format(Number(feeTotal))

    const chainsPath = useChainsPath(quotes)

    const hasDetails =
      (!sponsored && feeTotalFormatted) || chainsPath.length > 0

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
              if (error) {
                const isInsufficientFunds = /insufficient/i.test(
                  (error as any)?.cause?.message ?? error.message ?? '',
                )
                return (
                  <div className="space-y-2 text-[14px] text-th_base">
                    <p className="font-medium text-th_badge-warning">Error</p>
                    <p>{errorMessage}</p>
                    {isInsufficientFunds ? (
                      <p className="text-[11px]">
                        You need more funds to proceed with this action.
                      </p>
                    ) : (
                      <p className="text-[11px]">
                        Details: {(error as any).shortMessage ?? error.message}{' '}
                        {(error as any).details}
                      </p>
                    )}
                  </div>
                )
              }

              if (status === 'pending')
                return <div className="h-[24px] w-full" />

              return <div className="space-y-3">{children}</div>
            })()}
          </div>
        )}

        {status === 'success' &&
          feeTotals &&
          quotes &&
          hasDetails &&
          !hideDetails && (
            <Details opened={!showOverview ? true : undefined}>
              {!sponsored && feeTotalFormatted && (
                <Details.Item label="Fees (est.)" value={feeTotalFormatted} />
              )}
              {chainsPath.length > 0 && (
                <Details.Item
                  label={`Network${chainsPath.length > 1 ? 's' : ''}`}
                  value={
                    <ChainsPath
                      chainIds={chainsPath.map((chain) => chain.id)}
                    />
                  }
                />
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
      hideDetails?: boolean | undefined
    }
  }

  export function useChainsPath(
    quotes: readonly Quote_schema.Quote[] | undefined,
  ): readonly Chain[] {
    return React.useMemo(() => {
      if (!quotes) return []
      return quotes
        .map((quote) => {
          const chain = porto.config.chains.find(
            (chain) => chain.id === quote.chainId,
          )
          if (!chain) throw new Error('Chain not found')
          return chain
        })
        .toReversed()
    }, [quotes])
  }

  export namespace txIdentity {
    export function identifyFromCalls(
      calls: readonly Call[],
      chainId?: number,
    ): IdentifiedTx | null {
      if (calls.length === 0) return null

      // only show the approve screen for single-call approvals
      if (calls.length === 1) {
        const approve = identifyApproveCall(calls[0] as Call)
        if (approve) return approve
      }

      // from this point we need a chainId
      if (chainId === undefined) return null
      const chain = porto.config.chains.find((c) => c.id === chainId)
      if (!chain) return null
      return identifySendCall(calls.at(-1) as Call, chain.nativeCurrency)
    }

    export function identifyFromAssetDiffs(
      assetDiffs: Capabilities.assetDiffs.AssetDiffAsset[],
      calls?: readonly Call[],
    ): IdentifiedTx | null {
      if (!assetDiffs.length) return null

      const lastCall = calls?.at(-1)

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

      // send: 1 out + 0 in (only if we can extract recipient address)
      if (
        assetDiffs.length === 1 &&
        assetDiffs[0]?.direction === 'outgoing' &&
        assetDiffs[0].type !== 'erc721' &&
        lastCall?.data
      ) {
        const recipient = getTransferToAddress({
          data: lastCall.data,
          to: lastCall.to,
          value: lastCall.value,
        })
        if (recipient)
          return {
            asset: assetDiffs[0] as CoinAsset,
            to: recipient,
            type: 'send',
          }
      }

      return null
    }

    export function identifyApproveCall(call: Call): TxApprove | null {
      if (!call.data) return null

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

    export function identifySendCall(
      call: Call,
      nativeCurrency: { name: string; symbol: string },
    ): TxSend | null {
      if (!call.data) return null

      // native
      if (call.value && call.value > 0n && call.data === '0x') {
        return {
          asset: {
            ...nativeCurrency,
            address: null,
            direction: 'outgoing',
            type: null,
            value: call.value,
          },
          to: call.to,
          type: 'send',
        }
      }

      // erc20
      try {
        const decoded = decodeFunctionData({ abi: erc20Abi, data: call.data })
        if (decoded.functionName === 'transfer') {
          const [recipient, amount] = decoded.args
          return {
            asset: {
              address: call.to,
              direction: 'outgoing',
              name: '', // unknown at this point
              symbol: '', // unknown at this point
              type: 'erc20',
              value: amount,
            },
            to: recipient,
            type: 'send',
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
