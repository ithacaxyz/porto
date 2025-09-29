import { Input } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
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
          <DemoInput disabled value="Disabled" />
          <DemoInput value="Filled value" />
          <DemoInput
            adornments={{
              end: 'Invalid (prop)',
            }}
            invalid
            value="Invalid value"
          />
          <DemoInput
            adornments={{
              end: 'Invalid (browser)',
            }}
            inputMode="decimal"
            max={500}
            min={0}
            type="number"
            value="999"
          />
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section surface="base" title="Adornments">
        <div className="flex flex-col gap-4">
          <DemoInput
            adornments={{
              end: 'Optional',
            }}
          />
          <DemoInput
            adornments={{
              start: '$',
            }}
          />
          <DemoInput
            adornments={{
              start: { label: 'USD', type: 'solid' },
            }}
            placeholder="0.00"
          />
          <DemoInput
            adornments={{
              end: { type: 'valid' },
            }}
            type="email"
            value="example@example.org"
          />
          <DemoInput
            adornments={{
              end: { type: 'required' },
            }}
            placeholder="example@ithaca.xyz"
            type="email"
          />
          <DemoInput
            adornments={{
              start: {
                prefixes: ['+1', '+44'],
                type: 'phone-prefix',
              },
            }}
            placeholder="+1 (650) 555-1234"
            type="tel"
          />
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}

function DemoInput(
  props: Omit<Input.Props, 'value' | 'onChange'> & {
    value?: Input.Props['value']
    onChange?: Input.Props['onChange']
  },
) {
  const [value, setValue] = useState(props.value ?? '')
  return <Input {...props} onChange={setValue} value={value} />
}
