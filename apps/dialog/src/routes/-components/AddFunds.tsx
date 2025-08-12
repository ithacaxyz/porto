import * as Ariakit from '@ariakit/react'
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
import * as FeeTokens from '~/lib/FeeTokens'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import AppleIcon from '~icons/basil/apple-solid'
import ArrowRightIcon from '~icons/lucide/arrow-right'
import CopyIcon from '~icons/lucide/copy'
import CardIcon from '~icons/lucide/credit-card'
import PencilIcon from '~icons/lucide/pencil'
import QrCodeIcon from '~icons/lucide/qr-code'
import TriangleAlertIcon from '~icons/lucide/triangle-alert'
import XIcon from '~icons/lucide/x'

const presetAmounts = ['30', '50', '100', '250'] as const

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

  const [editView, setEditView] = React.useState<'default' | 'editing'>(
    defaultValue ? 'editing' : 'default',
  )

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
              <div className="flex max-h-[42px] w-full max-w-full flex-row justify-center space-x-2">
                {editView === 'editing' ? (
                  <div className="relative flex w-full flex-row items-center justify-between rounded-lg border-[1.5px] border-transparent bg-th_field px-3 py-2.5 text-th_field focus-within:border-th_focus focus-within:bg-th_field-focused focus-within:text-th_field-focused has-invalid:border-th_field-error">
                    <span className="-translate-y-1/2 absolute top-1/2 left-3 text-th_field">
                      $
                    </span>
                    <input
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      // biome-ignore lint/a11y/noAutofocus: _
                      autoFocus
                      className="h-full max-h-[96%] w-full max-w-[50%] bg-transparent pl-3 placeholder:text-th_field focus:outline-none"
                      inputMode="decimal"
                      max={500}
                      min={0}
                      onChange={(event) =>
                        event.target.value.length > 0
                          ? setAmount(event.target.value)
                          : setAmount('')
                      }
                      placeholder="Enter amount"
                      required
                      spellCheck={false}
                      type="number"
                      value={amount}
                      // should add disabled` if testnet?
                    />
                    <span className="text-sm text-th_field">Max. $500</span>
                  </div>
                ) : (
                  <Ariakit.RadioProvider
                    setValue={(value) => setAmount(value as string)}
                    value={amount}
                  >
                    <Ariakit.RadioGroup className="flex w-full gap-3 *:h-10.5">
                      {presetAmounts.map((predefinedAmount) => (
                        // biome-ignore lint/a11y/noLabelWithoutControl: _
                        <label
                          className="flex w-full justify-center rounded-[10px] border-[1.5px] border-th_field bg-th_base py-2 text-center align-center text-th_field leading-normal hover:bg-th_field has-checked:border-[1.5px] has-checked:border-th_focus has-checked:bg-th_field has-checked:text-th_base"
                          key={predefinedAmount}
                        >
                          <Ariakit.VisuallyHidden>
                            <Ariakit.Radio value={predefinedAmount} />
                          </Ariakit.VisuallyHidden>
                          ${predefinedAmount}
                        </label>
                      ))}
                    </Ariakit.RadioGroup>
                  </Ariakit.RadioProvider>
                )}
                <Ariakit.Button
                  className="flex min-w-[42px] flex-row items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-th_field py-2 text-center text-th_field hover:bg-th_field has-checked:border-[1.5px] has-checked:border-th_focus has-checked:bg-th_field has-checked:text-th_base"
                  onClick={() =>
                    setEditView(editView === 'default' ? 'editing' : 'default')
                  }
                >
                  {editView === 'editing' ? (
                    <XIcon className="size-6" />
                  ) : (
                    <PencilIcon className="size-4" />
                  )}
                </Ariakit.Button>
              </div>
            </div>
            <div className="col-span-1 row-span-1 space-y-3.5">
              <OnrampView
                address={address}
                amount={amount}
                onApprove={onApprove}
                onReject={onReject}
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
                disabled={deposit.isPending}
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

          <p className="mt-3 px-8 text-center text-[12px] text-th_base-secondary">
            By using this process, you are agreeing to Mercuryo's{' '}
            <a
              className="text-primary"
              href="https://mercuryo.io/terms-and-conditions"
              rel="noopener noreferrer"
              target="_blank"
            >
              terms & conditions
            </a>
          </p>
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
      //  TODO: add email submit (async)
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

export declare namespace OnrampView {
  export type Props = {
    address: Address.Address | undefined
    amount: string | undefined
    onApprove: (result: { id: Hex.Hex }) => void
    onReject?: () => void
  }
}

function OnrampView(props: OnrampView.Props) {
  const { address, amount, onApprove, onReject } = props
  const [hasError, setHasError] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const widgetContainerRef = React.useRef<HTMLDivElement>(null)
  const widgetInstanceRef = React.useRef<any>(null)

  const authToken = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `https://onramp.porto.workers.dev/token?address=${address}`,
      )
      if (!response.ok) throw new Error('Failed to fetch auth token')

      return response.json() as Promise<{
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
      }>
    },
    mutationKey: ['onramp-token', address],
  })

  React.useEffect(() => {
    if (!address || !amount || !widgetContainerRef.current) return

    authToken.mutate(undefined, {
      onError: (error) => {
        console.error('[onramp] Failed to fetch auth token:', error)
        setHasError(true)
        setIsLoading(false)
      },
      onSuccess: (tokenData) => {
        if (!tokenData.initToken) {
          console.error('[onramp] No auth token received')
          setHasError(true)
          return
        }

        const initializeWidget = () => {
          if (
            // @ts-expect-error - mercuryoWidget is loaded from CDN
            typeof window.mercuryoWidget === 'undefined' ||
            // @ts-expect-error - mercuryoWidget is loaded from CDN
            !window.mercuryoWidget.run
          ) {
            // Retry after a short delay
            setTimeout(initializeWidget, 100)
            return
          }

          try {
            // Generate signature for the transaction
            const merchantTransactionId = `${address.toLowerCase()}_${Date.now()}`

            // Initialize the widget with parameters
            // @ts-expect-error - mercuryoWidget is loaded from CDN
            const widget = window.mercuryoWidget.run({
              address: address,
              amount: amount,
              birthdate: tokenData.birthdate,
              currency: tokenData.fiatCurrency,
              fiatAmount: tokenData.fiatAmount,
              firstName: tokenData.firstName,
              host: widgetContainerRef.current,
              initToken: tokenData.initToken,
              initTokenType: tokenData.initTypeToken,
              lastName: tokenData.lastName,
              merchantTransactionId: merchantTransactionId,
              network: tokenData.network,
              paymentMethod: tokenData.paymentMethod,
              widgetFlow: tokenData.widgetFlow,
              widgetId: tokenData.widgetId,
            })

            widgetInstanceRef.current = widget

            // Set up event handlers
            if (widget?.onReady) {
              widget.onReady(() => {
                console.log('[onramp] Widget is ready')
                setIsLoading(false)
              })
            }

            if (widget?.onLoad) {
              widget.onLoad(() => {
                console.log('[onramp] Widget loaded')
                setIsLoading(false)
              })
            }

            if (widget?.onPaymentFinished) {
              widget.onPaymentFinished((data: any) => {
                console.log('[onramp] Payment finished:', data)
                onApprove({ id: data.txHash || data.transactionHash || '0x' })
              })
            }

            if (widget?.onStatusChange) {
              widget.onStatusChange((data: any) => {
                console.log('[onramp] Status changed:', data)
                if (data.status === 'failed' || data.status === 'cancelled') {
                  setHasError(true)
                  onReject?.()
                }
              })
            }

            // Fallback to set loading false after timeout
            setTimeout(() => setIsLoading(false), 3000)
          } catch (error) {
            console.error('[onramp] Failed to initialize widget:', error)
            setHasError(true)
            setIsLoading(false)
          }
        }

        // Start initialization
        initializeWidget()
      },
    })
  }, [address, amount, authToken, onApprove, onReject])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (widgetInstanceRef.current?.destroy) {
        widgetInstanceRef.current.destroy()
      }
    }
  }, [])

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
        <TriangleAlertIcon className="size-6 text-th_field-error" />
        <p className="text-sm text-th_field-error">
          Failed to load payment options
        </p>
        <Button
          className="text-xs"
          onClick={() => {
            setHasError(false)
            setIsLoading(true)
            authToken.reset()
          }}
          variant="default"
        >
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-between gap-2">
      <article className="relative mx-auto w-full select-none overflow-hidden">
        {/* Show loading state with fake Apple Pay button */}
        {isLoading && (
          <Button
            className="w-full cursor-pointer! opacity-50"
            disabled
            variant="invert"
          >
            Buy with
            <div className="-mt-px flex">
              <AppleIcon className="mt-px ml-1 inline size-4.5" />
              <span className="text-[16px]">Pay</span>
            </div>
          </Button>
        )}

        {/* Container for the Mercuryo widget */}
        <div
          className={cx(
            'mercuryo-widget-container',
            isLoading && 'pointer-events-none absolute inset-0 opacity-0',
          )}
          ref={widgetContainerRef}
          style={{
            minHeight: '44px',
            width: '100%',
          }}
        />
      </article>
    </div>
  )
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
