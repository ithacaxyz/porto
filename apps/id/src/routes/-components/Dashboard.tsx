import * as Ariakit from '@ariakit/react'
import { Button, Spinner, Toast } from '@porto/apps/components'
import { useCopyToClipboard } from '@porto/apps/hooks'
import { Link } from '@tanstack/react-router'
import { Cuer } from 'cuer'
import { cx } from 'cva'
import { Address, Hex, Value } from 'ox'
import { Chains } from 'porto'
import { base, baseSepolia } from 'porto/core/Chains'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import { encodeFunctionData, erc20Abi, formatEther, zeroAddress } from 'viem'
import {
  useAccount,
  useCapabilities,
  useDisconnect,
  useSendCalls,
  useSwitchChain,
  useWaitForCallsStatus,
} from 'wagmi'
import { ShowMore } from '~/components/ShowMore'
import { TokenSymbol } from '~/components/TokenSymbol'
import { TruncatedAddress } from '~/components/TruncatedAddress'
import { useClickOutside } from '~/hooks/useClickOutside'
import type { ChainId } from '~/lib/Constants'
import { getChainConfig } from '~/lib/Wagmi'
import { DateFormatter, ValueFormatter } from '~/utils'
import LucideBadgeCheck from '~icons/lucide/badge-check'
import ClipboardCopyIcon from '~icons/lucide/clipboard-copy'
import CopyIcon from '~icons/lucide/copy'
import ExternalLinkIcon from '~icons/lucide/external-link'
import LucidePencil from '~icons/lucide/pencil'
import LucideRefreshCw from '~icons/lucide/refresh-cw'
import SendIcon from '~icons/lucide/send-horizontal'
import LucideShieldCheck from '~icons/lucide/shield-check'
import LucideTriangleAlert from '~icons/lucide/triangle-alert'
import WalletIcon from '~icons/lucide/wallet-cards'
import XIcon from '~icons/lucide/x'
import NullIcon from '~icons/material-symbols/do-not-disturb-on-outline'
import WorldIcon from '~icons/tabler/world'
import { Layout } from './Layout'

type Asset = {
  address: Address.Address
  chainId: number
  balance: bigint
} & (
  | {
      metadata: null
      type: 'native'
      feeToken: boolean
    }
  | {
      type: 'erc20'
      metadata: {
        name?: string
        symbol?: string
        decimals: number
        logo?: string | undefined
      }
      feeToken: boolean
    }
)

export function Dashboard() {
  const [, copyToClipboard] = useCopyToClipboard({ timeout: 2_000 })

  const account = useAccount()
  const disconnect = useDisconnect()
  const permissions = Hooks.usePermissions()

  const capabilities = useCapabilities({
    query: { enabled: account.status === 'connected' },
  })

  const assets = Hooks.useAssets({
    query: {
      enabled: account.status === 'connected',
      select: (data) => {
        const formattedAssets: Array<Asset> = []
        for (const chainId in data) {
          const chainAssets = data[chainId]
          if (chainId === '0' || !chainAssets) continue

          const feeTokens =
            capabilities?.data?.[Number(chainId)]?.feeToken.tokens
          for (const asset of chainAssets) {
            const isNative = asset.type === 'native'

            const address = isNative
              ? zeroAddress
              : (asset.address as Address.Address)
            if (!address || asset.balance === 0n) continue
            formattedAssets.push({
              address,
              balance: asset.balance,
              chainId: Number(chainId),
              feeToken: isNative
                ? true
                : (feeTokens?.some((token) => token.address === address) ??
                  false),
              metadata: {
                ...asset.metadata,
                decimals: isNative ? 18 : asset.metadata!.decimals,
                name: isNative ? 'Ether' : asset.metadata!.name,
                symbol: isNative ? 'ETH' : asset.metadata!.symbol,
              },
              type: asset.type as any,
            })
          }
        }

        return formattedAssets.sort((a, b) => (a.balance > b.balance ? -1 : 1))
      },
    },
  })

  const { switchChainAsync } = useSwitchChain()

  const revokePermissions = Hooks.useRevokePermissions()

  const admins = Hooks.useAdmins({
    query: {
      enabled: account.status === 'connected',
      select: (data) => ({
        ...data,
        keys: data.keys.filter((key) => key.type === 'address'),
      }),
    },
  })

  const revokeAdmin = Hooks.useRevokeAdmin({
    mutation: {
      onError: (error) => {
        if (error.name === 'UserRejectedRequestError') return
        toast.custom((t) => (
          <Toast
            className={t}
            description={error.message}
            kind="error"
            title="Recovery Revoke Failed"
          />
        ))
      },
      onSuccess: () => {
        toast.custom((t) => (
          <Toast
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

  // TODO: `useQuery` + `account_email`
  const showManageEmail = false
  const [emailData, setEmailData] = React.useState<
    | {
        email: string
        verified: boolean
      }
    | undefined
  >()
  const [email, setEmail] = React.useState('')

  const addFunds = Hooks.useAddFunds({
    mutation: {
      onError: (error) => {
        if (error.name === 'UserRejectedRequestError') return
        toast.custom((t) => (
          <Toast
            className={t}
            description={error.message}
            kind="error"
            title="Failed to add funds"
          />
        ))
      },
      onSuccess: () => {
        // TODO: make success message part of the dialog
        toast.custom((t) => (
          <Toast
            className={t}
            description="Funds added successfully"
            kind="success"
            title="Funds Added"
          />
        ))
      },
    },
  })

  return (
    <>
      <div className="h-3" />
      <Layout.Header
        left={
          showManageEmail && (
            <div>
              {emailData ? (
                <div className="flex items-center gap-2">
                  {/* TODO: Sparkle spotlight effect `bg-repeat` https://tailwindcss.com/docs/background-repeat */}
                  <div className="-tracking-[2.8%] min-w-10 px-2 font-medium text-[15px] text-gray12 blur-sm">
                    {emailData.email}
                  </div>
                  {emailData.verified ? (
                    <Ariakit.PopoverProvider>
                      <Ariakit.PopoverDisclosure className="flex size-8 items-center justify-center rounded-full bg-green3">
                        <LucideBadgeCheck className="size-4 text-green9" />
                      </Ariakit.PopoverDisclosure>
                      <Ariakit.Popover
                        className="flex w-[230px] flex-col gap-1 rounded-[11px] border border-gray3 bg-gray1 p-4"
                        gutter={4}
                      >
                        <Ariakit.PopoverHeading className="-tracking-[0.25px] font-medium text-[14px] text-gray12">
                          Your email is verified.
                        </Ariakit.PopoverHeading>
                        <Ariakit.PopoverDescription className="-tracking-[0.25px] text-[13px] text-gray9 leading-[18px]">
                          It can be used to restore your account to new devices.
                        </Ariakit.PopoverDescription>
                        <Button
                          className="mt-1 flex w-fit gap-1"
                          onClick={() => setEmailData(undefined)}
                          size="small"
                          type="button"
                        >
                          <LucidePencil className="size-3.25" />
                          Change email
                        </Button>
                      </Ariakit.Popover>
                    </Ariakit.PopoverProvider>
                  ) : (
                    <Ariakit.PopoverProvider>
                      <Ariakit.PopoverDisclosure className="flex size-8 items-center justify-center rounded-full bg-amber2">
                        <LucideTriangleAlert className="size-4 text-amber8" />
                      </Ariakit.PopoverDisclosure>
                      <Ariakit.Popover
                        className="flex w-[240px] flex-col gap-1 rounded-[11px] border border-gray3 bg-gray1 p-4"
                        gutter={4}
                      >
                        <Ariakit.PopoverHeading className="-tracking-[0.25px] font-medium text-[14px] text-gray12">
                          Email not verified
                        </Ariakit.PopoverHeading>
                        <Ariakit.PopoverDescription className="-tracking-[0.25px] text-[13px] text-gray9 leading-[18px]">
                          Please click the verification link to fully enable
                          Balance.
                        </Ariakit.PopoverDescription>
                        <div className="flex gap-1">
                          <Button
                            className="mt-1 flex w-fit gap-1"
                            onClick={() =>
                              // TODO: `account_resendVerifyEmail`
                              setEmailData((x) =>
                                x && 'email' in x
                                  ? { email: x.email, verified: true }
                                  : x,
                              )
                            }
                            size="small"
                            type="button"
                            variant="accent"
                          >
                            <LucideRefreshCw className="size-3.25" />
                            Resend
                          </Button>
                          <Button
                            className="mt-1 flex w-fit gap-1"
                            onClick={() => setEmailData(undefined)}
                            size="small"
                            type="button"
                          >
                            <LucidePencil className="size-3.25" />
                            Change email
                          </Button>
                        </div>
                      </Ariakit.Popover>
                    </Ariakit.PopoverProvider>
                  )}
                </div>
              ) : (
                <form
                  className="group flex items-center"
                  onSubmit={(event) => {
                    event.preventDefault()
                    // TODO: `account_setEmail`
                    const formData = new FormData(
                      event.target as HTMLFormElement,
                    )
                    const email = formData.get('email')?.toString()!
                    setEmailData({ email, verified: false })
                    setEmail('')
                  }}
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-blue3">
                    <LucideShieldCheck className="size-4 text-blue9" />
                  </div>
                  <label className="sr-only" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="-tracking-[2.8%] min-w-10 px-2 font-medium text-[15px] text-gray12 outline-none placeholder:text-gray9"
                    name="email"
                    onChange={(event) => setEmail(event.target.value)}
                    pattern=".*@.*\..+"
                    placeholder="Link your email..."
                    required
                    style={{
                      width: email.length ? `${email.length + 2}ch` : 'auto',
                    }}
                    type="email"
                    value={email}
                  />
                  <Button
                    className="hidden! group-has-[input:valid]:block!"
                    size="small"
                    type="submit"
                  >
                    Save
                  </Button>
                </form>
              )}
            </div>
          )
        }
        right={
          <div className="flex gap-2">
            <Button
              onClick={async (event) => {
                event.preventDefault()
                event.stopPropagation()
                // if url has testnet search param
                const urlHasTestnet = window.location.search.includes('testnet')
                if (!urlHasTestnet) {
                  addFunds.mutate({
                    address: account.address,
                  })
                  return
                }
                await switchChainAsync({
                  chainId: Chains.baseSepolia.id,
                }).catch()
                if (!capabilities.data) return
                const exp1 = capabilities.data?.[
                  Chains.baseSepolia.id
                ]?.feeToken?.tokens?.find((t) => t.uid === 'exp1')
                if (!exp1) return
                addFunds.mutate({
                  address: account.address,
                  chainId: Chains.baseSepolia.id,
                  token: exp1?.address as Address.Address,
                  // @ts-expect-error TODO: fix type
                  tokenAddress: exp1?.address as Address.Address,
                })
              }}
              size="small"
              variant="accent"
            >
              Add funds
            </Button>
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
              onClick={() => disconnect.disconnect({})}
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
            {/* <div className="font-[500] text-[24px] tracking-[-2.8%]">${0}</div> */}
          </div>
        </div>
        <Ariakit.Button
          className="flex w-[150px] items-center justify-center gap-3 hover:cursor-pointer!"
          onClick={() =>
            copyToClipboard(account.address ?? '')
              .then(() => toast.success('Copied address to clipboard'))
              .catch(() => toast.error('Failed to copy address to clipboard'))
          }
          tabIndex={-1}
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

      <details
        className="group"
        open={!!assets.data?.length && assets.data.length > 0}
      >
        <summary className='relative cursor-default list-none pr-1 font-semibold text-lg after:absolute after:right-1 after:font-normal after:text-gray10 after:text-sm after:content-["[+]"] group-open:after:content-["[–]"]'>
          <span>Assets</span>
        </summary>

        <PaginatedTable
          columns={[
            { header: '', key: 'chain', width: '' },
            { align: 'left', header: '', key: 'name', width: 'w-[30%]' },
            {
              align: 'right',
              header: '',
              key: 'amount',
              width: 'w-[20%]',
            },
            { align: 'right', header: '', key: 'value', width: 'w-[20%]' },
            { align: 'right', header: '', key: 'action', width: 'w-[20%]' },
            { align: 'right', header: '', key: 'action', width: 'w-[20%]' },
          ]}
          data={assets.data}
          emptyMessage={
            assets.status === 'pending'
              ? ''
              : 'No balances available for this account'
          }
          renderRow={(asset) => (
            // @ts-expect-error
            <AssetRow
              address={asset.address}
              balance={asset.balance}
              chainId={asset.chainId}
              feeToken={asset.feeToken}
              key={asset.metadata?.symbol}
              metadata={asset.metadata}
              price={1}
              type={asset.type}
              value={asset.balance}
            />
          )}
          showMoreText={assets.data ? 'more assets' : ''}
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
              width: 'w-[85px]',
            },
            { align: 'left', header: '', key: 'period', width: 'w-[60px]' },
            { align: 'right', header: '', key: 'action' },
          ]}
          data={permissions?.data}
          emptyMessage="No permissions added yet"
          initialCount={3}
          renderRow={(permission) => {
            if (!permission.chainId) return null

            const [spend] = permission?.permissions?.spend ?? []
            const [calls] = permission?.permissions?.calls ?? []

            const chain = getChainConfig(
              permission.chainId as unknown as ChainId,
            )
            const time = DateFormatter.timeToDuration(permission.expiry * 1_000)

            const periods = {
              day: 'daily',
              hour: 'hourly',
              minute: 'minutely',
              month: 'monthly',
              week: 'weekly',
              year: 'yearly',
            } as const

            return (
              <tr
                className="*:text-xs! *:sm:text-sm!"
                key={`${permission.id}-${permission.expiry}`}
              >
                <td className="py-1 text-left">
                  <a
                    className="flex flex-row items-center"
                    href={`${chain?.blockExplorers?.default.url}/address/${permission.address}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="min-w-[35px] text-gray11">{time}</span>
                    <ExternalLinkIcon className="mr-1 size-3.75 text-gray10" />
                  </a>
                </td>
                <td className="text-right">
                  <div className="flex flex-row items-center gap-x-0 sm:gap-x-2">
                    <div className="hidden size-6.25 items-center justify-center rounded-full bg-blue-100 sm:flex">
                      <WorldIcon className="size-4 text-blue-400" />
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
                  <div className="flex w-fit min-w-fit max-w-[105px] flex-row items-end justify-end gap-x-2 overflow-hidden whitespace-nowrap rounded-2xl bg-gray3 px-1.5 py-1 text-right font-[500] text-gray10 text-xs">
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
                  <span className="text-gray11">
                    {periods[spend?.period as keyof typeof periods]}
                  </span>
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
                      revokePermissions.mutate({
                        address: account.address,
                        chainId: permission.chainId as never,
                        id: permission.id,
                      })
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
              <th className="text-left">Key ID</th>
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
                        <div className="flex size-6.75 items-center justify-center rounded-full bg-emerald-100">
                          <WalletIcon className="size-4 text-teal-600" />
                        </div>
                        <div className="w-full pl-1 font-medium text-gray12">
                          <TruncatedAddress
                            address={key.id ?? key.publicKey}
                            className="justify-start text-left text-sm sm:text-md"
                            end={10}
                            start={10}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="text-right">
                      <Ariakit.Button
                        className="size-7 rounded-full px-1 pt-1 hover:bg-gray4"
                        onClick={() =>
                          copyToClipboard(key.publicKey)
                            .then(() =>
                              toast.success('Copied address to clipboard'),
                            )
                            .catch(() =>
                              toast.error(
                                'Failed to copy address to clipboard',
                              ),
                            )
                        }
                      >
                        <CopyIcon className="m-auto size-4 text-gray10" />
                      </Ariakit.Button>
                      <Ariakit.Button
                        className="size-8 rounded-full p-1 text-gray11 hover:bg-red-100 hover:text-red-500"
                        onClick={() => {
                          if (!id || !address) return
                          const chainId =
                            import.meta.env.VITE_VERCEL_ENV === 'production'
                              ? base.id
                              : baseSepolia.id
                          revokeAdmin.mutate({
                            address: account.address,
                            chainId,
                            id: key.id,
                          })
                        }}
                      >
                        <XIcon className={cx('m-auto size-5')} />
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
  columns,
  data,
  emptyMessage,
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
              // biome-ignore lint/suspicious/noArrayIndexKey: _
              <React.Fragment key={index}>{renderRow(item)}</React.Fragment>
            ))
          ) : (
            <tr>
              <td className="text-center text-gray12" colSpan={columns.length}>
                <p className="mt-2 text-xs">{emptyMessage}</p>
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

function AssetRow(
  props: Asset & { price?: number | undefined; value: bigint },
) {
  const {
    address,
    value,
    // price,
    chainId,
    feeToken: isFeeToken,
    metadata,
  } = props

  const [viewState, setViewState] = React.useState<'send' | 'default'>(
    'default',
  )

  const { switchChain, status: _switchChainStatus } = useSwitchChain()

  const formattedBalance = React.useMemo(
    () => ValueFormatter.format(value, metadata?.decimals),
    [value, metadata?.decimals],
  )

  // total value of the asset
  // const totalValue = React.useMemo(() => {
  //   if (!price) return 0
  //   return price * Number(formattedBalance)
  // }, [price, formattedBalance])

  const sendCalls = useSendCalls({
    mutation: {
      onError: (error) => {
        console.error(error)
        const userRejected = error.message
          .toLowerCase()
          .includes('user rejected')
        if (userRejected) return
        const notAllowed = error.message.toLowerCase().includes('not allowed')
        toast.custom(
          (t) => (
            <Toast
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
      onSuccess: (_data) => {
        sendForm.setState('submitSucceed', (count) => +count + 1)
        sendForm.setState('submitFailed', 0)
      },
    },
  })

  const callStatus = useWaitForCallsStatus({
    id: sendCalls.data?.id,
  })

  const account = useAccount()

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

  sendForm.useSubmit(() => {
    if (Number(sendFormState.values.sendAmount) >= Number(formattedBalance)) {
      // if amount is greater than balance or equal balance, reject
      toast.error('Amount is too high')
      return
    }

    if (account.chain?.id !== props.chainId)
      switchChain({ chainId: props.chainId as never })

    if (!Address.validate(sendFormState.values.sendRecipient)) {
      toast.error('Invalid recipient address')
      return
    }

    if (address === zeroAddress) {
      // ETH should have `to` as the recipient, `value` as the amount, and `data` as the empty string
      // ERC20 should have `to` as the token address, `data` as the encoded function data, and `value` as the empty string

      sendCalls.sendCalls({
        calls: [
          {
            to: sendFormState.values.sendRecipient,
            value: Value.from(
              sendFormState.values.sendAmount,
              metadata?.decimals,
            ),
          },
        ],
        capabilities: {
          feeToken: isFeeToken ? address : zeroAddress,
        },
        chainId: props.chainId as never,
      })
    } else
      sendCalls.sendCalls({
        calls: [
          {
            data: encodeFunctionData({
              abi: erc20Abi,
              args: [
                sendFormState.values.sendRecipient,
                Value.from(sendFormState.values.sendAmount, metadata?.decimals),
              ],
              functionName: 'transfer',
            }),
            to: address,
          },
        ],
        capabilities: {
          feeToken: isFeeToken ? address : zeroAddress,
        },
        chainId: props.chainId as never,
      })
  })

  const ref = React.useRef<HTMLTableCellElement | null>(null)
  useClickOutside([ref], () => setViewState('default'))

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  React.useEffect(() => {
    if (callStatus.data?.id) {
      const [receipt] = callStatus.data?.receipts ?? []
      const hash = receipt?.transactionHash
      if (!hash) return
      toast.info('Transaction completed')
    }
  }, [callStatus.data?.receipts])

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  React.useEffect(() => {
    if (callStatus.isSuccess) {
      const [receipt] = callStatus.data?.receipts ?? []
      const hash = receipt?.transactionHash
      if (!hash) return
      toast.custom(
        (t) => (
          <Toast
            className={t}
            description={`You successfully sent ${sendFormState.values.sendAmount} ${metadata?.symbol}`}
            kind="success"
            title="Transaction completed"
          />
        ),

        { duration: 4_500 },
      )
    }
    if (!callStatus.data?.id) return

    toast.info(`Transaction status: ${callStatus.data.status}`)
  }, [callStatus.data?.id])

  if (props.value === 0n && !import.meta.env.DEV) return null

  return (
    <tr className="font-normal sm:text-sm">
      {viewState === 'default' ? (
        <>
          <td className="w-[10.5%] text-center">
            <span className="text-right font-medium text-sm sm:text-md">
              {chainId}
            </span>
          </td>
          <td className="w-[80%]">
            <div className="flex items-center gap-x-3 py-2">
              <img
                alt="asset icon"
                className="ml-3 size-6"
                onError={(event) => [
                  (event.currentTarget.src = '/icons/fallback.svg'),
                  (event.currentTarget.onerror = null),
                ]}
                src={`/icons/${metadata?.symbol?.toLowerCase()}.svg`}
              />
              <span className="font-medium text-sm sm:text-md">
                {metadata?.name}
              </span>
            </div>
          </td>
          <td className="w-[20%] text-right text-md">{formattedBalance}</td>
          {/* <td className="w-[20%] pl-3.5 text-right text-md">
            ${ValueFormatter.formatToPrice(totalValue)}
          </td> */}
          <td className="w-[20%] pr-1.5 pl-3 text-left text-sm">
            <span className="rounded-2xl bg-gray3 px-2 py-1 font-[500] text-gray10 text-xs">
              {metadata?.symbol}
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
              <img
                alt="asset icon"
                className="size-8"
                onError={(event) => {
                  event.currentTarget.src = '/icons/fallback.svg'
                  event.currentTarget.onerror = null
                }}
                src={`/icons/${metadata?.symbol?.toLowerCase()}.svg`}
              />
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
                          onInput={(event) =>
                            sendForm.setValue(
                              sendForm.names.sendRecipient,
                              event.currentTarget.value,
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
                  value={sendFormState.values.sendAmount}
                />
              </div>
            </div>
            <Button
              className="mx-0.5 my-auto text-gray11! text-xs! sm:mx-1"
              onClick={(event) => {
                event.preventDefault()
                if (
                  Number(sendFormState.values.sendAmount) >=
                  Number(formattedBalance)
                ) {
                  toast.error('Amount is too high')
                  return
                }

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
                    sendCalls.isPending || callStatus.isFetching,
                  'cursor-not-allowed bg-gray4 *:text-gray8! hover:bg-gray7':
                    sendFormState.errors.sendAmount?.length ||
                    sendFormState.errors.sendRecipient?.length,
                },
                (sendFormState.valid && sendFormState.values.sendAmount) ||
                  sendCalls.isPending
                  ? 'bg-accent text-white hover:bg-accentHover'
                  : 'cursor-not-allowed bg-gray4 *:text-gray8! hover:bg-gray7',
              )}
              // onClick={submitForm}
              // type="button"
            >
              {sendCalls.isPending || callStatus.isFetching ? (
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
