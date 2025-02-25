import { LoginModal, PrivyProvider, usePrivy } from '@privy-io/react-auth'
import {
  ConnectButton,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  useAccountModal,
  useChainModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit'
import { type VariantProps, cva, cx } from 'cva'
import { Hooks as W } from 'porto/wagmi'
import * as React from 'react'
import { useAccount, useConnectors } from 'wagmi'

import '@rainbow-me/rainbowkit/styles.css'

import { odysseyTestnet } from 'wagmi/chains'
import { Wagmi } from '~/config'

export function App() {
  const account = useAccount()
  const colorScheme = usePrefersColorScheme()
  return (
    <div className="h-full bg-gray1 p-1 pb-0">
      <title>Demo ⋅ Ithaca</title>

      <div className="h-full rounded-t-xl border border-gray4 border-b-0 bg-grayA2">
        <Nav />

        <div className="flex flex-col gap-5 px-5 py-7 md:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            <Card title="Porto + Wagmi">
              <CustomDemo />
            </Card>

            <Card title="Porto + RainbowKit">
              <div className="md:max-w-[368px]">
                <RainbowKitProvider
                  modalSize="compact"
                  theme={{
                    darkMode: darkTheme({ accentColor: 'var(--color-blue9)' }),
                    lightMode: lightTheme({
                      accentColor: 'var(--color-blue9)',
                    }),
                  }}
                >
                  <RainbowKitDemo />
                </RainbowKitProvider>
              </div>
            </Card>

            <Card title="Porto + Privy">
              <div className="md:max-w-[368px]">
                <PrivyProvider
                  appId="cm7jinb1h059lnn9kchlh4jf7"
                  config={{
                    appearance: {
                      accentColor:
                        colorScheme === 'light' ? '#0090ff' : '#0090ff',
                      logo:
                        colorScheme === 'light'
                          ? 'https://auth.privy.io/logos/privy-logo.png'
                          : 'https://auth.privy.io/logos/privy-logo-dark.png',
                      showWalletLoginFirst: false,
                      theme: colorScheme,
                      walletChainType: 'ethereum-only',
                      walletList: ['detected_wallets'],
                    },
                    defaultChain: odysseyTestnet,
                    embeddedWallets: {
                      createOnLogin: 'users-without-wallets',
                      ethereum: {
                        createOnLogin: 'users-without-wallets',
                      },
                      requireUserPasswordOnCreate: false,
                      solana: {
                        createOnLogin: 'off',
                      },
                    },
                    externalWallets: {},
                    fundingMethodConfig: {
                      moonpay: {
                        useSandbox: true,
                      },
                    },
                    loginMethods: ['wallet'],
                    supportedChains: [odysseyTestnet],
                    // @ts-ignore
                    _render: {
                      standalone: true,
                    },
                  }}
                >
                  <PrivyDemo />
                </PrivyProvider>
              </div>
            </Card>
          </div>

          <div className="flex-1">
            <div className="rounded-xl border border-gray4 p-5">
              {account?.address ? (
                StringFormatter.truncate(account.address)
              ) : (
                <div>Sign in to continue</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CustomDemo() {
  const account = useAccount()
  const disconnect = W.useDisconnect()

  const [signUp, setSignUp] = React.useState(false)
  const connect = W.useConnect()
  const [connector] = useConnectors()

  if (account.status === 'connected')
    return <Button onClick={() => disconnect.mutate({})}>Logout</Button>

  if (connect.isPending)
    return (
      <div className="flex min-h-10.5 items-center">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-accentTint p-[6px] text-accent">
            <Spinner />
          </div>

          <div className="font-medium text-[18px] text-primary">
            {signUp ? 'Signing up...' : 'Signing in...'}
          </div>
        </div>
      </div>
    )

  return (
    <div className="space-x-3">
      <Button
        onClick={() => {
          setSignUp(true)
          connect
            .mutateAsync({
              connector: connector!,
              createAccount: true,
            })
            .finally(() => setSignUp(false))
        }}
        className="flex-grow"
        variant="accent"
      >
        Sign up
      </Button>

      <Button
        onClick={() => connect.mutate({ connector: connector! })}
        className="flex-grow"
        variant="invert"
      >
        Sign in
      </Button>
    </div>
  )
}

function RainbowKitDemo() {
  const account = useAccount()

  const { connectModalOpen, openConnectModal } = useConnectModal()
  const { accountModalOpen } = useAccountModal()
  const { chainModalOpen } = useChainModal()

  // Re-open connect modal when disconnected
  const [active, setActive] = React.useState(false)
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    return Wagmi.config.subscribe(
      (state) => state.status,
      (curr, prev) => {
        if (
          openConnectModal &&
          curr === 'disconnected' &&
          prev === 'connected'
        ) {
          setActive(true)
          setTimeout(() => {
            openConnectModal?.()
            setActive(false)
          })
        }
      },
    )
  }, [])

  if (accountModalOpen || chainModalOpen) return null
  if ((connectModalOpen && !account.address) || active) return null

  return <ConnectButton />
}

function PrivyDemo() {
  const account = useAccount()
  const disconnect = W.useDisconnect()

  const privy = usePrivy()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    privy.connectWallet()
  }, [])

  if (account.address)
    return (
      <Button
        onClick={async () => {
          disconnect.mutate({})
          privy.connectWallet()
        }}
      >
        Logout
      </Button>
    )

  return (
    <div className="overflow-hidden rounded-xl">
      <LoginModal open />
    </div>
  )
}

function Nav() {
  return (
    <nav className="sticky flex h-15.5 items-center justify-between border-gray4 border-b px-5">
      <div className="flex gap-2.5">
        <div className="h-6">
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
          <svg
            fill="none"
            height="100%"
            viewBox="0 0 310 270"
            width="auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M230.325 142.852C239.487 140.109 249.33 144.005 254.163 152.287L307.601 243.855C314.357 255.432 306.042 270 292.678 270H17.3266C3.28438 270 -4.90514 254.087 3.21898 242.587L27.5208 208.188C30.2035 204.391 34.0755 201.604 38.5192 200.274L230.325 142.852Z"
              fill="currentColor"
            />
            <path
              opacity="0.75"
              d="M131.398 13.7191C135.343 6.66017 145.914 8.38328 147.433 16.3329L169.996 134.441C171.161 140.539 167.562 146.539 161.648 148.355L54.8997 181.152C47.4404 183.443 41.01 175.429 44.8277 168.599L131.398 13.7191Z"
              fill="currentColor"
            />
            <path
              opacity="0.5"
              d="M158.675 6.21863C157.566 0.45227 165.328 -2.46256 168.26 2.61951L236.048 120.133C237.75 123.083 236.218 126.851 232.947 127.764L193.677 138.716C188.812 140.073 183.829 136.974 182.871 131.997L158.675 6.21863Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="mt-0.5 flex h-fit items-center rounded-full border border-gray7 bg-gray3 px-2 py-1 font-mono text-[11px] text-gray11 leading-none tracking-wide">
          Demo
        </div>
      </div>
    </nav>
  )
}

function Card(props: React.PropsWithChildren<Card.Props>) {
  return (
    <div className="rounded-xl border border-gray4 bg-gray3">
      <div className="border-gray4 border-b px-5 py-3 font-mono text-[1rem] text-gray11 leading-none">
        {props.title}
      </div>

      <div className="rounded-b-xl bg-gray2 p-5">{props.children}</div>
    </div>
  )
}
declare namespace Card {
  type Props = {
    title: string
  }
}

function Button(props: Button.Props) {
  const { className, disabled, size, variant, asChild = false, ...rest } = props
  return (
    <button
      className={Button.className({ className, disabled, size, variant })}
      disabled={disabled ?? false}
      {...rest}
    />
  )
}
namespace Button {
  export const displayName = 'Button'

  export interface Props
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
      VariantProps<typeof className> {
    asChild?: boolean
  }

  export const className = cva(
    'inline-flex items-center justify-center rounded-default whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
      variants: {
        variant: {
          default:
            'text-primary bg-surface hover:not-active:bg-surfaceHover text-surface border border-surface',
          invert:
            'text-invert bg-invert hover:not-active:bg-invertHover text-invert',
          accent: 'text-white bg-accent hover:not-active:bg-accentHover',
          destructive:
            'text-destructive bg-destructive hover:not-active:bg-destructiveHover',
          success: 'text-white bg-success hover:not-active:bg-successHover',
          warning: 'text-white bg-warning hover:not-active:bg-warningHover',
        },
        disabled: {
          true: 'pointer-events-none opacity-50',
        },
        size: {
          default: 'h-button px-5 text-[15px]',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    },
  )
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cx('h-full w-full animate-spin', className)}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 21"
      fill="none"
    >
      <path
        fill="currentColor"
        opacity={0.3}
        d="M10 0.5C8.02219 0.5 6.08879 1.08649 4.4443 2.1853C2.79981 3.28412 1.51809 4.8459 0.761209 6.67316C0.00433288 8.50043 -0.1937 10.5111 0.192152 12.4509C0.578004 14.3907 1.53041 16.1725 2.92894 17.5711C4.32746 18.9696 6.10929 19.922 8.0491 20.3078C9.98891 20.6937 11.9996 20.4957 13.8268 19.7388C15.6541 18.9819 17.2159 17.7002 18.3147 16.0557C19.4135 14.4112 20 12.4778 20 10.5C20 7.84783 18.9464 5.3043 17.0711 3.42893C15.1957 1.55357 12.6522 0.5 10 0.5ZM10 17.7727C8.56159 17.7727 7.15549 17.3462 5.95949 16.547C4.7635 15.7479 3.83134 14.6121 3.28088 13.2831C2.73042 11.9542 2.5864 10.4919 2.86702 9.08116C3.14764 7.67039 3.8403 6.37451 4.85741 5.3574C5.87452 4.3403 7.17039 3.64764 8.58116 3.36702C9.99193 3.0864 11.4542 3.23042 12.7832 3.78088C14.1121 4.33133 15.2479 5.26349 16.0471 6.45949C16.8462 7.65548 17.2727 9.06159 17.2727 10.5C17.2727 12.4288 16.5065 14.2787 15.1426 15.6426C13.7787 17.0065 11.9288 17.7727 10 17.7727Z"
      />
      <path
        fill="currentColor"
        d="M10 3.22767C11.7423 3.22846 13.4276 3.8412 14.7556 4.95667C16.0837 6.07214 16.9681 7.61784 17.2512 9.31825C17.3012 9.64364 17.4662 9.94096 17.7169 10.1573C17.9677 10.3737 18.2878 10.4951 18.6205 10.5C18.8211 10.5001 19.0193 10.457 19.2012 10.3735C19.3832 10.2901 19.5445 10.1684 19.674 10.017C19.8036 9.86549 19.8981 9.68789 19.9511 9.49656C20.004 9.30523 20.0141 9.10478 19.9807 8.90918C19.5986 6.56305 18.3843 4.42821 16.5554 2.88726C14.7265 1.34631 12.4025 0.5 10 0.5C7.59751 0.5 5.27354 1.34631 3.44461 2.88726C1.61569 4.42821 0.401366 6.56305 0.0192815 8.90918C-0.0141442 9.10478 -0.00402016 9.30523 0.0489472 9.49656C0.101914 9.68789 0.196449 9.86549 0.325956 10.017C0.455463 10.1684 0.616823 10.2901 0.798778 10.3735C0.980732 10.457 1.1789 10.5001 1.37945 10.5C1.71216 10.4951 2.03235 10.3737 2.28307 10.1573C2.5338 9.94096 2.69883 9.64364 2.74882 9.31825C3.03193 7.61784 3.91633 6.07214 5.24436 4.95667C6.57239 3.8412 8.25775 3.22846 10 3.22767Z"
      />
    </svg>
  )
}

namespace StringFormatter {
  export function truncate(
    str: string,
    { start = 8, end = 6 }: { start?: number; end?: number } = {},
  ) {
    if (str.length <= start + end) return str
    return `${str.slice(0, start)}\u2026${str.slice(-end)}`
  }
}

function usePrefersColorScheme(): 'light' | 'dark' {
  const getPrefersColorScheme = (): 'light' | 'dark' => {
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches)
      return 'dark'
    return 'light'
  }

  const [colorScheme, setColorScheme] = React.useState<'light' | 'dark'>(
    getPrefersColorScheme,
  )

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (event: MediaQueryListEvent) => {
      setColorScheme(event.matches ? 'dark' : 'light')
    }

    mediaQueryList.addEventListener('change', handleChange)

    return () => {
      mediaQueryList.removeEventListener('change', handleChange)
    }
  }, [])

  return colorScheme
}
