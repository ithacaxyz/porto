import { UserAgent } from '@porto/apps'
import { exp1Address } from '@porto/apps/contracts'
import { Button, PresetsInput, Separator } from '@porto/ui'
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query'
import { cx } from 'cva'
import { type Address, type Hex, Value } from 'ox'
import { Hooks as RemoteHooks } from 'porto/remote'
import { RelayActions } from 'porto/viem'
import * as React from 'react'
import { zeroAddress } from 'viem'
import { createConfig, WagmiProvider } from 'wagmi'
import * as z from 'zod/mini'
import { DepositButtons } from '~/components/DepositButtons'
import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import TriangleAlertIcon from '~icons/lucide/triangle-alert'
import Star from '~icons/ph/star-four-bold'

const presetAmounts = ['30', '50', '100', '250'] as const
const maxAmount = 500

const config = createConfig({
  chains: porto._internal.config.chains,
  multiInjectedProviderDiscovery: true,
  storage: null,
  transports: porto._internal.config.transports,
})
const queryClient = new QueryClient()

type View = 'default' | 'error' | 'onramp'

export function AddFunds(props: AddFunds.Props) {
  const { chainId, onApprove, onReject } = props

  const [view, setView] = React.useState<View>('default')

  const account = RemoteHooks.useAccount(porto)
  const address = props.address ?? account?.address
  const chain = RemoteHooks.useChain(porto, { chainId })

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
          {showFaucet ? (
            <Faucet
              address={address}
              chainId={chain?.id}
              onApprove={onApprove}
            />
          ) : (
            showApplePay &&
            address && (
              <Onramp
                address={address}
                onApprove={onApprove}
                setView={setView}
              />
            )
          )}
          {view !== 'onramp' && (
            <WagmiProvider config={config} reconnectOnMount={false}>
              <QueryClientProvider client={queryClient}>
                <DepositButtons address={address ?? ''} chainId={chain?.id} />
              </QueryClientProvider>
            </WagmiProvider>
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

function Onramp(props: {
  address: Address.Address
  onApprove: (result: { id: Hex.Hex }) => void
  setView: (view: View) => void
}) {
  const { address } = props

  const [view, setView] = React.useState<'start' | 'amount' | 'pay'>('start')

  const minAmount = 2
  const maxAmount = 500
  const presetAmounts = React.useMemo(() => {
    if (minAmount > 0) {
      const getMultipliers = (amount: number) => {
        if (amount <= 5) return [1, 5, 10, 25]
        if (amount <= 10) return [1, 2, 5, 10]
        return [1, 2, 3, 4]
      }
      return getMultipliers(minAmount).map(
        (multiplier) => minAmount * multiplier,
      )
    }
    return [30, 50, 100, 250] as const
  }, [])

  const [mode, setMode] = React.useState<'preset' | 'custom'>(
    minAmount ? 'custom' : 'preset',
  )
  const [amount, setAmount] = React.useState<string>(
    (minAmount ? minAmount : presetAmounts[0]).toString(),
  )
  const [sandbox, setSandbox] = React.useState(true)

  const domain = Dialog.useStore((state) =>
    state.mode === 'popup' ? location.hostname : state.referrer?.url?.hostname,
  )
  const createOrder = useMutation({
    async mutationFn(variables: { address: string; amount: string }) {
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

  const [onrampState, setOnrampState] = React.useState<CbPostMessageSchema>({
    eventName: 'onramp_api.load_pending',
  })
  // TODO: iframe loading timeout
  React.useEffect(() => {
    function handlePostMessage(event: MessageEvent) {
      if (event.origin !== 'https://pay.coinbase.com') return
      try {
        const data = z.parse(cbPostMessageSchema, JSON.parse(event.data))
        console.log('postMessage', data)
        if ('eventName' in data && data.eventName.startsWith('onramp_api.')) {
          setOnrampState(data)
          if (data.eventName === 'onramp_api.commit_success') {
            // TODO: get transaction hash from order
            // https://docs.cdp.coinbase.com/api-reference/v2/rest-api/onramp/get-an-onramp-order-by-id
            props.onApprove({ id: zeroAddress })
          }
        }
      } catch (error) {
        setOnrampState({
          data: {
            errorCode: 'ERROR_CODE_GUEST_APPLE_PAY_NOT_SUPPORTED',
            errorMessage: (error as Error).message ?? 'Something went wrong',
          },
          eventName: 'onramp_api.load_error',
        })
      }
    }
    window.addEventListener('message', handlePostMessage)
    return () => {
      window.removeEventListener('message', handlePostMessage)
    }
  }, [props.onApprove])

  if (view === 'start') {
    return (
      <Button
        className="w-full flex-1"
        onClick={() => {
          props.setView('onramp')
          setView('amount')
        }}
        type="submit"
        variant="primary"
        width="grow"
      >
        Onramp
      </Button>
    )
  }

  // TODO: Show amount selector immediately if email/phone exist for address + phone is verified
  if (view === 'amount') {
    return (
      <form
        className="grid h-min grid-flow-row auto-rows-min grid-cols-1 space-y-3"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          createOrder.mutate(
            { address, amount },
            {
              onSuccess() {
                setView('pay')
              },
            },
          )
        }}
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
            min={minAmount}
            mode={mode}
            onChange={setAmount}
            onModeChange={setMode}
            placeholder="Enter amount"
            presets={presetAmounts.map((value) => ({
              label: `$${value}`,
              value: value.toString(),
            }))}
            type="number"
            value={amount}
          />
        </div>
        <div className="col-span-1 row-span-1 space-y-1.5">
          <label>
            <input
              checked={sandbox}
              onChange={() => setSandbox((x) => !x)}
              type="checkbox"
            />
            Sandbox?
          </label>
        </div>
        <div className="col-span-1 row-span-1 space-y-1.5">
          <Button
            className="w-full flex-1"
            disabled={!address || !amount || Number(amount) === 0}
            loading={createOrder.isPending}
            type="submit"
            variant="primary"
            width="grow"
          >
            Continue
          </Button>
          <Button
            className="w-full flex-1"
            onClick={() => {
              props.setView('default')
              setView('start')
            }}
            type="button"
            variant="secondary"
            width="grow"
          >
            Back
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div>
      {createOrder.isSuccess && createOrder.data?.url && (
        <iframe
          // TODO: tweak iframe styles
          className={cx(
            'h-12.5 w-full overflow-hidden border-0 bg-transparent',
            onrampState.eventName === 'onramp_api.apple_pay_button_pressed'
              ? 'overflow-visible! fixed inset-0 z-100 h-full!'
              : 'w-full border-0 bg-transparent',
          )}
          onError={() =>
            setOnrampState({
              data: {
                errorCode: 'ERROR_CODE_INIT',
                errorMessage: 'Failed to load',
              },
              eventName: 'onramp_api.load_error',
            })
          }
          src={createOrder.data.url}
          title="Onramp"
        />
      )}
      <Button
        className="w-full flex-1"
        onClick={() => setView('amount')}
        type="button"
        variant="secondary"
        width="grow"
      >
        Back
      </Button>
    </div>
  )
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
