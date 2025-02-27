import * as Ariakit from '@ariakit/react'
import * as React from 'react'
import { toast } from 'sonner'
import { Drawer } from 'vaul'
import { useAccount } from 'wagmi'
import ChevronDownIcon from '~icons/lucide/chevron-down'
import CoinsIcon from '~icons/lucide/coins'
import HistoryIcon from '~icons/lucide/history'
import SendHorizontalIcon from '~icons/lucide/send-horizontal'
import XIcon from '~icons/lucide/x'

import { Link } from '@tanstack/react-router'
import { Layout } from '~/components/AppLayout'
import { Button, ButtonWithRef } from '~/components/Button'
import { Header } from '~/components/Header'
import { Pill } from '~/components/Pill'
import { QrCode } from '~/components/QrCode'
import { TokenIcon, assets } from '~/lib/fake'
import { PercentFormatter, StringFormatter, cn, sum } from '~/utils'

export function Dashboard() {
  const { address } = useAccount()

  const formStore = Ariakit.useFormStore({
    defaultValues: {
      email: '',
    },
  })

  const [search, setSearch] = React.useState('')
  const [filteredAssets, setFilteredAssets] = React.useState(assets)

  React.useEffect(() => {
    setFilteredAssets(
      assets.filter((asset) =>
        asset.name.toLowerCase().includes(search.toLowerCase()),
      ),
    )
  }, [search])

  return (
    <Layout>
      <Header />
      <section className="flex justify-between gap-2 rounded-xl bg-gray3 p-4">
        <div>
          <p className="font-semibold text-xl">
            ${sum(assets.map((asset) => asset.balance.value)).toLocaleString()}
          </p>
          <p className="my-auto text-primary text-sm">
            {sum(assets.map((asset) => asset.balance.native)).toLocaleString()}
            <Pill className="ml-1.5">{assets[0]?.symbol}</Pill>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Drawer.Root>
            <Drawer.Trigger asChild>
              <ButtonWithRef variant="invert">Deposit</ButtonWithRef>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/30" />
              <Drawer.Content className="fixed right-0 bottom-0 left-0 mx-auto h-fit w-full rounded-t-3xl bg-gray-50 px-3 outline-none sm:w-[400px]">
                <div className="rounded-t-3xl bg-gray-50 px-6 py-4">
                  <Drawer.Title className="mb-2 font-medium text-2xl">
                    Deposit
                  </Drawer.Title>
                  <Drawer.Close className="absolute top-5 right-5">
                    <XIcon className="size-6 text-secondary" />
                  </Drawer.Close>
                  <Drawer.Description className="text-lg text-secondary">
                    Fund your Ithaca wallet with crypto.
                  </Drawer.Description>
                  <div className="mx-auto w-full">
                    <QrCode key={address} contents={address} />
                  </div>
                  <div className="relative flex items-center justify-around gap-x-4">
                    <p className="my-auto text-xl tracking-wider">
                      {StringFormatter.truncate(address ?? '', {
                        start: 8,
                        end: 6,
                      })}
                    </p>
                    <Button
                      variant="default"
                      className="h-10!"
                      onClick={() =>
                        navigator.clipboard
                          .writeText(address ?? '')
                          .then(() =>
                            toast.success('Address copied to clipboard'),
                          )
                          .catch(() => toast.error('Failed to copy address'))
                      }
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
          <Link
            to="/withdraw"
            className="h-10 rounded-default bg-gray6 px-3.5 hover:bg-gray5"
          >
            <p className="mt-2 h-full font-medium">Withdraw</p>
          </Link>
        </div>
      </section>
      <section className="mt-1 items-center gap-2 pr-1 pl-1.5">
        <Ariakit.TabProvider defaultSelectedId="assets">
          <Ariakit.TabList
            aria-label="tabs"
            className="tab-list flex justify-between gap-x-2"
          >
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
              className="tab mr-auto flex gap-x-1 rounded-4xl border-[1.5px] border-gray-400/50 px-3 data-[active-item=true]:border-accent data-[active-item=true]:text-accent"
            >
              <HistoryIcon className="my-auto size-5" />
              <span className="my-auto">History</span>
            </Ariakit.Tab>
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={cn(
                'ml-2 w-full max-w-[50%] rounded-full border border-gray8 bg-transparent px-4 py-2 text-black placeholder:text-secondary sm:ml-8',
                'dark:bg-secondary dark:text-gray-50',
              )}
            />
          </Ariakit.TabList>
          <div className="mt-5">
            <Ariakit.TabPanel tabId="assets">
              <table className="md:table-none w-full ">
                <thead className="">
                  <tr className="*:font-light *:text-secondary *:text-sm">
                    <th className="text-left">Name</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="w-full">
                  {filteredAssets.map((asset, index) => (
                    <tr
                      key={asset.name}
                      className={cn(
                        'border-gray-400/50 border-b *:px-1',
                        index === filteredAssets.length - 1 && 'border-b-0',
                      )}
                    >
                      <td className="text-left">
                        <div className="flex items-center gap-x-2 py-4">
                          {asset.icon}
                          <div className="flex flex-col">
                            <span className="text-lg">{asset.name}</span>
                            <span className="text-secondary text-xs">
                              {asset.symbol}
                            </span>
                          </div>
                          {index === 0 && (
                            <Ariakit.MenuProvider>
                              <Ariakit.MenuButton className="mb-auto flex gap-x-0.5 rounded-2xl bg-gray4 py-1.5 pr-1 pl-1.5">
                                <TokenIcon.Op className="-mr-2 text-gray10" />
                                <TokenIcon.Eth className="text-gray10" />
                                <ChevronDownIcon className="size-5 text-gray10" />
                              </Ariakit.MenuButton>
                              <Ariakit.Menu>
                                <Ariakit.MenuItem>WIP</Ariakit.MenuItem>
                              </Ariakit.Menu>
                            </Ariakit.MenuProvider>
                          )}
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
                              !asset.price.change && 'text-secondary',
                            )}
                          >
                            {asset.price.change > 0 ? '↑' : '↓'}
                            {PercentFormatter.format(asset.price.change)
                              .toString()
                              .replaceAll('-', '')}
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
                            <Pill className="">{asset.symbol}</Pill>
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
      </section>
      {/* ==== Footer ==== */}
      <footer className="mt-auto flex flex-col gap-y-5 p-2">
        <Ariakit.Form
          store={formStore}
          className="flex flex-row justify-between gap-x-2 rounded-full bg-surface px-3 py-2"
        >
          <img
            alt="icon"
            src="/icons/mushroom.svg"
            className="my-auto size-6"
          />
          <Ariakit.FormLabel
            name={formStore.names.email}
            className="my-auto mr-auto font-medium text-secondary"
          >
            Power up your wallet!
          </Ariakit.FormLabel>
          <Ariakit.TooltipProvider>
            <Ariakit.TooltipAnchor
              className="link"
              render={(props) => {
                const error = formStore.getError('email')
                if (!error) return null
                return (
                  <XIcon
                    {...props}
                    className="my-auto size-6 rounded-full bg-rose-300 p-1 text-red-500"
                  />
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
            className={cn(
              'rounded-full border border-gray8 bg-white px-3 py-1 text-sm placeholder:text-secondary',
              'dark:bg-secondary dark:text-gray-50 dark:placeholder:text-gray-400',
            )}
          />
          <Ariakit.FormSubmit className="rounded-full bg-gray-300 p-2">
            <span className="sr-only">Send</span>
            <SendHorizontalIcon className=" text-gray-500 hover:text-accent" />
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
    </Layout>
  )
}
