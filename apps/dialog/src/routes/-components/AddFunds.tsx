import { UserAgent } from '@porto/apps'
import { exp1Address } from '@porto/apps/contracts'
import { usePrevious } from '@porto/apps/hooks'
import { Button, PresetsInput, Separator } from '@porto/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cx } from 'cva'
import { type Address, type Hex, Value } from 'ox'
import { Hooks as RemoteHooks } from 'porto/remote'
import { RelayActions } from 'porto/viem'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { zeroAddress, zeroHash } from 'viem'
import { useWatchBlockNumber } from 'wagmi'
import * as z from 'zod/mini'
import { DepositButtons } from '~/components/DepositButtons'
import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import * as Tokens from '~/lib/Tokens'
import { Layout } from '~/routes/-components/Layout'
import TriangleAlertIcon from '~icons/lucide/triangle-alert'
import Star from '~icons/ph/star-four-bold'
import { SetupApplePay } from './SetupApplePay'

const presetAmounts = ['30', '50', '100', '250'] as const
const maxAmount = 500

type View = 'default' | 'error' | 'onramp' | 'setup-onramp'

const dummy = true

export function AddFunds(props: AddFunds.Props) {
  const { chainId, onApprove, onReject } = props

  const [view, setView] = React.useState<View>('default')

  const account = RemoteHooks.useAccount(porto)
  const address = props.address ?? account?.address
  const chain = RemoteHooks.useChain(porto, { chainId })

  const client = RemoteHooks.useRelayClient(porto)
  const { data: onrampStatus } = useQuery({
    enabled: Boolean(address),
    async queryFn() {
      if (!address) throw new Error('address required')
      if (dummy) return { email: true, phone: false }
      return await RelayActions.onrampStatus(client, { address })
    },
    queryKey: ['onrampStatus', address],
  })
  const queryClient = useQueryClient()
  const { createOrder, lastOrderEvent } = useOnrampOrder({
    onApprove,
    sandbox: true,
  })

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

  const referrer = Dialog.useStore((state) => state.referrer)
  const showApplePay = React.useMemo(() => {
    if (UserAgent.isInAppBrowser()) return false
    if (UserAgent.isMobile() && !UserAgent.isSafari()) return false
    return (
      referrer?.url?.hostname.endsWith('localhost') ||
      referrer?.url?.hostname === 'playground.porto.sh' ||
      referrer?.url?.hostname.endsWith('preview.porto.sh')
    )
  }, [referrer?.url])

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
        dummy={dummy}
        onBack={() => {
          setView('default')
        }}
        onComplete={() => {
          if (!address) throw new Error('address is required')
          if (dummy)
            queryClient.setQueryData(
              ['onrampStatus', address],
              { email: true, phone: true },
              {},
            )
          createOrder.mutate(
            // TODO: Get `amount` from request
            { address, amount: '10' },
            {
              onSuccess() {
                setView('default')
              },
            },
          )
        }}
        showEmail={!onrampStatus?.email}
        showPhone={!onrampStatus?.phone}
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
            (onrampStatus?.email && onrampStatus?.phone ? (
              <>
                {createOrder.isSuccess && createOrder.data?.url && (
                  <iframe
                    allow="payment"
                    // TODO: tweak iframe styles
                    className={cx(
                      'h-12.5 w-full overflow-hidden border-0 bg-transparent',
                      lastOrderEvent?.eventName ===
                        'onramp_api.apple_pay_button_pressed'
                        ? 'overflow-visible! fixed inset-0 z-100 h-full!'
                        : 'w-full border-0 bg-transparent',
                    )}
                    src={createOrder.data.url}
                    title="Onramp"
                  />
                )}
                <Button>Pay with Apple Pay</Button>
              </>
            ) : (
              <Button onClick={() => setView('setup-onramp')}>
                Setup Apple Pay
              </Button>
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
  }
}

const cbPostMessageSchema = z.union([
  z.object({
    eventName: z.union([
      z.literal('onramp_api.apple_pay_button_pressed'),
      z.literal('onramp_api.cancel'),
      z.literal('onramp_api.commit_success'),
      z.literal('onramp_api.load_pending'),
      z.literal('onramp_api.load_success'),
      z.literal('onramp_api.polling_start'),
      z.literal('onramp_api.polling_success'),
    ]),
  }),
  z.object({
    data: z.object({
      errorCode: z.union([
        z.literal('ERROR_CODE_GUEST_APPLE_PAY_NOT_SETUP'),
        z.literal('ERROR_CODE_GUEST_APPLE_PAY_NOT_SUPPORTED'),
        z.literal('ERROR_CODE_INIT'),
      ]),
      errorMessage: z.string(),
    }),
    eventName: z.literal('onramp_api.load_error'),
  }),
  z.object({
    data: z.object({
      errorCode: z.union([
        z.literal('ERROR_CODE_GUEST_CARD_HARD_DECLINED'),
        z.literal('ERROR_CODE_GUEST_CARD_INSUFFICIENT_BALANCE'),
        z.literal('ERROR_CODE_GUEST_CARD_PREPAID_DECLINED'),
        z.literal('ERROR_CODE_GUEST_CARD_RISK_DECLINED'),
        z.literal('ERROR_CODE_GUEST_CARD_SOFT_DECLINED'),
        z.literal('ERROR_CODE_GUEST_INVALID_CARD'),
        z.literal('ERROR_CODE_GUEST_PERMISSION_DENIED'),
        z.literal('ERROR_CODE_GUEST_REGION_MISMATCH'),
        z.literal('ERROR_CODE_GUEST_TRANSACTION_COUNT'),
        z.literal('ERROR_CODE_GUEST_TRANSACTION_LIMIT'),
      ]),
      errorMessage: z.string(),
    }),
    eventName: z.literal('onramp_api.commit_error'),
  }),
  z.object({
    data: z.object({
      errorCode: z.union([
        z.literal('ERROR_CODE_GUEST_TRANSACTION_BUY_FAILED'),
        z.literal('ERROR_CODE_GUEST_TRANSACTION_SEND_FAILED'),
        z.literal('ERROR_CODE_GUEST_TRANSACTION_TRANSACTION_FAILED'),
        z.literal('ERROR_CODE_GUEST_TRANSACTION_AVS_VALIDATION_FAILED'),
      ]),
      errorMessage: z.string(),
    }),
    eventName: z.literal('onramp_api.polling_error'),
  }),
])
type CbPostMessageSchema = z.infer<typeof cbPostMessageSchema>

function useOnrampOrder(props: {
  sandbox?: boolean | undefined
  onApprove: (result: { id: Hex.Hex }) => void
}) {
  const { sandbox = true, onApprove } = props

  const domain = Dialog.useStore((state) =>
    state.mode === 'popup' ? location.hostname : state.referrer?.url?.hostname,
  )
  const createOrder = useMutation({
    async mutationFn(variables: { address: string; amount: string }) {
      if (dummy) {
        console.log(
          'started:',
          `${import.meta.env.VITE_WORKERS_URL}/onramp/orders`,
        )
        await new Promise((resolve) => {
          console.log(
            'finished:',
            `${import.meta.env.VITE_WORKERS_URL}/onramp/orders`,
          )
          setTimeout(resolve, 2_000)
        })
        return { orderId: 'foo', type: 'apple', url: 'https://example.com' }
      }
      const response = await fetch(
        `${import.meta.env.VITE_WORKERS_URL}/onramp/orders`,
        {
          body: JSON.stringify({
            address: variables.address,
            amount: Number.parseFloat(variables.amount),
            domain,
            sandbox,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        },
      )
      return z.parse(
        z.object({
          orderId: z.string(),
          type: z.literal('apple'),
          url: z.string(),
        }),
        await response.json(),
      )
    },
  })

  const [orderEvents, setOnrampEvents] = React.useState<CbPostMessageSchema[]>(
    [],
  )
  const lastOrderEvent = React.useMemo(() => orderEvents.at(-1), [orderEvents])

  // TODO: add iframe loading timeout
  React.useEffect(() => {
    function handlePostMessage(event: MessageEvent) {
      if (event.origin !== 'https://pay.coinbase.com') return
      try {
        const data = z.parse(cbPostMessageSchema, JSON.parse(event.data))
        console.log('postMessage', data)
        if ('eventName' in data && data.eventName.startsWith('onramp_api.')) {
          setOnrampEvents((state) => [...state, data])
          if (data.eventName === 'onramp_api.commit_success')
            onApprove({ id: zeroAddress })
        }
      } catch (error) {
        setOnrampEvents((state) => [
          ...state,
          {
            data: {
              errorCode: 'ERROR_CODE_GUEST_APPLE_PAY_NOT_SUPPORTED',
              errorMessage: (error as Error).message ?? 'Something went wrong',
            },
            eventName: 'onramp_api.load_error',
          },
        ])
      }
    }
    window.addEventListener('message', handlePostMessage)
    return () => {
      window.removeEventListener('message', handlePostMessage)
    }
  }, [onApprove])

  return {
    createOrder,
    lastOrderEvent,
    orderEvents,
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
