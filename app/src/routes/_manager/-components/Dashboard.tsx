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

import { ExpIcon } from '~/components/Exp'
import { IndeterminateLoader } from '~/components/IndeterminateLoader'
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

  const [sendAmount, setSendAmount] = React.useState<string>('')
  const [sendRecipient, setSendRecipient] = React.useState<string>('')
  const sendCalls = useSendCalls({
    mutation: {
      onSuccess: (data) => {
        setSendAmount('')
        setSendRecipient('')
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
          <button
            type="button"
            onClick={() => disconnect.mutate({})}
            className={cx(
              'rounded-3xl bg-pink-100 px-4 py-2 font-semibold text-md text-red-500 hover:bg-pink-200',
              'ml-2',
            )}
          >
            Sign out
          </button>
        </div>
        <h1
          className={cx(
            'font-medium text-2x md:col-auto md:place-self-auto md:text-3xl',
            'col-start-3 row-start-2 mr-1 place-self-end',
          )}
        >
          ${ValueFormatter.formatToPrice(totalBalance.toLocaleString())}
        </h1>
      </nav>
      <div className="flex w-full flex-col divide-y-2 divide-gray5 border-gray5 border-y-2 lg:flex-row lg:divide-x-2 lg:divide-y-0 lg:*:w-1/2">
        <div className="py-3 lg:pr-4">
          <h2 className="font-semibold text-lg">Send</h2>
          {sendCalls.isPending ? (
            <div className="flex h-full w-full items-start justify-center pt-14">
              <IndeterminateLoader
                hint=""
                description=""
                title="Sending…"
                className="m-auto"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between gap-x-2">
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.00"
                  className="mt-2 w-full max-w-[120px] rounded-full px-4 py-2 font-mono text-gray12 text-xl tabular-nums focus:outline-gray5"
                />
                <div className="mt-2 flex items-center gap-x-2 rounded-full border border-gray6 p-2">
                  <ExpIcon className="size-5" />
                  <span className="font-mono text-md">EXP</span>
                </div>
              </div>

              <div
                className={cx(
                  'flex flex-row items-center gap-x-3 gap-y-2',
                  '*:my-auto sm:mt-2 lg:flex-col',
                )}
              >
                <input
                  value={sendRecipient}
                  placeholder="Recipient address…"
                  onChange={(e) => setSendRecipient(e.target.value)}
                  className={cx(
                    'mt-2 h-10 w-[80%] rounded-full border border-gray6 px-4 py-2 text-gray12 text-lg tabular-nums sm:text-sm',
                    'lg:w-full',
                  )}
                />
                <Ariakit.Button
                  disabled={!sendRecipient || !sendAmount}
                  onClick={() => {
                    if (
                      !sendAmount ||
                      !account.address ||
                      !Address.validate(sendRecipient)
                    )
                      return
                    sendCalls.sendCalls({
                      calls: [
                        {
                          to: '0x706Aa5C8e5cC2c67Da21ee220718f6f6B154E75c',
                          data: encodeFunctionData({
                            abi: erc20Abi,
                            functionName: 'transfer',
                            args: [sendRecipient, Value.fromEther(sendAmount)],
                          }),
                        },
                      ],
                    })
                  }}
                  className={cx(
                    'w-[20%] rounded-full bg-sky-500 px-4 py-2 font-normal text-lg text-white hover:bg-sky-600',
                    'lg:w-full',
                    'disabled:opacity-70',
                  )}
                >
                  Send
                </Ariakit.Button>
              </div>
            </div>
          )}
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
                'max-h-8 rounded-2xl bg-zinc-200/70 px-2 py-1 font-semibold text-sm text-zinc-500 hover:bg-zinc-200',
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
        <details className="deets" open>
          <summary className="font-semibold text-lg">Assets</summary>

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
                  className="py text-xs sm:text-sm"
                >
                  <td
                    className={cx(
                      'my-0.5 flex flex-row items-center gap-x-2 text-left',
                    )}
                  >
                    <img
                      alt="asset icon"
                      className="size-6"
                      src={`/icons/${asset.token.name.toLowerCase()}.svg`}
                    />
                    <span>{asset.token.name}</span>
                  </td>
                  <td className="text-right">
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
        <details className="deets" open={filteredTransfers?.length > 0}>
          <summary className="font-semibold text-lg">History</summary>

          <table className="my-3 w-full">
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
                      className="flex flex-row items-center gap-x-2 text-gray11"
                    >
                      <span className="min-w-[60px]">
                        {DateFormatter.ago(new Date(transfer?.timestamp ?? ''))}{' '}
                        ago
                      </span>
                      <ExternalLinkIcon className="size-4" />
                    </a>
                  </td>
                  <td className="text-left">
                    {StringFormatter.truncate(transfer?.to.hash ?? '', {
                      start: 4,
                      end: 4,
                    })}
                  </td>
                  <td className="text-left">{transfer?.type}</td>
                  <td className="text-right">
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
          className="deets pb-1"
          open={!!permissions?.data?.length && permissions?.data?.length > 0}
        >
          <summary className="my-auto font-semibold text-lg">
            Permissions
            <button
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
            </button>
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
                return (
                  <tr
                    key={`${permission.id}-${index}`}
                    className="text-xs sm:text-sm"
                  >
                    <td className="text-left">
                      {StringFormatter.truncate(permission?.address ?? '')}
                    </td>
                    <td className="text-right">{spend?.period}</td>
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
        <details className="deets" open>
          <summary className="font-semibold text-lg">
            Recovery
            <button
              type="button"
              className={cx(
                'rounded-2xl bg-zinc-200/70 px-2 py-1 font-semibold text-sm text-zinc-500 hover:bg-zinc-200',
                'ml-2',
              )}
            >
              Add wallet
            </button>
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
                    <span className="hidden size-6 rounded-lg bg-gray6 sm:block" />
                    <span>0x1234...235</span>
                    <span className="rounded-full border border-gray7 px-2 py-1 font-medium text-gray10 text-sm">
                      3h ago
                    </span>
                  </div>
                </td>
                <td className="ml-auto flex w-[100px] justify-end">
                  <div className="flex flex-row gap-x-2">
                    <CopyIcon className="my-auto size-5" />
                    <XIcon className="size-6 text-red9" />
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
