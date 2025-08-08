import { PresetsInput } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'
import '@porto/ui/styles.css'

export const Route = createFileRoute('/PresetsInput')({
  component: PresetsInputComponent,
})

function PresetsInputComponent() {
  return (
    <ComponentScreen title="PresetsInput">
      <ComponentScreen.Section surface="base" title="Using percentage presets">
        <div className="flex w-[360px] flex-col gap-8">
          <Demo<number>
            formatValue={(value) => {
              return new Intl.NumberFormat('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 0,
                style: 'percent',
              }).format(value)
            }}
            parseValue={(value) => {
              const numValue = Number.parseFloat(value.replace(/%/g, '')) / 100
              return Number.isNaN(numValue) ? null : numValue
            }}
            placeholder="e.g. 33%"
            presets={[
              { label: '25%', value: '25' },
              { label: '50%', value: '50' },
              { label: '75%', value: '75' },
              { label: '100%', value: '100' },
            ]}
          />
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section surface="base" title="Currency Presets Input">
        <div className="flex w-[360px] flex-col gap-8">
          <Demo<number>
            formatValue={(value) => {
              return new Intl.NumberFormat('en-US', {
                currency: 'USD',
                style: 'currency',
              }).format(value)
            }}
            parseValue={(value) => {
              const numValue = Number.parseFloat(value.replace(/[$,]/g, ''))
              return Number.isNaN(numValue) ? null : numValue
            }}
            placeholder="e.g. $123.45"
            presets={[
              { label: '$25', value: '25' },
              { label: '$50', value: '50' },
              { label: '$100', value: '100' },
              { label: '$250', value: '250' },
            ]}
          />
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}

function Demo<Parsed>({
  formatValue,
  parseValue,
  placeholder,
  presets,
}: {
  formatValue: (value: Parsed) => string
  parseValue: (value: string) => Parsed | null
  placeholder?: string
  presets: Array<{
    label: string
    value: string
  }>
}) {
  const [defaultPreset] = presets
  if (!defaultPreset) throw new Error('No presets provided')

  const [value, setValue] = useState(defaultPreset.value)
  const [mode, setMode] = useState<'preset' | 'custom'>('preset')
  const empty = value.trim() === ''
  const parsed = empty ? null : parseValue(value)
  const formatted = empty || !parsed ? '' : formatValue(parsed)
  return (
    <div className="flex flex-col gap-4">
      <PresetsInput
        formatValue={() => formatted}
        mode={mode}
        onChange={setValue}
        onModeChange={setMode}
        placeholder={placeholder}
        presets={presets}
        value={value}
      />
      <div>
        Value: {empty ? '<empty>' : parsed === null ? '<error>' : formatted}
      </div>
      <div>Mode: {mode}</div>
    </div>
  )
}
