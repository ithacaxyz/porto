import * as Ariakit from '@ariakit/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dash/')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = Ariakit.useFormStore({
    defaultValues: { amount: '', recipient: '' },
  })

  form.useSubmit(async (state) => {
    alert(JSON.stringify(state.values))
  })

  return (
    <div className="flex w-full items-center justify-center">
      <Ariakit.Form
        aria-labelledby="send-funds"
        className="flex flex-col items-center md:items-start"
        store={form}
      >
        <header className="mt-10 mb-6 flex max-w-[254px] flex-col items-center gap-1.5 text-center md:mt-0 md:max-w-full md:items-start md:text-left">
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

        <div>
          <Ariakit.FormLabel name={form.names.recipient}>
            Enter recipient
          </Ariakit.FormLabel>
          <Ariakit.FormInput
            className="input"
            name={form.names.recipient}
            placeholder="john@appleseed.com or 0xAbCd1b..."
            required
            type="text"
          />
          <Ariakit.FormError className="error" name={form.names.recipient} />
        </div>

        <div>
          <Ariakit.FormLabel name={form.names.amount}>
            Choose amount
          </Ariakit.FormLabel>
          <Ariakit.FormInput
            className="input"
            name={form.names.amount}
            placeholder="$0.00"
            required
          />
          <Ariakit.FormError className="error" name={form.names.amount} />
        </div>

        <Ariakit.FormSubmit className="button">Send</Ariakit.FormSubmit>
      </Ariakit.Form>
    </div>
  )
}
