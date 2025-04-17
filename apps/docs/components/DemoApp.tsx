import * as Ariakit from '@ariakit/react'
import { exp1Config, exp2Config } from '@porto/apps/contracts'
import { useMutation, useQuery } from '@tanstack/react-query'
import { cva, cx, type VariantProps } from 'cva'
import {
  AbiFunction,
  type Address,
  Hex,
  type RpcSchema as Schema,
  Value,
} from 'ox'
import type { Porto, RpcSchema } from 'porto'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import {
  deepEqual,
  useAccount,
  useBlockNumber,
  useChainId,
  useConnectors,
  useReadContract,
} from 'wagmi'
import { useWaitForCallsStatus } from 'wagmi/experimental'
import LucideCheck from '~icons/lucide/check'
import LucideInfo from '~icons/lucide/info'
import LucidePictureInPicture2 from '~icons/lucide/picture-in-picture-2'

type Provider = Porto.Porto['provider']
const pollingInterval = 800
const successTimeout = 4_000 // time to wait until reseting success state back to default

export function DemoApp() {
  const isMountedFn = useIsMounted()
  const [provider, setProvider] = React.useState<
    'wagmi' | 'privy' | 'rainbowkit'
  >('wagmi')

  const { address, status } = useAccount()
  const chainId = useChainId()

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
  const { data: exp1Balance, refetch: expBalanceRefetch } = useReadContract({
    abi: exp1Config.abi,
    address: exp1Config.address[chainId],
    ...shared,
  })
  const { data: exp2Balance, refetch: exp2BalanceRefetch } = useReadContract({
    abi: exp2Config.abi,
    address: exp2Config.address[chainId],
    ...shared,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: refetch balance every block
  React.useEffect(() => {
    expBalanceRefetch()
    exp2BalanceRefetch()
  }, [blockNumber])

  const mint = createUseSendCalls<{ amount: string }>((variables) => [
    {
      data: AbiFunction.encodeData(
        AbiFunction.fromAbi(exp1Config.abi, 'mint'),
        [address!, Value.fromEther(variables.amount)],
      ),
      to: exp1Config.address[chainId],
    },
  ])({
    onError(error) {
      // TODO: Error toast
      console.error('mint', error)
    },
    onSuccess() {
      mint.reset()
    },
  })
  const { isLoading: mintIsLoading, isSuccess: mintIsSuccess } =
    useWaitForCallsStatus({
      id: mint.data?.id,
      pollingInterval,
    })

  if (!isMountedFn()) return null

  return (
    <div className="mx-auto my-8 flex max-w-[1060px] flex-col gap-9">
      <header>
        <h1 className="-tracking-[1.064px] order-1 mb-3.5 font-medium text-[28px] leading-none">
          Demo
        </h1>

        <p className="max-w-[288px] text-left text-[18px] text-gray10 leading-[24px]">
          Preview how Porto integrates with your existing wallet providers.
        </p>
      </header>

      <div className="flex flex-col gap-9 lg:flex-row">
        <div className="flex w-full flex-col lg:max-w-[300px]">
          <div className="mb-6">
            <h3 className="-tracking-[0.364px] w-fit! rounded-full bg-gray4 px-2.5 py-1.5 font-medium text-[13px] text-black leading-[16px] opacity-50 dark:text-white">
              Install Porto
            </h3>

            <div className="mt-4 flex flex-col gap-4">
              <div className="-tracking-[0.448px] flex gap-2.5 rounded-lg border border-gray7 bg-gray2 px-3.75 py-3.5 font-medium font-mono text-[16px] text-black leading-[16px] dark:text-white">
                <div className="select-none opacity-30">{'>'}</div>
                <div>npm i porto</div>
              </div>

              <div className="-tracking-[0.448px] flex flex-col gap-2.5 rounded-lg border border-gray7 bg-gray3 px-3.75 py-3.5 font-medium font-mono text-[14px] text-black leading-[17px] dark:text-white">
                <div className="flex gap-2.5 font-mono">
                  <div className="select-none opacity-30">1</div>
                  <div>{`import { Porto } from 'porto'`}</div>
                </div>
                <div className="flex gap-2.5 font-mono">
                  <div className="select-none opacity-30">2</div>
                  <div>
                    Porto.<span className="text-blue9">create()</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="-tracking-[0.364px] w-fit! rounded-full bg-gray4 px-2.5 py-1.5 font-medium text-[13px] text-black leading-[16px] opacity-50 dark:text-white">
                Select your provider
              </h3>
              <a
                className="-tracking-[2.8%] text-[14px] text-blue9 leading-none"
                href="#TODO"
              >
                Request →
              </a>
            </div>

            <Ariakit.RadioProvider>
              <Ariakit.RadioGroup className="mt-4 flex flex-wrap gap-2">
                <div className="flex w-full">
                  <Radio
                    checked={provider === 'wagmi'}
                    disabled={Boolean(address)}
                    icon={<WagmiLogo />}
                    onChange={setProvider}
                    value="wagmi"
                  >
                    Wagmi
                  </Radio>
                </div>
                <Radio
                  checked={provider === 'rainbowkit'}
                  disabled={Boolean(address)}
                  icon={<RainbowLogo />}
                  onChange={setProvider}
                  value="rainbowkit"
                >
                  RainbowKit
                </Radio>
                <Radio
                  checked={provider === 'privy'}
                  disabled={Boolean(address)}
                  icon={<PrivyLogo />}
                  onChange={setProvider}
                  value="privy"
                >
                  Privy
                </Radio>
              </Ariakit.RadioGroup>
            </Ariakit.RadioProvider>
          </div>

          <div className="mb-6">
            <h3 className="-tracking-[0.364px] w-fit! rounded-full bg-gray4 px-2.5 py-1.5 font-medium text-[13px] text-black leading-[16px] opacity-50 dark:text-white">
              Manage Account
            </h3>

            <div {...{ [`data-${provider}`]: '' }} className="mt-4">
              <div className="in-data-wagmi:block hidden">
                <WagmiDemo />
              </div>

              <div className="in-data-rainbowkit:block hidden">
                <RainbowKitDemo />
              </div>

              <div className="in-data-privy:block hidden">
                <PrivyDemo />
              </div>
            </div>
          </div>
        </div>

        <div
          className={cx(
            'h-fit flex-1 rounded-2xl bg-gray3 px-4 pt-4 pb-4 lg:px-9 lg:pt-6.5 lg:pb-9',
            status !== 'connected' && 'cursor-not-allowed opacity-30',
          )}
        >
          <div className="flex justify-between">
            <h3 className="-tracking-[0.364px] w-fit! rounded-full bg-gray1 px-2.5 py-1.5 font-medium text-[13px] text-black leading-[16px] opacity-50 dark:text-white">
              Your application
            </h3>

            <div className="flex gap-1">
              <div className="-tracking-[0.392px] flex gap-1.25 rounded-full bg-gray1 px-2.5 py-1.5 font-medium text-[14px] leading-[17px]">
                <span className="opacity-30">Balance</span>
                <span>
                  <span className="text-black dark:text-white">
                    {exp1Balance ? ValueFormatter.format(exp1Balance) : 0}
                  </span>{' '}
                  <span className="text-gray11">EXP1</span>
                </span>
              </div>

              <button
                className={cva(
                  '-tracking-[0.25px] flex gap-1.25 rounded-full px-2.5 py-1.5 font-medium text-[14px] leading-[17px] disabled:cursor-not-allowed',
                  {
                    defaultVariants: {
                      status: 'default',
                    },
                    variants: {
                      status: {
                        default:
                          'bg-accent text-white hover:not-disabled:not-active:bg-accentHover',
                        pending: 'cursor-wait bg-gray4 text-gray10',
                        success: 'bg-green4 text-green9',
                      },
                    },
                  },
                )({
                  status:
                    mint.isPending || mintIsLoading
                      ? 'pending'
                      : mintIsSuccess
                        ? 'success'
                        : 'default',
                })}
                disabled={Boolean(
                  status !== 'connected' ||
                    mint.isPending ||
                    mintIsLoading ||
                    mintIsSuccess,
                )}
                onClick={() => mint.mutate({ amount: '100' })}
                type="submit"
              >
                {mint.isPending || mintIsLoading ? 'Minting' : 'Mint'}
              </button>
            </div>
          </div>

          <div className="mt-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-5">
                <Card description="TODO" title="Mint">
                  <MintDemo address={address} exp1Balance={exp1Balance} />
                </Card>

                <Card description="TODO" title="Pay">
                  <PayDemo
                    address={address}
                    exp1Balance={exp1Balance}
                    exp2Balance={exp2Balance}
                  />
                </Card>
              </div>

              <div className="flex flex-col gap-[18px]">
                <Card description="TODO" title="Swap">
                  <SwapDemo
                    address={address}
                    exp1Balance={exp1Balance}
                    exp2Balance={exp2Balance}
                  />
                </Card>

                <Card description="TODO" title="Spending Limit">
                  <LimitDemo address={address} />
                </Card>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Card comingSoon title="Sponsor" />
              <Card comingSoon title="Onramp" />
              <Card comingSoon title="Send" />
              <Card comingSoon title="Recover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MintDemo(props: MintDemo.Props) {
  const { address, exp1Balance, next } = props

  const chainId = useChainId()

  const mint = createUseSendCalls<{ amount: string; symbol: string }>(
    (variables) => [
      {
        data: AbiFunction.encodeData(
          AbiFunction.fromAbi(exp1Config.abi, 'mint'),
          [address!, Value.fromEther(variables.amount)],
        ),
        to: exp1Config.address[chainId],
      },
    ],
  )({
    onError(error) {
      // TODO: Error toast
      console.error('mint', error)
    },
  })
  const { isLoading: mintIsLoading, isSuccess: mintIsSuccess } =
    useWaitForCallsStatus({
      id: mint.data?.id,
      pollingInterval,
    })

  const amount = '100'
  const symbol = 'exp1'
  const onClick = React.useCallback(
    () => mint.mutate({ amount, symbol }),
    [mint.mutate],
  )

  const status =
    mint.isPending || mintIsLoading
      ? 'pending'
      : mintIsSuccess
        ? 'success'
        : 'default'

  React.useEffect(() => {
    if (status === 'success')
      setTimeout(() => {
        if (next) next()
        else mint.reset()
      }, successTimeout)
  }, [next, mint.reset, status])

  return (
    <div className="mt-[3px] flex flex-col gap-3 pb-[18px]">
      <div className="-tracking-[0.25px] text-center font-medium text-[13px] text-gray9 leading-[16px]">
        {(() => {
          if (!exp1Balance || exp1Balance === 0n)
            return 'You do not have any EXP1'
          return (
            <span>
              You have{' '}
              <span className="text-gray12">
                {ValueFormatter.format(exp1Balance)}
              </span>{' '}
              EXP1
            </span>
          )
        })()}
      </div>

      <MintButton
        amount={amount}
        disabled={!address}
        onClick={onClick}
        status={status}
        symbol={symbol}
      />

      <div className="-tracking-[0.322px] text-center text-[11.5px] text-gray9 leading-[14px]">
        This is a testnet token used for demonstration only.
      </div>
    </div>
  )
}
declare namespace MintDemo {
  type Props = {
    address: Address.Address | undefined
    exp1Balance: bigint | undefined
    next?: () => void
  }
}

function MintButton(props: MintButton.Props) {
  const { amount, status, symbol, ...rest } = props
  return (
    <button
      className={buttonClassName({
        variant: status === 'default' ? 'invert' : status,
      })}
      type="button"
      {...rest}
    >
      {(() => {
        if (status === 'pending') return 'Minting tokens...'
        if (status === 'success') return 'Completed!'
        return (
          <span className="flex items-center gap-1.5">
            <span>Mint</span>
            <div className="size-5.5">
              <Exp1Token />
            </div>
            <span>
              <span>{amount}</span>{' '}
              <span className="text-whiteA8 uppercase dark:text-blackA8">
                {symbol}
              </span>
            </span>
          </span>
        )
      })()}
    </button>
  )
}
declare namespace MintButton {
  interface Props
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
    amount: string
    status: 'default' | 'pending' | 'success'
    symbol: string
  }
}

export function SwapDemo(props: SwapDemo.Props) {
  const { address, exp1Balance, exp2Balance, next } = props

  const chainId = useChainId()

  const swap = createUseSendCalls<Variables>((variables) => {
    const expFromConfig =
      variables.fromSymbol === 'exp1' ? exp1Config : exp2Config
    const expToConfig =
      variables.fromSymbol === 'exp1' ? exp2Config : exp1Config
    return [
      {
        data: AbiFunction.encodeData(
          AbiFunction.fromAbi(expFromConfig.abi, 'swap'),
          [
            expToConfig.address[chainId],
            address!,
            Value.fromEther(variables.fromValue),
          ],
        ),
        to: expFromConfig.address[chainId],
      },
    ]
  })({
    onError(error) {
      // TODO: Error toast
      console.error('swap', error)
    },
    onSuccess() {
      form.setValues((x) => ({ ...x, fromValue: '', toValue: '' }))
    },
  })
  type Variables = {
    fromSymbol: 'exp1' | 'exp2'
    toValue: string
    fromValue: string
  }
  const { isLoading: swapIsLoading, isSuccess: swapIsSuccess } =
    useWaitForCallsStatus({
      id: swap.data?.id,
      pollingInterval,
    })

  const form = Ariakit.useFormStore<Variables>({
    defaultValues: {
      fromSymbol: 'exp1',
      fromValue: '',
      toValue: '',
    },
  })
  form.useSubmit(async (state) => {
    await swap.mutateAsync(state.values)
  })

  const swapStatus =
    swap.isPending || swapIsLoading
      ? 'pending'
      : swapIsSuccess
        ? 'success'
        : 'default'

  React.useEffect(() => {
    if (swapStatus === 'success')
      setTimeout(() => {
        if (next) next()
        else swap.reset()
      }, successTimeout)
  }, [next, swap.reset, swapStatus])

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

  const noFunds = (exp1Balance ?? 0n) === 0n && (exp2Balance ?? 0n) === 0n

  const mint = createUseSendCalls<{ amount: string; symbol: string }>(
    (variables) => [
      {
        data: AbiFunction.encodeData(
          AbiFunction.fromAbi(exp1Config.abi, 'mint'),
          [address!, Value.fromEther(variables.amount)],
        ),
        to: exp1Config.address[chainId],
      },
    ],
  )({
    onError(error) {
      // TODO: Error toast
      console.error('mint', error)
    },
    onSuccess() {
      setTimeout(() => mint.reset(), successTimeout)
    },
  })
  const { isLoading: mintIsLoading, isSuccess: mintIsSuccess } =
    useWaitForCallsStatus({
      id: mint.data?.id,
      pollingInterval,
    })
  const mintAmount = '100'
  const mintSymbol = 'exp1'
  const onClickMint = React.useCallback(
    () => mint.mutate({ amount: mintAmount, symbol: mintSymbol }),
    [mint.mutate],
  )

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
            className="-tracking-[0.42px] h-10.5 w-full rounded-[10px] border border-gray5 py-3 ps-3 pe-[76px] font-medium text-[15px] text-gray12 placeholder:text-gray8"
            disabled={!address || noFunds || swapStatus === 'pending'}
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
            className="-tracking-[0.42px] h-10.5 w-full rounded-[10px] border border-gray5 py-3 ps-4 pe-[76px] font-medium text-[15px] text-gray12 placeholder:text-gray8"
            disabled={!address || noFunds || swapStatus === 'pending'}
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
          disabled={!address || noFunds || swapStatus === 'pending'}
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

      {noFunds ? (
        <MintButton
          amount={mintAmount}
          disabled={!address}
          onClick={onClickMint}
          status={
            mint.isPending || mintIsLoading
              ? 'pending'
              : mintIsSuccess
                ? 'success'
                : 'default'
          }
          symbol={mintSymbol}
        />
      ) : (
        <Ariakit.FormSubmit
          className={buttonClassName({ variant: swapStatus })}
          disabled={swapStatus === 'pending'}
        >
          {(() => {
            if (swapStatus === 'pending') return 'Swapping...'
            if (swapStatus === 'success') return 'Completed!'
            return 'Swap'
          })()}
        </Ariakit.FormSubmit>
      )}

      <div className="-tracking-[0.25px] mt-3 flex h-[18.5px] items-center justify-between text-[13px]">
        <div className="text-gray9">Balance</div>
        <div className="flex items-center gap-2 text-gray10">
          <div>
            <span className={noFunds ? 'text-red10' : undefined}>
              {ValueFormatter.format(exp1Balance ?? 0n)}
            </span>{' '}
            <span>EXP1</span>
          </div>
          <div className="h-[18.5px] w-px bg-gray6" />
          <div>
            <span className={noFunds ? 'text-red10' : undefined}>
              {ValueFormatter.format(exp2Balance ?? 0n)}
            </span>{' '}
            <span>EXP2</span>
          </div>
        </div>
      </div>
    </Ariakit.Form>
  )
}
declare namespace SwapDemo {
  type Props = {
    address: Address.Address | undefined
    exp1Balance: bigint | undefined
    exp2Balance: bigint | undefined
    next?: () => void
  }
}

export function PayDemo(props: PayDemo.Props) {
  const { address, exp1Balance, exp2Balance, next } = props

  const chainId = useChainId()

  const pay = createUseSendCalls<{ amount: string; symbol: typeof symbol }>(
    (variables) => {
      const expConfig = variables.symbol === 'exp1' ? exp1Config : exp2Config
      return [
        {
          data: AbiFunction.encodeData(
            AbiFunction.fromAbi(expConfig.abi, 'approve'),
            [address!, Value.fromEther(variables.amount)],
          ),
          to: expConfig.address[chainId],
        },
        {
          data: AbiFunction.encodeData(
            AbiFunction.fromAbi(expConfig.abi, 'transferFrom'),
            [
              address!,
              '0x0000000000000000000000000000000000000000',
              Value.fromEther(variables.amount),
            ],
          ),
          to: expConfig.address[chainId],
        },
      ]
    },
  )({
    onError(error) {
      // TODO: Error toast
      console.error('pay', error)
    },
  })
  const { isLoading: payIsLoading, isSuccess: payIsSuccess } =
    useWaitForCallsStatus({
      id: pay.data?.id,
      pollingInterval,
    })

  const form = Ariakit.useFormStore({
    defaultValues: {
      amount: '',
      symbol: 'exp1',
    },
  })
  form.useSubmit(async (state) => {
    await pay.mutateAsync(state.values)
  })

  const symbol = form.useValue('symbol')
  const options = React.useMemo(
    () => [
      { icon: <Exp1Token />, symbol: 'exp1' },
      { icon: <Exp2Token />, symbol: 'exp2' },
    ],
    [],
  )
  const active = React.useMemo(
    () => options.find((option) => option.symbol === symbol)!,
    [options, symbol],
  )
  const balance = (symbol === 'exp1' ? exp1Balance : exp2Balance) ?? 0n

  const status =
    pay.isPending || payIsLoading
      ? 'pending'
      : payIsSuccess
        ? 'success'
        : 'default'

  React.useEffect(() => {
    if (status === 'success') {
      setTimeout(() => {
        if (next) next()
        else pay.reset()
      }, successTimeout)
    }
  }, [next, pay.reset, status])

  return (
    <div className="mt-3 flex flex-col pb-[19px]">
      <Ariakit.Form
        className="flex items-end gap-3"
        resetOnSubmit={false}
        store={form}
      >
        <div className="flex max-w-[68px] flex-1 flex-col gap-2">
          <Ariakit.FormLabel
            className="-tracking-[0.322px;] h-[14px] text-[11.5px] text-gray9 leading-none"
            name={form.names.amount}
          >
            Amount
          </Ariakit.FormLabel>
          <Ariakit.FormInput
            className="-tracking-[0.42px] h-10.5 w-full rounded-[10px] border border-gray5 px-3 py-3 font-medium text-[15px] text-gray12 placeholder:text-gray8 disabled:cursor-not-allowed"
            disabled={!address}
            max={balance ? Value.formatEther(balance) : 0}
            min="0"
            name={form.names.amount}
            placeholder="0.0"
            required
            step="any"
            type="number"
          />
        </div>

        <div className="flex flex-1 select-none flex-col gap-2">
          <Ariakit.FormLabel
            className="-tracking-[0.322px;] h-[14px] text-[11.5px] text-gray9 leading-none"
            name={form.names.symbol}
          >
            Select token
          </Ariakit.FormLabel>
          <Ariakit.Role.button
            render={
              <Ariakit.FormControl
                name={form.names.symbol}
                render={
                  <Ariakit.SelectProvider
                    setValue={(value) => form.setValue('symbol', value)}
                  >
                    <Ariakit.Select
                      className="-tracking-[0.42px] h-10.5 w-full rounded-[10px] border border-gray5 font-medium text-[15px] text-gray12 disabled:cursor-not-allowed lg:w-[118px]"
                      disabled={!address}
                      value={symbol}
                    >
                      <div className="flex h-10.5 items-center gap-1.5 px-3">
                        <div className="size-5">{active.icon}</div>
                        <div className="-tracking-[0.42px] font-medium text-[15px] text-gray12 uppercase tabular-nums">
                          {active.symbol}
                        </div>
                        <div className="ms-auto flex size-5.5 items-center justify-center rounded-full bg-gray4">
                          <svg
                            aria-hidden="true"
                            fill="none"
                            height="14"
                            viewBox="0 0 14 14"
                            width="14"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.5 5.25L7 8.75L10.5 5.25"
                              stroke="#8D8D8D"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                      </div>
                    </Ariakit.Select>

                    <Ariakit.SelectPopover
                      className="overflow-hidden rounded-[10px] border border-gray5 bg-gray1 outline-none"
                      gutter={-42}
                      sameWidth
                    >
                      {options.map((option) => (
                        <Ariakit.SelectItem
                          className="flex h-10.5 items-center gap-1.5 px-3 hover:bg-gray3 data-focus-visible:bg-gray4"
                          key={option.symbol}
                          value={option.symbol}
                        >
                          <div className="size-5">{option.icon}</div>
                          <div className="-tracking-[0.42px] font-medium text-[15px] text-gray12 uppercase tabular-nums leading-none">
                            {option.symbol}
                          </div>
                          <div className="ms-auto flex size-5.5 items-center justify-end">
                            {option.symbol === active.symbol && (
                              <div className="size-1.5 rounded-full bg-gray7" />
                            )}
                          </div>
                        </Ariakit.SelectItem>
                      ))}
                    </Ariakit.SelectPopover>
                  </Ariakit.SelectProvider>
                }
              />
            }
          />
        </div>

        <Ariakit.FormSubmit
          className={cx(buttonClassName({ variant: status }), 'max-w-[68px]')}
          disabled={!address || status === 'pending'}
          type="submit"
        >
          {(() => {
            if (status === 'pending')
              return (
                <div>
                  <div className="flex items-center justify-between gap-1 text-gray11">
                    <div className="size-1.5 animate-fade-pulse rounded-full bg-current [animation-delay:-0.4s]" />
                    <div className="size-1.5 animate-fade-pulse rounded-full bg-current [animation-delay:-0.2s]" />
                    <div className="size-1.5 animate-fade-pulse rounded-full bg-current" />
                  </div>
                </div>
              )
            if (status === 'success') return 'Done!'
            return 'Send'
          })()}
        </Ariakit.FormSubmit>
      </Ariakit.Form>

      <div className="-tracking-[0.25px] mt-5 flex h-[18.5px] items-center justify-between gap-3 text-[13px]">
        <div className="flex flex-1 justify-between">
          <div className="text-gray9">Fee</div>
          <div className="text-gray10">
            <span className="text-black tabular-nums dark:text-white">
              {/* TODO: Calculate custom token fee */}
              {1}
            </span>{' '}
            <span className="uppercase tabular-nums">{symbol}</span>
          </div>
        </div>

        <div className="h-[18.5px] w-px bg-gray6" />

        <div className="flex flex-1 justify-between">
          <div className="text-gray9">Balance</div>
          <div className="text-gray10">
            <span className="text-black tabular-nums dark:text-white">
              {ValueFormatter.format(balance)}
            </span>{' '}
            <span className="uppercase tabular-nums">{symbol}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
declare namespace PayDemo {
  type Props = {
    address: Address.Address | undefined
    exp1Balance: bigint | undefined
    exp2Balance: bigint | undefined
    next?: () => void
  }
}

export function LimitDemo(props: LimitDemo.Props) {
  const { address } = props

  const { connector } = useAccount()
  const chainId = useChainId()
  const revoke = useMutation<undefined, Error, { id: Hex.Hex }>({
    async mutationFn(variables) {
      const provider = (await connector?.getProvider()) as Provider | undefined
      if (!provider) throw new Error('connector not connected')
      if (variables.id)
        return provider.request({
          method: 'experimental_revokePermissions',
          params: [{ id: variables.id }],
        })
    },
    onError(error) {
      // TODO: Error toast
      console.error('revoke', error)
    },
    onSuccess() {
      refetch()
      setTimeout(() => revoke.reset(), successTimeout)
    },
  })
  const revokeStatus = revoke.isPending
    ? 'pending'
    : revoke.isSuccess
      ? 'success'
      : 'default'

  const grant = useMutation<
    Schema.ExtractReturnType<RpcSchema.Schema, 'experimental_grantPermissions'>,
    Error,
    Variables
  >({
    async mutationFn(variables) {
      const provider = (await connector?.getProvider()) as Provider | undefined
      if (!provider) throw new Error('connector not connected')
      return provider.request({
        method: 'experimental_grantPermissions',
        params: [
          {
            expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
            permissions: {
              calls: [
                { to: exp1Config.address[chainId] },
                { to: exp2Config.address[chainId] },
              ],
              spend: [
                {
                  limit: Hex.fromNumber(Value.fromEther(variables.limit)),
                  period: variables.period,
                  token: exp1Config.address[chainId],
                },
              ],
            },
          },
        ],
      })
    },
    onError(error) {
      // TODO: Error toast
      console.error('grant', error)
    },
    onSuccess() {
      refetch()
    },
  })
  type Variables = {
    limit: string
    period: 'minute' | 'hour' | 'day' | 'week'
  }

  const [customize, setCustomize] = React.useState(false)
  const defaultValues = React.useMemo(
    () =>
      ({
        limit: '0',
        period: 'minute',
      }) as const satisfies Variables,
    [],
  )
  const [spend, setSpend] = React.useState<
    Variables & { id: Hex.Hex | undefined }
  >({ ...defaultValues, id: undefined })
  const form = Ariakit.useFormStore<Variables>({ defaultValues })
  form.useSubmit(async (state) => {
    await grant.mutateAsync(state.values)
    setCustomize(false)
  })

  const { data, refetch } = useQuery({
    enabled: Boolean(address),
    async queryFn() {
      const provider = (await connector?.getProvider()) as Provider | undefined
      if (!provider) throw new Error('connector not connected')
      return provider.request({ method: 'experimental_getPermissions' })
    },
    queryKey: [address],
  })
  React.useEffect(() => {
    const permission = data?.find(
      (x) =>
        x.permissions.spend?.length === 1 &&
        x.permissions.spend?.some(
          (y) =>
            y.token === exp1Config.address[chainId] &&
            ['minute', 'hour', 'day', 'week'].includes(y.period),
        ) &&
        deepEqual(x.permissions.calls, [
          { to: exp1Config.address[chainId] },
          { to: exp2Config.address[chainId] },
        ]),
    )
    const spend_ = permission?.permissions.spend?.[0]
    if (spend_) {
      const values = {
        limit: Value.formatEther(Hex.toBigInt(spend_.limit)),
        period: spend_.period,
      } as Variables
      setSpend({ ...values, id: permission.id })
      form.setValues(values)
    } else {
      setSpend({ ...defaultValues, id: undefined })
      form.setValues(defaultValues)
    }
  }, [chainId, data, defaultValues, form])

  const symbol = 'exp1'
  const periods = React.useMemo(
    () => ['minute', 'hour', 'day', 'week'] as Variables['period'][],
    [],
  )

  if (customize)
    return (
      <Ariakit.Form
        className="mt-1.5 flex w-full flex-col gap-[11px] pb-[17px]"
        store={form}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex flex-1 items-center gap-2 lg:max-w-[79px]">
            <Ariakit.VisuallyHidden>
              <Ariakit.FormLabel name={form.names.limit}>
                Limit
              </Ariakit.FormLabel>
            </Ariakit.VisuallyHidden>
            <Ariakit.FormInput
              className="-tracking-[0.42px] h-9.5 w-full rounded-[10px] border border-gray5 ps-[28px] pe-3.25 text-right font-medium text-[15px] text-gray12 placeholder:text-gray8"
              disabled={!address}
              min="0"
              name={form.names.limit}
              placeholder="0.0"
              required
              step="any"
              type="number"
            />
            <div className="absolute start-2 size-4.5">
              <Exp1Token />
            </div>
          </div>

          <div className="-tracking-[0.42px] select-none text-[15px] text-gray9">
            per
          </div>

          <Ariakit.FormRadioGroup className="flex flex-1 select-none gap-[3px]">
            <Ariakit.VisuallyHidden>
              <Ariakit.FormGroupLabel className="radio-group-label">
                Select period
              </Ariakit.FormGroupLabel>
            </Ariakit.VisuallyHidden>
            {periods.map((p) => (
              // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
              <label
                className="-tracking-[0.42px] flex h-9.5 flex-1 items-center justify-center rounded-[10px] border border-gray5 px-3.5 text-[15px] text-gray9 lg:max-w-[36.5px] [&:has(input:checked)]:border-gray12 [&:has(input:checked)]:bg-gray3 [&:has(input:checked)]:text-gray12"
                key={p}
              >
                <Ariakit.VisuallyHidden>
                  <Ariakit.FormRadio name={form.names.period} value={p} />
                </Ariakit.VisuallyHidden>
                <span>{p[0]}</span>
              </label>
            ))}
          </Ariakit.FormRadioGroup>
        </div>

        <div className="flex gap-3">
          <Ariakit.Button
            className={buttonClassName({
              size: 'medium',
              variant: 'secondary',
            })}
            onClick={() => {
              form.setValues(spend)
              setCustomize(false)
            }}
            type="button"
          >
            Cancel
          </Ariakit.Button>

          <Ariakit.FormSubmit
            className={buttonClassName({
              size: 'medium',
              variant: 'default',
            })}
          >
            Save
          </Ariakit.FormSubmit>
        </div>
      </Ariakit.Form>
    )

  return (
    <div className="mt-1.5 flex w-full flex-col gap-[11px] pb-[19px]">
      <div className="-tracking-[0.42px] flex h-9 items-center justify-center gap-1.5 rounded-[6px] bg-gray3 font-medium text-[15px]">
        <div className="mt-px size-4.5">
          <Exp1Token />
        </div>
        <div>
          <span>
            {spend.limit} <span className="uppercase">{symbol}</span>
          </span>{' '}
          <span className="text-gray9">per {spend.period}</span>
        </div>
      </div>

      {spend.id ? (
        <button
          className={buttonClassName({
            size: 'medium',
            variant: revokeStatus,
          })}
          disabled={!address || revoke.isPending}
          onClick={() => spend.id && revoke.mutate({ id: spend.id })}
          type="button"
        >
          {(() => {
            if (revokeStatus === 'pending') return 'Revoking'
            if (revokeStatus === 'success') return 'Revoked!'
            return 'Revoke'
          })()}
        </button>
      ) : (
        <button
          className={buttonClassName({ size: 'medium', variant: 'default' })}
          disabled={!address}
          onClick={() => setCustomize(true)}
          type="button"
        >
          Customize
        </button>
      )}
    </div>
  )
}
declare namespace LimitDemo {
  type Props = {
    address: Address.Address | undefined
  }
}

const buttonClassName = cva(
  'disabled:cursor-not-allowed flex w-full items-center justify-center rounded-[10px] px-4',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-10.5 -tracking-[0.42px] text-[15px] font-medium',
        medium: 'h-9 -tracking-[0.392px] text-[13px] font-semibold',
      },
      variant: {
        default: 'bg-accent text-white',
        invert: 'bg-black text-white dark:bg-white dark:text-black',
        pending: 'cursor-wait bg-gray3 text-gray10',
        secondary: 'bg-gray3 text-gray12',
        success: 'bg-green4 text-green9',
      },
    },
  },
)

function SignedIn(props: SignedIn.Props) {
  const { address, icon, onDisconnect } = props
  const disconnect = Hooks.useDisconnect({
    mutation: {
      onSuccess() {
        onDisconnect?.()
      },
    },
  })

  const [copied, setCopied] = React.useState(false)
  const copyToClipboard = React.useCallback(() => {
    if (copied) return

    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2_000)
  }, [address, copied])

  return (
    <div className="flex gap-2">
      <button
        className="-tracking-[0.448px] relative h-9.5 flex-grow rounded-full bg-gray4 px-2.75 font-medium text-[16px] text-gray12 leading-none"
        onClick={() => copyToClipboard()}
        type="button"
      >
        {copied && (
          <div className="absolute inset-0 flex items-center justify-center gap-1.5">
            <LucideCheck />
            Copied
          </div>
        )}
        <div
          className={cx(
            'flex items-center justify-center gap-1.25',
            copied && 'invisible',
          )}
        >
          <div className="flex size-6 items-center justify-center">{icon}</div>
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      </button>
      <Button onClick={() => disconnect.mutate({})} variant="destructive">
        Sign out
      </Button>
    </div>
  )
}
declare namespace SignedIn {
  type Props = {
    address: Address.Address
    icon: React.ReactElement
    onDisconnect?: (() => void) | undefined
  }
}

function WagmiDemo() {
  const account = useAccount()

  const connect = Hooks.useConnect()
  const connector = usePortoConnector()

  if (account.status === 'connected')
    return (
      <SignedIn
        address={account.address}
        icon={
          <div className="flex size-6 items-center justify-center rounded-full bg-blueA3 text-center">
            🌀
          </div>
        }
      />
    )

  if (connect.isPending)
    return (
      <div className="flex">
        <div className="-tracking-[0.448px] flex h-9.5 flex-grow items-center justify-center gap-1.25 rounded-full bg-gray4 px-2.75 font-medium text-[16px] text-gray9 leading-none">
          <LucidePictureInPicture2 className="mt-px size-5" />
          <span>Check passkey prompt</span>
        </div>
      </div>
    )

  // const grantPermissions = {
  //   expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
  //   permissions: {
  //     calls: [{ to: exp1Config.address }, { to: exp2Config.address }],
  //     spend: [],
  //   },
  // } as const

  return (
    <div className="flex gap-2">
      <Button
        className="flex-grow"
        onClick={() =>
          connect.mutateAsync({
            // grantPermissions,
            connector,
            createAccount: true,
          })
        }
        variant="accent"
      >
        Sign up
      </Button>

      <Button
        className="flex-grow"
        onClick={() =>
          connect.mutate({
            // grantPermissions,
            connector,
          })
        }
        variant="invert"
      >
        Sign in
      </Button>
    </div>
  )
}

function RainbowKitDemo() {
  const account = useAccount()

  const connect = Hooks.useConnect()
  const connector = usePortoConnector()

  if (account.status === 'connected')
    return (
      <SignedIn
        address={account.address}
        icon={
          <div className="flex size-6 items-center justify-center rounded-full bg-blueA3 text-center">
            🌀
          </div>
        }
      />
    )

  if (connect.isError || connect.isPending)
    return (
      <div className="flex min-h-[272px] flex-col items-center gap-2 rounded-3xl border border-transparent p-4 font-rk-sans shadow-md dark:border-[#2c2d31] dark:bg-[#1a1b1f]">
        <div className="mb-3 flex w-full">
          <button
            className="flex h-6.25 w-6.75 items-center justify-center text-blue9 transition-transform duration-125 ease-ease will-change-transform hover:scale-[1.1]"
            onClick={() => connect.reset()}
            type="button"
          >
            <svg
              fill="none"
              height="17"
              viewBox="0 0 11 17"
              width="11"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Back</title>
              <path
                d="M0.99707 8.6543C0.99707 9.08496 1.15527 9.44531 1.51562 9.79688L8.16016 16.3096C8.43262 16.5732 8.74902 16.7051 9.13574 16.7051C9.90918 16.7051 10.5508 16.0811 10.5508 15.3076C10.5508 14.9121 10.3838 14.5605 10.0938 14.2705L4.30176 8.64551L10.0938 3.0293C10.3838 2.74805 10.5508 2.3877 10.5508 2.00098C10.5508 1.23633 9.90918 0.603516 9.13574 0.603516C8.74902 0.603516 8.43262 0.735352 8.16016 0.999023L1.51562 7.51172C1.15527 7.85449 1.00586 8.21484 0.99707 8.6543Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className="">
          {'icon' in connect.variables.connector ? (
            <img
              alt="Wallet icon"
              className="size-11 rounded-[10px]"
              src={connect.variables.connector.icon}
            />
          ) : (
            <div className="size-11 rounded-[10px] bg-[#f0f0f0] dark:bg-[#2c2d31]" />
          )}
        </div>

        <div className="flex flex-col gap-1 px-8">
          <div className="text-center font-extrabold text-[#25292f] text-lg leading-[24px] dark:text-white">
            Opening{' '}
            <span className="capitalize">
              {connect.variables.connector.name}
            </span>
            ...
          </div>
          <div className="text-center font-medium text-[#3C424299] text-sm leading-[18px] dark:text-[#FFFFFF99]">
            Confirm connection in the extension
          </div>
        </div>

        <div>
          {connect.isPending ? (
            <svg
              className="mt-2 animate-spin-slow text-[#3C424299] dark:text-[#FFFFFF99]"
              fill="none"
              height="21"
              viewBox="0 0 21 21"
              width="21"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Loading</title>
              <clipPath id="spinner_363404566">
                <path d="M10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C11.3284 18 12 18.6716 12 19.5C12 20.3284 11.3284 21 10.5 21C4.70101 21 0 16.299 0 10.5C0 4.70101 4.70101 0 10.5 0C16.299 0 21 4.70101 21 10.5C21 11.3284 20.3284 12 19.5 12C18.6716 12 18 11.3284 18 10.5C18 6.35786 14.6421 3 10.5 3Z" />
              </clipPath>
              <foreignObject
                clipPath="url(#spinner_363404566)"
                height="21"
                width="21"
                x="0"
                y="0"
              >
                <div className="h-[21px] w-[21px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(72,146,254,0)_0deg,currentColor_282.04deg,rgba(72,146,254,0)_319.86deg,rgba(72,146,254,0)_360deg)]" />
              </foreignObject>
            </svg>
          ) : (
            <button
              className="mt-2 h-7 rounded-full bg-blue9 px-3 py-1 font-bold text-sm text-white uppercase leading-[18px] transition-transform duration-125 ease-ease will-change-transform hover:scale-[1.025]"
              onClick={() => connect.mutate(connect.variables)}
              type="button"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    )

  return (
    <div className="flex flex-col gap-0.5 rounded-3xl border border-transparent font-rk-sans shadow-md dark:border-[#2c2d31] dark:bg-[#1a1b1f]">
      <div className="mt-4 px-4.5 py-0.5 pb-2 text-center font-extrabold font-rk-sans text-[#25292f] text-lg leading-[24px] dark:text-white">
        Connect a Wallet
      </div>
      <div className="px-4.5 pb-4.5">
        <div className="mx-1.5 mt-4 mb-2 font-bold text-blue9 text-sm leading-[18px]">
          Installed
        </div>
        <button
          className="flex w-full items-center gap-3 rounded-xl p-1.25 hover:bg-[#3C42421A] dark:hover:bg-[#E0E8FF1A]"
          onClick={() => connect.mutate({ connector })}
          type="button"
        >
          <img
            alt="Wallet icon"
            className="size-7 rounded-md"
            src={connector.icon}
          />
          <div className="font-bold text-[#25292f] text-base leading-none dark:text-white">
            {connector.name}
          </div>
        </button>
      </div>
      <div className="flex justify-between border-[#f0f0f0] border-t px-6 py-4 font-medium text-[#3C424299] text-sm leading-[18px] dark:border-[#2c2d31] dark:text-[#FFFFFF99]">
        <div className="py-1">New to Ethereum wallets?</div>
        <div className="cursor-pointer py-1 font-bold text-blue9 transition-transform duration-125 ease-ease will-change-transform hover:scale-[1.025]">
          Learn more
        </div>
      </div>
    </div>
  )
}

function PrivyDemo() {
  const account = useAccount()

  const connect = Hooks.useConnect()
  const connector = usePortoConnector()

  if (account.status === 'connected')
    return (
      <SignedIn
        address={account.address}
        icon={
          <div className="flex size-6 items-center justify-center rounded-full bg-blueA3 text-center">
            🌀
          </div>
        }
      />
    )

  if (connect.isError || connect.isPending)
    return (
      <div className="flex flex-col rounded-3xl bg-white px-4 text-sm leading-[20px] shadow-md dark:bg-[#232325]">
        <div className="flex py-4">
          <button
            className="size-6 rounded-full bg-[#f5f5f5] p-1 opacity-60 dark:bg-[#3c3c39]"
            onClick={() => connect.reset()}
            type="button"
          >
            <Ariakit.VisuallyHidden>Back</Ariakit.VisuallyHidden>
            <svg
              aria-hidden="true"
              data-slot="icon"
              fill="none"
              height="16px"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="16px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative mx-auto flex size-20.5 items-center justify-center">
            <div
              className={cx(
                'h-full w-full animate-rotation rounded-[50%] border-4 border-b-transparent transition-border-color duration-800',
                connect.isPending ? 'border-blue9' : 'border-red9',
              )}
            />
            <div
              className={cx(
                'absolute inset-0 flex items-center justify-center rounded-[50%] border-4 transition-border-color duration-800',
                connect.isPending ? 'border-blue9/50' : 'border-red9',
              )}
            >
              {'icon' in connect.variables.connector ? (
                <img
                  alt="Wallet icon"
                  className="size-9.5 rounded-md"
                  src={connect.variables.connector.icon}
                />
              ) : (
                <div />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 text-center text-[#4d4d4d] dark:text-[#dfdfdd]">
            <div className="font-medium text-[16px] leading-[24px]">
              {connect.isPending ? (
                <>
                  Waiting for{' '}
                  <span className="capitalize">
                    {connect.variables.connector.name}
                  </span>
                </>
              ) : (
                'Could not log in with wallet'
              )}
            </div>

            <div className="text-[13px] leading-[20px]">
              {connect.isPending
                ? 'For the best experience, connect only one wallet at a time.'
                : 'Please try connecting again.'}
            </div>
          </div>

          <div>
            {connect.isPending && (
              <button
                className="w-full cursor-not-allowed rounded-xl bg-[#f5f5f5] px-4 py-3 font-[425] text-[#919191] dark:bg-[#3e3e42] dark:text-[#969696]"
                type="button"
              >
                Connecting
              </button>
            )}
            {connect.isError && (
              <button
                className="w-full rounded-xl bg-blue9 px-4 py-3 font-[425] text-white transition-colors duration-200 hover:bg-blue8"
                onClick={() => connect.mutate(connect.variables)}
                type="button"
              >
                Retry
              </button>
            )}
          </div>
        </div>
        <div className="pt-2 pb-3" />
      </div>
    )

  return (
    <div className="flex flex-col gap-0.5 rounded-3xl bg-white px-4 text-sm leading-[20px] shadow-md dark:bg-[#232325]">
      <div className="flex justify-center py-4">
        <div className="font-[425] text-[#4d4d4d] dark:text-[#E2E2E4]">
          Log in or sign up
        </div>
      </div>

      <div className="mb-4 flex justify-center py-6">
        <svg
          aria-hidden="true"
          className="max-h-22.5 max-w-45 text-black dark:text-white"
          fill="none"
          height="auto"
          viewBox="0 0 346 78"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M253.808 41.4359H252.758L239.096 1.81787H223.094V3.45587L242.366 58.7819H263.618L282.896 3.45587V1.81787H267.59L253.802 41.4359H253.808Z"
            fill="currentColor"
            fillRule="evenodd"
          />
          <path
            d="M218.834 1.81787H202.922V58.7759H218.834V1.81787Z"
            fill="currentColor"
          />
          <path
            clipRule="evenodd"
            d="M330.164 1.81215H330.176L316.388 41.4422H315.338L301.676 1.81815H285.674V3.46815L306.608 63.5762H286.784V76.7702H306.158C314.432 76.7702 320.876 73.9802 324.002 65.0762C324.422 63.8882 345.47 3.45615 345.47 3.45615V1.80615H330.164V1.81215Z"
            fill="currentColor"
            fillRule="evenodd"
          />
          <path
            clipRule="evenodd"
            d="M121.832 0.27002C114.596 0.27002 107.834 3.95402 103.616 10.878H102.638V1.87802H87.47V76.752H103.586V51.528H104.576C104.684 51.678 104.792 51.834 104.9 51.96C107.618 55.266 113.966 60.306 121.862 60.306C136.232 60.306 146.06 47.886 146.06 30.294C146.06 12.702 135.746 0.27002 121.832 0.27002ZM117.02 47.958C109.52 47.958 104.342 42.114 104.342 30.3C104.342 18.486 109.52 12.642 117.02 12.642C124.52 12.642 129.95 18.612 129.95 30.3C129.95 41.988 124.646 47.958 117.02 47.958Z"
            fill="currentColor"
            fillRule="evenodd"
          />
          <path
            clipRule="evenodd"
            d="M186.032 1.81201C178.562 1.81201 173.768 3.06001 170.966 10.878H170.006V1.81801H146.936V14.898H152.084C153.782 14.898 154.616 15.498 154.832 16.89V27.762H154.892V58.782H171.008V28.566C171.008 20.742 173.132 15.948 180.956 15.948H197.84V1.81201H186.038H186.032Z"
            fill="currentColor"
            fillRule="evenodd"
          />
          <path
            d="M30.53 60.2881C47.096 60.2881 60.53 46.8541 60.53 30.2881C60.53 13.7221 47.096 0.288086 30.53 0.288086C13.964 0.288086 0.530029 13.7221 0.530029 30.2881C0.530029 46.8541 13.964 60.2881 30.53 60.2881Z"
            fill="currentColor"
          />
          <path
            d="M30.53 77.73C41.852 77.73 51.032 75.798 51.032 73.428C51.032 71.058 41.858 69.126 30.53 69.126C19.202 69.126 10.028 71.058 10.028 73.428C10.028 75.798 19.202 77.73 30.53 77.73Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="flex flex-col p-0.5">
        <button
          className="flex gap-3 rounded-2xl border border-[#ebebeb] px-4 py-3 font-[425] text-[#4d4d4d] leading-[24px] transition-colors duration-200 hover:bg-[#f5f5f5] dark:border-[#636363] dark:text-[#e2e2e4] dark:hover:bg-[#3e3e42]"
          onClick={() => connect.mutate({ connector })}
          type="button"
        >
          <img
            alt="Wallet icon"
            className="size-6 rounded-sm"
            src={connector.icon}
          />
          <div>{connector.name}</div>
        </button>
      </div>

      <div className="mt-4" />

      <div className="flex justify-center pt-3 pb-4">
        <svg
          aria-hidden="true"
          className="text-[#1f1f1f] dark:text-white"
          height="13"
          viewBox="0 0 460 40"
          width="150"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="currentColor">
            <path d="M0 15.4v15.38h4.64V19.96h3.58c2.47 0 3.63-.01 3.77-.02 1-.08 1.49-.15 2.18-.3a9.45 9.45 0 0 0 4.6-2.37c1.66-1.57 2.64-3.87 2.81-6.56.02-.3.02-1.19 0-1.49-.1-1.77-.56-3.35-1.36-4.72A8.84 8.84 0 0 0 15.14.57c-.93-.3-1.75-.43-3.09-.54C11.9.02 10.2 0 5.93 0H0ZM10.85 4c1.85.05 3.1.45 4.16 1.3.22.17.54.49.69.68a5.97 5.97 0 0 1 1.19 3.13c.04.35.04 1.36 0 1.71-.08.68-.23 1.3-.44 1.85a4.8 4.8 0 0 1-1.09 1.68A5.63 5.63 0 0 1 12 15.92c-.6.08-.4.08-4.01.09H4.64V3.98h2.9c1.6 0 3.08 0 3.31.02ZM187.65 5.71v5.72h-.27l-.09-.14a15.9 15.9 0 0 0-1.21-1.73c-.43-.5-1-.95-1.7-1.36-.54-.3-1.05-.5-1.73-.63a8.98 8.98 0 0 0-1.7-.17 8.84 8.84 0 0 0-7.8 4.03 12.95 12.95 0 0 0-2.03 6.39c-.07.98-.06 2.15.02 3.13.2 2.47.87 4.53 2.02 6.25a8.98 8.98 0 0 0 10.22 3.65 6.5 6.5 0 0 0 2.8-1.93c.41-.51.84-1.1 1.1-1.55l.1-.17h.37v3.58h4.38V0h-4.48Zm-5.24 5.54c1.3.14 2.3.6 3.17 1.48.9.9 1.5 2.09 1.85 3.64.36 1.6.39 3.72.06 5.43a8.13 8.13 0 0 1-1.54 3.62 5.1 5.1 0 0 1-3.93 1.96 6.13 6.13 0 0 1-2.32-.31 5.87 5.87 0 0 1-3.33-3.5c-.39-1-.62-2.05-.72-3.32-.03-.32-.04-1.35-.02-1.73.08-1.56.4-2.91.96-4.05a6.2 6.2 0 0 1 1.06-1.58 5.08 5.08 0 0 1 3.6-1.66c.25-.02.9 0 1.16.02ZM210.07 15.39l.01 15.38h4.38l.01-3.57h.37l.09.15c.24.44.84 1.26 1.21 1.7a6.79 6.79 0 0 0 2.57 1.75 9.3 9.3 0 0 0 6.86-.49 9.28 9.28 0 0 0 4.05-4.07A13.05 13.05 0 0 0 231 21.6c.21-1.73.18-3.7-.09-5.32a13.03 13.03 0 0 0-1.5-4.3 9.1 9.1 0 0 0-3.75-3.63 9.15 9.15 0 0 0-4.43-.96 7.46 7.46 0 0 0-2.8.5A7.07 7.07 0 0 0 216 9.7c-.4.52-.82 1.12-1.1 1.59l-.07.14h-.27V0h-4.5Zm11.13-4.14c1.07.1 1.94.44 2.7 1.04a6.1 6.1 0 0 1 1.64 1.98c.43.84.78 2 .94 3.11.15 1.16.16 2.4.02 3.54a9.34 9.34 0 0 1-1.39 4.03 5.33 5.33 0 0 1-2.69 2.15c-.9.3-2.04.38-3.06.2a5.14 5.14 0 0 1-3.45-2.37 6.03 6.03 0 0 1-.45-.8c-.5-1.03-.8-2.2-.92-3.58-.04-.49-.06-.89-.05-1.53.01-.76.05-1.23.13-1.85.38-2.53 1.47-4.38 3.15-5.31a5.46 5.46 0 0 1 2.3-.63 10 10 0 0 1 1.13.02ZM69.05 2.17l-.01 2.77V7.7h-3.36v3.6h3.36v6.8l.01 7.15c.06 1.4.4 2.44 1.1 3.37a5.8 5.8 0 0 0 2.97 2.07c.91.3 1.83.42 2.9.38a8.71 8.71 0 0 0 2.66-.48l-.8-3.7-.38.06a4.96 4.96 0 0 1-2.43-.06c-.33-.1-.56-.25-.8-.49-.4-.41-.6-.88-.7-1.67-.02-.2-.02-.62-.03-6.82v-6.6h4.73V7.7h-4.73V2.16h-4.49ZM133.34 2.17V7.7h-3.39v3.6h3.38v6.9l.01 7.17a5.66 5.66 0 0 0 2.36 4.49c.85.6 2.03 1.03 3.26 1.17.85.1 2.03.05 2.81-.1.3-.06.75-.18 1-.26l.2-.06v-.05l-.81-3.67-.37.06a4.99 4.99 0 0 1-1.8.09c-.85-.13-1.32-.4-1.7-.97a2.63 2.63 0 0 1-.39-1.04c-.06-.4-.06 0-.06-7.1V11.3h4.7V7.7h-4.7l-.01-2.77V2.16h-4.49ZM293.41 2.36a14.56 14.56 0 0 0-13.7 16.07 14.59 14.59 0 0 0 21.86 11.08 14.5 14.5 0 0 0 7.11-14.07 14.61 14.61 0 0 0-6.53-10.73 14.49 14.49 0 0 0-8.74-2.35ZM350.8 2.36a10.17 10.17 0 0 0-7.56 4.2c-.16.2-.45.63-.58.83l-.05.1h-.47l-.01-4.36h-7.36v36.4h7.82V27.27h.49l.05.07a11.3 11.3 0 0 0 7.49 4.15 10.52 10.52 0 0 0 9.38-4.1c1.66-2.1 2.73-4.9 3.07-8.06.1-.87.13-1.4.13-2.37 0-.8 0-1.1-.07-1.76a15.95 15.95 0 0 0-3.23-8.72 12.8 12.8 0 0 0-1.85-1.84 10.49 10.49 0 0 0-7.26-2.28Zm-.94 6.05c1.27.15 2.33.65 3.2 1.5.98.96 1.67 2.31 2.03 4 .34 1.57.38 3.68.12 5.39a9.78 9.78 0 0 1-1.04 3.25c-.14.25-.44.69-.6.89a5.35 5.35 0 0 1-4.31 2.07 5.25 5.25 0 0 1-4.41-1.9 7.35 7.35 0 0 1-1.26-2.32 14.09 14.09 0 0 1-.62-4.83c.05-1.98.38-3.53 1.02-4.85a5.63 5.63 0 0 1 2.5-2.65c.66-.34 1.3-.5 2.14-.58.18-.02 1.04 0 1.23.03ZM363.63 3.1l-.01 3.2v3.16h1.43c1.26.01 1.44.02 1.54.04.42.09.66.28.79.62.08.23.08.08.08 2.96a911.57 911.57 0 0 1 .03 10.18v7.54h7.82v-7.4l.01-7.83c.03-.94.11-1.63.27-2.28.46-1.9 1.54-2.93 3.35-3.23.52-.08.2-.08 5-.08h4.4V3.08h-3.1c-3.48 0-3.91.01-4.67.1-1.83.2-3.04.79-3.96 1.88-.5.6-.9 1.32-1.26 2.26l-.06.17h-.46V3.09h-5.6c-4.46 0-5.6 0-5.6.02ZM390.8 16.95V30.8h3.87l3.86-.01V3.09h-7.73ZM400.6 3.1l-.01.4v.38l4.66 13.4 4.69 13.47.02.05h10.3l.03-.05 4.67-13.45 4.67-13.4V3.1h-7.43l-6.7 19.26h-.5l-3.28-9.5-3.31-9.64-.05-.12h-3.88l-3.88.01ZM430.98 3.1c-.01 0-.02.19-.02.4v.39l5.08 14.59c2.8 8.02 5.08 14.6 5.08 14.61.01.02-.22.02-4.8.02h-4.82v6.42h4.95c5.09 0 5.23 0 5.87-.06 3.15-.28 5.29-1.63 6.63-4.15.28-.55.44-.95.87-2.16L459 6.78l1-2.89v-.8h-7.43l-6.69 19.26h-.5l-3.27-9.46-3.31-9.64-.06-.16h-3.88l-3.88.01ZM36.57 7.36c-1.36.1-2.6.6-3.62 1.45a5.65 5.65 0 0 0-1.67 2.42l-.05.13H31V7.7h-4.35v23.08h4.5v-7.3c0-8 0-7.34.08-7.82a4.89 4.89 0 0 1 2.06-3.18c.83-.58 1.74-.89 2.87-.98a11.87 11.87 0 0 1 2.8.25H39v-4.3l-.21-.02c-.61-.07-1.74-.1-2.22-.07ZM51.08 7.41c-2.33.12-4.3.84-5.95 2.16a9.89 9.89 0 0 0-2.03 2.2 12.5 12.5 0 0 0-2 5.78 18.04 18.04 0 0 0 0 3.65 12.13 12.13 0 0 0 2.26 6.05 9.74 9.74 0 0 0 5 3.52c2.11.64 4.7.64 6.8 0a9.78 9.78 0 0 0 4.88-3.37c1.38-1.78 2.19-4 2.4-6.58.13-1.46.06-3.06-.18-4.42a11.24 11.24 0 0 0-3.58-6.6 10 10 0 0 0-5.75-2.35c-.56-.06-1.31-.07-1.85-.04Zm1.42 3.78c.88.1 1.62.34 2.28.75a6.13 6.13 0 0 1 1.99 2.15 10.31 10.31 0 0 1 1.2 5c.02 1.23-.12 2.44-.42 3.51a7.14 7.14 0 0 1-1.81 3.32c-.61.6-1.2.98-1.95 1.24a6 6 0 0 1-2 .3 5.7 5.7 0 0 1-2.72-.6 5 5 0 0 1-1.28-.94A7.1 7.1 0 0 1 46 22.73c-.57-1.99-.6-4.46-.08-6.5a7.24 7.24 0 0 1 2.03-3.67 5.13 5.13 0 0 1 3.35-1.4 11 11 0 0 1 1.2.03ZM92.05 7.4c-.96.06-1.56.15-2.3.33a9.62 9.62 0 0 0-6.09 4.66 13.5 13.5 0 0 0-1.71 7c0 .83 0 1.04.06 1.6.16 1.77.58 3.32 1.29 4.7A9.72 9.72 0 0 0 90.28 31c1.84.37 4.08.32 5.85-.13a9.07 9.07 0 0 0 5.02-3.1A7.64 7.64 0 0 0 102.5 25l-2.11-.39-2.11-.38-.08.13a4.72 4.72 0 0 1-2.35 2.55 6.3 6.3 0 0 1-2.23.58c-.29.03-1.13.03-1.44 0a6.35 6.35 0 0 1-3.02-1.04 5.93 5.93 0 0 1-2.02-2.43 8.44 8.44 0 0 1-.72-3.18v-.26h16.38v-.81c0-1.83-.06-2.76-.25-3.87-.2-1.22-.53-2.24-1.05-3.28a8.9 8.9 0 0 0-2.66-3.26 10.1 10.1 0 0 0-5.34-1.94 18.3 18.3 0 0 0-1.46-.03Zm1.3 3.75c1.2.13 2.19.55 3.05 1.3a5.8 5.8 0 0 1 1.78 2.96c.13.51.21 1.17.21 1.66v.15H86.43v-.12c.08-.97.3-1.78.72-2.61.5-1 1.2-1.8 2.14-2.42a5.32 5.32 0 0 1 2.9-.95c.2-.01.97 0 1.17.03ZM116.79 7.41c-2 .1-3.73.65-5.22 1.65a10.7 10.7 0 0 0-4.25 6.06 16.1 16.1 0 0 0-.5 5.8c.2 2.17.84 4.13 1.88 5.76.58.9 1.32 1.73 2.15 2.4a9.37 9.37 0 0 0 3.6 1.8 12.06 12.06 0 0 0 3.92.34 10.2 10.2 0 0 0 3.84-.95 8.31 8.31 0 0 0 4.76-6.75l.01-.04h-4.37l-.05.16a4.87 4.87 0 0 1-4.24 3.75c-.59.07-1.32.06-1.93-.05a5.47 5.47 0 0 1-3.5-2.27c-.56-.75-1-1.73-1.26-2.79a13.8 13.8 0 0 1-.16-5.24 7.77 7.77 0 0 1 2.1-4.3 5.48 5.48 0 0 1 2.15-1.3 6.4 6.4 0 0 1 3.89.1c.59.21 1.03.5 1.5.96a5.32 5.32 0 0 1 1.46 2.5l.04.15h4.37v-.06a8.22 8.22 0 0 0-5.31-6.94 10.98 10.98 0 0 0-4.88-.74ZM156.2 7.41a9.87 9.87 0 0 0-6 2.29 11.02 11.02 0 0 0-3.41 5.43c-.52 1.78-.68 3.9-.48 5.97.17 1.8.63 3.38 1.37 4.8a9.68 9.68 0 0 0 5.91 4.86c1.65.48 3.63.61 5.53.36 3.72-.49 6.55-2.62 7.56-5.69.12-.39.13-.42.1-.43-.02 0-4.13-.75-4.19-.75-.03 0-.04 0-.1.16-.18.42-.45.9-.72 1.22-.16.2-.49.53-.7.7-.67.54-1.5.9-2.43 1.08-.48.08-.83.11-1.41.11-.64 0-1.07-.04-1.6-.15a5.76 5.76 0 0 1-3.93-2.83 8 8 0 0 1-.99-3.79v-.16h16.38v-1.11l-.02-1.43c-.1-2.25-.53-4-1.35-5.59a9.24 9.24 0 0 0-6.18-4.75c-1.04-.26-2.2-.36-3.33-.3Zm1.45 3.74a5.35 5.35 0 0 1 3.66 1.94 6.1 6.1 0 0 1 1.38 4.01v.12h-11.97v-.06c0-.02 0-.14.02-.25a6.6 6.6 0 0 1 2.15-4.32 5.73 5.73 0 0 1 3.5-1.46c.25-.02 1 0 1.26.02ZM233.58 7.82l8.37 23.22a49.22 49.22 0 0 1-.67 1.9 5.36 5.36 0 0 1-1.14 1.8c-.41.4-.82.58-1.48.69-.27.04-1.03.03-1.35 0a8.05 8.05 0 0 1-1.1-.23l-1.08 3.67c0 .02.32.14.66.22.83.21 1.57.29 2.56.28.56-.01.8-.03 1.24-.1 2.71-.4 4.66-2.09 5.86-5.08l9.64-26.44c0-.02-4.82-.06-4.83-.05l-2.93 8.96-2.91 8.94h-.24l-.22-.65-2.91-8.95-2.7-8.3H233.53ZM293.05 35.8c-1.18.04-1.93.09-2.8.16-2.52.24-4.53.69-5.43 1.23-.7.41-.76.86-.2 1.28.88.66 3.29 1.19 6.36 1.4a48.55 48.55 0 0 0 5.75.05c3.47-.19 6.24-.78 7.11-1.5.22-.19.3-.34.3-.53 0-.1 0-.12-.04-.22-.35-.69-2.32-1.3-5.25-1.63a41.09 41.09 0 0 0-5.8-.24Zm0 0" />
          </g>
        </svg>
      </div>
    </div>
  )
}

function Card(props: Card.Props) {
  const { children, comingSoon, description, title } = props
  if (comingSoon)
    return (
      <div className="w-full rounded-xl bg-gray1 py-4.5 ps-5 pe-4">
        <div className="flex items-center justify-between">
          <div className="-tracking-[0.448px] font-medium text-[16px] opacity-40">
            {title}
          </div>
          <div className="-tracking-[0.364px] w-fit! rounded-full bg-gray3 px-2.5 py-1.5 font-medium text-[13px] text-black leading-[16px] dark:text-white">
            Coming soon
          </div>
        </div>
      </div>
    )

  return (
    <div className="h-fit w-full rounded-xl bg-gray1 px-5 pt-3.5">
      <div className="flex items-center justify-between">
        <div className="-tracking-[0.448px] font-medium text-[16px] opacity-40">
          {title}
        </div>
        {description && (
          <Ariakit.TooltipProvider>
            <Ariakit.TooltipAnchor className="flex size-7.5 items-center justify-center rounded-full border border-gray4">
              <LucideInfo className="size-4.5 text-gray9" />
            </Ariakit.TooltipAnchor>
            <Ariakit.Tooltip className="rounded-xl border border-gray4 bg-gray1 px-3 py-0.5 text-[13px] text-gray12 shadow-md">
              {description}
            </Ariakit.Tooltip>
          </Ariakit.TooltipProvider>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}
declare namespace Card {
  type Props = React.PropsWithChildren<{
    comingSoon?: boolean | undefined
    description?: string | undefined
    title: string
  }>
}

function Button(props: Button.Props) {
  const { className, disabled, size, variant, asChild = false, ...rest } = props
  return (
    <button
      className={Button.className({ className, disabled, size, variant })}
      disabled={disabled ?? false}
      {...rest}
    />
  )
}
namespace Button {
  export const displayName = 'Button'

  export interface Props
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
      VariantProps<typeof className> {
    asChild?: boolean
  }

  export const className = cva(
    'inline-flex items-center justify-center rounded-default whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
      defaultVariants: {
        size: 'default',
        variant: 'default',
      },
      variants: {
        disabled: {
          true: 'pointer-events-none opacity-50',
        },
        size: {
          default: 'h-9.5 px-5 -tracking-[0.448px] text-[16px] font-medium',
        },
        variant: {
          accent: 'text-white bg-accent hover:not-active:bg-accentHover',
          default:
            'text-primary bg-surface hover:not-active:bg-surfaceHover text-surface border border-surface',
          destructive:
            'text-destructive bg-destructive hover:not-active:bg-destructiveHover',
          invert:
            'text-invert bg-invert hover:not-active:bg-invertHover text-invert',
          success: 'text-white bg-success hover:not-active:bg-successHover',
          warning: 'text-white bg-warning hover:not-active:bg-warningHover',
        },
      },
    },
  )
}

function Radio(props: Radio.Props) {
  const { children, icon, onChange, ...rest } = props
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
    <label
      {...(rest.checked ? { 'data-checked': true } : {})}
      {...(rest.disabled ? { 'data-disabled': true } : {})}
      className="-tracking-[0.448px] flex flex-1 items-center gap-2 rounded-full border border-gray5 p-2.5 font-medium text-[16px] text-gray12 leading-none not-data-checked:not-data-disabled:hover:bg-white data-disabled:cursor-not-allowed data-checked:border-blue9 data-checked:bg-blue3 dark:not-data-disabled:not-data-checked:hover:bg-gray3"
    >
      <Ariakit.VisuallyHidden>
        <Ariakit.Radio {...rest} onChange={() => onChange(props.value)} />
      </Ariakit.VisuallyHidden>
      <div className="w-5">{icon}</div>
      <span>{children}</span>
    </label>
  )
}
declare namespace Radio {
  type Props = React.PropsWithChildren<
    Omit<Ariakit.RadioProps, 'onChange'> & {
      icon: React.ReactElement
      onChange: (value: Radio.Props['value']) => void
      value: 'wagmi' | 'privy' | 'rainbowkit'
    }
  >
}

function WagmiLogo() {
  return (
    <svg
      aria-hidden="true"
      className="text-[#1B1B1B] dark:text-white"
      fill="none"
      height="auto"
      viewBox="0 0 24 11"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M2.67052 6.6763C2.67052 7.41374 3.26834 8.01156 4.00578 8.01156H6.6763C7.41374 8.01156 8.01156 7.41374 8.01156 6.6763L8.01156 1.33526C8.01156 0.597817 8.60938 0 9.34682 0C10.0843 0 10.6821 0.597816 10.6821 1.33526V6.6763C10.6821 7.41374 11.2799 8.01156 12.0173 8.01156H14.6879C15.4253 8.01156 16.0231 7.41374 16.0231 6.6763V1.33526C16.0231 0.597816 16.6209 0 17.3584 0C18.0958 0 18.6936 0.597817 18.6936 1.33526V9.34682C18.6936 10.0843 18.0958 10.6821 17.3584 10.6821H1.33526C0.597816 10.6821 0 10.0843 0 9.34682L4.76837e-07 1.33526C5.21541e-07 0.597817 0.597817 0 1.33526 0C2.0727 0 2.67052 0.597816 2.67052 1.33526L2.67052 6.6763ZM21.6185 11C22.6018 11 23.3988 10.2029 23.3988 9.21965C23.3988 8.23639 22.6018 7.43931 21.6185 7.43931C20.6352 7.43931 19.8382 8.23639 19.8382 9.21965C19.8382 10.2029 20.6352 11 21.6185 11Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

function PrivyLogo() {
  return (
    <svg
      aria-hidden="true"
      className="text-[currentColor] dark:text-white"
      fill="none"
      height="auto"
      viewBox="0 0 21 20"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 15.4955C15.4176 15.4955 19 12.0261 19 7.74775C19 3.46944 15.4176 0 11 0C6.58239 0 3 3.46944 3 7.74775C3 12.0261 6.58239 15.4955 11 15.4955Z"
        fill="currentColor"
      />
      <path
        d="M11 20C14.0192 20 16.4672 19.501 16.4672 18.889C16.4672 18.2769 14.0208 17.7779 11 17.7779C7.97919 17.7779 5.53279 18.2769 5.53279 18.889C5.53279 19.501 7.97919 20 11 20Z"
        fill="currentColor"
      />
    </svg>
  )
}

function RainbowLogo() {
  return (
    <svg
      aria-hidden="true"
      className="rounded-sm"
      fill="none"
      height="auto"
      viewBox="0 0 120 120"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M120 0H0V120H120V0Z" fill="url(#paint0_linear_681_14)" />
      <path
        d="M20 38H26C56.9279 38 82 63.0721 82 94V100H94C97.3137 100 100 97.3137 100 94C100 53.1309 66.8691 20 26 20C22.6863 20 20 22.6863 20 26V38Z"
        fill="url(#paint1_radial_681_14)"
      />
      <path
        d="M84 94H100C100 97.3137 97.3137 100 94 100H84V94Z"
        fill="url(#paint2_linear_681_14)"
      />
      <path
        d="M26 20V36H20V26C20 22.6863 22.6863 20 26 20Z"
        fill="url(#paint3_linear_681_14)"
      />
      <path
        d="M20 36H26C58.0325 36 84 61.9675 84 94V100H66V94C66 71.9086 48.0914 54 26 54H20V36Z"
        fill="url(#paint4_radial_681_14)"
      />
      <path d="M68 94H84V100H68V94Z" fill="url(#paint5_linear_681_14)" />
      <path d="M20 52V36H26V52H20Z" fill="url(#paint6_linear_681_14)" />
      <path
        d="M20 62C20 65.3137 22.6863 68 26 68C40.3594 68 52 79.6406 52 94C52 97.3137 54.6863 100 58 100H68V94C68 70.804 49.196 52 26 52H20V62Z"
        fill="url(#paint7_radial_681_14)"
      />
      <path
        d="M52 94H68V100H58C54.6863 100 52 97.3137 52 94Z"
        fill="url(#paint8_radial_681_14)"
      />
      <path
        d="M26 68C22.6863 68 20 65.3137 20 62V52H26V68Z"
        fill="url(#paint9_radial_681_14)"
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint0_linear_681_14"
          x1="60"
          x2="60"
          y1="0"
          y2="120"
        >
          <stop stopColor="#174299" />
          <stop offset="1" stopColor="#001E59" />
        </linearGradient>
        <radialGradient
          cx="0"
          cy="0"
          gradientTransform="translate(26 94) rotate(-90) scale(74)"
          gradientUnits="userSpaceOnUse"
          id="paint1_radial_681_14"
          r="1"
        >
          <stop offset="0.770277" stopColor="#FF4000" />
          <stop offset="1" stopColor="#8754C9" />
        </radialGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint2_linear_681_14"
          x1="83"
          x2="100"
          y1="97"
          y2="97"
        >
          <stop stopColor="#FF4000" />
          <stop offset="1" stopColor="#8754C9" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint3_linear_681_14"
          x1="23"
          x2="23"
          y1="20"
          y2="37"
        >
          <stop stopColor="#8754C9" />
          <stop offset="1" stopColor="#FF4000" />
        </linearGradient>
        <radialGradient
          cx="0"
          cy="0"
          gradientTransform="translate(26 94) rotate(-90) scale(58)"
          gradientUnits="userSpaceOnUse"
          id="paint4_radial_681_14"
          r="1"
        >
          <stop offset="0.723929" stopColor="#FFF700" />
          <stop offset="1" stopColor="#FF9901" />
        </radialGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint5_linear_681_14"
          x1="68"
          x2="84"
          y1="97"
          y2="97"
        >
          <stop stopColor="#FFF700" />
          <stop offset="1" stopColor="#FF9901" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint6_linear_681_14"
          x1="23"
          x2="23"
          y1="52"
          y2="36"
        >
          <stop stopColor="#FFF700" />
          <stop offset="1" stopColor="#FF9901" />
        </linearGradient>
        <radialGradient
          cx="0"
          cy="0"
          gradientTransform="translate(26 94) rotate(-90) scale(42)"
          gradientUnits="userSpaceOnUse"
          id="paint7_radial_681_14"
          r="1"
        >
          <stop offset="0.59513" stopColor="#00AAFF" />
          <stop offset="1" stopColor="#01DA40" />
        </radialGradient>
        <radialGradient
          cx="0"
          cy="0"
          gradientTransform="translate(51 97) scale(17 45.3333)"
          gradientUnits="userSpaceOnUse"
          id="paint8_radial_681_14"
          r="1"
        >
          <stop stopColor="#00AAFF" />
          <stop offset="1" stopColor="#01DA40" />
        </radialGradient>
        <radialGradient
          cx="0"
          cy="0"
          gradientTransform="translate(23 69) rotate(-90) scale(17 322.37)"
          gradientUnits="userSpaceOnUse"
          id="paint9_radial_681_14"
          r="1"
        >
          <stop stopColor="#00AAFF" />
          <stop offset="1" stopColor="#01DA40" />
        </radialGradient>
      </defs>
    </svg>
  )
}

function Exp1Token() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="auto"
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

function useIsMounted() {
  const isMounted = React.useRef(false)

  React.useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  return React.useCallback(() => isMounted.current, [])
}

function usePortoConnector() {
  const connectors = useConnectors()
  return connectors.find((connector) => connector.id === 'xyz.ithaca.porto')!
}

function createUseSendCalls<variables>(
  getCalls: (
    variables: variables,
  ) => Schema.ExtractParams<RpcSchema.Schema, 'wallet_sendCalls'>[0]['calls'],
) {
  return (parameters: Parameters<typeof useMutation>[0]) => {
    const { address, connector } = useAccount()
    return useMutation({
      ...parameters,
      async mutationFn(variables: variables) {
        const provider = (await connector?.getProvider()) as
          | Provider
          | undefined
        if (!provider) throw new Error('connector not connected')
        return provider.request({
          method: 'wallet_sendCalls',
          params: [
            {
              calls: getCalls(variables),
              from: address,
              version: '1',
            },
          ],
        })
      },
    })
  }
}

export namespace ValueFormatter {
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
