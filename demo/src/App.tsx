import * as Ariakit from '@ariakit/react'
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
import { type VariantProps, cva } from 'cva'
import { Hooks as W } from 'porto/wagmi'
import * as React from 'react'
import type { Address } from 'viem'
import { useAccount, useConnectors } from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'
import LucideBoxes from '~icons/lucide/boxes'
import LucidePictureInPicture2 from '~icons/lucide/picture-in-picture-2'
import LucideSendHorizontal from '~icons/lucide/send-horizontal'
import OcticonMarkGithub16 from '~icons/octicon/mark-github-16'

import '@rainbow-me/rainbowkit/styles.css'

import { Wagmi } from '~/config'

export function App() {
  const colorScheme = usePrefersColorScheme()

  const { address } = useAccount()
  const [provider, setProvider] = React.useState<
    'wagmi' | 'privy' | 'rainbowkit'
  >('wagmi')

  return (
    <div className="mx-auto max-w-[1070px] px-4 pt-13">
      <header className="flex items-center justify-between">
        <div>
          <div className="mb-3.5 flex items-center gap-2.5">
            <h1 className="-tracking-[1.064px] order-1 font-medium text-[28px] leading-none">
              Demo
            </h1>
            <PortoLogo />
          </div>

          <p className="max-w-[288px] text-[18px] text-gray10 leading-[24px]">
            Preview how Porto integrates with your existing wallet providers.
          </p>
        </div>

        <div className="flex gap-3">
          <Header.Link href="/" icon={<LucideBoxes />}>
            Playground
          </Header.Link>

          <Header.Link
            href="https://github.com/ithacaxyz/porto"
            icon={<OcticonMarkGithub16 height="18" width="18" />}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </Header.Link>

          <Header.Link
            href="https://ithaca.xyz"
            icon={<IthacaLogo />}
            rel="noreferrer"
            target="_blank"
          >
            Ithaca
          </Header.Link>
        </div>
      </header>

      <div className="mt-8 flex gap-9">
        <div className="flex w-full max-w-[300px] flex-col">
          <div className="mb-6">
            <Step>Install Porto</Step>

            <div className="mt-4 flex flex-col gap-4">
              <div className="-tracking-[0.448px] flex gap-2.5 rounded-lg border border-gray7 bg-gray2 px-3.75 py-3.5 font-medium font-mono text-[16px] text-black leading-[16px] dark:text-white">
                <div className="select-none opacity-30">{'>'}</div>
                <div>npm i porto</div>
              </div>

              <div className="-tracking-[0.448px] flex flex-col gap-2.5 rounded-lg border border-gray7 bg-gray3 px-3.75 py-3.5 font-medium font-mono text-[14px] text-black leading-[17px] dark:text-white">
                <div className="flex gap-2.5 font-mono">
                  <div className="select-none opacity-30">1</div>
                  <div>{`import { Porto } from 'porto'`}</div>
                </div>
                <div className="flex gap-2.5 font-mono">
                  <div className="select-none opacity-30">2</div>
                  <div>
                    Porto.<span className="text-blue9">create()</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Step>Select your provider</Step>

            <Ariakit.RadioProvider>
              <Ariakit.RadioGroup>
                <div className="mt-4 flex flex-col gap-2">
                  <Radio
                    checked={provider === 'wagmi'}
                    value="wagmi"
                    icon={<WagmiLogo />}
                    onChange={setProvider}
                    disabled={Boolean(address)}
                  >
                    Wagmi
                  </Radio>
                  <Radio
                    checked={provider === 'privy'}
                    value="privy"
                    icon={<PrivyLogo />}
                    onChange={setProvider}
                    disabled={Boolean(address)}
                  >
                    Privy
                  </Radio>
                  <Radio
                    checked={provider === 'rainbowkit'}
                    value="rainbowkit"
                    icon={<RainbowLogo />}
                    onChange={setProvider}
                    disabled={Boolean(address)}
                  >
                    RainbowKit
                  </Radio>
                </div>
              </Ariakit.RadioGroup>
            </Ariakit.RadioProvider>

            <div className="-tracking-[0.392px] mt-5 font-medium text-[14px] text-gray9 leading-none">
              Don’t see your provider?{' '}
              <a href="#TODO" className="text-blue9">
                Reach out →
              </a>
            </div>
          </div>

          <div className="mb-6">
            <Step>Start interacting</Step>

            <div {...{ [`data-${provider}`]: '' }} className="mt-4">
              <div className="in-data-wagmi:block hidden">
                <CustomDemo />
              </div>

              <div className="in-data-rainbowkit:block hidden">
                <RainbowKitProvider
                  modalSize="compact"
                  theme={{
                    darkMode: darkTheme({
                      accentColor: 'var(--color-blue9)',
                    }),
                    lightMode: lightTheme({
                      accentColor: 'var(--color-blue9)',
                    }),
                  }}
                >
                  <RainbowKitDemo />
                </RainbowKitProvider>
              </div>

              <div className="in-data-privy:block hidden">
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
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-2xl bg-gray3 px-9 pt-6.5 pb-9">
          <div>
            <Step inset>Your application</Step>
          </div>
          <div>
            <div>Mint</div>
            <div>Swap</div>
            <div>Pay</div>
            <div>Subscribe</div>
            <div>Sponsor</div>
            <div>Onramp</div>
            <div>Send</div>
            <div>Recover</div>
          </div>
        </div>
      </div>

      <footer className="mt-8.5 flex justify-between rounded-[20px] border border-gray4 bg-white p-7.5 dark:bg-black">
        <div className="flex flex-col gap-3">
          <div className="-tracking-[0.392px] text-[14px] text-black opacity-50 dark:text-white">
            Upgrade your wallets
          </div>
          <div className="-tracking-[0.672px] font-medium text-[24px] text-gray12 leading-[23px]">
            Porto is wallet infrastructure <i>done right</i>.
          </div>
          <div className="-tracking-[0.476px] max-w-[526px] text-[17px] text-gray10 leading-[23px]">
            Seamlessly integrate onboarding, authentication, payments, and
            recovery into your product, with no app or extension required.
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <Button variant="accent">Integrate now</Button>
            <Button>Reach out</Button>
          </div>
          <form className="flex rounded-full border border-gray5 py-1.25 ps-3.25 pe-1.5">
            <input placeholder="Get email updates..." />
            <button
              title="submit"
              type="submit"
              className="flex size-[30px] items-center justify-center rounded-full bg-gray5"
            >
              <LucideSendHorizontal />
            </button>
          </form>
        </div>
      </footer>
    </div>
  )
}

function SignedIn(props: SignedIn.Props) {
  const { address, icon, onDisconnect } = props
  const disconnect = W.useDisconnect({
    mutation: {
      onSuccess() {
        onDisconnect?.()
      },
    },
  })
  return (
    <div className="flex gap-2">
      <div className="-tracking-[0.448px] flex h-9.5 flex-grow items-center justify-center gap-1.25 rounded-full bg-gray4 px-2.75 font-medium text-[16px] text-gray12 leading-none">
        <div className="flex size-6 items-center justify-center">{icon}</div>
        <div>{StringFormatter.truncate(address, { start: 6, end: 4 })}</div>
      </div>
      <Button variant="destructive" onClick={() => disconnect.mutate({})}>
        Sign out
      </Button>
    </div>
  )
}
declare namespace SignedIn {
  type Props = {
    address: Address
    icon: React.ReactElement
    onDisconnect?: (() => void) | undefined
  }
}

function CustomDemo() {
  const account = useAccount()

  const connect = W.useConnect()
  const [connector] = useConnectors()

  if (account.status === 'connected')
    return (
      <SignedIn
        icon={
          <div className="flex size-6 items-center justify-center rounded-full bg-blueA3 text-center">
            🌀
          </div>
        }
        address={account.address}
      />
    )

  if (connect.isPending)
    return (
      <div className="flex">
        <div className="-tracking-[0.448px] flex h-9.5 flex-grow items-center justify-center gap-1.25 rounded-full bg-gray4 px-2.75 font-medium text-[16px] text-gray9 leading-none">
          <LucidePictureInPicture2 className="mt-px size-5" />
          <span>Check passkey prompt</span>
        </div>
      </div>
    )

  return (
    <div className="flex gap-2">
      <Button
        onClick={() =>
          connect.mutateAsync({
            connector: connector!,
            createAccount: true,
          })
        }
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

  if (account.status === 'connected')
    return (
      <SignedIn
        icon={
          <div className="size-5">
            <RainbowLogo />
          </div>
        }
        address={account.address}
        onDisconnect={() => {
          openConnectModal?.()
        }}
      />
    )

  return <ConnectButton />
}

function PrivyDemo() {
  const account = useAccount()

  const privy = usePrivy()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    privy.connectWallet()
  }, [])

  if (account.status === 'connected')
    return (
      <SignedIn
        icon={
          <div className="size-5">
            <PrivyLogo />
          </div>
        }
        address={account.address}
        onDisconnect={async () => {
          privy.connectWallet()
        }}
      />
    )

  return (
    <div className="overflow-hidden rounded-xl">
      <LoginModal open />
    </div>
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
          default: 'h-9.5 px-5 -tracking-[0.448px] text-[16px] font-medium',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    },
  )
}

namespace Header {
  export function Link(props: Link.Props) {
    const { children, icon, ...rest } = props
    return (
      <a
        className="-tracking-[0.448px] flex items-center gap-2 rounded-full border border-gray5 p-2.5 font-medium text-[16px] text-gray10 leading-none hover:bg-white hover:text-gray12 dark:hover:bg-black"
        {...rest}
      >
        {icon}
        <span>{children}</span>
      </a>
    )
  }
  declare namespace Link {
    type Props = React.PropsWithChildren<
      React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        icon: React.ReactElement
      }
    >
  }
}

function Radio(props: Radio.Props) {
  const { children, icon, onChange, ...rest } = props
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
    <label
      {...(rest.checked ? { 'data-checked': true } : {})}
      {...(rest.disabled ? { 'data-disabled': true } : {})}
      className="-tracking-[0.448px] flex w-full items-center gap-2 rounded-full border border-gray5 p-2.5 font-medium text-[16px] text-gray12 leading-none not-data-disabled:hover:bg-white data-disabled:cursor-not-allowed data-checked:border-blue9 data-checked:bg-blue3 dark:not-data-disabled:not-data-checked:hover:bg-gray3"
    >
      <Ariakit.VisuallyHidden>
        <Ariakit.Radio {...rest} onChange={() => onChange(props.value)} />
      </Ariakit.VisuallyHidden>
      <div className="w-5">{icon}</div>
      <span>{children}</span>
    </label>
  )
}
declare namespace Radio {
  type Props = React.PropsWithChildren<
    Omit<Ariakit.RadioProps, 'onChange'> & {
      icon: React.ReactElement
      onChange: (value: Radio.Props['value']) => void
      value: 'wagmi' | 'privy' | 'rainbowkit'
    }
  >
}

function Step(props: Step.Props) {
  const { children, inset } = props
  return (
    <h3
      data-inset={inset}
      className="-tracking-[0.364px] w-fit! rounded-full bg-gray4 px-2.5 py-1.5 font-medium text-[13px] text-black leading-[16px] opacity-50 data-[inset=true]:bg-gray5 dark:text-white"
    >
      {children}
    </h3>
  )
}
declare namespace Step {
  type Props = React.PropsWithChildren<{ inset?: boolean | undefined }>
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

function IthacaLogo() {
  return (
    <svg
      width="18"
      height="15"
      viewBox="0 0 18 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g id="Group 16">
        <g id="Group 15">
          <g id="Group 17">
            <path
              id="Polygon 2"
              d="M12.9701 7.83998C13.4861 7.68552 14.0404 7.90491 14.3125 8.3713L17.3217 13.5277C17.7022 14.1796 17.2339 15 16.4814 15H0.975701C0.184951 15 -0.27622 14.1039 0.181269 13.4563L1.54976 11.5192C1.70083 11.3054 1.91887 11.1485 2.16911 11.0736L12.9701 7.83998Z"
              fill="#838383"
            />
            <path
              id="Polygon 4"
              opacity="0.75"
              d="M7.39886 0.567929C7.62104 0.170425 8.2163 0.267457 8.30182 0.715119L9.57243 7.36609C9.63803 7.70948 9.43534 8.04732 9.10234 8.14963L3.09107 9.99645C2.67102 10.1255 2.30891 9.67422 2.52389 9.28959L7.39886 0.567929Z"
              fill="#838383"
            />
            <path
              id="Polygon 3"
              opacity="0.5"
              d="M8.93536 0.350186C8.87289 0.0254684 9.39275 -0.138672 9.55784 0.147511L13.2097 6.5596C13.3055 6.72571 13.2193 6.93793 13.0351 6.98931L10.8237 7.60606C10.5497 7.68247 10.3129 7.51951 10.259 7.23921L8.93536 0.350186Z"
              fill="#838383"
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

function PortoLogo() {
  return (
    <svg
      width="40"
      height="33"
      viewBox="0 0 40 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.15315 14.9144C1.15315 14.1183 1.79851 13.473 2.59459 13.473H37.1892C37.9853 13.473 38.6306 14.1183 38.6306 14.9144V29.9054C38.6306 30.7015 37.9853 31.3468 37.1892 31.3468H2.5946C1.79851 31.3468 1.15315 30.7015 1.15315 29.9054V14.9144Z"
        fill="black"
        fillOpacity="0.2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.59459 12.3198H37.1892C38.6221 12.3198 39.7838 13.4815 39.7838 14.9144V29.9054C39.7838 31.3384 38.6221 32.5 37.1892 32.5H2.5946C1.16164 32.5 0 31.3384 0 29.9054V14.9144C0 13.4815 1.16164 12.3198 2.59459 12.3198ZM2.59459 13.473C1.79851 13.473 1.15315 14.1183 1.15315 14.9144V29.9054C1.15315 30.7015 1.79851 31.3468 2.5946 31.3468H37.1892C37.9853 31.3468 38.6306 30.7015 38.6306 29.9054V14.9144C38.6306 14.1183 37.9853 13.473 37.1892 13.473H2.59459Z"
        fill="white"
      />
      <path
        d="M1.15315 20.9685C1.15315 20.1724 1.79851 19.527 2.59459 19.527H37.1892C37.9853 19.527 38.6306 20.1724 38.6306 20.9685V29.9054C38.6306 30.7015 37.9853 31.3468 37.1892 31.3468H2.5946C1.79851 31.3468 1.15315 30.7015 1.15315 29.9054V20.9685Z"
        fill="black"
        fillOpacity="0.4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.59459 18.3739H37.1892C38.6221 18.3739 39.7838 19.5355 39.7838 20.9685V29.9054C39.7838 31.3384 38.6221 32.5 37.1892 32.5H2.5946C1.16164 32.5 0 31.3384 0 29.9054V20.9685C0 19.5355 1.16164 18.3739 2.59459 18.3739ZM2.59459 19.527C1.79851 19.527 1.15315 20.1724 1.15315 20.9685V29.9054C1.15315 30.7015 1.79851 31.3468 2.5946 31.3468H37.1892C37.9853 31.3468 38.6306 30.7015 38.6306 29.9054V20.9685C38.6306 20.1724 37.9853 19.527 37.1892 19.527H2.59459Z"
        fill="white"
      />
      <path
        d="M1.15315 27.0225C1.15315 26.2264 1.79851 25.5811 2.59459 25.5811H37.1892C37.9853 25.5811 38.6306 26.2264 38.6306 27.0225V29.9054C38.6306 30.7015 37.9853 31.3469 37.1892 31.3469H2.5946C1.79851 31.3469 1.15315 30.7015 1.15315 29.9054V27.0225Z"
        fill="black"
        fillOpacity="0.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.59459 24.4279H37.1892C38.6221 24.4279 39.7838 25.5896 39.7838 27.0225V29.9054C39.7838 31.3384 38.6221 32.5 37.1892 32.5H2.5946C1.16164 32.5 0 31.3384 0 29.9054V27.0225C0 25.5896 1.16164 24.4279 2.59459 24.4279ZM2.59459 25.5811C1.79851 25.5811 1.15315 26.2264 1.15315 27.0225V29.9054C1.15315 30.7015 1.79851 31.3469 2.5946 31.3469H37.1892C37.9853 31.3469 38.6306 30.7015 38.6306 29.9054V27.0225C38.6306 26.2264 37.9853 25.5811 37.1892 25.5811H2.59459Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.74792 0.5C2.31496 0.5 1.15332 1.66164 1.15332 3.0946V29.9054C1.15332 30.7015 1.79868 31.3468 2.59476 31.3468H37.1894C37.9854 31.3468 38.6308 30.7015 38.6308 29.9054V3.09459C38.6308 1.66164 37.4692 0.5 36.0362 0.5H3.74792ZM32.1444 3.09459C30.1542 3.09459 28.5408 4.70798 28.5408 6.6982C28.5408 8.68841 30.1542 10.3018 32.1444 10.3018H32.4327C34.4229 10.3018 36.0363 8.68841 36.0363 6.6982C36.0363 4.70798 34.4229 3.09459 32.4327 3.09459H32.1444Z"
        fill="black"
        fillOpacity="0.2"
      />
    </svg>
  )
}

function WagmiLogo() {
  return (
    <svg
      width="100%"
      height="auto"
      viewBox="0 0 24 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-[#1B1B1B] dark:text-white"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.67052 6.6763C2.67052 7.41374 3.26834 8.01156 4.00578 8.01156H6.6763C7.41374 8.01156 8.01156 7.41374 8.01156 6.6763L8.01156 1.33526C8.01156 0.597817 8.60938 0 9.34682 0C10.0843 0 10.6821 0.597816 10.6821 1.33526V6.6763C10.6821 7.41374 11.2799 8.01156 12.0173 8.01156H14.6879C15.4253 8.01156 16.0231 7.41374 16.0231 6.6763V1.33526C16.0231 0.597816 16.6209 0 17.3584 0C18.0958 0 18.6936 0.597817 18.6936 1.33526V9.34682C18.6936 10.0843 18.0958 10.6821 17.3584 10.6821H1.33526C0.597816 10.6821 0 10.0843 0 9.34682L4.76837e-07 1.33526C5.21541e-07 0.597817 0.597817 0 1.33526 0C2.0727 0 2.67052 0.597816 2.67052 1.33526L2.67052 6.6763ZM21.6185 11C22.6018 11 23.3988 10.2029 23.3988 9.21965C23.3988 8.23639 22.6018 7.43931 21.6185 7.43931C20.6352 7.43931 19.8382 8.23639 19.8382 9.21965C19.8382 10.2029 20.6352 11 21.6185 11Z"
        fill="currentColor"
      />
    </svg>
  )
}

function PrivyLogo() {
  return (
    <svg
      width="100%"
      height="auto"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-[#010110] dark:text-white"
    >
      <path
        d="M11 15.4955C15.4176 15.4955 19 12.0261 19 7.74775C19 3.46944 15.4176 0 11 0C6.58239 0 3 3.46944 3 7.74775C3 12.0261 6.58239 15.4955 11 15.4955Z"
        fill="currentColor"
      />
      <path
        d="M11 20C14.0192 20 16.4672 19.501 16.4672 18.889C16.4672 18.2769 14.0208 17.7779 11 17.7779C7.97919 17.7779 5.53279 18.2769 5.53279 18.889C5.53279 19.501 7.97919 20 11 20Z"
        fill="currentColor"
      />
    </svg>
  )
}

function RainbowLogo() {
  return (
    <svg
      className="rounded-sm"
      width="100%"
      height="auto"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M120 0H0V120H120V0Z" fill="url(#paint0_linear_681_14)" />
      <path
        d="M20 38H26C56.9279 38 82 63.0721 82 94V100H94C97.3137 100 100 97.3137 100 94C100 53.1309 66.8691 20 26 20C22.6863 20 20 22.6863 20 26V38Z"
        fill="url(#paint1_radial_681_14)"
      />
      <path
        d="M84 94H100C100 97.3137 97.3137 100 94 100H84V94Z"
        fill="url(#paint2_linear_681_14)"
      />
      <path
        d="M26 20V36H20V26C20 22.6863 22.6863 20 26 20Z"
        fill="url(#paint3_linear_681_14)"
      />
      <path
        d="M20 36H26C58.0325 36 84 61.9675 84 94V100H66V94C66 71.9086 48.0914 54 26 54H20V36Z"
        fill="url(#paint4_radial_681_14)"
      />
      <path d="M68 94H84V100H68V94Z" fill="url(#paint5_linear_681_14)" />
      <path d="M20 52V36H26V52H20Z" fill="url(#paint6_linear_681_14)" />
      <path
        d="M20 62C20 65.3137 22.6863 68 26 68C40.3594 68 52 79.6406 52 94C52 97.3137 54.6863 100 58 100H68V94C68 70.804 49.196 52 26 52H20V62Z"
        fill="url(#paint7_radial_681_14)"
      />
      <path
        d="M52 94H68V100H58C54.6863 100 52 97.3137 52 94Z"
        fill="url(#paint8_radial_681_14)"
      />
      <path
        d="M26 68C22.6863 68 20 65.3137 20 62V52H26V68Z"
        fill="url(#paint9_radial_681_14)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_681_14"
          x1="60"
          y1="0"
          x2="60"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#174299" />
          <stop offset="1" stop-color="#001E59" />
        </linearGradient>
        <radialGradient
          id="paint1_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 94) rotate(-90) scale(74)"
        >
          <stop offset="0.770277" stop-color="#FF4000" />
          <stop offset="1" stop-color="#8754C9" />
        </radialGradient>
        <linearGradient
          id="paint2_linear_681_14"
          x1="83"
          y1="97"
          x2="100"
          y2="97"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF4000" />
          <stop offset="1" stop-color="#8754C9" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_681_14"
          x1="23"
          y1="20"
          x2="23"
          y2="37"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#8754C9" />
          <stop offset="1" stop-color="#FF4000" />
        </linearGradient>
        <radialGradient
          id="paint4_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 94) rotate(-90) scale(58)"
        >
          <stop offset="0.723929" stop-color="#FFF700" />
          <stop offset="1" stop-color="#FF9901" />
        </radialGradient>
        <linearGradient
          id="paint5_linear_681_14"
          x1="68"
          y1="97"
          x2="84"
          y2="97"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FFF700" />
          <stop offset="1" stop-color="#FF9901" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_681_14"
          x1="23"
          y1="52"
          x2="23"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FFF700" />
          <stop offset="1" stop-color="#FF9901" />
        </linearGradient>
        <radialGradient
          id="paint7_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 94) rotate(-90) scale(42)"
        >
          <stop offset="0.59513" stop-color="#00AAFF" />
          <stop offset="1" stop-color="#01DA40" />
        </radialGradient>
        <radialGradient
          id="paint8_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(51 97) scale(17 45.3333)"
        >
          <stop stop-color="#00AAFF" />
          <stop offset="1" stop-color="#01DA40" />
        </radialGradient>
        <radialGradient
          id="paint9_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(23 69) rotate(-90) scale(17 322.37)"
        >
          <stop stop-color="#00AAFF" />
          <stop offset="1" stop-color="#01DA40" />
        </radialGradient>
      </defs>
    </svg>
  )
}
