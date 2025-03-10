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
            className="-tracking-[0.42px] h-10.5 w-full rounded-[10px] border border-gray5 px-3 py-3 font-medium text-[15px] text-gray12 [appearance:textfield] placeholder:text-gray8"
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

            <Ariakit.Select className="-tracking-[0.42px] h-10.5 w-full rounded-[10px] border border-gray5 font-medium text-[15px] text-gray12 lg:w-[118px]">
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
          disabled={status === 'pending'}
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
  const [connector] = useConnectors()

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
        onClick={() =>
          connect.mutateAsync({
            connector: connector!,
            createAccount: true,
          })
        }
        className="flex-grow"
        variant="accent"
      >
        Sign up
      </Button>

      <Button
        onClick={() => connect.mutate({ connector: connector! })}
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
  const [connector] = useConnectors()

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
        onClick={() =>
          connect.mutateAsync({
            connector: connector!,
            createAccount: true,
          })
        }
        className="flex-grow"
        variant="accent"
      >
        Sign up
      </Button>

      <Button
        onClick={() => connect.mutate({ connector: connector! })}
        className="flex-grow"
        variant="invert"
      >
        Sign in
      </Button>
    </div>
  )
}

function PrivyDemo() {
  const account = useAccount()

  const connect = Hooks.useConnect()
  const [connector] = useConnectors()

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
        onClick={() =>
          connect.mutateAsync({
            connector: connector!,
            createAccount: true,
          })
        }
        className="flex-grow"
        variant="accent"
      >
        Sign up
      </Button>

      <Button
        onClick={() => connect.mutate({ connector: connector! })}
        className="flex-grow"
        variant="invert"
      >
        Sign in
      </Button>
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
      className="text-[#010110] dark:text-white"
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
