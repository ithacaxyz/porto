import { Button, OtpInput } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/OtpInput')({
  component: OtpInputComponent,
})

function OtpInputComponent() {
  const [completed, setCompleted] = useState<string | null>(null)
  const [length, setLength] = useState(4)

  return (
    <ComponentScreen title="OtpInput">
      <ComponentScreen.Section
        surface="base"
        title={
          <>
            <div>Default</div>
            <div className="flex gap-2">
              <Button
                disabled={length <= 1}
                onClick={() => setLength((l) => Math.max(1, l - 1))}
                size="small"
              >
                -
              </Button>
              <Button
                disabled={length >= 10}
                onClick={() => setLength((l) => Math.min(10, l + 1))}
                size="small"
              >
                +
              </Button>
            </div>
          </>
        }
      >
        <div className="flex flex-col items-center gap-6">
          <DemoOtpInput
            key={length}
            length={length}
            onChange={() => setCompleted(null)}
            onFill={(code) => setCompleted(code)}
            status={completed ? 'valid' : 'default'}
          />
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section surface="base" title="States">
        <div className="flex flex-col items-center gap-4">
          <DemoOtpInput disabled value="1234" />
          <DemoOtpInput status="invalid" value="000" />
          <DemoOtpInput status="valid" value="000" />
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}

function DemoOtpInput(
  props: Omit<OtpInput.Props, 'value' | 'onChange'> & {
    value?: OtpInput.Props['value']
    onChange?: OtpInput.Props['onChange']
  },
) {
  const [value, setValue] = useState(props.value ?? '')
  return (
    <OtpInput
      {...props}
      onChange={(v) => {
        setValue(v)
        props.onChange?.(v)
      }}
      value={value}
    />
  )
}
