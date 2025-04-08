import * as Ariakit from '@ariakit/react'
import { Token } from '@porto/apps'
import { Button } from '@porto/apps/components'
import { useMutation } from '@tanstack/react-query'
import { Address } from 'ox'
import { Hex, Value } from 'ox'
import { Hooks } from 'porto/remote'
import * as React from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'

import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import ArrowRightIcon from '~icons/lucide/arrow-right'
import QrCodeIcon from '~icons/lucide/qr-code'

const presetAmounts = ['25', '50', '100', '250']

export function AddFunds(props: AddFunds.Props) {
  const {
    onApprove,
    onReject: _,
    tokenAddress,
    value = BigInt(presetAmounts[0]!),
  } = props

  const account = Hooks.useAccount(porto)
  const chain = Hooks.useChain(porto)

  const address = props.address ?? account?.address

  const [amount, setAmount] = React.useState<string>(value.toString())

  const deposit = useMutation({
    async mutationFn(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      e.stopPropagation()

      if (!address) throw new Error('address is required')
      if (!chain) throw new Error('chain is required')

      const token = Token.tokens[chain.id][tokenAddress.toLowerCase()]
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

  const receipt = useWaitForTransactionReceipt({
    hash: deposit.data?.id,
    query: {
      enabled: !!deposit.data?.id,
    },
    timeout: 10_000,
  })

  React.useEffect(() => {
    if (receipt.isSuccess) onApprove(deposit.data!)
  }, [receipt.isSuccess, deposit.data, onApprove])

  const loading = deposit.isPending || receipt.isFetching

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
                    <label className="w-full rounded-[10px] border-[1.5px] border-gray4 py-2 text-center text-gray11 hover:bg-gray3 has-checked:border-[1.5px] has-checked:border-blue9 has-checked:bg-gray4 has-checked:text-primary">
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
            <Button className="w-full flex-1" type="submit" variant="violet">
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
            <Button className="w-full" type="button">
              <div className="flex w-full flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCodeIcon className="size-5" />
                  <span>Send crypto</span>
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

      <Layout.Footer>
        {address && <Layout.Footer.Account address={address} />}
      </Layout.Footer>
    </Layout>
  )
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
