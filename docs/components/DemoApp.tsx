import * as Ariakit from '@ariakit/react'
import { type VariantProps, cva, cx } from 'cva'
import { AbiFunction, type Address, Value } from 'ox'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import {
  useAccount,
  useBlockNumber,
  useConnectors,
  useReadContract,
} from 'wagmi'
import { useCallsStatus, useSendCalls } from 'wagmi/experimental'
import LucideInfo from '~icons/lucide/info'
import LucidePictureInPicture2 from '~icons/lucide/picture-in-picture-2'

import { exp1Config, exp2Config } from '../generated'

export function DemoApp() {
  const isMountedFn = useIsMounted()
  const [provider, setProvider] = React.useState<
    'wagmi' | 'privy' | 'rainbowkit'
  >('wagmi')

  const { address, status } = useAccount()

  const { data: blockNumber } = useBlockNumber({
    watch: status === 'connected',
  })
  const { data: exp1Balance, refetch: expBalanceRefetch } = useReadContract({
    ...exp1Config,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: Boolean(address),
    },
  })
  const { data: exp2Balance, refetch: exp2BalanceRefetch } = useReadContract({
    ...exp2Config,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: Boolean(address),
    },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    expBalanceRefetch()
    exp2BalanceRefetch()
  }, [blockNumber])

  const mint = useSendCalls({
    mutation: {
      onError(error) {
        console.error(error)
      },
      onSuccess() {
        setTimeout(() => mint.reset(), 2_000)
      },
    },
  })
  const { isLoading: mintIsLoading, isSuccess: mintIsSuccess } = useCallsStatus(
    {
      id: mint.data as string,
      query: {
        enabled: !!mint.data,
        refetchInterval({ state }) {
          if (state.data?.status === 'CONFIRMED') return false
          return 1_000
        },
      },
    },
  )

  if (!isMountedFn()) return null

  return (
    <div className="mx-auto my-8 flex max-w-[1060px] flex-col gap-9">
      <header>
        <div className="mb-3.5 flex items-center justify-start gap-2.5">
          <h1 className="-tracking-[1.064px] order-1 font-medium text-[28px] leading-none">
            Demo
          </h1>
          <PortoLogo />
        </div>

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
            <h3 className="-tracking-[0.364px] w-fit! rounded-full bg-gray4 px-2.5 py-1.5 font-medium text-[13px] text-black leading-[16px] opacity-50 dark:text-white">
              Select your provider
            </h3>

            <Ariakit.RadioProvider>
              <Ariakit.RadioGroup>
                <div className="mt-4 flex flex-col gap-2">
                  <Radio
                    checked={provider === 'wagmi'}
                    value="wagmi"
                    icon={<WagmiLogo />}
                    onChange={setProvider}
                    disabled={Boolean(address)}
                  >
                    Wagmi
                  </Radio>
                  <Radio
                    checked={provider === 'privy'}
                    value="privy"
                    icon={<PrivyLogo />}
                    onChange={setProvider}
                    disabled={Boolean(address)}
                  >
                    Privy
                  </Radio>
                  <Radio
                    checked={provider === 'rainbowkit'}
                    value="rainbowkit"
                    icon={<RainbowLogo />}
                    onChange={setProvider}
                    disabled={Boolean(address)}
                  >
                    RainbowKit
                  </Radio>
                </div>
              </Ariakit.RadioGroup>
            </Ariakit.RadioProvider>

            <div className="-tracking-[0.392px] mt-5 font-medium text-[14px] text-gray9 leading-none">
              Don’t see your provider?{' '}
              <a href="#TODO" className="text-blue9">
                Reach out →
              </a>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="-tracking-[0.364px] w-fit! rounded-full bg-gray4 px-2.5 py-1.5 font-medium text-[13px] text-black leading-[16px] opacity-50 dark:text-white">
              Start interacting
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

        <div className="h-fit flex-1 rounded-2xl bg-gray3 px-4 pt-4 pb-4 lg:px-9 lg:pt-6.5 lg:pb-9">
          <div className="flex justify-between">
            <h3 className="-tracking-[0.364px] w-fit! rounded-full bg-gray5 px-2.5 py-1.5 font-medium text-[13px] text-black leading-[16px] opacity-50 dark:text-white">
              Your application
            </h3>

            <div className="flex gap-1">
              <div className="-tracking-[0.392px] flex gap-1.25 rounded-full bg-gray1 px-2.5 py-1.5 font-medium text-[14px] leading-[17px]">
                <span className="opacity-30">Balance</span>
                <span>
                  <span className="text-black dark:text-white">
                    {exp1Balance ? Value.formatEther(exp1Balance) : 0}
                  </span>{' '}
                  <span className="text-gray11">EXP</span>
                </span>
              </div>

              <button
                disabled={Boolean(
                  status !== 'connected' ||
                    mint.isPending ||
                    mintIsLoading ||
                    mintIsSuccess,
                )}
                className={cva(
                  '-tracking-[0.25px] flex gap-1.25 rounded-full px-2.5 py-1.5 font-medium text-[14px] leading-[17px] disabled:cursor-not-allowed',
                  {
                    variants: {
                      status: {
                        default:
                          'bg-accent text-white hover:not-disabled:not-active:bg-accentHover',
                        pending: 'cursor-wait bg-gray4 text-gray10',
                        success: 'bg-green4 text-green9',
                      },
                    },
                    defaultVariants: {
                      status: 'default',
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
                type="submit"
                onClick={() => {
                  mint.sendCalls({
                    calls: [
                      {
                        to: exp1Config.address,
                        data: AbiFunction.encodeData(
                          AbiFunction.fromAbi(exp1Config.abi, 'mint'),
                          [address!, Value.fromEther('10')],
                        ),
                      },
                    ],
                  })
                }}
              >
                {mint.isPending || mintIsLoading ? 'Minting' : 'Mint'}
              </button>
            </div>
          </div>

          <div className="mt-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-5">
                <Card title="Mint" description="TODO">
                  <MintDemo address={address} exp1Balance={exp1Balance} />
                </Card>
                <Card title="Pay" description="TODO">
                  <PayDemo
                    address={address}
                    exp1Balance={exp1Balance}
                    exp2Balance={exp2Balance}
                  />
                </Card>
              </div>

              <div className="flex flex-col gap-[18px]">
                <Card title="Swap" description="TODO">
                  <SwapDemo
                    address={address}
                    exp1Balance={exp1Balance}
                    exp2Balance={exp2Balance}
                  />
                </Card>
                <Card title="Limit" description="TODO">
                  <LimitDemo address={address} />
                </Card>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Card title="Sponsor" comingSoon />
              <Card title="Onramp" comingSoon />
              <Card title="Send" comingSoon />
              <Card title="Recover" comingSoon />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MintDemo(props: MintDemo.Props) {
  const { address, exp1Balance } = props

  const mint = useSendCalls({
    mutation: {
      onSuccess() {
        setTimeout(() => mint.reset(), 2_000)
      },
    },
  })
  const { isLoading: mintIsLoading, isSuccess: mintIsSuccess } = useCallsStatus(
    {
      id: mint.data as string,
      query: {
        enabled: !!mint.data,
        refetchInterval({ state }) {
          if (state.data?.status === 'CONFIRMED') return false
          return 1_000
        },
      },
    },
  )

  const status =
    mint.isPending || mintIsLoading
      ? 'pending'
      : mintIsSuccess
        ? 'success'
        : 'default'

  return (
    <div className="mt-[3px] flex flex-col gap-3 pb-[18px]">
      <div className="-tracking-[0.25px] text-center font-medium text-[13px] text-gray9 leading-[16px]">
        {(() => {
          if (!exp1Balance || exp1Balance === 0n)
            return 'You do not have any EXP'
          return (
            <span>
              You have{' '}
              <span className="text-gray12">
                {Value.formatEther(exp1Balance)}
              </span>{' '}
              EXP
            </span>
          )
        })()}
      </div>

      <MintButton
        disabled={!address}
        status={status}
        mint={() => {
          mint.sendCalls({
            calls: [
              {
                to: exp1Config.address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Config.abi, 'mint'),
                  [address!, Value.fromEther('10')],
                ),
              },
            ],
          })
        }}
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
  }
}

function MintButton(props: MintButton.Props) {
  const { disabled, mint, status } = props
  return (
    <button
      disabled={disabled}
      type="button"
      className={buttonClassName({
        variant: status === 'default' ? 'invert' : status,
      })}
      onClick={() => mint()}
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
              <span>100</span>{' '}
              <span className="text-whiteA8 dark:text-blackA8">EXP</span>
            </span>
          </span>
        )
      })()}
    </button>
  )
}
declare namespace MintButton {
  type Props = {
    disabled?: boolean | undefined
    mint: () => void
    status: 'default' | 'pending' | 'success'
  }
}

function SwapDemo(props: SwapDemo.Props) {
  const { address, exp1Balance, exp2Balance } = props

  const [fromSymbol, setFromSymbol] = React.useState<'exp1' | 'exp2'>('exp1')
  const [fromValue, setFromValue] = React.useState<string | undefined>('')
  const [toValue, setToValue] = React.useState<string | undefined>('')

  const mint = useSendCalls({
    mutation: {
      onSuccess() {
        setTimeout(() => mint.reset(), 2_000)
      },
    },
  })
  const { isLoading: mintIsLoading, isSuccess: mintIsSuccess } = useCallsStatus(
    {
      id: mint.data as string,
      query: {
        enabled: !!mint.data,
        refetchInterval({ state }) {
          if (state.data?.status === 'CONFIRMED') return false
          return 1_000
        },
      },
    },
  )

  const swap = useSendCalls({
    mutation: {
      onSuccess() {
        setTimeout(() => mint.reset(), 2_000)
      },
    },
  })
  const { isLoading: swapIsLoading, isSuccess: swapIsSuccess } = useCallsStatus(
    {
      id: swap.data as string,
      query: {
        enabled: !!swap.data,
        refetchInterval({ state }) {
          if (state.data?.status === 'CONFIRMED') return false
          return 1_000
        },
      },
    },
  )

  const mintStatus =
    mint.isPending || mintIsLoading
      ? 'pending'
      : mintIsSuccess
        ? 'success'
        : 'default'
  const swapStatus =
    swap.isPending || swapIsLoading
      ? 'pending'
      : swapIsSuccess
        ? 'success'
        : 'default'

  const from = {
    symbol: fromSymbol,
    balance: fromSymbol === 'exp1' ? exp1Balance : exp2Balance,
    value: fromValue,
    icon: fromSymbol === 'exp1' ? <Exp1Token /> : <Exp2Token />,
  }
  const to = {
    symbol: fromSymbol === 'exp1' ? 'exp2' : 'exp1',
    balance: fromSymbol === 'exp1' ? exp2Balance : exp1Balance,
    value: toValue,
    icon: fromSymbol === 'exp1' ? <Exp2Token /> : <Exp1Token />,
  }

  const noFunds = (exp1Balance ?? 0n) === 0n && (exp2Balance ?? 0n) === 0n

  return (
    <form
      className="mt-2 pb-4"
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const amount = formData.get('from') as string

        if (fromSymbol === 'exp1')
          swap.sendCalls({
            calls: [
              {
                to: exp1Config.address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp1Config.abi, 'swap'),
                  [exp1Config.address, address!, Value.fromEther(amount)],
                ),
              },
            ],
          })
        else if (fromSymbol === 'exp2')
          swap.sendCalls({
            calls: [
              {
                to: exp2Config.address,
                data: AbiFunction.encodeData(
                  AbiFunction.fromAbi(exp2Config.abi, 'swap'),
                  [exp2Config.address, address!, Value.fromEther(amount)],
                ),
              },
            ],
          })
      }}
    >
      <div
        className={cx(
          'relative mb-2 flex items-center justify-center gap-1',
          noFunds && 'opacity-50',
        )}
      >
        <div className="relative flex flex-1 items-center">
          <input
            className="-tracking-[0.42px] h-10.5 w-full rounded-[10px] border border-gray5 py-3 ps-3 pe-[76px] font-medium text-[15px] text-gray12 [appearance:textfield] placeholder:text-gray8"
            disabled={!address || noFunds || swapStatus === 'pending'}
            max={from.balance ? Value.formatEther(from.balance) : 0}
            min="0"
            placeholder="0.0"
            name="from"
            required
            step="any"
            type="number"
            value={from.value}
            onChange={(e) => {
              const value = e.target.value
              const scalar = fromSymbol === 'exp1' ? 0.01 : 100
              setFromValue(value)
              setToValue(value ? (Number(value) * scalar).toString() : '')
            }}
          />
          <div className="absolute end-4 flex items-center gap-1">
            <div className="size-4">{from.icon}</div>
            <span className="-tracking-[0.25px] font-medium text-[13px] text-gray9 uppercase tabular-nums leading-none">
              {from.symbol}
            </span>
          </div>
        </div>

        <div className="relative flex flex-1 items-center">
          <input
            className="-tracking-[0.42px] h-10.5 w-full rounded-[10px] border border-gray5 py-3 ps-4 pe-[76px] font-medium text-[15px] text-gray12 [appearance:textfield] placeholder:text-gray8"
            disabled={!address || noFunds || swapStatus === 'pending'}
            placeholder="0.0"
            min="0"
            name="to"
            required
            step="any"
            type="number"
            value={to.value}
            onChange={(e) => {
              const value = e.target.value
              const scalar = fromSymbol === 'exp1' ? 100 : 0.01
              setToValue(value)
              setFromValue(value ? (Number(value) * scalar).toString() : '')
            }}
          />
          <div className="absolute end-3 flex items-center gap-1">
            <div className="size-4">{to.icon}</div>
            <span className="-tracking-[0.25px] font-medium text-[13px] text-gray9 uppercase tabular-nums leading-none">
              {to.symbol}
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={!address || noFunds || swapStatus === 'pending'}
          aria-label="Switch from and to inputs"
          className="absolute flex size-5.5 min-w-5.5 items-center justify-center rounded-full bg-gray4"
          onClick={() => {
            setFromSymbol((x) => (x === 'exp1' ? 'exp2' : 'exp1'))
            setFromValue(toValue)
            setToValue(fromValue)
          }}
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            className="size-3.5 text-gray9"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M5.25 10.5L8.75 7L5.25 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {noFunds ? (
        <MintButton
          disabled={!address}
          status={mintStatus}
          mint={() => {
            mint.sendCalls({
              calls: [
                {
                  to: exp1Config.address,
                  data: AbiFunction.encodeData(
                    AbiFunction.fromAbi(exp1Config.abi, 'mint'),
                    [address!, Value.fromEther('10')],
                  ),
                },
              ],
            })
          }}
        />
      ) : (
        <button
          className={buttonClassName({ variant: swapStatus })}
          disabled={swapStatus === 'pending'}
          type="submit"
        >
          {(() => {
            if (swapStatus === 'pending') return 'Swapping...'
            if (swapStatus === 'success') return 'Completed!'
            return 'Swap'
          })()}
        </button>
      )}

      <div className="-tracking-[0.25px] mt-3 flex h-[18.5px] items-center justify-between text-[13px]">
        <div className="text-gray9">Balance</div>
        <div className="flex items-center gap-2 text-gray10">
          <div>
            <span className={noFunds ? 'text-red10' : undefined}>
              {Value.formatEther(exp1Balance ?? 0n)}
            </span>{' '}
            <span>EXP</span>
          </div>
          <div className="h-[18.5px] w-px bg-gray6" />
          <div>
            <span className={noFunds ? 'text-red10' : undefined}>
              {Value.formatEther(exp2Balance ?? 0n)}
            </span>{' '}
            <span>EXP2</span>
          </div>
        </div>
      </div>
    </form>
  )
}
declare namespace SwapDemo {
  type Props = {
    address: Address.Address | undefined
    exp1Balance: bigint | undefined
    exp2Balance: bigint | undefined
  }
}

function PayDemo(props: PayDemo.Props) {
  const { address, exp1Balance, exp2Balance } = props

  const [symbol, setSymbol] = React.useState<'exp1' | 'exp2'>('exp1')
  const [value, setValue] = React.useState<string | undefined>('')
  const options = [
    { symbol: 'exp1', icon: <Exp1Token /> },
    { symbol: 'exp2', icon: <Exp2Token /> },
  ]
  const active = options.find((option) => option.symbol === symbol)!
  const balance = (symbol === 'exp1' ? exp1Balance : exp2Balance) ?? 0n

  const status = 'default' as 'default' | 'pending' | 'success'

  return (
    <div className="mt-3 flex flex-col pb-[19px]">
      <div className="flex items-end gap-3">
        <div className="flex max-w-[68px] flex-1 flex-col gap-2">
          <label
            htmlFor="amount"
            className="-tracking-[0.322px;] h-[14px] text-[11.5px] text-gray9 leading-none"
          >
            Amount
          </label>
          <input
            className="-tracking-[0.42px] h-10.5 w-full rounded-[10px] border border-gray5 px-3 py-3 font-medium text-[15px] text-gray12 [appearance:textfield] placeholder:text-gray8 disabled:cursor-not-allowed"
            disabled={!address}
            max={balance ? Value.formatEther(balance) : 0}
            min="0"
            placeholder="0.0"
            id="amount"
            name="amount"
            required
            step="any"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <Ariakit.SelectProvider
            value={symbol}
            setValue={(value) => setSymbol(value as typeof symbol)}
          >
            <Ariakit.SelectLabel className="-tracking-[0.322px;] h-[14px] text-[11.5px] text-gray9 leading-none">
              Select token
            </Ariakit.SelectLabel>

            <Ariakit.Select
              disabled={!address}
              className="-tracking-[0.42px] h-10.5 w-full rounded-[10px] border border-gray5 font-medium text-[15px] text-gray12 disabled:cursor-not-allowed lg:w-[118px]"
            >
              <div className="flex h-10.5 items-center gap-1.5 px-3">
                <div className="size-5">{active.icon}</div>
                <div className="-tracking-[0.42px] font-medium text-[15px] text-gray12 uppercase tabular-nums">
                  {active.symbol}
                </div>
                <div className="ms-auto flex size-5.5 items-center justify-center rounded-full bg-gray4">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3.5 5.25L7 8.75L10.5 5.25"
                      stroke="#8D8D8D"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </Ariakit.Select>

            <Ariakit.SelectPopover
              gutter={-42}
              className="overflow-hidden rounded-[10px] border border-gray5 bg-gray1"
              sameWidth
            >
              {options.map((option) => (
                <Ariakit.SelectItem
                  className="flex h-10.5 items-center gap-1.5 px-3 hover:bg-gray3"
                  value={option.symbol}
                  key={option.symbol}
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
        </div>

        <button
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
        </button>
      </div>

      <div className="-tracking-[0.25px] mt-5 flex h-[18.5px] items-center justify-between gap-3 text-[13px]">
        <div className="flex flex-1 justify-between">
          <div className="text-gray9">Fee</div>
          <div className="text-gray10">
            <span className="text-black tabular-nums dark:text-white">
              {Value.formatEther(balance)}
            </span>{' '}
            <span className="uppercase tabular-nums">{symbol}</span>
          </div>
        </div>

        <div className="h-[18.5px] w-px bg-gray6" />

        <div className="flex flex-1 justify-between">
          <div className="text-gray9">Balance</div>
          <div className="text-gray10">
            <span className="text-black tabular-nums dark:text-white">
              {Value.formatEther(balance)}
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
  }
}

function LimitDemo(props: LimitDemo.Props) {
  const { address } = props

  const [customize, setCustomize] = React.useState(false)
  const [value, setValue] = React.useState<string | undefined>('100')
  const symbol = 'exp1'

  const [duration, setDuration] = React.useState<'s' | 'm' | 'h' | 'd'>('m')
  const options = ['s', 'm', 'h', 'd'] as (typeof duration)[]

  if (customize)
    return (
      <form className="mt-1.5 flex flex-col gap-[11px] pb-[17px]">
        <div className="flex items-center gap-2.5">
          <div className="relative flex flex-1 items-center gap-2 lg:max-w-[79px]">
            <Ariakit.VisuallyHidden>
              <label htmlFor="amount">Amount</label>
            </Ariakit.VisuallyHidden>
            <input
              className="-tracking-[0.42px] h-9.5 w-full rounded-[10px] border border-gray5 ps-[28px] pe-3.25 text-right font-medium text-[15px] text-gray12 [appearance:textfield] placeholder:text-gray8"
              disabled={!address}
              min="0"
              placeholder="0.0"
              id="amount"
              name="amount"
              required
              step="any"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <div className="absolute start-2 size-4.5">
              <Exp1Token />
            </div>
          </div>

          <div className="-tracking-[0.42px] text-[15px] text-gray9">per</div>

          <Ariakit.RadioProvider>
            <Ariakit.RadioGroup className="flex flex-1 gap-[3px]">
              {options.map((option) => (
                // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
                <label
                  key={option}
                  {...(option === duration ? { 'data-checked': true } : {})}
                  className="-tracking-[0.42px] flex h-9.5 flex-1 items-center justify-center rounded-[10px] border border-gray5 px-3.5 text-[15px] text-gray9 data-checked:border-gray12 data-checked:bg-gray3 data-checked:text-gray12 lg:max-w-[36.5px]"
                >
                  <Ariakit.VisuallyHidden>
                    <Ariakit.Radio
                      value={duration}
                      onChange={() => setDuration(option)}
                    />
                  </Ariakit.VisuallyHidden>
                  <span>{option}</span>
                </label>
              ))}
            </Ariakit.RadioGroup>
          </Ariakit.RadioProvider>
        </div>

        <div className="flex gap-3">
          <button
            className={buttonClassName({
              size: 'medium',
              variant: 'secondary',
            })}
            onClick={() => setCustomize(false)}
            type="button"
          >
            Cancel
          </button>

          <button
            className={buttonClassName({ size: 'medium', variant: 'default' })}
            onClick={() => setCustomize(false)}
            type="button"
          >
            Save
          </button>
        </div>
      </form>
    )

  return (
    <div className="mt-1.5 flex flex-col gap-[11px] pb-[19px]">
      <div className="-tracking-[0.42px] flex h-9 items-center justify-center gap-1.5 rounded-[6px] bg-gray3 font-medium text-[15px]">
        <div className="mt-px size-4.5">
          <Exp1Token />
        </div>
        <div>
          <span>
            {value} <span className="uppercase">{symbol}</span>
          </span>{' '}
          <span className="text-gray9">per minute</span>
        </div>
      </div>

      <button
        disabled={!address}
        className={buttonClassName({ size: 'medium', variant: 'default' })}
        onClick={() => setCustomize(true)}
        type="button"
      >
        Customize
      </button>
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
    defaultVariants: {
      size: 'default',
      variant: 'default',
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
  return (
    <div className="flex gap-2">
      <div className="-tracking-[0.448px] flex h-9.5 flex-grow items-center justify-center gap-1.25 rounded-full bg-gray4 px-2.75 font-medium text-[16px] text-gray12 leading-none">
        <div className="flex size-6 items-center justify-center">{icon}</div>
        <div>
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      </div>
      <Button variant="destructive" onClick={() => disconnect.mutate({})}>
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
        icon={
          <div className="flex size-6 items-center justify-center rounded-full bg-blueA3 text-center">
            🌀
          </div>
        }
        address={account.address}
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

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => connect.mutateAsync({ connector, createAccount: true })}
        className="flex-grow"
        variant="accent"
      >
        Sign up
      </Button>

      <Button
        onClick={() => connect.mutate({ connector })}
        className="flex-grow"
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
        icon={
          <div className="flex size-6 items-center justify-center rounded-full bg-blueA3 text-center">
            🌀
          </div>
        }
        address={account.address}
      />
    )

  if (connect.isError || connect.isPending)
    return (
      <div className="flex min-h-[272px] flex-col items-center gap-2 rounded-3xl border border-transparent p-4 font-rk-sans shadow-md dark:border-[#2c2d31] dark:bg-[#1a1b1f]">
        <div className="mb-3 flex w-full">
          <button
            type="button"
            className="flex h-6.25 w-6.75 items-center justify-center text-blue9 transition-transform duration-125 ease-ease will-change-transform hover:scale-[1.1]"
            onClick={() => connect.reset()}
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
              type="button"
              onClick={() => connect.mutate(connect.variables)}
              className="mt-2 h-7 rounded-full bg-blue9 px-3 py-1 font-bold text-sm text-white uppercase leading-[18px] transition-transform duration-125 ease-ease will-change-transform hover:scale-[1.025]"
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
          type="button"
          onClick={() => connect.mutate({ connector })}
          className="flex w-full items-center gap-3 rounded-xl p-1.25 hover:bg-[#3C42421A] dark:hover:bg-[#E0E8FF1A]"
        >
          <img
            className="size-7 rounded-md"
            alt="Wallet icon"
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
        icon={
          <div className="flex size-6 items-center justify-center rounded-full bg-blueA3 text-center">
            🌀
          </div>
        }
        address={account.address}
      />
    )

  if (connect.isError || connect.isPending)
    return (
      <div className="flex flex-col rounded-3xl bg-white px-4 text-sm leading-[20px] shadow-md dark:bg-[#232325]">
        <div className="flex py-4">
          <button
            type="button"
            className="size-6 rounded-full bg-[#f5f5f5] p-1 opacity-60 dark:bg-[#3c3c39]"
            onClick={() => connect.reset()}
          >
            <Ariakit.VisuallyHidden>Back</Ariakit.VisuallyHidden>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              height="16px"
              width="16px"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative mx-auto flex size-20.5 items-center justify-center">
            <div
              className={cx(
                'h-full w-full animate-rotation rounded-[50%] border border-4 border-b-transparent transition-border-color duration-800',
                connect.isPending ? 'border-blue9' : 'border-red9',
              )}
            />
            <div
              className={cx(
                'absolute inset-0 flex items-center justify-center rounded-[50%] border border-4 transition-border-color duration-800',
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
                type="button"
                className="w-full cursor-not-allowed rounded-xl bg-[#f5f5f5] px-4 py-3 font-[425] text-[#919191] dark:bg-[#3e3e42] dark:text-[#969696]"
              >
                Connecting
              </button>
            )}
            {connect.isError && (
              <button
                type="button"
                className="w-full rounded-xl bg-blue9 px-4 py-3 font-[425] text-white transition-colors duration-200 hover:bg-blue8"
                onClick={() => connect.mutate(connect.variables)}
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
          width="100%"
          height="auto"
          viewBox="0 0 346 78"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M253.808 41.4359H252.758L239.096 1.81787H223.094V3.45587L242.366 58.7819H263.618L282.896 3.45587V1.81787H267.59L253.802 41.4359H253.808Z"
            fill="currentColor"
          />
          <path
            d="M218.834 1.81787H202.922V58.7759H218.834V1.81787Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M330.164 1.81215H330.176L316.388 41.4422H315.338L301.676 1.81815H285.674V3.46815L306.608 63.5762H286.784V76.7702H306.158C314.432 76.7702 320.876 73.9802 324.002 65.0762C324.422 63.8882 345.47 3.45615 345.47 3.45615V1.80615H330.164V1.81215Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M121.832 0.27002C114.596 0.27002 107.834 3.95402 103.616 10.878H102.638V1.87802H87.47V76.752H103.586V51.528H104.576C104.684 51.678 104.792 51.834 104.9 51.96C107.618 55.266 113.966 60.306 121.862 60.306C136.232 60.306 146.06 47.886 146.06 30.294C146.06 12.702 135.746 0.27002 121.832 0.27002ZM117.02 47.958C109.52 47.958 104.342 42.114 104.342 30.3C104.342 18.486 109.52 12.642 117.02 12.642C124.52 12.642 129.95 18.612 129.95 30.3C129.95 41.988 124.646 47.958 117.02 47.958Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M186.032 1.81201C178.562 1.81201 173.768 3.06001 170.966 10.878H170.006V1.81801H146.936V14.898H152.084C153.782 14.898 154.616 15.498 154.832 16.89V27.762H154.892V58.782H171.008V28.566C171.008 20.742 173.132 15.948 180.956 15.948H197.84V1.81201H186.038H186.032Z"
            fill="currentColor"
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
          type="button"
          onClick={() => connect.mutate({ connector })}
        >
          <img
            className="size-6 rounded-sm"
            alt="Wallet icon"
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
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 460 40"
          height="13"
          width="150"
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
      variants: {
        variant: {
          default:
            'text-primary bg-surface hover:not-active:bg-surfaceHover text-surface border border-surface',
          invert:
            'text-invert bg-invert hover:not-active:bg-invertHover text-invert',
          accent: 'text-white bg-accent hover:not-active:bg-accentHover',
          destructive:
            'text-destructive bg-destructive hover:not-active:bg-destructiveHover',
          success: 'text-white bg-success hover:not-active:bg-successHover',
          warning: 'text-white bg-warning hover:not-active:bg-warningHover',
        },
        disabled: {
          true: 'pointer-events-none opacity-50',
        },
        size: {
          default: 'h-9.5 px-5 -tracking-[0.448px] text-[16px] font-medium',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
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
      className="-tracking-[0.448px] flex w-full items-center gap-2 rounded-full border border-gray5 p-2.5 font-medium text-[16px] text-gray12 leading-none not-data-checked:not-data-disabled:hover:bg-white data-disabled:cursor-not-allowed data-checked:border-blue9 data-checked:bg-blue3 dark:not-data-disabled:not-data-checked:hover:bg-gray3"
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
      width="100%"
      height="auto"
      viewBox="0 0 24 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-[#1B1B1B] dark:text-white"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.67052 6.6763C2.67052 7.41374 3.26834 8.01156 4.00578 8.01156H6.6763C7.41374 8.01156 8.01156 7.41374 8.01156 6.6763L8.01156 1.33526C8.01156 0.597817 8.60938 0 9.34682 0C10.0843 0 10.6821 0.597816 10.6821 1.33526V6.6763C10.6821 7.41374 11.2799 8.01156 12.0173 8.01156H14.6879C15.4253 8.01156 16.0231 7.41374 16.0231 6.6763V1.33526C16.0231 0.597816 16.6209 0 17.3584 0C18.0958 0 18.6936 0.597817 18.6936 1.33526V9.34682C18.6936 10.0843 18.0958 10.6821 17.3584 10.6821H1.33526C0.597816 10.6821 0 10.0843 0 9.34682L4.76837e-07 1.33526C5.21541e-07 0.597817 0.597817 0 1.33526 0C2.0727 0 2.67052 0.597816 2.67052 1.33526L2.67052 6.6763ZM21.6185 11C22.6018 11 23.3988 10.2029 23.3988 9.21965C23.3988 8.23639 22.6018 7.43931 21.6185 7.43931C20.6352 7.43931 19.8382 8.23639 19.8382 9.21965C19.8382 10.2029 20.6352 11 21.6185 11Z"
        fill="currentColor"
      />
    </svg>
  )
}

function PrivyLogo() {
  return (
    <svg
      width="100%"
      height="auto"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-[currentColor] dark:text-white"
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
      className="rounded-sm"
      width="100%"
      height="auto"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
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
          id="paint0_linear_681_14"
          x1="60"
          y1="0"
          x2="60"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#174299" />
          <stop offset="1" stopColor="#001E59" />
        </linearGradient>
        <radialGradient
          id="paint1_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 94) rotate(-90) scale(74)"
        >
          <stop offset="0.770277" stopColor="#FF4000" />
          <stop offset="1" stopColor="#8754C9" />
        </radialGradient>
        <linearGradient
          id="paint2_linear_681_14"
          x1="83"
          y1="97"
          x2="100"
          y2="97"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF4000" />
          <stop offset="1" stopColor="#8754C9" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_681_14"
          x1="23"
          y1="20"
          x2="23"
          y2="37"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8754C9" />
          <stop offset="1" stopColor="#FF4000" />
        </linearGradient>
        <radialGradient
          id="paint4_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 94) rotate(-90) scale(58)"
        >
          <stop offset="0.723929" stopColor="#FFF700" />
          <stop offset="1" stopColor="#FF9901" />
        </radialGradient>
        <linearGradient
          id="paint5_linear_681_14"
          x1="68"
          y1="97"
          x2="84"
          y2="97"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF700" />
          <stop offset="1" stopColor="#FF9901" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_681_14"
          x1="23"
          y1="52"
          x2="23"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF700" />
          <stop offset="1" stopColor="#FF9901" />
        </linearGradient>
        <radialGradient
          id="paint7_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 94) rotate(-90) scale(42)"
        >
          <stop offset="0.59513" stopColor="#00AAFF" />
          <stop offset="1" stopColor="#01DA40" />
        </radialGradient>
        <radialGradient
          id="paint8_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(51 97) scale(17 45.3333)"
        >
          <stop stopColor="#00AAFF" />
          <stop offset="1" stopColor="#01DA40" />
        </radialGradient>
        <radialGradient
          id="paint9_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(23 69) rotate(-90) scale(17 322.37)"
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
      width="100%"
      height="auto"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="10.5" fill="#0588F0" />
      <path
        d="M14.008 10.4885C14.3539 10.3849 14.7255 10.532 14.9079 10.8447L16.9254 14.3017C17.1804 14.7387 16.8665 15.2887 16.362 15.2887H5.96663C5.4365 15.2887 5.12732 14.6879 5.43403 14.2538L6.35149 12.9551C6.45278 12.8118 6.59896 12.7066 6.76672 12.6563L14.008 10.4885Z"
        fill="white"
      />
      <path
        opacity="0.75"
        d="M10.2735 5.61316C10.4225 5.34666 10.8216 5.41172 10.8789 5.71184L11.7308 10.1708C11.7747 10.401 11.6389 10.6275 11.4156 10.6961L7.38552 11.9343C7.1039 12.0208 6.86113 11.7182 7.00526 11.4604L10.2735 5.61316Z"
        fill="white"
      />
      <path
        opacity="0.5"
        d="M11.3033 5.46716C11.2614 5.24947 11.6099 5.13942 11.7206 5.33129L14.1689 9.63009C14.2331 9.74146 14.1753 9.88374 14.0518 9.91818L12.5692 10.3317C12.3856 10.3829 12.2268 10.2736 12.1907 10.0857L11.3033 5.46716Z"
        fill="white"
      />
    </svg>
  )
}

function Exp2Token() {
  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="auto"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="10.5" fill="#8774f1" />
      <path
        d="M14.008 10.4885C14.3539 10.3849 14.7255 10.532 14.9079 10.8447L16.9254 14.3017C17.1804 14.7387 16.8665 15.2887 16.362 15.2887H5.96663C5.4365 15.2887 5.12732 14.6879 5.43403 14.2538L6.35149 12.9551C6.45278 12.8118 6.59896 12.7066 6.76672 12.6563L14.008 10.4885Z"
        fill="white"
      />
      <path
        opacity="0.75"
        d="M10.2735 5.61316C10.4225 5.34666 10.8216 5.41172 10.8789 5.71184L11.7308 10.1708C11.7747 10.401 11.6389 10.6275 11.4156 10.6961L7.38552 11.9343C7.1039 12.0208 6.86113 11.7182 7.00526 11.4604L10.2735 5.61316Z"
        fill="white"
      />
      <path
        opacity="0.5"
        d="M11.3033 5.46716C11.2614 5.24947 11.6099 5.13942 11.7206 5.33129L14.1689 9.63009C14.2331 9.74146 14.1753 9.88374 14.0518 9.91818L12.5692 10.3317C12.3856 10.3829 12.2268 10.2736 12.1907 10.0857L11.3033 5.46716Z"
        fill="white"
      />
    </svg>
  )
}

function PortoLogo() {
  return (
    <div className="h-8">
      <svg
        className="dark:hidden"
        aria-hidden="true"
        width="auto"
        height="100%"
        viewBox="0 0 95 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.5676 0.959473C2.9404 0.959473 0 3.89987 0 7.52697V75.3919C0 77.407 1.6336 79.041 3.6487 79.041H91.216C93.231 79.041 94.865 77.407 94.865 75.3919V7.52697C94.865 3.89987 91.924 0.959473 88.297 0.959473H6.5676ZM78.4461 7.52697C73.4084 7.52697 69.3245 11.6109 69.3245 16.6487C69.3245 21.6864 73.4084 25.7703 78.4461 25.7703H79.1758C84.2136 25.7703 88.297 21.6864 88.297 16.6487C88.297 11.6109 84.2136 7.52697 79.1758 7.52697H78.4461Z"
          fill="#CCCCCC"
        />
        <mask
          id="mask0_684_30"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="95"
          height="80"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.5676 0.959473C2.9404 0.959473 0 3.89987 0 7.52697V75.3919C0 77.407 1.6336 79.041 3.6487 79.041H91.216C93.231 79.041 94.865 77.407 94.865 75.3919V7.52697C94.865 3.89987 91.924 0.959473 88.297 0.959473H6.5676ZM78.4461 7.52697C73.4084 7.52697 69.3245 11.6109 69.3245 16.6487C69.3245 21.6864 73.4084 25.7703 78.4461 25.7703H79.1758C84.2136 25.7703 88.297 21.6864 88.297 16.6487C88.297 11.6109 84.2136 7.52697 79.1758 7.52697H78.4461Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_684_30)">
          <path
            d="M0.000213623 37.446C0.000213623 35.431 1.63371 33.7974 3.64881 33.7974H91.216C93.231 33.7974 94.865 35.431 94.865 37.446V75.392C94.865 77.4071 93.231 79.0411 91.216 79.0411H3.64881C1.63371 79.0411 0.000213623 77.4071 0.000213623 75.392V37.446Z"
            fill="#A3A3A3"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.6488 30.8784H91.216C94.844 30.8784 97.784 33.8188 97.784 37.4459V75.3919C97.784 79.019 94.844 81.959 91.216 81.959H3.6488C0.021699 81.959 -2.9187 79.019 -2.9187 75.3919V37.4459C-2.9187 33.8188 0.021699 30.8784 3.6488 30.8784ZM3.6488 33.7973C1.6337 33.7973 0.000199318 35.4309 0.000199318 37.4459V75.3919C0.000199318 77.407 1.6337 79.041 3.6488 79.041H91.216C93.231 79.041 94.865 77.407 94.865 75.3919V37.4459C94.865 35.4309 93.231 33.7973 91.216 33.7973H3.6488Z"
            fill="#CCCCCC"
          />
          <path
            d="M0.000213623 52.7703C0.000213623 50.7552 1.63371 49.1216 3.64881 49.1216H91.216C93.231 49.1216 94.865 50.7552 94.865 52.7703V75.3919C94.865 77.407 93.231 79.041 91.216 79.041H3.64881C1.63371 79.041 0.000213623 77.407 0.000213623 75.3919V52.7703Z"
            fill="#626262"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.6488 46.2026H91.216C94.844 46.2026 97.784 49.143 97.784 52.7702V75.3918C97.784 79.0189 94.844 81.9589 91.216 81.9589H3.6488C0.021699 81.9589 -2.9187 79.0189 -2.9187 75.3918V52.7702C-2.9187 49.143 0.021699 46.2026 3.6488 46.2026ZM3.6488 49.1215C1.6337 49.1215 0.000199318 50.7551 0.000199318 52.7702V75.3918C0.000199318 77.4069 1.6337 79.0409 3.6488 79.0409H91.216C93.231 79.0409 94.865 77.4069 94.865 75.3918V52.7702C94.865 50.7551 93.231 49.1215 91.216 49.1215H3.6488Z"
            fill="#CCCCCC"
          />
          <path
            d="M0.000213623 68.0945C0.000213623 66.0794 1.63371 64.4458 3.64881 64.4458H91.216C93.231 64.4458 94.865 66.0794 94.865 68.0945V75.3918C94.865 77.4069 93.231 79.0409 91.216 79.0409H3.64881C1.63371 79.0409 0.000213623 77.4069 0.000213623 75.3918V68.0945Z"
            fill="#313131"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.6488 61.5271H91.216C94.844 61.5271 97.784 64.4675 97.784 68.0947V75.392C97.784 79.0191 94.844 81.9591 91.216 81.9591H3.6488C0.021699 81.9591 -2.9187 79.0191 -2.9187 75.392V68.0947C-2.9187 64.4675 0.021699 61.5271 3.6488 61.5271ZM3.6488 64.446C1.6337 64.446 0.000199318 66.0796 0.000199318 68.0947V75.392C0.000199318 77.4071 1.6337 79.0411 3.6488 79.0411H91.216C93.231 79.0411 94.865 77.4071 94.865 75.392V68.0947C94.865 66.0796 93.231 64.446 91.216 64.446H3.6488Z"
            fill="#CCCCCC"
          />
        </g>
      </svg>

      <svg
        className="hidden dark:block"
        aria-hidden="true"
        width="auto"
        height="100%"
        viewBox="0 0 95 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.5676 0.959473C2.9404 0.959473 0 3.89987 0 7.52697V75.3919C0 77.407 1.6336 79.041 3.6487 79.041H91.216C93.231 79.041 94.865 77.407 94.865 75.3919V7.52697C94.865 3.89987 91.924 0.959473 88.297 0.959473H6.5676ZM78.4461 7.52697C73.4084 7.52697 69.3245 11.6109 69.3245 16.6487C69.3245 21.6864 73.4084 25.7703 78.4461 25.7703H79.1758C84.214 25.7703 88.297 21.6864 88.297 16.6487C88.297 11.6109 84.214 7.52697 79.1758 7.52697H78.4461Z"
          fill="#999999"
        />
        <mask
          id="mask0_684_45"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="95"
          height="80"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.5676 0.959473C2.9404 0.959473 0 3.89987 0 7.52697V75.3919C0 77.407 1.6336 79.041 3.6487 79.041H91.216C93.231 79.041 94.865 77.407 94.865 75.3919V7.52697C94.865 3.89987 91.924 0.959473 88.297 0.959473H6.5676ZM78.4461 7.52697C73.4084 7.52697 69.3245 11.6109 69.3245 16.6487C69.3245 21.6864 73.4084 25.7703 78.4461 25.7703H79.1758C84.214 25.7703 88.297 21.6864 88.297 16.6487C88.297 11.6109 84.214 7.52697 79.1758 7.52697H78.4461Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_684_45)">
          <path
            d="M0.000213623 37.446C0.000213623 35.431 1.63371 33.7974 3.64881 33.7974H91.216C93.231 33.7974 94.865 35.431 94.865 37.446V75.392C94.865 77.4071 93.231 79.0411 91.216 79.0411H3.64881C1.63371 79.0411 0.000213623 77.4071 0.000213623 75.392V37.446Z"
            fill="#CBCBCB"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.6488 30.8784H91.216C94.844 30.8784 97.784 33.8188 97.784 37.4459V75.3919C97.784 79.019 94.844 81.959 91.216 81.959H3.6488C0.021699 81.959 -2.9187 79.019 -2.9187 75.3919V37.4459C-2.9187 33.8188 0.021699 30.8784 3.6488 30.8784ZM3.6488 33.7973C1.6337 33.7973 0.000199318 35.4309 0.000199318 37.4459V75.3919C0.000199318 77.407 1.6337 79.041 3.6488 79.041H91.216C93.231 79.041 94.865 77.407 94.865 75.3919V37.4459C94.865 35.4309 93.231 33.7973 91.216 33.7973H3.6488Z"
            fill="#999999"
          />
          <path
            d="M0.000213623 52.7703C0.000213623 50.7552 1.63371 49.1216 3.64881 49.1216H91.216C93.231 49.1216 94.865 50.7552 94.865 52.7703V75.3919C94.865 77.407 93.231 79.041 91.216 79.041H3.64881C1.63371 79.041 0.000213623 77.407 0.000213623 75.3919V52.7703Z"
            fill="#DDDDDD"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.6488 46.2026H91.216C94.844 46.2026 97.784 49.143 97.784 52.7702V75.3918C97.784 79.0189 94.844 81.9589 91.216 81.9589H3.6488C0.021699 81.9589 -2.9187 79.0189 -2.9187 75.3918V52.7702C-2.9187 49.143 0.021699 46.2026 3.6488 46.2026ZM3.6488 49.1215C1.6337 49.1215 0.000199318 50.7551 0.000199318 52.7702V75.3918C0.000199318 77.4069 1.6337 79.0409 3.6488 79.0409H91.216C93.231 79.0409 94.865 77.4069 94.865 75.3918V52.7702C94.865 50.7551 93.231 49.1215 91.216 49.1215H3.6488Z"
            fill="#999999"
          />
          <path
            d="M0.000213623 68.0945C0.000213623 66.0794 1.63371 64.4458 3.64881 64.4458H91.216C93.231 64.4458 94.865 66.0794 94.865 68.0945V75.3918C94.865 77.4069 93.231 79.0409 91.216 79.0409H3.64881C1.63371 79.0409 0.000213623 77.4069 0.000213623 75.3918V68.0945Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.6488 61.5271H91.216C94.844 61.5271 97.784 64.4675 97.784 68.0947V75.392C97.784 79.0191 94.844 81.9591 91.216 81.9591H3.6488C0.021699 81.9591 -2.9187 79.0191 -2.9187 75.392V68.0947C-2.9187 64.4675 0.021699 61.5271 3.6488 61.5271ZM3.6488 64.446C1.6337 64.446 0.000199318 66.0796 0.000199318 68.0947V75.392C0.000199318 77.4071 1.6337 79.0411 3.6488 79.0411H91.216C93.231 79.0411 94.865 77.4071 94.865 75.392V68.0947C94.865 66.0796 93.231 64.446 91.216 64.446H3.6488Z"
            fill="#999999"
          />
        </g>
      </svg>
    </div>
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
