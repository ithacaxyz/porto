import { Button, Frame, Input, Screen, Separator, Spacer, css } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useColorScheme } from '~/ColorScheme.js'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen.js'
import { DemoBrowser } from '~/components/DemoBrowser/DemoBrowser.js'
import LucideLogIn from '~icons/lucide/log-in'
import LucideScanFace from '~icons/lucide/scan-face'
import LucideArrowDownLeft from '~icons/lucide/arrow-down-left'
import LucideArrowUpRight from '~icons/lucide/arrow-up-right'
import LucideChevronDown from '~icons/lucide/chevron-down'
import PhStarFourBold from '~icons/ph/star-four-bold'

export const Route = createFileRoute('/Frame')({
  component: RouteComponent,
})

function GetStartedDemo() {
  const [email, setEmail] = useState('')
  const emailFilled = Boolean(email.trim())

  return (
    <Screen screenKey="get-started">
      <Screen.Header
        icon={<LucideLogIn />}
        title="Get started"
        content={
          <>
            Authenticate with your passkey wallet to start using{' '}
            <strong className="font-medium">uniswap.org</strong>.
          </>
        }
      />
      <div>
        <Button
          icon={<LucideScanFace />}
          variant={emailFilled ? 'secondary' : 'primary'}
          wide
        >
          Sign in
        </Button>
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
      </div>
    </Screen>
  )
}

function SignInDemo() {
  return (
    <Screen screenKey="sign-in">
      <Screen.Header
        icon={<LucideScanFace />}
        title="Sign in"
        content={
          <>
            Authenticate with your passkey wallet to start using{' '}
            <strong className="font-medium">uniswap.org</strong>.
          </>
        }
      />
      <div>
        <Button icon={<LucideScanFace />} variant="primary" wide>
          Sign in
        </Button>
      </div>
    </Screen>
  )
}

function ActionRequestDemo() {
  const [viewDetails, setViewDetails] = useState(false)

  return (
    <Screen screenKey="action-request">
      <Screen.Header icon={<PhStarFourBold />} title="Review action" />
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        })}
      >
        <div
          className={css({
            backgroundColor: 'var(--background-color-th_frame-alt)',
            borderRadius: 'var(--border-radius-th_medium)',
            padding: 12,
            transition: 'all 0.3s ease-in-out',
          })}
        >
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            })}
          >
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              })}
            >
              <div
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontWeight: 500,
                })}
              >
                <div
                  className={css({
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'var(--background-color-th_badge)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  <LucideArrowUpRight
                    className={css({
                      width: 16,
                      height: 16,
                      color: 'var(--text-color-th_badge)',
                    })}
                  />
                </div>
                <span>
                  Send{' '}
                  <span
                    className={css({
                      color: 'var(--text-color-th_base-secondary)',
                    })}
                  >
                    0.05
                  </span>{' '}
                  ETH
                </span>
              </div>

              <div
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontWeight: 500,
                })}
              >
                <div
                  className={css({
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor:
                      'var(--background-color-th_badge-positive)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  <LucideArrowDownLeft
                    className={css({
                      width: 16,
                      height: 16,
                      color: 'var(--text-color-th_badge-positive)',
                    })}
                  />
                </div>
                <span>
                  Receive{' '}
                  <span
                    className={css({
                      color: 'var(--text-color-th_base-positive)',
                    })}
                  >
                    125.50
                  </span>{' '}
                  USDC
                </span>
              </div>
            </div>

            <div
              className={css({
                height: 1,
                backgroundColor: 'var(--background-color-th_separator)',
              })}
            />

            {viewDetails ? (
              <div
                className={css({
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                })}
              >
                <div
                  className={css({
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                  })}
                >
                  <span
                    className={css({
                      color: 'var(--text-color-th_base-secondary)',
                    })}
                  >
                    Fees (est.)
                  </span>
                  <span className={css({ fontWeight: 500 })}>$2.50</span>
                </div>
                <div
                  className={css({
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                  })}
                >
                  <span
                    className={css({
                      color: 'var(--text-color-th_base-secondary)',
                    })}
                  >
                    Duration (est.)
                  </span>
                  <span className={css({ fontWeight: 500 })}>2 seconds</span>
                </div>
                <div
                  className={css({
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                  })}
                >
                  <span
                    className={css({
                      color: 'var(--text-color-th_base-secondary)',
                    })}
                  >
                    Network
                  </span>
                  <span className={css({ fontWeight: 500 })}>Ethereum</span>
                </div>
              </div>
            ) : (
              <button
                className={css({
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  color: 'var(--text-color-th_base-secondary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                })}
                onClick={() => setViewDetails(true)}
                type="button"
              >
                <span>More details</span>
                <LucideChevronDown className={css({ width: 16, height: 16 })} />
              </button>
            )}
          </div>
        </div>
        <div className={css({ display: 'flex', gap: 8 })}>
          <Button
            variant="secondary"
            onClick={() => setViewDetails(false)}
            wide
          >
            Cancel
          </Button>
          <Button variant="primary" wide>
            Confirm
          </Button>
        </div>
      </div>
    </Screen>
  )
}

const DEMOS = [GetStartedDemo, SignInDemo, ActionRequestDemo] as const

const INITIAL_MODE = 'dialog'

const FRAME_LOADING_DELAY = 1000

function RouteComponent() {
  const [mode, setMode] = useState<Frame.Mode>(INITIAL_MODE)
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
          screenKey={String(screen)}
          loading={frameLoading}
          colorScheme={colorScheme}
          mode={mode}
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
  mode: Frame.Mode
  children: ReactNode
}) {
  return mode === 'dialog' ? (
    <div className={'flex w-[360px]'}>{children}</div>
  ) : (
    <DemoBrowser>
      <div className="flex w-full flex-col">{children}</div>
    </DemoBrowser>
  )
}
