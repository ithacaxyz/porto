import * as Ariakit from '@ariakit/react'
import { createFileRoute } from '@tanstack/react-router'
import { Address } from 'ox'
import * as React from 'react'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import CircleCheckIcon from '~icons/lucide/circle-check'
import OctagonAlertIcon from '~icons/lucide/octagon-alert'

import { Layout } from '~/components/AppLayout'
import { Header } from '~/components/Header'
import { Pill } from '~/components/Pill'
import { StringFormatter, cn } from '~/utils'

export const Route = createFileRoute('/withdraw')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = Ariakit.useFormStore({
    defaultValues: {
      asset: '',
      recipient: '',
      amount: undefined,
    },
  })

  const [truncatedRecipient, setTruncatedRecipient] = React.useState(
    StringFormatter.truncate(form.getValue(form.names.recipient), {
      start: 8,
      end: 6,
    }),
  )

  const [isRecipientFocused, setIsRecipientFocused] = React.useState(false)
  const validRecipient = Address.validate(form.getValue(form.names.recipient))

  // const totalBalance = React.useMemo(
  //   () => sum(assets.map((asset) => asset.balance.value)),
  //   [],
  // )

  return (
    <Layout>
      <Header />
      <main className="mt-8 flex size-full justify-center">
        <Ariakit.Form
          store={form}
          aria-labelledby="withdraw-funds"
          className="w-full max-w-[400px] rounded-xl bg-gray1 px-4.5 py-3 shadow-sm outline outline-gray3"
        >
          <h3 className="font-medium text-lg">Withdraw</h3>
          <p id="withdraw-funds" className="text-gray9 text-sm">
            Move your funds to another address.
          </p>
          <div className="mt-3 mb-1 flex flex-col gap-y-1.5">
            <Ariakit.FormLabel
              name={form.names.asset}
              className="ml-0.5 text-gray9 text-xs"
            >
              Select asset
            </Ariakit.FormLabel>
            <Ariakit.FormControl
              name={form.names.asset}
              className="text-gray9"
              render={(props) => (
                <Ariakit.MenuProvider>
                  <Ariakit.MenuButton
                    {...props}
                    className={cn(
                      'flex items-center gap-x-2',
                      'h-14 rounded-xl border-2 border-gray4 px-3.5 py-2.5 text-left font-medium text-lg text-primary hover:bg-secondary',
                    )}
                  >
                    <img
                      src="/icons/exp.svg"
                      alt="ithaca"
                      className="size-6 rounded-full"
                    />
                    <span className="mb-0.5">Experiment</span>
                    <ChevronRightIcon className="ml-auto size-6 rounded-full bg-gray4 p-1" />
                  </Ariakit.MenuButton>
                  <Ariakit.Menu
                    gutter={6}
                    className={cn(
                      'w-[364px] rounded-sm border border-gray6 bg-gray4 shadow-lg',
                      '*:tracking-normal',
                      '',
                    )}
                  >
                    <Ariakit.MenuItem className="flex items-center justify-between gap-x-2 rounded-sm px-4 py-3 hover:bg-gray2">
                      WIP
                    </Ariakit.MenuItem>
                  </Ariakit.Menu>
                </Ariakit.MenuProvider>
              )}
            />
            {/* <Ariakit.FormError name={form.names.asset} className="" /> */}
          </div>
          <div className="mt-3 mb-1 flex flex-col gap-y-1.5">
            <div className="flex items-center justify-between gap-x-2">
              <Ariakit.FormLabel
                name={form.names.amount}
                className="ml-0.5 text-gray9 text-xs"
              >
                Enter amount
              </Ariakit.FormLabel>
              <p className="ml-auto text-gray11 text-sm">
                3,002.41 <span className="text-gray9">held</span>
              </p>
              <Pill className="rounded-2xl font-medium">
                <button
                  type="button"
                  className="px-0.5 text-gray9 text-xs"
                  onClick={() => form.setValue(form.names.amount, 3_002.41)}
                >
                  Max
                </button>
              </Pill>
            </div>
            <div
              className={cn(
                'flex w-full items-center',
                'h-12 rounded-xl border-2 border-gray4 px-3.5 py-2 text-left font-medium hover:bg-secondary',
              )}
            >
              <Ariakit.FormInput
                type="number"
                inputMode="decimal"
                className={cn(
                  'slashed-zero tabular-nums placeholder:slashed-zero',
                  'size-full text-left font-medium text-2xl text-primary/80 hover:bg-secondary focus:outline-none',
                )}
                max={3_002.41}
                required={true}
                placeholder="0.00"
                defaultValue={undefined}
                name={form.names.amount}
              />

              <img
                src="/icons/exp.svg"
                alt="ithaca"
                className="size-5 rounded-full"
              />
              <span className="ml-2 text-gray9 text-lg">EXP</span>
            </div>
            <Ariakit.FormError
              name={form.names.amount}
              render={(props) => {
                const error = form.getError(form.names.amount)
                if (!error) return null
                const value = Number(form.getValue(form.names.amount) ?? 0)
                const [_min, max] = [0, 3_002.41]

                const message =
                  value > max ? (
                    <p className="flex items-center justify-center gap-x-1">
                      <OctagonAlertIcon className="size-5 text-red-500" />
                      <span className="font-semibold text-red-500">
                        Exceeded balance.
                      </span>
                      You hold {max} EXP.
                    </p>
                  ) : (
                    error
                  )
                return (
                  <div
                    {...props}
                    className="mt-1 rounded-2xl bg-[#FEEBEC] px-2 py-1.5 text-gray11"
                  >
                    {message}
                  </div>
                )
              }}
            />
          </div>
          <div className="my-3 flex flex-col gap-y-1">
            <Ariakit.FormLabel
              name={form.names.recipient}
              className="pointer-events-none ml-0.5 text-gray9 text-xs"
            >
              Send to...
            </Ariakit.FormLabel>
            <div
              className={cn(
                'flex w-full items-center',
                'h-12 rounded-xl border-2 border-gray4 py-2 pl-3.5 text-left font-medium hover:bg-secondary',
              )}
            >
              <Ariakit.FormInput
                maxLength={42}
                minLength={42}
                autoCorrect="off"
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                placeholder="0xAbCd..."
                name={form.names.recipient}
                pattern="^0x[a-fA-F0-9]{40}$"
                onFocus={() => setIsRecipientFocused(true)}
                onBlur={(event) => {
                  const input = event.currentTarget
                  if (input.value.length <= 14) return
                  setTruncatedRecipient(
                    StringFormatter.truncate(input.value, { start: 8, end: 6 }),
                  )

                  setIsRecipientFocused(false)
                }}
                className={cn(
                  'slashed-zero tabular-nums placeholder:slashed-zero',
                  'size-full text-left font-medium text-lg text-primary hover:bg-secondary focus:outline-none',
                  validRecipient && !isRecipientFocused && 'text-transparent',
                )}
              />
              <span
                data-item="recipient"
                className={cn(
                  'pointer-events-none absolute font-medium text-lg text-primary',
                  (!validRecipient || isRecipientFocused) &&
                    'invisible hidden text-transparent',
                )}
              >
                {truncatedRecipient}
              </span>
              {validRecipient && !isRecipientFocused && (
                <CircleCheckIcon className="my-auto mr-3 ml-auto size-6 rounded-full text-emerald-600" />
              )}
            </div>
            <Ariakit.FormError name={form.names.recipient} className="" />
          </div>
          <div className="my-4 flex flex-row gap-x-3 *:h-12 *:w-full *:select-none *:font-medium *:text-lg">
            <Ariakit.FormReset className="rounded-full border-2 border-gray6 bg-gray5 text-primary hover:bg-gray4">
              Cancel
            </Ariakit.FormReset>
            <Ariakit.FormSubmit
              className={cn(
                'rounded-full border-2 border-gray6 text-gray10 hover:bg-gray2',
              )}
            >
              Withdraw
            </Ariakit.FormSubmit>
          </div>
        </Ariakit.Form>
      </main>
    </Layout>
  )
}
