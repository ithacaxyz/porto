import { Address, Value } from 'ox'
import * as React from 'react'
import { erc20Abi, isHex, parseEther } from 'viem'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { useSendCalls } from 'wagmi/experimental'
import ChevronLeftIcon from '~icons/lucide/chevron-left'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import CircleCheckIcon from '~icons/lucide/circle-check'
import OctagonAlertIcon from '~icons/lucide/octagon-alert'
import SendHorizontalIcon from '~icons/lucide/send-horizontal'

import { Button as OurButton } from '~/components/Button'
import { Pill } from '~/components/Pill'
import { Dialog } from '~/components/ui/dialog'
import {
  type TokenBalance,
  useTokenBalances,
} from '~/hooks/use-address-token-balances'
import { config } from '~/lib/Wagmi'
import { StringFormatter, ValueFormatter, cn } from '~/utils'

export function SendDialog({
  className,
}: {
  className?: string
}) {
  const { address } = useAccount()
  const send = useSendCalls({
    config: config,
  })

  const { data: tokenData, status: tokenStatus } = useTokenBalances({
    address,
  })

  const account = useAccount()

  const receiptQuery = useWaitForTransactionReceipt({
    chainId: account.chain?.id!,
    hash: send.data as never,
    query: {
      enabled: isHex(send.data),
    },
  })

  const [isAssetSelectorOpen, setIsAssetSelectorOpen] = React.useState(false)

  const [selectedAsset, setSelectedAsset] = React.useState<TokenBalance | null>(
    tokenData?.[0] ?? null,
  )

  const isSending = send.isPending || receiptQuery.fetchStatus === 'fetching'

  const [amount, setAmount] = React.useState('')
  const amountExceedsBalance =
    parseEther(amount) > BigInt(selectedAsset?.value ?? 0)

  if (tokenStatus === 'pending') return null
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <OurButton
          variant="invert"
          className={cn(
            className,
            'w-[110px] text-center font-semibold text-lg sm:mt-0.75 sm:w-[252px] sm:text-md',
            'flex h-11! items-center justify-center gap-x-1 sm:h-10',
            'sm:col-span-2 sm:col-start-1 sm:row-span-1 sm:place-self-stretch',
            'col-span-1 col-start-1',
          )}
        >
          <SendHorizontalIcon className="size-6" />
          <Dialog.Title>Send</Dialog.Title>
        </OurButton>
      </Dialog.Trigger>
      <Dialog.Content
        title="Send"
        aria-describedby="Transfer funds to another address."
        className={cn(
          'w-full max-w-[420px]',
          'rounded-xl border-0 bg-primary px-0 py-5 shadow-xl sm:max-w-[400px]',
          'sm:-translate-y-1/2 -translate-y-1/5',
        )}
      >
        {send.isPending ? (
          <SendingView />
        ) : send.isSuccess ? (
          <SuccessView hash={send.data} />
        ) : (
          <React.Fragment>
            <Dialog.Header className="px-5 py-0 text-left">
              {isAssetSelectorOpen ? (
                <div className="flex flex-row items-center gap-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAssetSelectorOpen(false)}
                    className="my-auto flex size-7 items-center justify-center rounded-full bg-gray4"
                  >
                    <ChevronLeftIcon className="mr-0.5 size-6 text-gray10" />
                  </button>
                  <h3 className="font-medium text-xl">Select asset</h3>
                </div>
              ) : (
                <h3 className="font-medium text-lg">Send</h3>
              )}
            </Dialog.Header>
            <form
              name="send"
              className="w-full"
              onSubmit={async (event) => {
                event.preventDefault()
                try {
                  if (!address || !Address.validate(address)) return

                  const formData = new FormData(event.currentTarget)
                  const to = formData.get('to') as string
                  if (!to || !Address.validate(to)) return
                  const amount = formData.get('amount') as string

                  const tokenAddress = selectedAsset?.token.address
                  if (!tokenAddress || !Address.validate(tokenAddress)) return

                  send.sendCalls({
                    calls: [
                      {
                        to: tokenAddress,
                        data: {
                          abi: erc20Abi,
                          functionName: 'transfer',
                          args: [to, parseEther(amount)],
                        },
                      },
                    ],
                  })
                } catch (error) {
                  console.error(
                    error instanceof Error ? error.message : 'unknown error',
                  )
                }
              }}
            >
              <div className="mb-3 flex items-center justify-between px-5">
                <div>
                  <p id="send-funds" className="text-gray10 text-sm">
                    Select asset
                  </p>
                </div>
              </div>

              {/* Asset Selector */}
              <div className="mt-3 mb-1 flex w-full flex-col gap-y-1.5">
                <div className="px-5">
                  <button
                    type="button"
                    hidden={isAssetSelectorOpen}
                    onClick={() => setIsAssetSelectorOpen(!isAssetSelectorOpen)}
                    className="flex h-14! w-full justify-between gap-x-2 rounded-xl border-2 border-gray4 px-5 py-2.5 text-left font-medium text-lg text-primary shadow-none! hover:bg-secondary"
                  >
                    <img
                      src={
                        selectedAsset?.token.icon_url ||
                        `/icons/${selectedAsset?.token.symbol.toLowerCase()}.svg`
                      }
                      alt={selectedAsset?.token.name}
                      className="my-auto size-8 rounded-full"
                    />
                    <p className="my-auto mr-auto text-left font-medium text-xl">
                      {selectedAsset?.token.name}
                    </p>
                    <div className="my-auto flex size-8 items-center justify-center rounded-full bg-gray4">
                      <ChevronRightIcon className="size-6 text-gray10" />
                    </div>
                  </button>
                </div>

                {isAssetSelectorOpen && (
                  <AssetSelectionView
                    tokenData={tokenData}
                    handleAssetSelect={setSelectedAsset}
                    setIsAssetSelectorOpen={setIsAssetSelectorOpen}
                  />
                )}
              </div>

              {/* Amount Input */}
              <div
                className="mt-3 mb-1 flex flex-col gap-y-1.5 px-5"
                hidden={isAssetSelectorOpen}
              >
                <div className="flex items-center justify-between gap-x-2">
                  <label
                    htmlFor="amount"
                    className="ml-0.5 text-gray10 text-xs"
                  >
                    Enter amount
                  </label>
                  <p className="ml-auto space-x-1 text-gray11 text-sm">
                    <span>
                      {ValueFormatter.format(BigInt(selectedAsset?.value ?? 0))}
                    </span>
                    <span className="text-gray10">held</span>
                  </p>
                  <Pill className="rounded-2xl font-medium">
                    <button
                      type="button"
                      className="px-0.5 text-xs"
                      onClick={() =>
                        setAmount(selectedAsset?.value.toString() ?? '')
                      }
                    >
                      Max
                    </button>
                  </Pill>
                </div>
                <div
                  className={cn(
                    'flex w-full items-center',
                    'h-14 rounded-xl border-2 border-gray4 px-3.5 py-2 text-left font-medium hover:bg-secondary',
                  )}
                >
                  <input
                    name="amount"
                    type="number"
                    inputMode="decimal"
                    className={cn(
                      'slashed-zero tabular-nums placeholder:slashed-zero',
                      'size-full text-left font-medium text-2xl text-primary/80 hover:bg-secondary focus:outline-none',
                    )}
                    min={0}
                    max={Number(selectedAsset?.value)}
                    required
                    placeholder="0.00"
                    autoCorrect="off"
                    autoComplete="off"
                    autoCapitalize="off"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isSending}
                  />

                  <img
                    src={
                      selectedAsset?.token.icon_url ||
                      `/icons/${selectedAsset?.token.symbol.toLowerCase()}.svg`
                    }
                    alt={selectedAsset?.token.name}
                    className="size-5 rounded-full"
                  />
                  <span className="ml-2 text-gray10 text-lg">
                    {selectedAsset?.token.symbol}
                  </span>
                </div>
                {amount && amountExceedsBalance && (
                  <div className="mt-1 rounded-2xl bg-[#FEEBEC] px-2 py-1.5 text-gray11">
                    <p className="flex items-center justify-center gap-x-1">
                      <OctagonAlertIcon className="size-5 text-red-500" />
                      <span className="font-semibold text-red-500">
                        Exceeds balance.
                      </span>
                      You hold{' '}
                      {ValueFormatter.format(BigInt(selectedAsset?.value ?? 0))}{' '}
                      {selectedAsset?.token.symbol}.
                    </p>
                  </div>
                )}
              </div>

              {/* Recipient Address */}
              <div
                className="my-3 flex flex-col gap-y-1 px-5"
                hidden={isAssetSelectorOpen}
              >
                <label
                  htmlFor="recipient"
                  className="pointer-events-none ml-0.5 text-left text-gray10 text-xs"
                >
                  Send to...
                </label>
                <div
                  className={cn(
                    'flex w-full items-center',
                    'h-14 rounded-xl border-2 border-gray4 py-2 pl-3.5 text-left font-medium hover:bg-secondary',
                  )}
                >
                  <ReceiverInput />
                </div>
              </div>
              <pre hidden={isAssetSelectorOpen}>
                {import.meta.env.DEV &&
                  JSON.stringify(
                    { status: send.status, success: send.isSuccess },
                    undefined,
                    2,
                  )}
              </pre>
              <div>
                {send.isError && (
                  <div className="bg-red3 p-2">
                    <p className="text-pretty font-mono text-xs">
                      {send.error.message}
                    </p>
                  </div>
                )}
              </div>
              {/* Action Buttons */}
              <div
                className="mt-4 mb-3 flex flex-row gap-x-3 *:h-12 *:w-full *:select-none *:font-medium *:text-lg"
                hidden={isAssetSelectorOpen}
              >
                <Dialog.Close asChild>
                  <OurButton
                    form="send"
                    type="reset"
                    name="cancel"
                    variant="default"
                    disabled={isSending}
                    className="rounded-full border-2 border-gray6 bg-gray5 text-primary hover:bg-gray4"
                  >
                    Cancel
                  </OurButton>
                </Dialog.Close>
                <OurButton
                  type="submit"
                  className={cn('rounded-full border-2')}
                  disabled={!amount || isSending}
                  variant={!!amount && !isSending ? 'accent' : 'ghost'}
                >
                  Send
                </OurButton>
              </div>
            </form>
          </React.Fragment>
        )}
      </Dialog.Content>
    </Dialog>
  )
}

function AssetSelectionView({
  tokenData,
  handleAssetSelect,
  setIsAssetSelectorOpen,
}: {
  tokenData: TokenBalance[] | undefined
  setIsAssetSelectorOpen: (open: boolean) => void
  handleAssetSelect: (asset: TokenBalance) => void
}) {
  return (
    <div className="mt-auto flex size-full flex-col">
      {tokenData?.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center text-gray10">
          <p>No assets available</p>
        </div>
      ) : (
        <div className="overflow-y-auto">
          {tokenData?.map((asset, index) => (
            <button
              type="button"
              key={asset.token.address}
              className={cn(
                'flex w-full flex-row items-center justify-between border-y-2 py-3 hover:bg-gray4',
                index % 2 === 0 && 'border-gray4 border-b-transparent',
              )}
              onClick={() => {
                handleAssetSelect(asset)
                setIsAssetSelectorOpen(false)
              }}
            >
              <div className="flex items-center gap-2 px-5">
                <img
                  src={
                    asset.token.icon_url ||
                    `/icons/${asset.token.symbol.toLowerCase()}.svg`
                  }
                  alt={asset.token.name}
                  className="mr-1 size-10 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-xl">
                    {asset.token.name}
                  </span>
                  <span className="mr-auto text-gray10 text-sm">
                    {asset.token.symbol}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end px-5">
                <span className="text-2xl">
                  ${ValueFormatter.format(BigInt(asset.value))}
                </span>
                <div className="flex items-start justify-start gap-x-1">
                  <span className="mt-0.25 text-gray10 text-sm">
                    {Value.format(
                      BigInt(asset.value),
                      Number(asset.token.decimals),
                    )}
                  </span>
                  <Pill className="">{asset.token.symbol}</Pill>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ReceiverInput() {
  const [recipient, setRecipient] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)
  const [truncatedRecipient, setTruncatedRecipient] = React.useState('')
  const validRecipient = Address.validate(recipient)
  React.useEffect(() => {
    if (recipient && recipient.length > 14) {
      setTruncatedRecipient(
        StringFormatter.truncate(recipient, { start: 8, end: 6 }),
      )
    }
  }, [recipient])

  return (
    <React.Fragment>
      <input
        name="to"
        maxLength={42}
        minLength={42}
        autoCorrect="off"
        spellCheck={false}
        value={recipient}
        autoComplete="off"
        autoCapitalize="off"
        placeholder="0xAbCd..."
        onChange={(event) => setRecipient(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={(event) => {
          if (event.target.value.length <= 14) return
          setIsFocused(false)
        }}
        className={cn(
          'slashed-zero tabular-nums placeholder:slashed-zero',
          'size-full text-left font-medium text-lg text-primary hover:bg-secondary focus:outline-none',
          validRecipient && !isFocused && 'text-transparent',
        )}
      />

      <span
        data-item="recipient"
        className={cn(
          'pointer-events-none absolute font-medium text-lg text-primary',
          (!validRecipient || isFocused) && 'invisible hidden text-transparent',
        )}
      >
        {truncatedRecipient}
      </span>
      {validRecipient && !isFocused && (
        <CircleCheckIcon className="my-auto mr-3 ml-auto size-6 rounded-full text-emerald-600" />
      )}
    </React.Fragment>
  )
}

function SendingView() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
        <div className="size-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
      <h2 className="mb-2 font-medium text-2xl">Sending funds</h2>
      <p className="text-balance text-center text-gray10">
        This won't take long at all. You can safely close this window now.
      </p>
      <Dialog.Close asChild>
        <OurButton
          variant="default"
          className="mt-4 h-12! w-full rounded-full bg-gray4! text-xl!"
        >
          Close
        </OurButton>
      </Dialog.Close>
    </div>
  )
}

function SuccessView({ hash }: { hash: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
        <CircleCheckIcon className="size-12 text-green-500" />
      </div>
      <h2 className="mb-2 font-semibold text-2xl">Success!</h2>
      <p className="text-center text-gray10">
        Your funds were sent successfully.
        <br />
        You can find a confirmation{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
          href={`https://explorer.ithaca.xyz/tx/${hash}`}
        >
          here
        </a>
        .
      </p>
      <Dialog.Close asChild>
        <OurButton
          variant="default"
          className="mt-4 h-12! w-full rounded-full bg-gray4! text-xl!"
        >
          Done
        </OurButton>
      </Dialog.Close>
    </div>
  )
}
