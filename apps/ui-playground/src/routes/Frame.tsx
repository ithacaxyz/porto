import { Button, Frame, Input, Screen, Separator, Spacer } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useColorScheme } from '~/ColorScheme.js'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen.js'
import { DemoBrowser } from '~/components/DemoBrowser/DemoBrowser.js'
import LucideArrowDownLeft from '~icons/lucide/arrow-down-left'
import LucideArrowUpRight from '~icons/lucide/arrow-up-right'
import LucideChevronDown from '~icons/lucide/chevron-down'
import LucideLogIn from '~icons/lucide/log-in'
import LucideScanFace from '~icons/lucide/scan-face'
import PhStarFourBold from '~icons/ph/star-four-bold'

export const Route = createFileRoute('/Frame')({
  component: RouteComponent,
})

function GetStartedDemo() {
  const [email, setEmail] = useState('')
  const emailFilled = Boolean(email.trim())

  return (
    <Screen compactPadding>
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
        <Button
          icon={<LucideScanFace />}
          variant={emailFilled ? 'secondary' : 'primary'}
          width="full"
        >
          Sign in
        </Button>
        <Separator label="First time, or lost access?" />
        <Input
          adornments={{
            end: 'Optional',
          }}
          autoComplete="off"
          onChange={setEmail}
          placeholder="Email address"
          value={email}
        />
        <Spacer.V size={{ dialog: 8, full: 12 }} />
        <Button variant={emailFilled ? 'primary' : 'secondary'} width="full">
          Create account
        </Button>
      </div>
    </Screen>
  )
}

function SignInDemo() {
  return (
    <Screen compactPadding>
      <Screen.Header
        content={
          <>
            Authenticate with your passkey wallet to start using{' '}
            <strong className="font-medium">uniswap.org</strong>.
          </>
        }
        icon={<LucideScanFace />}
        title="Sign in"
      />
      <div>
        <Button icon={<LucideScanFace />} variant="primary" width="full">
          Sign in
        </Button>
      </div>
    </Screen>
  )
}

function ActionRequestDemo() {
  const [viewDetails, setViewDetails] = useState(false)

  return (
    <Screen compactPadding>
      <Screen.Header icon={<PhStarFourBold />} title="Review action" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--background-color-th_frame-alt)',
            borderRadius: 'var(--border-radius-th_medium)',
            padding: 12,
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  fontWeight: 500,
                  gap: 8,
                }}
              >
                <div
                  style={{
                    alignItems: 'center',
                    backgroundColor: 'var(--background-color-th_badge)',
                    borderRadius: '50%',
                    display: 'flex',
                    height: 24,
                    justifyContent: 'center',
                    width: 24,
                  }}
                >
                  <LucideArrowUpRight
                    style={{
                      color: 'var(--text-color-th_badge)',
                      height: 16,
                      width: 16,
                    }}
                  />
                </div>
                <span>
                  Send{' '}
                  <span
                    style={{
                      color: 'var(--text-color-th_base-secondary)',
                    }}
                  >
                    0.05
                  </span>{' '}
                  ETH
                </span>
              </div>

              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  fontWeight: 500,
                  gap: 8,
                }}
              >
                <div
                  style={{
                    alignItems: 'center',
                    backgroundColor:
                      'var(--background-color-th_badge-positive)',
                    borderRadius: '50%',
                    display: 'flex',
                    height: 24,
                    justifyContent: 'center',
                    width: 24,
                  }}
                >
                  <LucideArrowDownLeft
                    style={{
                      color: 'var(--text-color-th_badge-positive)',
                      height: 16,
                      width: 16,
                    }}
                  />
                </div>
                <span>
                  Receive{' '}
                  <span
                    style={{
                      color: 'var(--text-color-th_base-positive)',
                    }}
                  >
                    125.50
                  </span>{' '}
                  USDC
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--background-color-th_separator)',
                height: 1,
              }}
            />

            {viewDetails ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: 14,
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--text-color-th_base-secondary)',
                    }}
                  >
                    Fees (est.)
                  </span>
                  <span style={{ fontWeight: 500 }}>$2.50</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: 14,
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--text-color-th_base-secondary)',
                    }}
                  >
                    Duration (est.)
                  </span>
                  <span style={{ fontWeight: 500 }}>2 seconds</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: 14,
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--text-color-th_base-secondary)',
                    }}
                  >
                    Network
                  </span>
                  <span style={{ fontWeight: 500 }}>Ethereum</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setViewDetails(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-color-th_base-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  fontSize: 13,
                  justifyContent: 'space-between',
                  padding: 0,
                  width: '100%',
                }}
                type="button"
              >
                <span>More details</span>
                <LucideChevronDown style={{ height: 16, width: 16 }} />
              </button>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            onClick={() => setViewDetails(false)}
            variant="secondary"
            width="grow"
          >
            Cancel
          </Button>
          <Button variant="primary" width="grow">
            Confirm
          </Button>
        </div>
      </div>
    </Screen>
  )
}

const DEMOS = [GetStartedDemo, SignInDemo, ActionRequestDemo] as const

const INITIAL_MODE = 'dialog'

const FRAME_LOADING_DELAY = 0

function RouteComponent() {
  const [mode, setMode] = useState<Frame.ModeName>(INITIAL_MODE)
  const [screen, setScreen] = useState(0)
  const [frameLoading, setFrameLoading] = useState(true)

  // remove frame loading after a delay
  useEffect(() => {
    if (!frameLoading) return
    const timer = setTimeout(() => setFrameLoading(false), FRAME_LOADING_DELAY)
    return () => clearTimeout(timer)
  }, [frameLoading])

  const { colorScheme } = useColorScheme()

  const DemoScreen = DEMOS[screen % DEMOS.length] as (typeof DEMOS)[number]

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
        <Button onClick={() => setFrameLoading(true)} size="small">
          Reload
        </Button>
        <Button
          onClick={() => {
            setScreen((s) => s + 1)
          }}
          size="small"
        >
          Next screen
        </Button>
      </div>
      <DemoContainer mode={mode}>
        <Frame
          colorScheme={colorScheme}
          mode="full"
          screenKey={String(screen)}
          site={{
            label: 'porto.sh',
            labelExtended: (
              <>
                Connected to <span className="text-th_base">porto.sh</span>
              </>
            ),
          }}
        >
          {!frameLoading && <DemoScreen />}
        </Frame>
      </DemoContainer>
    </ComponentScreen>
  )
}

function DemoContainer({
  mode,
  children,
}: {
  mode: Frame.ModeName
  children: ReactNode
}) {
  return mode === 'dialog' ? (
    <div className="flex w-[360px]">{children}</div>
  ) : (
    <DemoBrowser>
      <div className="flex w-full flex-col">{children}</div>
    </DemoBrowser>
  )
}
