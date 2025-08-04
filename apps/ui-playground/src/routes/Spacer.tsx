import { Button, Frame, Spacer } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'

export const Route = createFileRoute('/Spacer')({
  component: SpacerComponent,
})

function SpacerComponent() {
  const [mode, setMode] = useState<'dialog' | 'full'>('full')
  const space = mode === 'dialog' ? 8 : 24
  return (
    <ComponentScreen title="Spacer">
      <div className="flex items-center gap-2 text-sm text-th_base mb-4">
        <Button
          onClick={() =>
            setMode((mode) => (mode === 'dialog' ? 'full' : 'dialog'))
          }
          size="small"
        >
          Frame mode: {mode}
        </Button>
      </div>
      <div className="w-[360px]">
        <Frame
          mode={mode}
          site={{
            label: `Spacer size: ${space}px`,
          }}
        >
          <div className="flex flex-col p-4">
            <div className="h-20 rounded bg-th_base-alt" />
            <Spacer.V size={{ dialog: 8, full: 24 }} />
            <div className="h-20 rounded bg-th_base-alt" />
          </div>
        </Frame>
      </div>
    </ComponentScreen>
  )
}

