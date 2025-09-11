import * as Ariakit from '@ariakit/react'
import { LogoLockup, Toast } from '@porto/apps/components'
import { exp1Config, exp2Config, expNftConfig } from '@porto/apps/contracts'
import { cx } from 'cva'
import { type Address, P256, Provider, PublicKey, Value } from 'ox'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { BaseError, UserRejectedRequestError } from 'viem'
import {
  ConnectorAlreadyConnectedError,
  useAccount,
  useAccountEffect,
  useBlockNumber,
  useChainId,
  useChains,
  useConnect,
  useConnectors,
  useDisconnect,
  useReadContract,
  useSendCalls,
  useWaitForCallsStatus,
} from 'wagmi'
import LucideChevronLeft from '~icons/lucide/chevron-left'
import LucideChevronRight from '~icons/lucide/chevron-right'
import LucideHandCoins from '~icons/lucide/hand-coins'
import LucidePictureInPicture2 from '~icons/lucide/picture-in-picture-2'
import LucidePlay from '~icons/lucide/play'
import LucideSparkle from '~icons/lucide/sparkle'
import LucideTrash2 from '~icons/lucide/trash-2'
import LucideX from '~icons/lucide/x'
import type { config } from '../wagmi.config'
import { Button } from './Button'
import { type ChainId, permissions } from './constants'

export function HomePage() {
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const dialogStore = Ariakit.useDialogStore()

  return (
    <div className="flex justify-center gap-[32px]">
      <div className="flex flex-1 flex-col items-start max-[1024px]:max-w-[452px]">
        <div className="h-2" />

        <div className="w-[110px] pr-1 pb-1">
          <LogoLockup />
        </div>

        <div className="h-3" />

        <p className="font-[400] text-[16px] text-black leading-[21px] tracking-[-2%] dark:text-gray11">
          Sign in with superpowers. Buy, swap, subscribe, and much more. No
          passwords or extensions required.
        </p>

        <p className="mt-1 font-[300] text-[14px] text-gray10 leading-[21px] tracking-[-2%] dark:text-gray9">
          Porto imagines a world where passwords are a thing of the past, and
          where the web is built natively for payments.
        </p>

        <div className="h-4" />

        <div className="w-full overflow-hidden rounded-xl border border-gray4">
          <div className="flex items-center border-gray5 border-b p-[16px]">
            <Install />
          </div>
          <div className="bg-gray3/50 p-[16px] font-mono text-[15px] max-[486px]:p-[12px] max-[486px]:text-[13px] dark:bg-gray1">
            <p className={`before:mr-3 before:text-gray8 before:content-['1']`}>
              import {'{'} Porto {'}'} from 'porto'
            </p>
            <p className={`before:mr-3 before:text-gray8 before:content-['2']`}>
              Porto.
              <span className="text-blue9">create()</span>
            </p>
          </div>
        </div>

        <div className="h-3" />

        <div className="w-full min-lg:hidden">
          <Ariakit.Button
            className="relative inline-flex h-[42px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-accent px-[18px] font-medium text-white transition-colors hover:not-active:bg-accentHover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            onClick={dialogStore.show}
          >
            <LucidePlay className="mt-0.5 size-3.5" />
            Try it out
          </Ariakit.Button>

          <div className="h-6" />

          <div className="flex w-full items-center gap-4 font-[400] text-[14px] text-gray9 leading-[18px] tracking-[-0.25px]">
            <div>Learn more</div>
            <div className="h-[1px] w-full flex-1 bg-gray6" />
          </div>

          <div className="h-4" />
        </div>

        <div className="grid w-full grid-cols-2 gap-2 max-[486px]:grid-cols-1">
          <div className="rounded-[13px] border border-gray4 p-[16px]">
            <div className="size-[24px]">
              <WorksAnywhereIcon />
            </div>
            <div className="h-2" />
            <p className="font-[400] text-[15px] text-gray12 leading-[21px] tracking-[-2.8%]">
              Developer-first
            </p>
            <p className="mt-1 font-[300] text-[13px] text-gray10 leading-[18px] tracking-[-0.25px]">
              Integrate in just seconds. Works with{' '}
              <a
                className="font-mono brightness-40 dark:brightness-150"
                href="https://wagmi.sh"
              >
                wagmi
              </a>{' '}
              and{' '}
              <a
                className="font-mono brightness-40 dark:brightness-150"
                href="https://viem.sh"
              >
                viem
              </a>{' '}
              without code changes.
            </p>
          </div>
          <div className="rounded-xl border border-gray4 p-4 transition-transform dark:hover:brightness-110">
            <div className="size-[24px]">
              <NoDeveloperLockInIcon />
            </div>
            <div className="h-2" />
            <p className="font-[400] text-[15px] text-gray12 leading-[21px] tracking-[-2.8%]">
              Flexible & low cost
            </p>
            <p className="mt-1 font-[300] text-[13px] text-gray10 leading-[18px] tracking-[-0.25px]">
              Best-in-class gas costs & latency. Pay fees in any supported
              currency.
            </p>
          </div>
          <div className="rounded-xl border border-gray4 p-4 transition-transform dark:hover:brightness-110">
            <div className="size-[24px]">
              <ModernEIPSupportIcon />
            </div>
            <div className="h-2" />
            <p className="font-[400] text-[15px] text-gray12 leading-[21px] tracking-[-2.8%]">
              Simple & modular
            </p>
            <p className="mt-1 font-[300] text-[13px] text-gray10 leading-[18px] tracking-[-0.25px]">
              Use headlessly, or with UI. No extensions, API keys, passwords, or
              seed phrases needed.
            </p>
          </div>
          <div className="rounded-xl border border-gray4 p-4 transition-transform dark:hover:brightness-110">
            <div className="size-[24px]">
              <ProgrammableIcon />
            </div>
            <div className="h-2" />
            <p className="font-[400] text-[15px] text-gray12 leading-[21px] tracking-[-2.8%]">
              Programmable
            </p>
            <p className="mt-1 font-[300] text-[13px] text-gray10 leading-[18px] tracking-[-0.25px]">
              Supports subscriptions & usage-based pricing for creators,
              streamers, agents, and more.
            </p>
          </div>
        </div>

        <div className="h-6" />

        <div className="flex w-full items-center gap-4 font-[400] text-[14px] text-gray9 leading-[18px] tracking-[-0.25px]">
          <div>Ready to get started?</div>
          <div className="h-[1px] w-full flex-1 bg-gray3" />
        </div>

        <div className="h-4" />

        <div className="flex w-full gap-2 max-[486px]:flex-col">
          <Ariakit.Button
            className="flex h-[40px] cursor-default items-center justify-center gap-2 rounded-full bg-gray3 px-4 font-[400] transition-all hover:bg-gray4"
            render={<Link to="/sdk" />}
          >
            <div className="size-[1em]">
              <PortoIcon />
            </div>
            Documentation
          </Ariakit.Button>
          <Ariakit.Button
            className="flex h-[40px] cursor-default items-center justify-center gap-2 rounded-full bg-gray3 px-4 font-[400] transition-all hover:bg-gray4"
            render={
              // biome-ignore lint/a11y/useAnchorContent: _
              <a
                href="https://github.com/ithacaxyz/porto"
                rel="noreferrer"
                target="_blank"
              />
            }
          >
            <div className="size-[1.2em]">
              <GitHubIcon />
            </div>
            GitHub
          </Ariakit.Button>
        </div>
      </div>

      <div className="flex-1 max-lg:hidden">
        {isMounted ? (
          <Demo />
        ) : (
          <div className="flex h-full flex-col rounded-[20px] bg-gray3/50 p-4" />
        )}
      </div>

      <Ariakit.Dialog
        backdrop={<div className="backdrop" />}
        className="fixed inset-0 z-50 h-full bg-white px-5 py-6.5 lg:hidden dark:bg-black"
        hideOnInteractOutside={false}
        store={dialogStore}
      >
        <div className="flex h-full flex-col">
          <header className="mb-5 flex items-center justify-between">
            <h1 className="-tracking-[0.504px] font-medium text-[18px] leading-normal">
              Try it out
            </h1>
            <Ariakit.DialogDismiss
              render={<LucideX className="size-6 text-gray11" />}
            />
          </header>

          {isMounted && <Demo />}
        </div>
      </Ariakit.Dialog>
    </div>
  )
}

const pollingInterval = 800
const steps = [
  'sign-in',
  'buy-now',
  'send-tip',
  'subscribe',
  'swap',
  'end',
] as const

function Demo() {
  const chainId = useChainId()
  const { address, status } = useAccount()

  const [step, setStep] = React.useState<(typeof steps)[number]>('sign-in')
  const [complete, setComplete] = React.useState(false)
  useAccountEffect({
    onConnect() {
      if (step === 'sign-in') setComplete(true)
    },
    onDisconnect() {
      setStep('sign-in')
    },
  })
  Hooks.usePermissions({
    query: { enabled: status === 'connected' },
  })

  return (
    <div className="flex h-full flex-col rounded-[20px] bg-gray3/50 p-4">
      <div className="hidden w-full justify-between p-1 lg:flex">
        <div className="font-[400] text-[14px] text-gray9 leading-none tracking-[-2.8%]">
          Demo
        </div>
      </div>

      <div className="flex-1">
        <div className="relative flex h-full w-full justify-center">
          <div className="flex h-full w-full max-w-[277px] flex-col items-center justify-center">
            {step === 'sign-in' && (
              <SignIn chainId={chainId} next={() => setComplete(true)} />
            )}
            {step === 'buy-now' && (
              <BuyNow chainId={chainId} next={() => setComplete(true)} />
            )}
            {step === 'send-tip' && (
              <SendTip
                address={address}
                chainId={chainId}
                next={() => setComplete(true)}
              />
            )}
            {step === 'subscribe' && (
              <Subscribe chainId={chainId} next={() => setComplete(true)} />
            )}
            {step === 'swap' && (
              <Swap
                address={address}
                chainId={chainId}
                next={() => setComplete(true)}
              />
            )}
            {step === 'end' && (
              <div className="flex flex-col gap-4">
                <h2 className="-tracking-[2.8%] text-center font-medium text-[19px] text-black leading-normal dark:text-white">
                  Get started now
                </h2>
                <p className="-tracking-[2.8%] text-center text-[16px] text-gray9 leading-[22px]">
                  Now that you’ve experienced some of Porto’s innovations,
                  integrate it into your application today.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setStep('sign-in')}
                    size="small"
                    variant="default"
                  >
                    Restart demo
                  </Button>

                  <Link to="/sdk">
                    <Button size="small" variant="accent">
                      View documentation
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center space-y-1">
        <div className="w-full space-y-1">
          <div className="flex w-full items-end justify-between lg:items-center lg:justify-around">
            <div className="lg:pb-6">
              {status === 'connected' && step !== 'end' && (
                <button
                  className={cx(
                    'flex size-[32px] items-center justify-center rounded-full border border-gray5 bg-transparent text-gray8 hover:bg-gray2 disabled:cursor-not-allowed',
                    step === steps[0] && 'invisible',
                  )}
                  disabled={step === steps[0]}
                  onClick={() =>
                    step && setStep(steps[steps.indexOf(step) - 1]!)
                  }
                  type="button"
                >
                  <LucideChevronLeft className="-ms-0.5 size-5" />
                </button>
              )}
            </div>

            <div className="flex flex-col pb-3 lg:pb-0">
              <div className="max-w-[25.5ch] space-y-1">
                {step === 'sign-in' && (
                  <>
                    <p className="text-center font-[500] text-[19px] text-gray12 tracking-[-2.8%]">
                      Forget passwords
                    </p>
                    <p className="text-center text-[15px] text-gray10 leading-[21px] tracking-[-2.8%]">
                      Porto is the fastest and most secure way to sign in.
                    </p>
                  </>
                )}
                {step === 'buy-now' && (
                  <>
                    <p className="text-center font-[500] text-[19px] text-gray12 tracking-[-2.8%]">
                      Buy now, for real
                    </p>
                    <p className="text-center text-[15px] text-gray10 leading-[21px] tracking-[-2.8%]">
                      Fund your account & complete purchases in seconds
                    </p>
                  </>
                )}
                {step === 'send-tip' && (
                  <>
                    <p className="text-center font-[500] text-[19px] text-gray12 tracking-[-2.8%]">
                      Payments made easy
                    </p>
                    <p className="text-center text-[15px] text-gray10 leading-[21px] tracking-[-2.8%]">
                      Send money, buy an item, or gift a tip instantly.
                    </p>
                  </>
                )}
                {step === 'subscribe' && (
                  <>
                    <p className="text-center font-[500] text-[19px] text-gray12 tracking-[-2.8%]">
                      Frictionless subscriptions
                    </p>
                    <p className="text-center text-[15px] text-gray10 leading-[21px] tracking-[-2.8%]">
                      Approve & manage recurring payments easily.
                    </p>
                  </>
                )}
                {step === 'swap' && (
                  <>
                    <p className="text-center font-[500] text-[19px] text-gray12 tracking-[-2.8%]">
                      Trade any asset
                    </p>
                    <p className="text-center text-[15px] text-gray10 leading-[21px] tracking-[-2.8%]">
                      Swap between assets you hold on Porto within seconds.
                    </p>
                  </>
                )}
              </div>

              <div className="h-10 lg:h-8" />

              <div className="flex items-center justify-center gap-1">
                {steps.map((s) => (
                  <button
                    className="size-[7px] rounded-full bg-gray6 transition-all duration-150 hover:not-data-[active=true]:not-data-[disabled=true]:scale-150 hover:not-data-[disabled=true]:bg-gray9 data-[active=true]:w-6 data-[active=true]:bg-gray9"
                    data-active={s === step}
                    data-disabled={status !== 'connected' || step === 'end'}
                    key={s}
                    onClick={() => {
                      if (status === 'connected') setStep(s)
                    }}
                    type="button"
                  />
                ))}
              </div>
            </div>

            <div className="lg:pb-6">
              {status === 'connected' && step !== 'end' && (
                <button
                  className={cx(
                    'flex size-[32px] items-center justify-center rounded-full border disabled:cursor-not-allowed',
                    step === steps[steps.length - 1] && 'invisible',
                    complete
                      ? 'border-accent bg-accent text-white outline outline-dashed outline-blue9 outline-offset-8 hover:bg-accentHover'
                      : 'border-gray5 bg-transparent text-gray8 hover:bg-gray2',
                  )}
                  disabled={step === steps[steps.length - 1]}
                  onClick={() => {
                    if (step) {
                      setStep(steps[steps.indexOf(step) + 1]!)
                      setComplete(false)
                    }
                  }}
                  type="button"
                >
                  <LucideChevronRight className="-me-0.5 size-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SignIn(props: { chainId: ChainId; next: () => void }) {
  const { chainId, next } = props

  const { status } = useAccount()
  const connect = useConnect({
    mutation: {
      onError(error) {
        if (error instanceof ConnectorAlreadyConnectedError) next()
        else if (error.message.includes('email already verified'))
          toast.custom((t) => (
            <Toast
              className={t}
              description="Email already verified for account."
              kind="error"
              title="Create account failed"
            />
          ))
      },
      onSuccess() {
        next()
      },
    },
  })
  const disconnect = useDisconnect()
  const connector = usePortoConnector()

  if (status === 'connected')
    return (
      <div className="flex flex-row items-center gap-4">
        <div className="-tracking-[2.8%] font-medium text-[15px] text-gray9 leading-normal">
          You're signed in!
        </div>

        <Button
          className="flex-grow"
          onClick={() => disconnect.disconnect({ connector })}
          variant="destructive"
        >
          Sign out
        </Button>
      </div>
    )

  if (connect.isPending)
    return (
      <div className="flex w-full">
        <Ariakit.Button
          className="-tracking-[0.448px] flex h-10.5 w-full items-center justify-center gap-1.5 rounded-[10px] bg-gray5 px-3 text-center font-medium text-[16px] text-gray9 leading-normal"
          disabled
        >
          <LucidePictureInPicture2 className="size-5" />
          Check passkey prompt
        </Ariakit.Button>
      </div>
    )

  return (
    <div className="flex w-full">
      <Ariakit.Button
        className="-tracking-[0.448px] flex h-10.5 w-full items-center justify-center gap-1.5 rounded-[10px] bg-accent px-3 text-center font-medium text-[16px] text-white leading-normal outline outline-dashed outline-blue9 outline-offset-2 hover:bg-accentHover"
        onClick={() =>
          connect.connect({
            capabilities: {
              grantPermissions: permissions(chainId),
            },
            connector,
          })
        }
      >
        Sign in
      </Ariakit.Button>
    </div>
  )
}

export function BuyNow(props: { chainId: ChainId; next: () => void }) {
  const { chainId, next } = props

  const SNEAKER_COST = Value.fromEther('10')

  const { address } = useAccount()
  const { data: exp1Balance } = useReadContract({
    abi: exp1Config.abi,
    address:
      exp1Config.address[chainId as keyof (typeof exp1Config)['address']],
    args: [address!],
    functionName: 'balanceOf',
    query: {
      enabled: !!address,
    },
  })

  // Since we use USDC as the fee token in production,
  // we will mint EXP to the user if they don't have any
  // in the call bundle.
  const shouldMintExp = exp1Balance && exp1Balance < SNEAKER_COST

  const { data, isPending, sendCalls } = useSendCalls({
    mutation: {
      onError(err) {
        const error = (() => {
          if (err instanceof BaseError)
            return err instanceof BaseError
              ? err.walk((err) => err instanceof UserRejectedRequestError)
              : err
          return err
        })()

        if (
          (error as Provider.ProviderRpcError)?.code !==
          Provider.UserRejectedRequestError.code
        )
          toast.custom((t) => (
            <Toast
              className={t}
              description={err?.message ?? 'Something went wrong'}
              kind="error"
              title="Buy Now Failed"
            />
          ))
      },
    },
  })

  const {
    error,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForCallsStatus({
    id: data?.id,
    pollingInterval,
  })
  React.useEffect(() => {
    if (isConfirmed) next()
  }, [isConfirmed, next])
  React.useEffect(() => {
    if (error)
      toast.custom((t) => (
        <Toast
          className={t}
          description={error.message}
          kind="error"
          title="Buy Now Failed"
        />
      ))
  }, [error])

  if (isConfirmed)
    return (
      <div className="flex flex-col items-center gap-4">
        <img
          alt="Running Sneaker"
          className="size-[183px] rounded-[13px] object-cover object-accent"
          src="/sneaker.png"
        />
        <div className="-tracking-[2.8%] font-medium text-[15px] text-gray9 leading-normal">
          Purchase complete!
        </div>
      </div>
    )

  return (
    <div className="flex w-full max-w-61.75 flex-col gap-6">
      <div className="flex gap-4">
        <img
          alt="Running Sneaker"
          className="size-[55px] rounded-[13px] object-cover object-accent text-transparent"
          src="/sneaker.png"
        />

        <div className="-mt-0.5 flex flex-col gap-0.5">
          <div className="-tracking-[2.8%] font-medium text-[20px] text-black leading-normal dark:text-white">
            Running Sneaker
          </div>
          <div className="font-medium text-[14px] text-gray10 leading-normal">
            $10.00
          </div>
        </div>
      </div>

      <Ariakit.Button
        aria-disabled={isPending || isConfirming}
        className={cx(
          '-tracking-[0.448px] flex h-10.5 w-full items-center justify-center gap-1.5 rounded-[10px] bg-accent px-3 text-center font-medium text-[16px] text-white leading-normal hover:bg-accentHover aria-disabled:pointer-events-none aria-disabled:bg-gray5 aria-disabled:text-gray10',
          !(isPending || isConfirming) &&
            'outline outline-dashed outline-blue9 outline-offset-2',
        )}
        disabled={isPending || isConfirming}
        onClick={() => {
          const exp1Token =
            exp1Config.address[chainId as keyof (typeof exp1Config)['address']]
          if (!exp1Token) {
            console.warn(`exp1 address not defined for chainId ${chainId}`)
            return
          }
          const expNft =
            expNftConfig.address[chainId as keyof typeof expNftConfig.address]
          if (!expNft) {
            console.warn(`expNft address not defined for chainId ${chainId}`)
            return
          }
          sendCalls({
            calls: [
              ...(shouldMintExp
                ? [
                    {
                      abi: exp1Config.abi,
                      args: [address!, Value.fromEther('110')],
                      functionName: 'mint',
                      to: exp1Token,
                    },
                  ]
                : []),
              {
                abi: exp1Config.abi,
                args: [expNft, Value.fromEther('10')],
                functionName: 'approve',
                to: exp1Token,
              },
              {
                abi: expNftConfig.abi,
                functionName: 'mint',
                to: expNft,
              },
            ],
            capabilities: {
              requiredFunds: [
                {
                  symbol: 'EXP',
                  value: '10',
                },
              ],
            },
          })
        }}
      >
        {isPending ? (
          <>
            <LucidePictureInPicture2 className="size-5" />
            Check prompt
          </>
        ) : isConfirming ? (
          'Completing purchase'
        ) : (
          <>
            <LucideSparkle className="size-4" />
            Buy Now
          </>
        )}
      </Ariakit.Button>
    </div>
  )
}

export function SendTip(props: {
  address: Address.Address | undefined
  chainId: (typeof config)['state']['chainId']
  next: () => void
}) {
  const { address, chainId, next } = props
  const creatorAddress = '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'

  const { data: blockNumber } = useBlockNumber({
    watch: {
      enabled: true,
      pollingInterval: pollingInterval + 100,
    },
  })
  const { data: exp1Balance, refetch: expBalanceRefetch } = useReadContract({
    abi: exp1Config.abi,
    address:
      exp1Config.address[chainId as keyof (typeof exp1Config)['address']],
    args: [creatorAddress],
    functionName: 'balanceOf',
  })
  // biome-ignore lint/correctness/useExhaustiveDependencies: refetch balance every block
  React.useEffect(() => {
    expBalanceRefetch()
  }, [blockNumber])

  const { data, isPending, sendCalls } = useSendCalls({
    mutation: {
      onError(err) {
        const error = (() => {
          if (err instanceof BaseError)
            return err instanceof BaseError
              ? err.walk((err) => err instanceof UserRejectedRequestError)
              : err
          return err
        })()

        if (
          (error as Provider.ProviderRpcError)?.code !==
          Provider.UserRejectedRequestError.code
        )
          toast.custom((t) => (
            <Toast
              className={t}
              description={err?.message ?? 'Something went wrong'}
              kind="error"
              title="Send Tip Failed"
            />
          ))
      },
    },
  })
  const {
    error,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForCallsStatus({
    id: data?.id,
    pollingInterval,
  })
  React.useEffect(() => {
    if (isConfirmed) next()
  }, [isConfirmed, next])
  React.useEffect(() => {
    if (error)
      toast.custom((t) => (
        <Toast
          className={t}
          description={error.message}
          kind="error"
          title="Send Tip Failed"
        />
      ))
  }, [error])

  return (
    <div className="flex w-full max-w-57.75 flex-col items-center gap-3">
      <div className="flex w-full flex-col items-center gap-2">
        <img
          alt="creator"
          className="size-13 rounded-full border-[2px] border-grayA5 object-cover text-transparent"
          src="/creator.png"
        />

        <div className="h-5 w-full max-w-[138px] rounded-full bg-gray4" />

        <div className="h-3.5 w-full rounded-full bg-gray3 px-1.5" />
      </div>

      <div className="flex w-full justify-between px-1.5">
        <div className="-tracking-[2.8%] text-[14px] text-gray9">Received</div>{' '}
        <div className="-tracking-[2.8%] font-medium text-[14px] text-gray9">
          <span className="text-gray12">
            {ValueFormatter.format(exp1Balance ?? 0)}
          </span>{' '}
          <span>EXP1</span>
        </div>
      </div>

      <Ariakit.Button
        aria-disabled={isPending || isConfirming}
        className={cx(
          '-tracking-[0.448px] flex h-10.5 w-full items-center justify-center gap-1.5 rounded-[10px] bg-accent px-3 text-center font-medium text-[16px] text-white leading-normal hover:bg-accentHover aria-disabled:pointer-events-none aria-disabled:bg-gray5 aria-disabled:text-gray10',
          !(isPending || isConfirming) &&
            'outline outline-dashed outline-blue9 outline-offset-2',
        )}
        disabled={isPending || isConfirming}
        onClick={() => {
          const exp1Token =
            exp1Config.address[chainId as keyof (typeof exp1Config)['address']]
          if (!exp1Token) {
            console.warn(`exp1 address not defined for chainId ${chainId}`)
            return
          }
          const shared = {
            abi: exp1Config.abi,
            to: exp1Token,
          }
          const amount = Value.fromEther('1')
          sendCalls({
            calls: [
              {
                ...shared,
                args: [address!, amount],
                functionName: 'approve',
              },
              {
                ...shared,
                args: [address!, creatorAddress, amount],
                functionName: 'transferFrom',
              },
            ],
            capabilities: {
              requiredFunds: [
                {
                  symbol: 'EXP',
                  value: '1',
                },
              ],
            },
          })
        }}
      >
        {isPending || isConfirming ? (
          'Tipping creator'
        ) : (
          <>
            <LucideHandCoins className="size-4" />
            {isConfirmed ? 'Tip again' : 'Send a tip'}
          </>
        )}
      </Ariakit.Button>
    </div>
  )
}

const tiers = [
  { amount: Value.fromEther('2'), unit: 'week' },
  { amount: Value.fromEther('7'), unit: 'month' },
  { amount: Value.fromEther('75'), unit: 'year' },
] as const

export function Subscribe(props: {
  chainId: (typeof config)['state']['chainId']
  next: () => void
}) {
  const { chainId, next } = props

  const { data: permissions, refetch: refetchPermissions } =
    Hooks.usePermissions()
  const grantPermissions = Hooks.useGrantPermissions()
  const revokePermissions = Hooks.useRevokePermissions({
    mutation: {
      onError(err) {
        const error = (() => {
          if (err instanceof BaseError)
            return err instanceof BaseError
              ? err.walk((err) => err instanceof UserRejectedRequestError)
              : err
          return err
        })()

        if (
          (error as Provider.ProviderRpcError)?.code !==
          Provider.UserRejectedRequestError.code
        )
          toast.custom((t) => (
            <Toast
              className={t}
              description={err?.message ?? 'Something went wrong'}
              kind="error"
              title="Subscribe Failed"
            />
          ))
      },
      async onSuccess() {
        try {
          await refetchPermissions()
          setId(undefined)
        } catch {}
      },
    },
  })
  const [id, setId] = React.useState<string | undefined>()
  const subscriptionAddress = '0x0000000000000000000000000000000000000000'
  const permission = permissions?.find((permission) =>
    id
      ? permission.id === id
      : permission.permissions.spend?.some(
          (spend) => spend.token === subscriptionAddress,
        ),
  )
  const activeTier = permission?.permissions?.spend?.at(-1)
  const activeTierIndex = tiers.findIndex(
    (tier) => tier.unit === activeTier?.period,
  )

  const form = Ariakit.useFormStore({
    defaultValues: {
      tier: 'month' as 'week' | 'month' | 'year',
    },
  })
  form.useSubmit(async (state) => {
    try {
      const tier = tiers.find((tier) => tier.unit === state.values.tier)
      if (!tier) throw new Error(`Invalid tier: ${state.values.tier}`)

      const exp1Token =
        exp1Config.address[chainId as keyof (typeof exp1Config)['address']]
      if (!exp1Token) {
        console.warn(`exp1 address not defined for chainId ${chainId}`)
        return
      }

      const privateKey = P256.randomPrivateKey()
      const publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }), {
        includePrefix: false,
      })
      const res = await grantPermissions.mutateAsync({
        expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
        feeToken: null,
        key: { publicKey, type: 'p256' },
        permissions: {
          calls: [{ to: subscriptionAddress }],
          spend: [
            {
              limit: tier.amount,
              period: state.values.tier,
              token: exp1Token,
            },
          ],
        },
      })
      setId(res.id)
      await refetchPermissions()
      next()
    } catch (err) {
      const error = (() => {
        if (err instanceof BaseError)
          return err instanceof BaseError
            ? err.walk((err) => err instanceof UserRejectedRequestError)
            : err
        return err
      })()

      if (
        (error as Provider.ProviderRpcError)?.code !==
        Provider.UserRejectedRequestError.code
      )
        toast.custom((t) => (
          <Toast
            className={t}
            description={(err as Error)?.message ?? 'Something went wrong'}
            kind="error"
            title="Subscribe Failed"
          />
        ))
    }
  })

  if (permission && activeTier && activeTierIndex !== -1)
    return (
      <div className="w-full max-w-78.75 rounded-[13px] bg-gray1">
        <div className="flex justify-between border-gray4 border-b px-4 pt-4 pb-3.5">
          <div className="-tracking-[2.8%] font-medium text-[14px] text-gray9 leading-none">
            Your subscriptions
          </div>
          <Ariakit.Button
            onClick={() => revokePermissions.mutate({ id: permission.id })}
          >
            <Ariakit.VisuallyHidden>
              Cancel subscriptions
            </Ariakit.VisuallyHidden>
            <LucideTrash2 className="size-4 text-red8" />
          </Ariakit.Button>
        </div>

        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <img
              alt="creator"
              className="size-8 rounded-full border-[2px] border-grayA5 object-cover text-transparent"
              src="/creator2.png"
            />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-[85px] rounded-full bg-gray4" />
              <div className="-tracking-[2.8%] font-medium text-[13px] text-gray8 leading-none">
                Tier {'I'.repeat(activeTierIndex + 1)}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-right">
            <div className="-tracking-[2.8%] font-medium text-[16px] text-gray12 leading-none">
              {ValueFormatter.format(activeTier.limit)}{' '}
              <span className="text-gray9">EXP1</span>
            </div>
            <div className="-tracking-[2.8%] font-medium text-[13px] text-gray8 leading-none">
              each {activeTier.period}
            </div>
          </div>
        </div>
      </div>
    )

  return (
    <Ariakit.Form
      className="flex w-full max-w-72.25 flex-col gap-3"
      store={form}
    >
      <div className="mb-1.5 flex items-center gap-3">
        <img
          alt="creator"
          className="size-7.5 rounded-full border-[2px] border-grayA5 object-cover text-transparent"
          src="/creator2.png"
        />
        <div className="h-5 w-full max-w-[138px] rounded-full bg-gray4" />
      </div>

      <Ariakit.FormRadioGroup className="flex w-full flex-1 select-none gap-2">
        <Ariakit.VisuallyHidden>
          <Ariakit.FormGroupLabel>Select tier</Ariakit.FormGroupLabel>
        </Ariakit.VisuallyHidden>
        {tiers.map((tier, index) => (
          // biome-ignore lint/a11y/noLabelWithoutControl: _
          <label
            className="inset-ring flex h-31.25 flex-1 rounded-[13px] border border-gray5 p-3.5 [&:has(input:checked)]:inset-ring-[var(--color-blue9)] [&:has(input:checked)]:border-accent"
            key={tier.unit}
          >
            <div className="flex h-full flex-col justify-between">
              <Ariakit.FormRadio
                className="peer sr-only"
                name={form.names.tier}
                value={tier.unit}
              />

              <div className="-tracking-[2.8%] font-medium text-[13px] text-gray9 leading-none peer-checked:text-accent!">
                Tier {'I'.repeat(index + 1)}
              </div>
              <div className="flex flex-col gap-1">
                <div className="-tracking-[2.8%] font-medium text-[16px] text-gray12 leading-none">
                  {ValueFormatter.format(tier.amount)} EXP
                </div>
                <div className="-tracking-[2.8%] font-medium text-[9px] text-gray9 leading-none">
                  per {tier.unit}
                </div>
              </div>
            </div>
          </label>
        ))}
      </Ariakit.FormRadioGroup>

      <Ariakit.FormSubmit
        aria-disabled={grantPermissions.isPending}
        className={cx(
          '-tracking-[0.448px] flex h-10.5 w-full items-center justify-center gap-1.5 rounded-[10px] bg-accent px-3 text-center font-medium text-[16px] text-white leading-normal hover:bg-accentHover aria-disabled:pointer-events-none aria-disabled:bg-gray5 aria-disabled:text-gray10',
          !grantPermissions.isPending &&
            'outline outline-dashed outline-blue9 outline-offset-2',
        )}
        disabled={grantPermissions.isPending}
      >
        {grantPermissions.isPending ? (
          <>
            <LucidePictureInPicture2 className="size-5" />
            Check prompt
          </>
        ) : (
          'Subscribe'
        )}
      </Ariakit.FormSubmit>
    </Ariakit.Form>
  )
}

function Swap(props: {
  address: Address.Address | undefined
  chainId: (typeof config)['state']['chainId']
  next: () => void
}) {
  const { address, chainId, next } = props

  const { status } = useAccount()

  const chains = useChains()
  const destinationChainId = React.useMemo(() => {
    const index = chains.findIndex((chain) => chain.id === chainId)
    if (index === -1) throw new Error(`Chain ${chainId} not found`)
    return (chains[index + 1]?.id ?? chainId) as typeof chainId
  }, [chains, chainId])

  const { data: blockNumber } = useBlockNumber({
    watch: {
      enabled: status === 'connected',
      pollingInterval: pollingInterval + 100,
    },
  })
  const shared = {
    args: [address!],
    functionName: 'balanceOf',
    query: { enabled: Boolean(address) },
  } as const
  const exp1Config_ = {
    ...shared,
    abi: exp1Config.abi,
    address:
      exp1Config.address[chainId as keyof (typeof exp1Config)['address']],
    chainId,
  } as const
  const exp2Config_ = {
    ...shared,
    abi: exp2Config.abi,
    address:
      exp2Config.address[
        destinationChainId as keyof (typeof exp2Config)['address']
      ],
    chainId: destinationChainId,
  } as const

  const {
    data: exp1Balance,
    isPending: exp1Pending,
    refetch: expBalanceRefetch,
  } = useReadContract(exp1Config_)
  const {
    data: exp2Balance,
    isPending: exp2Pending,
    refetch: exp2BalanceRefetch,
  } = useReadContract(exp2Config_)
  // biome-ignore lint/correctness/useExhaustiveDependencies: refetch balance every block
  React.useEffect(() => {
    expBalanceRefetch()
    exp2BalanceRefetch()
  }, [blockNumber])

  const { data, isPending, reset, sendCallsAsync } = useSendCalls()
  const {
    error,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForCallsStatus({
    id: data?.id,
    pollingInterval,
  })
  React.useEffect(() => {
    if (isConfirmed) {
      setTimeout(reset, 4_000)
      next()
    }
  }, [isConfirmed, next, reset])
  React.useEffect(() => {
    if (error)
      toast.custom((t) => (
        <Toast
          className={t}
          description={error.message}
          kind="error"
          title="Swap Failed"
        />
      ))
  }, [error])

  const form = Ariakit.useFormStore({
    defaultValues: {
      fromSymbol: 'exp1',
      fromValue: '10',
      toValue: '0.1',
    },
  })
  form.useSubmit(async (state) => {
    try {
      const fromSymbol = state.values.fromSymbol
      const fromValue = state.values.fromValue
      const expFromConfig = fromSymbol === 'exp1' ? exp1Config_ : exp2Config_
      const expToConfig = fromSymbol === 'exp1' ? exp2Config_ : exp1Config_
      await sendCallsAsync({
        calls: [
          {
            abi: expFromConfig.abi,
            args: [expToConfig.address, address!, Value.fromEther(fromValue)],
            functionName: 'swap',
            to: expFromConfig.address,
          },
        ],
        capabilities: {
          permissions: {
            id: null,
          },
          requiredFunds: [
            {
              symbol: fromSymbol === 'exp1' ? 'EXP' : 'EXP2',
              value: fromValue as `${number}`,
            },
          ],
        },
        chainId: expToConfig.chainId,
      })
    } catch (err) {
      const error = (() => {
        if (err instanceof BaseError)
          return err instanceof BaseError
            ? err.walk((err) => err instanceof UserRejectedRequestError)
            : err
        return err
      })()

      if (
        (error as Provider.ProviderRpcError)?.code !==
        Provider.UserRejectedRequestError.code
      )
        toast.custom((t) => (
          <Toast
            className={t}
            description={(err as Error)?.message ?? 'Something went wrong'}
            kind="error"
            title="Swap Failed"
          />
        ))
    }
  })

  const fromSymbol = form.useValue('fromSymbol')
  const fromValue = form.useValue('toValue')
  const toValue = form.useValue('toValue')

  const from = {
    balance: fromSymbol === 'exp1' ? exp1Balance : exp2Balance,
    icon: fromSymbol === 'exp1' ? <Exp1Token /> : <Exp2Token />,
    symbol: fromSymbol,
    value: fromValue,
  }
  const to = {
    balance: fromSymbol === 'exp1' ? exp2Balance : exp1Balance,
    icon: fromSymbol === 'exp1' ? <Exp2Token /> : <Exp1Token />,
    symbol: fromSymbol === 'exp1' ? 'exp2' : 'exp1',
    value: toValue,
  }
  const balancePending = exp1Pending || exp2Pending
  const noFunds = (exp1Balance ?? 0n) === 0n && (exp2Balance ?? 0n) === 0n

  return (
    <Ariakit.Form className="mt-2 pb-4" resetOnSubmit={false} store={form}>
      <div
        className={cx(
          'relative mb-2 flex items-center justify-center gap-1',
          noFunds && 'opacity-50',
        )}
      >
        <div className="relative flex flex-1 items-center">
          <Ariakit.VisuallyHidden>
            <Ariakit.FormLabel name={form.names.fromValue}>
              From value
            </Ariakit.FormLabel>
          </Ariakit.VisuallyHidden>

          <Ariakit.FormInput
            className="-tracking-[0.42px] h-10.5 w-full rounded-[10px] border border-gray5 bg-gray1 py-3 ps-3 pe-[76px] font-medium text-[15px] text-gray12 placeholder:text-gray8"
            disabled={!address || noFunds || isPending || isConfirming}
            max={from.balance ? Value.formatEther(from.balance) : 0}
            min="0"
            name={form.names.fromValue}
            onChange={(e) => {
              const value = e.target.value
              const scalar = fromSymbol === 'exp1' ? 0.01 : 100
              form.setValue(
                'toValue',
                value ? (Number(value) * scalar).toString() : '',
              )
            }}
            placeholder="0.0"
            required
            step="any"
            type="number"
          />
          <div className="absolute end-4 flex items-center gap-1">
            <div className="size-4">{from.icon}</div>
            <span className="-tracking-[0.25px] font-medium text-[13px] text-gray9 uppercase tabular-nums leading-none">
              {from.symbol}
            </span>
          </div>
        </div>

        <div className="relative flex flex-1 items-center">
          <Ariakit.VisuallyHidden>
            <Ariakit.FormLabel name={form.names.toValue}>
              To value
            </Ariakit.FormLabel>
          </Ariakit.VisuallyHidden>

          <Ariakit.FormInput
            className="-tracking-[0.42px] h-10.5 w-full rounded-[10px] border border-gray5 bg-gray1 py-3 ps-4 pe-[76px] font-medium text-[15px] text-gray12 placeholder:text-gray8"
            disabled={!address || noFunds || isPending || isConfirming}
            min="0"
            name={form.names.toValue}
            onChange={(e) => {
              const value = e.target.value
              const scalar = fromSymbol === 'exp1' ? 100 : 0.01
              form.setValue(
                'fromValue',
                value ? (Number(value) * scalar).toString() : '',
              )
            }}
            placeholder="0.0"
            required
            step="any"
            type="number"
          />
          <div className="absolute end-3 flex items-center gap-1">
            <div className="size-4">{to.icon}</div>
            <span className="-tracking-[0.25px] font-medium text-[13px] text-gray9 uppercase tabular-nums leading-none">
              {to.symbol}
            </span>
          </div>
        </div>

        <button
          aria-label="Switch from and to inputs"
          className="absolute flex size-5.5 min-w-5.5 items-center justify-center rounded-full bg-gray4"
          disabled={!address || noFunds || isPending || isConfirming}
          onClick={() => {
            form.setValues((x) => ({
              fromSymbol: x.fromSymbol === 'exp1' ? 'exp2' : 'exp1',
              fromValue: x.toValue,
              toValue: x.fromValue,
            }))
          }}
          tabIndex={-1}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="size-3.5 text-gray9"
            fill="none"
            height="14"
            viewBox="0 0 14 14"
            width="14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.25 10.5L8.75 7L5.25 3.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>

      <Ariakit.FormSubmit
        aria-disabled={isPending || isConfirming}
        className={cx(
          '-tracking-[0.448px] flex h-10.5 w-full items-center justify-center gap-1.5 rounded-[10px] px-3 text-center font-medium text-[16px] leading-normal aria-disabled:pointer-events-none aria-disabled:bg-gray5 aria-disabled:text-gray10',
          isConfirmed ? 'bg-green3 text-green10' : 'bg-accent text-white',
          !(isPending || isConfirming || isConfirmed) &&
            'outline outline-dashed outline-blue9 outline-offset-2',
        )}
        disabled={isPending || isConfirming}
      >
        {isPending || isConfirming
          ? 'Swapping...'
          : isConfirmed
            ? 'Swap complete!'
            : 'Swap'}
      </Ariakit.FormSubmit>

      <div className="-tracking-[0.25px] mt-3 flex h-[18.5px] items-center justify-between font-medium text-[13px]">
        <div className="text-gray9">Balance</div>
        <div className="flex items-center gap-2 text-gray10">
          <div>
            <span
              className={
                !balancePending && noFunds ? 'text-red10' : 'text-gray12'
              }
            >
              {ValueFormatter.format(exp1Balance ?? 0n)}
            </span>{' '}
            <span>EXP1</span>
          </div>
          <div className="h-[18.5px] w-px bg-gray6" />
          <div>
            <span
              className={
                !balancePending && noFunds ? 'text-red10' : 'text-gray12'
              }
            >
              {ValueFormatter.format(exp2Balance ?? 0n)}
            </span>{' '}
            <span>EXP2</span>
          </div>
        </div>
      </div>
    </Ariakit.Form>
  )
}

function Install() {
  const store = Ariakit.useRadioStore({ defaultValue: 'npm' })
  const state = Ariakit.useStoreState(store)
  return (
    <div className="flex max-h-[30px] w-full justify-between gap-1">
      <Ariakit.RadioProvider store={store}>
        <Ariakit.RadioGroup className="flex gap-1">
          <Install.Radio value="npm" />
          <Install.Radio value="pnpm" />
          <Install.Radio value="bun" />
        </Ariakit.RadioGroup>
        <div className="font-[300] font-mono text-[15px] text-gray12 tracking-[-2.8%] max-[486px]:text-[12px]">
          <span className="text-gray8">{'>'}</span>{' '}
          <span className="text-blue9">{state.value}</span> install porto
        </div>
      </Ariakit.RadioProvider>
    </div>
  )
}

namespace Install {
  export function Radio(props: Radio.Props) {
    const { value } = props
    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: _
      <label className="flex items-center rounded-full border border-gray5 px-2 font-[400] text-[13px] text-gray9 leading-[unset] transition-all has-checked:border-blue9 has-checked:text-gray12">
        <Ariakit.VisuallyHidden>
          <Ariakit.Radio value={value} />
        </Ariakit.VisuallyHidden>
        {value}
      </label>
    )
  }

  declare namespace Radio {
    export type Props = {
      value: 'npm' | 'pnpm' | 'yarn' | 'bun'
    }
  }
}

function WorksAnywhereIcon() {
  return (
    <svg
      fill="none"
      height="100%"
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Works anywhere</title>
      <path
        d="M20 3H4C3.44772 3 3 3.44772 3 4V9C3 9.55228 3.44772 10 4 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z"
        stroke="#D6409F"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M11 14H4C3.44772 14 3 14.4477 3 15V20C3 20.5523 3.44772 21 4 21H11C11.5523 21 12 20.5523 12 20V15C12 14.4477 11.5523 14 11 14Z"
        stroke="#D6409F"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M20 14H17C16.4477 14 16 14.4477 16 15V20C16 20.5523 16.4477 21 17 21H20C20.5523 21 21 20.5523 21 20V15C21 14.4477 20.5523 14 20 14Z"
        stroke="#D6409F"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function ProgrammableIcon() {
  return (
    <svg
      className="lucide lucide-square-code-icon lucide-square-code"
      fill="none"
      height="24"
      stroke="#3C9EFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Programmable</title>
      <path d="m10 9-3 3 3 3" />
      <path d="m14 15 3-3-3-3" />
      <rect height="18" rx="2" width="18" x="3" y="3" />
    </svg>
  )
}

function NoDeveloperLockInIcon() {
  return (
    <svg
      fill="none"
      height="100%"
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>No developer lock-in</title>
      <path
        d="M20 3H15C14.4477 3 14 3.44772 14 4V9C14 9.55228 14.4477 10 15 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z"
        stroke="#F76B15"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M10 21V8C10 7.73478 9.89464 7.48043 9.70711 7.29289C9.51957 7.10536 9.26522 7 9 7H4C3.73478 7 3.48043 7.10536 3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 20.2652 3.10536 20.5196 3.29289 20.7071C3.48043 20.8946 3.73478 21 4 21H16C16.2652 21 16.5196 20.8946 16.7071 20.7071C16.8946 20.5196 17 20.2652 17 20V15C17 14.7348 16.8946 14.4804 16.7071 14.2929C16.5196 14.1054 16.2652 14 16 14H3"
        stroke="#F76B15"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function ModernEIPSupportIcon() {
  return (
    <svg
      fill="none"
      height="100%"
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Modern EIP support</title>
      <path
        d="M12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20Z"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M12 14C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12C14 11.4696 13.7893 10.9609 13.4142 10.5858C13.0391 10.2107 12.5304 10 12 10C11.4696 10 10.9609 10.2107 10.5858 10.5858C10.2107 10.9609 10 11.4696 10 12C10 12.5304 10.2107 13.0391 10.5858 13.4142C10.9609 13.7893 11.4696 14 12 14Z"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M12 2V4"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M12 22V20"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M17 20.6599L16 18.9299"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M11 10.2701L7 3.34009"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M20.6601 17L18.9301 16"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M3.33997 7L5.06997 8"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M14 12H22"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M2 12H4"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M20.6601 7L18.9301 8"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M3.33997 17L5.06997 16"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M17 3.34009L16 5.07009"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M11 13.73L7 20.66"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function PortoIcon() {
  return (
    <svg
      fill="none"
      height="100%"
      viewBox="0 0 95 79"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="not-dark:hidden">
        <path
          clipRule="evenodd"
          d="M6.56757 0C2.9404 0 0 2.9404 0 6.56757V74.4324C0 76.4475 1.63356 78.0811 3.64865 78.0811H91.2162C93.2313 78.0811 94.8649 76.4475 94.8649 74.4324V6.56757C94.8649 2.9404 91.9245 0 88.2973 0H6.56757ZM78.4461 6.56757C73.4084 6.56757 69.3245 10.6515 69.3245 15.6892C69.3245 20.7269 73.4084 24.8108 78.4461 24.8108H79.1758C84.2136 24.8108 88.2975 20.7269 88.2975 15.6892C88.2975 10.6515 84.2136 6.56757 79.1758 6.56757H78.4461Z"
          fill="#999999"
          fillRule="evenodd"
        />
        <mask
          height="79"
          id="mask0_1_76"
          maskUnits="userSpaceOnUse"
          style={{ maskType: 'alpha' }}
          width="95"
          x="0"
          y="0"
        >
          <path
            clipRule="evenodd"
            d="M6.56757 0C2.9404 0 0 2.9404 0 6.56757V74.4324C0 76.4475 1.63356 78.0811 3.64865 78.0811H91.2162C93.2313 78.0811 94.8649 76.4475 94.8649 74.4324V6.56757C94.8649 2.9404 91.9245 0 88.2973 0H6.56757ZM78.4461 6.56757C73.4084 6.56757 69.3245 10.6515 69.3245 15.6892C69.3245 20.7269 73.4084 24.8108 78.4461 24.8108H79.1758C84.2136 24.8108 88.2975 20.7269 88.2975 15.6892C88.2975 10.6515 84.2136 6.56757 79.1758 6.56757H78.4461Z"
            fill="white"
            fillRule="evenodd"
          />
        </mask>
        <g mask="url(#mask0_1_76)">
          <path
            d="M0.00018692 36.4865C0.00018692 34.4714 1.63374 32.8378 3.64884 32.8378H91.2164C93.2315 32.8378 94.865 34.4714 94.865 36.4865V74.4324C94.865 76.4475 93.2315 78.0811 91.2164 78.0811H3.64884C1.63375 78.0811 0.00018692 76.4475 0.00018692 74.4324V36.4865Z"
            fill="#CBCBCB"
          />
          <path
            clipRule="evenodd"
            d="M3.64884 29.9189H91.2164C94.8436 29.9189 97.784 32.8593 97.784 36.4865V74.4324C97.784 78.0596 94.8436 81 91.2164 81H3.64884C0.0216737 81 -2.91873 78.0596 -2.91873 74.4324V36.4865C-2.91873 32.8593 0.0216694 29.9189 3.64884 29.9189ZM3.64884 32.8378C1.63374 32.8378 0.00018692 34.4714 0.00018692 36.4865V74.4324C0.00018692 76.4475 1.63375 78.0811 3.64884 78.0811H91.2164C93.2315 78.0811 94.865 76.4475 94.865 74.4324V36.4865C94.865 34.4714 93.2315 32.8378 91.2164 32.8378H3.64884Z"
            fill="#999999"
            fillRule="evenodd"
          />
          <path
            d="M0.00018692 51.8108C0.00018692 49.7957 1.63374 48.1622 3.64884 48.1622H91.2164C93.2315 48.1622 94.865 49.7957 94.865 51.8108V74.4324C94.865 76.4475 93.2315 78.0811 91.2164 78.0811H3.64884C1.63375 78.0811 0.00018692 76.4475 0.00018692 74.4324V51.8108Z"
            fill="#DDDDDD"
          />
          <path
            clipRule="evenodd"
            d="M3.64884 45.2432H91.2164C94.8436 45.2432 97.784 48.1836 97.784 51.8108V74.4324C97.784 78.0596 94.8436 81 91.2164 81H3.64884C0.0216737 81 -2.91873 78.0596 -2.91873 74.4324V51.8108C-2.91873 48.1836 0.0216684 45.2432 3.64884 45.2432ZM3.64884 48.1622C1.63374 48.1622 0.00018692 49.7957 0.00018692 51.8108V74.4324C0.00018692 76.4475 1.63375 78.0811 3.64884 78.0811H91.2164C93.2315 78.0811 94.865 76.4475 94.865 74.4324V51.8108C94.865 49.7957 93.2315 48.1622 91.2164 48.1622H3.64884Z"
            fill="#999999"
            fillRule="evenodd"
          />
          <path
            d="M0.00018692 67.1351C0.00018692 65.12 1.63374 63.4865 3.64884 63.4865H91.2164C93.2315 63.4865 94.865 65.12 94.865 67.1351V74.4324C94.865 76.4475 93.2315 78.0811 91.2164 78.0811H3.64884C1.63375 78.0811 0.00018692 76.4475 0.00018692 74.4324V67.1351Z"
            fill="white"
          />
          <path
            clipRule="evenodd"
            d="M3.64884 60.5676H91.2164C94.8436 60.5676 97.784 63.5079 97.784 67.1351V74.4324C97.784 78.0596 94.8436 81 91.2164 81H3.64884C0.0216737 81 -2.91873 78.0596 -2.91873 74.4324V67.1351C-2.91873 63.508 0.0216684 60.5676 3.64884 60.5676ZM3.64884 63.4865C1.63374 63.4865 0.00018692 65.12 0.00018692 67.1351V74.4324C0.00018692 76.4475 1.63375 78.0811 3.64884 78.0811H91.2164C93.2315 78.0811 94.865 76.4475 94.865 74.4324V67.1351C94.865 65.12 93.2315 63.4865 91.2164 63.4865H3.64884Z"
            fill="#999999"
            fillRule="evenodd"
          />
        </g>
      </g>
      <g className="dark:hidden">
        <title>Porto</title>
        <path
          clipRule="evenodd"
          d="M6.56757 0C2.9404 0 0 2.9404 0 6.56757V74.4324C0 76.4475 1.63356 78.0811 3.64865 78.0811H91.2162C93.2313 78.0811 94.8649 76.4475 94.8649 74.4324V6.56757C94.8649 2.9404 91.9245 0 88.2973 0H6.56757ZM78.4461 6.56757C73.4084 6.56757 69.3245 10.6515 69.3245 15.6892C69.3245 20.7269 73.4084 24.8108 78.4461 24.8108H79.1758C84.2136 24.8108 88.2975 20.7269 88.2975 15.6892C88.2975 10.6515 84.2136 6.56757 79.1758 6.56757H78.4461Z"
          fill="#CCCCCC"
          fillRule="evenodd"
        />
        <mask
          height="79"
          id="mask0_1_116"
          maskUnits="userSpaceOnUse"
          style={{ maskType: 'alpha' }}
          width="95"
          x="0"
          y="0"
        >
          <path
            clipRule="evenodd"
            d="M6.56757 0C2.9404 0 0 2.9404 0 6.56757V74.4324C0 76.4475 1.63356 78.0811 3.64865 78.0811H91.2162C93.2313 78.0811 94.8649 76.4475 94.8649 74.4324V6.56757C94.8649 2.9404 91.9245 0 88.2973 0H6.56757ZM78.4461 6.56757C73.4084 6.56757 69.3245 10.6515 69.3245 15.6892C69.3245 20.7269 73.4084 24.8108 78.4461 24.8108H79.1758C84.2136 24.8108 88.2975 20.7269 88.2975 15.6892C88.2975 10.6515 84.2136 6.56757 79.1758 6.56757H78.4461Z"
            fill="white"
            fillRule="evenodd"
          />
        </mask>
        <g mask="url(#mask0_1_116)">
          <path
            d="M0.00018692 36.4865C0.00018692 34.4714 1.63374 32.8378 3.64884 32.8378H91.2164C93.2315 32.8378 94.865 34.4714 94.865 36.4865V74.4324C94.865 76.4475 93.2315 78.0811 91.2164 78.0811H3.64884C1.63375 78.0811 0.00018692 76.4475 0.00018692 74.4324V36.4865Z"
            fill="#A3A3A3"
          />
          <path
            clipRule="evenodd"
            d="M3.64884 29.9189H91.2164C94.8436 29.9189 97.784 32.8593 97.784 36.4865V74.4324C97.784 78.0596 94.8436 81 91.2164 81H3.64884C0.0216737 81 -2.91873 78.0596 -2.91873 74.4324V36.4865C-2.91873 32.8593 0.0216694 29.9189 3.64884 29.9189ZM3.64884 32.8378C1.63374 32.8378 0.00018692 34.4714 0.00018692 36.4865V74.4324C0.00018692 76.4475 1.63375 78.0811 3.64884 78.0811H91.2164C93.2315 78.0811 94.865 76.4475 94.865 74.4324V36.4865C94.865 34.4714 93.2315 32.8378 91.2164 32.8378H3.64884Z"
            fill="#CCCCCC"
            fillRule="evenodd"
          />
          <path
            d="M0.00018692 51.8108C0.00018692 49.7957 1.63374 48.1622 3.64884 48.1622H91.2164C93.2315 48.1622 94.865 49.7957 94.865 51.8108V74.4324C94.865 76.4475 93.2315 78.0811 91.2164 78.0811H3.64884C1.63375 78.0811 0.00018692 76.4475 0.00018692 74.4324V51.8108Z"
            fill="#626262"
          />
          <path
            clipRule="evenodd"
            d="M3.64884 45.2432H91.2164C94.8436 45.2432 97.784 48.1836 97.784 51.8108V74.4324C97.784 78.0596 94.8436 81 91.2164 81H3.64884C0.0216737 81 -2.91873 78.0596 -2.91873 74.4324V51.8108C-2.91873 48.1836 0.0216684 45.2432 3.64884 45.2432ZM3.64884 48.1622C1.63374 48.1622 0.00018692 49.7957 0.00018692 51.8108V74.4324C0.00018692 76.4475 1.63375 78.0811 3.64884 78.0811H91.2164C93.2315 78.0811 94.865 76.4475 94.865 74.4324V51.8108C94.865 49.7957 93.2315 48.1622 91.2164 48.1622H3.64884Z"
            fill="#CCCCCC"
            fillRule="evenodd"
          />
          <path
            d="M0.00018692 67.1351C0.00018692 65.12 1.63374 63.4865 3.64884 63.4865H91.2164C93.2315 63.4865 94.865 65.12 94.865 67.1351V74.4324C94.865 76.4475 93.2315 78.0811 91.2164 78.0811H3.64884C1.63375 78.0811 0.00018692 76.4475 0.00018692 74.4324V67.1351Z"
            fill="#313131"
          />
          <path
            clipRule="evenodd"
            d="M3.64884 60.5676H91.2164C94.8436 60.5676 97.784 63.5079 97.784 67.1351V74.4324C97.784 78.0596 94.8436 81 91.2164 81H3.64884C0.0216737 81 -2.91873 78.0596 -2.91873 74.4324V67.1351C-2.91873 63.508 0.0216684 60.5676 3.64884 60.5676ZM3.64884 63.4865C1.63374 63.4865 0.00018692 65.12 0.00018692 67.1351V74.4324C0.00018692 76.4475 1.63375 78.0811 3.64884 78.0811H91.2164C93.2315 78.0811 94.865 76.4475 94.865 74.4324V67.1351C94.865 65.12 93.2315 63.4865 91.2164 63.4865H3.64884Z"
            fill="#CCCCCC"
            fillRule="evenodd"
          />
        </g>
      </g>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg
      height="100%"
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>GitHub</title>
      <path
        d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
        fill="currentColor"
      />
    </svg>
  )
}

function usePortoConnector() {
  const connectors = useConnectors()
  return connectors.find((connector) => connector.id === 'xyz.ithaca.porto')!
}

namespace ValueFormatter {
  const numberIntl = new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 4,
  })

  export function format(num: bigint | number | undefined, units = 18) {
    if (!num) return '0'
    return numberIntl.format(
      typeof num === 'bigint' ? Number(Value.format(num, units)) : num,
    )
  }
}

function Exp1Token() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="100%"
      viewBox="0 0 22 22"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" fill="#0588F0" r="10.5" />
      <path
        d="M14.008 10.4885C14.3539 10.3849 14.7255 10.532 14.9079 10.8447L16.9254 14.3017C17.1804 14.7387 16.8665 15.2887 16.362 15.2887H5.96663C5.4365 15.2887 5.12732 14.6879 5.43403 14.2538L6.35149 12.9551C6.45278 12.8118 6.59896 12.7066 6.76672 12.6563L14.008 10.4885Z"
        fill="white"
      />
      <path
        d="M10.2735 5.61316C10.4225 5.34666 10.8216 5.41172 10.8789 5.71184L11.7308 10.1708C11.7747 10.401 11.6389 10.6275 11.4156 10.6961L7.38552 11.9343C7.1039 12.0208 6.86113 11.7182 7.00526 11.4604L10.2735 5.61316Z"
        fill="white"
        opacity="0.75"
      />
      <path
        d="M11.3033 5.46716C11.2614 5.24947 11.6099 5.13942 11.7206 5.33129L14.1689 9.63009C14.2331 9.74146 14.1753 9.88374 14.0518 9.91818L12.5692 10.3317C12.3856 10.3829 12.2268 10.2736 12.1907 10.0857L11.3033 5.46716Z"
        fill="white"
        opacity="0.5"
      />
    </svg>
  )
}

function Exp2Token() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="auto"
      viewBox="0 0 22 22"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" fill="#8774f1" r="10.5" />
      <path
        d="M14.008 10.4885C14.3539 10.3849 14.7255 10.532 14.9079 10.8447L16.9254 14.3017C17.1804 14.7387 16.8665 15.2887 16.362 15.2887H5.96663C5.4365 15.2887 5.12732 14.6879 5.43403 14.2538L6.35149 12.9551C6.45278 12.8118 6.59896 12.7066 6.76672 12.6563L14.008 10.4885Z"
        fill="white"
      />
      <path
        d="M10.2735 5.61316C10.4225 5.34666 10.8216 5.41172 10.8789 5.71184L11.7308 10.1708C11.7747 10.401 11.6389 10.6275 11.4156 10.6961L7.38552 11.9343C7.1039 12.0208 6.86113 11.7182 7.00526 11.4604L10.2735 5.61316Z"
        fill="white"
        opacity="0.75"
      />
      <path
        d="M11.3033 5.46716C11.2614 5.24947 11.6099 5.13942 11.7206 5.33129L14.1689 9.63009C14.2331 9.74146 14.1753 9.88374 14.0518 9.91818L12.5692 10.3317C12.3856 10.3829 12.2268 10.2736 12.1907 10.0857L11.3033 5.46716Z"
        fill="white"
        opacity="0.5"
      />
    </svg>
  )
}
