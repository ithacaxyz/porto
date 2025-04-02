import { Porto } from '@porto/apps'
import { useMutation } from '@tanstack/react-query'
import { cx } from 'cva'
import { Hex } from 'ox'
import { Actions, Hooks } from 'porto/remote'
import * as React from 'react'
import { Layout } from '~/routes/-components/Layout'
import ArrowRightIcon from '~icons/lucide/arrow-right'
import ExternalLinkIcon from '~icons/lucide/external-link'
import QrCodeIcon from '~icons/lucide/qr-code'

const porto = Porto.porto

const predefinedAmounts = [25, 50, 100, 250]

export function AddFunds() {
  const request = Hooks.useRequest(porto)
  // Use searchParams directly instead of _decoded
  const params = request?.params?.[0] as
    | { amount: Hex.Hex; token: Hex.Hex }
    | undefined
  console.info(params)
  const [amount, setAmount] = React.useState<number>(
    Hex.toNumber(params?.amount ?? '0x0'),
  )

  console.info(amount)
  const respond = useMutation({
    mutationFn() {
      console.info(amount)
      return Actions.respond(porto, request!)
    },
  })

  return (
    <Layout loading={respond.isPending} loadingTitle="Adding funds...">
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
                    amount === predefinedAmount
                      ? 'border-blue9 bg-gray3 text-black dark:text-white'
                      : 'border-gray6 text-gray11 dark:border-gray4',
                    'min-w-1/4 rounded-[10px] border-[1.5px] py-2 text-center hover:bg-gray6',
                  )}
                  key={predefinedAmount}
                  onClick={() => setAmount(predefinedAmount)}
                  type="button"
                >
                  ${predefinedAmount}
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-1 row-span-1">
            <div className="flex w-full flex-row items-center justify-between rounded-lg bg-gray4 px-3 py-2.5 text-gray12 focus-within:bg-gray4 dark:bg-gray3">
              <input
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="h-full max-h-[96%] bg-transparent font-semibold placeholder:text-gray8 focus:outline-none"
                onChange={(event) => setAmount(Number(event.target.value))}
                placeholder="Enter amount"
                spellCheck={false}
                type="text"
                value={amount}
                // should add disabled` if testnet?
              />
              <span className="text-gray9 text-sm">Max. $500</span>
            </div>
          </div>
          <div className="col-span-1 row-span-1 my-1">
            <button
              className="flex w-full flex-row items-center justify-center rounded-lg bg-[#6E56CF] px-4 py-2 font-semibold text-base text-destructive-foreground hover:bg-[#6E56CF]/90"
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
              className="ml-auto flex w-full flex-row items-center justify-start gap-2 rounded-lg border border-transparent bg-gray4 px-4 py-2 hover:bg-gray5 dark:bg-gray3"
              type="button"
            >
              <QrCodeIcon className="size-5" />
              <span className="font-[500] text-base dark:text-white/90">
                Send Crypto
              </span>
              <span className="ml-auto text-gray10 text-sm">Instant</span>
              <ArrowRightIcon className="size-4 text-gray10" />
            </button>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  )
}
