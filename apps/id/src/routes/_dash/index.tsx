import * as Ariakit from '@ariakit/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Porto } from 'porto'
import { RelayClient, WalletActions } from 'porto/viem'
import * as React from 'react'
import { zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { ValueFormatter } from '~/utils.ts'
import LucideChevronDown from '~icons/lucide/chevron-down'
import LucideClipboardPaste from '~icons/lucide/clipboard-paste'
import { config as portoConfig } from '../../lib/Porto.ts'

export const Route = createFileRoute('/_dash/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { address, chainId } = useAccount()

  // TODO: Return cached data on page load
  const { data: assets } = useQuery({
    enabled: Boolean(address),
    async queryFn(ctx) {
      const account = ctx.queryKey[0]
      if (!account) throw new Error('account not connected')
      const porto = Porto.create(portoConfig)
      const client = RelayClient.fromPorto(porto)
      return await WalletActions.getAssets(client, { account })
    },
    queryKey: [address] as const,
  })

  const form = Ariakit.useFormStore({
    defaultValues: { recipient: '', token: '', value: '' },
  })
  form.useSubmit(async (state) => {
    alert(JSON.stringify(state.values))
  })

  const token = form.useValue('token')
  const options = React.useMemo(() => {
    const tokens = assets?.[chainId ?? -1]
    if (!tokens) return []
    return tokens.map((token) => ({
      ...token,
      address:
        token.type === 'native' ? zeroAddress : (token.address ?? zeroAddress),
      icon: undefined,
      name:
        token.metadata?.symbol ?? (token.type === 'native' ? 'ETH' : 'unknown'),
    }))
  }, [assets, chainId])
  const active = React.useMemo(
    () =>
      options.find((option) => option.address === token) ??
      ({} as (typeof options)[number]),
    [options, token],
  )
  console.log(active)

  return (
    <div className="flex w-full items-center justify-center">
      <Ariakit.Form
        aria-labelledby="send-funds"
        className="flex flex-col items-center md:min-w-100.5 md:items-start"
        store={form}
      >
        <header className="mt-10 mb-6 flex max-w-[254px] flex-col items-center gap-1.5 text-center md:mt-0 md:max-w-full md:items-start md:px-2 md:text-left">
          <h2
            className="-tracking-[2.8%] font-medium text-[27px] text-gray12 leading-full"
            id="send-funds"
          >
            Send funds
          </h2>
          <p className="-tracking-[2.8%] text-[16px] text-gray10 leading-6.25 md:leading-full">
            Transfer money instantly and globally with low fees.
          </p>
        </header>

        <div className="mb-3.5 flex w-full flex-col gap-2.75">
          <Ariakit.FormLabel
            className="font-medium text-[13px] text-gray8 leading-none md:px-2"
            name={form.names.recipient}
          >
            Enter recipient
          </Ariakit.FormLabel>
          <div className="relative flex w-full items-center">
            <Ariakit.FormInput
              className="h-12 w-full rounded-full border border-gray4 bg-white ps-4 pe-11 font-medium text-[17px] placeholder:text-gray9 dark:bg-black"
              name={form.names.recipient}
              placeholder="0xA0Cf79..."
              required
              type="text"
            />
            <button
              className="absolute end-5 text-gray8"
              onClick={async () => {
                if (!navigator.clipboard) return
                const text = await navigator.clipboard.readText()
                form.setValues((values) => ({ ...values, recipient: text }))
              }}
              type="button"
            >
              <LucideClipboardPaste />
            </button>
          </div>
        </div>

        <Ariakit.FormGroup className="flex w-full flex-col gap-2.75">
          <div className="flex w-full justify-between md:ps-2">
            <Ariakit.FormGroupLabel className="font-medium text-[13px] text-gray8 leading-none">
              Choose amount
            </Ariakit.FormGroupLabel>
            <div className="font-medium text-[13px] text-gray8 leading-none">
              <span className="text-gray9">
                {Number(
                  ValueFormatter.format(
                    active.balance,
                    active.metadata?.decimals,
                  ),
                )}
              </span>{' '}
              available
            </div>
          </div>

          <div className="flex w-full gap-2.5">
            <div>
              <Ariakit.FormLabel className="sr-only" name={form.names.token}>
                Token
              </Ariakit.FormLabel>
              <Ariakit.Role.button
                render={
                  <Ariakit.FormControl
                    name={form.names.token}
                    render={
                      <Ariakit.SelectProvider
                        setValue={(value) => form.setValue('token', value)}
                      >
                        <Ariakit.Select
                          className="h-12 w-full min-w-40 rounded-full border border-gray4 bg-white ps-4 pe-4 font-medium text-[17px] placeholder:text-gray9 dark:bg-black"
                          disabled={!address}
                          value={token}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.25">
                              <span className="size-6 rounded-full bg-gray5">
                                {active.icon}
                              </span>
                              <span>{active.name}</span>
                            </div>
                            <LucideChevronDown className="text-gray9" />
                          </div>
                        </Ariakit.Select>

                        <Ariakit.SelectPopover
                          className="overflow-hidden rounded-[24px] border border-gray4 bg-white outline-none dark:bg-black"
                          gutter={-48}
                          sameWidth
                        >
                          {options.map((option) => (
                            <Ariakit.SelectItem
                              className="flex h-11.5 items-center gap-2.25 px-4 hover:bg-gray3 data-focus-visible:bg-gray4"
                              key={option.address}
                              value={option.address}
                            >
                              <span className="size-6 rounded-full bg-gray5">
                                {active.icon}
                              </span>
                              <div className="font-medium text-[17px]">
                                {option.name}
                              </div>
                              <div className="ms-auto flex size-5.5 items-center justify-end">
                                {option.address === active.address && (
                                  <div className="size-1.5 rounded-full bg-gray7" />
                                )}
                              </div>
                            </Ariakit.SelectItem>
                          ))}
                        </Ariakit.SelectPopover>
                      </Ariakit.SelectProvider>
                    }
                  />
                }
              />
            </div>

            <div className="flex w-full flex-col">
              <Ariakit.FormLabel className="sr-only" name={form.names.value}>
                Value
              </Ariakit.FormLabel>
              <div className="relative flex w-full items-center">
                <Ariakit.FormInput
                  className="h-12 w-full rounded-full border border-gray4 bg-white ps-4 pe-11 font-medium text-[17px] placeholder:text-gray9 dark:bg-black"
                  max={ValueFormatter.format(
                    active.balance,
                    active.metadata?.decimals,
                  )}
                  min={0.0000000000000001}
                  name={form.names.value}
                  placeholder="123"
                  required
                  type="number"
                />
                <button
                  className="absolute end-5 font-medium text-[13px] text-gray8 capitalize leading-none"
                  onClick={() => {
                    form.setValues((values) => ({
                      ...values,
                      value: ValueFormatter.format(
                        active.balance,
                        active.metadata?.decimals,
                      ),
                    }))
                  }}
                  type="button"
                >
                  max
                </button>
              </div>
            </div>
          </div>
        </Ariakit.FormGroup>

        <Ariakit.FormSubmit className="mt-3.5 h-12 w-full rounded-full bg-gray3 font-medium text-[17px]">
          Send
        </Ariakit.FormSubmit>
      </Ariakit.Form>
    </div>
  )
}
