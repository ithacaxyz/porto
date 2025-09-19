import * as Ariakit from '@ariakit/react'
import { ChainIcon } from '@porto/apps/components'
import { useCopyToClipboard } from '@porto/apps/hooks'
import * as Ui from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { Cuer } from 'cuer'
import { cx } from 'cva'
import { toast } from 'sonner'
import ExternalLinkIcon from '~icons/lucide/external-link'

export const Route = createFileRoute('/_dash/receive')({
  component: RouteComponent,
})

function RouteComponent() {
  const { account } = Route.useRouteContext()
  const [, copyToClipboard] = useCopyToClipboard({ timeout: 2_000 })
  return (
    <main className="size-full space-y-6 md:ml-2">
      <section className="grid min-h-[50%] grid-flow-col grid-cols-2 justify-items-stretch gap-4 *:rounded-2xl *:bg-white lg:grid-rows-4 dark:*:bg-gray1">
        <div
          className={Ui.cx(
            'flex flex-col items-center px-9 pt-6 pb-3.5',
            'lg:col-span-1 lg:row-span-4',
            'col-span-full row-span-full',
          )}
        >
          <div className="flex w-full justify-between">
            <p className="my-auto font-normal text-base text-gray10">
              Your address
            </p>
            <Ariakit.Button
              className="h-min rounded-4xl bg-gray2 px-3.5 py-2.5 font-medium text-base outline-1 outline-gray3 outline-offset-[-1px]"
              onClick={() =>
                copyToClipboard(account.address ?? '')
                  .then(() => toast.success('Copied address to clipboard'))
                  .catch(() =>
                    toast.error('Failed to copy address to clipboard'),
                  )
              }
            >
              Copy
            </Ariakit.Button>
          </div>
          <div className="my-auto mt-5 flex h-auto max-w-[200px] items-center justify-center gap-3 rounded-2xl bg-white p-2.5 pt-3 shadow-[0px_4px_44px_0px_rgba(0,0,0,0.02)] outline-1 outline-gray3 outline-offset-[-1px] lg:mt-auto lg:max-w-[230px] dark:bg-secondary">
            <Cuer.Root
              className="h-auto rounded-lg p-2.5"
              value={account.address ?? ''}
            >
              <Cuer.Finder radius={1} />
              <Cuer.Cells />
            </Cuer.Root>
            <p className="min-w-[7ch] max-w-[7ch] text-pretty break-all font-mono font-normal text-[11px] text-gray10">
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
            <div className="*:-mr-5 flex gap-2 *:size-9.5 *:rounded-full *:outline-[3.5px] *:outline-gray1 dark:*:outline-gray">
              <img alt="ETH icon" src="/token-icons/eth.svg" />
              <img alt="HYPE icon" src="/token-icons/hype.svg" />
              <img alt="UNI icon" src="/token-icons/uni.svg" />
              <img alt="USDC icon" src="/token-icons/usdc.svg" />
            </div>
            <Ariakit.Button
              className="h-min rounded-4xl bg-gray2 px-3.5 py-2.5 font-medium text-base outline-1 outline-gray3 outline-offset-[-1px]"
              render={
                <a
                  href="https://porto.sh/sdk/api/chains#supported-chains"
                  rel="noreferrer"
                  target="_blank"
                >
                  Learn more
                </a>
              }
            />
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
            <div className="*:-mr-5 flex gap-2 *:size-9.5 *:rounded-full *:outline-[3.5px] *:outline-gray1 dark:*:outline-gray">
              <div>
                <ChainIcon chainId={56} className="size-9.5" />
              </div>
              <div>
                <ChainIcon chainId={42_161} className="size-9.5" />
              </div>
              <div>
                <ChainIcon chainId={137} className="size-9.5" />
              </div>
              <div>
                <ChainIcon chainId={10} className="size-9.5" />
              </div>
            </div>
            <Ariakit.Button
              className="h-min rounded-4xl bg-gray2 px-3.5 py-2.5 font-medium text-base outline-1 outline-gray3 outline-offset-[-1px]"
              render={
                <a
                  href="https://porto.sh/sdk/api/chains#supported-chains"
                  rel="noreferrer"
                  target="_blank"
                >
                  Learn more
                </a>
              }
            />
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

      <section className="size-full gap-6">
        {/* <div className="w-full"> */}
        <p className="mb-6 font-medium text-gray9 text-xl">History</p>
        <ul
          className={cx(
            'flex flex-col gap-6',
            '*:*:my-auto *:flex *:flex-row *:gap-2',
          )}
        >
          <li className="flex w-full flex-row gap-2">
            <img
              alt="USDC icon"
              className="size-7 rounded-full"
              src="/token-icons/usdc.svg"
            />
            <span className="font-normal text-base text-gray10">Deposited</span>
            <span className="font-medium text-base">USDC Coin</span>

            <span className="ml-auto font-medium text-base">$6,642.15</span>

            <span className="font-medium text-base">8/30 at 8:05pm</span>
            <Ariakit.Button
              className="flex size-10 items-center justify-center rounded-full bg-white text-center outline-1 outline-gray7"
              render={
                <a
                  href="https://etherscan.io/tx/0x1234567890"
                  rel="noreferrer"
                  sr-only="View on Etherscan"
                  target="_blank"
                >
                  <ExternalLinkIcon className="size-6 text-gray7" />
                </a>
              }
            />
          </li>
          <li>
            <img
              alt="UNI icon"
              className="size-7 rounded-full"
              src="/token-icons/uni.svg"
            />
            <span className="font-normal text-base text-gray10">Deposited</span>
            <span className="font-medium text-base">Uniswap Coin</span>
          </li>
          <li>
            <img
              alt="HYPE icon"
              className="size-7 rounded-full"
              src="/token-icons/hype.svg"
            />
            <span className="font-normal text-base text-gray10">Deposited</span>
            <span className="font-medium text-base">HYPE Coin</span>
          </li>
        </ul>
      </section>
    </main>
  )
}
