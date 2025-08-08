import { ThemeSwitch } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/ThemeSwitch')({
  component: ThemeSwitchComponent,
})

function ThemeSwitchComponent() {
  return (
    <ComponentScreen title="ThemeSwitch">
      <ComponentScreen.Section title="Modes">
        <div className="flex gap-4">
          <SingleSwitch initialMode="light" />
          <SingleSwitch initialMode="dark" />
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}

function SingleSwitch({ initialMode }: { initialMode: 'light' | 'dark' }) {
  const [mode, setMode] = useState<'light' | 'dark'>(initialMode)
  return (
    <div
      className="dark color-scheme-dark flex items-center gap-4"
      style={{
        colorScheme: mode,
      }}
    >
      <div className="rounded-th_medium border border-th_base bg-th_base p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 text-th_base">{mode}</div>
          <ThemeSwitch colorScheme={mode} onChange={setMode} />
        </div>
      </div>
    </div>
  )
}
