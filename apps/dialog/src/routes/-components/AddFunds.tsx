import { useMutation } from '@tanstack/react-query'
import { cx } from 'cva'
import { Hex, type RpcSchema } from 'ox'
import type { RpcSchema as porto_RpcSchema } from 'porto'
import * as React from 'react'
import { Layout } from '~/routes/-components/Layout'
import ArrowRightIcon from '~icons/lucide/arrow-right'
import ExternalLinkIcon from '~icons/lucide/external-link'
import QrCodeIcon from '~icons/lucide/qr-code'

const predefinedAmounts = [25, 50, 100, 250]

export declare namespace AddFunds {
  type Props = RpcSchema.ExtractParams<
    porto_RpcSchema.Schema,
    'experimental_addFunds'
  >['0'] & {
    onApprove: (result: Hex.Hex) => void
    onReject?: () => void
  }
}

export function AddFunds(props: AddFunds.Props) {
  const { address, value, token, onApprove, onReject: _ } = props

  const [desiredAmount, setDesiredAmount] = React.useState<number>(
    Hex.toNumber(value),
  )

  const deposit = useMutation({
    async mutationFn() {
      if (!address || !token) throw new Error('Invalid account or token')

      const searchParams = new URLSearchParams({
        address,
        value: desiredAmount.toString(),
      })
      const response = await fetch(
        `https://faucet.porto.workers.dev?${searchParams.toString()}`,
      )
      if (!response.ok) throw new Error('Failed to fetch funds')
      const data = (await response.json()) as Hex.Hex
      onApprove(data)
    },
  })

  return (
    <Layout loading={deposit.isPending} loadingTitle="Adding funds...">
      <Layout.Header>
        <Layout.Header.Default
          content="Select how much you will deposit."
          title="Deposit Funds"
        />
      </Layout.Header>

      <Layout.Content>
        <div className="grid h-min grid-flow-row auto-rows-min grid-cols-1 space-y-3">
          <div className="col-span-1 row-span-1 px-3">
            <div className="flex w-full max-w-full flex-row justify-center space-x-2">
              {predefinedAmounts.map((predefinedAmount) => (
                <button
                  className={cx(
                    desiredAmount === predefinedAmount
                      ? 'border-blue9 bg-gray3 text-black dark:text-white'
                      : 'border-gray6 text-gray11 dark:border-gray4',
                    'min-w-1/4 rounded-[10px] border-[1.5px] py-2 text-center hover:bg-gray6',
                  )}
                  key={predefinedAmount}
                  onClick={() => {
                    setDesiredAmount(predefinedAmount)
                  }}
                  type="button"
                >
                  ${predefinedAmount}
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-1 row-span-1">
            <div className="flex w-full flex-row items-center justify-between rounded-lg border-[1.75px] border-transparent bg-gray4 px-3 py-2.5 text-gray12 focus-within:border-gray6 focus-within:bg-gray4 has-aria-invalid:border-red8 dark:bg-gray3">
              <input
                aria-invalid={desiredAmount > 500}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="h-full max-h-[96%] w-full max-w-[50%] bg-transparent font-semibold placeholder:text-gray8 focus:outline-none"
                inputMode="decimal"
                max={500}
                min={0}
                onChange={(event) =>
                  setDesiredAmount(Number(event.target.value))
                }
                placeholder="Enter amount"
                spellCheck={false}
                type="number"
                value={desiredAmount}
                // should add disabled` if testnet?
              />
              <span className="text-gray9 text-sm">Max. $500</span>
            </div>
          </div>
          <div className="col-span-1 row-span-1 my-1">
            <button
              className="flex h-9 w-full flex-row items-center justify-center rounded-lg bg-[#6E56CF] px-4 py-2 font-semibold text-base text-destructive-foreground hover:bg-[#6E56CF]/90"
              onClick={async (event) => {
                event.preventDefault()
                deposit.mutate()
              }}
              type="button"
            >
              <span className="text-white/90">Buy & Deposit</span>
              <ExternalLinkIcon className="ml-2 size-4 text-white/70" />
            </button>
          </div>
          <div className="col-span-1 row-span-1">
            <div className="-mb-2 my-auto flex w-full flex-row items-center gap-2 *:border-gray7">
              <hr className="flex-1" />
              <span className="px-3 text-gray9">or</span>
              <hr className="flex-1" />
            </div>
          </div>
          <div className="col-span-1 row-span-1">
            <button
              className="ml-auto flex h-9 w-full flex-row items-center justify-start gap-2 rounded-lg border border-transparent bg-gray4 px-4 py-2 hover:bg-gray5 dark:bg-gray3"
              type="button"
            >
              <QrCodeIcon className="size-5" />
              <span className="font-[500] text-base text-black dark:text-white/90">
                Send Crypto
              </span>
              <span className="ml-auto text-gray10 text-sm">Instant</span>
              <ArrowRightIcon className="size-4 text-gray10" />
            </button>
          </div>
        </div>
      </Layout.Content>

      <Layout.Footer>
        <Layout.Footer.Account />
      </Layout.Footer>
    </Layout>
  )
}
