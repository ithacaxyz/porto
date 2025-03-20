import { IndeterminateLoader } from '@porto/apps/components'

import * as Ariakit from '@ariakit/react'
import { cx } from 'cva'
import { Address, Value } from 'ox'
import { formatEther } from 'ox/Value'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import { encodeFunctionData, erc20Abi } from 'viem'
import { useAccount } from 'wagmi'
import { useSendCalls } from 'wagmi/experimental'
import { config } from '~/lib/Wagmi'
import CopyIcon from '~icons/lucide/copy'
import ExternalLinkIcon from '~icons/lucide/external-link'
import XIcon from '~icons/lucide/x'

import { QrCode } from '~/components/QrCode'
import {
  useAddressTransfers,
  useTokenBalances,
} from '~/hooks/use-blockscout-api'
import { DateFormatter, StringFormatter, ValueFormatter, sum } from '~/utils'

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

  const selectAssets = React.useMemo(() => {
    return assets
      ?.map((asset) => ({
        label: asset.token.name,
        value: asset.token.address,
        icon:
          asset.token.icon_url ??
          `/icons/${asset.token.name.toLowerCase()}.svg`,
      }))
      .reverse()
  }, [assets])

  const form = Ariakit.useFormStore({
    defaultValues: {
      amount: '',
      recipient: '',
      asset: selectAssets.at(0)?.label,
    },
  })

  const selectedAsset = form.useValue(form.names.asset)

  form.useSubmit((state) => {
    if (!Address.validate(state.values.recipient) || !state.values.amount)
      return
    const asset = selectAssets.find(
      (a) => a.label.toLowerCase() === state.values.asset?.toLowerCase(),
    )
    if (!asset) return
    sendCalls.sendCalls({
      calls: [
        {
          to: asset.value,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: 'transfer',
            args: [
              state.values.recipient,
              Value.fromEther(state.values.amount),
            ],
          }),
        },
      ],
    })
  })

  return (
    <section className="z-50 flex flex-col gap-y-4 overflow-y-auto bg-grayA1 px-3 py-2 tabular-nums sm:px-6 lg:px-8">
      <nav className="mt-4 mb-2 grid grid-flow-row-dense grid-cols-3 grid-rows-2 gap-y-8">
        <div className="my-auto block md:hidden">
          <img src="/logo-light.svg" alt="Porto" className="w-24" />
        </div>
        <p
          className={cx(
            'my-auto font-medium text-xl md:row-start-1',
            'col-start-1 row-start-2',
          )}
        >
          Account
        </p>
        <div className={cx('col-span-2 col-start-2 space-x-2 place-self-end')}>
          <a
            className={cx(
              'rounded-3xl bg-gray-200 px-4 py-2 font-semibold text-md text-neutral-800 hover:bg-gray-300',
              'ml-auto',
            )}
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            Help
          </a>
          <Ariakit.Button
            type="button"
            onClick={() => disconnect.mutate({})}
            className={cx(
              'rounded-3xl bg-pink-100 px-4 py-2 font-semibold text-md text-red-500 hover:bg-pink-200',
              'ml-2',
            )}
          >
            Sign out
          </Ariakit.Button>
        </div>
        <h1
          className={cx(
            'font-medium text-2x md:col-auto md:place-self-auto md:text-3xl',
            'col-start-3 row-start-2 mr-1 place-self-end',
          )}
        >
          ${totalBalance.toLocaleString()}
        </h1>
      </nav>
      <div className="flex w-full flex-col divide-y-2 divide-gray5 border-gray5 border-y-2 lg:flex-row lg:divide-x-2 lg:divide-y-0 lg:*:w-1/2">
        <div className="pt-3 pb-6 lg:pr-4">
          <h2 className="font-semibold text-lg">Send</h2>
          <div className="relative">
            {sendCalls.isPending && (
              <div className="-mt-2 -mb-6 -mx-4 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
                <IndeterminateLoader
                  hint=""
                  description=""
                  title="Sending…"
                  className="mb-10 max-w-[60px] flex-col"
                />
              </div>
            )}
            <Ariakit.Form
              className={cx(
                'flex flex-col gap-y-2',
                sendCalls.isPending && ' bg-opacity-70',
              )}
              store={form}
            >
              <div className="flex items-center justify-between gap-x-2">
                <Ariakit.VisuallyHidden>
                  <Ariakit.FormLabel name={form.names.amount}>
                    Amount
                  </Ariakit.FormLabel>
                </Ariakit.VisuallyHidden>
                <Ariakit.FormInput
                  required
                  name={form.names.amount}
                  type="number"
                  placeholder="0.00"
                  className="mt-2 w-full max-w-[120px] rounded-full px-4 py-2 font-mono text-gray12 text-xl tabular-nums focus:outline-none focus:ring-0"
                />

                <Ariakit.VisuallyHidden>
                  <Ariakit.FormLabel name={form.names.asset}>
                    Asset
                  </Ariakit.FormLabel>
                </Ariakit.VisuallyHidden>
                <Ariakit.FormControl
                  name={form.names.asset}
                  render={
                    <Ariakit.SelectProvider
                      setValueOnMove
                      value={selectedAsset}
                      setValue={(value) =>
                        form.setValue(form.names.asset, value)
                      }
                    >
                      <Ariakit.Select className="mt-2 flex items-center gap-x-2 rounded-full border border-gray6 px-2.5 py-2 uppercase">
                        <img
                          alt="asset icon"
                          className="size-6"
                          src={`/icons/${selectedAsset?.toLowerCase()}.svg`}
                        />
                        <Ariakit.SelectValue />
                      </Ariakit.Select>
                      <Ariakit.SelectPopover
                        gutter={8}
                        className="z-[999999] w-full rounded-lg outline outline-gray6"
                      >
                        <Ariakit.SelectList className="rounded-xl">
                          <Ariakit.SelectGroup className="rounded-xl">
                            {selectAssets.map((asset) => (
                              <Ariakit.SelectItem
                                key={asset.label}
                                value={asset.label}
                                className="flex items-center justify-start gap-2 space-y-1 bg-gray2 px-3 py-2 hover:bg-gray4"
                              >
                                <img
                                  src={asset.icon}
                                  alt={asset.label}
                                  className="size-6"
                                />
                                <span className="my-auto font-mono text-md">
                                  {asset.label.toUpperCase()}
                                </span>
                              </Ariakit.SelectItem>
                            ))}
                          </Ariakit.SelectGroup>
                        </Ariakit.SelectList>
                      </Ariakit.SelectPopover>
                    </Ariakit.SelectProvider>
                  }
                />
              </div>

              <div
                className={cx(
                  'flex flex-row items-center gap-x-3 gap-y-3',
                  '*:my-auto sm:mt-2 lg:flex-col',
                )}
              >
                <Ariakit.VisuallyHidden>
                  <Ariakit.FormLabel name={form.names.recipient}>
                    Recipient
                  </Ariakit.FormLabel>
                </Ariakit.VisuallyHidden>
                <Ariakit.FormInput
                  required
                  type="text"
                  name={form.names.recipient}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  autoCapitalize="off"
                  pattern="^0x[a-fA-F0-9]{40}$"
                  placeholder="Recipient address…"
                  className={cx(
                    'mt-2 h-10 w-[80%] rounded-full border border-gray6 px-4 py-2 text-gray12 text-lg tabular-nums focus:outline-gray6 sm:text-sm',
                    'lg:w-full',
                  )}
                />
                <Ariakit.FormSubmit
                  className={cx(
                    'w-[20%] rounded-full bg-sky-500 px-4 py-2 font-normal text-lg text-white hover:bg-sky-600',
                    'lg:w-full',
                    'disabled:opacity-70',
                  )}
                >
                  Send
                </Ariakit.FormSubmit>
              </div>
            </Ariakit.Form>
          </div>
        </div>
        <div className={cx('flex flex-row py-3', 'lg:flex-col lg:pl-4')}>
          <div className="flex w-full justify-between gap-x-3">
            <h2 className="font-semibold text-lg">Receive</h2>
            <Ariakit.Button
              type="button"
              onClick={() => {
                navigator.clipboard
                  .writeText(account?.address ?? '')
                  .then(() => toast.success('Address copied to clipboard'))
                  .catch(() => toast.error('Failed to copy address'))
              }}
              className={cx(
                'max-h-8 rounded-2xl bg-gray4 px-2 py-1 font-semibold text-gray10 text-sm hover:bg-zinc-200',
                'mr-auto lg:mr-0 lg:ml-auto',
              )}
            >
              Copy
            </Ariakit.Button>
          </div>
          <div className="flex flex-row items-center justify-center gap-x-4 md:pt-4 md:pb-2">
            <div>
              <QrCode contents={account.address} />
            </div>
            <p className="min-w-[55px] max-w-[55px] text-pretty break-all font-mono font-normal text-gray10 text-sm">
              {account.address}
            </p>
          </div>
        </div>
      </div>
      <div className="border-gray5 border-b-2 pb-2">
        <details className="group" open>
          <summary className='relative cursor-default list-none pr-1 font-semibold text-lg after:absolute after:right-1 after:font-normal after:text-gray10 after:text-sm after:content-["[+]"] group-open:after:content-["[–]"]'>
            Assets
          </summary>

          <table className="my-3 w-full">
            <thead>
              <tr className="text-gray10 *:font-normal *:text-sm">
                <th className="text-left">Name</th>
                <th className="text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="border-transparent border-t-10 font-semibold">
              {assets?.map((asset, index) => (
                <tr
                  key={`${asset.token.address}-${index}`}
                  className="text-xs sm:text-sm"
                >
                  <td
                    className={cx(
                      'my-1.5 flex flex-row items-center gap-x-2 text-left',
                    )}
                  >
                    <img
                      alt="asset icon"
                      className="size-6"
                      src={`/icons/${asset.token.name.toLowerCase()}.svg`}
                    />
                    <span>{asset.token.name}</span>
                  </td>
                  <td className="text-right text-sm">
                    {Number(asset.value) < 1
                      ? 1
                      : formatEther(BigInt(asset.value))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
      <div className="border-gray5 border-b-2 pb-2">
        <details className="group" open={filteredTransfers?.length > 0}>
          <summary className='relative cursor-default list-none pr-1 font-semibold text-lg after:absolute after:right-1 after:font-normal after:text-gray10 after:text-sm after:content-["[+]"] group-open:after:content-["[–]"]'>
            History
          </summary>

          <table className="my-3 w-full table-fixed">
            <thead>
              <tr className="text-gray10 *:font-normal *:text-sm">
                <th className="text-left">Timestamp</th>
                <th className="text-left">Recipient</th>
                <th className="text-left">Note</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="border-transparent border-t-10">
              {filteredTransfers?.slice(0, 5).map((transfer, index) => (
                <tr
                  key={`${transfer?.transaction_hash}-${index}`}
                  className="text-xs sm:text-sm"
                >
                  <td className="text-left">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`https://explorer.ithaca.xyz/tx/${transfer?.transaction_hash}`}
                      className="flex flex-row items-center"
                    >
                      <span className="min-w-[65px] text-gray11">
                        {DateFormatter.ago(new Date(transfer?.timestamp ?? ''))}{' '}
                        ago
                      </span>
                      <ExternalLinkIcon className="size-4" />
                    </a>
                  </td>
                  <td className="text-left font-medium">
                    {StringFormatter.truncate(transfer?.to.hash ?? '', {
                      start: 4,
                      end: 4,
                    })}
                  </td>
                  <td className="text-left text-gray12">{transfer?.type}</td>
                  <td className="text-right text-gray12">
                    {Value.format(
                      BigInt(transfer?.total.value ?? 0),
                      Number(transfer?.token.decimals ?? 0),
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
      <div className="border-gray5 border-b-2 pb-2">
        <details
          className="group pb-1"
          open={!!permissions?.data?.length && permissions?.data?.length > 0}
        >
          <summary className='relative my-auto cursor-default list-none space-x-1 pr-1 font-semibold text-lg after:absolute after:right-1 after:font-normal after:text-gray10 after:text-sm after:content-["[+]"] group-open:after:content-["[–]"]'>
            <span>Permissions</span>
            <Ariakit.Button
              type="button"
              onClick={() => {
                permissions?.data?.map((permission) => {
                  revokePermissions.mutate({ id: permission.id })
                })
              }}
              className={cx(
                'rounded-2xl bg-pink-100 px-2 py-1 text-red-500 text-sm hover:bg-pink-200',
                'ml-2',
              )}
            >
              Revoke all
            </Ariakit.Button>
          </summary>

          <table className="my-3 w-full">
            <thead>
              <tr className="text-gray10 *:font-normal *:text-sm">
                <th className="text-left">Name</th>
                <th className="text-right">Scope</th>
                <th className="text-right">Permission</th>
                <th className="text-right">Expiry</th>
              </tr>
            </thead>
            <tbody className="border-transparent border-t-10">
              {permissions?.data?.map((permission, index) => {
                const [spend] = permission?.permissions?.spend ?? []
                const [calls] = permission?.permissions?.calls ?? []
                return (
                  <tr
                    key={`${permission.id}-${index}`}
                    className="text-xs sm:text-sm"
                  >
                    <td className="text-left">
                      {StringFormatter.truncate(permission?.address ?? '')}
                    </td>
                    <td className="text-right">{calls?.signature ?? '––'}</td>
                    <td className="text-right">
                      {spend?.limit ? Value.format(spend?.limit ?? 0n, 18) : 0}{' '}
                      / {spend?.period}
                    </td>
                    <td className="text-right">
                      {DateFormatter.timeToDuration(permission.expiry * 1000)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </details>
      </div>
      <div className="pb-3">
        <details className="group" open>
          <summary className='relative cursor-default list-none pr-1 font-semibold text-lg after:absolute after:right-1 after:font-normal after:text-gray10 after:text-sm after:content-["[+]"] group-open:after:content-["[–]"]'>
            Recovery
            <Ariakit.Button
              type="button"
              className={cx(
                'rounded-2xl bg-gray4 px-2 py-1 font-semibold text-gray10 text-sm hover:bg-zinc-200',
                'ml-2',
              )}
            >
              Add wallet
            </Ariakit.Button>
          </summary>
          <table className="my-3 w-full">
            <thead>
              <tr className="text-gray10 *:font-normal *:text-sm">
                <th className="text-left">Name</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="w-full border-transparent border-t-10">
              <tr className="text-xs sm:text-sm">
                <td className="">
                  <div className="flex flex-row items-center gap-x-2">
                    <span>0x1234...235</span>
                    <span className="rounded-full border border-gray7 px-2 py-1 font-medium text-gray10 text-sm">
                      3h ago
                    </span>
                  </div>
                </td>
                <td className="ml-auto flex w-[100px] justify-end">
                  <div className="flex flex-row gap-x-2">
                    <Ariakit.Button type="button">
                      <CopyIcon className="my-auto size-5 hover:text-gray6" />
                    </Ariakit.Button>
                    <Ariakit.Button type="button">
                      <XIcon className="size-6 text-red9" />
                    </Ariakit.Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </details>
      </div>
    </section>
  )
}
