import type { ComponentPropsWithRef } from 'react'
import { useState } from 'react'
import { Input } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/Input')({
  component: InputComponent,
})

function InputComponent() {
  return (
    <ComponentScreen title="Input">
      <ComponentScreen.Section surface="base" title="Sizes">
        <div className="flex flex-col gap-4">
          <DemoInput placeholder="Medium" size="medium" />
          <DemoInput placeholder="Large" size="large" />
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section surface="base" title="States">
        <div className="flex flex-col gap-4">
          <DemoInput placeholder="Placeholder" />
          <DemoInput disabled placeholder="Disabled" />
          <DemoInput placeholder="With value" readOnly value="Filled value" />
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section surface="base" title="Contextual">
        <div className="flex flex-col gap-4">
          <DemoInput contextual="Optional" placeholder="Placeholder" />
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section surface="base" title="Unfocused Value">
        <div className="flex flex-col gap-4">
          <DemoInput
            placeholder="$200"
            formatValue={(value) => {
              if (value.trim() === '') return ''
              const numValue = parseFloat(value)
              if (isNaN(numValue)) return value
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(numValue)
            }}
          />
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}

function DemoInput(
  props: Omit<ComponentPropsWithRef<typeof Input>, 'value'> & {
    value?: string
  },
) {
  const [value, setValue] = useState('')
  return (
    <Input
      value={value}
      onChange={(event) => setValue(event.target.value)}
      {...props}
    />
  )
}
