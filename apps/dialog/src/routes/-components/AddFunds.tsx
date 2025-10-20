import { exp1Address } from '@porto/apps/contracts'
import { usePrevious } from '@porto/apps/hooks'
import { Button, PresetsInput, Separator } from '@porto/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type Address, type Hex, Value } from 'ox'
import { Hooks as RemoteHooks } from 'porto/remote'
import { RelayActions } from 'porto/viem'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { zeroAddress, zeroHash } from 'viem'
import { useWatchBlockNumber } from 'wagmi'
import { DepositButtons } from '~/components/DepositButtons'
import { useOnrampOrder, useShowApplePay } from '~/lib/onramp'
import { porto } from '~/lib/Porto'
import * as Tokens from '~/lib/Tokens'
import { Layout } from '~/routes/-components/Layout'
import TriangleAlertIcon from '~icons/lucide/triangle-alert'
import Star from '~icons/ph/star-four-bold'
import { ApplePayButton, ApplePayIframe } from './ActionPreview'
import { SetupApplePay } from './SetupApplePay'

const presetAmounts = ['30', '50', '100', '250'] as const
const maxAmount = 500

type View = 'default' | 'error' | 'onramp' | 'setup-onramp'

export function AddFunds(props: AddFunds.Props) {
  const { chainId, onApprove, onReject, value } = props

  const [view, setView] = React.useState<View>('default')

  const account = RemoteHooks.useAccount(porto)
  const address = props.address ?? account?.address
  const chain = RemoteHooks.useChain(porto, { chainId })

  const showApplePay = useShowApplePay()
  const client = RemoteHooks.useRelayClient(porto)
  const { data: onrampStatus } = useQuery({
    enabled: Boolean(showApplePay && address),
    async queryFn() {
      if (!address) throw new Error('address required')
      const timestamp = Math.floor(Date.now() / 1000)
      return await RelayActions.onrampStatus(client, { address })
    },
    queryKey: ['onrampStatus', address],
    select(data) {
      const reverifyPhone = (() => {
        if (!data.phone) return false
        const timestampDate = new Date(data.phone * 1000)
        const currentDate = new Date()
        const diffInMs = currentDate.getTime() - timestampDate.getTime()
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
        return diffInDays > 60
      })()
      return { ...data, reverifyPhone }
    },
  })
  const { createOrder, lastOrderEvent } = useOnrampOrder({
    onApprove,
    sandbox: true,
  })
  const [iframeLoaded, setIframeLoaded] = React.useState(false)

  const queryClient = useQueryClient()
  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  const onCompleteOnrampSetup = React.useCallback(() => {
    if (!address) throw new Error('address is required')
    const timestamp = Math.floor(Date.now() / 1000)
    queryClient.setQueryData(
      ['onrampStatus', address],
      {
        email: onrampStatus?.email ?? timestamp,
        phone: onrampStatus?.phone ?? timestamp,
      },
      {},
    )
    createOrder.mutate(
      { address, amount: value ?? '10' },
      {
        onSuccess() {
          setView('default')
        },
      },
    )
  }, [address, value, onrampStatus])

  // create onramp order if onramp status is valid
  // biome-ignore lint/correctness/useExhaustiveDependencies: keep stable
  React.useEffect(() => {
    if (!address) return
    if (
      onrampStatus?.email &&
      onrampStatus.phone &&
      !onrampStatus.reverifyPhone
    ) {
      setIframeLoaded(false)
      createOrder.mutate({ address, amount: value ?? '10' })
    }
  }, [address, onrampStatus])

  const { data: tokens } = Tokens.getTokens.useQuery()
  const { data: assets, refetch: refetchAssets } = Hooks.useAssets({
    account: account?.address,
    query: {
      enabled: Boolean(account?.address),
      select: (data) =>
        // As we support interop, we can listen to the
        // aggregated assets across all supported chains.
        data[0],
    },
  })
  const balanceMap = React.useMemo(() => {
    const addressBalanceMap = new Map<Address.Address, bigint>()
    if (!assets) return addressBalanceMap

    const tokenAddressMap = new Map<Address.Address, boolean>()
    if (tokens)
      for (const token of tokens) tokenAddressMap.set(token.address, true)

    for (const asset of assets) {
      const address =
        (asset.address === 'native' || asset.type === 'native'
          ? zeroAddress
          : asset.address) ?? zeroAddress
      if (tokenAddressMap.has(address)) {
        const balance = addressBalanceMap.get(address)
        addressBalanceMap.set(address, (balance ?? 0n) + asset.balance)
      }
    }
    return addressBalanceMap
  }, [assets, tokens])
  useWatchBlockNumber({
    enabled: Boolean(account?.address),
    onBlockNumber() {
      refetchAssets()
    },
  })
  const previousBalanceMap = usePrevious({ value: balanceMap })

  // Close dialog when one of the token balances increases
  React.useEffect(() => {
    if (typeof previousBalanceMap === 'undefined') return
    for (const [address, balance] of balanceMap) {
      const previousBalance = previousBalanceMap.get(address)
      if (typeof previousBalance === 'undefined') continue
      if (balance > previousBalance) onApprove?.({ id: zeroHash })
    }
  }, [balanceMap, onApprove, previousBalanceMap])

  const showFaucet = React.useMemo(() => {
    if (import.meta.env.MODE === 'test') return true
    // Don't show faucet if not on "default" view.
    if (view !== 'default') return false
    // Show faucet if on a testnet.
    if (chain?.testnet) return true
    return false
  }, [chain, view])

  if (view === 'error')
    return (
      <Layout>
        <Layout.Header>
          <Layout.Header.Default
            icon={TriangleAlertIcon}
            title="Deposit failed"
            variant="destructive"
          />
        </Layout.Header>

        <Layout.Content className="px-1">
          <p className="text-th_base">Your deposit was cancelled or failed.</p>
          <p className="text-th_base-secondary">
            No funds have been deposited.
          </p>
        </Layout.Content>

        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button
              className="flex-grow"
              onClick={() => onReject?.()}
              variant="secondary"
            >
              Close
            </Button>
            <Button
              className="flex-grow"
              onClick={() => setView('default')}
              variant="primary"
            >
              Try again
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
      </Layout>
    )

  if (view === 'setup-onramp')
    return (
      <SetupApplePay
        address={address!}
        onBack={() => {
          setView('default')
        }}
        onComplete={onCompleteOnrampSetup}
        showEmail={!onrampStatus?.email}
        showPhone={!onrampStatus?.phone || onrampStatus?.reverifyPhone}
      />
    )

  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          icon={Star}
          title="Add funds"
          variant="default"
        />
      </Layout.Header>

      <Layout.Content>
        <div className="flex flex-col gap-3">
          <Separator label="Select deposit method" size="medium" spacing={0} />
          {showFaucet && (
            <Faucet
              address={address}
              chainId={chain?.id}
              onApprove={onApprove}
            />
          )}
          {showApplePay &&
            address &&
            (onrampStatus?.email &&
            onrampStatus.phone &&
            !onrampStatus.reverifyPhone ? (
              <div className="flex w-full flex-col">
                {createOrder.isSuccess && createOrder.data?.url && (
                  <ApplePayIframe
                    lastOrderEvent={lastOrderEvent}
                    loaded={iframeLoaded}
                    setLoaded={setIframeLoaded}
                    src={createOrder.data.url}
                  />
                )}
                {(!iframeLoaded ||
                  lastOrderEvent?.eventName ===
                    'onramp_api.apple_pay_button_pressed' ||
                  lastOrderEvent?.eventName === 'onramp_api.polling_start') && (
                  <ApplePayButton label="Pay with" loading />
                )}
              </div>
            ) : (
              <ApplePayButton
                label="Set up"
                onClick={() => setView('setup-onramp')}
              />
            ))}
          {view !== 'onramp' && (
            <DepositButtons
              address={address ?? ''}
              chainId={chain?.id}
              nativeTokenName={chain?.nativeCurrency?.symbol}
            />
          )}
        </div>
      </Layout.Content>
      {onReject && view !== 'onramp' && (
        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button onClick={onReject} variant="secondary" width="full">
              Back
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
      )}
    </Layout>
  )
}

export declare namespace AddFunds {
  export type Props = {
    address?: Address.Address | undefined
    chainId?: number | undefined
    onApprove: (result: { id: Hex.Hex }) => void
    onReject?: () => void
    value?: string | undefined
  }
}

function Faucet(props: {
  address: Address.Address | undefined
  chainId: number | undefined
  onApprove: (result: { id: Hex.Hex }) => void
}) {
  const { address, chainId, onApprove } = props

  const [amount, setAmount] = React.useState<string>(presetAmounts[0])

  const client = RemoteHooks.useRelayClient(porto)
  const faucet = useMutation({
    async mutationFn(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      e.stopPropagation()

      if (!address) throw new Error('address is required')
      if (!chainId) throw new Error('chainId is required')

      const value = Value.from(amount, 18)

      const data = await RelayActions.addFaucetFunds(client, {
        address,
        chain: { id: chainId },
        tokenAddress: exp1Address[chainId as never],
        value,
      })
      return data
    },
    onSuccess(data) {
      onApprove({ id: data.transactionHash })
    },
  })

  return (
    <form
      className="grid h-min grid-flow-row auto-rows-min grid-cols-1 space-y-3"
      onSubmit={(e) => faucet.mutate(e)}
    >
      <div className="col-span-1 row-span-1">
        <PresetsInput
          adornments={{
            end: {
              label: `Max. $${maxAmount}`,
              type: 'fill',
              value: String(maxAmount),
            },
            start: '$',
          }}
          inputMode="decimal"
          max={maxAmount}
          min={0}
          onChange={setAmount}
          placeholder="Enter amount"
          presets={presetAmounts.map((value) => ({
            label: `$${value}`,
            value,
          }))}
          type="number"
          value={amount}
        />
      </div>
      <div className="col-span-1 row-span-1 space-y-3.5">
        <Button
          className="w-full flex-1"
          data-testid="buy"
          disabled={!address || !amount || Number(amount) === 0}
          loading={faucet.isPending && 'Adding funds…'}
          type="submit"
          variant="primary"
          width="grow"
        >
          Add faucet funds
        </Button>
      </div>
    </form>
  )
}
