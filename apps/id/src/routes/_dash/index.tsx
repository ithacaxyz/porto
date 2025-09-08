import * as Ariakit from '@ariakit/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { type Address, Hex } from 'ox'
import { Porto } from 'porto'
import { RelayActions, RelayClient, WalletActions } from 'porto/viem'
import * as React from 'react'
import { zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { ValueFormatter } from '~/utils.ts'
import LucideChevronDown from '~icons/lucide/chevron-down'
import LucideClipboardPaste from '~icons/lucide/clipboard-paste'
import { config as portoConfig } from '../../lib/Porto.ts'

export const Route = createFileRoute('/_dash/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { address } = useAccount()
  const { data: balances } = useBalances({ address })

  const options = React.useMemo(
    () => (balances?.entries ? [...balances.entries()] : []),
    [balances],
  )

  const form = Ariakit.useFormStore({
    defaultValues: {
      destination: '',
      recipient: '',
      symbol: '',
      tokenChainId: '',
      value: '',
    },
  })
  form.useSubmit(async (state) => {
    alert(JSON.stringify(state.values))
  })

  const destination = form.useValue('destination')
  const symbol = form.useValue('symbol')
  const tokenChainId = form.useValue('tokenChainId')

  const selectedToken = React.useMemo(() => {
    if (!balances?.get) return undefined
    return balances
      .get(symbol)
      ?.find((balance) => balance.chainId.toString() === tokenChainId)
  }, [balances, symbol, tokenChainId])

  const destinations = React.useMemo(() => {
    if (!balances?.get) return []
    if (!selectedToken) return []
    if (selectedToken.interop === false) return [selectedToken.chainId]
    return (
      balances
        .get(symbol)
        ?.filter((balance) => balance.interop)
        .map((balance) => balance.chainId) ?? []
    )
  }, [balances, selectedToken, symbol])

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
                name={form.names.tokenChainId}
              >
                Select asset
              </Ariakit.FormLabel>
              <Ariakit.Role.button
                render={
                  <Ariakit.FormControl
                    name={form.names.tokenChainId}
                    render={
                      <Ariakit.TabProvider
                        orientation="vertical"
                        selectedId={symbol ? symbol : 'ETH'}
                        setSelectedId={(symbol) => {
                          if (!symbol) return
                          const tokenChainId = balances
                            ?.get(symbol)?.[0]
                            ?.chainId.toString()
                          if (!tokenChainId) return
                          const destination = (() => {
                            if (tokenChainId !== '0') return tokenChainId
                            const balance = balances?.get(symbol)
                            const selected = balance?.find(
                              (balance) =>
                                balance.chainId.toString() !== tokenChainId &&
                                balance.interop,
                            )
                            return selected?.chainId.toString()!
                          })()
                          form.setValues((values) => ({
                            ...values,
                            destination,
                            symbol,
                            tokenChainId,
                          }))
                        }}
                      >
                        <Ariakit.SelectProvider
                          setValue={(value) => {
                            const fallbackSymbol = 'ETH'
                            if (!symbol) form.setValue('symbol', fallbackSymbol)
                            form.setValue('tokenChainId', value)
                            if (value !== '0')
                              form.setValue('destination', value)
                            else {
                              const balance = balances?.get(symbol)
                              const selected = balance?.find(
                                (balance) =>
                                  balance.chainId.toString() !== value &&
                                  balance.interop,
                              )
                              form.setValue('destination', selected?.chainId)
                            }
                          }}
                        >
                          <Ariakit.Select
                            className="h-12 w-full min-w-40 rounded-full border border-gray4 bg-white ps-4 pe-4 font-medium text-[17px] placeholder:text-gray9 dark:bg-black"
                            disabled={!address}
                            value={tokenChainId}
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
                              {options?.map(([symbol]) => (
                                <Ariakit.Tab id={symbol} key={symbol}>
                                  {symbol}
                                </Ariakit.Tab>
                              ))}
                            </Ariakit.TabList>

                            {options?.map(([symbol, values]) => (
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
                name={form.names.destination}
              >
                Destination
              </Ariakit.FormLabel>
              <Ariakit.Role.button
                render={
                  <Ariakit.FormControl
                    name={form.names.destination}
                    render={
                      <Ariakit.SelectProvider
                        setValue={(value) =>
                          form.setValue('destination', value)
                        }
                      >
                        <Ariakit.Select
                          className="h-12 w-full min-w-40 rounded-full border border-gray4 bg-white ps-4 pe-4 font-medium text-[17px] placeholder:text-gray9 dark:bg-black"
                          disabled={!address}
                          value={destination}
                        >
                          <div className="flex items-center justify-between">
                            {destination ? (
                              <div className="flex gap-1">
                                <div>{destination}</div>
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
                          {destinations.map((option) => (
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
                min={0.0000000000000001}
                name={form.names.value}
                placeholder="123"
                required
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

          <Ariakit.FormSubmit className="mt-3.5 h-12 w-full rounded-full bg-gray3 font-medium text-[17px]">
            Send
          </Ariakit.FormSubmit>
        </div>
      </Ariakit.Form>
    </div>
  )
}

function useBalances(props: { address: Address.Address | undefined }) {
  // TODO: Return cached data on page load
  return useQuery({
    enabled: Boolean(props.address),
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
      return balances
    },
    queryKey: ['balances', props.address] as const,
  })
}
