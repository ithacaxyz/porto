import { Button, Spinner } from '@porto/apps/components'

import * as Ariakit from '@ariakit/react'
import { Cuer } from 'cuer'
import { cx } from 'cva'
import { matchSorter } from 'match-sorter'
import { Address, Value } from 'ox'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import { encodeFunctionData, erc20Abi, formatEther, parseEther } from 'viem'
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

import { DevOnly } from '~/components/DevOnly'
import { TruncatedAddress } from '~/components/TruncatedAddress'
import {
  useAddressTransfers,
  useTokenBalances,
} from '~/hooks/use-blockscout-api'
import { useClickOutside } from '~/hooks/use-click-outside'
import { swapAssets } from '~/lib/Constants'
import { config } from '~/lib/Wagmi'
import { DateFormatter, StringFormatter, ValueFormatter, sum } from '~/utils'
import { Layout } from './Layout'

export function Dashboard() {
  const account = useAccount()
  const disconnect = Hooks.useDisconnect()

  const permissions = Hooks.usePermissions()
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
          <p className="min-w-[6ch] max-w-[6ch] text-pretty break-all font-mono font-normal text-[10px] text-gray10">
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

        <table className="my-3 w-full table-auto">
          <thead>
            <tr className="text-gray10 *:font-normal *:text-sm">
              <th className="w-[40%] text-left">Name</th>
              <th className="w-[20%] text-right" data-label="balance" />
              <th className="w-[20%] text-right" data-label="symbol" />
              <th className="w-[20%] text-right" data-label="action" />
            </tr>
          </thead>
          <tbody className="border-transparent border-t-10 font-semibold">
            {assets?.map((asset, index) => (
              <AssetRow
                key={`${asset.token.address}-${index}`}
                address={asset.token.address}
                logo={`/icons/${asset.token.name.toLowerCase()}.svg`}
                symbol={asset.token.symbol}
                name={asset.token.name}
                value={asset.value}
              />
            ))}
          </tbody>
        </table>
      </details>

      <div className="h-4" />
      <hr className="border-gray5" />
      <div className="h-4" />

      <details className="group" open={filteredTransfers?.length > 0}>
        <summary className='relative cursor-default list-none pr-1 font-semibold text-lg after:absolute after:right-1 after:font-normal after:text-gray10 after:text-sm after:content-["[+]"] group-open:after:content-["[–]"]'>
          History
        </summary>

        <table className="my-3 w-full table-fixed">
          <thead>
            <tr className="text-gray10 *:font-normal *:text-sm">
              <th className="text-left">Time</th>
              <th className="text-left">Recipient</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="border-transparent border-t-10">
            {filteredTransfers?.slice(0, 5).map((transfer, index) => (
              <tr
                key={`${transfer?.transaction_hash}-${index}`}
                className="text-xs sm:text-sm "
              >
                <td className="py-1 text-left">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-row items-center"
                    href={`https://explorer.ithaca.xyz/tx/${transfer?.transaction_hash}`}
                  >
                    <span className="min-w-[80px] text-gray11">
                      {DateFormatter.ago(new Date(transfer?.timestamp ?? ''))}{' '}
                      ago
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
                  <span className="mr-2 text-md">
                    {Value.format(
                      BigInt(transfer?.total.value ?? 0),
                      Number(transfer?.token.decimals ?? 0),
                    )}
                  </span>
                  <div className="inline-block w-[70px]">
                    <span className="rounded-2xl bg-gray3 px-2 py-1 font-[500] text-gray10 text-xs">
                      {transfer?.token.symbol}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <div className="h-4" />
      <hr className="border-gray5" />
      <div className="h-4" />

      <details
        className="group pb-1"
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

        <table className="my-3 w-full">
          <thead>
            <tr className="text-gray10 *:font-normal *:text-sm">
              <th className="text-left">Time</th>
              <th className="text-left">Name</th>
              <th className="text-right">Scope</th>
              <th className="">Amount</th>
              <th className="invisible text-right">Action</th>
            </tr>
          </thead>
          <tbody className="border-transparent border-t-10">
            {permissions?.data?.map((permission, index) => {
              const [spend] = permission?.permissions?.spend ?? []
              const [calls] = permission?.permissions?.calls ?? []

              const time = DateFormatter.timeToDuration(
                permission.expiry * 1_000,
              )
              return (
                <tr
                  key={`${permission.id}-${index}`}
                  className="text-xs sm:text-sm"
                >
                  <td className="py-3 text-left">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`https://explorer.ithaca.xyz/address/${permission.address}`}
                      className="flex flex-row items-center"
                    >
                      <span className="min-w-[35px] text-gray11">{time}</span>
                      <ExternalLinkIcon className="mr-2 size-4 text-gray10" />
                    </a>
                  </td>
                  <td className="text-right">
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-blue-100">
                        <WorldIcon className="m-auto size-5 text-blue-400" />
                      </div>

                      <TruncatedAddress
                        className="ml-1 font-medium"
                        address={permission.address}
                      />
                    </div>
                  </td>
                  <td className="text-right">
                    <span className="text-gray11">
                      {calls?.signature ?? '––'}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="mr-2 rounded-2xl bg-gray3 px-2 py-1 font-[500] text-gray10">
                      {StringFormatter.truncate(spend?.token ?? '', {
                        start: 4,
                        end: 4,
                      })}
                    </span>
                    <span className="text-gray11">{spend?.period}ly</span>
                  </td>
                  <td className="text-right">
                    <Ariakit.Button
                      disabled={time === 'expired'}
                      className="size-8 rounded-full p-1 hover:bg-red-100"
                      onClick={() => {
                        revokePermissions.mutate({ id: permission.id })
                      }}
                    >
                      {time === 'expired' ? (
                        <NullIcon className="m-auto size-5 text-gray10" />
                      ) : (
                        <XIcon className={cx('m-auto size-5 text-red-500')} />
                      )}
                    </Ariakit.Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </details>

      <div className="h-4" />
      <hr className="border-gray5" />
      <div className="h-4" />

      <details className="group pb-1" open>
        <summary className='relative my-auto cursor-default list-none space-x-1 pr-1 font-semibold text-lg after:absolute after:right-1 after:font-normal after:text-gray10 after:text-sm after:content-["[+]"] group-open:after:content-["[–]"]'>
          <span>Recovery</span>
          <Button
            size="small"
            type="button"
            className="ml-2"
            variant="default"
            onClick={() => console.info('add wallet')}
          >
            Add wallet
          </Button>
        </summary>

        <table className="my-3 w-full">
          <thead>
            <tr className="text-gray10 *:font-normal *:text-sm">
              <th className="text-left">Time</th>
              <th className="text-left">Name</th>
              <th className="invisible text-right">Action</th>
            </tr>
          </thead>
          <tbody className="border-transparent border-t-10">
            <tr className="text-xs sm:text-sm">
              <td className="py-3 text-left">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={'https://explorer.ithaca.xyz/address/'}
                  className="flex flex-row items-center"
                >
                  <span className="min-w-[30px] text-gray11">3d</span>
                  <ExternalLinkIcon className="size-4 text-gray10" />
                </a>
              </td>
              <td className="w-[73%] text-right">
                <div className="flex flex-row items-center gap-x-2">
                  <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100">
                    <WalletIcon className="m-auto size-5 text-teal-600" />
                  </div>
                  <span className="font-medium text-gray12">
                    <TruncatedAddress address="0x0f7fda40Cad1D2966C77428cc2c7A9Bcc73961B5" />
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
                  <CopyIcon className={cx('m-auto size-5 text-gray10')} />
                </Ariakit.Button>
                <Ariakit.Button
                  className="size-8 rounded-full p-1 hover:bg-red-100"
                  onClick={() => {
                    console.info('')
                  }}
                >
                  <XIcon className={cx('m-auto size-5 text-red-500')} />
                </Ariakit.Button>
              </td>
            </tr>
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
  // decimals,
  address,
}: {
  logo: string
  symbol: string
  name: string
  value: string
  // decimals: number
  address: string
}) {
  const [viewState, setViewState] = React.useState<'send' | 'swap' | 'default'>(
    'default',
  )

  const sendCalls = useSendCalls({
    mutation: {
      onSuccess: (data) => {
        toast.success('Tokens sent', {
          description: () => (
            <a
              href={`https://explorer.ithaca.xyz/tx/${data}`}
              target="_blank"
              rel="noreferrer"
            >
              View on explorer
            </a>
          ),
        })
      },
      onError: (error) =>
        toast.error('Failed to send tokens', {
          description: error.message,
        }),
    },
  })

  const sendForm = Ariakit.useFormStore({
    defaultValues: {
      sendAmount: '',
      sendRecipient: '',
      sendAsset: address,
    },
  })

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
        toast.success('Tokens sent', {
          description: () => (
            <a
              href={`https://explorer.ithaca.xyz/tx/${data}`}
              target="_blank"
              rel="noreferrer"
            >
              View on explorer
            </a>
          ),
        })
      },
      onError: (error) =>
        toast.error('Failed to send tokens', {
          description: error.message,
        }),
    },
  })

  const swapForm = Ariakit.useFormStore({
    defaultValues: {
      swapAmount: '',
      swapAsset: address,
    },
  })

  swapForm.useSubmit(async (state) => {
    console.info(state)
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
    () => matchSorter(swapAssetsExcludingCurrent, swapSearchValue),
    [swapSearchValue, swapAssetsExcludingCurrent],
  )

  const clickOutsideRef = React.useRef<HTMLTableCellElement>(null)
  useClickOutside([clickOutsideRef], () => setViewState('default'))

  return (
    <tr className="font-normal sm:text-sm">
      {viewState === 'default' ? (
        <>
          <td className="w-[80%]">
            <div className="flex items-center gap-x-2 py-2">
              <img alt="asset icon" className="size-7" src={logo} />
              <span className="text-md">{name}</span>
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
        <td colSpan={4} className="w-full py-2" ref={clickOutsideRef}>
          <Ariakit.Form
            store={swapForm}
            className={cx(
              'flex gap-x-2',
              '*:w-1/2 *:rounded-xl *:border-1 *:border-gray7 *:bg-white *:focus:outline-sky-500 *:dark:bg-gray1',
            )}
          >
            <div className="z-[10000] flex items-center gap-x-2 shadow-xs">
              <Ariakit.ComboboxProvider
                resetValueOnHide={true}
                setValue={(value) => {
                  React.startTransition(() => {
                    setSwapSearchValue(value)
                  })
                }}
              >
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
                      <span className="text-gray10 text-xs">Swap to</span>
                      <span className="text-sm">{selectedAsset?.name}</span>
                    </div>
                    <div className="mx-2 ml-auto flex items-center">
                      <Ariakit.SelectArrow className="text-gray8 *:size-5" />
                    </div>
                  </Ariakit.Select>
                  <Ariakit.SelectPopover
                    gutter={24}
                    sameWidth={true}
                    className={cx(
                      'rounded-xl border border-gray6 bg-white shadow-sm dark:bg-gray1',
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
                          className="focus:bg-sky-100 focus:outline-none data-[active-item]:bg-sky-100 dark:data-[active-item]:bg-sky-900 dark:focus:bg-sky-900"
                          render={
                            <Ariakit.ComboboxItem
                              className={cx(
                                'flex flex-row items-center gap-x-2 px-3 py-3.5',
                                index === matches.length - 1 ||
                                  matches.length === 0
                                  ? ''
                                  : 'border-b border-b-gray6',
                              )}
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
                            </Ariakit.ComboboxItem>
                          }
                        />
                      ))}
                    </Ariakit.ComboboxList>
                  </Ariakit.SelectPopover>
                </Ariakit.SelectProvider>
              </Ariakit.ComboboxProvider>
            </div>
            <div className="relative flex w-full flex-row items-center pr-3 pl-3.5 shadow-xs focus-within:rounded-lg focus-within:outline-1 focus-within:outline-sky-500">
              <button
                className="-right-1.5 -top-1 absolute flex size-3 items-center justify-center rounded-full bg-gray2 text-gray10 hover:bg-gray4"
                type="button"
                onClick={() => setViewState('default')}
              >
                <XIcon />
              </button>
              <div className="flex w-full flex-col gap-y-1">
                <Ariakit.FormLabel
                  name={swapForm.names.swapAmount}
                  className="text-gray10 text-xs"
                >
                  Amount
                </Ariakit.FormLabel>
                <Ariakit.FormInput
                  type="number"
                  required={true}
                  autoCorrect="off"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="0.00"
                  autoCapitalize="off"
                  name={swapForm.names.swapAmount}
                  data-field={`${address}-amount`}
                  max={Number(value)}
                  onChange={(event) => {
                    const inputValue = event.currentTarget.value
                    if (parseEther(inputValue) > BigInt(value)) {
                      swapForm.setError('swapAmount', 'Amount is too high')
                    }
                    console.info(
                      swapForm.getError('swapAmount')?.length,
                      parseEther(inputValue),
                      BigInt(value),
                      parseEther(inputValue) > BigInt(value),
                    )
                  }}
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
                className={cx(
                  'mx-1 my-auto rounded-full bg-accent p-2 *:text-white/80 hover:bg-accentHover',
                  swapCalls.isPending && 'animate-pulse',
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
        <td colSpan={4} className="w-full" ref={clickOutsideRef}>
          <Ariakit.Form
            store={sendForm}
            className="relative my-2 flex h-16 w-full rounded-2xl border-1 border-gray6 bg-white p-2 dark:bg-gray1"
          >
            <button
              className="-right-1 -top-1 absolute flex size-3 items-center justify-center rounded-full bg-gray2 text-gray10 hover:bg-gray4"
              type="button"
              onClick={() => setViewState('default')}
            >
              <XIcon />
            </button>
            <div className="flex w-[75px] flex-row items-center gap-x-2 border-gray6 border-r pr-1.5 pl-0.5 sm:w-[85px] sm:pl-1.5">
              <img alt="asset icon" className="size-7" src={logo} />
            </div>
            <div className="ml-3 flex w-full flex-row gap-y-1 border-gray7 border-r pr-3">
              <div className="flex w-full flex-col gap-y-1">
                <Ariakit.FormLabel
                  name={sendForm.names.sendRecipient}
                  className="mt-1 text-gray10 text-xs sm:text-[12px]"
                >
                  Recipient
                </Ariakit.FormLabel>
                <Ariakit.FormInput
                  type="text"
                  required={true}
                  autoFocus={true}
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  placeholder="0xAbcD..."
                  name={sendForm.names.sendRecipient}
                  className="w-full font-mono text-xs placeholder:text-gray10 focus:outline-none sm:text-[13px] dark:text-gray12"
                />
              </div>
              <Ariakit.Button className="my-auto ml-auto rounded-full bg-gray4 p-2">
                <ClipboardCopyIcon className="size-4 text-gray10" />
              </Ariakit.Button>
            </div>

            <div className="flex w-[65px] max-w-min flex-col gap-y-1 px-2.5 sm:w-[90px]">
              <Ariakit.FormLabel
                name={sendForm.names.sendAmount}
                className="text-gray10 text-xs sm:text-[12px]"
              >
                Amount
              </Ariakit.FormLabel>
              <div className="flex flex-row gap-x-1">
                <Ariakit.FormInput
                  type="text"
                  required={true}
                  autoCorrect="off"
                  placeholder="0.00"
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  name={sendForm.names.sendAmount}
                  data-field={`${address}-amount`}
                  className="w-min font-mono text-sm placeholder:text-gray10 focus:outline-none sm:text-md"
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
            <Ariakit.FormSubmit className="my-auto mr-0.5 ml-1 rounded-full bg-accent p-2 hover:cursor-pointer! hover:bg-accentHover sm:mr-1 sm:ml-2">
              {sendCalls.isPending ? (
                <Spinner className="size-3! text-white sm:size-4!" />
              ) : (
                <SendIcon className="size-3 text-white sm:size-4!" />
              )}
            </Ariakit.FormSubmit>
          </Ariakit.Form>
        </td>
      ) : null}
    </tr>
  )
}
