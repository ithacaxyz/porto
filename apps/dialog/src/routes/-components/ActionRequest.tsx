import { PortoConfig } from '@porto/apps'
import { Button, Spinner } from '@porto/apps/components'
import { cx } from 'cva'
import { Address } from 'ox'
import { Chains } from 'porto'
import * as Quote_relay from 'porto/core/internal/relay/typebox/quote'
import * as Rpc from 'porto/core/internal/typebox/request'
import { Hooks, Porto as Porto_ } from 'porto/remote'
import * as React from 'react'
import { Call } from 'viem'
import { CheckBalance } from '~/components/CheckBalance'
import * as Dialog from '~/lib/Dialog'
import * as FeeToken from '~/lib/FeeToken'
import { porto } from '~/lib/Porto'
import * as Price from '~/lib/Price'
import * as Relay from '~/lib/Relay'
import { Layout } from '~/routes/-components/Layout'
import { ValueFormatter } from '~/utils'
import ArrowDownLeft from '~icons/lucide/arrow-down-left'
import ArrowUpRight from '~icons/lucide/arrow-up-right'
import ChevronDown from '~icons/lucide/chevron-down'
import TriangleAlert from '~icons/lucide/triangle-alert'
import Star from '~icons/ph/star-four-bold'

export function ActionRequest(props: ActionRequest.Props) {
  const { address, calls, chainId, feeToken, loading, onApprove, onReject } =
    props

  const account = Hooks.useAccount(porto, { address })
  const origin = Dialog.useStore((state) => state.referrer?.origin)

  const prepareCallsQuery = Relay.usePrepareCalls({
    address,
    calls,
    chainId,
    feeToken,
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
            content={<>Review the action to perform below.</>}
            icon={prepareCallsQuery.isError ? TriangleAlert : Star}
            title="Action Request"
            variant={prepareCallsQuery.isError ? 'warning' : 'default'}
          />
        </Layout.Header>

        <Layout.Content>
          <ActionRequest.PaneWithDetails
            loading={prepareCallsQuery.isPending}
            quote={quote}
            variant={prepareCallsQuery.isError ? 'warning' : 'default'}
          >
            {prepareCallsQuery.isError && (
              <div className="space-y-2 text-[14px] text-primary">
                <p className="font-medium text-warning">Error</p>
                <p>
                  An error occurred while simulating the action. Proceed with
                  caution.
                </p>
                <p>
                  Contact{' '}
                  <span className="font-medium">{origin?.hostname}</span> for
                  more information.
                </p>
              </div>
            )}

            {assetDiff && address && (
              <ActionRequest.AssetDiff
                address={address}
                assetDiff={assetDiff}
              />
            )}
          </ActionRequest.PaneWithDetails>
        </Layout.Content>

        <Layout.Footer>
          {prepareCallsQuery.isSuccess && (
            <Layout.Footer.Actions>
              <Button
                className="flex-grow"
                onClick={onReject}
                type="button"
                variant="destructive"
              >
                Deny
              </Button>

              <Button
                className="flex-grow"
                onClick={onApprove}
                type="button"
                variant="success"
              >
                Approve
              </Button>
            </Layout.Footer.Actions>
          )}

          {prepareCallsQuery.isError && (
            <Layout.Footer.Actions>
              <Button
                className="flex-grow"
                onClick={onReject}
                type="button"
                variant="destructive"
              >
                Deny
              </Button>
              <Button
                className="flex-grow"
                onClick={onApprove}
                type="button"
                variant="default"
              >
                Approve anyway
              </Button>
            </Layout.Footer.Actions>
          )}

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
    feeToken?: Address.Address | undefined
    loading?: boolean | undefined
    onApprove: () => void
    onReject: () => void
    quote?: Quote | undefined
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
      return balances
    }, [props.assetDiff, account?.address])

    return (
      <>
        <div className="space-y-2">
          {balances.map((balance) => {
            const { address, decimals, symbol, value } = balance
            if (value === BigInt(0)) return null

            const receiving = value > BigInt(0)
            const formatted = ValueFormatter.format(value, decimals)

            const Icon = receiving ? ArrowDownLeft : ArrowUpRight

            return (
              <div
                className="flex items-center gap-2 font-medium"
                key={address}
              >
                <div
                  className={cx(
                    'flex size-[24px] items-center justify-center rounded-full',
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
    const quote = useQuote(porto, props.quote)
    const chain = Hooks.useChain(porto, { chainId: props.quote.chainId })
    const fiatFee = Price.useFiatPrice({
      value: quote?.fee.native.value,
    })
    const tokenFee = quote?.fee

    return (
      <div className="space-y-1.5">
        <div className="flex h-5.5 items-center justify-between text-[14px]">
          <span className="text-[14px] text-secondary leading-4">
            Fees (est.)
          </span>
          <div className="text-right">
            {fiatFee.isFetched || !quote ? (
              <div className="flex items-center gap-2">
                {tokenFee &&
                  fiatFee?.data &&
                  Number.parseInt(fiatFee.data.display) >= 0.01 && (
                    <div className="flex h-5.5 items-center rounded-full border border-gray6 px-1.75">
                      <span className="text-[11.5px] text-secondary">
                        {tokenFee.display}
                      </span>
                    </div>
                  )}
                <div className="font-medium leading-4">
                  {fiatFee?.data?.display ?? 'Unknown'}
                </div>
              </div>
            ) : (
              <span className="font-medium text-secondary">Loading...</span>
            )}
          </div>
        </div>

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
      quote: Quote_relay.Quote
    }
  }

  export function PaneWithDetails(props: PaneWithDetails.Props) {
    const { children, loading, quote, variant = 'default' } = props

    // default to `true` if no children, otherwise false
    const [viewQuote, setViewQuote] = React.useState(quote && !children)
    React.useEffect(() => {
      if (quote && !children) setViewQuote(true)
    }, [quote, children])

    return (
      <div
        className={cx('space-y-3 rounded-lg px-3 transition-colors', {
          'bg-surface py-3': variant === 'default',
          'bg-warningTint py-2 text-warning': variant === 'warning',
          'h-19.5': loading,
        })}
      >
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex size-[24px] w-full items-center justify-center">
              <Spinner className="text-secondary" />
            </div>
          </div>
        ) : (
          <>
            {children}

            {quote && (
              <>
                {children && <div className="h-[1px] w-full bg-gray6" />}
                <div className={viewQuote ? undefined : 'hidden'}>
                  <ActionRequest.Details quote={quote} />
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
          </>
        )}
      </div>
    )
  }

  export namespace PaneWithDetails {
    export type Props = {
      children?: React.ReactNode | undefined
      loading?: boolean | undefined
      quote?: Quote_relay.Quote | undefined
      variant?: 'default' | 'warning' | undefined
    }
  }

  export type Quote = {
    fee: Price.Price & {
      native: Price.Price
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
    quote: Quote_relay.Quote,
  ): Quote | undefined {
    const { chainId, op, nativeFeeEstimate, txGas, ttl } = quote ?? {}
    const { paymentToken, paymentMaxAmount } = op ?? {}

    const chain = Hooks.useChain(porto, { chainId })!
    const feeToken = FeeToken.useFetch({
      address: paymentToken,
      chainId: chain.id,
    })

    const fee = React.useMemo(() => {
      if (!nativeFeeEstimate || !txGas || !paymentMaxAmount || !feeToken.data)
        return undefined

      const nativeConfig = {
        address: '0x0000000000000000000000000000000000000000',
        decimals: chain.nativeCurrency.decimals,
        symbol: chain.nativeCurrency.symbol,
        value: nativeFeeEstimate.maxFeePerGas * txGas,
      } as const

      const config = paymentToken
        ? {
            ...feeToken.data,
            value: paymentMaxAmount,
          }
        : nativeConfig

      const fee = Price.from(config)
      const native = Price.from(nativeConfig)
      return {
        ...fee,
        native,
      }
    }, [
      chain.nativeCurrency.decimals,
      chain.nativeCurrency.symbol,
      feeToken.data,
      nativeFeeEstimate,
      txGas,
      paymentMaxAmount,
      paymentToken,
    ])

    if (!fee) return undefined
    if (!ttl) return undefined
    return {
      fee,
      ttl,
    }
  }
}
