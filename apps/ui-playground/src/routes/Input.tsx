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
          <DemoInput disabled placeholder="Disabled" />
          <DemoInput placeholder="With value" readOnly value="Filled value" />
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
  const [value, setValue] = useState('')
  return <Input onChange={setValue} value={value} {...props} />
}
