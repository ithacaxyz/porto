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
import { useAddressTransfers } from '~/hooks/use-address-transfers'
import { config } from '~/lib/Wagmi'
import {
  DateFormatter,
  PercentFormatter,
  StringFormatter,
  ValueFormatter,
  cn,
  sum,
} from '~/utils'
import CoinsIcon from '~icons/lucide/coins'
import HistoryIcon from '~icons/lucide/history'
import { AddMoneyDialog } from './dialogs/Add'
import { DepositDialog } from './dialogs/Deposit'
import { SendDialog } from './dialogs/Send'

export function Dashboard() {
  const { address } = useAccount()

  const { data: assets, status } = useTokenBalances({
    address: address!,
  })

  const { data: transfers } = useAddressTransfers()

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

  const [selectedChains, setSelectedChains] = React.useState(
    config.chains.map((c) => c.id.toString()),
  )

  const filteredTransfers = React.useMemo(() => {
    return transfers
      ?.filter((c) =>
        selectedChains.some((cc) => cc === c?.chainId?.toString()),
      )
      .flatMap((chainTransfer) =>
        chainTransfer?.items.map((item) => ({
          chainId: chainTransfer.chainId,
          ...item,
        })),
      )
  }, [transfers, selectedChains])

  return (
    <Layout className="font-sf-pro">
      <Header />
      <section
        className={cn(
          'h-lg',
          assets && assets.length > 0 && 'gap-2 pt-10 *:w-1/2',
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
            assets && assets.length > 0
              ? 'grid size-full min-w-full grid-cols-3 grid-rows-1 sm:size-auto sm:min-w-min sm:grid-cols-2 sm:grid-rows-2'
              : 'flex w-[260px] max-w-[300px] items-center justify-center gap-2! *:w-full',
          )}
        >
          {status === 'pending' ? (
            <IndeterminateLoader title="Loading assets" />
          ) : (
            <React.Fragment>
              {/* ==== SEND ==== */}
              {status === 'success' && assets && assets.length > 0 && (
                <SendDialog />
              )}

              {/* ==== RECEIVE ==== */}
              <DepositDialog />

              {/* ==== ADD ==== */}
              <AddMoneyDialog
                className={cn(
                  status === 'success' && assets && assets.length > 0
                    ? 'bg-gray7! hover:bg-gray6!'
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
          <div className="">
            <Ariakit.TabPanel tabId="assets" className="mt-5">
              <table className={cn('md:table-none w-full')}>
                <thead className="">
                  <tr className="*:font-light *:text-gray12 *:text-sm">
                    <th className="text-left">Name</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="w-full">
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
            <Ariakit.TabPanel
              tabId="history"
              className="mt-2 space-y-2"
              hidden={!import.meta.env.DEV}
            >
              <div className="pt-3 pb-2">
                <SelectChains
                  values={selectedChains}
                  setValues={setSelectedChains}
                />
              </div>
              <div className="inline-block min-w-full overflow-x-scroll rounded-md bg-gray3 py-3 align-middle shadow-gray1 shadow-md outline outline-gray5">
                <div className="min-w-full overflow-x-scroll px-2">
                  <table className="table-none w-full min-w-full tabular-nums sm:table-fixed">
                    <thead className="min-w-full border-b border-b-gray9">
                      <tr className="*:px-2 *:py-1">
                        <th scope="col" className="w-[75px] text-left">
                          timestamp
                        </th>
                        <th scope="col" className="w-[25px] text-left">
                          asset
                        </th>
                        <th scope="col" className="w-[30px] text-left">
                          amount
                        </th>
                        <th scope="col" className="w-[50px] text-left">
                          type
                        </th>
                        <th scope="col" className="w-[80px] text-right">
                          hash
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {filteredTransfers?.map((transfer) => (
                        <tr
                          key={transfer?.transaction_hash}
                          className="border-gray-400/50 border-b *:p-1 hover:bg-gray5"
                        >
                          <td>
                            {DateFormatter.format(
                              transfer?.timestamp ?? '',
                            ).replaceAll(',', '')}
                          </td>
                          <td>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent"
                              href={`https://explorer.ithaca.xyz/token/${transfer?.token.address}`}
                            >
                              {transfer?.token.symbol}
                            </a>
                          </td>
                          <td>
                            {Value.format(
                              BigInt(transfer?.total.value ?? 0),
                              Number(transfer?.token.decimals ?? 0),
                            )}
                          </td>

                          <td>{transfer?.type}</td>
                          <td className="ml-auto text-right">
                            <a
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent"
                              href={`https://explorer.ithaca.xyz/tx/${transfer?.transaction_hash}`}
                            >
                              {StringFormatter.truncate(
                                transfer?.transaction_hash ?? '',
                                {
                                  end: 8,
                                  start: 8,
                                },
                              )}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Ariakit.TabPanel>
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

function renderValue(value: string[]) {
  if (value.length === 0) return 'No chain selected'
  if (value.length === 1) return value[0]
  return `${value.length} chains selected`
}

function SelectChains({
  values,
  setValues,
}: {
  values: string[]
  setValues: (values: string[]) => void
}) {
  return (
    <Ariakit.SelectProvider value={values} setValue={setValues}>
      <Ariakit.Select className="flex w-full max-w-[220px] items-center justify-between rounded-xl bg-gray5 px-3 py-3 shadow-gray1 shadow-md outline outline-gray7 hover:bg-gray4">
        <span>{renderValue(values)}</span>
        <Ariakit.SelectArrow />
      </Ariakit.Select>
      <Ariakit.SelectPopover
        gutter={4}
        sameWidth
        unmountOnHide
        className="popover w-[260px] space-y-2 rounded-lg bg-gray4 px-1.5 py-3"
      >
        {config.chains.map((chain) => (
          <Ariakit.SelectItem
            key={chain.name}
            value={chain.id.toString()}
            className="select-item flex cursor-default items-center justify-between gap-x-2 bg-gray5 px-2 py-4 hover:bg-gray6"
          >
            <span>{chain.name}</span>
            <span className="ml-auto">{chain.id}</span>
            <Ariakit.SelectItemCheck />
          </Ariakit.SelectItem>
        ))}
      </Ariakit.SelectPopover>
    </Ariakit.SelectProvider>
  )
}
