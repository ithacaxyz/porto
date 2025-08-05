import { Button, Frame, Input, Screen, Separator, Spacer } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen.js'
import { DemoBrowser } from '~/components/DemoBrowser/DemoBrowser.js'
import LucideLogIn from '~icons/lucide/log-in'
import LucideScanFace from '~icons/lucide/scan-face'

export const Route = createFileRoute('/Frame')({
  component: RouteComponent,
})

const DEMOS = [
  {
    icon: <LucideLogIn />,
    showCreate: true,
    subtitle: (
      <>
        Authenticate with your passkey wallet to start using{' '}
        <strong className="font-medium">uniswap.org</strong>.
      </>
    ),
    title: 'Get started',
  },
  {
    icon: <LucideScanFace />,
    showCreate: false,
    subtitle: (
      <>
        Authenticate with your passkey wallet to start using{' '}
        <strong className="font-medium">uniswap.org</strong>.
      </>
    ),
    title: 'Sign in',
  },
] as const

const INITIAL_MODE = 'dialog'

function RouteComponent() {
  const [mode, setMode] = useState<'dialog' | 'full'>(INITIAL_MODE)
  const [loading, setLoading] = useState(false)
  const [screen, setScreen] = useState(0)

  const loadingDelay = useRef(0)

  useEffect(() => {
    if (!loading) return

    const timeout = setTimeout(() => setLoading(false), loadingDelay.current)
    return () => clearTimeout(timeout)
  }, [loading])

  const app = (
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
      <Screen loading={loading} name={`screen-${screen}`}>
        <DemoScreen
          demo={DEMOS[screen % DEMOS.length] as (typeof DEMOS)[number]}
        />
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
        <Button
          onClick={() => {
            setScreen((s) => s + 1)
            setLoading(true)
          }}
          size="small"
        >
          Next screen
        </Button>
        <label className="flex items-center gap-1">
          Delay:
          <select
            className="h-[28px] rounded-th_small border border-th_field bg-th_field px-1"
            defaultValue={loadingDelay.current}
          >
            {[0, 50, 150, 500].map((delay) => (
              <option
                key={delay}
                onClick={() => {
                  loadingDelay.current = delay
                }}
                value={delay}
              >
                {delay}ms
              </option>
            ))}
          </select>
        </label>
      </div>
      {mode === 'dialog' ? (
        <div className={'flex w-[360px]'}>{app}</div>
      ) : (
        <DemoBrowser>
          <div className="flex w-full flex-col">{app}</div>
        </DemoBrowser>
      )}
    </ComponentScreen>
  )
}

function DemoScreen({ demo }: { demo: (typeof DEMOS)[number] }) {
  const [email, setEmail] = useState('')
  const emailFilled = Boolean(email.trim())
  return (
    <>
      <Screen.Header
        content={demo.subtitle}
        icon={demo.icon}
        title={demo.title}
      />
      <div>
        <Button
          icon={<LucideScanFace />}
          variant={emailFilled ? 'secondary' : 'primary'}
          wide
        >
          Sign in
        </Button>
        {demo.showCreate && (
          <>
            <Separator label="First time, or lost access?" />
            <Input
              autoComplete="off"
              contextual="Optional"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              value={email}
            />
            <Spacer.V size={{ dialog: 8, full: 12 }} />
            <Button variant={emailFilled ? 'primary' : 'secondary'} wide>
              Create account
            </Button>
          </>
        )}
      </div>
    </>
  )
}
