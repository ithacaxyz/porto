import { Button, Frame, Screen, Spacer } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useColorScheme } from '~/ColorScheme.js'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'
import { DemoBrowser } from '~/components/DemoBrowser/DemoBrowser'

export const Route = createFileRoute('/Spacer')({
  component: SpacerComponent,
})

function SpacerComponent() {
  const { colorScheme } = useColorScheme()
  const [mode, setMode] = useState<Frame.ModeName>('dialog')
  const space = mode === 'dialog' ? 8 : 24
  const app = (
    <Frame
      colorScheme={colorScheme}
      mode={mode}
      screenKey="spacer-example"
      site={{
        label: `Spacer size: ${space}px`,
      }}
    >
      <Screen>
        <div className="flex flex-col p-4">
          <div className="h-20 rounded bg-th_base-alt" />
          <Spacer.V size={{ dialog: 8, full: 24 }} />
          <div className="h-20 rounded bg-th_base-alt" />
        </div>
      </Screen>
    </Frame>
  )

  return (
    <ComponentScreen title="Spacer">
      <div className="mb-4 flex items-center gap-2 text-sm text-th_base">
        <Button
          onClick={() =>
            setMode((mode) => (mode === 'dialog' ? 'full' : 'dialog'))
          }
          size="small"
        >
          Frame mode: {mode}
        </Button>
      </div>
      {mode === 'full' ? (
        <DemoBrowser initialHeight={360}>
          <div className="w-full">{app}</div>
        </DemoBrowser>
      ) : (
        <div className={'flex w-[360px]'}>{app}</div>
      )}
    </ComponentScreen>
  )
}
