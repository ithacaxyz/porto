import * as Ariakit from '@ariakit/react'
import { Address } from 'ox'
import { useEffect, useState } from 'react'
import ChevronLeftIcon from '~icons/lucide/chevron-left'
import ChevronRightIcon from '~icons/lucide/chevron-right'
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
  DialogTrigger,
} from '~/components/ui/dialog'
import { StringFormatter, ValueFormatter, cn } from '~/utils'

// Mock data for asset selection

const availableAssets = [
  {
    id: 'exp',
    name: 'Experiment',
    symbol: 'EXP',
    balance: 3.354,
    usdBalance: 13350.41,
    icon: '/icons/exp.svg',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: 3.354,
    usdBalance: 13350.41,
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
  },
  {
    id: 'wbtc',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    balance: 0.145,
    usdBalance: 12991.27,
    icon: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg',
  },
  {
    id: 'op',
    name: 'Optimism',
    symbol: 'OP',
    balance: 1970.44,
    usdBalance: 6601.88,
    icon: '/icons/op.svg',
  },
  {
    id: 'vine',
    name: 'Vine Coin',
    symbol: 'VINE',
    balance: 12401.11,
    usdBalance: 2118.19,
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
  },
  {
    id: 'shib',
    name: 'Shiba Coin',
    symbol: 'SHIB',
    balance: 123456.78,
    usdBalance: 50.11,
    icon: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.svg',
  },
]
type SendStep = 'mainForm' | 'assetSelector' | 'sending' | 'success'

export function Send({
  className,
}: {
  className?: string
}) {
  const [step, setStep] = useState<SendStep>('mainForm')
  const [selectedAsset, setSelectedAsset] = useState(availableAssets[0]!)

  const [values, setValues] = useState<{
    asset: string
    recipient: string
    amount: string
  }>({ asset: availableAssets[0]!.id, recipient: '', amount: '' })

  const form = Ariakit.useFormStore({
    values,
    setValues,
  })

  const [formIsValid, setFormIsValid] = useState(false)
  const [truncatedRecipient, setTruncatedRecipient] = useState('')
  const [isRecipientFocused, setIsRecipientFocused] = useState(false)

  const validRecipient = Address.validate(form.getValue(form.names.recipient))

  // Validate form
  useEffect(() => {
    const asset = values.asset
    const amount = Number(values.amount)
    const recipient = values.recipient

    const hasAsset = Boolean(asset)
    const hasValidAmount = amount > 0 && amount <= selectedAsset.balance
    const hasValidRecipient = Boolean(recipient && Address.validate(recipient))

    setFormIsValid(
      hasAsset && hasValidAmount && hasValidRecipient && amount > 0,
    )

    // Update truncated recipient
    if (recipient && recipient.length > 14) {
      setTruncatedRecipient(
        StringFormatter.truncate(recipient, { start: 8, end: 6 }),
      )
    }
  }, [values, selectedAsset])

  const handleAssetSelect = (asset: (typeof availableAssets)[number]) => {
    setSelectedAsset(asset)
    setValues({ ...values, asset: asset.id })
    setStep('mainForm')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formIsValid) {
      setStep('sending')
      // Simulate transaction
      setTimeout(() => {
        setStep('success')
      }, 2000)
    }
  }

  const handleReset = () => {
    form.reset()
    setStep('mainForm')
    setSelectedAsset(availableAssets[0]!)
    setValues({ asset: availableAssets[0]!.id, recipient: '', amount: '' })
    setIsRecipientFocused(false)
  }

  // Asset selector view
  const renderAssetSelector = () => (
    <div className="flex min-h-[300px] flex-col">
      <div className="mb-4 flex items-center">
        <button
          type="button"
          onClick={() => setStep('mainForm')}
          className="mr-2 rounded-full p-1 hover:bg-gray2"
        >
          <ChevronLeftIcon className="size-5" />
        </button>
        <h2 className="font-medium text-lg">Select asset</h2>
      </div>
      <div className="max-h-[370px] overflow-y-auto">
        {availableAssets.map((asset) => (
          <button
            type="button"
            key={asset.id}
            className="flex w-full items-center justify-between border-gray4 border-b p-3 hover:bg-gray2"
            onClick={() => handleAssetSelect(asset)}
          >
            <div className="flex items-center gap-2">
              <img
                src={asset.icon}
                alt={asset.name}
                className="size-6 rounded-full"
              />
              <span className="font-medium">{asset.name}</span>
              <span className="text-gray10">{asset.symbol}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-medium">
                ${ValueFormatter.format(asset.usdBalance)}
              </span>
              <span className="text-gray10 text-sm">
                {ValueFormatter.format(asset.balance)} {asset.symbol}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  // Sending status view
  const renderSendingStatus = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
        <div className="size-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
      <h2 className="mb-2 font-medium text-lg">Sending funds</h2>
      <p className="text-center text-gray10">
        This won't take long at all. You can safely close this window now.
      </p>
      <DialogClose asChild>
        <OurButton
          variant="default"
          className="mt-4 w-full rounded-full"
          onClick={handleReset}
        >
          Close
        </OurButton>
      </DialogClose>
    </div>
  )

  // Success view
  const renderSuccessView = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
        <CircleCheckIcon className="size-12 text-green-500" />
      </div>
      <h2 className="mb-2 font-medium text-lg">Success!</h2>
      <p className="text-center text-gray10">
        Your funds were sent successfully. You can find a confirmation{' '}
        <a href="/" className="text-blue-500">
          here
        </a>
        .
      </p>
      <DialogClose asChild>
        <OurButton
          variant="default"
          className="mt-4 w-full rounded-full"
          onClick={handleReset}
        >
          Done
        </OurButton>
      </DialogClose>
    </div>
  )

  // Main form view
  const renderMainForm = () => (
    <Ariakit.Form
      store={form}
      aria-labelledby="send-funds"
      className="w-full max-w-[400px]"
      onSubmit={handleSubmit}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-lg ">Send</h3>
          <p id="send-funds" className="text-gray10 text-sm">
            Transfer funds to another address.
          </p>
        </div>
      </div>

      {/* Asset Selector */}
      <div className="mt-3 mb-1 flex flex-col gap-y-1.5">
        <Ariakit.FormLabel
          name={form.names.asset}
          className="ml-0.5 text-gray10 text-xs"
        >
          Select asset
        </Ariakit.FormLabel>
        <button
          type="button"
          className="flex h-14 items-center gap-x-2 rounded-xl border-2 border-gray4 px-3.5 py-2.5 text-left font-medium text-lg text-primary hover:bg-secondary"
          onClick={() => setStep('assetSelector')}
        >
          <img
            src={selectedAsset.icon}
            alt={selectedAsset.name}
            className="size-6 rounded-full"
          />
          <span className="mb-0.5">{selectedAsset.name}</span>
          <ChevronRightIcon className="ml-auto size-6 rounded-full bg-gray4 p-1" />
        </button>
        <Ariakit.FormError
          className=""
          name={form.names.asset}
          render={(props) => {
            const error = form.getError(form.names.asset)
            if (!error) return null
            return (
              <div
                {...props}
                className="mt-1 rounded-2xl bg-[#FEEBEC] px-2 py-1.5 text-gray11"
              >
                {error}
              </div>
            )
          }}
        />
      </div>

      {/* Amount Input */}
      <div className="mt-3 mb-1 flex flex-col gap-y-1.5">
        <div className="flex items-center justify-between gap-x-2">
          <Ariakit.FormLabel
            name={form.names.amount}
            className="ml-0.5 text-gray10 text-xs"
          >
            Enter amount
          </Ariakit.FormLabel>
          <p className="ml-auto text-gray11 text-sm">
            {selectedAsset.balance} <span className="text-gray10">held</span>
          </p>
          <Pill className="rounded-2xl font-medium">
            <button
              type="button"
              className="px-0.5 text-xs"
              onClick={() =>
                form.setValue(
                  form.names.amount,
                  selectedAsset.balance.toString(),
                )
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
          <Ariakit.FormInput
            type="number"
            inputMode="decimal"
            className={cn(
              'slashed-zero tabular-nums placeholder:slashed-zero',
              'size-full text-left font-medium text-2xl text-primary/80 hover:bg-secondary focus:outline-none',
            )}
            min={0}
            max={selectedAsset.balance}
            required={true}
            placeholder="0.00"
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="off"
            name={form.names.amount}
          />

          <img
            src={selectedAsset.icon}
            alt={selectedAsset.name}
            className="size-5 rounded-full"
          />
          <span className="ml-2 text-gray10 text-lg">
            {selectedAsset.symbol}
          </span>
        </div>
        <Ariakit.FormError
          name={form.names.amount}
          render={(props) => {
            const value = form.getValue(form.names.amount)
            if (!value) return null
            const max = selectedAsset.balance

            if (Number.parseFloat(value) <= max) return null

            return (
              <div
                {...props}
                className="mt-1 rounded-2xl bg-[#FEEBEC] px-2 py-1.5 text-gray11"
              >
                <p className="flex items-center justify-center gap-x-1">
                  <OctagonAlertIcon className="size-5 text-red-500" />
                  <span className="font-semibold text-red-500">
                    Exceeds balance.
                  </span>
                  You hold {max} {selectedAsset.symbol}.
                </p>
              </div>
            )
          }}
        />
      </div>

      {/* Recipient Address */}
      <div className="my-3 flex flex-col gap-y-1">
        <Ariakit.FormLabel
          name={form.names.recipient}
          className="pointer-events-none ml-0.5 text-left text-gray10 text-xs"
        >
          Send to...
        </Ariakit.FormLabel>
        <div
          className={cn(
            'flex w-full items-center',
            'h-12 rounded-xl border-2 border-gray4 py-2 pl-3.5 text-left font-medium hover:bg-secondary',
          )}
        >
          <Ariakit.FormInput
            maxLength={42}
            minLength={42}
            autoCorrect="off"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            placeholder="0xAbCd..."
            name={form.names.recipient}
            onFocus={() => setIsRecipientFocused(true)}
            onBlur={(event) => {
              const input = event.currentTarget
              if (input.value.length <= 14) return
              setTruncatedRecipient(
                StringFormatter.truncate(input.value, { start: 8, end: 6 }),
              )
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
        {/* <Ariakit.FormError
          className=""
          name={form.names.recipient}
          render={(props) => {
            const error = form.getError(form.names.recipient)
            if (!error) return null
            return (
              <div
                {...props}
                className="mt-1 rounded-2xl bg-red4 px-4 py-1.5 text-gray11 text-sm"
              >
                Must be a valid Ethereum address or ENS name.
              </div>
            )
          }}
        /> */}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 mb-3 flex flex-row gap-x-3 *:h-12 *:w-full *:select-none *:font-medium *:text-lg">
        <DialogClose asChild>
          <OurButton
            variant="default"
            className="rounded-full border-2 border-gray6 bg-gray5 text-primary hover:bg-gray4"
            onClick={handleReset}
          >
            Cancel
          </OurButton>
        </DialogClose>
        <OurButton
          type="submit"
          variant={formIsValid ? 'accent' : 'ghost'}
          disabled={!formIsValid}
          className={cn(
            formIsValid
              ? 'bg-accent text-white hover:bg-accent/90'
              : 'border-gray6 text-gray10 hover:bg-gray2',
            'rounded-full border-2',
          )}
        >
          Send
        </OurButton>
      </div>
    </Ariakit.Form>
  )

  const renderContent = () => {
    switch (step) {
      case 'assetSelector':
        return renderAssetSelector()
      case 'sending':
        return renderSendingStatus()
      case 'success':
        return renderSuccessView()
      default:
        return renderMainForm()
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          handleReset()
        }
      }}
    >
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
          <span>Send</span>
        </OurButton>
      </DialogTrigger>
      <DialogContent className="rounded-xl border-0 bg-white p-5 shadow-xl sm:max-w-[400px] ">
        <DialogHeader className="p-0">{renderContent()}</DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
