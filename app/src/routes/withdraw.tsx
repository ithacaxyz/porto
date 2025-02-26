import * as Ariakit from '@ariakit/react'
import { createFileRoute } from '@tanstack/react-router'
import ChevronRightIcon from '~icons/lucide/chevron-right'

import { Layout } from '~/components/AppLayout'
import { Header } from '~/components/Header'
import { Pill } from '~/components/Pill'
import { cn } from '~/utils'

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
          <div className="mt-3 mb-2 flex flex-col gap-y-1.5">
            <Ariakit.FormLabel
              name={form.names.asset}
              className="ml-0.5 text-gray9 text-xs"
            >
              Select asset
            </Ariakit.FormLabel>
            <Ariakit.FormControl
              name={form.names.asset}
              className="text-gray9"
              render={() => (
                <Ariakit.MenuProvider>
                  <Ariakit.MenuButton
                    className={cn(
                      'flex items-center gap-x-2',
                      'h-14 rounded-xl border-2 border-gray4 px-3.5 py-2.5 text-left font-medium text-lg text-primary hover:bg-secondary',
                    )}
                  >
                    <img
                      src="/icons/ithaca-blue.svg"
                      alt="ithaca"
                      className="size-6 rounded-full"
                    />
                    <span className="mb-0.5">Experiment</span>
                    <ChevronRightIcon className="ml-auto size-6 rounded-full bg-gray4 p-1" />
                  </Ariakit.MenuButton>
                  <Ariakit.Menu
                    gutter={6}
                    className={cn(
                      'w-[364px] rounded-sm border border-gray6 bg-gray4 p-1 shadow-lg',
                      '*:tracking-normal',
                      '',
                    )}
                  >
                    <Ariakit.MenuItem className="flex items-center justify-between gap-x-2 rounded-sm px-3 py-2 hover:bg-gray2">
                      WIP
                    </Ariakit.MenuItem>
                  </Ariakit.Menu>
                </Ariakit.MenuProvider>
              )}
            />
            {/* <Ariakit.FormError name={form.names.asset} className="" /> */}
          </div>
          <div className="my-3 flex flex-col gap-y-1.5">
            <div className="flex items-center justify-between gap-x-2">
              <Ariakit.FormLabel
                name={form.names.amount}
                className="ml-0.5 text-gray9 text-xs"
              >
                Enter amount
              </Ariakit.FormLabel>
              <Pill className="rounded-2xl font-medium">
                <button
                  type="button"
                  className="px-0.5 text-gray9 text-xs"
                  onClick={() => form.setValue(form.names.amount, 100)}
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
                  'size-full text-left font-medium text-2xl text-primary hover:bg-secondary focus:outline-none',
                )}
                required={true}
                placeholder="0.00"
                defaultValue={undefined}
                name={form.names.amount}
              />

              <img
                src="/icons/ithaca-blue.svg"
                alt="ithaca"
                className="size-5 rounded-full"
              />
              <span className="ml-2 text-gray9 text-lg">EXP</span>
            </div>
            {/* <Ariakit.FormError name={form.names.amount} className="" /> */}
          </div>
          <div className="my-3 flex flex-col gap-y-1">
            <div>
              <Ariakit.FormLabel
                name={form.names.recipient}
                className="ml-0.5 text-gray9 text-xs"
              >
                Send to...
              </Ariakit.FormLabel>
            </div>
            <Ariakit.FormInput
              spellCheck={false}
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              placeholder="0xAbCd..."
              name={form.names.recipient}
              className="size-full h-12 rounded-xl border-2 border-gray4 px-3.5 py-2 text-left font-medium text-md text-primary placeholder:text-xl hover:bg-secondary focus:outline-none"
            />
          </div>
          <div className="mt-4 mb-2 flex flex-row gap-x-3 *:h-12 *:w-full *:font-medium *:text-lg">
            <Ariakit.FormReset className="rounded-full border-2 border-gray6 bg-gray5 text-primary hover:bg-gray4">
              Cancel
            </Ariakit.FormReset>
            <Ariakit.FormSubmit className="rounded-full border-2 border-gray6 text-gray10 hover:bg-gray2">
              Withdraw
            </Ariakit.FormSubmit>
          </div>
        </Ariakit.Form>
      </main>
    </Layout>
  )
}
