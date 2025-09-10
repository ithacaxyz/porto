import * as Ariakit from '@ariakit/react'
import { ChainIcon, Toast } from '@porto/apps/components'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { cx } from 'cva'
import { type Address, Hex, Value } from 'ox'
import { Porto } from 'porto'
import { RelayActions, RelayClient, WalletActions } from 'porto/viem'
import * as React from 'react'
import { toast } from 'sonner'
import { encodeFunctionData, erc20Abi, zeroAddress } from 'viem'
import { useAccount, useSendCalls } from 'wagmi'
import { waitForCallsStatus } from 'wagmi/actions'
import { TokenIcon } from '~/components/TokenIcon.tsx'
import * as Wagmi from '~/lib/Wagmi.ts'
import { StringFormatter, ValueFormatter } from '~/utils.ts'
import LucideArrowLeftRight from '~icons/lucide/arrow-left-right'
import LucideChevronDown from '~icons/lucide/chevron-down'
import LucideClipboardPaste from '~icons/lucide/clipboard-paste'
import LucideSendHorizontal from '~icons/lucide/send-horizontal'
import { config as portoConfig } from '../../lib/Porto.ts'

export const Route = createFileRoute('/_dash/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { address } = useAccount()

  const { data: assets } = useAssets({ address })
  const assetsMap = React.useMemo(() => {
    return new Map<string, NonNullable<typeof assets>[number][1]>(assets)
  }, [assets])

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
      sourceChainId: '0',
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

    const token = assetsMap
      .get(state.values.symbol)
      ?.find((balance) => balance.chainId === sourceChainId)
    if (!token) throw new Error(`token not found for chain ID ${sourceChainId}`)

    const to =
      sourceChainId === 0
        ? assetsMap
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
              { ...toastProps, duration: Number.POSITIVE_INFINITY },
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
              { ...toastProps, duration: 4_000 },
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
              { ...toastProps, duration: 5_000 },
            )
          }
        },
      },
    )
  })

  const asset = React.useMemo(() => {
    if (!assetsMap?.get) return undefined
    return assetsMap
      .get(formState.values.symbol)
      ?.find(
        (balance) =>
          balance.chainId.toString() === formState.values.sourceChainId,
      )
  }, [assetsMap, formState.values.symbol, formState.values.sourceChainId])

  const targetChains = React.useMemo(() => {
    if (!assetsMap?.get) return []
    if (!asset) return []
    if (formState.values.sourceChainId !== '0' || asset.interop === false)
      return [
        {
          id: asset.chainId,
          name: asset.chainName,
        },
      ]
    return (
      assetsMap
        .get(formState.values.symbol)
        ?.filter((asset) => asset.interop)
        .map((asset) => ({
          id: asset.chainId,
          name: asset.chainName,
          testnet: Wagmi.getChainConfig(asset.chainId)?.testnet ?? false,
        }))
        .sort((a, b) => {
          if (a.testnet !== b.testnet) return a.testnet ? 1 : -1
          return a.name.localeCompare(b.name)
        }) ?? []
    )
  }, [
    assetsMap,
    asset,
    formState.values.symbol,
    formState.values.sourceChainId,
  ])

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Ariakit.Form
        aria-labelledby="send-funds"
        className="flex w-full flex-col items-center gap-6 md:max-w-100.5"
        store={form}
      >
        <header className="flex flex-col items-center justify-center gap-1.5 text-center">
          <div className="mb-3 flex size-13 items-center justify-center rounded-full bg-blue3">
            <LucideSendHorizontal className="text-blue10" />
          </div>
          <h2
            className="-tracking-[2.8%] font-medium text-[27px] text-gray12 leading-full"
            id="send-funds"
          >
            Send funds
          </h2>
          <p className="-tracking-[2.8%] max-w-55 text-[16px] text-gray10 leading-full">
            Transfer money instantly and globally with low fees.
          </p>
        </header>

        <div className="flex w-full flex-col gap-3.5">
          <div className="flex w-full flex-col gap-3">
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

          <div className="relative flex gap-1">
            <div className="flex w-full flex-col gap-3">
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
                          const chainId = assetsMap
                            ?.get(symbol)?.[0]
                            ?.chainId.toString()
                          if (!chainId) return
                          const targetChainId = (() => {
                            if (chainId !== '0') return chainId
                            const assets = assetsMap?.get(symbol)
                            const selected = assets?.find(
                              (asset) =>
                                asset.chainId.toString() !== chainId &&
                                asset.interop,
                            )
                            return selected?.chainId.toString()!
                          })()
                          form.setValues((values) => ({
                            ...values,
                            sourceChainId: chainId,
                            symbol,
                            targetChainId,
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
                              const assets = assetsMap?.get(
                                formState.values.symbol,
                              )
                              const selected = assets?.find(
                                (asset) =>
                                  asset.chainId.toString() !== value &&
                                  asset.interop,
                              )
                              form.setValue(
                                'targetChainId',
                                selected?.chainId.toString(),
                              )
                            }
                          }}
                        >
                          <Ariakit.Select
                            className="h-12 w-full min-w-40 rounded-full border border-gray4 bg-white ps-4 pe-4 font-medium text-[17px] placeholder:text-gray9 dark:bg-black"
                            disabled={!address}
                            value={formState.values.sourceChainId}
                          >
                            <div className="flex items-center justify-between">
                              {asset ? (
                                <div className="flex gap-2.5">
                                  <div className="relative">
                                    <TokenIcon
                                      size={24}
                                      symbol={asset.symbol}
                                    />
                                    <div className="-end-1.25 -bottom-1 absolute size-4">
                                      {asset.chainId === 0 ? (
                                        <div className="flex size-full items-center justify-center rounded-full bg-gray5">
                                          <LucideArrowLeftRight className="size-2.5 text-gray10" />
                                        </div>
                                      ) : (
                                        <ChainIcon
                                          chainId={asset.chainId}
                                          className="size-4"
                                        />
                                      )}
                                    </div>
                                  </div>
                                  <div>{asset.symbol}</div>
                                </div>
                              ) : (
                                <div />
                              )}
                              <LucideChevronDown className="text-gray9" />
                            </div>
                          </Ariakit.Select>

                          <Ariakit.SelectPopover
                            className="z-100 flex overflow-hidden rounded-[14px] border border-gray4 bg-white outline-none dark:bg-black"
                            gutter={10}
                            wrapperProps={{
                              className: 'w-auto! inset-x-0!',
                            }}
                          >
                            <Ariakit.TabList className="h-full max-h-57 w-full overflow-y-auto border-gray4 border-e p-2.5">
                              {assets?.map(([symbol]) => (
                                <Ariakit.Tab
                                  className="flex h-11.5 w-full items-center gap-2 rounded-[10px] px-3 font-medium text-[16px] hover:bg-gray3 data-focus-visible:bg-gray4"
                                  id={symbol}
                                  key={symbol}
                                >
                                  <TokenIcon size={24} symbol={symbol} />
                                  <div>{symbol}</div>
                                </Ariakit.Tab>
                              ))}
                            </Ariakit.TabList>

                            {assets?.map(([symbol, values]) => (
                              <Ariakit.TabPanel
                                className="flex max-h-57 w-full flex-col overflow-y-auto p-2.5 pt-4"
                                id={symbol}
                                key={symbol}
                                unmountOnHide
                              >
                                <div className="mb-2 flex justify-between px-2 font-medium text-[13px] text-gray8 leading-none">
                                  <div>Total held</div>
                                  <div>
                                    {ValueFormatter.format(
                                      values
                                        .filter((value) => value.chainId === 0)
                                        .reduce(
                                          (sum, value) => sum + value.balance,
                                          0n,
                                        ),
                                      values[0]?.decimals,
                                    )}
                                  </div>
                                </div>
                                <Ariakit.SelectList>
                                  {values.map((value) => (
                                    <Ariakit.SelectItem
                                      className="flex h-11.5 items-center justify-between gap-2 rounded-[10px] px-3 font-medium text-[16px] hover:bg-gray3 data-focus-visible:bg-gray4"
                                      key={value.chainId}
                                      value={value.chainId.toString()}
                                    >
                                      <div className="flex gap-2.5">
                                        {value.chainId !== 0 ? (
                                          <ChainIcon
                                            chainId={value.chainId}
                                            className="size-6"
                                          />
                                        ) : (
                                          <div className="flex size-6 items-center justify-center rounded-full bg-gray5">
                                            <LucideArrowLeftRight className="size-4 text-gray10" />
                                          </div>
                                        )}
                                        <div className="whitespace-nowrap">
                                          {value.chainName}
                                        </div>
                                      </div>

                                      <div>
                                        {ValueFormatter.format(
                                          value.balance,
                                          value.decimals,
                                        )}
                                      </div>
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

            <div className="flex w-full flex-col gap-3">
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
                          className="h-12 w-full min-w-40 rounded-full border border-gray4 bg-white ps-4 pe-4 font-medium text-[17px] placeholder:text-gray9 disabled:bg-gray3 dark:bg-black"
                          disabled={formState.values.sourceChainId !== '0'}
                          value={formState.values.targetChainId}
                        >
                          <div className="flex items-center justify-between gap-2.5">
                            {formState.values.targetChainId ? (
                              <div className="flex gap-2.5">
                                <ChainIcon
                                  chainId={Number.parseInt(
                                    formState.values.targetChainId,
                                    10,
                                  )}
                                  className="size-6"
                                />
                                <div className="whitespace-nowrap">
                                  {Wagmi.getChainConfig(
                                    Number.parseInt(
                                      formState.values.targetChainId,
                                      10,
                                    ),
                                  )?.name ??
                                    `Chain ID ${formState.values.targetChainId}`}
                                </div>
                              </div>
                            ) : (
                              <div />
                            )}
                            {formState.values.sourceChainId === '0' && (
                              <LucideChevronDown className="text-gray9" />
                            )}
                          </div>
                        </Ariakit.Select>

                        <Ariakit.SelectPopover
                          className="z-100 overflow-hidden rounded-[14px] border border-gray4 bg-white outline-none dark:bg-black"
                          gutter={10}
                          sameWidth
                        >
                          <Ariakit.SelectList className="max-h-57 overflow-y-scroll">
                            {targetChains.map((chain) => (
                              <Ariakit.SelectItem
                                className="flex h-12 items-center justify-between gap-2.25 px-4 hover:bg-gray3 data-focus-visible:bg-gray4"
                                key={chain.id}
                                value={chain.id.toString()}
                              >
                                <div className="flex gap-2.5">
                                  <ChainIcon
                                    chainId={chain.id}
                                    className="size-6"
                                  />
                                  <div>{chain.name}</div>
                                </div>
                                {formState.values.targetChainId ===
                                  chain.id.toString() && (
                                  <div className="size-2 rounded-full bg-gray5" />
                                )}
                              </Ariakit.SelectItem>
                            ))}
                          </Ariakit.SelectList>
                        </Ariakit.SelectPopover>
                      </Ariakit.SelectProvider>
                    }
                  />
                }
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full justify-between md:px-2">
              <Ariakit.FormLabel
                className="font-medium text-[13px] text-gray8 leading-none"
                name={form.names.value}
              >
                Enter amount
              </Ariakit.FormLabel>
              <div className="font-medium text-[13px] text-gray8 leading-none">
                <span className="text-gray9">
                  {Number(
                    ValueFormatter.format(asset?.balance, asset?.decimals),
                  )}
                </span>{' '}
                available
              </div>
            </div>
            {formState.values.symbol && formState.values.targetChainId && (
              <div className="relative flex w-full items-center">
                <Ariakit.FormInput
                  className="h-12 w-full rounded-full border border-gray4 bg-white ps-4 pe-11 font-medium text-[17px] placeholder:text-gray9 dark:bg-black"
                  max={ValueFormatter.format(asset?.balance, asset?.decimals)}
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
                        asset?.balance,
                        asset?.decimals,
                      ),
                    }))
                  }}
                  type="button"
                >
                  max
                </button>
              </div>
            )}
          </div>

          <Ariakit.FormSubmit
            className={cx(
              'mt-3.5 h-12 w-full rounded-full font-medium text-[17px]',
              formState.valid
                ? sendCalls.isPending
                  ? 'bg-gray3'
                  : 'bg-accent'
                : 'bg-gray3',
            )}
            disabled={sendCalls.isPending}
          >
            {sendCalls.isPending ? 'Check For Prompt' : 'Send'}
          </Ariakit.FormSubmit>
        </div>
      </Ariakit.Form>
    </div>
  )
}

function useAssets(props: { address: Address.Address | undefined }) {
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
      const assetsMap = new Map<string, Asset[]>()
      type Asset = {
        address: Address.Address | undefined
        balance: bigint
        chainId: number
        chainName: string
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
          assetsMap.set(symbol, [
            ...(assetsMap.get(symbol) ?? []),
            {
              address:
                token.address === 'native'
                  ? zeroAddress
                  : (token.address ?? zeroAddress),
              balance: token.balance,
              chainId,
              chainName:
                Wagmi.getChainConfig(chainId)?.name ?? `Chain ID ${chainId}`,
              decimals: token.metadata.decimals,
              interop,
              name: token.metadata.name,
              nativeRate,
              symbol: token.metadata.symbol,
            },
          ])
        }
      }
      for (const [key, values] of assetsMap) {
        const interopValues = values.filter((value) => value.interop)
        if (!interopValues.length) continue
        const interopAsset = {
          ...values[0]!,
          address: undefined,
          balance: interopValues.reduce(
            (sum, value) => sum + value.balance,
            0n,
          ),
          chainId: 0,
          chainName: 'Interop',
          interop: undefined,
          nativeRate: undefined,
        }
        assetsMap.set(key, [interopAsset, ...(assetsMap.get(key) ?? [])])
      }

      const boostedNames = ['ETH', 'USDC', 'USDT']
      const boostedSet = new Set(boostedNames)
      return [...assetsMap.entries()].sort((a, b) => {
        const aIsBoosted = boostedSet.has(a[0])
        const bIsBoosted = boostedSet.has(b[0])
        if (aIsBoosted !== bIsBoosted) return aIsBoosted ? -1 : 1
        if (aIsBoosted && bIsBoosted)
          return boostedNames.indexOf(a[0]) - boostedNames.indexOf(b[0])
        return a[0].localeCompare(b[0])
      })
    },
    queryKey: ['assets', props.address] as const,
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
