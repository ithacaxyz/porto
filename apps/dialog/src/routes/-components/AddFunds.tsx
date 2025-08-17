import * as Ariakit from '@ariakit/react'
import { UserAgent } from '@porto/apps'
import { Button } from '@porto/apps/components'
import { erc20Abi } from '@porto/apps/contracts'
import { useCopyToClipboard, usePrevious } from '@porto/apps/hooks'
import * as UI from '@porto/ui'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Cuer } from 'cuer'
import { cx } from 'cva'
import { type Address, Hex, Value } from 'ox'
import { Actions, Hooks } from 'porto/remote'
import * as React from 'react'
import { useBalance, useWatchBlockNumber, useWatchContractEvent } from 'wagmi'
import { PayButton } from '~/components/PayButton'
import * as FeeTokens from '~/lib/FeeTokens'
import { enableOnramp, getOnrampWidget, stripeOnrampUrl } from '~/lib/Onramp.ts'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import { StringFormatter } from '~/utils'
import ArrowRightIcon from '~icons/lucide/arrow-right'
import CopyIcon from '~icons/lucide/copy'
import CardIcon from '~icons/lucide/credit-card'
import QrCodeIcon from '~icons/lucide/qr-code'
import TriangleAlertIcon from '~icons/lucide/triangle-alert'

const presetAmounts = ['30', '50', '100', '250'] as const

const MAX_AMOUNT = 500

export function AddFunds(props: AddFunds.Props) {
  const {
    chainId,
    onApprove,
    onReject,
    tokenAddress,
    value: defaultValue,
  } = props

  const account = Hooks.useAccount(porto)
  const chain = Hooks.useChain(porto, { chainId })
  const feeTokens = FeeTokens.fetch.useQuery({
    addressOrSymbol: tokenAddress,
  })
  const feeToken = feeTokens.data?.[0]

  const address = props.address ?? account?.address

  const [amount, setAmount] = React.useState<string>(
    defaultValue
      ? Math.ceil(Number(defaultValue)).toString()
      : presetAmounts[0]!,
  )
  const [view, setView] = React.useState<
    'default' | 'deposit-crypto' | 'error' | 'email'
  >('default')
  const [emailView, setEmailView] = React.useState<
    'start' | 'added' | 'validated' | 'invalidated'
  >('start')
  const [email, setEmail] = React.useState<string>('')

  const onrampMethod = enableOnramp()
    ? UserAgent.isFirefox() || UserAgent.isAndroid()
      ? 'google'
      : 'apple'
    : 'faucet'

  const faucet = useMutation({
    async mutationFn(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      e.stopPropagation()

      if (!address) throw new Error('address is required')
      if (!chain) throw new Error('chain is required')
      if (!feeToken) throw new Error('feeToken is required')

      const value = Value.from(amount, feeToken.decimals)
      const params = new URLSearchParams({
        address,
        chainId: chain.id.toString(),
        value: value.toString(),
      })
      const response = await fetch(
        `${import.meta.env.VITE_WORKERS_URL}/faucet?${params.toString()}`,
      )
      if (!response.ok) throw new Error('Failed to fetch funds')
      const data = (await response.json()) as { id: Hex.Hex }
      return data
    },
    onSuccess: (data) => {
      onApprove(data)
    },
  })

  if (faucet.isSuccess) return

  if (view === 'default')
    return (
      <Layout>
        <Layout.Header>
          <Layout.Header.Default
            content="Select how much you will deposit."
            title="Deposit funds"
          />
        </Layout.Header>

        <Layout.Content>
          <form
            className="grid h-min grid-flow-row auto-rows-min grid-cols-1 space-y-3"
            onSubmit={(e) => faucet.mutate(e)}
          >
            <div className="col-span-1 row-span-1">
              <UI.PresetsInput
                adornments={{
                  end: {
                    label: `Max. $${MAX_AMOUNT}`,
                    type: 'fill',
                    value: String(MAX_AMOUNT),
                  },
                  start: '$',
                }}
                inputMode="decimal"
                max={MAX_AMOUNT}
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
              <OnrampView
                address={address}
                amount={amount}
                loading={faucet.isPending}
                onApprove={onApprove}
                onReject={onReject}
                onrampMethod={onrampMethod}
              />
            </div>
            <div className="col-span-1 row-span-1">
              <div className="my-auto flex w-full flex-row items-center gap-2 *:border-th_separator">
                <hr className="flex-1 border-th_separator" />
                <span className="px-3 text-th_base-secondary">or</span>
                <hr className="flex-1 border-th_separator" />
              </div>
            </div>
            <div className="col-span-1 row-span-1 space-y-2">
              <Button
                className="w-full px-3!"
                disabled={faucet.isPending}
                onClick={() => setView('deposit-crypto')}
                type="button"
              >
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCodeIcon className="size-5" />
                    <span>Deposit crypto</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="ml-auto font-normal text-sm text-th_base-secondary">
                      Instant
                    </span>
                    <ArrowRightIcon className="size-4 text-th_base-secondary" />
                  </div>
                </div>
              </Button>
              <Button
                className="w-full px-3! disabled:opacity-50"
                disabled
                hidden
                title="Coming soon"
                type="button"
              >
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardIcon className="size-5" />
                    <span>Debit or Credit</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="ml-auto font-normal text-sm text-th_base-secondary">
                      ~5 mins
                      <ArrowRightIcon className="ml-1 inline size-4" />
                    </span>
                  </div>
                </div>
              </Button>
            </div>
          </form>
          {onrampMethod === 'apple' && (
            <p className="mt-4 text-center text-[11.5px] text-th_base-secondary">
              By using our deposit on-ramp, you agree to our{' '}
              <a
                className="text-th_base-secondary underline"
                href="https://porto.sh/terms"
                rel="noopener noreferrer"
                target="_blank"
              >
                Terms of Use
              </a>{' '}
              and{' '}
              <a
                className="text-th_base-secondary underline"
                href="https://ithaca.xyz/about/privacy-policy"
                rel="noopener noreferrer"
                target="_blank"
              >
                Privacy Policy for Porto
              </a>
              .
            </p>
          )}
        </Layout.Content>
      </Layout>
    )

  if (view === 'deposit-crypto')
    return (
      <DepositCryptoView
        address={address}
        onApprove={onApprove}
        onBack={() => setView('default')}
      />
    )

  if (view === 'email') {
    function validateEmail(email: string) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }

    const isValidEmail = validateEmail(email)

    function handleEmailSubmit(e: React.FormEvent) {
      e.preventDefault()
      if (isValidEmail) setEmailView('validated')
      else if (email.length > 0) setEmailView('invalidated')
      // TODO: add email submit (async)
    }

    return (
      <Layout>
        <Layout.Header>
          <Layout.Header.Default
            content={
              emailView === 'invalidated'
                ? ''
                : 'We need this to set up Apple Pay and Google Pay for payment.'
            }
            title="Add your email"
          />
        </Layout.Header>

        <Layout.Content>
          <form className="space-y-4" onSubmit={handleEmailSubmit}>
            <div className="relative">
              <input
                autoCapitalize="off"
                autoComplete="email"
                autoCorrect="off"
                // biome-ignore lint/a11y/noAutofocus: _
                autoFocus
                className={cx(
                  'w-full rounded-lg border-[1.5px] bg-th_field px-3 py-3 pr-10 placeholder:text-th_field focus:border-th_focus focus:bg-th_field-focused focus:outline-none',
                  emailView === 'invalidated'
                    ? 'border-th_field-error text-th_field-error'
                    : emailView === 'validated'
                      ? 'border-th_focus text-th_base'
                      : 'border-transparent text-th_base',
                )}
                disabled={emailView === 'validated'}
                inputMode="email"
                onChange={(e) => {
                  const newEmail = e.target.value
                  setEmail(newEmail)

                  // Reset view states as user types
                  if (newEmail === '') setEmailView('start')
                  else if (validateEmail(newEmail)) setEmailView('validated')
                  else setEmailView('added')
                }}
                placeholder="achel@achal.me"
                required
                spellCheck={false}
                type="email"
                value={email}
              />
              {emailView === 'validated' && (
                <svg
                  aria-hidden="true"
                  aria-label="Valid email"
                  className="-translate-y-1/2 absolute top-1/2 right-3 size-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {emailView === 'invalidated' && (
                <p className="mt-2 text-sm text-th_field-error">
                  Invalid email
                </p>
              )}
            </div>

            <Button
              className="w-full"
              disabled={!isValidEmail}
              onClick={
                emailView === 'validated' ? () => setView('default') : undefined
              }
              type={emailView === 'validated' ? 'button' : 'submit'}
              variant="primary"
            >
              Continue
            </Button>
          </form>

          <p className="mt-4 text-center text-[11.5px] text-th_base-secondary">
            By using our deposit on-ramp, you agree to our{' '}
            <a
              className="text-th_base-secondary underline"
              href="https://porto.sh/terms"
              rel="noopener noreferrer"
              target="_blank"
            >
              Terms of Use
            </a>{' '}
            and{' '}
            <a
              className="text-th_base-secondary underline"
              href="https://ithaca.xyz/about/privacy-policy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Privacy Policy for Porto
            </a>
            .
          </p>
        </Layout.Content>
      </Layout>
    )
  }

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
              variant="default"
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

  return null
}

export declare namespace AddFunds {
  export type Props = {
    address?: Address.Address | undefined
    chainId?: number | undefined
    onApprove: (result: { id: Hex.Hex }) => void
    onReject?: () => void
    tokenAddress?: Address.Address | undefined
    value?: string | undefined
  }
}

function OnrampView(props: OnrampView.Props) {
  const { address, amount, loading, onrampMethod } = props

  const onrampWidget = getOnrampWidget()

  const onrampQuery = useQuery({
    enabled: !!address && !!amount && onrampMethod === 'apple',
    queryFn: async () => {
      const response = await fetch(
        `https://onramp.porto.workers.dev/token?address=${address}`,
      )

      const data = (await response.json()) as {
        initToken: string
        initTypeToken: string
        widgetId: string
        merchantTransactionId: string
        signature: string
        widgetFlow: string
        widgetUrl: string
        birthdate: string
        firstName: string
        lastName: string
        network: string
        paymentMethod: string
        fiatAmount: string
        fiatCurrency: string
        currency: string
        error: string | null
      }
      return data
    },
    queryKey: ['onramp-token', address],
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  React.useEffect(() => {
    if (
      onrampMethod !== 'apple' ||
      !onrampQuery.data ||
      !onrampQuery.data.merchantTransactionId
    )
      return

    const {
      widgetId,
      widgetUrl,
      signature,
      merchantTransactionId,
      initToken,
      initTypeToken,
      birthdate,
      currency,
      firstName,
      lastName,
      network,
      fiatCurrency,
      widgetFlow,
    } = onrampQuery.data

    function checkAndRunWidget() {
      if (!onrampWidget || !onrampWidget?.run) return

      const widgetInstance = onrampWidget?.run({
        address,
        amount,
        birthdate,
        currency,
        fiatAmount: amount,
        fiatCurrency,
        firstName,
        host: document.querySelector('div#mercuryo-widget'),
        initToken,
        initTokenType: initTypeToken,
        lastName,
        merchantTransactionId,
        network,
        paymentMethod: 'apple',
        signature,
        widgetFlow,
        widgetId,
        widgetUrl,
      })

      // TODO: use this once it actually indicates that the widget is ready
      widgetInstance?.onReady(() => {
        console.info('[onramp] Widget is ready')
      })
    }

    checkAndRunWidget()
  }, [address, amount, onrampQuery.data])

  const transactionQuery = useQuery({
    enabled:
      onrampQuery.status === 'success' &&
      !!onrampQuery.data?.merchantTransactionId &&
      onrampMethod === 'apple',
    queryFn: async () => {
      const merchantTransactionId = onrampQuery.data?.merchantTransactionId
      if (!merchantTransactionId) return null

      const searchParams = new URLSearchParams({
        merchantTransactionId,
      })
      const response = await fetch(
        `https://onramp.porto.workers.dev/transactions?${searchParams.toString()}`,
      )

      return response.json() as Promise<{
        url: string
        hash: string
        status: string
        amount: string
        currency: string
      }>
    },
    queryKey: ['onramp-transactions', address],
    refetchInterval: 1_000,
  })

  if (
    onrampMethod === 'apple' &&
    (onrampQuery.isError || onrampQuery.data?.error)
  ) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
        <TriangleAlertIcon className="size-6 text-th_field-error" />
        {onrampQuery.data?.error ?? onrampQuery.error?.message}
        <Button
          className="text-xs"
          onClick={() => onrampQuery.refetch()}
          variant="default"
        >
          Try again
        </Button>
      </div>
    )
  }

  if (!onrampMethod || onrampMethod === 'faucet')
    return (
      <UI.Button
        className="w-full flex-1"
        data-testid="buy"
        disabled={!address || !amount || Number(amount) === 0}
        loading={loading && 'Adding funds…'}
        type="submit"
        variant="primary"
        width="grow"
      >
        Add funds
      </UI.Button>
    )

  if (onrampMethod === 'google')
    return (
      <PayButton
        disabled={!address}
        url={stripeOnrampUrl({
          address: address!,
          amount: Number(amount),
        })}
        variant="stripe"
      />
    )

  if (onrampMethod === 'apple')
    return (
      <div className="flex flex-col justify-between gap-2">
        <article className="relative mx-auto w-full select-none overflow-hidden rounded-full">
          <div
            className="h-[46px] min-h-[44px] w-full min-w-full bg-black dark:bg-white"
            id="mercuryo-widget"
          />
        </article>
        {transactionQuery.data &&
          transactionQuery.data.status !== 'not_found' && (
            <a
              className="text-center"
              href={transactionQuery.data.url}
              target="_blank"
            >
              {StringFormatter.truncate(transactionQuery.data.hash)}
            </a>
          )}
      </div>
    )
}

export declare namespace OnrampView {
  export type Props = {
    address: Address.Address | undefined
    amount: string | undefined
    onApprove: (result: { id: Hex.Hex }) => void
    onReject?: () => void
    loading?: boolean
    onrampMethod?: 'apple' | 'google' | 'faucet'
  }
}

function DepositCryptoView(props: DepositCryptoView.Props) {
  const { address, onBack, onApprove } = props

  const chain = Hooks.useChain(porto)

  const [isCopied, copyToClipboard] = useCopyToClipboard({ timeout: 2_000 })

  const walletClient = Hooks.useWalletClient(porto)
  const { data: tokens } = useQuery({
    queryFn: async () => {
      const chainId = Hex.fromNumber(chain?.id!)
      const response = await walletClient.request({
        method: 'wallet_getCapabilities',
        params: [address!, [chainId]],
      })
      return response[chainId]?.feeToken.tokens
    },
    queryKey: ['capabilities'],
    select: (data) => data?.map((token) => token.address.toLowerCase()),
  })

  useWatchContractEvent({
    abi: erc20Abi,
    args: {
      to: address,
    },
    eventName: 'Transfer',
    onLogs: (events) => {
      for (const event of events) {
        if (tokens?.includes(event.address.toLowerCase()))
          onApprove({ id: event.transactionHash })
      }
    },
  })

  const { data: balance, ...nativeBalance } = useBalance({
    address: address!,
    chainId: chain?.id!,
    query: {
      enabled: !!address && !!chain,
      select: (data) => data?.value,
    },
  })
  const previousBalance = usePrevious({ value: balance })

  React.useEffect(() => {
    if (typeof previousBalance === 'undefined' || previousBalance === 0n) return
    if (previousBalance !== balance) Actions.rejectAll(porto)
  }, [previousBalance, balance])

  useWatchBlockNumber({
    onBlockNumber: () => nativeBalance.refetch(),
  })

  return (
    <Layout>
      <Layout.Content className="py-3 text-center">
        <Ariakit.Button
          className="mx-auto flex h-[148px] items-center justify-center gap-4 rounded-lg border border-th_secondary bg-th_secondary p-4 hover:cursor-pointer!"
          onClick={() => copyToClipboard(address ?? '')}
        >
          <Cuer.Root errorCorrection="low" value={address ?? ''}>
            <Cuer.Cells />
            <Cuer.Finder radius={1} />
          </Cuer.Root>
          <p className="min-w-[6ch] max-w-[6ch] text-pretty break-all font-mono font-normal text-th_base-secondary text-xs">
            {address}
          </p>
        </Ariakit.Button>

        <div className="h-4" />

        <div className="font-medium text-[18px]">Deposit funds</div>
        <div className="h-1" />
        <div className="text-th_base-secondary">
          Send crypto to fund your account.
        </div>
      </Layout.Content>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            className="w-full text-[14px]"
            onClick={onBack}
            type="button"
            variant="default"
          >
            Back
          </Button>
          <Button
            className="w-full text-[14px]"
            onClick={() => copyToClipboard(address ?? '')}
            type="button"
            variant="default"
          >
            <CopyIcon className="mr-1.5 size-4" />
            {isCopied ? 'Copied' : 'Copy'}
          </Button>
        </Layout.Footer.Actions>

        {chain && (
          <div className="px-3 text-center text-sm text-th_base-secondary">
            Only send assets on {chain.name}. Support for more networks soon.
          </div>
        )}
      </Layout.Footer>
    </Layout>
  )
}

export declare namespace DepositCryptoView {
  export type Props = {
    address: Address.Address | undefined
    onBack: () => void
    onApprove: (result: { id: Hex.Hex }) => void
  }
}
