import * as Ariakit from '@ariakit/react'
import { Button, Spinner } from '@porto/apps/components'
import { exp1Address } from '@porto/apps/contracts'
import { Link } from '@tanstack/react-router'
import { Cuer } from 'cuer'
import { cx } from 'cva'
import { Address, Hex, Value } from 'ox'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import { encodeFunctionData, erc20Abi, formatEther } from 'viem'
import { useAccount, useBlockNumber } from 'wagmi'
import { useSendCalls } from 'wagmi/experimental'
import { CustomToast } from '~/components/CustomToast'
import { DevOnly } from '~/components/DevOnly'
import { ShowMore } from '~/components/ShowMore'
import { TruncatedAddress } from '~/components/TruncatedAddress'
import { useAddressTransfers } from '~/hooks/useBlockscoutApi'
import { useClickOutside } from '~/hooks/useClickOutside'
import { useSwapAssets } from '~/hooks/useSwapAssets'
import { useErc20Info } from '~/hooks/useTokenInfo'
import { config, porto } from '~/lib/Wagmi'
import { DateFormatter, StringFormatter, sum, ValueFormatter } from '~/utils'
import ClipboardCopyIcon from '~icons/lucide/clipboard-copy'
import CopyIcon from '~icons/lucide/copy'
import ExternalLinkIcon from '~icons/lucide/external-link'
import SendIcon from '~icons/lucide/send-horizontal'
import WalletIcon from '~icons/lucide/wallet-cards'
import XIcon from '~icons/lucide/x'
import AccountIcon from '~icons/material-symbols/account-circle-full'
import NullIcon from '~icons/material-symbols/do-not-disturb-on-outline'
import WorldIcon from '~icons/tabler/world'
import { Layout } from './Layout'

function TokenSymbol({
  address,
  display,
}: {
  address?: Address.Address | undefined
  display?: 'symbol' | 'name' | 'address'
}) {
  const { data: tokenInfo } = useErc20Info(address)

  if (!address) return null

  if (!tokenInfo?.symbol || display === 'address')
    return StringFormatter.truncate(address, { end: 4, start: 4 })

  return display === 'name' ? tokenInfo.name : tokenInfo.symbol
}

export function Dashboard() {
  const account = useAccount()
  const disconnect = Hooks.useDisconnect()
  const permissions = Hooks.usePermissions()

  const { data: transfers } = useAddressTransfers({
    chainIds: [911_867],
  })
  const { data: assets, refetch: refetchSwapAssets } = useSwapAssets({
    chainId: 911_867,
  })

  const { data: blockNumber } = useBlockNumber({
    watch: { enabled: account.status === 'connected', pollingInterval: 800 },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: refetch balance every block
  React.useEffect(() => {
    refetchSwapAssets()
  }, [blockNumber])

  const revokePermissions = Hooks.useRevokePermissions()

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
    return sum(
      assets.map(
        (asset) =>
          Number(Value.format(asset.balance, asset.decimals)) * asset.price,
      ),
    )
  }, [assets])

  const admins = Hooks.useAdmins({
    query: {
      select: ({ address, keys }) => ({
        address,
        keys: keys.filter((key) => key.type === 'address'),
      }),
    },
  })

  const revokeAdmin = Hooks.useRevokeAdmin({
    mutation: {
      onError: (error) => {
        toast.custom((t) => (
          <CustomToast
            className={t}
            description={error.message}
            kind="error"
            title="Recovery Revoke Failed"
          />
        ))
      },
      onSuccess: () => {
        toast.custom((t) => (
          <CustomToast
            className={t}
            description="You have revoked a recovery admin"
            kind="success"
            title="Recovery Revoked"
          />
        ))
        admins.refetch()
      },
    },
  })

  return (
    <>
      <DevOnly />
      <div className="h-3" />
      <Layout.Header
        left={undefined}
        right={
          <div className="flex gap-2">
            <Button
              render={
                <a
                  href="https://t.me/porto_devs"
                  rel="noreferrer"
                  target="_blank"
                >
                  Help
                </a>
              }
              size="small"
            />

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
              ${ValueFormatter.formatToPrice(totalBalance)}
            </div>
          </div>
        </div>
        <Ariakit.Button
          className="flex w-[150px] items-center justify-center gap-3 hover:cursor-pointer!"
          onClick={() =>
            navigator.clipboard
              .writeText(account.address ?? '')
              .then(() => toast.success('Copied address to clipboard'))
              .catch(() => toast.error('Failed to copy address to clipboard'))
          }
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

      <details className="group" open={assets && assets?.length > 0}>
        <summary className='relative cursor-default list-none pr-1 font-semibold text-lg after:absolute after:right-1 after:font-normal after:text-gray10 after:text-sm after:content-["[+]"] group-open:after:content-["[–]"]'>
          <span>Assets</span>

          <Button
            className="ml-2"
            onClick={async (event) => {
              event.preventDefault()
              if (!account.address) {
                return toast.error('No account address found')
              }
              await porto.provider.request({
                method: 'experimental_addFunds',
                params: [
                  {
                    address: account.address,
                    token: exp1Address,
                    value: Hex.fromNumber(25n),
                  },
                ],
              })
            }}
            size="small"
            type="button"
            variant="default"
          >
            Add funds
          </Button>
        </summary>

        <PaginatedTable
          columns={[
            { header: 'Name', key: 'name', width: 'w-[40%]' },
            { align: 'right', header: '', key: 'balance', width: 'w-[20%]' },
            { align: 'right', header: '', key: 'symbol', width: 'w-[20%]' },
            { align: 'right', header: '', key: 'action', width: 'w-[20%]' },
            { align: 'right', header: '', key: 'action', width: 'w-[20%]' },
          ]}
          data={assets}
          emptyMessage="No balances available for this account"
          renderRow={(asset) => (
            <AssetRow
              address={asset.address}
              decimals={asset.decimals}
              key={asset.address}
              logo={asset.logo}
              name={asset.name}
              price={asset.price}
              symbol={asset.symbol}
              value={asset.balance}
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
          columns={[
            { header: 'Time', key: 'time' },
            { header: 'Account', key: 'recipient' },
            { align: 'right', header: 'Amount', key: 'amount' },
          ]}
          data={filteredTransfers}
          emptyMessage="No transactions yet"
          renderRow={(transfer) => {
            const amount = Number.parseFloat(
              ValueFormatter.format(
                BigInt(transfer?.total.value ?? 0),
                Number(transfer?.total.decimals ?? 0),
              ),
            ).toFixed(2)

            return (
              <tr
                className="text-xs sm:text-sm"
                key={`${transfer?.transaction_hash}-${transfer?.block_number}`}
              >
                <td className="py-1 text-left">
                  <a
                    className="flex flex-row items-center"
                    href={`https://explorer.ithaca.xyz/tx/${transfer?.transaction_hash}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ExternalLinkIcon className="mr-1 size-4 text-gray10" />
                    <span className="min-w-[50px] text-gray11 sm:min-w-[65px]">
                      {DateFormatter.ago(new Date(transfer?.timestamp ?? ''))}{' '}
                      ago
                    </span>
                  </a>
                </td>
                <td className="flex min-w-full items-center py-1 text-left font-medium">
                  <div className="my-0.5 flex flex-row items-center gap-x-2 rounded-full bg-gray3 p-0.5">
                    <AccountIcon className="size-4 rounded-full text-gray10" />
                  </div>
                  <TruncatedAddress
                    address={transfer?.to.hash ?? ''}
                    className="ml-2"
                  />
                </td>
                <td className="py-1 text-right text-gray12">
                  <span className="text-md">{amount}</span>
                  <div className="inline-block w-[65px]">
                    <span className="rounded-2xl bg-gray3 px-2 py-1 font-[500] text-gray10 text-xs">
                      <TokenSymbol
                        address={transfer?.token.address as Address.Address}
                        display="symbol"
                      />
                    </span>
                  </div>
                </td>
              </tr>
            )
          }}
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
        </summary>

        <PaginatedTable
          columns={[
            { header: 'Time', key: 'time' },
            { header: 'Name', key: 'name', width: '' },
            { align: 'left', header: 'Scope', key: 'scope' },
            {
              align: 'left',
              header: 'Amount',
              key: 'amount',
              width: 'w-[120px]',
            },
            { align: 'left', header: '', key: 'period', width: 'w-[60px]' },
            { align: 'right', header: '', key: 'action' },
          ]}
          data={permissions?.data}
          emptyMessage="No permissions added yet"
          initialCount={3}
          renderRow={(permission) => {
            const [spend] = permission?.permissions?.spend ?? []
            const [calls] = permission?.permissions?.calls ?? []

            const time = DateFormatter.timeToDuration(permission.expiry * 1_000)

            return (
              <tr
                className="*:text-xs! *:sm:text-sm!"
                key={`${permission.id}-${permission.expiry}`}
              >
                <td className="max-w-[50px] py-3 text-left">
                  <a
                    className="flex flex-row items-center"
                    href={`https://explorer.ithaca.xyz/address/${permission.address}`}
                    rel="noreferrer"
                    target="_blank"
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
                      address={permission.address}
                      className="ml-1 font-medium"
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
                      <TokenSymbol address={spend?.token} display="symbol" />
                    </span>
                  </div>
                </td>
                <td className="w-[30px] pl-1">
                  <span className="text-gray11">{spend?.period}ly</span>
                </td>
                <td className="w-min max-w-[25px] text-right">
                  <Ariakit.Button
                    className={cx(
                      'size-8 rounded-full p-1',
                      time === 'expired'
                        ? 'text-gray10'
                        : 'text-gray11 hover:bg-red-100 hover:text-red-500',
                    )}
                    disabled={time === 'expired'}
                    onClick={() => {
                      revokePermissions.mutate({ id: permission.id })
                    }}
                  >
                    {time === 'expired' ? (
                      <NullIcon className="m-auto size-5" />
                    ) : (
                      <XIcon className={cx('m-auto size-5')} />
                    )}
                  </Ariakit.Button>
                </td>
              </tr>
            )
          }}
          showMoreText="more permissions"
        />
      </details>

      <div className="h-4" />
      <hr className="border-gray5" />
      <div className="h-4" />

      <details
        className="group pb-1"
        open={admins.data && admins.data.keys.length > 0}
      >
        <summary className='relative my-auto cursor-default list-none space-x-1 pr-1 font-semibold text-lg after:absolute after:right-1 after:font-normal after:text-gray10 after:text-sm after:content-["[+]"] group-open:after:content-["[–]"]'>
          <span>Recovery</span>
          <Button
            className="ml-2"
            render={<Link to="/recovery" />}
            size="small"
            type="button"
            variant="default"
          >
            Add wallet
          </Button>
        </summary>

        <table className="my-3 w-full">
          <thead>
            <tr className="text-gray10 *:font-normal *:text-sm">
              <th className="text-left">ID</th>
              <th className="text-left">Public Key</th>
              <th className="invisible text-right">Action</th>
            </tr>
          </thead>
          <tbody className="border-transparent border-t-10">
            {admins.data?.keys.length ? (
              admins.data.keys.map((key, index) => {
                const id = key.id
                const address = key.publicKey
                return (
                  <tr
                    className="text-xs sm:text-sm"
                    key={`${key.publicKey}-${index}`}
                  >
                    <td className="text-left">
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="hidden size-6.25 items-center justify-center rounded-full bg-emerald-100 sm:flex">
                          <WalletIcon className="size-4 text-teal-600" />
                        </div>
                        <span className="font-medium text-gray12">
                          <TruncatedAddress
                            address={key.id ?? key.publicKey}
                            className="text-sm sm:text-md"
                          />
                        </span>
                      </div>
                    </td>

                    <td className="text-left">
                      <div className="flex flex-row items-center gap-x-2 font-medium">
                        <TruncatedAddress
                          address={key.publicKey}
                          className="text-sm sm:text-md"
                        />
                      </div>
                    </td>

                    <td className="text-right">
                      <Ariakit.Button
                        className="size-7 rounded-full px-1 pt-1 hover:bg-gray4"
                        onClick={() => {
                          navigator.clipboard
                            .writeText(key.publicKey)
                            .then(() =>
                              toast.success('Copied address to clipboard'),
                            )
                            .catch(() =>
                              toast.error(
                                'Failed to copy address to clipboard',
                              ),
                            )
                        }}
                      >
                        <CopyIcon className="m-auto size-4 text-gray10 sm:size-5" />
                      </Ariakit.Button>
                      <Ariakit.Button
                        className="size-8 rounded-full p-1 hover:bg-red-100"
                        onClick={() => {
                          if (!id || !address) return
                          revokeAdmin.mutate({
                            id: key?.id,
                          })
                        }}
                      >
                        <XIcon className={cx('m-auto size-5 text-red-500')} />
                      </Ariakit.Button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td className="text-center text-gray12" colSpan={2}>
                  <p className="text-sm">No recovery methods added yet</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </details>

      <div className="h-8" />
    </>
  )
}

function PaginatedTable<T>({
  data,
  emptyMessage,
  columns,
  renderRow,
  showMoreText,
  initialCount = 5,
}: {
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
}) {
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
            {columns.map((col, index) => (
              <th
                className={cx(
                  col.width,
                  col.align === 'right' ? 'text-right' : 'text-left',
                )}
                key={`${col.key}-${index}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="border-transparent border-t-10">
          {itemsToShow && itemsToShow?.length > 0 ? (
            itemsToShow?.map((item, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <React.Fragment key={index}>{renderRow(item)}</React.Fragment>
            ))
          ) : (
            <tr>
              <td className="text-center text-gray12" colSpan={columns.length}>
                <p className="mt-2 text-sm">{emptyMessage}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {remainingItems.length > 0 && (
        <div className="flex justify-start">
          <ShowMore
            className="cursor-default font-medium text-gray10 text-sm"
            onChange={() => setShowAll(showAll === 'ALL' ? 'DEFAULT' : 'ALL')}
            text={`Show ${remainingItems.length} ${showMoreText}`}
          />
        </div>
      )}
    </>
  )
}

function AssetRow({
  address,
  decimals,
  logo,
  name,
  symbol,
  value,
  price,
}: {
  address: Address.Address
  decimals: number
  logo: string
  name: string
  symbol: string
  value: bigint
  price: number
}) {
  const [viewState, setViewState] = React.useState<'send' | 'default'>(
    'default',
  )

  const { data: _swapAssets, refetch: refetchSwapAssets } = useSwapAssets({
    chainId: 911_867,
  })

  const formattedBalance = React.useMemo(
    () => ValueFormatter.format(value, decimals),
    [value, decimals],
  )

  const sendCalls = useSendCalls({
    mutation: {
      onError: (error) => {
        const notAllowed = error.message.includes('not allowed')
        toast.custom(
          (t) => (
            <CustomToast
              className={t}
              description={
                notAllowed
                  ? 'Transaction submission was cancelled.'
                  : 'You do not have enough balance to complete this transaction.'
              }
              kind={notAllowed ? 'warn' : 'error'}
              title={
                notAllowed ? 'Transaction cancelled' : 'Transaction failed'
              }
            />
          ),

          { duration: 3_500 },
        )
        sendForm.setState('submitFailed', (count) => +count + 1)
        sendForm.setState('submitSucceed', 0)
      },
      onSuccess: (data) => {
        refetchSwapAssets()
        toast.custom(
          (t) => (
            <CustomToast
              className={t}
              description={
                <p>
                  You successfully sent {sendFormState.values.sendAmount}{' '}
                  {symbol}
                  <br />
                  <a
                    className="text-gray12 underline"
                    href={`https://explorer.ithaca.xyz/tx/${data}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View on explorer
                  </a>
                </p>
              }
              kind="success"
              title="Transaction completed"
            />
          ),

          { duration: 4_500 },
        )
        refetchSwapAssets()
        sendForm.setState('submitSucceed', (count) => +count + 1)
        sendForm.setState('submitFailed', 0)
      },
    },
  })

  const sendForm = Ariakit.useFormStore({
    defaultValues: {
      sendAmount: '',
      sendAsset: address,
      sendRecipient: '',
    },
  })
  const sendFormState = Ariakit.useStoreState(sendForm)

  sendForm.useValidate(async (state) => {
    if (Number(state.values.sendAmount) > Number(formattedBalance)) {
      sendForm.setError('sendAmount', 'Amount is too high')
    }
  })

  sendForm.useSubmit(async (state) => {
    if (
      !Address.validate(state.values.sendRecipient) ||
      !state.values.sendAmount
    )
      return
    sendCalls.sendCalls({
      calls: [
        {
          data: encodeFunctionData({
            abi: erc20Abi,
            args: [
              state.values.sendRecipient,
              Value.from(state.values.sendAmount, decimals),
            ],
            functionName: 'transfer',
          }),
          to: address,
        },
      ],
    })
  })

  const ref = React.useRef<HTMLTableCellElement | null>(null)
  useClickOutside([ref], () => setViewState('default'))

  return (
    <tr className="font-normal sm:text-sm">
      {viewState === 'default' ? (
        <>
          <td className="w-[80%]">
            <div className="flex items-center gap-x-2 py-2">
              <img alt="asset icon" className="size-5 sm:size-6" src={logo} />
              <span className="font-medium text-sm sm:text-md">{name}</span>
            </div>
          </td>
          <td className="w-[20%] text-right text-md">{formattedBalance}</td>
          <td className="w-[20%] pl-3.5 text-right text-md">
            ${ValueFormatter.formatToPrice(price)}
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
                onClick={() => setViewState('send')}
              >
                <SendIcon className="my-auto size-4 cursor-pointer text-gray9" />
              </Ariakit.Button>
            </div>
          </td>
        </>
      ) : viewState === 'send' ? (
        <td className="w-full" colSpan={5} ref={ref}>
          <Ariakit.Form
            className="relative my-2 flex h-16 w-full rounded-2xl border-1 border-gray6 bg-white p-2 dark:bg-gray1"
            store={sendForm}
          >
            <div className="flex w-[75px] flex-row items-center gap-x-2 border-gray6 border-r pr-1.5 pl-1 sm:w-[85px] sm:pl-2">
              <img alt="asset icon" className="size-8" src={logo} />
            </div>
            <div className="ml-3 flex w-full flex-row gap-y-1 border-gray7 border-r pr-3">
              <div className="flex w-full flex-col gap-y-1">
                <Ariakit.FormLabel
                  className="mt-1 text-gray10 text-xs sm:text-[12px]"
                  name={sendForm.names.sendRecipient}
                >
                  Recipient
                </Ariakit.FormLabel>

                <Ariakit.FormControl
                  name={sendForm.names.sendRecipient}
                  render={(props) => {
                    const valid = Address.validate(
                      sendFormState.values.sendRecipient,
                    )
                    return (
                      <div className="relative">
                        <Ariakit.FormInput
                          {...props}
                          autoCapitalize="off"
                          autoComplete="off"
                          autoCorrect="off"
                          autoFocus={true}
                          className={cx(
                            'peer',
                            'w-full font-mono text-xs placeholder:text-gray10 focus:outline-none sm:text-sm dark:text-gray12',
                            valid &&
                              'not-data-focus-visible:not-focus-visible:not-focus:not-aria-invalid:text-transparent',
                          )}
                          data-field={`${address}-recipient`}
                          name={sendForm.names.sendRecipient}
                          onInput={(value) =>
                            sendForm.setValue(
                              sendForm.names.sendRecipient,
                              value,
                            )
                          }
                          pattern="^0x[a-fA-F0-9]{40}$"
                          placeholder="0xAbcD..."
                          required={true}
                          spellCheck={false}
                          type="text"
                          value={sendFormState.values.sendRecipient}
                        />
                        <TruncatedAddress
                          address={sendFormState.values.sendRecipient}
                          className={cx(
                            '-top-0 absolute w-min cursor-pointer text-left text-xs peer-focus:hidden sm:text-sm',
                            !valid && 'hidden',
                          )}
                          end={5}
                          onClick={() =>
                            document
                              .querySelector(
                                `input[data-field="${address}-recipient"]`,
                              )
                              ?.focus()
                          }
                          start={5}
                        />
                      </div>
                    )
                  }}
                  type="text"
                />
              </div>
              <Ariakit.Button
                className="my-auto ml-auto hidden rounded-full bg-gray4 p-2 sm:block"
                onClick={() =>
                  navigator.clipboard
                    .readText()
                    .then((text) => {
                      sendForm.setValue(sendForm.names.sendRecipient, text)
                    })
                    .catch(() => toast.error('Failed to paste from clipboard'))
                }
              >
                <ClipboardCopyIcon className="size-4 text-gray10" />
              </Ariakit.Button>
            </div>

            <div className="flex w-[65px] max-w-min flex-col gap-y-1 px-2.5 sm:w-[80px]">
              <Ariakit.FormLabel
                className="text-gray10 text-xs sm:text-[12px]"
                name={sendForm.names.sendAmount}
              >
                Amount
              </Ariakit.FormLabel>
              <div className="flex flex-row gap-x-1">
                <Ariakit.FormInput
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  className={cx(
                    'w-min font-mono text-sm placeholder:text-gray10 focus:outline-none sm:text-md',
                  )}
                  data-field={`${address}-amount`}
                  inputMode="decimal"
                  max={formattedBalance}
                  name={sendForm.names.sendAmount}
                  placeholder="0.00"
                  required={true}
                  spellCheck={false}
                  step="any"
                  type="number"
                />
              </div>
            </div>
            <Button
              className="mx-0.5 my-auto text-gray11! text-xs! sm:mx-1"
              onClick={(event) => {
                event.preventDefault()
                sendForm.setValue(
                  sendForm.names.sendAmount,
                  Number(formattedBalance),
                )
              }}
              size="small"
              variant="default"
            >
              Max
            </Button>
            <Ariakit.FormSubmit
              className={cx(
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
