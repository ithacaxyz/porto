import { Button, Spinner } from '@porto/apps/components'

import * as Ariakit from '@ariakit/react'
import clsx from 'clsx'
import { Cuer } from 'cuer'
import { matchSorter } from 'match-sorter'
import { Address, Hex, Value } from 'ox'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import { encodeFunctionData, erc20Abi, formatEther } from 'viem'
import { useAccount } from 'wagmi'
import { useSendCalls } from 'wagmi/experimental'
import ArrowLeftRightIcon from '~icons/lucide/arrow-left-right'
import ArrowRightIcon from '~icons/lucide/arrow-right'
import ClipboardCopyIcon from '~icons/lucide/clipboard-copy'
import CopyIcon from '~icons/lucide/copy'
import ExternalLinkIcon from '~icons/lucide/external-link'
import SendIcon from '~icons/lucide/send-horizontal'
import WalletIcon from '~icons/lucide/wallet-cards'
import XIcon from '~icons/lucide/x'
import AccountIcon from '~icons/material-symbols/account-circle-full'
import NullIcon from '~icons/material-symbols/do-not-disturb-on-outline'
import WorldIcon from '~icons/tabler/world'

import { Link } from '@tanstack/react-router'
import { CustomToast } from '~/components/CustomToast'
import { DevOnly } from '~/components/DevOnly'
import { TruncatedAddress } from '~/components/TruncatedAddress'
import {
  useAddressTransfers,
  useTokenBalances,
} from '~/hooks/use-blockscout-api'
import { swapAssets } from '~/lib/Constants'
import { config } from '~/lib/Wagmi'
import { DateFormatter, StringFormatter, ValueFormatter, sum } from '~/utils'
import { Layout } from './Layout'

function ShowMore({
  text,
  className,
  onChange,
}: {
  text: string
  className?: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}) {
  const checkbox = Ariakit.useCheckboxStore()
  const label = Ariakit.useStoreState(checkbox, (state) =>
    state.value ? 'Show less' : text,
  )

  return (
    <Ariakit.Checkbox
      render={<p />}
      store={checkbox}
      onChange={onChange}
      className={clsx(className, '')}
    >
      {label}
    </Ariakit.Checkbox>
  )
}

type TableProps<T> = {
  data: ReadonlyArray<T> | undefined
  emptyMessage: string
  columns: {
    header: string
    key: string
    align?: 'left' | 'right' | 'center'
    width?: string
  }[]
  renderRow: (item: T) => React.ReactNode
  showMoreText: string
  initialCount?: number
}

function PaginatedTable<T>({
  data,
  emptyMessage,
  columns,
  renderRow,
  showMoreText,
  initialCount = 5,
}: TableProps<T>) {
  const [firstItems, remainingItems] = React.useMemo(
    () =>
      !data
        ? [[], []]
        : [data.slice(0, initialCount), data.slice(initialCount)],
    [data, initialCount],
  )

  const [showAll, setShowAll] = React.useState<'ALL' | 'DEFAULT'>('DEFAULT')
  const itemsToShow = showAll === 'ALL' ? data : firstItems

  return (
    <>
      <table className="my-3 w-full table-auto">
        <thead>
          <tr className="text-gray10 *:font-normal *:text-sm">
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  col.width,
                  col.align === 'right' ? 'text-right' : 'text-left',
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="border-transparent border-t-10">
          {itemsToShow && itemsToShow?.length > 0 ? (
            itemsToShow?.map(renderRow)
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center text-gray12">
                <p className="mt-2 text-sm">No {emptyMessage}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {remainingItems.length > 0 && (
        <div className="flex justify-start">
          <ShowMore
            onChange={() => setShowAll(showAll === 'ALL' ? 'DEFAULT' : 'ALL')}
            text={`Show ${remainingItems.length} ${showMoreText}`}
            className="cursor-default font-medium text-gray10 text-sm"
          />
        </div>
      )}
    </>
  )
}

const recoveryMethods: Array<{ address: string; name: string }> = []

export function Dashboard() {
  const account = useAccount()
  const disconnect = Hooks.useDisconnect()

  const permissions = Hooks.usePermissions()
  console.info(permissions)
  const revokePermissions = Hooks.useRevokePermissions()

  const { data: assets } = useTokenBalances()

  const { data: transfers } = useAddressTransfers()
  const [selectedChains, _setSelectedChains] = React.useState(
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

  const totalBalance = React.useMemo(() => {
    if (!assets) return 0n
    const summed = sum(assets?.map((asset) => Number(asset?.value ?? 0)))

    const total = BigInt(summed) ?? 0n
    return ValueFormatter.format(total, 18)
  }, [assets])

  return (
    <>
      <DevOnly />
      <div className="h-3" />
      <Layout.Header
        right={
          <div className="flex gap-2">
            <Button size="small" className="">
              Help
            </Button>
            <Button
              onClick={() => disconnect.mutate({})}
              size="small"
              variant="destructive"
            >
              Sign out
            </Button>
          </div>
        }
      />

      <div className="h-8" />

      <div className="flex max-h-[100px] w-full">
        <div className="flex flex-1 flex-col justify-between">
          <div className="font-[500] text-[13px] text-gray10">Your account</div>
          <div>
            <div className="font-[500] text-[24px] tracking-[-2.8%]">
              ${totalBalance}
            </div>
            <div className="flex items-center gap-1">
              <div className="font-[500] text-[13px] text-gray10 tracking-[-0.25px]">
                ≈ X.XXX
              </div>
              <div className="rounded-full bg-gray3 px-[6px] py-[2px] font-[600] text-[10px] text-gray10 tracking-[-2.8%]">
                ETH
              </div>
            </div>
          </div>
        </div>
        <Ariakit.Button
          onClick={() =>
            navigator.clipboard
              .writeText(account.address ?? '')
              .then(() => toast.success('Copied address to clipboard'))
              .catch(() => toast.error('Failed to copy address to clipboard'))
          }
          className="flex w-[150px] items-center justify-center gap-3 hover:cursor-pointer!"
        >
          <Cuer.Root
            className="rounded-lg border border-surface bg-white p-2.5 dark:bg-secondary"
            value={account.address ?? ''}
          >
            <Cuer.Finder radius={1} />
            <Cuer.Cells />
          </Cuer.Root>
          <p className="min-w-[6ch] max-w-[6ch] text-pretty break-all font-mono font-normal text-[11px] text-gray10">
            {account.address}
          </p>
        </Ariakit.Button>
      </div>

      <div className="h-6" />
      <hr className="border-gray5" />
      <div className="h-4" />

      <details className="group" open={assets?.length > 0}>
        <summary className='relative cursor-default list-none pr-1 font-semibold text-lg after:absolute after:right-1 after:font-normal after:text-gray10 after:text-sm after:content-["[+]"] group-open:after:content-["[–]"]'>
          Assets
        </summary>

        <PaginatedTable
          emptyMessage="No balances available for this account"
          data={assets}
          columns={[
            { header: 'Name', key: 'name', width: 'w-[40%]' },
            { header: '', key: 'balance', width: 'w-[20%]', align: 'right' },
            { header: '', key: 'symbol', width: 'w-[20%]', align: 'right' },
            { header: '', key: 'action', width: 'w-[20%]', align: 'right' },
          ]}
          renderRow={(asset) => (
            <AssetRow
              key={asset.token.address}
              address={asset.token.address}
              logo={`/icons/${asset.token.name.toLowerCase()}.svg`}
              symbol={asset.token.symbol}
              name={asset.token.name}
              value={asset.value}
            />
          )}
          showMoreText="more assets"
        />
      </details>

      <div className="h-4" />
      <hr className="border-gray5" />
      <div className="h-4" />

      <details
        className="group tabular-nums"
        open={filteredTransfers?.length > 0}
      >
        <summary className='relative cursor-default list-none pr-1 font-semibold text-lg after:absolute after:right-1 after:font-normal after:text-gray10 after:text-sm after:content-["[+]"] group-open:after:content-["[–]"]'>
          History
        </summary>

        <PaginatedTable
          data={filteredTransfers}
          emptyMessage="No transactions yet"
          columns={[
            { header: 'Time', key: 'time' },
            { header: 'Account', key: 'recipient' },
            { header: 'Amount', key: 'amount', align: 'right' },
          ]}
          renderRow={(transfer) => (
            <tr
              key={`${transfer?.transaction_hash}-${transfer?.block_number}`}
              className="text-xs sm:text-sm "
            >
              <td className="py-1 text-left">
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-row items-center"
                  href={`https://explorer.ithaca.xyz/tx/${transfer?.transaction_hash}`}
                >
                  <span className="min-w-[65px] text-gray11">
                    {DateFormatter.ago(new Date(transfer?.timestamp ?? ''))} ago
                  </span>
                  <ExternalLinkIcon className="size-4 text-gray10" />
                </a>
              </td>
              <td className="flex min-w-full items-center py-1 text-left font-medium">
                <div className="my-0.5 flex flex-row items-center gap-x-2 rounded-full bg-gray3 p-0.5">
                  <AccountIcon className="size-4 rounded-full text-gray10" />
                </div>
                <TruncatedAddress
                  className="ml-2"
                  address={transfer?.to.hash ?? ''}
                />
              </td>
              <td className="py-1 text-right text-gray12">
                <span className="text-md">
                  {Value.format(
                    BigInt(transfer?.total.value ?? 0),
                    Number(transfer?.token.decimals ?? 0),
                  )}
                </span>
                <div className="inline-block w-[65px]">
                  <span className="rounded-2xl bg-gray3 px-2 py-1 font-[500] text-gray10 text-xs">
                    {transfer?.token.symbol}
                  </span>
                </div>
              </td>
            </tr>
          )}
          showMoreText="more transactions"
        />
      </details>

      <div className="h-4" />
      <hr className="border-gray5" />
      <div className="h-4" />

      <details
        className="group pb-1 tabular-nums"
        open={permissions?.data && permissions?.data?.length > 0}
      >
        <summary className='relative my-auto cursor-default list-none space-x-1 pr-1 font-semibold text-lg after:absolute after:right-1 after:font-normal after:text-gray10 after:text-sm after:content-["[+]"] group-open:after:content-["[–]"]'>
          <span>Permissions</span>
          <Button
            variant="destructive"
            size="small"
            type="button"
            onClick={() => {
              permissions?.data?.map((permission) => {
                revokePermissions.mutate({ id: permission.id })
              })
            }}
            className="ml-2"
          >
            Revoke all
          </Button>
        </summary>

        <PaginatedTable
          data={permissions?.data}
          emptyMessage="No permissions added yet"
          initialCount={3}
          showMoreText="more permissions"
          columns={[
            { header: 'Time', key: 'time' },
            { header: 'Name', key: 'name', width: '' },
            { header: 'Scope', key: 'scope', align: 'left' },
            {
              header: 'Amount',
              key: 'amount',
              align: 'left',
              width: 'w-[120px]',
            },
            { header: '', key: 'period', align: 'left', width: 'w-[60px]' },
            { header: '', key: 'action', align: 'right' },
          ]}
          renderRow={(permission) => {
            const [spend] = permission?.permissions?.spend ?? []
            const [calls] = permission?.permissions?.calls ?? []

            const time = DateFormatter.timeToDuration(permission.expiry * 1_000)
            return (
              <tr
                key={`${permission.id}-${permission.expiry}`}
                className="*:text-xs! *:sm:text-sm!"
              >
                <td className="max-w-[50px] py-3 text-left">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://explorer.ithaca.xyz/address/${permission.address}`}
                    className="flex flex-row items-center"
                  >
                    <span className="min-w-[37px] text-gray11">{time}</span>
                    <ExternalLinkIcon className="mr-2 size-4 text-gray10" />
                  </a>
                </td>
                <td className="text-right">
                  <div className="flex flex-row items-center gap-x-0 sm:gap-x-2">
                    <div className="flex size-7 items-center justify-center rounded-full bg-blue-100">
                      <WorldIcon className="m-auto size-5 text-blue-400" />
                    </div>

                    <TruncatedAddress
                      className="ml-1 font-medium"
                      address={permission.address}
                    />
                  </div>
                </td>
                <td className="text-left">
                  <span className="ml-1 text-gray11">
                    {calls?.signature ?? '––'}
                  </span>
                </td>
                <td className="w-[50px] text-right">
                  <div className="flex w-fit min-w-fit max-w-[105px] flex-row items-end justify-end gap-x-2 overflow-hidden whitespace-nowrap rounded-2xl bg-gray3 px-1.5 py-1 text-right font-[500] text-gray10">
                    <span className="truncate">
                      {formatEther(
                        Hex.toBigInt(spend?.limit as unknown as Hex.Hex),
                      )}
                    </span>
                    <span className="truncate">
                      {StringFormatter.truncate(spend?.token ?? '', {
                        start: 4,
                        end: 4,
                      })}
                    </span>
                  </div>
                </td>
                <td className="w-[30px] pl-1">
                  <span className="text-gray11">{spend?.period}ly</span>
                </td>
                <td className="w-min max-w-[25px] text-right">
                  <Ariakit.Button
                    disabled={time === 'expired'}
                    className={clsx(
                      'size-8 rounded-full p-1',
                      time === 'expired'
                        ? 'text-gray10'
                        : 'text-gray11 hover:bg-red-100 hover:text-red-500',
                    )}
                    onClick={() => {
                      revokePermissions.mutate({ id: permission.id })
                    }}
                  >
                    {time === 'expired' ? (
                      <NullIcon className="m-auto size-5" />
                    ) : (
                      <XIcon className={clsx('m-auto size-5')} />
                    )}
                  </Ariakit.Button>
                </td>
              </tr>
            )
          }}
        />
      </details>

      <div className="h-4" />
      <hr className="border-gray5" />
      <div className="h-4" />

      <details className="group pb-1" open={recoveryMethods.length > 0}>
        <summary className='relative my-auto cursor-default list-none space-x-1 pr-1 font-semibold text-lg after:absolute after:right-1 after:font-normal after:text-gray10 after:text-sm after:content-["[+]"] group-open:after:content-["[–]"]'>
          <span>Recovery</span>
          <Button
            size="small"
            type="button"
            className="ml-2"
            variant="default"
            render={<Link to="/recovery" />}
          >
            Add wallet
          </Button>
        </summary>

        <table className="my-3 w-full">
          <thead>
            <tr className="text-gray10 *:font-normal *:text-sm">
              <th className="text-left">Name</th>
              <th className="invisible text-right">Action</th>
            </tr>
          </thead>
          <tbody className="border-transparent border-t-10">
            {recoveryMethods.length ? (
              recoveryMethods.map((method) => (
                <tr key={method.address} className="text-xs sm:text-sm">
                  <td className="w-[73%] text-right">
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100">
                        <WalletIcon className="m-auto size-5 text-teal-600" />
                      </div>
                      <span className="font-medium text-gray12">
                        <TruncatedAddress address={method.address} />
                      </span>
                    </div>
                  </td>

                  <td className="text-right">
                    <Ariakit.Button
                      className="size-8 rounded-full p-1 hover:bg-gray4"
                      onClick={() => {
                        console.info('')
                      }}
                    >
                      <CopyIcon className={clsx('m-auto size-5 text-gray10')} />
                    </Ariakit.Button>
                    <Ariakit.Button
                      className="size-8 rounded-full p-1 hover:bg-red-100"
                      onClick={() => {
                        console.info('')
                      }}
                    >
                      <XIcon className={clsx('m-auto size-5 text-red-500')} />
                    </Ariakit.Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center text-gray12">
                  <p className="text-sm">No recovery methods added yet</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </details>
    </>
  )
}

function AssetRow({
  logo,
  symbol,
  name,
  value,
  address,
}: {
  logo: string
  symbol: string
  name: string
  value: string
  address: string
}) {
  const [viewState, setViewState] = React.useState<'send' | 'swap' | 'default'>(
    'swap',
  )

  const sendCalls = useSendCalls({
    mutation: {
      onSuccess: (data) => {
        console.info(sendFormState.values.sendAmount)
        toast.custom(
          (t) => (
            <CustomToast
              className={t}
              kind="SUCCESS"
              title="Transaction completed"
              description={
                <p>
                  You successfully sent {sendFormState.values.sendAmount}{' '}
                  {symbol}
                  <br />
                  <a
                    href={`https://explorer.ithaca.xyz/tx/${data}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray12 underline"
                  >
                    View on explorer
                  </a>
                </p>
              }
            />
          ),

          { duration: 4_500 },
        )
        sendForm.setState('submitSucceed', (count) => +count + 1)
        sendForm.setState('submitFailed', 0)
      },
      onError: (error) => {
        const notAllowed = error.message.includes('not allowed')
        toast.custom(
          (t) => (
            <CustomToast
              className={t}
              kind={notAllowed ? 'WARN' : 'ERROR'}
              title={
                notAllowed ? 'Transaction cancelled' : 'Transaction failed'
              }
              description={
                notAllowed
                  ? 'Transaction submission was cancelled.'
                  : 'You do not have enough balance to complete this transaction.'
              }
            />
          ),

          { duration: 3_500 },
        )
        sendForm.setState('submitFailed', (count) => +count + 1)
        sendForm.setState('submitSucceed', 0)
      },
    },
  })

  const sendForm = Ariakit.useFormStore({
    defaultValues: {
      sendAmount: '',
      sendRecipient: '',
      sendAsset: address,
    },
  })
  const sendFormState = Ariakit.useStoreState(sendForm)

  sendForm.useSubmit((state) => {
    if (
      !Address.validate(state.values.sendRecipient) ||
      !state.values.sendAmount
    )
      return
    sendCalls.sendCalls({
      calls: [
        {
          to: address,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: 'transfer',
            args: [
              state.values.sendRecipient,
              Value.fromEther(state.values.sendAmount),
            ],
          }),
        },
      ],
    })
  })

  const swapCalls = useSendCalls({
    mutation: {
      onSuccess: (data) => {
        toast.custom(
          (t) => (
            <CustomToast
              className={t}
              kind="SUCCESS"
              title="Transaction completed"
              description={
                <p>
                  You successfully received {swapFormState.values.swapAmount}{' '}
                  {symbol}
                  <br />
                  <a
                    href={`https://explorer.ithaca.xyz/tx/${data}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray12 underline"
                  >
                    View on explorer
                  </a>
                </p>
              }
            />
          ),
          { duration: 3_500 },
        )
        swapForm.setState('submitSucceed', (count) => +count + 1)
        swapForm.setState('submitFailed', 0)
      },
      onError: (error) => {
        const notAllowed = error.message.includes('not allowed')
        toast.custom(
          (t) => (
            <CustomToast
              className={t}
              kind={notAllowed ? 'WARN' : 'ERROR'}
              title={
                notAllowed ? 'Transaction cancelled' : 'Transaction failed'
              }
              description={
                notAllowed
                  ? 'Transaction submission was cancelled.'
                  : 'You do not have enough balance to complete this transaction.'
              }
            />
          ),
          { duration: 3_500 },
        )
        swapForm.setState('submitFailed', (count) => +count + 1)
        swapForm.setState('submitSucceed', 0)
      },
    },
  })

  const swapForm = Ariakit.useFormStore({
    defaultValues: {
      swapAmount: '',
      swapAsset: address,
    },
  })
  const swapFormState = Ariakit.useStoreState(swapForm)

  swapForm.useSubmit(async (_state) => {
    if (!(await swapForm.validate())) return

    swapCalls.sendCalls({
      calls: [
        {
          to: address,
        },
      ],
    })
  })

  const [swapSearchValue, setSwapSearchValue] = React.useState('')

  const swapAssetsExcludingCurrent = swapAssets.filter(
    (asset) => asset.symbol.toLowerCase() !== symbol.toLowerCase(),
  )

  const [selectedAsset, setSelectedAsset] = React.useState(
    swapAssetsExcludingCurrent[0],
  )

  swapForm.useValidate(async (state) => {
    if (Number(value) <= Number(state.values.swapAmount)) {
      swapForm.setError('swapAmount', 'Amount is too high')
    }
  })

  const matches = React.useMemo(
    () =>
      matchSorter(swapAssetsExcludingCurrent, swapSearchValue, {
        keys: ['symbol', 'name', 'address'],
        baseSort: (a, b) => (a.index < b.index ? -1 : 1),
      }),
    [swapSearchValue, swapAssetsExcludingCurrent],
  )

  return (
    <tr className="font-normal sm:text-sm">
      {viewState === 'default' ? (
        <>
          <td className="w-[80%]">
            <div className="flex items-center gap-x-2 py-2">
              <img alt="asset icon" className="size-7" src={logo} />
              <span className="font-medium text-md">{name}</span>
            </div>
          </td>
          <td className="w-[20%] text-right text-md">
            {Number(value) < 1 ? 1 : formatEther(BigInt(value))}
          </td>
          <td className="w-[20%] pr-1.5 pl-3 text-left text-sm">
            <span className="rounded-2xl bg-gray3 px-2 py-1 font-[500] text-gray10 text-xs">
              {symbol}
            </span>
          </td>
          <td className="text-right text-sm">
            <div className="flex">
              <Ariakit.Button
                className="my-auto rounded-full p-2 hover:bg-gray4"
                onClick={() => setViewState('swap')}
              >
                <ArrowLeftRightIcon className="my-auto size-4 cursor-pointer text-gray9" />
              </Ariakit.Button>
              <Ariakit.Button
                className="my-auto rounded-full p-2 hover:bg-gray4"
                onClick={() => setViewState('send')}
              >
                <SendIcon className="my-auto size-4 cursor-pointer text-gray9" />
              </Ariakit.Button>
            </div>
          </td>
        </>
      ) : viewState === 'swap' ? (
        <td colSpan={4} className="w-full py-2">
          <Ariakit.Form
            store={swapForm}
            validateOnBlur={true}
            validateOnChange={true}
            className={clsx(
              'flex gap-x-2',
              '*:h-[62px] *:w-1/2 *:rounded-xl *:border-1 *:border-gray6 *:bg-white *:dark:bg-gray1',
            )}
          >
            <div className="z-[10000] flex items-center gap-x-2 shadow-xs focus-within:border-gray8 focus:outline-sky-500">
              <Ariakit.ComboboxProvider
                resetValueOnHide={true}
                setValue={(value) => {
                  React.startTransition(() => setSwapSearchValue(value))
                }}
              >
                <Ariakit.VisuallyHidden>
                  <Ariakit.ComboboxLabel>Select asset</Ariakit.ComboboxLabel>
                </Ariakit.VisuallyHidden>
                <Ariakit.SelectProvider defaultValue={selectedAsset?.symbol}>
                  <Ariakit.VisuallyHidden>
                    <Ariakit.SelectLabel>Select asset</Ariakit.SelectLabel>
                  </Ariakit.VisuallyHidden>
                  <Ariakit.Select className="flex w-full rounded-xl py-2.5 pr-2 pl-3">
                    <img
                      src={logo}
                      alt="asset icon"
                      className="my-auto size-7"
                    />
                    <div className="mx-1.5 my-auto">
                      <ArrowRightIcon className="size-5 text-gray10" />
                    </div>
                    <img
                      src={selectedAsset?.logo}
                      alt="asset icon"
                      className="my-auto size-7"
                    />
                    <div className="my-auto ml-2 flex flex-col items-start overflow-hidden text-ellipsis whitespace-nowrap">
                      <span className="font-normal text-gray10 text-xs">
                        Swap to
                      </span>
                      <span className="font-medium text-xs sm:text-sm">
                        {selectedAsset?.name}
                      </span>
                    </div>
                    <div className="my-auto mr-2 ml-auto flex h-full items-center">
                      <Ariakit.SelectArrow className="mb-1.5 text-gray8 *:size-5" />
                    </div>
                  </Ariakit.Select>
                  <Ariakit.SelectPopover
                    gutter={24}
                    sameWidth={true}
                    unmountOnHide={true}
                    className={clsx(
                      'rounded-xl border border-gray6 bg-white shadow-sm dark:border-gray4 dark:bg-gray1',
                      'scale-[0.95] opacity-0 data-[enter]:scale-[1] data-[enter]:opacity-100',
                    )}
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                      transitionDuration: '150ms',
                      transitionProperty: 'opacity, scale, translate',
                      transformOrigin: 'top',
                      translate: '0 -0.5rem',
                    }}
                  >
                    <div className="flex flex-row items-center gap-x-2">
                      <Ariakit.Combobox
                        autoSelect
                        className="w-full pt-3 pb-1.5 pl-4 text-sm focus:outline-none"
                        placeholder="Search or enter address…"
                      />
                      <Ariakit.ComboboxCancel className="mt-1 mr-2 text-gray8 *:size-6" />
                    </div>
                    <Ariakit.ComboboxList className="mt-2 border-t border-t-gray6">
                      {matches.map((value, index) => (
                        <Ariakit.SelectItem
                          key={value.symbol}
                          value={value.symbol}
                          onClick={() => setSelectedAsset(value)}
                          className="focus:bg-sky-100 focus:outline-none data-[active-item]:bg-sky-100 dark:data-[active-item]:bg-gray3 dark:focus:bg-sky-900"
                          render={
                            <Ariakit.ComboboxItem
                              className={clsx(
                                'flex flex-row items-center gap-x-2 px-3 py-3.5',
                                index === matches.length - 1 ||
                                  matches.length === 0
                                  ? ''
                                  : 'border-b border-b-gray6',
                              )}
                            />
                          }
                        >
                          <img
                            alt="asset icon"
                            className="size-7"
                            src={value.logo}
                          />
                          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-md">
                            {value.name}
                          </span>
                          <span className="rounded-2xl bg-gray2 px-2 py-1 font-[600] text-gray10 text-xs">
                            {value.symbol}
                          </span>
                          <span className="ml-auto text-gray10">100</span>
                        </Ariakit.SelectItem>
                      ))}
                    </Ariakit.ComboboxList>
                  </Ariakit.SelectPopover>
                </Ariakit.SelectProvider>
              </Ariakit.ComboboxProvider>
            </div>
            <div
              className={clsx(
                'relative flex w-full flex-row items-center pr-3 pl-3.5 shadow-xs',
                swapFormState.errors.swapAmount?.length
                  ? 'focus-within:rounded-lg focus-within:outline-1 focus-within:outline-red-500'
                  : 'focus-within:rounded-lg focus-within:outline-1 focus-within:outline-sky-500',
              )}
            >
              <div className="flex w-full flex-col gap-y-1">
                <Ariakit.FormLabel
                  name={swapForm.names.swapAmount}
                  className="text-gray10 text-xs"
                >
                  Amount
                </Ariakit.FormLabel>
                <Ariakit.FormInput
                  step="any"
                  type="number"
                  required={true}
                  autoCorrect="off"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="0.00"
                  inputMode="decimal"
                  autoCapitalize="off"
                  name={swapForm.names.swapAmount}
                  data-field={`${address}-amount`}
                  max={formatEther(BigInt(value))}
                  className="w-full font-mono text-md placeholder:text-gray10 focus:outline-none"
                />
              </div>

              <Button
                size="small"
                type="button"
                variant="default"
                className="mx-1 my-auto font-[600]! text-gray11! text-xs!"
                onClick={() => {
                  console.info(value)
                  const amountField = document.querySelector(
                    `input[data-field="${address}-amount"]`,
                  )
                  if (amountField) {
                    amountField.value =
                      Number(value) < 1 ? '1' : formatEther(BigInt(value))
                  }
                }}
              >
                Max
              </Button>
              <Ariakit.FormSubmit
                className={clsx(
                  'mx-1 my-auto rounded-full p-2',
                  {
                    'animate-pulse bg-accent text-white hover:bg-accentHover':
                      swapCalls.isPending,
                    'cursor-not-allowed bg-gray4 *:text-gray8! hover:bg-gray7':
                      swapFormState.errors.swapAmount?.length,
                  },
                  (swapFormState.valid && swapFormState.values.swapAmount) ||
                    swapCalls.isPending
                    ? 'bg-accent text-white hover:bg-accentHover'
                    : 'cursor-not-allowed bg-gray4 *:text-gray8! hover:bg-gray7',
                )}
              >
                {swapCalls.isPending ? (
                  <Spinner className="size-4!" />
                ) : (
                  <SendIcon className="size-4!" />
                )}
              </Ariakit.FormSubmit>
            </div>
          </Ariakit.Form>
        </td>
      ) : viewState === 'send' ? (
        <td colSpan={4} className="w-full">
          <Ariakit.Form
            store={sendForm}
            className="relative my-2 flex h-16 w-full rounded-2xl border-1 border-gray6 bg-white p-2 dark:bg-gray1"
          >
            <div className="flex w-[75px] flex-row items-center gap-x-2 border-gray6 border-r pr-1.5 pl-1 sm:w-[85px] sm:pl-2">
              <img alt="asset icon" className="size-8" src={logo} />
            </div>
            <div className="ml-3 flex w-full flex-row gap-y-1 border-gray7 border-r pr-3">
              <div className="flex w-full flex-col gap-y-1">
                <Ariakit.FormLabel
                  name={sendForm.names.sendRecipient}
                  className="mt-1 text-gray10 text-xs sm:text-[12px]"
                >
                  Recipient
                </Ariakit.FormLabel>

                <Ariakit.FormControl
                  name={sendForm.names.sendRecipient}
                  type="text"
                  render={(props) => {
                    const valid = Address.validate(
                      sendFormState.values.sendRecipient,
                    )

                    return (
                      <div className="relative">
                        <Ariakit.FormInput
                          {...props}
                          type="text"
                          required={true}
                          autoFocus={true}
                          autoCorrect="off"
                          spellCheck={false}
                          autoComplete="off"
                          autoCapitalize="off"
                          placeholder="0xAbcD..."
                          pattern="^0x[a-fA-F0-9]{40}$"
                          data-field={`${address}-recipient`}
                          name={sendForm.names.sendRecipient}
                          value={sendFormState.values.sendRecipient}
                          onInput={(value) =>
                            sendForm.setValue(
                              sendForm.names.sendRecipient,
                              value,
                            )
                          }
                          className={clsx(
                            'peer',
                            'w-full font-mono text-sm placeholder:text-gray10 focus:outline-none dark:text-gray12',
                            valid &&
                              'not-data-focus-visible:not-focus-visible:not-focus:not-aria-invalid:text-transparent',
                          )}
                        />
                        <TruncatedAddress
                          end={5}
                          start={5}
                          className={clsx(
                            '-top-0 absolute w-min cursor-pointer text-left peer-focus:hidden',
                            !valid && 'hidden',
                          )}
                          address={sendFormState.values.sendRecipient}
                          onClick={() =>
                            document
                              .querySelector(
                                `input[data-field="${address}-recipient"]`,
                              )
                              ?.focus()
                          }
                        />
                      </div>
                    )
                  }}
                />
              </div>
              <Ariakit.Button className="my-auto ml-auto rounded-full bg-gray4 p-2">
                <ClipboardCopyIcon className="size-4 text-gray10" />
              </Ariakit.Button>
            </div>

            <div className="flex w-[65px] max-w-min flex-col gap-y-1 px-2.5 sm:w-[80px]">
              <Ariakit.FormLabel
                name={sendForm.names.sendAmount}
                className="text-gray10 text-xs sm:text-[12px]"
              >
                Amount
              </Ariakit.FormLabel>
              <div className="flex flex-row gap-x-1">
                <Ariakit.FormInput
                  type="number"
                  step="any"
                  required={true}
                  autoCorrect="off"
                  placeholder="0.00"
                  inputMode="decimal"
                  spellCheck={false}
                  max={formatEther(BigInt(value))}
                  autoComplete="off"
                  autoCapitalize="off"
                  name={sendForm.names.sendAmount}
                  data-field={`${address}-amount`}
                  className={clsx(
                    'w-min font-mono text-sm placeholder:text-gray10 focus:outline-none sm:text-md',
                  )}
                />
              </div>
            </div>
            <Button
              size="small"
              variant="default"
              className="mx-0.5 my-auto text-gray11! text-xs! sm:mx-1"
              onClick={() => {
                console.info(value)
                const amountField = document.querySelector(
                  `input[data-field="${address}-amount"]`,
                )
                if (amountField) {
                  amountField.value =
                    Number(value) < 1 ? '1' : formatEther(BigInt(value))
                }
              }}
            >
              Max
            </Button>
            <Ariakit.FormSubmit
              className={clsx(
                'my-auto mr-0.5 ml-1 rounded-full p-2 sm:mr-1 sm:ml-2',
                {
                  'animate-pulse bg-accent text-white hover:bg-accentHover':
                    sendCalls.isPending,
                  'cursor-not-allowed bg-gray4 *:text-gray8! hover:bg-gray7':
                    sendFormState.errors.sendAmount?.length ||
                    sendFormState.errors.sendRecipient?.length,
                },
                (sendFormState.valid && sendFormState.values.sendAmount) ||
                  sendCalls.isPending
                  ? 'bg-accent text-white hover:bg-accentHover'
                  : 'cursor-not-allowed bg-gray4 *:text-gray8! hover:bg-gray7',
              )}
            >
              {sendCalls.isPending ? (
                <Spinner className="size-3! sm:size-4!" />
              ) : (
                <SendIcon className="size-3 sm:size-4!" />
              )}
            </Ariakit.FormSubmit>
          </Ariakit.Form>
        </td>
      ) : null}
    </tr>
  )
}
