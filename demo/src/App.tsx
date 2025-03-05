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
import LucideBook from '~icons/lucide/book'
import LucideInfo from '~icons/lucide/info'
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
    <div className="mx-auto max-w-[1070px] px-4 pt-13 pb-4">
      <header className="flex flex-col items-center justify-between gap-4 lg:flex-row">
        <div>
          <div className="mb-3.5 flex items-center justify-center gap-2.5 lg:justify-start">
            <h1 className="-tracking-[1.064px] order-1 font-medium text-[28px] leading-none">
              Demo
            </h1>
            <PortoLogo />
          </div>

          <p className="max-w-[288px] text-center text-[18px] text-gray10 leading-[24px] lg:text-left">
            Preview how Porto integrates with your existing wallet providers.
          </p>
        </div>

        <div className="flex gap-3">
          <Header.Link
            rel="noreferrer"
            target="_blank"
            href="https://porto.sh"
            icon={<LucideBook />}
          >
            Docs
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

      <div className="mt-8 flex flex-col gap-9 lg:flex-row">
        <div className="flex w-full flex-col lg:max-w-[300px]">
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

        <div className="h-fit flex-1 rounded-2xl bg-gray3 px-9 pt-6.5 pb-9">
          <div className="flex justify-between">
            <Step inset>Your application</Step>
            <div className="flex gap-1">
              <div className="-tracking-[0.392px] flex gap-1.25 rounded-full bg-gray1 px-2.5 py-1.5 font-medium text-[14px] leading-[17px]">
                <span className="opacity-30">Balance</span>
                <span>
                  <span className="text-black dark:text-white">100</span>{' '}
                  <span className="text-gray11">EXP</span>
                </span>
              </div>
              <button
                className="-tracking-[0.25px] flex gap-1.25 rounded-full bg-accent px-2.5 py-1.5 font-medium text-[14px] text-white leading-[17px] hover:not-active:bg-accentHover"
                type="button"
              >
                Mint
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Card title="Mint" description="Foo bar baz">
              <div className="mt-2 h-24 bg-gray3" />
            </Card>
            <Card title="Swap" description="Foo bar baz">
              <div className="mt-2 h-24 bg-gray3" />
            </Card>
            <Card title="Pay" description="Foo bar baz">
              <div className="mt-2 h-24 bg-gray3" />
            </Card>
            <Card title="Subscribe" description="Foo bar baz">
              <div className="mt-2 h-24 bg-gray3" />
            </Card>
            <Card title="Sponsor" comingSoon />
            <Card title="Onramp" comingSoon />
            <Card title="Send" comingSoon />
            <Card title="Recover" comingSoon />
          </div>
        </div>
      </div>

      <footer className="mt-8.5 flex flex-col justify-between gap-4 rounded-[20px] border border-gray4 bg-white p-7.5 lg:flex-row dark:bg-black">
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

        <div className="flex flex-col gap-3 lg:max-w-[261px]">
          <div className="flex gap-3">
            <Button className="flex-1" variant="accent">
              Integrate now
            </Button>
            <Button className="flex-1">Reach out</Button>
          </div>
          <form className="flex items-center rounded-full border border-gray5 pe-1.5">
            <input
              className="-tracking-[0.448px] h-10 w-full flex-1 py-1.25 ps-3.25 pe-1.5 font-medium outline-none placeholder:text-gray8"
              placeholder="Get email updates..."
            />
            <button
              title="submit"
              type="submit"
              className="flex size-[30px] min-w-[30px] items-center justify-center rounded-full bg-gray5"
            >
              <LucideSendHorizontal className="size-[14px] text-gray9" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  )
}

function Card(props: Card.Props) {
  const { children, comingSoon, description, title } = props
  if (comingSoon)
    return (
      <div className="w-full rounded-xl bg-gray1 py-4.5 ps-5 pe-4">
        <div className="flex items-center justify-between">
          <div className="-tracking-[0.448px] font-medium text-[16px] opacity-30">
            {title}
          </div>
          <div className="-tracking-[0.364px] w-fit! rounded-full bg-gray3 px-2.5 py-1.5 font-medium text-[13px] text-black leading-[16px] dark:text-white">
            Coming soon
          </div>
        </div>
      </div>
    )

  return (
    <div className="h-fit w-full rounded-xl bg-gray1 px-5 pt-3.5 pb-5">
      <div className="flex items-center justify-between">
        <div className="-tracking-[0.448px] font-medium text-[16px] opacity-30">
          {title}
        </div>
        {description && (
          <Ariakit.TooltipProvider>
            <Ariakit.TooltipAnchor className="flex size-7.5 items-center justify-center rounded-full border border-gray4">
              <LucideInfo className="size-4.5 text-gray9" />
            </Ariakit.TooltipAnchor>
            <Ariakit.Tooltip className="tooltip">{description}</Ariakit.Tooltip>
          </Ariakit.TooltipProvider>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}
declare namespace Card {
  type Props = React.PropsWithChildren<{
    comingSoon?: boolean | undefined
    description?: string | undefined
    title: string
  }>
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
      className="-tracking-[0.448px] flex w-full items-center gap-2 rounded-full border border-gray5 p-2.5 font-medium text-[16px] text-gray12 leading-none not-data-checked:not-data-disabled:hover:bg-white data-disabled:cursor-not-allowed data-checked:border-blue9 data-checked:bg-blue3 dark:not-data-disabled:not-data-checked:hover:bg-gray3"
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
    <div className="h-8">
      <svg
        className="dark:hidden"
        aria-hidden="true"
        width="auto"
        height="100%"
        viewBox="0 0 95 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.5676 0.959473C2.9404 0.959473 0 3.89987 0 7.52697V75.3919C0 77.407 1.6336 79.041 3.6487 79.041H91.216C93.231 79.041 94.865 77.407 94.865 75.3919V7.52697C94.865 3.89987 91.924 0.959473 88.297 0.959473H6.5676ZM78.4461 7.52697C73.4084 7.52697 69.3245 11.6109 69.3245 16.6487C69.3245 21.6864 73.4084 25.7703 78.4461 25.7703H79.1758C84.2136 25.7703 88.297 21.6864 88.297 16.6487C88.297 11.6109 84.2136 7.52697 79.1758 7.52697H78.4461Z"
          fill="#CCCCCC"
        />
        <mask
          id="mask0_684_30"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="95"
          height="80"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.5676 0.959473C2.9404 0.959473 0 3.89987 0 7.52697V75.3919C0 77.407 1.6336 79.041 3.6487 79.041H91.216C93.231 79.041 94.865 77.407 94.865 75.3919V7.52697C94.865 3.89987 91.924 0.959473 88.297 0.959473H6.5676ZM78.4461 7.52697C73.4084 7.52697 69.3245 11.6109 69.3245 16.6487C69.3245 21.6864 73.4084 25.7703 78.4461 25.7703H79.1758C84.2136 25.7703 88.297 21.6864 88.297 16.6487C88.297 11.6109 84.2136 7.52697 79.1758 7.52697H78.4461Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_684_30)">
          <path
            d="M0.000213623 37.446C0.000213623 35.431 1.63371 33.7974 3.64881 33.7974H91.216C93.231 33.7974 94.865 35.431 94.865 37.446V75.392C94.865 77.4071 93.231 79.0411 91.216 79.0411H3.64881C1.63371 79.0411 0.000213623 77.4071 0.000213623 75.392V37.446Z"
            fill="#A3A3A3"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.6488 30.8784H91.216C94.844 30.8784 97.784 33.8188 97.784 37.4459V75.3919C97.784 79.019 94.844 81.959 91.216 81.959H3.6488C0.021699 81.959 -2.9187 79.019 -2.9187 75.3919V37.4459C-2.9187 33.8188 0.021699 30.8784 3.6488 30.8784ZM3.6488 33.7973C1.6337 33.7973 0.000199318 35.4309 0.000199318 37.4459V75.3919C0.000199318 77.407 1.6337 79.041 3.6488 79.041H91.216C93.231 79.041 94.865 77.407 94.865 75.3919V37.4459C94.865 35.4309 93.231 33.7973 91.216 33.7973H3.6488Z"
            fill="#CCCCCC"
          />
          <path
            d="M0.000213623 52.7703C0.000213623 50.7552 1.63371 49.1216 3.64881 49.1216H91.216C93.231 49.1216 94.865 50.7552 94.865 52.7703V75.3919C94.865 77.407 93.231 79.041 91.216 79.041H3.64881C1.63371 79.041 0.000213623 77.407 0.000213623 75.3919V52.7703Z"
            fill="#626262"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.6488 46.2026H91.216C94.844 46.2026 97.784 49.143 97.784 52.7702V75.3918C97.784 79.0189 94.844 81.9589 91.216 81.9589H3.6488C0.021699 81.9589 -2.9187 79.0189 -2.9187 75.3918V52.7702C-2.9187 49.143 0.021699 46.2026 3.6488 46.2026ZM3.6488 49.1215C1.6337 49.1215 0.000199318 50.7551 0.000199318 52.7702V75.3918C0.000199318 77.4069 1.6337 79.0409 3.6488 79.0409H91.216C93.231 79.0409 94.865 77.4069 94.865 75.3918V52.7702C94.865 50.7551 93.231 49.1215 91.216 49.1215H3.6488Z"
            fill="#CCCCCC"
          />
          <path
            d="M0.000213623 68.0945C0.000213623 66.0794 1.63371 64.4458 3.64881 64.4458H91.216C93.231 64.4458 94.865 66.0794 94.865 68.0945V75.3918C94.865 77.4069 93.231 79.0409 91.216 79.0409H3.64881C1.63371 79.0409 0.000213623 77.4069 0.000213623 75.3918V68.0945Z"
            fill="#313131"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.6488 61.5271H91.216C94.844 61.5271 97.784 64.4675 97.784 68.0947V75.392C97.784 79.0191 94.844 81.9591 91.216 81.9591H3.6488C0.021699 81.9591 -2.9187 79.0191 -2.9187 75.392V68.0947C-2.9187 64.4675 0.021699 61.5271 3.6488 61.5271ZM3.6488 64.446C1.6337 64.446 0.000199318 66.0796 0.000199318 68.0947V75.392C0.000199318 77.4071 1.6337 79.0411 3.6488 79.0411H91.216C93.231 79.0411 94.865 77.4071 94.865 75.392V68.0947C94.865 66.0796 93.231 64.446 91.216 64.446H3.6488Z"
            fill="#CCCCCC"
          />
        </g>
      </svg>

      <svg
        className="hidden dark:block"
        aria-hidden="true"
        width="auto"
        height="100%"
        viewBox="0 0 95 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.5676 0.959473C2.9404 0.959473 0 3.89987 0 7.52697V75.3919C0 77.407 1.6336 79.041 3.6487 79.041H91.216C93.231 79.041 94.865 77.407 94.865 75.3919V7.52697C94.865 3.89987 91.924 0.959473 88.297 0.959473H6.5676ZM78.4461 7.52697C73.4084 7.52697 69.3245 11.6109 69.3245 16.6487C69.3245 21.6864 73.4084 25.7703 78.4461 25.7703H79.1758C84.214 25.7703 88.297 21.6864 88.297 16.6487C88.297 11.6109 84.214 7.52697 79.1758 7.52697H78.4461Z"
          fill="#999999"
        />
        <mask
          id="mask0_684_45"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="95"
          height="80"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.5676 0.959473C2.9404 0.959473 0 3.89987 0 7.52697V75.3919C0 77.407 1.6336 79.041 3.6487 79.041H91.216C93.231 79.041 94.865 77.407 94.865 75.3919V7.52697C94.865 3.89987 91.924 0.959473 88.297 0.959473H6.5676ZM78.4461 7.52697C73.4084 7.52697 69.3245 11.6109 69.3245 16.6487C69.3245 21.6864 73.4084 25.7703 78.4461 25.7703H79.1758C84.214 25.7703 88.297 21.6864 88.297 16.6487C88.297 11.6109 84.214 7.52697 79.1758 7.52697H78.4461Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_684_45)">
          <path
            d="M0.000213623 37.446C0.000213623 35.431 1.63371 33.7974 3.64881 33.7974H91.216C93.231 33.7974 94.865 35.431 94.865 37.446V75.392C94.865 77.4071 93.231 79.0411 91.216 79.0411H3.64881C1.63371 79.0411 0.000213623 77.4071 0.000213623 75.392V37.446Z"
            fill="#CBCBCB"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.6488 30.8784H91.216C94.844 30.8784 97.784 33.8188 97.784 37.4459V75.3919C97.784 79.019 94.844 81.959 91.216 81.959H3.6488C0.021699 81.959 -2.9187 79.019 -2.9187 75.3919V37.4459C-2.9187 33.8188 0.021699 30.8784 3.6488 30.8784ZM3.6488 33.7973C1.6337 33.7973 0.000199318 35.4309 0.000199318 37.4459V75.3919C0.000199318 77.407 1.6337 79.041 3.6488 79.041H91.216C93.231 79.041 94.865 77.407 94.865 75.3919V37.4459C94.865 35.4309 93.231 33.7973 91.216 33.7973H3.6488Z"
            fill="#999999"
          />
          <path
            d="M0.000213623 52.7703C0.000213623 50.7552 1.63371 49.1216 3.64881 49.1216H91.216C93.231 49.1216 94.865 50.7552 94.865 52.7703V75.3919C94.865 77.407 93.231 79.041 91.216 79.041H3.64881C1.63371 79.041 0.000213623 77.407 0.000213623 75.3919V52.7703Z"
            fill="#DDDDDD"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.6488 46.2026H91.216C94.844 46.2026 97.784 49.143 97.784 52.7702V75.3918C97.784 79.0189 94.844 81.9589 91.216 81.9589H3.6488C0.021699 81.9589 -2.9187 79.0189 -2.9187 75.3918V52.7702C-2.9187 49.143 0.021699 46.2026 3.6488 46.2026ZM3.6488 49.1215C1.6337 49.1215 0.000199318 50.7551 0.000199318 52.7702V75.3918C0.000199318 77.4069 1.6337 79.0409 3.6488 79.0409H91.216C93.231 79.0409 94.865 77.4069 94.865 75.3918V52.7702C94.865 50.7551 93.231 49.1215 91.216 49.1215H3.6488Z"
            fill="#999999"
          />
          <path
            d="M0.000213623 68.0945C0.000213623 66.0794 1.63371 64.4458 3.64881 64.4458H91.216C93.231 64.4458 94.865 66.0794 94.865 68.0945V75.3918C94.865 77.4069 93.231 79.0409 91.216 79.0409H3.64881C1.63371 79.0409 0.000213623 77.4069 0.000213623 75.3918V68.0945Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.6488 61.5271H91.216C94.844 61.5271 97.784 64.4675 97.784 68.0947V75.392C97.784 79.0191 94.844 81.9591 91.216 81.9591H3.6488C0.021699 81.9591 -2.9187 79.0191 -2.9187 75.392V68.0947C-2.9187 64.4675 0.021699 61.5271 3.6488 61.5271ZM3.6488 64.446C1.6337 64.446 0.000199318 66.0796 0.000199318 68.0947V75.392C0.000199318 77.4071 1.6337 79.0411 3.6488 79.0411H91.216C93.231 79.0411 94.865 77.4071 94.865 75.392V68.0947C94.865 66.0796 93.231 64.446 91.216 64.446H3.6488Z"
            fill="#999999"
          />
        </g>
      </svg>
    </div>
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
          <stop stopColor="#174299" />
          <stop offset="1" stopColor="#001E59" />
        </linearGradient>
        <radialGradient
          id="paint1_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 94) rotate(-90) scale(74)"
        >
          <stop offset="0.770277" stopColor="#FF4000" />
          <stop offset="1" stopColor="#8754C9" />
        </radialGradient>
        <linearGradient
          id="paint2_linear_681_14"
          x1="83"
          y1="97"
          x2="100"
          y2="97"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF4000" />
          <stop offset="1" stopColor="#8754C9" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_681_14"
          x1="23"
          y1="20"
          x2="23"
          y2="37"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8754C9" />
          <stop offset="1" stopColor="#FF4000" />
        </linearGradient>
        <radialGradient
          id="paint4_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 94) rotate(-90) scale(58)"
        >
          <stop offset="0.723929" stopColor="#FFF700" />
          <stop offset="1" stopColor="#FF9901" />
        </radialGradient>
        <linearGradient
          id="paint5_linear_681_14"
          x1="68"
          y1="97"
          x2="84"
          y2="97"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF700" />
          <stop offset="1" stopColor="#FF9901" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_681_14"
          x1="23"
          y1="52"
          x2="23"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFF700" />
          <stop offset="1" stopColor="#FF9901" />
        </linearGradient>
        <radialGradient
          id="paint7_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 94) rotate(-90) scale(42)"
        >
          <stop offset="0.59513" stopColor="#00AAFF" />
          <stop offset="1" stopColor="#01DA40" />
        </radialGradient>
        <radialGradient
          id="paint8_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(51 97) scale(17 45.3333)"
        >
          <stop stopColor="#00AAFF" />
          <stop offset="1" stopColor="#01DA40" />
        </radialGradient>
        <radialGradient
          id="paint9_radial_681_14"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(23 69) rotate(-90) scale(17 322.37)"
        >
          <stop stopColor="#00AAFF" />
          <stop offset="1" stopColor="#01DA40" />
        </radialGradient>
      </defs>
    </svg>
  )
}
