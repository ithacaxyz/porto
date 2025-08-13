import { PresetsInput } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'
import '@porto/ui/styles.css'

export const Route = createFileRoute('/PresetsInput')({
  component: PresetsInputComponent,
})

const presets = [
  { label: '$25', value: '25' },
  { label: '$50', value: '50' },
  { label: '$100', value: '100' },
  { label: '$250', value: '250' },
] as const

function parseValue(value: string): number | null {
  const numValue = Number.parseFloat(value.replace(/[$,]/g, ''))
  return Number.isNaN(numValue) ? null : numValue
}

function formatParsedValue(value: number): string {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(value)
}

function PresetsInputComponent() {
  const [defaultPreset] = presets
  const [value, setValue] = useState<string>(defaultPreset.value)
  const [mode, setMode] = useState<'preset' | 'custom'>('preset')
  const empty = value.trim() === ''

  const parsed = empty ? null : parseValue(value)
  const formatted = empty || parsed === null ? '' : formatParsedValue(parsed)

  return (
    <ComponentScreen title="PresetsInput">
      <ComponentScreen.Section surface="base" title="Currency Presets Input">
        <div className="flex w-[360px] flex-col gap-8">
          <div className="flex flex-col gap-4">
            <PresetsInput
              adornments={{
                end: {
                  label: 'Max. $500',
                  type: 'fill',
                  value: '500',
                },
                start: '$',
              }}
              inputMode="decimal"
              max={500}
              min={0}
              mode={mode}
              onChange={setValue}
              onModeChange={setMode}
              placeholder="123.45"
              presets={[...presets]}
              type="number"
              value={value}
            />
            <div className="flex gap-4">
              <div className="w-30">Mode: {mode}</div>
              <div>
                Value:{' '}
                {empty ? '<empty>' : parsed === null ? '<error>' : formatted}
              </div>
            </div>
          </div>
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}
