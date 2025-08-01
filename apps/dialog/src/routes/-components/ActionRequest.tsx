import { Button, Spinner } from '@porto/apps/components'
import { cx } from 'cva'
import { type Address, Base64 } from 'ox'
import type { Chains } from 'porto'
import type * as Capabilities from 'porto/core/internal/rpcServer/schema/capabilities'
import type * as Quote_schema from 'porto/core/internal/rpcServer/schema/quotes'
import type * as FeeToken_schema from 'porto/core/internal/schema/feeToken.js'
import type * as Rpc from 'porto/core/internal/schema/request'
import { Hooks } from 'porto/remote'
import * as React from 'react'
import { type Call, ethAddress } from 'viem'
import { CheckBalance } from '~/components/CheckBalance'
import * as Calls from '~/lib/Calls'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import { PriceFormatter, ValueFormatter } from '~/utils'
import ArrowDownLeft from '~icons/lucide/arrow-down-left'
import ArrowUpRight from '~icons/lucide/arrow-up-right'
import ChevronDown from '~icons/lucide/chevron-down'
import LucideFileText from '~icons/lucide/file-text'
import LucideMusic from '~icons/lucide/music'
import LucideSparkles from '~icons/lucide/sparkles'
import TriangleAlert from '~icons/lucide/triangle-alert'
import LucideVideo from '~icons/lucide/video'
import Star from '~icons/ph/star-four-bold'

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

  // This "prepare calls" query is used as the "source of truth" query that will
  // ultimately be used to execute the calls.
  const prepareCallsQuery = Calls.prepareCalls.useQuery({
    address,
    calls,
    chainId,
    feeToken,
    merchantRpcUrl,
    refetchInterval(query) {
      if (query.state.error) return false
      return 15_000
    },
    requiredFunds,
  })

  // However, to prevent a malicious RPC server from providing a mutated asset
  // diff or fee calculations to display to the end-user, we also simulate the prepare calls query
  // without the merchant RPC URL.
  const prepareCallsQuery_noMerchantRpc = Calls.prepareCalls.useQuery({
    address,
    calls,
    chainId,
    enabled: !!merchantRpcUrl,
    feeToken,
    requiredFunds,
  })
  const query_noMerchantRpc = merchantRpcUrl
    ? prepareCallsQuery_noMerchantRpc
    : prepareCallsQuery

  const capabilities = query_noMerchantRpc.data?.capabilities
  const { assetDiffs, feeTotals } = capabilities ?? {}

  const quotes = prepareCallsQuery.data?.capabilities.quote?.quotes

  return (
    <CheckBalance
      address={address}
      feeToken={feeToken}
      onReject={onReject}
      query={prepareCallsQuery}
    >
      <Layout loading={loading} loadingTitle="Sending...">
        <Layout.Header>
          <Layout.Header.Default
            icon={prepareCallsQuery.isError ? TriangleAlert : Star}
            title="Review action"
            variant={prepareCallsQuery.isError ? 'warning' : 'default'}
          />
        </Layout.Header>

        <Layout.Content>
          <ActionRequest.PaneWithDetails
            error={prepareCallsQuery.error}
            errorMessage="An error occurred while simulating the action. Proceed with caution."
            feeTotals={feeTotals}
            loading={prepareCallsQuery.isPending}
            quotes={quotes}
          >
            {assetDiffs && address && (
              <ActionRequest.AssetDiff
                address={address}
                assetDiff={assetDiffs}
              />
            )}
          </ActionRequest.PaneWithDetails>
        </Layout.Content>

        <Layout.Footer>
          <Layout.Footer.Actions>
            {prepareCallsQuery.isError ? (
              <>
                <Button onClick={onReject} type="button" variant="default">
                  Cancel
                </Button>
                <Button
                  className="flex-grow"
                  onClick={() => onApprove(prepareCallsQuery.data!)}
                  type="button"
                  variant="primary"
                >
                  Confirm anyway
                </Button>
              </>
            ) : (
              <>
                <Button
                  disabled={!prepareCallsQuery.isSuccess}
                  onClick={onReject}
                  type="button"
                  variant="default"
                >
                  Cancel
                </Button>

                <Button
                  className="flex-grow"
                  data-testid="confirm"
                  disabled={!prepareCallsQuery.isSuccess}
                  onClick={() => onApprove(prepareCallsQuery.data!)}
                  type="button"
                  variant="primary"
                >
                  Confirm
                </Button>
              </>
            )}
          </Layout.Footer.Actions>

          {account?.address && (
            <Layout.Footer.Account address={account.address} />
          )}
        </Layout.Footer>
      </Layout>
    </CheckBalance>
  )
}

export namespace ActionRequest {
  export type Props = {
    address?: Address.Address | undefined
    calls: readonly Call[]
    chainId?: number | undefined
    checkBalance?: boolean | undefined
    feeToken?: FeeToken_schema.Symbol | Address.Address | undefined
    loading?: boolean | undefined
    merchantRpcUrl?: string | undefined
    requiredFunds?:
      | Calls.prepareCalls.queryOptions.Options['requiredFunds']
      | undefined
    onApprove: (data: Calls.prepareCalls.useQuery.Data) => void
    onReject: () => void
  }

  export function AssetDiff(props: AssetDiff.Props) {
    const { address } = props

    const account = Hooks.useAccount(porto, { address })

    const balances = React.useMemo(() => {
      if (!props.assetDiff) return []

      const balances: Map<
        Address.Address,
        Capabilities.assetDiffs.AssetDiffAsset
      > = new Map()

      for (const chainDiff of Object.values(props.assetDiff)) {
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
      return Array.from(balances.values()).sort((a, b) =>
        a.value > b.value ? 1 : -1,
      )
    }, [props.assetDiff, account?.address])

    return (
      <div className="space-y-2">
        {balances.map((balance) => {
          const { address, direction, symbol, value } = balance
          if (value === BigInt(0)) return null

          const receiving = direction === 'incoming'
          const absoluteValue = value < 0n ? -value : value
          const formatted = ValueFormatter.format(
            absoluteValue,
            'decimals' in balance ? (balance.decimals ?? 0) : 0,
          )

          if (balance.type === 'erc721') {
            const { name, uri } = balance
            // Right now we only handle the ERC721 Metadata JSON Schema
            // TODO: Parse other content types (audio, video, document)
            const decoded = (() => {
              try {
                const base64Data = uri.split(',')[1]
                if (!base64Data) return
                const json = JSON.parse(Base64.toString(base64Data))
                if ('image' in json && typeof json.image === 'string')
                  return { type: 'image', url: json.image as string }
              } catch {
                return
              }
            })()
            return (
              <div
                className="flex items-center gap-3 font-medium"
                key={address}
              >
                <div className="relative flex size-6 items-center justify-center rounded-sm bg-th_badge">
                  {decoded?.type === 'image' ? (
                    <img
                      alt={name ?? symbol}
                      className="size-full rounded-sm object-cover text-transparent"
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

                  <div
                    className={cx(
                      '-tracking-[0.25] -bottom-1.5 -end-2 absolute flex size-4 items-center justify-center rounded-full font-medium text-[11px] outline-2 outline-[var(--background-color-th_secondary)]',
                      receiving
                        ? 'bg-th_badge-positive text-th_badge-positive'
                        : 'bg-th_badge text-th_badge',
                    )}
                  >
                    {/* TODO: Return erc721 count in API response */}
                    {receiving ? 1 : -1}
                  </div>
                </div>
                <div className="flex flex-1 justify-between">
                  {name || symbol ? (
                    <span className="text-th_base">{name || symbol}</span>
                  ) : (
                    <span className="text-th_base-secondary">
                      No name provided
                    </span>
                  )}
                  <span className="text-th_base-tertiary">
                    #{absoluteValue}
                  </span>
                </div>
              </div>
            )
          }

          const Icon = receiving ? ArrowDownLeft : ArrowUpRight
          return (
            <div className="flex items-center gap-2 font-medium" key={address}>
              <div
                className={cx(
                  'flex size-6 items-center justify-center rounded-full',
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
              <div>
                {receiving ? 'Receive' : 'Send'}{' '}
                <span
                  className={
                    receiving
                      ? 'text-th_base-positive'
                      : 'text-th_base-secondary'
                  }
                >
                  {formatted}
                </span>{' '}
                {symbol}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  export namespace AssetDiff {
    export type Props = {
      address: Address.Address
      assetDiff: NonNullable<
        Rpc.wallet_prepareCalls.Response['capabilities']
      >['assetDiffs']
    }
  }
  export function Details(props: Details.Props) {
    const { feeTotals, quotes } = props

    const quote_destination = React.useMemo(
      () => quotes[quotes.length - 1],
      [quotes],
    )
    const sponsored = React.useMemo(
      () =>
        quote_destination?.intent?.payer !==
        '0x0000000000000000000000000000000000000000',
      [quote_destination],
    )

    const feeTotal = React.useMemo(() => {
      const feeTotal = feeTotals['0x0']?.value
      if (!feeTotal) return
      return PriceFormatter.format(Number(feeTotal))
    }, [feeTotals])

    const chain = Hooks.useChain(porto, { chainId: quote_destination?.chainId })

    return (
      <div className="space-y-1.5">
        {!sponsored && (
          <div className="flex h-5.5 items-center justify-between text-[14px]">
            <span className="text-[14px] text-th_base-secondary leading-4">
              Fees (est.)
            </span>
            <div className="text-right">
              {feeTotal ? (
                <div className="flex items-center gap-2">
                  <div className="font-medium leading-4">{feeTotal}</div>
                </div>
              ) : (
                <span className="font-medium text-th_base-secondary">
                  Loading…
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex h-5.5 items-center justify-between text-[14px]">
          <span className="text-[14px] text-th_base-secondary">
            Duration (est.)
          </span>
          <span className="font-medium">2 seconds</span>
        </div>

        {chain?.name && (
          <div className="flex h-5.5 items-center justify-between text-[14px]">
            <span className="text-[14px] text-th_base-secondary">Network</span>
            <span className="font-medium">{chain?.name}</span>
          </div>
        )}
      </div>
    )
  }

  export namespace Details {
    export type Props = {
      chain?: Chains.Chain | undefined
      feeTotals: Capabilities.feeTotals.Response
      quotes: readonly Quote_schema.Quote[]
    }
  }

  export function PaneWithDetails(props: PaneWithDetails.Props) {
    const {
      children,
      error,
      errorMessage = 'An error occurred. Proceed with caution.',
      feeTotals,
      loading,
      quotes,
    } = props

    const hasDetails = React.useMemo(
      () => quotes || feeTotals,
      [quotes, feeTotals],
    )

    // default to `true` if no children, otherwise false
    const [viewQuote, setViewQuote] = React.useState(hasDetails && !children)
    React.useEffect(() => {
      if (hasDetails && !children) setViewQuote(true)
    }, [hasDetails, children])

    return (
      <div
        className={cx(
          'space-y-3 overflow-hidden rounded-lg px-3 transition-all duration-300 ease-in-out',
          {
            'bg-th_badge-warning py-2 text-th_badge-warning': error,
            'bg-th_secondary py-3': !error,
            'h-[90px] max-h-[90px]': loading,
            'max-h-[500px]': !loading,
          },
        )}
      >
        {(() => {
          if (error)
            return (
              <div className="space-y-2 text-[14px] text-th_base">
                <p className="font-medium text-th_badge-warning">Error</p>
                <p>{errorMessage}</p>
                <p>Details: {(error as any).shortMessage ?? error.message}</p>
              </div>
            )

          if (loading)
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

              {feeTotals && quotes && (
                <>
                  {children && (
                    <div className="h-[1px] w-full bg-th_separator" />
                  )}
                  <div className={viewQuote ? undefined : 'hidden'}>
                    <ActionRequest.Details
                      feeTotals={feeTotals}
                      quotes={quotes}
                    />
                  </div>
                  {!viewQuote && (
                    <button
                      className="flex w-full justify-between text-[13px] text-th_base-secondary"
                      onClick={() => setViewQuote(true)}
                      type="button"
                    >
                      <span>More details</span>
                      <ChevronDown className="size-4 text-th_base-secondary" />
                    </button>
                  )}
                </>
              )}
            </div>
          )
        })()}
      </div>
    )
  }

  export namespace PaneWithDetails {
    export type Props = {
      children?: React.ReactNode | undefined
      feeTotals?: Capabilities.feeTotals.Response | undefined
      error?: Error | null | undefined
      errorMessage?: string | undefined
      loading?: boolean | undefined
      quotes?: readonly Quote_schema.Quote[] | undefined
    }
  }
}
