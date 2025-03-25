import { Button } from '@porto/apps/components'

import * as Ariakit from '@ariakit/react'
import { Cuer } from 'cuer'
import { Address, Value } from 'ox'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import { encodeFunctionData, erc20Abi, formatEther } from 'viem'
import { useAccount } from 'wagmi'
import { useSendCalls } from 'wagmi/experimental'
import CopyIcon from '~icons/lucide/clipboard-copy'
import ExternalLinkIcon from '~icons/lucide/external-link'
import SendIcon from '~icons/lucide/send-horizontal'
import XIcon from '~icons/lucide/x'
import AccountIcon from '~icons/material-symbols/account-circle-full'
import WorldIcon from '~icons/tabler/world'

import { DevOnly } from '~/components/DevOnly'
import {
  useAddressTransfers,
  useTokenBalances,
} from '~/hooks/use-blockscout-api'
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

  // const selectAssets = React.useMemo(() => {
  //   return assets
  //     ?.map((asset) => ({
  //       label: asset.token.name,
  //       value: asset.token.address,
  //       icon:
  //         asset.token.icon_url ??
  //         `/icons/${asset.token.name.toLowerCase()}.svg`,
  //     }))
  //     .reverse()
  // }, [assets])

  return (
    <>
      <DevOnly />
      <Layout.Header
        right={
          <div className="mt-4 flex gap-2">
            <Button size="small">Help</Button>
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
        <div className="flex w-[150px] items-center justify-center gap-3">
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
        </div>
      </div>

      <div className="h-6" />
      <hr className="border-gray5" />
      <div className="h-4" />

      <details className="group" open>
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
                  <span className="ml-2">
                    {StringFormatter.truncate(transfer?.to.hash ?? '', {
                      start: 4,
                      end: 4,
                    })}
                  </span>
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

      <details className="group pb-1" open>
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
              <th className="pr-18 text-right">Amount</th>
              <th className="invisible text-right">Action</th>
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
                  <td className="py-3 text-left">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`https://explorer.ithaca.xyz/address/${permission.address}`}
                      className="flex flex-row items-center"
                    >
                      <span className="min-w-[45px] text-gray11">
                        {DateFormatter.timeToDuration(
                          permission.expiry * 1_000,
                        )}
                      </span>
                      <ExternalLinkIcon className="size-4 text-gray10" />
                    </a>
                  </td>
                  <td className="text-right">
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-blue-100">
                        <WorldIcon className="m-auto size-5 text-blue-400" />
                      </div>
                      <span className="font-medium text-gray12">
                        {StringFormatter.truncate(permission.address, {
                          start: 4,
                          end: 4,
                        })}
                      </span>
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
                  <td className="text-right ">
                    <Ariakit.Button
                      className="size-8 rounded-full p-1 hover:bg-red-100"
                      onClick={() => {
                        revokePermissions.mutate({ id: permission.id })
                      }}
                    >
                      <XIcon className="m-auto size-5 text-red-500" />
                    </Ariakit.Button>
                  </td>
                </tr>
              )
            })}
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
  const [showSendForm, setShowSendForm] = React.useState(false)

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

  const form = Ariakit.useFormStore({
    defaultValues: {
      amount: '',
      recipient: '',
      asset: address,
    },
  })

  // const selectedAsset = form.useValue(form.names.asset)

  form.useSubmit((state) => {
    if (!Address.validate(state.values.recipient) || !state.values.amount)
      return
    sendCalls.sendCalls({
      calls: [
        {
          to: address,
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
    <tr className="font-normal sm:text-sm">
      {!showSendForm ? (
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
          <td className="w-[20%] text-right text-sm">
            <Ariakit.Button
              className="rounded-full p-2 hover:bg-gray4"
              onClick={() => setShowSendForm(true)}
            >
              <SendIcon className="size-4 cursor-pointer text-gray9" />
            </Ariakit.Button>
          </td>
        </>
      ) : (
        <td colSpan={4} className="w-full">
          <Ariakit.Form
            store={form}
            className="my-2 flex h-16 w-full rounded-2xl border-1 border-gray6 bg-white p-2 dark:bg-gray1"
          >
            <div className="flex w-[85px] flex-row items-center gap-x-2 border-gray6 border-r pr-3 pl-1.5">
              <img alt="asset icon" className="size-7" src={logo} />
            </div>
            <div className="ml-3 flex w-full flex-row gap-y-1 border-gray7 border-r pr-3">
              <div className="flex w-full flex-col gap-y-1">
                <span className="text-[12px] text-gray10">Recipient</span>
                <Ariakit.FormInput
                  name={form.names.recipient}
                  type="text"
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  placeholder="0xAbcD..."
                  required={true}
                  className="w-full text-[13px] text-gray10 focus:outline-none dark:text-gray12"
                />
              </div>
              <Ariakit.Button className="my-auto ml-auto rounded-full bg-gray4 p-2">
                <CopyIcon className="size-4 text-gray10" />
              </Ariakit.Button>
            </div>
            <div className="flex w-[60px] max-w-min flex-col gap-y-1 px-2.5 sm:w-[90px]">
              <span className="text-[12px] text-gray10">Amount</span>
              <div className="flex flex-row gap-x-1">
                <Ariakit.FormInput
                  name={form.names.amount}
                  type="text"
                  data-field={`${address}-amount`}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  required={true}
                  placeholder="0.00"
                  className="w-min text-gray10 text-md focus:outline-none"
                />
              </div>
            </div>
            <Button
              size="small"
              variant="default"
              className="mx-1 my-auto text-gray11! text-xs!"
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
            <Ariakit.FormSubmit className="my-auto mr-1 ml-2 rounded-full bg-accent p-2 hover:cursor-pointer! hover:bg-accentHover">
              <SendIcon className="size-4 text-white sm:size-4.5" />
            </Ariakit.FormSubmit>
          </Ariakit.Form>
        </td>
      )}
    </tr>
  )
}
