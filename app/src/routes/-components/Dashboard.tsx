import * as Ariakit from '@ariakit/react'
import { useAccount } from 'wagmi'
import ChevronDownIcon from '~icons/lucide/chevron-down'
import XIcon from '~icons/lucide/x'
import CoinsIcon from '~icons/lucide/coins'
import HistoryIcon from '~icons/lucide/history'
import SendHorizontalIcon from '~icons/lucide/send-horizontal'

import { Button } from '~/components/Button'
import { Pill } from '~/components/Pill'
import { StringFormatter } from '~/utils'
import { cx } from 'cva'

export function Dashboard() {
  const account = useAccount()

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
          <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-accent">
            🌀
          </span>
          <p className="font-semibold">
            {StringFormatter.truncate(account?.address ?? '', {
              start: 6,
              end: 4,
            })}
          </p>
          <ChevronDownIcon className="size-6 rounded-full bg-gray-200 p-1 text-gray-700" />
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
              <ul>
                <li>BTC</li>
                <li>ETH</li>
                <li>USDC</li>
              </ul>
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
