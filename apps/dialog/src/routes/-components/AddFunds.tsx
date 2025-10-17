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

const sandbox = true
const dummy = false

export function AddFunds(props: AddFunds.Props) {
  const { chainId, onApprove, onReject, value } = props

  const [view, setView] = React.useState<View>('default')

  const account = RemoteHooks.useAccount(porto)
  const address = props.address ?? account?.address
  const chain = RemoteHooks.useChain(porto, { chainId })

  const client = RemoteHooks.useRelayClient(porto)
  const { data: onrampStatus } = useQuery({
    enabled: Boolean(address),
    async queryFn() {
      if (!address) throw new Error('address required')
      const localDummy = true
      if (localDummy || dummy) return { email: true, phone: true }
      return await RelayActions.onrampStatus(client, { address })
    },
    queryKey: ['onrampStatus', address],
  })
  const { createOrder, lastOrderEvent } = useOnrampOrder({
    onApprove,
    sandbox,
  })
  const [iframeLoaded, setIframeLoaded] = React.useState(false)

  const queryClient = useQueryClient()
  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  const onCompleteOnrampSetup = React.useCallback(() => {
    if (!address) throw new Error('address is required')
    if (dummy)
      queryClient.setQueryData(
        ['onrampStatus', address],
        { email: true, phone: true },
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
  }, [address, value])

  // create onramp order if onramp status is valid
  // biome-ignore lint/correctness/useExhaustiveDependencies: keep stable
  React.useEffect(() => {
    if (!address) return
    if (onrampStatus?.email && onrampStatus?.phone) {
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
        onComplete={onCompleteOnrampSetup}
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
              <div className="flex w-full flex-col">
                {createOrder.isSuccess && createOrder.data?.url && (
                  <iframe
                    {...(!UserAgent.isFirefox() && {
                      allow: 'payment',
                    })}
                    className={cx(
                      'h-12.5 w-full overflow-hidden border-0 bg-transparent',
                      lastOrderEvent?.eventName ===
                        'onramp_api.apple_pay_button_pressed' ||
                        lastOrderEvent?.eventName === 'onramp_api.polling_start'
                        ? 'overflow-visible! fixed inset-0 z-100 h-full!'
                        : 'w-full border-0 bg-transparent',
                      !iframeLoaded && 'sr-only!',
                    )}
                    onLoad={() => setIframeLoaded(true)}
                    src={createOrder.data.url}
                    title="Onramp"
                  />
                )}
                {(!iframeLoaded ||
                  lastOrderEvent?.eventName ===
                    'onramp_api.apple_pay_button_pressed' ||
                  lastOrderEvent?.eventName === 'onramp_api.polling_start') && (
                  <Button
                    className="bg-black! text-white! dark:bg-white! dark:text-black!"
                    disabled
                    loading={
                      <>
                        <span className="-tracking-[2.8%] font-medium text-[14px]">
                          Pay with
                        </span>
                        {applePayLogo}
                      </>
                    }
                  />
                )}
              </div>
            ) : (
              <Button
                className="bg-black! text-white! dark:bg-white! dark:text-black!"
                onClick={() => setView('setup-onramp')}
              >
                <span className="-tracking-[2.8%] font-medium text-[14px]">
                  Set up
                </span>
                {applePayLogo}
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
    value?: string | undefined
  }
}

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
    onSuccess() {
      setOnrampEvents([])
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

  console.log({ lastOrderEvent })

  return {
    createOrder,
    lastOrderEvent,
    orderEvents,
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

const applePayLogo = (
  <svg
    className="-ms-1 mt-0.5"
    fill="none"
    height="15"
    viewBox="0 0 38 15"
    width="38"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Apple Pay</title>
    <path
      d="M6.89094 1.94434C6.48632 2.43455 5.80159 2.80026 5.25692 2.80026C5.19467 2.80026 5.13242 2.79248 5.09352 2.7847C5.08574 2.75357 5.07018 2.6602 5.07018 2.56683C5.07018 1.94434 5.3892 1.32186 5.73156 0.93281C6.1673 0.419262 6.89872 0.0379915 7.50564 0.0146484C7.5212 0.0846777 7.52898 0.170269 7.52898 0.25586C7.52898 0.878343 7.26443 1.49304 6.89094 1.94434ZM7.31889 2.93253C7.66126 2.93253 8.89844 2.96366 9.70767 4.13081C9.63764 4.18528 8.40824 4.87779 8.40824 6.42622C8.40824 8.21585 9.97223 8.8539 10.0189 8.86946C10.0111 8.90837 9.76992 9.73316 9.19412 10.5813C8.68057 11.3205 8.1359 12.0675 7.31889 12.0675C6.4941 12.0675 6.28402 11.585 5.34251 11.585C4.41657 11.585 4.08977 12.083 3.34279 12.083C2.58803 12.083 2.0667 11.3905 1.46756 10.5502C0.767265 9.55419 0.207031 8.01355 0.207031 6.55071C0.207031 4.20862 1.73211 2.96366 3.23385 2.96366C4.02752 2.96366 4.68891 3.48499 5.19467 3.48499C5.66931 3.48499 6.40851 2.93253 7.31889 2.93253Z"
      fill="currentColor"
    />
    <path
      d="M13.6142 11.9974V0.769408H18.096C20.3759 0.769408 21.9165 2.27115 21.9165 4.51987V4.53543C21.9165 6.77636 20.3759 8.28588 18.096 8.28588H15.6217V11.9974H13.6142ZM17.6058 2.41121H15.6217V6.66743H17.6058C19.0453 6.66743 19.8857 5.88933 19.8857 4.54321V4.52765C19.8857 3.18153 19.0453 2.41121 17.6058 2.41121Z"
      fill="currentColor"
    />
    <path
      d="M24.7927 12.1375C23.1743 12.1375 21.9993 11.1415 21.9993 9.5931V9.57753C21.9993 8.06023 23.1587 7.1732 25.2285 7.0487L27.4149 6.91642V6.18501C27.4149 5.33687 26.8625 4.87001 25.8198 4.87001C24.9328 4.87001 24.357 5.18903 24.1625 5.74927L24.1547 5.78039H22.3261L22.3339 5.71036C22.5207 4.27865 23.8901 3.32937 25.9132 3.32937C28.0997 3.32937 29.3291 4.38759 29.3291 6.18501V11.9974H27.4149V10.8303H27.2827C26.8158 11.6551 25.9132 12.1375 24.7927 12.1375ZM23.9135 9.49972C23.9135 10.2234 24.5282 10.6513 25.3841 10.6513C26.5512 10.6513 27.4149 9.88878 27.4149 8.87724V8.19251L25.5008 8.31701C24.4192 8.38704 23.9135 8.78387 23.9135 9.48416V9.49972Z"
      fill="currentColor"
    />
    <path
      d="M31.1548 14.9854C30.9214 14.9854 30.6491 14.9776 30.4156 14.9542V13.4681C30.5713 13.4836 30.7891 13.4914 30.9914 13.4914C31.7851 13.4914 32.2597 13.1646 32.4698 12.3943L32.571 12.0052L29.5286 3.49277H31.645L33.6292 10.1378H33.777L35.7534 3.49277H37.792L34.7419 12.1764C34.0105 14.3084 33.0378 14.9854 31.1548 14.9854Z"
      fill="currentColor"
    />
  </svg>
)
