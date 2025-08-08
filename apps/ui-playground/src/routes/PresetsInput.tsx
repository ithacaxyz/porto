import { PresetsInput } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'
import '@porto/ui/styles.css'

export const Route = createFileRoute('/PresetsInput')({
  component: PresetsInputComponent,
})

const presets = [
  { id: '25', label: '25%', value: '25%' },
  { id: '50', label: '50%', value: '50%' },
  { id: '75', label: '75%', value: '75%' },
  { id: '100', label: '100%', value: '100%' },
]

function PresetsInputComponent() {
  const [value, setValue] = useState(presets[0]?.value ?? '')
  return (
    <ComponentScreen title="PresetsInput">
      <ComponentScreen.Section>
        <div className="w-[360px]">
          <div className="flex flex-col gap-4">
            <PresetsInput
              onChange={setValue}
              placeholder="e.g. 33%"
              presets={presets}
            />
            <div>Value: {value}</div>
          </div>
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
