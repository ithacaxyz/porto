import { Button, Frame, Screen, Separator } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen.js'
import { DemoBrowser } from '~/components/DemoBrowser/DemoBrowser.js'
import LucideLogIn from '~icons/lucide/log-in'

export const Route = createFileRoute('/Frame')({
  component: RouteComponent,
})

function RouteComponent() {
  const [mode, setMode] = useState<'dialog' | 'full'>('full')
  const frame = (
    <Frame
      mode={mode}
      site={{
        icon: '/uniswap-icon.svg',
        label: 'uniswap.org',
        labelExtended: (
          <>
            Connected to <span className="text-th_base">uniswap.org</span>
          </>
        ),
      }}
    >
      <Screen layout="full">
        <Screen.Header
          content={
            <>
              Authenticate with your passkey wallet to start using{' '}
              <strong className="font-medium">uniswap.org</strong>.
            </>
          }
          icon={<LucideLogIn />}
          title="Get started"
        />
        <div>
          <Button variant="primary" wide>
            Sign in
          </Button>
          <Separator label="First time, or lost access?" />
          <Button variant="secondary" wide>
            Create account
          </Button>
        </div>
      </Screen>
    </Frame>
  )
  return (
    <ComponentScreen title="Frame">
      <div className="flex items-center gap-2 text-sm text-th_base">
        <Button
          onClick={() =>
            setMode((mode) => (mode === 'dialog' ? 'full' : 'dialog'))
          }
          size="small"
        >
          Frame mode: {mode}
        </Button>
      </div>
      {mode === 'dialog' ? (
        <div className={'flex w-[360px]'}>{frame}</div>
      ) : (
        <DemoBrowser>
          <div className="flex w-full flex-col">{frame}</div>
        </DemoBrowser>
      )}
    </ComponentScreen>
  )
}
