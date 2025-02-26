import * as Ariakit from '@ariakit/react'
import { defineCustomElements } from '@bitjson/qr-code'
import * as React from 'react'
import { toast } from 'sonner'
import { Drawer } from 'vaul'
import { useAccount } from 'wagmi'
import BtcIcon from '~icons/cryptocurrency-color/btc'
import EthIcon from '~icons/cryptocurrency-color/eth'
import CoinsIcon from '~icons/lucide/coins'
import HistoryIcon from '~icons/lucide/history'
import SendHorizontalIcon from '~icons/lucide/send-horizontal'
import XIcon from '~icons/lucide/x'
import OpIcon from '~icons/simple-icons/optimism'

import { Layout } from '~/components/AppLayout'
import { Button } from '~/components/Button'
import { Header } from '~/components/Header'
import { Pill } from '~/components/Pill'
import { StringFormatter, cn, sum } from '~/utils'

const assets = [
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
    icon: <EthIcon className="size-8" />,
  },
  {
    name: 'Wrapped Bitcoin',
    symbol: 'wBTC',
    price: {
      value: 99999,
      change: 4.2,
    },
    balance: {
      value: 1249494.3,
      native: 12.494943,
    },
    icon: <BtcIcon className="size-8" />,
  },
  {
    name: 'Optimism',
    symbol: 'OP',
    price: {
      value: 3.35,
      change: 6.69,
    },
    balance: {
      value: 1970.44,
      native: 1970.44,
    },
    icon: <OpIcon className="size-8 text-red-500" />,
  },
]

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

  React.useEffect(() => {
    defineCustomElements(window)
  }, [])

  return (
    <Layout>
      <Header />
      <section className="flex justify-between gap-2 rounded-xl bg-gray3 p-4">
        <div>
          <p className="font-semibold text-xl">
            ${sum(assets.map((asset) => asset.balance.value)).toLocaleString()}
          </p>
          <p className="my-auto text-secondary text-sm">
            {sum(assets.map((asset) => asset.balance.native)).toLocaleString()}
            <Pill className="ml-1.5">{assets[0]?.symbol}</Pill>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Drawer.Root>
            <Drawer.Trigger asChild>
              <Button variant="invert">Deposit</Button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="fixed right-0 bottom-0 left-0 mx-auto h-fit w-full rounded-t-3xl bg-gray-100 outline-none sm:w-[400px]">
                <div className="rounded-t-3xl bg-white px-6 py-4">
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
                    {/* @ts-expect-error because it's a web component */}
                    <qr-code
                      key={address}
                      squares={false}
                      contents={address}
                      module-color="#000"
                      position-ring-color="#000"
                      position-center-color="#000"
                    >
                      <img
                        src="/icons/ithaca-light.svg"
                        alt="icon"
                        slot="icon"
                      />
                    </qr-code>
                  </div>
                  <div className="-mt-5 relative flex items-center justify-center gap-x-4">
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
                  {/* <Ariakit.Separator className="mt-4 py-4" /> */}
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
          <Button variant="default" className="bg-gray6!">
            Withdraw
          </Button>
        </div>
      </section>
      <section className="items-center gap-2 pr-1 pl-1.5">
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
          <div className="mt-3">
            <Ariakit.TabPanel tabId="assets">
              <table className="md:table-none w-full table-fixed">
                <thead className="">
                  <tr className="*:font-light *:text-secondary *:text-sm">
                    <th className="text-left">Name</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="w-full">
                  {filteredAssets.map((asset, _index) => (
                    <tr
                      key={asset.name}
                      className={cn(
                        'border-gray-400/50 border-b *:px-1',
                        _index === filteredAssets.length - 1 && 'border-b-0',
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
            className={cn(
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
    </Layout>
  )
}
