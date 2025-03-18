import * as Ariakit from '@ariakit/react'
import { cx } from 'cva'
import { Address, type Hex, Value } from 'ox'
import * as React from 'react'
import { encodeFunctionData, erc20Abi, isHex, parseEther } from 'viem'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { useSendCalls } from 'wagmi/experimental'
import ChevronLeftIcon from '~icons/lucide/chevron-left'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import CircleCheckIcon from '~icons/lucide/circle-check'
import OctagonAlertIcon from '~icons/lucide/octagon-alert'
import SendHorizontalIcon from '~icons/lucide/send-horizontal'
import XIcon from '~icons/lucide/x'

import { Button as OurButton } from '~/components/Button'
import { Pill } from '~/components/Pill'
import { type TokenBalance, useTokenBalances } from '~/hooks/use-blockscout-api'
import { StringFormatter, ValueFormatter } from '~/utils'

export function SendDialog({
  className,
}: {
  className?: string
}) {
  const send = useSendCalls()

  const account = useAccount()
  const { data: tokenData } = useTokenBalances({
    address: account.address,
  })

  const receiptQuery = useWaitForTransactionReceipt({
    hash: send.data as Hex.Hex,
    query: {
      enabled: isHex(send.data),
    },
  })

  const [isOpen, setIsOpen] = React.useState(false)
  const [isAssetSelectorOpen, setIsAssetSelectorOpen] = React.useState(false)

  const [selectedAsset, setSelectedAsset] = React.useState<TokenBalance | null>(
    tokenData?.[0] ?? null,
  )

  const isSending = send.isPending || receiptQuery.fetchStatus === 'fetching'

  const [amount, setAmount] = React.useState('')
  const amountExceedsBalance =
    parseEther(amount) > BigInt(selectedAsset?.value ?? 0)

  return (
    <Ariakit.DialogProvider>
      <Ariakit.Button
        onClick={() => setIsOpen(true)}
        className={cx(
          className,
          'w-[105px] text-center font-semibold text-lg sm:mt-0.75 sm:w-[260px] sm:text-md',
          'flex h-11! items-center justify-center gap-x-1 sm:h-10',
          'sm:col-span-2 sm:col-start-1 sm:row-span-1 sm:place-self-stretch',
          'col-span-1 col-start-1',
          'rounded-default bg-gray12! hover:bg-gray11!',
        )}
      >
        <SendHorizontalIcon className="size-6 text-gray1" />
        <span className="text-gray1">Send</span>
      </Ariakit.Button>
      <Ariakit.Dialog
        open={isOpen}
        onClose={() => [send.reset(), setIsOpen(false)]}
        className={cx(
          'dialog',
          'w-full sm:max-w-[420px]',
          'bottom-0! mt-auto! mb-4! sm:bottom-auto! sm:mt-35! sm:mb-0!',
          'w-full max-w-[90%] rounded-3xl! border-0 px-0! py-5 shadow-xl',
        )}
        backdrop={<div className="bg-gray12/40 backdrop-blur-xs" />}
      >
        {send.isPending ? (
          <SendingView />
        ) : send.isSuccess ? (
          <SuccessView hash={send.data} />
        ) : (
          <React.Fragment>
            <Ariakit.DialogHeading className="flex items-center justify-between px-5 py-0 text-left">
              {isAssetSelectorOpen ? (
                <div className="flex flex-row items-center gap-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAssetSelectorOpen(false)}
                    className="my-auto flex size-7 items-center justify-center rounded-full bg-gray4"
                  >
                    <ChevronLeftIcon className="mr-0.5 size-6 text-gray10" />
                  </button>
                  <p className="font-medium text-xl">Select asset</p>
                </div>
              ) : (
                <p className="font-medium text-lg">Send</p>
              )}
              {!isAssetSelectorOpen && (
                <Ariakit.DialogDismiss className="text-secondary/50">
                  <XIcon className="size-4" />
                </Ariakit.DialogDismiss>
              )}
            </Ariakit.DialogHeading>
            <form
              name="send"
              className="w-full"
              onSubmit={async (event) => {
                event.preventDefault()
                try {
                  if (!account.address || !Address.validate(account.address))
                    return

                  const formData = new FormData(event.currentTarget)
                  const to = formData.get('to') as string
                  if (!to || !Address.validate(to)) return
                  const amount = formData.get('amount') as string

                  const tokenAddress = selectedAsset?.token.address
                  if (!tokenAddress || !Address.validate(tokenAddress)) return

                  send.sendCalls({
                    account: account.address,
                    calls: [
                      {
                        to: tokenAddress,
                        data: encodeFunctionData({
                          abi: erc20Abi,
                          functionName: 'transfer',
                          args: [to, parseEther(amount)],
                        }),
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
                <p id="send-funds" className="text-gray10 text-sm">
                  Select asset
                </p>
              </div>

              {/* Asset Selector */}
              <div className="mt-3 mb-1 flex w-full flex-col gap-y-1.5">
                <div className="px-5">
                  <button
                    type="button"
                    hidden={isAssetSelectorOpen}
                    onClick={() => setIsAssetSelectorOpen(!isAssetSelectorOpen)}
                    className="flex h-14! w-full justify-between gap-x-2 rounded-xl border-2 border-gray4 px-3 py-2.5 text-left font-medium text-lg text-primary shadow-none! hover:bg-secondary"
                  >
                    <img
                      src={
                        selectedAsset?.token?.icon_url ||
                        `/icons/${selectedAsset?.token?.symbol?.toLowerCase()}.svg`
                      }
                      alt={selectedAsset?.token?.name}
                      className="my-auto size-8 rounded-full"
                    />
                    <p className="my-auto mr-auto text-left font-medium text-xl">
                      {selectedAsset?.token.name ?? selectedAsset?.token.symbol}
                    </p>
                    <div className="my-auto flex size-7 items-center justify-center rounded-full bg-gray4">
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
                  className={cx(
                    'flex w-full items-center',
                    'h-14 rounded-xl border-2 border-gray4 px-3.5 py-2 text-left font-medium hover:bg-secondary',
                  )}
                >
                  <input
                    name="amount"
                    type="number"
                    inputMode="decimal"
                    className={cx(
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
                    disabled={isSending}
                    onChange={(e) => setAmount(e.target.value)}
                  />

                  <img
                    src={
                      selectedAsset?.token?.icon_url ||
                      `/icons/${selectedAsset?.token?.symbol?.toLowerCase()}.svg`
                    }
                    alt={selectedAsset?.token?.name}
                    className="size-6 rounded-full"
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
                  className={cx(
                    'flex w-full items-center',
                    'h-14 rounded-xl border-2 border-gray4 py-2 pl-3.5 text-left font-medium hover:bg-secondary',
                  )}
                >
                  <ReceiverInput />
                </div>
              </div>

              <div className="max-h-[350px] max-w-[400px] overflow-x-auto pl-5">
                {send.isError && (
                  <div className="overflow-x-auto bg-red3 p-2">
                    <p className="text-pretty font-mono text-xs">
                      {send.error.message}
                    </p>
                  </div>
                )}
              </div>
              {/* Action Buttons */}
              <div
                className="mt-4 mb-3 flex flex-row gap-x-3 px-5 *:h-12 *:w-full *:select-none *:font-medium *:text-lg"
                hidden={isAssetSelectorOpen}
              >
                <Ariakit.DialogDismiss
                  form="send"
                  type="reset"
                  name="cancel"
                  disabled={isSending}
                  className="rounded-full border-2 border-gray6 bg-gray5 text-primary hover:bg-gray4"
                >
                  Cancel
                </Ariakit.DialogDismiss>
                <OurButton
                  type="submit"
                  disabled={!amount || isSending}
                  className={cx('rounded-full border-2 border-gray6')}
                  variant={!!amount && !isSending ? 'accent' : 'default'}
                >
                  Send
                </OurButton>
              </div>
            </form>
          </React.Fragment>
        )}
      </Ariakit.Dialog>
    </Ariakit.DialogProvider>
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
        <div className="flex min-h-[200px] flex-col items-center justify-center px-5 text-gray10">
          <p>No assets available</p>
        </div>
      ) : (
        <div className="overflow-y-auto">
          {tokenData?.map((asset, index) => (
            <button
              type="button"
              key={asset.token.symbol}
              className={cx(
                'flex w-full flex-row items-center justify-between border-gray4 border-b-2 px-5 py-3 hover:bg-gray4',
                index === 0 && 'border-t-2',
              )}
              onClick={() => {
                handleAssetSelect(asset)
                setIsAssetSelectorOpen(false)
              }}
            >
              <div className="flex items-center gap-2 ">
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
                    {asset.token.name ?? asset.token.symbol}
                  </span>
                  <span className="mr-auto text-gray10 text-sm">
                    {asset.token.symbol ?? asset.token.name}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end ">
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
                  <Pill>{asset.token.symbol}</Pill>
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
        className={cx(
          'slashed-zero tabular-nums placeholder:slashed-zero',
          'size-full text-left font-medium text-lg text-primary hover:bg-secondary focus:outline-none',
          validRecipient && !isFocused && 'text-transparent',
        )}
      />

      <span
        data-item="recipient"
        className={cx(
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
    <div className="flex flex-col justify-center pt-3 pb-2.5">
      <Ariakit.DialogDismiss className="ml-auto pr-5" />
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
        <div className="size-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
      <h2 className="mx-auto mb-2 font-medium text-2xl">Sending funds</h2>
      <p className="mx-auto text-balance text-center text-gray10">
        This won't take long at all. You can safely close this window now.
      </p>
      <Ariakit.DialogDismiss className="mx-auto mt-4 h-12! w-full max-w-[85%] rounded-full bg-gray5 text-xl! hover:bg-gray5">
        Close
      </Ariakit.DialogDismiss>
    </div>
  )
}

function SuccessView({ hash }: { hash: string }) {
  return (
    <div className="flex flex-col items-center justify-center pt-3 pb-2.5">
      <Ariakit.DialogDismiss className="ml-auto pr-5" />

      <div className="mt-4 mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
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
      <Ariakit.DialogDismiss className="mt-4 h-12! w-full max-w-[85%] rounded-full bg-gray5 text-xl! hover:bg-gray5">
        Done
      </Ariakit.DialogDismiss>
    </div>
  )
}
