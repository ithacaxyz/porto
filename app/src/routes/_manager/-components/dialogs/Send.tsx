import { Address } from 'ox'
import { useEffect, useState } from 'react'
import { encodeFunctionData, isHex, parseEther } from 'viem'
import { useAccount, useConnectors, useWaitForTransactionReceipt } from 'wagmi'
import { useSendCalls } from 'wagmi/experimental'
import CircleCheckIcon from '~icons/lucide/circle-check'
import OctagonAlertIcon from '~icons/lucide/octagon-alert'
import SendHorizontalIcon from '~icons/lucide/send-horizontal'

import { Button as OurButton } from '~/components/Button'
import { Pill } from '~/components/Pill'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import * as Select from '~/components/ui/select'
import {
  type TokenBalance,
  useTokenBalance,
} from '~/hooks/use-address-token-balances'
import { ExperimentERC20 } from '~/lib/Constants'
import { config, wagmiClient } from '~/lib/Wagmi'
import { StringFormatter, ValueFormatter, cn } from '~/utils'

export function SendDialog({
  className,
}: {
  className?: string
}) {
  const { address } = useAccount()
  const send = useSendCalls({ config: config })
  const { data: tokenData } = useTokenBalance({ address })

  const receiptQuery = useWaitForTransactionReceipt({
    chainId: wagmiClient.chain.id,
    hash: send.data as never,
    query: {
      enabled: isHex(send.data),
    },
  })

  const [selectedAsset, setSelectedAsset] = useState<TokenBalance | null>(
    tokenData?.[0] ?? null,
  )

  const isSending = send.isPending || receiptQuery.fetchStatus === 'fetching'

  const [amount, setAmount] = useState('')

  const [recipient, setRecipient] = useState('')
  const [isRecipientFocused, setIsRecipientFocused] = useState(false)
  const [truncatedRecipient, setTruncatedRecipient] = useState('')
  const validRecipient = Address.validate(recipient)
  // Update truncated recipient for display
  useEffect(() => {
    if (recipient && recipient.length > 14) {
      setTruncatedRecipient(
        StringFormatter.truncate(recipient, { start: 8, end: 6 }),
      )
    }
  }, [recipient])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <OurButton
          variant="invert"
          className={cn(
            className,
            'mt-0.75 w-[110px] text-center font-semibold text-lg sm:w-[252px] sm:text-md',
            'flex h-11! items-center justify-center gap-x-1 sm:h-10',
            'sm:col-span-2 sm:col-start-1 sm:row-span-1 sm:place-self-stretch',
            'col-span-1 col-start-1',
          )}
        >
          <SendHorizontalIcon className="size-6" />
          <DialogTitle>Send</DialogTitle>
        </OurButton>
      </DialogTrigger>
      <DialogContent
        title="Send"
        aria-describedby="Transfer funds to another address."
        className="rounded-xl border-0 bg-primary p-5 shadow-xl sm:max-w-[400px]"
      >
        <DialogHeader className="p-0">
          <form
            name="send"
            className="w-full max-w-[400px]"
            onSubmit={async (event) => {
              event.preventDefault()
              console.info('submit')

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

                    data: encodeFunctionData({
                      abi: ExperimentERC20.abi,
                      functionName: 'transfer',
                      args: [to, parseEther(amount)],
                    }),
                  },
                ],
              })

              console.info(send.status)
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg">Send</h3>
                <p id="send-funds" className="text-gray10 text-sm">
                  Transfer funds to another address.
                </p>
              </div>
            </div>

            {/* Asset Selector */}
            <div className="mt-3 mb-1 flex flex-col gap-y-1.5">
              <label htmlFor="asset" className="ml-0.5 text-gray10 text-xs">
                Select asset
              </label>
              <Select.Select
                defaultValue={selectedAsset?.token.name}
                value={selectedAsset?.token.address}
                onValueChange={(value) => {
                  const token = tokenData?.find(
                    (token) => token.token.address === value,
                  )
                  setSelectedAsset(token ?? null)
                }}
              >
                <Select.SelectTrigger className="flex h-12! w-full justify-between gap-x-2 rounded-xl border-2 border-gray4 px-3.5 py-2.5 text-left font-medium text-lg text-primary hover:bg-secondary">
                  <img
                    src={
                      selectedAsset?.token.icon_url ||
                      `/icons/${selectedAsset?.token.symbol.toLowerCase()}.svg`
                    }
                    alt={selectedAsset?.token.name}
                    className="size-6 rounded-full"
                  />

                  <p className="mr-auto text-left">
                    <Select.SelectValue
                      defaultValue={selectedAsset?.token.address}
                      placeholder={selectedAsset?.token.name}
                    />
                  </p>
                </Select.SelectTrigger>

                <Select.SelectContent
                  className="bg-gray1"
                  defaultValue={selectedAsset?.token.address}
                >
                  <Select.SelectGroup>
                    {tokenData?.map((token) => (
                      <Select.SelectItem
                        key={token.token.address}
                        value={token.token.address}
                        className="px-4 text-lg"
                      >
                        {token.token.name}
                      </Select.SelectItem>
                    ))}
                  </Select.SelectGroup>
                </Select.SelectContent>
              </Select.Select>
            </div>

            {/* Amount Input */}
            <div className="mt-3 mb-1 flex flex-col gap-y-1.5">
              <div className="flex items-center justify-between gap-x-2">
                <label htmlFor="amount" className="ml-0.5 text-gray10 text-xs">
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
                  'h-12 rounded-xl border-2 border-gray4 px-3.5 py-2 text-left font-medium hover:bg-secondary',
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
              {amount && Number(amount) > Number(selectedAsset?.value) && (
                <div className="mt-1 rounded-2xl bg-[#FEEBEC] px-2 py-1.5 text-gray11">
                  <p className="flex items-center justify-center gap-x-1">
                    <OctagonAlertIcon className="size-5 text-red-500" />
                    <span className="font-semibold text-red-500">
                      Exceeds balance.
                    </span>
                    You hold {Number(selectedAsset?.value)}{' '}
                    {selectedAsset?.token.symbol}.
                  </p>
                </div>
              )}
            </div>

            {/* Recipient Address */}
            <div className="my-3 flex flex-col gap-y-1">
              <label
                htmlFor="recipient"
                className="pointer-events-none ml-0.5 text-left text-gray10 text-xs"
              >
                Send to...
              </label>
              <div
                className={cn(
                  'flex w-full items-center',
                  'h-12 rounded-xl border-2 border-gray4 py-2 pl-3.5 text-left font-medium hover:bg-secondary',
                )}
              >
                <input
                  name="to"
                  maxLength={42}
                  minLength={42}
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  placeholder="0xAbCd..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  onFocus={() => setIsRecipientFocused(true)}
                  onBlur={(e) => {
                    if (e.target.value.length <= 14) return
                    setIsRecipientFocused(false)
                  }}
                  className={cn(
                    'slashed-zero tabular-nums placeholder:slashed-zero',
                    'size-full text-left font-medium text-lg text-primary hover:bg-secondary focus:outline-none',
                    validRecipient && !isRecipientFocused && 'text-transparent',
                  )}
                />
                <span
                  data-item="recipient"
                  className={cn(
                    'pointer-events-none absolute font-medium text-lg text-primary',
                    (!validRecipient || isRecipientFocused) &&
                      'invisible hidden text-transparent',
                  )}
                >
                  {truncatedRecipient}
                </span>
                {validRecipient && !isRecipientFocused && (
                  <CircleCheckIcon className="my-auto mr-3 ml-auto size-6 rounded-full text-emerald-600" />
                )}
              </div>
            </div>
            <pre>
              {JSON.stringify(
                { status: send.status, success: send.isSuccess },
                undefined,
                2,
              )}
            </pre>
            {/* Action Buttons */}
            <div className="mt-4 mb-3 flex flex-row gap-x-3 *:h-12 *:w-full *:select-none *:font-medium *:text-lg">
              <DialogClose asChild>
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
              </DialogClose>
              <OurButton
                type="submit"
                className={cn('rounded-full border-2')}
                disabled={!!amount || validRecipient || isSending}
                variant={
                  !!amount && validRecipient && !isSending ? 'accent' : 'ghost'
                }
              >
                Send
              </OurButton>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
