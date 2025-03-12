import * as Ariakit from '@ariakit/react'
import { Address, Value } from 'ox'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
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
import ChevronLeftIcon from '~icons/lucide/chevron-left'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import CircleCheckIcon from '~icons/lucide/circle-check'
import OctagonAlertIcon from '~icons/lucide/octagon-alert'
import SendHorizontalIcon from '~icons/lucide/send-horizontal'

import {
  type TokenBalance,
  useTokenBalance,
} from '~/hooks/use-address-token-balances'
import { StringFormatter, ValueFormatter, cn } from '~/utils'
// import { Hooks } from 'porto/wagmi'

type SendStep = 'mainForm' | 'assetSelector' | 'sending' | 'success'

export function SendDialog({
  className,
}: {
  className?: string
}) {
  const { address } = useAccount()
  const { data: tokenData } = useTokenBalance({ address })
  const [step, setStep] = useState<SendStep>('mainForm')

  // const availableAssets = useMemo<Asset[]>(() => {
  //   if (!tokenData?.length) return []

  //   console.info(tokenData)

  //   return tokenData
  //     ?.map((token) => {
  //       const balance =
  //         Number.parseFloat(token.value) /
  //         10 ** Number.parseInt(token.token.decimals)
  //       const usdBalance =
  //         balance * Number.parseFloat(token.token.exchange_rate || '0')

  //       // Get appropriate icon based on token symbol
  //       let icon = token.token_instance?.token?.icon_url || ''
  //       if (!icon) {
  //         icon = '/icons/exp.svg'
  //       }

  //       return {
  //         id: token.token.address,
  //         name: token.token.name,
  //         symbol: token.token.symbol,
  //         balance,
  //         usdBalance,
  //         icon,
  //         address: token.token.address,
  //       }
  //     })
  //     .filter((asset) => asset.balance > 0)
  // }, [tokenData])

  // Don't create a default asset if no assets are available
  const [selectedAsset, setSelectedAsset] = useState<TokenBalance | null>(null)

  const [values, setValues] = useState<{
    asset: string
    recipient: string
    amount: string
  }>({ asset: '', recipient: '', amount: '' })

  const form = Ariakit.useFormStore({
    values,
    setValues,
  })

  const [formIsValid, setFormIsValid] = useState(false)
  const [truncatedRecipient, setTruncatedRecipient] = useState('')
  const [isRecipientFocused, setIsRecipientFocused] = useState(false)

  const validRecipient = Address.validate(form.getValue(form.names.recipient))

  // For real implementation: send transaction logic would go here
  const sendTransaction = async (
    to: string,
    amount: string,
    tokenAddress: string,
  ) => {
    // This would be replaced with actual wallet transaction code
    console.info('Sending transaction:', { to, amount, tokenAddress })
    // Simulate successful transaction
    return new Promise<void>((resolve) => setTimeout(resolve, 2000))
  }

  // Update selected asset when availableAssets changes
  useEffect(() => {
    if (tokenData?.length) {
      setSelectedAsset(tokenData[0]!)
      setValues((prev) => ({ ...prev, asset: tokenData[0]!.token.address }))
    } else {
      setSelectedAsset(null)
      setValues((prev) => ({ ...prev, asset: '' }))
    }
  }, [tokenData])

  // Validate form
  useEffect(() => {
    const asset = values.asset
    const amount = Number(values.amount)
    const recipient = values.recipient

    const hasAsset = Boolean(asset)
    const hasValidAmount =
      selectedAsset && amount > 0 && amount <= Number(selectedAsset.value)
    const hasValidRecipient = Boolean(recipient && Address.validate(recipient))

    setFormIsValid(
      // @ts-expect-error
      hasAsset && hasValidAmount && hasValidRecipient && amount > 0,
    )

    // Update truncated recipient
    if (recipient && recipient.length > 14) {
      setTruncatedRecipient(
        StringFormatter.truncate(recipient, { start: 8, end: 6 }),
      )
    }
  }, [values, selectedAsset])

  const handleAssetSelect = (asset: TokenBalance) => {
    setSelectedAsset(asset)
    setValues({ ...values, asset: asset.token.address })
    setStep('mainForm')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formIsValid && selectedAsset) {
      setStep('sending')
      try {
        await sendTransaction(
          values.recipient,
          values.amount,
          selectedAsset.token.address,
        )
        setStep('success')
      } catch (error) {
        console.error('Transaction failed:', error)
        // In a real implementation, you would handle the error state here
        // For now, we'll just simulate success
        setStep('success')
      }
    }
  }

  const handleReset = () => {
    form.reset()
    setStep('mainForm')
    // if (tokenData?.length > 0) {
    //   setSelectedAsset(tokenData[0]!)
    //   setValues({ asset: tokenData[0]!.token.address, recipient: '', amount: '' })
    // } else {
    //   setSelectedAsset(null)
    //   setValues({ asset: '', recipient: '', amount: '' })
    // }
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
      {tokenData?.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center text-gray10">
          <p>No assets available</p>
        </div>
      ) : (
        <div className="max-h-[370px] overflow-y-auto">
          {tokenData?.map((asset) => (
            <button
              type="button"
              key={asset.token.address}
              className="flex w-full items-center justify-between border-gray4 border-b p-3 hover:bg-gray2"
              onClick={() => handleAssetSelect(asset)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={asset.token.icon_url || '/icons/exp.svg'}
                  alt={asset.token.name}
                  className="size-6 rounded-full"
                />
                <span className="font-medium">{asset.token.name}</span>
                <span className="text-gray10">{asset.token.symbol}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-medium">
                  $
                  {Value.format(
                    BigInt(asset.value),
                    Number(asset.token.decimals),
                  )}{' '}
                  {asset.token.symbol}
                </span>
                <span className="text-gray10 text-sm">
                  {Value.format(
                    BigInt(asset.value),
                    Number(asset.token.decimals),
                  )}
                  {asset.token.symbol}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
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
  const renderMainForm = () => {
    // If no assets are available, show a message
    if (!selectedAsset) {
      return (
        <div className="flex min-h-[300px] flex-col items-center justify-center p-4 text-center">
          <h3 className="mb-2 font-medium text-lg">No Assets Available</h3>
          <p className="text-gray10">
            You don't have any assets in your wallet to send.
          </p>
          <DialogClose asChild>
            <OurButton
              variant="default"
              className="mt-6 w-full rounded-full"
              onClick={handleReset}
            >
              Close
            </OurButton>
          </DialogClose>
        </div>
      )
    }

    return (
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
              src={selectedAsset.token.icon_url || '/icons/exp.svg'}
              alt={selectedAsset.token.name}
              className="size-6 rounded-full"
            />
            <span className="mb-0.5">{selectedAsset.token.name}</span>
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
              {ValueFormatter.format(BigInt(selectedAsset.value))}
              <span className="text-gray10">held</span>
            </p>
            <Pill className="rounded-2xl font-medium">
              <button
                type="button"
                className="px-0.5 text-xs"
                onClick={() =>
                  form.setValue(
                    form.names.amount,
                    selectedAsset.value.toString(),
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
              max={Number(selectedAsset.value)}
              required={true}
              placeholder="0.00"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              name={form.names.amount}
            />

            <img
              src={selectedAsset.token.icon_url || '/icons/exp.svg'}
              alt={selectedAsset.token.name}
              className="size-5 rounded-full"
            />
            <span className="ml-2 text-gray10 text-lg">
              {selectedAsset.token.symbol}
            </span>
          </div>
          <Ariakit.FormError
            name={form.names.amount}
            render={(props) => {
              const value = form.getValue(form.names.amount)
              if (!value) return null
              const max = Number(selectedAsset.value)

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
                    You hold {max} {selectedAsset.token.symbol}.
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
  }

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
        className="rounded-xl border-0 bg-white p-5 shadow-xl sm:max-w-[400px]"
      >
        <DialogHeader className="p-0">{renderContent()}</DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
