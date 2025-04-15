import * as Ariakit from '@ariakit/react'
import { FeeToken } from '@porto/apps'
import { Button } from '@porto/apps/components'
import { useCopyToClipboard } from '@porto/apps/hooks'
import { useMutation } from '@tanstack/react-query'
import { Cuer } from 'cuer'
import { Address, Hex, Json, Value } from 'ox'

import { Hooks } from 'porto/remote'
import * as React from 'react'
import { useWaitForCallsStatus } from 'wagmi/experimental'

import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import ArrowRightIcon from '~icons/lucide/arrow-right'
import CheckIcon from '~icons/lucide/check'
import CopyIcon from '~icons/lucide/copy'
import LinkIcon from '~icons/lucide/link'
import QrCodeIcon from '~icons/lucide/qr-code'
import TriangleAlertIcon from '~icons/lucide/triangle-alert'
import BaseIcon from '~icons/token-branded/base'

const presetAmounts = ['25', '50', '100', '250']

export function AddFunds(props: AddFunds.Props) {
  const {
    onApprove,
    onReject,
    tokenAddress,
    value = BigInt(presetAmounts[0]!),
  } = props

  const account = Hooks.useAccount(porto)
  const chain = Hooks.useChain(porto)

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

      const token = FeeToken.feeTokens[chain.id][tokenAddress.toLowerCase()]
      if (!token) throw new Error('token is required')

      const value = Value.from(amount, token.decimals)
      const params = new URLSearchParams({
        address,
        chainId: chain.id.toString(),
        value: value.toString(),
      })
      const response = await fetch(
        `https://faucet.porto.workers.dev?${params.toString()}`,
      )
      if (!response.ok) throw new Error('Failed to fetch funds')
      const data = (await response.json()) as { id: Hex.Hex }
      return data
    },
  })

  const receipt = useWaitForCallsStatus({
    id: deposit.data?.id,
    query: {
      enabled: !!deposit.data?.id,
    },
    timeout: 10_000,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    if (receipt.status === 'success') setView('success')
    if (receipt.status === 'error' || receipt.data?.status === 'failure') {
      console.error(Json.stringify(receipt.data, undefined, 2))
      setView('error')
    }
  }, [receipt.status, receipt.data?.status])

  const loading = deposit.isPending || receipt.isFetching

  const Footer = () => (
    <Layout.Footer>
      {address && <Layout.Footer.Account address={address} />}
    </Layout.Footer>
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
              <div className="flex w-full max-w-full flex-row justify-center space-x-2">
                <Ariakit.RadioProvider
                  setValue={(value) => setAmount(value as string)}
                  value={amount}
                >
                  <Ariakit.RadioGroup className="flex w-full gap-1">
                    {presetAmounts.map((predefinedAmount) => (
                      // biome-ignore lint/a11y/noLabelWithoutControl:
                      <label
                        className="w-full rounded-[10px] border-[1.5px] border-gray4 py-2 text-center text-gray11 hover:bg-gray3 has-checked:border-[1.5px] has-checked:border-blue9 has-checked:bg-gray4 has-checked:text-primary"
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
              </div>
            </div>
            <div className="col-span-1 row-span-1">
              <div className="relative flex w-full flex-row items-center justify-between rounded-lg border-[1.5px] border-transparent bg-gray4 px-3 py-2.5 text-gray12 focus-within:border-blue9 focus-within:bg-gray4 has-invalid:border-red8 dark:bg-gray3">
                <span className="-translate-y-1/2 absolute top-1/2 left-2 text-gray9">
                  $
                </span>
                <input
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
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
            </div>
            <div className="col-span-1 row-span-1 my-1">
              <Button className="w-full flex-1" type="submit" variant="accent">
                Buy & deposit
              </Button>
            </div>
            <div className="col-span-1 row-span-1">
              <div className="h-1" />
              <div className="my-auto flex w-full flex-row items-center gap-2 *:border-gray7">
                <hr className="flex-1" />
                <span className="px-3 text-gray9">or</span>
                <hr className="flex-1" />
              </div>
            </div>
            <div className="col-span-1 row-span-1">
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
                    <span className="ml-auto text-gray10 text-sm">Instant</span>
                    <ArrowRightIcon className="size-4 text-gray10" />
                  </div>
                </div>
              </Button>
            </div>
          </form>
        </Layout.Content>

        <Footer />
      </Layout>
    )

  if (view === 'deposit-crypto')
    return (
      <Layout loading={loading} loadingTitle="Adding funds...">
        <Layout.Header>
          <Layout.Header.Default title="Deposit crypto" />
        </Layout.Header>

        <Layout.Content>
          <form className="grid h-min grid-flow-row auto-rows-min grid-cols-1 items-center justify-center space-y-3">
            <div className="col-span-1 row-span-1">
              <Ariakit.Button
                className="mx-auto flex w-[75%] items-center justify-center gap-3 rounded-lg border border-surface bg-white p-2.5 hover:cursor-pointer! dark:bg-secondary"
                onClick={() => copyToClipboard(address ?? '')}
              >
                <Cuer.Root value={address ?? ''}>
                  <Cuer.Cells />
                  <Cuer.Finder radius={1} />
                  <Cuer.Arena>
                    <BaseIcon className="size-9 object-cover" />
                  </Cuer.Arena>
                </Cuer.Root>
                <p className="min-w-[6ch] max-w-[6ch] text-pretty break-all font-mono font-normal text-gray10 text-sm">
                  {address}
                </p>
              </Ariakit.Button>
            </div>

            <div className="col-span-1 row-span-1 my-auto">
              <div className="flex w-full flex-row gap-3 pt-1">
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
              </div>
            </div>
          </form>
        </Layout.Content>

        <Footer />
      </Layout>
    )

  if (view === 'success')
    return (
      <Layout>
        <Layout.Header className="flex flex-row items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-green4">
            <CheckIcon className="size-4.5 text-green8" />
          </div>
          <p className="font-medium text-lg">Deposited ${amount}</p>
        </Layout.Header>
        <Layout.Content>
          <p className="inline text-base text-secondary">
            Your funds have been deposited to your Porto account.{' '}
            <a
              className="inline align-middle text-gray12"
              href={`https://explorer.ithaca.xyz/tx/${deposit.data!.id}`}
              rel="noreferrer"
              target="_blank"
            >
              <LinkIcon className="mb-1 ml-1 inline size-3.5" />
            </a>
          </p>

          <div className="mt-2 flex w-full flex-row items-center">
            <Button
              className="w-full font-semibold"
              onClick={() => onApprove({ id: deposit.data!.id })}
              variant="default"
            >
              Done
            </Button>
          </div>
        </Layout.Content>

        <Footer />
      </Layout>
    )

  if (view === 'error')
    return (
      <Layout>
        <Layout.Header className="flex flex-row items-center gap-2 align-bottom">
          <div className="flex size-7.5 items-center justify-center rounded-full bg-red5">
            <TriangleAlertIcon className="size-4 text-red11" />
          </div>
          <p className="font-medium text-xl">Deposit failed</p>
        </Layout.Header>
        <Layout.Content className="px-1">
          <p className="text-base text-grayA12">
            Your deposit was cancelled or failed.
          </p>
          <p className="text-base text-secondary">
            No funds have been deposited.
          </p>

          <div className="mt-2.5 flex w-full flex-row items-center gap-x-2">
            <Button
              className="w-full font-semibold"
              onClick={() => onReject?.()}
              variant="default"
            >
              Close
            </Button>
            <Button
              className="w-full font-semibold"
              onClick={() => setView('default')}
              variant="accent"
            >
              Try again
            </Button>
          </div>
        </Layout.Content>
      </Layout>
    )

  return null
}

export declare namespace AddFunds {
  export type Props = {
    address?: Address.Address | undefined
    onApprove: (result: { id: Hex.Hex }) => void
    onReject?: () => void
    tokenAddress: Address.Address
    value?: bigint | undefined
  }
}
