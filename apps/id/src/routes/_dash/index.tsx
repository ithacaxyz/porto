import * as Ariakit from '@ariakit/react'
import { Toast } from '@porto/apps/components'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { type Address, Hex, Value } from 'ox'
import { Porto } from 'porto'
import { RelayActions, RelayClient, WalletActions } from 'porto/viem'
import * as React from 'react'
import { toast } from 'sonner'
import { encodeFunctionData, erc20Abi, zeroAddress } from 'viem'
import { useAccount, useSendCalls } from 'wagmi'
import { waitForCallsStatus } from 'wagmi/actions'

import * as Wagmi from '~/lib/Wagmi.ts'
import { StringFormatter, ValueFormatter } from '~/utils.ts'
import LucideChevronDown from '~icons/lucide/chevron-down'
import LucideClipboardPaste from '~icons/lucide/clipboard-paste'
import { config as portoConfig } from '../../lib/Porto.ts'

export const Route = createFileRoute('/_dash/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { address } = useAccount()

  const { data: balances } = useBalances({ address })
  const balancesMap = React.useMemo(() => {
    return new Map<string, NonNullable<typeof balances>[number][1]>(balances)
  }, [balances])

  const sendCalls = useSendCalls({
    mutation: {
      onError(error) {
        const userRejected = error.message
          .toLowerCase()
          .includes('user rejected')
        if (userRejected) return
        const notAllowed = error.message.toLowerCase().includes('not allowed')
        toast.custom(
          (t) => (
            <Toast
              className={t}
              description={
                notAllowed
                  ? 'Transaction submission was cancelled.'
                  : 'You do not have enough balance to complete this transaction.'
              }
              kind={notAllowed ? 'warn' : 'error'}
              title={
                notAllowed ? 'Transaction cancelled' : 'Transaction failed'
              }
            />
          ),

          { duration: 3_500 },
        )
      },
    },
  })

  const form = Ariakit.useFormStore({
    defaultValues: {
      recipient: '',
      sourceChainId: '1',
      symbol: 'ETH',
      targetChainId: '1',
      value: '',
    },
  })
  const formState = Ariakit.useStoreState(form)
  form.useSubmit(async (state) => {
    const sourceChainId = Number.parseInt(state.values.sourceChainId, 10) as
      | ChainId
      | 0
    const targetChainId = Number.parseInt(
      state.values.targetChainId,
      10,
    ) as ChainId
    type ChainId = (typeof Wagmi.config)['chains'][number]['id']

    const token = balancesMap
      .get(state.values.symbol)
      ?.find((balance) => balance.chainId === sourceChainId)
    if (!token) throw new Error(`token not found for chain ID ${sourceChainId}`)

    const to =
      sourceChainId === 0
        ? balancesMap
            .get(state.values.symbol)
            ?.find(
              (balance) => balance.chainId !== sourceChainId && balance.interop,
            )?.address
        : token.address
    if (!to)
      throw new Error(`interop address not found for ${state.values.symbol}`)

    const value = Value.from(state.values.value, token.decimals)
    await sendCalls.sendCallsAsync(
      {
        calls:
          to === zeroAddress
            ? [{ to: state.values.recipient as Address.Address, value }]
            : ([
                {
                  data: encodeFunctionData({
                    abi: erc20Abi,
                    args: [state.values.recipient as Address.Address, value],
                    functionName: 'transfer',
                  }),
                  to,
                },
              ] as const),
        capabilities: {
          feeToken: to,
          requiredFunds:
            sourceChainId === 0
              ? [
                  {
                    symbol: state.values.symbol,
                    value: state.values.value as `${number}`,
                  },
                ]
              : undefined,
        },
        chainId: targetChainId,
      },
      {
        async onSuccess(data) {
          const toastProps = { id: data.id }
          try {
            toast.custom(
              (t) => (
                <Toast
                  className={t}
                  description={`Sending ${state.values.value} ${state.values.symbol} to ${StringFormatter.truncate(state.values.recipient)} on ${state.values.targetChainId}`}
                  kind="pending"
                  title="Sending"
                />
              ),
              toastProps,
            )
            await waitForCallsStatus(Wagmi.config as never, { id: data.id })
            toast.custom(
              (t) => (
                <Toast
                  className={t}
                  description={`Sent ${state.values.value} ${state.values.symbol} to ${StringFormatter.truncate(state.values.recipient)} on ${state.values.targetChainId}`}
                  kind="success"
                  title="Sent"
                />
              ),
              toastProps,
            )
          } catch (error) {
            toast.custom(
              (t) => (
                <Toast
                  className={t}
                  description={`Failed to send ${state.values.value} ${state.values.symbol} to ${StringFormatter.truncate(state.values.recipient)} on ${state.values.targetChainId}`}
                  kind="error"
                  title="Send Failed"
                />
              ),
              toastProps,
            )
          }
        },
      },
    )
  })

  const selectedToken = React.useMemo(() => {
    if (!balancesMap?.get) return undefined
    return balancesMap
      .get(formState.values.symbol)
      ?.find(
        (balance) =>
          balance.chainId.toString() === formState.values.sourceChainId,
      )
  }, [balancesMap, formState.values.symbol, formState.values.sourceChainId])

  const targetChains = React.useMemo(() => {
    if (!balancesMap?.get) return []
    if (!selectedToken) return []
    if (selectedToken.interop === false) return [selectedToken.chainId]
    if (formState.values.sourceChainId !== '0') return [selectedToken.chainId]
    return (
      balancesMap
        .get(formState.values.symbol)
        ?.filter((balance) => balance.interop)
        .map((balance) => balance.chainId) ?? []
    )
  }, [
    balancesMap,
    selectedToken,
    formState.values.symbol,
    formState.values.sourceChainId,
  ])

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Ariakit.Form
        aria-labelledby="send-funds"
        className="flex h-full w-full flex-col items-center gap-2"
        store={form}
      >
        <header className="flex-col items-center gap-1.5 text-center">
          <h2
            className="-tracking-[2.8%] font-medium text-[27px] text-gray12 leading-full"
            id="send-funds"
          >
            Send funds
          </h2>
          <p className="-tracking-[2.8%] text-[16px] text-gray10 leading-6.25 md:leading-full">
            Transfer money instantly and globally with low fees.
          </p>
        </header>

        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-col gap-1">
            <Ariakit.FormLabel
              className="font-medium text-[13px] text-gray8 leading-none md:px-2"
              name={form.names.recipient}
            >
              Enter recipient
            </Ariakit.FormLabel>
            <div className="relative flex w-full items-center">
              <Ariakit.FormInput
                className="h-12 w-full rounded-full border border-gray4 bg-white ps-4 pe-11 font-medium text-[17px] placeholder:text-gray9 dark:bg-black"
                name={form.names.recipient}
                placeholder="0xA0Cf79..."
                required
                type="text"
              />
              <button
                className="absolute end-5 text-gray8"
                onClick={async () => {
                  if (!navigator.clipboard) return
                  const text = await navigator.clipboard.readText()
                  form.setValues((values) => ({ ...values, recipient: text }))
                }}
                type="button"
              >
                <LucideClipboardPaste />
              </button>
            </div>
          </div>

          <div className="flex gap-1">
            <div className="flex w-full flex-col gap-1">
              <Ariakit.FormLabel
                className="font-medium text-[13px] text-gray8 leading-none md:px-2"
                name={form.names.sourceChainId}
              >
                Select asset
              </Ariakit.FormLabel>
              <Ariakit.Role.button
                render={
                  <Ariakit.FormControl
                    name={form.names.sourceChainId}
                    render={
                      <Ariakit.TabProvider
                        orientation="vertical"
                        selectedId={formState.values.symbol}
                        setSelectedId={(symbol) => {
                          if (!symbol) return
                          const chainId = balancesMap
                            ?.get(symbol)?.[0]
                            ?.chainId.toString()
                          if (!chainId) return
                          const targetChainId = (() => {
                            if (chainId !== '0') return chainId
                            const balance = balancesMap?.get(symbol)
                            const selected = balance?.find(
                              (balance) =>
                                balance.chainId.toString() !== chainId &&
                                balance.interop,
                            )
                            return selected?.chainId.toString()!
                          })()
                          form.setValues((values) => ({
                            ...values,
                            sourceChainId: chainId,
                            symbol,
                            targetChainId: targetChainId,
                          }))
                        }}
                      >
                        <Ariakit.SelectProvider
                          setValue={(value) => {
                            const fallbackSymbol = 'ETH'
                            if (!formState.values.symbol)
                              form.setValue('symbol', fallbackSymbol)
                            form.setValue('sourceChainId', value)
                            if (value !== '0')
                              form.setValue('targetChainId', value)
                            else {
                              const balance = balancesMap?.get(
                                formState.values.symbol,
                              )
                              const selected = balance?.find(
                                (balance) =>
                                  balance.chainId.toString() !== value &&
                                  balance.interop,
                              )
                              form.setValue('targetChainId', selected?.chainId)
                            }
                          }}
                        >
                          <Ariakit.Select
                            className="h-12 w-full min-w-40 rounded-full border border-gray4 bg-white ps-4 pe-4 font-medium text-[17px] placeholder:text-gray9 dark:bg-black"
                            disabled={!address}
                            value={formState.values.sourceChainId}
                          >
                            <div className="flex items-center justify-between">
                              {selectedToken ? (
                                <div className="flex gap-1">
                                  <div>{selectedToken.symbol}</div>
                                  <div>{selectedToken.chainId}</div>
                                </div>
                              ) : (
                                <div />
                              )}
                              <LucideChevronDown className="text-gray9" />
                            </div>
                          </Ariakit.Select>

                          <Ariakit.SelectPopover
                            className="z-100 flex overflow-hidden rounded-[24px] border border-gray4 bg-white outline-none dark:bg-black"
                            gutter={-48}
                            sameWidth
                          >
                            <Ariakit.TabList className="flex flex-col">
                              {balances?.map(([symbol]) => (
                                <Ariakit.Tab id={symbol} key={symbol}>
                                  {symbol}
                                </Ariakit.Tab>
                              ))}
                            </Ariakit.TabList>

                            {balances?.map(([symbol, values]) => (
                              <Ariakit.TabPanel
                                className="flex flex-col"
                                id={symbol}
                                key={symbol}
                                unmountOnHide
                              >
                                <div>
                                  Total held{' '}
                                  {values
                                    .filter((value) => value.chainId === 0)
                                    .reduce(
                                      (sum, value) => sum + value.balance,
                                      0n,
                                    )}
                                </div>
                                <Ariakit.SelectList>
                                  {values.map((value) => (
                                    <Ariakit.SelectItem
                                      className="flex items-center gap-2.25 px-4"
                                      key={value.chainId}
                                      value={value.chainId.toString()}
                                    >
                                      {value.chainId}{' '}
                                      {ValueFormatter.format(
                                        value.balance,
                                        value.decimals,
                                      )}
                                    </Ariakit.SelectItem>
                                  ))}
                                </Ariakit.SelectList>
                              </Ariakit.TabPanel>
                            ))}
                          </Ariakit.SelectPopover>
                        </Ariakit.SelectProvider>
                      </Ariakit.TabProvider>
                    }
                  />
                }
              />
            </div>

            <div className="flex w-full flex-col gap-1">
              <Ariakit.FormLabel
                className="font-medium text-[13px] text-gray8 leading-none md:px-2"
                name={form.names.targetChainId}
              >
                Destination
              </Ariakit.FormLabel>
              <Ariakit.Role.button
                render={
                  <Ariakit.FormControl
                    name={form.names.targetChainId}
                    render={
                      <Ariakit.SelectProvider
                        setValue={(value) =>
                          form.setValue('targetChainId', value)
                        }
                      >
                        <Ariakit.Select
                          className="h-12 w-full min-w-40 rounded-full border border-gray4 bg-white ps-4 pe-4 font-medium text-[17px] placeholder:text-gray9 dark:bg-black"
                          disabled={!address}
                          value={formState.values.targetChainId}
                        >
                          <div className="flex items-center justify-between">
                            {formState.values.targetChainId ? (
                              <div className="flex gap-1">
                                <div>{formState.values.targetChainId}</div>
                              </div>
                            ) : (
                              <div />
                            )}
                            <LucideChevronDown className="text-gray9" />
                          </div>
                        </Ariakit.Select>

                        <Ariakit.SelectPopover
                          className="z-100 overflow-hidden rounded-[24px] border border-gray4 bg-white outline-none dark:bg-black"
                          gutter={-48}
                          sameWidth
                        >
                          {targetChains.map((option) => (
                            <Ariakit.SelectItem
                              className="flex h-11.5 items-center gap-2.25 px-4 hover:bg-gray3 data-focus-visible:bg-gray4"
                              key={option}
                              value={option.toString()}
                            >
                              {option}
                            </Ariakit.SelectItem>
                          ))}
                        </Ariakit.SelectPopover>
                      </Ariakit.SelectProvider>
                    }
                  />
                }
              />
            </div>
          </div>

          <div className="flex w-full flex-col">
            <div className="flex w-full justify-between md:ps-2">
              <Ariakit.FormLabel
                className="font-medium text-[13px] text-gray8 leading-none md:px-2"
                name={form.names.value}
              >
                Value
              </Ariakit.FormLabel>
              <div className="font-medium text-[13px] text-gray8 leading-none">
                <span className="text-gray9">
                  {Number(
                    ValueFormatter.format(
                      selectedToken?.balance,
                      selectedToken?.decimals,
                    ),
                  )}
                </span>{' '}
                available
              </div>
            </div>
            <div className="relative flex w-full items-center">
              <Ariakit.FormInput
                className="h-12 w-full rounded-full border border-gray4 bg-white ps-4 pe-11 font-medium text-[17px] placeholder:text-gray9 dark:bg-black"
                max={ValueFormatter.format(
                  selectedToken?.balance,
                  selectedToken?.decimals,
                )}
                min={0}
                name={form.names.value}
                placeholder="123"
                required
                step="any"
                type="number"
              />
              <button
                className="absolute end-5 font-medium text-[13px] text-gray8 capitalize leading-none"
                onClick={() => {
                  form.setValues((values) => ({
                    ...values,
                    value: ValueFormatter.format(
                      selectedToken?.balance,
                      selectedToken?.decimals,
                    ),
                  }))
                }}
                type="button"
              >
                max
              </button>
            </div>
          </div>

          <Ariakit.FormSubmit
            className="mt-3.5 h-12 w-full rounded-full bg-gray3 font-medium text-[17px]"
            disabled={sendCalls.isPending}
          >
            {sendCalls.isPending ? 'Check For Prompt' : 'Send'}
          </Ariakit.FormSubmit>
        </div>
      </Ariakit.Form>
    </div>
  )
}

function useBalances(props: { address: Address.Address | undefined }) {
  return useQuery({
    enabled: Boolean(props.address),
    initialData,
    async queryFn(ctx) {
      const account = ctx.queryKey[1]
      if (!account) throw new Error('account not connected')
      const porto = Porto.create(portoConfig)
      const client = RelayClient.fromPorto(porto)
      const assets = await WalletActions.getAssets(client, { account })
      const capabilities = await RelayActions.getCapabilities(client, {
        chainIds: Object.keys(assets).map((chainId) =>
          Number.parseInt(chainId, 10),
        ),
      })
      const balances = new Map<string, Balance[]>()
      type Balance = {
        address: Address.Address | undefined
        balance: bigint
        chainId: number
        decimals: number
        interop: boolean | undefined
        name: string | undefined
        nativeRate: bigint | undefined
        symbol: string
      }
      for (const [key, tokens] of Object.entries(assets)) {
        const chainId = Number.parseInt(key, 10)
        const feeTokens =
          capabilities[Hex.fromNumber(chainId)]?.fees?.tokens ?? []
        for (const token of tokens) {
          const symbol = token.metadata?.symbol
          // TODO: Handle tokens that do not have symbol
          if (!symbol) continue
          const feeToken = feeTokens.find(
            (feeToken) =>
              feeToken.symbol === symbol || feeToken.address === token.address,
          )
          const { interop, nativeRate } = feeToken ?? {}
          balances.set(symbol, [
            ...(balances.get(symbol) ?? []),
            {
              address:
                token.address === 'native'
                  ? zeroAddress
                  : (token.address ?? zeroAddress),
              balance: token.balance,
              chainId,
              decimals: token.metadata.decimals,
              interop,
              name: token.metadata.name,
              nativeRate,
              symbol: token.metadata.symbol,
            },
          ])
        }
      }
      for (const [key, values] of balances) {
        const interopValues = values.filter((value) => value.interop)
        if (!interopValues.length) continue
        const interopBalance = {
          ...values[0]!,
          address: undefined,
          balance: interopValues.reduce(
            (sum, value) => sum + value.balance,
            0n,
          ),
          chainId: 0,
          interop: undefined,
          nativeRate: undefined,
        }
        balances.set(key, [interopBalance, ...(balances.get(key) ?? [])])
      }
      return [...balances.entries()]
    },
    queryKey: ['balances', props.address] as const,
  })
}

const initialData = [
  [
    'ETH',
    [
      {
        address: null,
        balance: '0',
        chainId: 0,
        decimals: 18,
        interop: null,
        name: null,
        nativeRate: null,
        symbol: 'ETH',
      },
      {
        address: '0x0000000000000000000000000000000000000000',
        balance: '0',
        chainId: 1,
        decimals: 18,
        interop: true,
        name: null,
        nativeRate: '1000000000000000000',
        symbol: 'ETH',
      },
    ],
  ],
] as never
