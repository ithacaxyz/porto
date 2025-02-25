import * as Ariakit from '@ariakit/react'
import { cx } from 'cva'
import { Hooks } from 'porto/wagmi'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import EthIcon from '~icons/cryptocurrency-color/eth'
import ChevronDownIcon from '~icons/lucide/chevron-down'
import CoinsIcon from '~icons/lucide/coins'
import CopyIcon from '~icons/lucide/copy'
import HistoryIcon from '~icons/lucide/history'
import SendHorizontalIcon from '~icons/lucide/send-horizontal'
import XIcon from '~icons/lucide/x'

import { Button } from '~/components/Button'
import { Pill } from '~/components/Pill'
import { StringFormatter, cn } from '~/utils'

export const assets = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: {
      value: 2689,
      change: 3.66,
    },
    balance: {
      value: 13350.41,
      native: 3.354,
    },
    icon: EthIcon,
  },
]

export function Dashboard() {
  const account = useAccount()
  const disconnect = Hooks.useDisconnect()

  const formStore = Ariakit.useFormStore({
    defaultValues: {
      email: '',
    },
  })

  return (
    <div className="mx-auto flex size-full min-h-screen max-w-xl flex-col gap-y-4 p-4">
      <div className="mt-3 flex items-center justify-between">
        <a href="/" className="font-medium text-2xl">
          Porto
        </a>
        <div className="flex flex-row items-center gap-x-2">
          <span className="rounded-full bg-accent/20 px-1 py-[0.5px] text-accent">
            🌀
          </span>
          <Ariakit.MenuProvider>
            <Ariakit.MenuButton className="flex items-center gap-x-2">
              <p className="font-semibold">
                {StringFormatter.truncate(account?.address ?? '', {
                  start: 6,
                  end: 4,
                })}
              </p>
              <ChevronDownIcon className="size-6 rounded-full bg-gray-200 p-1 text-gray-700 hover:bg-gray-300" />
            </Ariakit.MenuButton>
            <Ariakit.Menu
              gutter={8}
              className={cx(
                'w-full rounded-sm bg-gray6 p-1',
                '*:tracking-wide',
              )}
            >
              <Ariakit.MenuItem
                className="flex items-center justify-between gap-x-2 rounded-sm px-3 py-2 hover:bg-gray2"
                onClick={() =>
                  navigator.clipboard
                    .writeText(account?.address ?? '')
                    .then(() => toast.success('Address copied to clipboard'))
                    .catch(() => toast.error('Failed to copy address'))
                }
              >
                Copy
                <CopyIcon className="size-3.5" />
              </Ariakit.MenuItem>
              <Ariakit.MenuSeparator className="my-1" />
              <Ariakit.MenuItem
                className="flex items-center justify-between gap-x-2 rounded-sm px-3 py-2 hover:bg-gray2"
                onClick={() => disconnect.mutate({})}
              >
                Disconnect
              </Ariakit.MenuItem>
            </Ariakit.Menu>
          </Ariakit.MenuProvider>
        </div>
      </div>
      <div className="flex justify-between gap-2 rounded-xl bg-surface p-4">
        <div>
          <p className="font-semibold text-xl">$32,350.20</p>
          <p className="my-auto text-secondary text-sm">
            14.348 <Pill>ETH</Pill>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="invert">Deposit</Button>
          <Button variant="default">Withdraw</Button>
        </div>
      </div>
      <div className="items-center gap-2 pr-1 pl-1.5">
        <Ariakit.TabProvider defaultSelectedId="assets">
          <Ariakit.TabList className="tab-list flex gap-x-2" aria-label="tabs">
            <Ariakit.Tab
              id="assets"
              tabbable={true}
              className="tab flex gap-x-1 rounded-4xl border-[1.5px] border-gray-400/50 px-3 data-[active-item=true]:border-accent data-[active-item=true]:text-accent"
            >
              <CoinsIcon className="my-auto size-5" />
              <span className="my-auto">Assets</span>
            </Ariakit.Tab>
            <Ariakit.Tab
              id="history"
              tabbable={true}
              className="tab flex gap-x-1 rounded-4xl border-[1.5px] border-gray-400/50 px-3 data-[active-item=true]:border-accent data-[active-item=true]:text-accent"
            >
              <HistoryIcon className="my-auto size-5" />
              <span className="my-auto">History</span>
            </Ariakit.Tab>
            <input
              type="text"
              placeholder="Search…"
              className={cx(
                'ml-2 w-full max-w-[55%] rounded-full border border-gray8 bg-transparent px-4 py-2 text-black placeholder:text-secondary sm:ml-8',
                'dark:bg-secondary dark:text-gray-50',
              )}
            />
          </Ariakit.TabList>
          <div className="mt-3">
            <Ariakit.TabPanel tabId="assets">
              <table className="w-full">
                <thead className="">
                  <tr className="*:font-light *:text-secondary *:text-sm">
                    <th className="text-left">Name</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="w-full">
                  {assets.map((asset) => (
                    <tr key={asset.name} className="">
                      <td className="text-left">
                        <div className="flex items-center gap-x-2">
                          <EthIcon className="mr-0.5 size-8" />
                          <div className="flex flex-col">
                            <span className="text-lg">{asset.name}</span>
                            <span className="text-secondary text-xs">
                              {asset.symbol}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex flex-col">
                          <span className="text-lg">
                            ${asset.price.value.toLocaleString()}
                          </span>
                          <span
                            className={cn(
                              'text-sm tracking-wider',
                              asset.price.change > 0 && 'text-emerald-500',
                              asset.price.change < 0 && 'text-red-500',
                            )}
                          >
                            ↑{asset.price.change}%
                          </span>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex flex-col">
                          <span className="text-lg">
                            ${asset.balance.value.toLocaleString()}
                          </span>
                          <span className="text-secondary text-sm">
                            {asset.balance.native.toLocaleString()}{' '}
                            <Pill className="">ETH</Pill>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Ariakit.TabPanel>
            <Ariakit.TabPanel tabId="history">
              <ul>
                <li>WIP</li>
              </ul>
            </Ariakit.TabPanel>
          </div>
        </Ariakit.TabProvider>
      </div>
      {/* ==== Footer ==== */}
      <footer className="mt-auto flex flex-col gap-y-5 p-2">
        <Ariakit.Form
          store={formStore}
          className="flex flex-row justify-between gap-x-2 rounded-full bg-surface px-3 py-2"
        >
          <img
            src="/icons/mushroom.svg"
            alt="icon"
            className="my-auto size-6"
          />
          <Ariakit.FormLabel
            name={formStore.names.email}
            className="my-auto mr-auto font-medium text-secondary dark:text-gray-300"
          >
            Power up your wallet!
          </Ariakit.FormLabel>
          <Ariakit.TooltipProvider>
            <Ariakit.TooltipAnchor
              className="link"
              render={() => {
                const error = formStore.getError('email')
                if (!error) return null
                return (
                  <XIcon className="my-auto size-6 rounded-full bg-rose-300 p-1 text-red-500" />
                )
              }}
            />
            <Ariakit.Tooltip className="tooltip">
              <Ariakit.FormError name={formStore.names.email} />
            </Ariakit.Tooltip>
          </Ariakit.TooltipProvider>
          <Ariakit.FormInput
            type="email"
            required={true}
            name={formStore.names.email}
            placeholder="Get email updates…"
            className={cx(
              'rounded-full border border-gray8 bg-white px-3 py-1 text-sm placeholder:text-secondary',
              'dark:bg-secondary dark:text-gray-50 dark:placeholder:text-gray-400',
            )}
          />
          <Ariakit.FormSubmit className="rounded-full bg-gray-300 p-2">
            <span className="sr-only">Send</span>
            <SendHorizontalIcon className=" text-gray-500" />
          </Ariakit.FormSubmit>
        </Ariakit.Form>
        <div className="flex flex-row justify-between px-4">
          <p className="flex gap-x-2 text-secondary leading-[22px] dark:text-gray-300">
            Built by
            <a
              className="my-auto flex font-mono text-primary"
              href="https://ithaca.xyz"
              rel="noreferrer"
              target="_blank"
            >
              <img
                src="/icons/ithaca-light.svg"
                alt="icon"
                className="mr-1 size-5"
              />
              Ithaca
            </a>
          </p>
          <nav className="flex gap-6 font-medium text-gray11">
            <a href="https://ithaca.xyz" target="_blank" rel="noreferrer">
              Home ↗
            </a>
            <a
              href="https://ithaca.xyz/contact"
              target="_blank"
              rel="noreferrer"
            >
              Careers ↗
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
