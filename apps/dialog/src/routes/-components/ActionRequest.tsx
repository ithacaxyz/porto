import { PortoConfig } from '@porto/apps'
import { Button, Spinner } from '@porto/apps/components'
import { cx } from 'cva'
import { Address, Base64 } from 'ox'
import { Chains } from 'porto'
import * as Quote_typebox from 'porto/core/internal/rpcServer/typebox/quote'
import * as FeeToken_typebox from 'porto/core/internal/typebox/feeToken.js'
import * as Rpc from 'porto/core/internal/typebox/request'
import { Hooks, Porto as Porto_ } from 'porto/remote'
import * as React from 'react'
import { Call } from 'viem'
import { useCapabilities } from 'wagmi'
import { CheckBalance } from '~/components/CheckBalance'
import * as FeeToken from '~/lib/FeeToken'
import { porto } from '~/lib/Porto'
import * as Price from '~/lib/Price'
import * as RpcServer from '~/lib/RpcServer'
import { Layout } from '~/routes/-components/Layout'
import { ValueFormatter } from '~/utils'
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
    onApprove,
    onReject,
    sponsorUrl,
  } = props

  const account = Hooks.useAccount(porto, { address })

  const prepareCallsQuery = RpcServer.usePrepareCalls({
    address,
    calls,
    chainId,
    feeToken,
    sponsorUrl,
  })

  const assetDiff = prepareCallsQuery.data?.capabilities.assetDiff
  const quote = prepareCallsQuery.data?.capabilities.quote

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
            loading={prepareCallsQuery.isPending}
            quote={quote}
          >
            {assetDiff && address && (
              <ActionRequest.AssetDiff
                address={address}
                assetDiff={assetDiff}
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
                  onClick={onApprove}
                  type="button"
                  variant="accent"
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
                  disabled={!prepareCallsQuery.isSuccess}
                  onClick={onApprove}
                  type="button"
                  variant="accent"
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
    feeToken?: FeeToken_typebox.Symbol | Address.Address | undefined
    loading?: boolean | undefined
    onApprove: () => void
    onReject: () => void
    quote?: Quote | undefined
    sponsorUrl?: string | undefined
  }

  export function AssetDiff(props: AssetDiff.Props) {
    const { address } = props

    const account = Hooks.useAccount(porto, { address })

    const balances = React.useMemo(() => {
      if (!props.assetDiff) return []

      let balances = []
      for (const [account_, values] of props.assetDiff) {
        if (account_ !== account?.address) continue
        for (const value of values) {
          balances.push({
            ...value,
            account: account_,
          })
        }
      }
      balances = balances.toSorted((a, b) => (a.value > b.value ? 1 : -1))
      return balances
    }, [props.assetDiff, account?.address])

    return (
      <>
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
                  <div className="relative flex size-6 items-center justify-center rounded-sm bg-gray6">
                    {decoded?.type === 'image' ? (
                      <img
                        alt={name ?? symbol}
                        className="size-full rounded-sm object-cover text-transparent"
                        src={decoded.url}
                      />
                    ) : decoded?.type === 'audio' ? (
                      <LucideMusic className="size-4 text-gray10" />
                    ) : decoded?.type === 'video' ? (
                      <LucideVideo className="size-4 text-gray10" />
                    ) : decoded?.type === 'document' ? (
                      <LucideFileText className="size-4 text-gray10" />
                    ) : (
                      <LucideSparkles className="size-4 text-gray10" />
                    )}

                    <div
                      className={cx(
                        '-tracking-[0.25] -bottom-1.5 -end-2 absolute flex size-4 items-center justify-center rounded-full font-medium text-[11px] outline-2 outline-gray3',
                        receiving
                          ? 'bg-successTint text-success'
                          : 'bg-gray5 text-current',
                      )}
                    >
                      {/* TODO: Return erc721 count in API response */}
                      {receiving ? 1 : -1}
                    </div>
                  </div>
                  <div className="flex flex-1 justify-between">
                    {name || symbol ? (
                      <span className="text-gray12">{name || symbol}</span>
                    ) : (
                      <span className="text-gray9">No name provided</span>
                    )}
                    <span className="text-gray10">#{absoluteValue}</span>
                  </div>
                </div>
              )
            }

            const Icon = receiving ? ArrowDownLeft : ArrowUpRight
            return (
              <div
                className="flex items-center gap-2 font-medium"
                key={address}
              >
                <div
                  className={cx(
                    'flex size-6 items-center justify-center rounded-full',
                    {
                      'bg-gray5': !receiving,
                      'bg-successTint': receiving,
                    },
                  )}
                >
                  <Icon
                    className={cx('size-4 text-current', {
                      'text-secondary': !receiving,
                      'text-success': receiving,
                    })}
                  />
                </div>
                <div>
                  {receiving ? 'Receive' : 'Send'}{' '}
                  <span
                    className={receiving ? 'text-success' : 'text-secondary'}
                  >
                    {formatted}
                  </span>{' '}
                  {symbol}
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  export namespace AssetDiff {
    export type Props = {
      address: Address.Address
      assetDiff: NonNullable<
        Rpc.wallet_prepareCalls.Response['capabilities']
      >['assetDiff']
    }
  }
  export function Details(props: Details.Props) {
    const { sponsorUrl } = props

    const quote = useQuote(porto, props.quote)
    const chain = Hooks.useChain(porto, { chainId: props.quote.chainId })
    const fiatFee = quote?.fee.fiat
    const tokenFee = quote?.fee.token

    const displayTokenFee =
      tokenFee &&
      fiatFee &&
      !tokenFee.kind?.startsWith('USD') &&
      Number.parseInt(fiatFee.formatted) >= 0.01

    return (
      <div className="space-y-1.5">
        {!sponsorUrl && (
          <div className="flex h-5.5 items-center justify-between text-[14px]">
            <span className="text-[14px] text-secondary leading-4">
              Fees (est.)
            </span>
            <div className="text-right">
              {fiatFee || !quote ? (
                <div className="flex items-center gap-2">
                  {displayTokenFee && (
                    <div className="flex h-5.5 items-center rounded-full border border-gray6 px-1.75">
                      <span className="text-[11.5px] text-secondary">
                        {tokenFee.display}
                      </span>
                    </div>
                  )}
                  <div className="font-medium leading-4">
                    {fiatFee?.display ?? 'Unknown'}
                  </div>
                </div>
              ) : (
                <span className="font-medium text-secondary">Loading...</span>
              )}
            </div>
          </div>
        )}

        <div className="flex h-5.5 items-center justify-between text-[14px]">
          <span className="text-[14px] text-secondary">Duration (est.)</span>
          <span className="font-medium">2 seconds</span>
        </div>

        {chain?.name && (
          <div className="flex h-5.5 items-center justify-between text-[14px]">
            <span className="text-[14px] text-secondary">Network</span>
            <span className="font-medium">{chain?.name}</span>
          </div>
        )}
      </div>
    )
  }

  export namespace Details {
    export type Props = {
      chain?: Chains.Chain | undefined
      sponsorUrl?: string | undefined
      quote: Quote_typebox.Quote
    }
  }

  export function PaneWithDetails(props: PaneWithDetails.Props) {
    const {
      children,
      error,
      errorMessage = 'An error occurred. Proceed with caution.',
      loading,
      quote,
      sponsorUrl,
    } = props

    // default to `true` if no children, otherwise false
    const [viewQuote, setViewQuote] = React.useState(quote && !children)
    React.useEffect(() => {
      if (quote && !children) setViewQuote(true)
    }, [quote, children])

    return (
      <div
        className={cx(
          'space-y-3 overflow-hidden rounded-lg px-3 transition-all duration-300 ease-in-out',
          {
            'bg-surface py-3': !error,
            'bg-warningTint py-2 text-warning': error,
            'h-[90px] max-h-[90px]': loading,
            'max-h-[500px]': !loading,
          },
        )}
      >
        {(() => {
          if (error)
            return (
              <div className="space-y-2 text-[14px] text-primary">
                <p className="font-medium text-warning">Error</p>
                <p>{errorMessage}</p>
                <p>Details: {(error as any).shortMessage ?? error.message}</p>
              </div>
            )

          if (loading)
            return (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex size-[24px] w-full items-center justify-center">
                  <Spinner className="text-secondary" />
                </div>
              </div>
            )

          return (
            <div className="fade-in animate-in space-y-3 duration-150">
              {children}

              {quote && (
                <>
                  {children && <div className="h-[1px] w-full bg-gray6" />}
                  <div className={viewQuote ? undefined : 'hidden'}>
                    <ActionRequest.Details
                      quote={quote}
                      sponsorUrl={sponsorUrl}
                    />
                  </div>
                  {!viewQuote && (
                    <button
                      className="flex w-full justify-between text-[13px] text-secondary"
                      onClick={() => setViewQuote(true)}
                      type="button"
                    >
                      <span>More details</span>
                      <ChevronDown className="size-4 text-secondary" />
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
      error?: Error | null | undefined
      errorMessage?: string | undefined
      loading?: boolean | undefined
      quote?: Quote_typebox.Quote | undefined
      sponsorUrl?: string | undefined
    }
  }

  export type Quote = {
    fee: {
      fiat?: Price.Price | undefined
      native: Price.Price
      token: Price.Price
    }
    ttl: number
  }

  /**
   * Hook to extract a quote from a `wallet_prepareCalls` context.
   *
   * @param porto - Porto instance.
   * @param parameters - Parameters.
   * @returns Quote.
   */
  export function useQuote<
    chains extends readonly [PortoConfig.Chain, ...PortoConfig.Chain[]],
  >(
    porto: Pick<Porto_.Porto<chains>, '_internal'>,
    quote: Quote_typebox.Quote,
  ): Quote | undefined {
    const { chainId, intent, nativeFeeEstimate, txGas, ttl } = quote ?? {}
    const { paymentToken, totalPaymentMaxAmount } = intent ?? {}

    const chain = Hooks.useChain(porto, { chainId })!
    const capabilities = useCapabilities({ chainId: chain.id })
    const feeToken = FeeToken.useFetch({
      addressOrSymbol: paymentToken,
    })

    const fee = React.useMemo(() => {
      if (
        !nativeFeeEstimate ||
        !txGas ||
        !totalPaymentMaxAmount ||
        !feeToken.data
      )
        return undefined

      const nativeConfig = {
        address: '0x0000000000000000000000000000000000000000',
        decimals: chain.nativeCurrency.decimals,
        kind: 'ETH',
        nativeRate: 10n ** 18n,
        symbol: chain.nativeCurrency.symbol,
        value: nativeFeeEstimate.maxFeePerGas * txGas,
      } as const

      const tokenConfig = (() => {
        if (paymentToken && paymentToken !== nativeConfig.address) {
          return {
            ...feeToken.data,
            value: totalPaymentMaxAmount,
          }
        }
        return nativeConfig
      })()

      const fiatConfig = (() => {
        const usdConfig = capabilities.data?.feeToken.tokens.find((token) =>
          token.kind.startsWith('USD'),
        )
        if (!usdConfig) return undefined
        const value =
          (totalPaymentMaxAmount *
            tokenConfig.nativeRate! *
            10n ** BigInt(usdConfig.decimals)) /
          (BigInt(usdConfig.nativeRate!) * 10n ** BigInt(tokenConfig.decimals))
        return {
          ...usdConfig,
          value,
        }
      })()

      return {
        fiat: fiatConfig ? Price.fromFiat(fiatConfig) : undefined,
        native: Price.from(nativeConfig),
        token: Price.from(tokenConfig),
      }
    }, [
      capabilities.data?.feeToken.tokens,
      chain.nativeCurrency.decimals,
      chain.nativeCurrency.symbol,
      feeToken.data,
      nativeFeeEstimate,
      txGas,
      paymentToken,
      totalPaymentMaxAmount,
    ])

    if (!fee) return undefined
    if (!ttl) return undefined
    return {
      fee,
      ttl,
    }
  }
}
