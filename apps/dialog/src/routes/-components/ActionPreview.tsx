import { Query, UserAgent } from '@porto/apps'
import { exp1Address, exp2Address } from '@porto/apps/contracts'
import { Button, Separator } from '@porto/ui'
import { useMutation } from '@tanstack/react-query'
import { Value } from 'ox'
import type * as Address from 'ox/Address'
import type * as Quote_schema from 'porto/core/internal/relay/schema/quotes'
import { Hooks as RemoteHooks } from 'porto/remote'
import { RelayActions } from 'porto/viem'
import * as React from 'react'
import { DepositButtons } from '~/components/DepositButtons'
import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import { ValueFormatter } from '~/utils'
import LucideInfo from '~icons/lucide/info'
import { AddFunds } from './AddFunds'
import { Layout } from './Layout'

export function ActionPreview(props: ActionPreview.Props) {
  const {
    header,
    children,
    quotes,
    error,
    queryParams,
    actions,
    account,
    onReject,
  } = props

  const deficit = useDeficit(quotes, error, queryParams)
  const [showAddFunds, setShowAddFunds] = React.useState(false)

  const depositAddress = deficit?.address || account

  if (showAddFunds && deficit)
    return (
      <AddFunds
        address={depositAddress}
        chainId={deficit.chainId}
        onApprove={() => {
          setShowAddFunds(false)
        }}
        onReject={() => {
          setShowAddFunds(false)
        }}
      />
    )

  return (
    <Layout>
      {header && <Layout.Header>{header}</Layout.Header>}
      <Layout.Content>
        {children}
        {deficit?.amount && <DeficitWarning amount={deficit.amount} />}
      </Layout.Content>
      <Layout.Footer>
        {deficit ? (
          <FundsNeededSection
            account={account}
            deficit={deficit}
            onAddFunds={() => setShowAddFunds(true)}
            onReject={onReject}
          />
        ) : (
          actions
        )}
        {account && <Layout.Footer.Account address={account} />}
      </Layout.Footer>
    </Layout>
  )
}

export namespace ActionPreview {
  export type Props = {
    header?: React.ReactNode
    children: React.ReactNode
    quotes?: readonly Quote[]
    delayedRender?: boolean
    error?: Error | null
    queryParams?: {
      address?: Address.Address
      chainId?: number
    }
    actions?: React.ReactNode
    account?: Address.Address
    onReject: () => void
  }

  export type Quote = {
    assetDeficits?: Quote_schema.AssetDeficit[]
    chainId: number
    feeTokenDeficit?: bigint
  }

  export type DeficitAmount = {
    exact: string
    fiat?: string
    needed: bigint
    rounded: string
  }

  export type Deficit = {
    address?: Address.Address
    assetDeficits?: Quote_schema.AssetDeficit[]
    chainId?: number
    feeTokenDeficit?: bigint
    amount?: DeficitAmount
  }

  export const delayedRenderDuration = 1000
}

function DeficitWarning(props: DeficitWarning.Props) {
  const { amount } = props
  return (
    <div className="mt-[8px] flex w-full items-center justify-between rounded-th_medium border border-th_warning bg-th_warning px-3 py-[10px]">
      <span className="text-[11.5px] text-th_base-secondary">You need</span>
      <div className="flex items-center gap-2 text-[14px]">
        <span className="font-medium text-th_warning" title={amount.exact}>
          {amount.rounded}
        </span>
        {amount.fiat && (
          <span className="text-th_base-secondary">{amount.fiat}</span>
        )}
        <LucideInfo className="size-3.5 text-th_base-secondary" />
      </div>
    </div>
  )
}

namespace DeficitWarning {
  export type Props = {
    amount: ActionPreview.DeficitAmount
  }
}

function useDeficit(
  quotes: readonly ActionPreview.Quote[] | undefined,
  error: Error | null | undefined,
  params?: {
    address?: Address.Address
    chainId?: number
  },
): ActionPreview.Deficit | null {
  const deficit = React.useMemo(() => {
    const deficitQuote = quotes?.find((quote) =>
      (quote.assetDeficits ?? []).some((d) => d.deficit > 0n),
    )

    if (!deficitQuote && !error) return null

    if (deficitQuote) {
      const assetDeficits = deficitQuote.assetDeficits?.filter(
        (d) => d.deficit > 0n,
      )

      return {
        address: params?.address,
        assetDeficits,
        chainId: deficitQuote.chainId,
        feeTokenDeficit: deficitQuote.feeTokenDeficit,
      }
    }

    if (error) {
      const errorMessage =
        (error?.cause as Error)?.message ?? error?.message ?? ''

      const match = errorMessage.match(
        /required (\d+) of asset (0x[a-fA-F0-9]{40}) on chain (\d+)/,
      ) as [string, string, Address.Address, string] | null

      if (match) {
        const [, value, address, chainId] = match
        const deficit = BigInt(value)
        const assetDeficit: Quote_schema.AssetDeficit = {
          address,
          deficit,
          required: deficit,
        }
        return {
          address: params?.address,
          assetDeficits: [assetDeficit],
          chainId: Number(chainId),
        }
      }

      if (/InsufficientBalance/i.test(errorMessage))
        return {
          address: params?.address,
          chainId: params?.chainId,
        }
    }

    return null
  }, [quotes, error, params])

  const amount = React.useMemo(() => {
    if (!deficit?.assetDeficits?.length) return undefined

    const chain = deficit.chainId
      ? porto.config.chains.find((c) => c.id === deficit.chainId)
      : null

    const [firstDeficit] = deficit.assetDeficits
    if (!firstDeficit) return undefined

    const nativeCurrency = chain?.nativeCurrency
    const decimals = firstDeficit.decimals ?? nativeCurrency?.decimals ?? 18
    const symbol = firstDeficit.symbol ?? nativeCurrency?.symbol ?? 'ETH'

    const feeWithBuffer = ((deficit.feeTokenDeficit ?? 0n) * 5n) / 100n // +5% buffer
    const needed = firstDeficit.deficit + feeWithBuffer

    const exact = `${Value.format(needed, decimals)} ${symbol}`
    const rounded = `${ValueFormatter.format(needed, decimals)} ${symbol}`
    const fiat =
      firstDeficit.fiat &&
      `${firstDeficit.fiat.currency}${(Number.parseFloat(firstDeficit.fiat.value) * 1.05).toFixed(2)}`

    return { exact, fiat, needed, rounded }
  }, [deficit])

  if (!deficit) return null
  return { ...deficit, amount }
}

function FundsNeededSection(props: {
  deficit: ActionPreview.Deficit
  account?: Address.Address
  onReject: () => void
  onAddFunds: () => void
}) {
  const { deficit, account, onReject, onAddFunds } = props

  const depositAddress = deficit.address || account

  const chain = React.useMemo(() => {
    if (!deficit.chainId) return null
    return porto.config.chains.find((c) => c.id === deficit.chainId)
  }, [deficit.chainId])

  if (!deficit.assetDeficits)
    return (
      <div className="flex w-full px-3">
        <div className="flex w-full gap-[8px]">
          <Button onClick={onReject} variant="negative-secondary" width="grow">
            Cancel
          </Button>
          <Button onClick={onAddFunds} variant="primary" width="grow">
            Add funds
          </Button>
        </div>
      </div>
    )

  const referrer = Dialog.useStore((state) => state.referrer)
  const client = RemoteHooks.useRelayClient(porto)

  const showApplePay = React.useMemo(() => {
    if (UserAgent.isInAppBrowser()) return false
    if (UserAgent.isMobile() && !UserAgent.isSafari()) return false
    return (
      referrer?.url?.hostname.endsWith('localhost') ||
      referrer?.url?.hostname === 'playground.porto.sh' ||
      referrer?.url?.hostname.endsWith('preview.porto.sh')
    )
  }, [referrer?.url])

  const showFaucet = React.useMemo(() => {
    if (import.meta.env.MODE !== 'test' && !chain?.testnet) return false

    if (
      !deficit.assetDeficits?.length ||
      !deficit.chainId ||
      !deficit.assetDeficits[0]?.address
    )
      return false

    const tokenAddr = deficit.assetDeficits[0].address.toLowerCase()

    const isExp1 =
      tokenAddr ===
      exp1Address[deficit.chainId as keyof typeof exp1Address]?.toLowerCase()

    const isExp2 =
      tokenAddr ===
      exp2Address[deficit.chainId as keyof typeof exp2Address]?.toLowerCase()

    return (isExp1 || isExp2) && deficit.amount !== undefined
  }, [deficit, chain])

  const faucet = useMutation({
    async mutationFn() {
      if (!depositAddress) throw new Error('address is required')
      if (!deficit.chainId) throw new Error('chainId is required')
      if (!deficit.amount) throw new Error('deficit amount is required')
      if (!deficit.assetDeficits?.[0]?.address)
        throw new Error('deficit asset is required')

      const response = await RelayActions.addFaucetFunds(client, {
        address: depositAddress,
        chain: { id: deficit.chainId },
        tokenAddress: deficit.assetDeficits[0].address,
        value: deficit.amount.needed,
      })

      await Query.client.invalidateQueries({
        queryKey: ['prepareCalls'], // see Calls.prepareCalls.queryOptions.queryKey()
      })

      return response
    },
  })

  return (
    <div className="flex w-full flex-col gap-[10px] px-3">
      {showFaucet ? (
        <div className="flex w-full gap-[8px]">
          <Button
            data-testid="buy"
            loading={faucet.isPending && 'Adding funds…'}
            onClick={() => faucet.mutate()}
            variant="primary"
            width="grow"
          >
            Faucet
          </Button>
        </div>
      ) : (
        showApplePay && (
          <div className="flex w-full gap-[8px]">
            <Button
              disabled={faucet.isPending}
              onClick={onAddFunds}
              variant="strong"
              width="grow"
            >
              <div className="flex items-center gap-[6px]">
                Pay with
                <ApplePayIcon />
              </div>
            </Button>
          </div>
        )
      )}

      {(showApplePay || showFaucet) && depositAddress && (
        <Separator label="or" position="center" size="small" spacing={0} />
      )}

      {depositAddress && (
        <DepositButtons address={depositAddress} chainId={deficit.chainId} />
      )}
    </div>
  )
}

function ApplePayIcon() {
  return (
    <svg fill="none" height="15" viewBox="0 0 38 15" width="38">
      <title>Apple Pay</title>
      <path
        d="M6.89 1.944c-.404.49-1.088.856-1.633.856a.894.894 0 0 1-.163-.015 1.068 1.068 0 0 1-.024-.218c0-.623.32-1.245.662-1.634C6.167.419 6.899.038 7.506.015c.015.07.023.155.023.24 0 .623-.265 1.238-.638 1.69Zm.429.989c.342 0 1.58.03 2.389 1.198-.07.054-1.3.747-1.3 2.295 0 1.79 1.564 2.428 1.61 2.443a6.43 6.43 0 0 1-.824 1.712c-.513.74-1.058 1.487-1.875 1.487-.825 0-1.035-.483-1.976-.483-.926 0-1.253.498-2 .498-.755 0-1.276-.693-1.875-1.533-.7-.996-1.261-2.536-1.261-4 0-2.341 1.525-3.586 3.027-3.586.794 0 1.455.521 1.96.521.475 0 1.215-.552 2.125-.552Zm6.295 9.064V.77h4.482c2.28 0 3.82 1.502 3.82 3.75v.016c0 2.241-1.54 3.75-3.82 3.75h-2.474v3.712h-2.008Zm3.992-9.586h-1.984v4.256h1.984c1.44 0 2.28-.778 2.28-2.124v-.015c0-1.346-.84-2.117-2.28-2.117Zm7.187 9.726c-1.619 0-2.794-.995-2.794-2.544v-.015c0-1.518 1.16-2.405 3.23-2.53l2.186-.132v-.731c0-.848-.552-1.315-1.595-1.315-.887 0-1.463.319-1.657.88l-.008.03h-1.829l.008-.07c.187-1.431 1.556-2.38 3.58-2.38 2.186 0 3.415 1.058 3.415 2.855v5.812h-1.914V10.83h-.132c-.467.825-1.37 1.307-2.49 1.307Zm-.88-2.637c0 .723.615 1.151 1.471 1.151 1.167 0 2.03-.762 2.03-1.774v-.684l-1.913.124c-1.082.07-1.588.467-1.588 1.167V9.5Zm7.242 5.485a7.81 7.81 0 0 1-.74-.03v-1.487c.156.016.374.023.576.023.794 0 1.269-.326 1.479-1.097l.101-.389-3.042-8.512h2.116l1.984 6.645h.148l1.976-6.645h2.039l-3.05 8.683c-.731 2.132-1.704 2.81-3.587 2.81Z"
        fill="currentColor"
      />
    </svg>
  )
}
