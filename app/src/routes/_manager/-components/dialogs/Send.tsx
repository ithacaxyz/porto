import { Address } from 'ox'
import * as React from 'react'
import { encodeFunctionData, isHex, parseEther } from 'viem'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { useSendCalls } from 'wagmi/experimental'
import CircleCheckIcon from '~icons/lucide/circle-check'
import OctagonAlertIcon from '~icons/lucide/octagon-alert'
import SendHorizontalIcon from '~icons/lucide/send-horizontal'

import { Button as OurButton } from '~/components/Button'
import { Pill } from '~/components/Pill'
import { Dialog } from '~/components/ui/dialog'

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

  const [selectedAsset, setSelectedAsset] = React.useState<TokenBalance | null>(
    tokenData?.[0] ?? null,
  )

  const isSending = send.isPending || receiptQuery.fetchStatus === 'fetching'

  const [amount, setAmount] = React.useState('')
  // const parsedAmount = ValueFormatter.format(BigInt(amount))

  // const validRecipient = Address.validate(recipient)

  return (
    <Dialog.Dialog>
      <Dialog.DialogTrigger asChild>
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
          <Dialog.DialogTitle>Send</Dialog.DialogTitle>
        </OurButton>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent
        onPointerDownOutside={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        title="Send"
        aria-describedby="Transfer funds to another address."
        className="rounded-xl border-0 bg-primary p-5 shadow-xl sm:max-w-[400px]"
      >
        {send.isPending ? (
          <SendingView handleReset={() => {}} />
        ) : send.isSuccess ? (
          <SuccessView hash={send.data} handleReset={() => {}} />
        ) : (
          <Dialog.DialogHeader className="p-0">
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
                          {/* <Select.SelectItemText> */}
                          {/* <img
                              src={token.token.icon_url || '/icons/exp.svg'}
                              alt={token.token.name}
                              className="size-6 rounded-full"
                            /> */}
                          {token.token.name}
                          {/* </Select.SelectItemText> */}
                        </Select.SelectItem>
                      ))}
                    </Select.SelectGroup>
                  </Select.SelectContent>
                </Select.Select>
              </div>

              {/* Amount Input */}
              <div className="mt-3 mb-1 flex flex-col gap-y-1.5">
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
                {amount &&
                  BigInt(amount) > BigInt(selectedAsset?.value ?? '0') && (
                    <div className="mt-1 rounded-2xl bg-[#FEEBEC] px-2 py-1.5 text-gray11">
                      <p className="flex items-center justify-center gap-x-1">
                        <OctagonAlertIcon className="size-5 text-red-500" />
                        <span className="font-semibold text-red-500">
                          Exceeds balance.
                        </span>
                        You hold{' '}
                        {ValueFormatter.format(
                          BigInt(selectedAsset?.value ?? 0),
                        )}{' '}
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
                  <ReceiverInput />
                </div>
              </div>
              <pre>
                {import.meta.env.DEV &&
                  JSON.stringify(
                    { status: send.status, success: send.isSuccess },
                    undefined,
                    2,
                  )}
              </pre>
              {/* Action Buttons */}
              <div className="mt-4 mb-3 flex flex-row gap-x-3 *:h-12 *:w-full *:select-none *:font-medium *:text-lg">
                <Dialog.DialogClose asChild>
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
                </Dialog.DialogClose>
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
          </Dialog.DialogHeader>
        )}
      </Dialog.DialogContent>
    </Dialog.Dialog>
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

function SendingView({
  handleReset,
}: {
  handleReset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
        <div className="size-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
      <h2 className="mb-2 font-medium text-2xl">Sending funds</h2>
      <p className="text-balance text-center text-gray10">
        This won't take long at all. You can safely close this window now.
      </p>
      <Dialog.DialogClose asChild>
        <OurButton
          variant="default"
          className="mt-4 h-12! w-full rounded-full bg-gray4! text-xl!"
          onClick={handleReset}
        >
          Close
        </OurButton>
      </Dialog.DialogClose>
    </div>
  )
}

function SuccessView({
  handleReset,
  hash,
}: {
  handleReset: () => void
  hash: string
}) {
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
      <Dialog.DialogClose asChild>
        <OurButton
          variant="default"
          onClick={handleReset}
          className="mt-4 h-12! w-full rounded-full bg-gray4! text-xl!"
        >
          Done
        </OurButton>
      </Dialog.DialogClose>
    </div>
  )
}
