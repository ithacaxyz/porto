import * as Ariakit from '@ariakit/react'
import { Value } from 'ox'
import * as React from 'react'
import { useAccount } from 'wagmi'
import { Layout } from '~/components/AppLayout'

import { Header } from '~/components/Header'
import { IndeterminateLoader } from '~/components/IndeterminateLoader'
import { MailListSignup } from '~/components/MailListSignup'
import { Pill } from '~/components/Pill'
import { ThemeToggle } from '~/components/ThemeToggle'
import { useTokenBalances } from '~/hooks/use-address-token-balances'
import { PercentFormatter, ValueFormatter, cn, sum } from '~/utils'
import CoinsIcon from '~icons/lucide/coins'
import HistoryIcon from '~icons/lucide/history'
import { AddMoneyDialog } from './dialogs/Add'
import { DepositDialog } from './dialogs/Deposit'
import { SendDialog } from './dialogs/Send'

export function Dashboard() {
  const { address } = useAccount()

  const { data: tokenBalancesData, status } = useTokenBalances({
    address: address!,
  })

  const assets = tokenBalancesData

  const [search, setSearch] = React.useState('')
  const [filteredAssets, setFilteredAssets] = React.useState(assets)

  React.useEffect(() => {
    setFilteredAssets(
      assets?.filter((asset) =>
        asset.token.name?.toLowerCase().includes(search.toLowerCase()),
      ),
    )
  }, [search, assets])

  const totalBalance = React.useMemo(() => {
    if (!assets) return 0n
    const total = BigInt(sum(assets?.map((asset) => Number(asset?.value ?? 0))))
    return ValueFormatter.format(total, 18)
  }, [assets])

  return (
    <Layout className="max-w-2xl!">
      <Header />
      <section
        className={cn(
          'h-lg',
          tokenBalancesData &&
            tokenBalancesData.length > 0 &&
            'gap-2 pt-10 *:w-1/2',
          'flex flex-col items-center gap-5 rounded-2xl bg-surface px-4 py-6',
          'sm:flex-row sm:justify-between sm:px-6',
        )}
      >
        <div className="w-full gap-y-2 text-center tabular-nums sm:text-left">
          <p className="text-center font-semibold text-4xl sm:text-left sm:font-semibold sm:text-4xl">
            ${totalBalance}
          </p>
          {assets && assets?.length > 0 ? (
            <p className="text-md text-secondary sm:my-auto sm:text-md">
              {sum(
                assets?.map((asset) =>
                  Number(
                    Value.format(
                      BigInt(asset?.value ?? 0),
                      Number(asset.token.decimals),
                    ),
                  ),
                ),
              ).toLocaleString()}
              <Pill className="ml-1.5">{assets?.[0]?.token.symbol}</Pill>
            </p>
          ) : (
            <p className="min-[300px]! w-full text-secondary">
              Add funds to get started
            </p>
          )}
        </div>

        <div
          className={cn(
            'gap-6 max-[300px]:gap-x-4.5 sm:gap-2',
            'context-stretch items-stretch justify-items-center',
            tokenBalancesData && tokenBalancesData.length > 0
              ? 'grid size-full min-w-full grid-cols-3 grid-rows-1 sm:size-auto sm:min-w-min sm:grid-cols-2 sm:grid-rows-2'
              : 'flex max-w-[300px] items-center justify-center gap-2! *:w-full',
          )}
        >
          {status === 'pending' ? (
            <IndeterminateLoader title="Loading assets" />
          ) : (
            <React.Fragment>
              {/* ==== SEND ==== */}
              {status === 'success' &&
                tokenBalancesData &&
                tokenBalancesData.length > 0 && <SendDialog />}

              {/* ==== RECEIVE ==== */}
              <DepositDialog />

              {/* ==== ADD ==== */}
              <AddMoneyDialog
                className={cn(
                  status === 'success' &&
                    tokenBalancesData &&
                    tokenBalancesData.length > 0
                    ? 'bg-gray7! hover:bg-gray6'
                    : 'bg-accent! text-white hover:bg-accent/90!',
                )}
              />
            </React.Fragment>
          )}
        </div>
      </section>

      <section className="mt-1 items-center gap-2 px-1">
        <Ariakit.TabProvider defaultSelectedId="assets">
          <Ariakit.TabList
            aria-label="tabs"
            className="tab-list flex justify-between gap-x-2 *:gap-x-1 *:px-3 sm:gap-x-3 *:sm:gap-x-2 *:sm:px-4"
          >
            <Ariakit.Tab
              id="assets"
              tabbable={true}
              className={cn(
                'tab flex rounded-4xl border-2 border-gray6',
                'data-[active-item=true]:border-blue9 data-[active-item=true]:text-accent',
              )}
            >
              <CoinsIcon className="my-auto size-5" />
              <span className="my-auto">Assets</span>
            </Ariakit.Tab>
            <Ariakit.Tab
              id="history"
              tabbable={true}
              className={cn(
                'tab mr-auto flex rounded-4xl border-2 border-gray6',
                'data-[active-item=true]:border-blue9 data-[active-item=true]:text-accent',
              )}
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
                'ml-2 w-full max-w-[50%] rounded-full border border-gray8 bg-transparent px-4 py-2 text-gray12',
                'placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-gray6 sm:ml-8 sm:max-w-[300px]',
              )}
            />
          </Ariakit.TabList>
          <div className="mt-5">
            <Ariakit.TabPanel tabId="assets">
              <table className={cn('md:table-none w-full')}>
                <thead className="">
                  <tr className="*:font-light *:text-gray12 *:text-sm">
                    <th className="text-left">Name</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="w-full">
                  {/* @ts-ignore */}
                  {filteredAssets?.map((asset, index) => {
                    const token = asset.token

                    return (
                      <tr
                        key={`${asset.token.name + index}`}
                        className={cn(
                          'border-gray-400/50 border-b *:px-1',
                          !filteredAssets ||
                            (index === filteredAssets.length - 1 &&
                              'border-b-0'),
                        )}
                      >
                        <td className="text-left">
                          <div className="flex items-center gap-x-2 py-4">
                            {/* {token.icon_url} */}
                            <img
                              alt={token.name}
                              className=" size-9"
                              src={`/icons/${token?.symbol?.toLowerCase()}.svg`}
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-lg">
                                {token.name}
                              </span>
                              <span className="text-secondary text-xs">
                                {token.symbol}
                              </span>
                            </div>
                            {/* {index === 0 && (
                              <Ariakit.MenuProvider>
                                 <Ariakit.MenuButton className="-space-x-1 mb-auto flex gap-x-0.5 rounded-2xl bg-gray4 py-1.5 pr-1 pl-1.5">
                                  <TokenIcon.Op className="size-5 text-gray10" />
                                  <TokenIcon.Eth className="size-5 text-gray10" />
                                  <ChevronDownIcon className="size-5 text-gray10" />
                                </Ariakit.MenuButton>
                                <Ariakit.Menu>
                                  <Ariakit.MenuItem>WIP</Ariakit.MenuItem>
                                </Ariakit.Menu>
                              </Ariakit.MenuProvider>
                            )} */}
                          </div>
                        </td>
                        <td className="text-right">
                          <div className="flex flex-col">
                            {token?.symbol && (
                              <span className="text-lg">$1</span>
                            )}
                            <span
                              className={cn(
                                'text-sm tracking-wider',
                                token?.symbol?.toLowerCase() === 'exp' ||
                                  token?.symbol?.toLowerCase() === 'exp2'
                                  ? [
                                      // asset?.price.change > 0 && 'text-emerald-500',
                                      //         asset?.price.change < 0 && 'text-red-500',
                                      //         !asset?.price.change && 'text-secondary'
                                    ]
                                  : [],
                              )}
                            >
                              {/* {asset?.price.change > 0
                                ? '↑'
                                : asset?.price.change < 0
                                  ? '↓'
                                  : ''} */}
                              {PercentFormatter.format(Math.random() * 100)
                                .toString()
                                .replaceAll('-', '')}
                            </span>
                          </div>
                        </td>
                        <td className="text-right">
                          <div className="flex flex-col">
                            <span className="text-lg">
                              $
                              {Value.format(
                                BigInt(asset?.value),
                                Number(token?.decimals),
                              )}
                            </span>
                            <span className="text-secondary text-sm">
                              {Value.format(
                                BigInt(asset?.value),
                                Number(token?.decimals),
                              )}{' '}
                              <Pill className="">{token?.symbol}</Pill>
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {filteredAssets?.length === 0 && (
                <div className="mt-32 flex h-full min-h-full flex-col items-center">
                  <div className="flex size-16 items-center justify-center rounded-full border-3 border-gray9 border-dashed">
                    <span className="m-auto size-2 rounded-full border-3 border-gray9" />
                  </div>
                  <p className="max-w-[200px] pt-5 text-center font-medium text-gray10 text-xl sm:max-w-[150px] sm:text-md">
                    You have no assets in this wallet.
                  </p>
                </div>
              )}
            </Ariakit.TabPanel>
            <Ariakit.TabPanel tabId="history" />
          </div>
        </Ariakit.TabProvider>
      </section>
      {/* ==== Footer ==== */}
      <section className="mt-auto flex flex-col gap-y-5 p-1 sm:p-2">
        <MailListSignup />
        <div className="flex flex-row justify-between px-4">
          <p className="flex gap-x-2 text-secondary leading-[22px]">
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
      </section>

      <ThemeToggle />
    </Layout>
  )
}
