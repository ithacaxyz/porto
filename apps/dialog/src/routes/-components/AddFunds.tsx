import * as Ariakit from '@ariakit/react'
import { Button } from '@porto/apps/components'
import { useCopyToClipboard } from '@porto/apps/hooks'
import { useMutation } from '@tanstack/react-query'
import { Cuer } from 'cuer'
import { Address, Hex, Value } from 'ox'
import { Hooks } from 'porto/remote'
import * as React from 'react'
import { PayButton } from '~/components/PayButton'
import * as FeeToken from '~/lib/FeeToken'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import ArrowRightIcon from '~icons/lucide/arrow-right'
import CheckIcon from '~icons/lucide/check'
import CopyIcon from '~icons/lucide/copy'
import CardIcon from '~icons/lucide/credit-card'
import PencilIcon from '~icons/lucide/pencil'
import QrCodeIcon from '~icons/lucide/qr-code'
import TriangleAlertIcon from '~icons/lucide/triangle-alert'
import XIcon from '~icons/lucide/x'

const presetAmounts = ['25', '50', '100', '250']

export function AddFunds(props: AddFunds.Props) {
  const {
    onApprove,
    onReject,
    onSuccess,
    tokenAddress,
    value = BigInt(presetAmounts[0]!),
  } = props

  const account = Hooks.useAccount(porto)
  const chain = Hooks.useChain(porto)
  const { data: feeToken } = FeeToken.useFetch({
    addressOrSymbol: tokenAddress,
  })

  const address = props.address ?? account?.address

  const [amount, setAmount] = React.useState<string>(value.toString())
  const [isCopied, copyToClipboard] = useCopyToClipboard({ timeout: 2_000 })
  const [view, setView] = React.useState<
    'default' | 'deposit-crypto' | 'success' | 'error'
  >('default')

  const deposit = useMutation({
    async mutationFn(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      e.stopPropagation()

      if (!address) throw new Error('address is required')
      if (!chain) throw new Error('chain is required')
      if (!feeToken) throw new Error('feeToken is required')

      const value = Value.from(amount, feeToken.decimals)
      const params = new URLSearchParams({
        address,
        chainId: chain.id.toString(),
        value: value.toString(),
      })
      const response = await fetch(
        `${import.meta.env.VITE_FAUCET_URL || 'https://faucet.porto.workers.dev'}?${params.toString()}`,
      )
      if (!response.ok) throw new Error('Failed to fetch funds')
      const data = (await response.json()) as { id: Hex.Hex }
      return data
    },
    onSuccess: () => {
      setView('success')
      onSuccess?.()
    },
  })

  const loading = deposit.isPending

  const [editView, setEditView] = React.useState<'default' | 'editing'>(
    'default',
  )

  if (view === 'default')
    return (
      <Layout loading={loading} loadingTitle="Adding funds...">
        <Layout.Header>
          <Layout.Header.Default
            content="Select how much you will deposit."
            title="Deposit funds"
          />
        </Layout.Header>

        <Layout.Content>
          <form
            className="grid h-min grid-flow-row auto-rows-min grid-cols-1 space-y-3"
            onSubmit={(e) => deposit.mutate(e)}
          >
            <div className="col-span-1 row-span-1">
              <div className="flex max-h-[42px] w-full max-w-full flex-row justify-center space-x-2">
                {editView === 'editing' ? (
                  <div className="relative flex w-full flex-row items-center justify-between rounded-lg border-[1.5px] border-transparent bg-gray4/45 px-3 py-2.5 text-gray12 focus-within:border-blue9 focus-within:bg-gray4/75 has-invalid:border-red8 dark:bg-gray3">
                    <span className="-translate-y-1/2 absolute top-1/2 left-3 text-gray11">
                      $
                    </span>
                    <input
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      // biome-ignore lint/a11y/noAutofocus:
                      autoFocus
                      className="h-full max-h-[96%] w-full max-w-[50%] bg-transparent pl-3 placeholder:text-gray8 focus:outline-none"
                      inputMode="decimal"
                      max={500}
                      min={0}
                      onChange={(event) =>
                        event.target.value.length > 0
                          ? setAmount(event.target.value)
                          : setAmount('')
                      }
                      placeholder="Enter amount"
                      required
                      spellCheck={false}
                      type="number"
                      value={amount}
                      // should add disabled` if testnet?
                    />
                    <span className="text-gray9 text-sm">Max. $500</span>
                  </div>
                ) : (
                  <Ariakit.RadioProvider
                    setValue={(value) => setAmount(value as string)}
                    value={amount}
                  >
                    <Ariakit.RadioGroup className="flex w-full gap-3 *:h-10.5">
                      {presetAmounts.map((predefinedAmount) => (
                        // biome-ignore lint/a11y/noLabelWithoutControl:
                        <label
                          className="flex w-full justify-center rounded-[10px] border-[1.5px] border-gray4 py-2 text-center align-center text-gray11 leading-normal hover:bg-gray3 has-checked:border-[1.5px] has-checked:border-blue9 has-checked:bg-gray4 has-checked:text-primary"
                          key={predefinedAmount}
                        >
                          <Ariakit.VisuallyHidden>
                            <Ariakit.Radio value={predefinedAmount} />
                          </Ariakit.VisuallyHidden>
                          ${predefinedAmount}
                        </label>
                      ))}
                    </Ariakit.RadioGroup>
                  </Ariakit.RadioProvider>
                )}
                <Ariakit.Button
                  className="flex min-w-[42px] flex-row items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-gray4 py-2 text-center text-gray11 hover:bg-gray3 has-checked:border-[1.5px] has-checked:border-blue9 has-checked:bg-gray4 has-checked:text-primary"
                  onClick={() =>
                    setEditView(editView === 'default' ? 'editing' : 'default')
                  }
                >
                  {editView === 'editing' ? (
                    <XIcon className="size-6" />
                  ) : (
                    <PencilIcon className="size-4" />
                  )}
                </Ariakit.Button>
              </div>
            </div>
            <div className="col-span-1 row-span-1 space-y-3.5">
              <Button className="w-full flex-1" type="submit" variant="accent">
                Buy & deposit
              </Button>
              {import.meta.env.VITE_FLAGS?.includes('onramp') && (
                <>
                  <PayButton variant="apple" />
                  <PayButton variant="google" />
                </>
              )}
            </div>
            <div className="col-span-1 row-span-1">
              <div className="my-auto flex w-full flex-row items-center gap-2 *:border-gray7">
                <hr className="flex-1" />
                <span className="px-3 text-gray9">or</span>
                <hr className="flex-1" />
              </div>
            </div>
            <div className="col-span-1 row-span-1 space-y-2.5">
              <Button
                className="w-full px-3!"
                onClick={() => setView('deposit-crypto')}
                type="button"
              >
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCodeIcon className="size-5" />
                    <span>Deposit crypto</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="ml-auto font-normal text-gray10 text-sm">
                      Instant
                    </span>
                    <ArrowRightIcon className="size-4 text-gray10" />
                  </div>
                </div>
              </Button>
              {import.meta.env.VITE_FLAGS?.includes('onramp') && (
                <Button className="w-full px-3!" type="button">
                  <div className="flex w-full flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardIcon className="size-5" />
                      <span>Debit or Credit</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="ml-auto font-normal text-gray10 text-sm">
                        ~5 mins
                        <ArrowRightIcon className="ml-1 inline size-4" />
                      </span>
                    </div>
                  </div>
                </Button>
              )}
            </div>
          </form>
        </Layout.Content>
      </Layout>
    )

  if (view === 'deposit-crypto')
    return (
      <Layout loading={loading} loadingTitle="Adding funds...">
        <Layout.Content className="py-3 text-center">
          <Ariakit.Button
            className="mx-auto flex h-[148px] items-center justify-center gap-4 rounded-lg border border-surface bg-secondary p-4 hover:cursor-pointer!"
            onClick={() => copyToClipboard(address ?? '')}
          >
            <Cuer.Root errorCorrection="low" value={address ?? ''}>
              <Cuer.Cells />
              <Cuer.Finder radius={1} />
            </Cuer.Root>
            <p className="min-w-[6ch] max-w-[6ch] text-pretty break-all font-mono font-normal text-gray10 text-xs">
              {address}
            </p>
          </Ariakit.Button>

          <div className="h-4" />

          <div className="font-medium text-[18px]">Deposit funds</div>
          <div className="h-1" />
          <div className="text-secondary">
            Send crypto to fund your account.
          </div>
        </Layout.Content>

        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button
              className="w-full text-[14px]"
              onClick={() => setView('default')}
              type="button"
              variant="default"
            >
              Back
            </Button>
            <Button
              className="w-full text-[14px]"
              onClick={() => copyToClipboard(address ?? '')}
              type="button"
              variant="default"
            >
              <CopyIcon className="mr-1.5 size-4" />
              {isCopied ? 'Copied' : 'Copy'}
            </Button>
          </Layout.Footer.Actions>

          {chain && (
            <div className="px-3 text-center text-secondary text-sm">
              Please only send assets on {chain.name}. Support for more networks
              soon.
            </div>
          )}
        </Layout.Footer>
      </Layout>
    )

  if (view === 'success')
    return (
      <Layout>
        <Layout.Header>
          <Layout.Header.Default
            content="Your funds have been deposited to your Porto account."
            icon={CheckIcon}
            title={`Deposited $${amount}`}
            variant="success"
          />
        </Layout.Header>

        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button
              className="flex-grow"
              onClick={() => onApprove({ id: deposit.data!.id })}
              variant="default"
            >
              Done
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
      </Layout>
    )

  if (view === 'error')
    return (
      <Layout>
        <Layout.Header>
          <Layout.Header.Default
            icon={TriangleAlertIcon}
            title="Deposit failed"
            variant="destructive"
          />
        </Layout.Header>

        <Layout.Content className="px-1">
          <p className="text-primary">Your deposit was cancelled or failed.</p>
          <p className="text-secondary">No funds have been deposited.</p>
        </Layout.Content>

        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button
              className="flex-grow"
              onClick={() => onReject?.()}
              variant="default"
            >
              Close
            </Button>
            <Button
              className="flex-grow"
              onClick={() => setView('default')}
              variant="accent"
            >
              Try again
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
      </Layout>
    )

  return null
}

export declare namespace AddFunds {
  export type Props = {
    address?: Address.Address | undefined
    onApprove: (result: { id: Hex.Hex }) => void
    onReject?: () => void
    onSuccess?: () => void
    tokenAddress: Address.Address
    value?: bigint | undefined
  }
}
