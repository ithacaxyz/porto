import { ChainIcon } from '@porto/apps/components'
import { useCopyToClipboard } from '@porto/apps/hooks'
import * as Ui from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { Cuer } from 'cuer'
import { toast } from 'sonner'

export const Route = createFileRoute('/_dash/receive')({
  component: RouteComponent,
})

function RouteComponent() {
  const { account } = Route.useRouteContext()
  const [, copyToClipboard] = useCopyToClipboard({ timeout: 2_000 })
  return (
    <main className="size-full">
      {/* TOP BOXES */}

      <section className="grid min-h-[50%] grid-flow-col grid-cols-2 justify-items-stretch gap-4 *:rounded-2xl *:bg-white lg:grid-rows-4 dark:*:bg-gray1">
        <div
          className={Ui.cx(
            'flex flex-col items-center px-9 pt-6 pb-3.5',
            'lg:col-span-1 lg:row-span-4',
            'col-span-full row-span-full',
          )}
        >
          <div className="flex w-full justify-between">
            <p className="my-auto text-gray10">Your address</p>
            <Ui.Button
              onClick={() =>
                copyToClipboard(account.address ?? '')
                  .then(() => toast.success('Copied address to clipboard'))
                  .catch(() =>
                    toast.error('Failed to copy address to clipboard'),
                  )
              }
            >
              Copy
            </Ui.Button>
          </div>
          <div className="my-auto mt-5 flex h-auto max-w-[200px] items-center justify-center gap-3 rounded-2xl border border-surface bg-white p-2.5 pt-3 lg:mt-auto lg:max-w-[230px] dark:bg-secondary">
            <Cuer.Root
              className="h-auto rounded-lg p-2.5"
              value={account.address ?? ''}
            >
              <Cuer.Finder radius={1} />
              <Cuer.Cells />
            </Cuer.Root>
            <p className="min-w-[6ch] max-w-[6ch] text-pretty break-all font-mono font-normal text-[11px] text-gray10">
              {account.address}
            </p>
          </div>
        </div>
        <div
          className={Ui.cx(
            'flex w-full flex-col items-center px-9 pt-6 pb-3.5',
            'lg:col-span-2 lg:row-start-1 lg:row-end-3',
            'col-span-full',
          )}
        >
          <div className="flex size-full justify-between">
            <div className="*:-mr-6 flex gap-2 *:size-9.5 *:rounded-full *:border-3 *:border-white">
              <img alt="eth icon" src="/token-icons/eth.svg" />
              <img alt="usdt icon" src="/token-icons/usdt.svg" />
              <img alt="optimism icon" src="/token-icons/op.svg" />
              <img alt="usdc icon" src="/token-icons/usdc.svg" />
            </div>
            <Ui.Button>Learn more</Ui.Button>
          </div>
          <div className="size-full">
            <p className="font-medium text-2xl text-black dark:text-white">
              Any Ethereum asset
            </p>
            <p className="font-normal text-base text-gray10">
              Deposit ERC20 and ERC721 tokens from supported chains
            </p>
          </div>
        </div>

        <div
          className={Ui.cx(
            'flex flex-col items-center px-9 pt-6 pb-3.5',
            'lg:col-span-2 lg:row-start-3 lg:row-end-5',
            'col-span-full',
          )}
        >
          <div className="flex size-full justify-between">
            <div className="*:-mr-6 flex gap-2 *:size-9.5 *:rounded-full *:border-3 *:border-white">
              <div>
                <ChainIcon chainId={42161} className="size-9.5" />
              </div>
              <div>
                <ChainIcon chainId={10} className="size-9.5" />
              </div>
              <div>
                <ChainIcon chainId={137} className="size-9.5" />
              </div>
              <div>
                <ChainIcon chainId={1} className="size-9.5" />
              </div>
            </div>
            <Ui.Button>Learn more</Ui.Button>
          </div>
          <div className="size-full">
            <p className="font-medium text-2xl text-black dark:text-white">
              Supports major chains
            </p>
            <p className="font-normal text-base text-gray10">
              Deposit from Arbitrum, Optimism, BNB, and other Layer 2s
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM TABLE */}

      <section>{/* table */}</section>
    </main>
  )
}
