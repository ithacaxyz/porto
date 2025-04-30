import * as Ariakit from '@ariakit/react'
import { PortoConfig } from '@porto/apps'
import { LogoLockup } from '@porto/apps/components'
import { exp1Config } from '@porto/apps/contracts'
import { cx } from 'cva'
import { Value } from 'ox'
import { Mode } from 'porto'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { Link } from 'react-router'
import {
  ConnectorAlreadyConnectedError,
  useAccount,
  useAccountEffect,
  useChainId,
  useConnectors,
} from 'wagmi'
import LucideChevronLeft from '~icons/lucide/chevron-left'
import LucideChevronRight from '~icons/lucide/chevron-right'
import LucidePlay from '~icons/lucide/play'
import LucideX from '~icons/lucide/x'
import { porto, store } from '../wagmi.config'
import { Button } from './Button'

export function HomePage() {
  const dialog = Ariakit.useDialogStore()

  return (
    <div className="flex justify-center gap-[32px]">
      <div className="flex flex-1 flex-col items-start max-lg:max-w-[452px]">
        <p className="font-[300] text-[13px] text-gray10 tracking-[-0.25px] dark:text-gray11">
          Introducing
        </p>

        <div className="h-2" />

        <div className="w-[115px]">
          <LogoLockup />
        </div>

        <div className="h-3" />

        <p className="font-[300] text-[15px] text-gray10 leading-[21px] tracking-[-2.8%] dark:text-gray11">
          Integrate onboarding, authentication, payments, and recovery into your
          product, with no app or extension required.
        </p>

        <div className="h-4" />

        <div className="w-full overflow-hidden rounded-[8px] border border-gray5">
          <div className="flex items-center border-gray5 border-b p-[16px]">
            <Install />
          </div>
          <div className="bg-gray3/50 p-[16px] font-mono max-[486px]:p-[12px] max-[486px]:text-[13px] dark:bg-gray1">
            <p className={`before:mr-3 before:text-gray8 before:content-['1']`}>
              import {'{'} Porto {'}'} from 'porto'
            </p>
            <p className={`before:mr-3 before:text-gray8 before:content-['2']`}>
              Porto.
              <span className="text-blue9">create()</span>
            </p>
          </div>
        </div>

        <div className="h-4" />

        <div className="w-full min-lg:hidden">
          <Ariakit.Button
            className="relative inline-flex h-[42px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-accent px-[18px] font-medium text-white transition-colors hover:not-active:bg-accentHover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            onClick={dialog.show}
          >
            <LucidePlay className="mt-0.5 size-3.5" />
            Try it out
          </Ariakit.Button>

          <div className="h-6" />

          <div className="flex w-full items-center gap-4 font-[400] text-[14px] text-gray9 leading-[18px] tracking-[-0.25px]">
            <div>Learn more</div>
            <div className="h-[1px] w-full flex-1 bg-gray6" />
          </div>

          <div className="h-4" />
        </div>

        <div className="grid w-full grid-cols-2 gap-2 max-[486px]:grid-cols-1">
          <div className="rounded-[13px] border border-gray4 p-[16px]">
            <div className="size-[24px]">
              <WorksAnywhereIcon />
            </div>
            <div className="h-2" />
            <p className="font-[400] text-[15px] text-gray12 leading-[21px] tracking-[-2.8%]">
              Works anywhere
            </p>
            <p className="mt-2 font-[300] text-[13px] text-gray10 leading-[18px] tracking-[-0.25px]">
              Let your users create a wallet in seconds using <i>iFrames</i>,
              with no additional apps or extensions.
            </p>
          </div>
          <div className="rounded-[13px] border border-gray4 p-[16px]">
            <div className="size-[24px]">
              <NoDeveloperLockInIcon />
            </div>
            <div className="h-2" />
            <p className="font-[400] text-[15px] text-gray12 leading-[21px] tracking-[-2.8%]">
              No developer lock-in
            </p>
            <p className="mt-2 font-[300] text-[13px] text-gray10 leading-[18px] tracking-[-0.25px]">
              Use self-custodied Porto wallets with any Ethereum-based app or
              chain.
            </p>
          </div>
          <div className="rounded-[13px] border border-gray4 p-[16px]">
            <div className="size-[24px]">
              <BuiltByIthacaIcon />
            </div>
            <div className="h-2" />
            <p className="font-[400] text-[15px] text-gray12 leading-[21px] tracking-[-2.8%]">
              Built by Ithaca
            </p>
            <p className="mt-2 font-[300] text-[13px] text-gray10 leading-[18px] tracking-[-0.25px]">
              Created by the team behind Reth, Foundry, Wagmi, Viem, and other
              top open source tools.
            </p>
          </div>
          <div className="rounded-[13px] border border-gray4 p-[16px]">
            <div className="size-[24px]">
              <ModernEIPSupportIcon />
            </div>
            <div className="h-2" />
            <p className="font-[400] text-[15px] text-gray12 leading-[21px] tracking-[-2.8%]">
              Modern EIP support
            </p>
            <p className="mt-2 font-[300] text-[13px] text-gray10 leading-[18px] tracking-[-0.25px]">
              Bleeding-edge features built on top of EIPs such as 1193, 6963,
              7702, 5792, and more.
            </p>
          </div>
        </div>

        <div className="h-6" />

        <div className="flex w-full items-center gap-4 font-[400] text-[14px] text-gray9 leading-[18px] tracking-[-0.25px]">
          <div>Ready to get started?</div>
          <div className="h-[1px] w-full flex-1 bg-gray6" />
        </div>

        <div className="h-4" />

        <div className="flex w-full gap-2 max-[486px]:flex-col">
          <Ariakit.Button
            className="flex h-[40px] items-center justify-center gap-2 rounded-full border border-gray7 px-4 font-[400] hover:bg-gray3"
            render={<Link to="/sdk" />}
          >
            <div className="size-[1em]">
              <PortoIcon />
            </div>
            Documentation
          </Ariakit.Button>
          <Ariakit.Button
            className="flex h-[40px] items-center justify-center gap-2 rounded-full border border-gray7 px-4 font-[400] hover:bg-gray3"
            render={<Link to="/" />}
          >
            <div className="size-[1em]">
              <DemoIcon />
            </div>
            Playground
          </Ariakit.Button>
          <Ariakit.Button
            className="flex h-[40px] items-center justify-center gap-[6px] rounded-full border border-gray7 px-4 font-[400] hover:bg-gray3"
            render={
              // biome-ignore lint/a11y/useAnchorContent: <explanation>
              <a
                href="https://github.com/ithacaxyz/porto"
                rel="noreferrer"
                target="_blank"
              />
            }
          >
            <div className="size-[1.2em]">
              <GitHubIcon />
            </div>
            View Source
          </Ariakit.Button>
        </div>
      </div>

      <div className="flex-1 max-lg:hidden">
        <Demo />
      </div>

      <Ariakit.Dialog
        backdrop={<div className="backdrop" />}
        className="fixed inset-0 z-50 h-full bg-white px-5 py-6.5 lg:hidden dark:bg-black"
        store={dialog}
      >
        <div className="flex h-full flex-col">
          <header className="mb-5 flex items-center justify-between">
            <h1 className="-tracking-[0.504px] font-medium text-[18px] leading-normal">
              Try it out
            </h1>
            <Ariakit.DialogDismiss
              render={<LucideX className="size-6 text-gray11" />}
            />
          </header>

          <Demo />
        </div>
      </Ariakit.Dialog>
    </div>
  )
}

function Install() {
  const store = Ariakit.useRadioStore({ defaultValue: 'npm' })
  const state = Ariakit.useStoreState(store)
  return (
    <div className="flex max-h-[26px] w-full justify-between gap-1">
      <Ariakit.RadioProvider store={store}>
        <Ariakit.RadioGroup className="flex gap-1">
          <Install.Radio value="npm" />
          <Install.Radio value="pnpm" />
          <Install.Radio value="yarn" />
        </Ariakit.RadioGroup>
        <div className="font-[300] font-mono text-[15px] text-gray12 tracking-[-2.8%] max-[486px]:text-[12px]">
          <span className="text-gray8">{'>'}</span>{' '}
          <span className="text-blue9">{state.value}</span> install porto
        </div>
      </Ariakit.RadioProvider>
    </div>
  )
}

namespace Install {
  export function Radio(props: Radio.Props) {
    const { value } = props
    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
      <label className="flex items-center rounded-full border border-gray5 px-2 font-[400] text-[13px] text-gray9 leading-[unset] has-checked:border-blue9 has-checked:text-gray12">
        <Ariakit.VisuallyHidden>
          <Ariakit.Radio value={value} />
        </Ariakit.VisuallyHidden>
        {value}
      </label>
    )
  }

  declare namespace Radio {
    export type Props = {
      value: 'npm' | 'pnpm' | 'yarn'
    }
  }
}

const steps = ['sign-in', 'add-funds', 'send', 'mint', 'swap'] as const

function Demo() {
  const account = useAccount()
  const [step, setStep] = React.useState<(typeof steps)[number]>('sign-in')

  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  useAccountEffect({
    onConnect() {
      setStep('add-funds')
    },
    onDisconnect() {
      setStep('sign-in')
    },
  })

  return (
    <div className="flex h-full flex-col rounded-[20px] bg-gray3/50 p-4">
      <div className="hidden w-full justify-between p-1 lg:flex">
        <div className="font-[400] text-[14px] text-gray9 leading-none tracking-[-2.8%]">
          Demo
        </div>
        <Link
          className="flex items-center gap-1 font-[400] text-[14px] text-blue9 leading-none tracking-[-2.8%]"
          to="/"
        >
          Playground →
        </Link>
      </div>

      <div className="flex-1">
        {isMounted && (
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="w-full max-w-[277px]">
              {step === 'sign-in' && (
                <SignIn next={() => setStep('add-funds')} />
              )}
              {step === 'add-funds' && <div />}
              {step === 'send' && <div />}
              {step === 'mint' && <div />}
              {step === 'swap' && <div />}
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col items-center justify-center space-y-1">
        {isMounted && (
          <div className="w-full space-y-1">
            <div className="flex w-full items-end justify-between lg:items-center lg:justify-around">
              <div className="lg:pb-6">
                {account.isConnected && (
                  <button
                    className={cx(
                      'flex size-[32px] items-center justify-center rounded-full border border-gray5 bg-transparent text-gray8 hover:bg-gray2 disabled:cursor-not-allowed',
                      step === steps[0] && 'invisible',
                    )}
                    disabled={step === steps[0]}
                    onClick={() => setStep(steps[steps.indexOf(step) - 1]!)}
                    type="button"
                  >
                    <LucideChevronLeft className="-ms-0.5 size-5" />
                  </button>
                )}
              </div>

              <div className="flex flex-col pb-3 lg:pb-0">
                <div className="max-w-[25.5ch] space-y-1">
                  {step === 'sign-in' && (
                    <>
                      <p className="text-center font-[500] text-[19px] text-gray12 tracking-[-2.8%]">
                        Seamless sign in
                      </p>
                      <p className="text-center text-[15px] text-gray10 leading-[21px] tracking-[-2.8%]">
                        Grant permissions with your Porto wallet for security &
                        ease of use.
                      </p>
                    </>
                  )}
                  {step === 'add-funds' && (
                    <>
                      <p className="text-center font-[500] text-[19px] text-gray12 tracking-[-2.8%]">
                        Deposit in seconds
                      </p>
                      <p className="text-center text-[15px] text-gray10 leading-[21px] tracking-[-2.8%]">
                        Fund your account, with no KYC for deposits below $500.
                      </p>
                    </>
                  )}
                  {step === 'send' && (
                    <>
                      <p className="text-center font-[500] text-[19px] text-gray12 tracking-[-2.8%]">
                        Instant sends & swaps
                      </p>
                      <p className="text-center text-[15px] text-gray10 leading-[21px] tracking-[-2.8%]">
                        With permissions, complete common actions without extra
                        clicks.
                      </p>
                    </>
                  )}
                  {step === 'mint' && (
                    <>
                      <p className="text-center font-[500] text-[19px] text-gray12 tracking-[-2.8%]">
                        Rich feature set
                      </p>
                      <p className="text-center text-[15px] text-gray10 leading-[21px] tracking-[-2.8%]">
                        View rich transaction previews, pay fees in other
                        tokens, and much more.
                      </p>
                    </>
                  )}
                  {step === 'swap' && (
                    <>
                      <p className="text-center font-[500] text-[19px] text-gray12 tracking-[-2.8%]">
                        Free from fees
                      </p>
                      <p className="text-center text-[15px] text-gray10 leading-[21px] tracking-[-2.8%]">
                        Apps can cover your fees based on an asset you hold,
                        like the NFT you minted.
                      </p>
                    </>
                  )}
                </div>

                <div className="h-10 lg:h-8" />

                <div className="flex items-center justify-center gap-1">
                  {steps.map((s) => (
                    <button
                      className="size-[7px] rounded-full bg-gray6 transition-all duration-150 hover:not-data-[active=true]:not-data-[disabled=true]:scale-150 hover:not-data-[disabled=true]:bg-gray9 data-[active=true]:w-6 data-[active=true]:bg-gray9"
                      data-active={s === step}
                      data-disabled={!account.isConnected}
                      key={s}
                      onClick={() => {
                        if (account.isConnected) setStep(s)
                      }}
                      type="button"
                    />
                  ))}
                </div>
              </div>

              <div className="lg:pb-6">
                {account.isConnected && (
                  <button
                    className={cx(
                      'flex size-[32px] items-center justify-center rounded-full border border-gray5 bg-gray1 text-gray9 hover:bg-gray2 disabled:cursor-not-allowed',
                      step === steps[steps.length - 1] && 'invisible',
                    )}
                    disabled={step === steps[steps.length - 1]}
                    onClick={() => setStep(steps[steps.indexOf(step) + 1]!)}
                    type="button"
                  >
                    <LucideChevronRight className="-me-0.5 size-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SignIn({ next }: { next: () => void }) {
  const chainId = useChainId()
  const { address, status } = useAccount()
  const connect = Hooks.useConnect({
    mutation: {
      onError(error) {
        if (error instanceof ConnectorAlreadyConnectedError) next()
      },
      onSettled(data, error) {
        console.log('onSettled', { data, error })
      },
      onSuccess() {
        next()
      },
    },
  })
  const disconnect = Hooks.useDisconnect()
  const connector = usePortoConnector()

  React.useEffect(() => {
    if (status === 'connected') return
    if (!connector) return
    if (!porto) return

    switchRenderer('inline')
    function switchRenderer(to: 'iframe' | 'inline') {
      if (!porto) throw new Error('porto instance not defined')

      const state = store.getState()
      const fromRenderer = state.renderer
      const toRenderer = state.renderers.find((x) => x.name === to)

      if (
        fromRenderer &&
        toRenderer &&
        fromRenderer?.name !== toRenderer.name
      ) {
        porto._internal.setMode(
          Mode.dialog({
            host: PortoConfig.getDialogHost(),
            renderer: toRenderer,
          }),
        )
        store.setState((x) => ({ ...x, renderer: toRenderer }))
      }
    }

    connect.mutate({
      connector,
      grantPermissions: {
        expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
        permissions: {
          calls: [{ to: exp1Config.address[chainId] }],
          spend: [
            {
              limit: Value.fromEther('100'),
              period: 'hour',
              token: exp1Config.address[chainId],
            },
          ],
        },
      },
    })

    return () => {
      switchRenderer('iframe')
    }
  }, [status, chainId, connect.mutate, connector])

  return (
    <div className="flex w-full justify-center">
      <div id="porto" />

      {status === 'connected' && (
        <div className="flex flex-col gap-2">
          <div title={address}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>

          <Button
            className="flex-grow"
            onClick={() => disconnect.mutate({ connector })}
            variant="accent"
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  )
}

function WorksAnywhereIcon() {
  return (
    <svg
      fill="none"
      height="100%"
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Works anywhere</title>
      <path
        d="M20 3H4C3.44772 3 3 3.44772 3 4V9C3 9.55228 3.44772 10 4 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z"
        stroke="#D6409F"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M11 14H4C3.44772 14 3 14.4477 3 15V20C3 20.5523 3.44772 21 4 21H11C11.5523 21 12 20.5523 12 20V15C12 14.4477 11.5523 14 11 14Z"
        stroke="#D6409F"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M20 14H17C16.4477 14 16 14.4477 16 15V20C16 20.5523 16.4477 21 17 21H20C20.5523 21 21 20.5523 21 20V15C21 14.4477 20.5523 14 20 14Z"
        stroke="#D6409F"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function NoDeveloperLockInIcon() {
  return (
    <svg
      fill="none"
      height="100%"
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>No developer lock-in</title>
      <path
        d="M20 3H15C14.4477 3 14 3.44772 14 4V9C14 9.55228 14.4477 10 15 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z"
        stroke="#F76B15"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M10 21V8C10 7.73478 9.89464 7.48043 9.70711 7.29289C9.51957 7.10536 9.26522 7 9 7H4C3.73478 7 3.48043 7.10536 3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 20.2652 3.10536 20.5196 3.29289 20.7071C3.48043 20.8946 3.73478 21 4 21H16C16.2652 21 16.5196 20.8946 16.7071 20.7071C16.8946 20.5196 17 20.2652 17 20V15C17 14.7348 16.8946 14.4804 16.7071 14.2929C16.5196 14.1054 16.2652 14 16 14H3"
        stroke="#F76B15"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function BuiltByIthacaIcon() {
  return (
    <svg
      fill="none"
      height="100%"
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Built by Ithaca</title>
      <path
        d="M22 18H2C2 19.0609 2.42143 20.0783 3.17157 20.8284C3.92172 21.5786 4.93913 22 6 22H18C19.0609 22 20.0783 21.5786 20.8284 20.8284C21.5786 20.0783 22 19.0609 22 18Z"
        stroke="#0090FF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M21 14L10 2L3 14H21Z"
        stroke="#0090FF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M10 2V18"
        stroke="#0090FF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function ModernEIPSupportIcon() {
  return (
    <svg
      fill="none"
      height="100%"
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Modern EIP support</title>
      <path
        d="M12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20Z"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M12 14C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12C14 11.4696 13.7893 10.9609 13.4142 10.5858C13.0391 10.2107 12.5304 10 12 10C11.4696 10 10.9609 10.2107 10.5858 10.5858C10.2107 10.9609 10 11.4696 10 12C10 12.5304 10.2107 13.0391 10.5858 13.4142C10.9609 13.7893 11.4696 14 12 14Z"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M12 2V4"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M12 22V20"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M17 20.6599L16 18.9299"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M11 10.2701L7 3.34009"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M20.6601 17L18.9301 16"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M3.33997 7L5.06997 8"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M14 12H22"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M2 12H4"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M20.6601 7L18.9301 8"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M3.33997 17L5.06997 16"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M17 3.34009L16 5.07009"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M11 13.73L7 20.66"
        stroke="#12A594"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function PortoIcon() {
  return (
    <svg
      fill="none"
      height="100%"
      viewBox="0 0 95 79"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="not-dark:hidden">
        <path
          clipRule="evenodd"
          d="M6.56757 0C2.9404 0 0 2.9404 0 6.56757V74.4324C0 76.4475 1.63356 78.0811 3.64865 78.0811H91.2162C93.2313 78.0811 94.8649 76.4475 94.8649 74.4324V6.56757C94.8649 2.9404 91.9245 0 88.2973 0H6.56757ZM78.4461 6.56757C73.4084 6.56757 69.3245 10.6515 69.3245 15.6892C69.3245 20.7269 73.4084 24.8108 78.4461 24.8108H79.1758C84.2136 24.8108 88.2975 20.7269 88.2975 15.6892C88.2975 10.6515 84.2136 6.56757 79.1758 6.56757H78.4461Z"
          fill="#999999"
          fillRule="evenodd"
        />
        <mask
          height="79"
          id="mask0_1_76"
          maskUnits="userSpaceOnUse"
          style={{ maskType: 'alpha' }}
          width="95"
          x="0"
          y="0"
        >
          <path
            clipRule="evenodd"
            d="M6.56757 0C2.9404 0 0 2.9404 0 6.56757V74.4324C0 76.4475 1.63356 78.0811 3.64865 78.0811H91.2162C93.2313 78.0811 94.8649 76.4475 94.8649 74.4324V6.56757C94.8649 2.9404 91.9245 0 88.2973 0H6.56757ZM78.4461 6.56757C73.4084 6.56757 69.3245 10.6515 69.3245 15.6892C69.3245 20.7269 73.4084 24.8108 78.4461 24.8108H79.1758C84.2136 24.8108 88.2975 20.7269 88.2975 15.6892C88.2975 10.6515 84.2136 6.56757 79.1758 6.56757H78.4461Z"
            fill="white"
            fillRule="evenodd"
          />
        </mask>
        <g mask="url(#mask0_1_76)">
          <path
            d="M0.00018692 36.4865C0.00018692 34.4714 1.63374 32.8378 3.64884 32.8378H91.2164C93.2315 32.8378 94.865 34.4714 94.865 36.4865V74.4324C94.865 76.4475 93.2315 78.0811 91.2164 78.0811H3.64884C1.63375 78.0811 0.00018692 76.4475 0.00018692 74.4324V36.4865Z"
            fill="#CBCBCB"
          />
          <path
            clipRule="evenodd"
            d="M3.64884 29.9189H91.2164C94.8436 29.9189 97.784 32.8593 97.784 36.4865V74.4324C97.784 78.0596 94.8436 81 91.2164 81H3.64884C0.0216737 81 -2.91873 78.0596 -2.91873 74.4324V36.4865C-2.91873 32.8593 0.0216694 29.9189 3.64884 29.9189ZM3.64884 32.8378C1.63374 32.8378 0.00018692 34.4714 0.00018692 36.4865V74.4324C0.00018692 76.4475 1.63375 78.0811 3.64884 78.0811H91.2164C93.2315 78.0811 94.865 76.4475 94.865 74.4324V36.4865C94.865 34.4714 93.2315 32.8378 91.2164 32.8378H3.64884Z"
            fill="#999999"
            fillRule="evenodd"
          />
          <path
            d="M0.00018692 51.8108C0.00018692 49.7957 1.63374 48.1622 3.64884 48.1622H91.2164C93.2315 48.1622 94.865 49.7957 94.865 51.8108V74.4324C94.865 76.4475 93.2315 78.0811 91.2164 78.0811H3.64884C1.63375 78.0811 0.00018692 76.4475 0.00018692 74.4324V51.8108Z"
            fill="#DDDDDD"
          />
          <path
            clipRule="evenodd"
            d="M3.64884 45.2432H91.2164C94.8436 45.2432 97.784 48.1836 97.784 51.8108V74.4324C97.784 78.0596 94.8436 81 91.2164 81H3.64884C0.0216737 81 -2.91873 78.0596 -2.91873 74.4324V51.8108C-2.91873 48.1836 0.0216684 45.2432 3.64884 45.2432ZM3.64884 48.1622C1.63374 48.1622 0.00018692 49.7957 0.00018692 51.8108V74.4324C0.00018692 76.4475 1.63375 78.0811 3.64884 78.0811H91.2164C93.2315 78.0811 94.865 76.4475 94.865 74.4324V51.8108C94.865 49.7957 93.2315 48.1622 91.2164 48.1622H3.64884Z"
            fill="#999999"
            fillRule="evenodd"
          />
          <path
            d="M0.00018692 67.1351C0.00018692 65.12 1.63374 63.4865 3.64884 63.4865H91.2164C93.2315 63.4865 94.865 65.12 94.865 67.1351V74.4324C94.865 76.4475 93.2315 78.0811 91.2164 78.0811H3.64884C1.63375 78.0811 0.00018692 76.4475 0.00018692 74.4324V67.1351Z"
            fill="white"
          />
          <path
            clipRule="evenodd"
            d="M3.64884 60.5676H91.2164C94.8436 60.5676 97.784 63.5079 97.784 67.1351V74.4324C97.784 78.0596 94.8436 81 91.2164 81H3.64884C0.0216737 81 -2.91873 78.0596 -2.91873 74.4324V67.1351C-2.91873 63.508 0.0216684 60.5676 3.64884 60.5676ZM3.64884 63.4865C1.63374 63.4865 0.00018692 65.12 0.00018692 67.1351V74.4324C0.00018692 76.4475 1.63375 78.0811 3.64884 78.0811H91.2164C93.2315 78.0811 94.865 76.4475 94.865 74.4324V67.1351C94.865 65.12 93.2315 63.4865 91.2164 63.4865H3.64884Z"
            fill="#999999"
            fillRule="evenodd"
          />
        </g>
      </g>
      <g className="dark:hidden">
        <title>Porto</title>
        <path
          clipRule="evenodd"
          d="M6.56757 0C2.9404 0 0 2.9404 0 6.56757V74.4324C0 76.4475 1.63356 78.0811 3.64865 78.0811H91.2162C93.2313 78.0811 94.8649 76.4475 94.8649 74.4324V6.56757C94.8649 2.9404 91.9245 0 88.2973 0H6.56757ZM78.4461 6.56757C73.4084 6.56757 69.3245 10.6515 69.3245 15.6892C69.3245 20.7269 73.4084 24.8108 78.4461 24.8108H79.1758C84.2136 24.8108 88.2975 20.7269 88.2975 15.6892C88.2975 10.6515 84.2136 6.56757 79.1758 6.56757H78.4461Z"
          fill="#CCCCCC"
          fillRule="evenodd"
        />
        <mask
          height="79"
          id="mask0_1_116"
          maskUnits="userSpaceOnUse"
          style={{ maskType: 'alpha' }}
          width="95"
          x="0"
          y="0"
        >
          <path
            clipRule="evenodd"
            d="M6.56757 0C2.9404 0 0 2.9404 0 6.56757V74.4324C0 76.4475 1.63356 78.0811 3.64865 78.0811H91.2162C93.2313 78.0811 94.8649 76.4475 94.8649 74.4324V6.56757C94.8649 2.9404 91.9245 0 88.2973 0H6.56757ZM78.4461 6.56757C73.4084 6.56757 69.3245 10.6515 69.3245 15.6892C69.3245 20.7269 73.4084 24.8108 78.4461 24.8108H79.1758C84.2136 24.8108 88.2975 20.7269 88.2975 15.6892C88.2975 10.6515 84.2136 6.56757 79.1758 6.56757H78.4461Z"
            fill="white"
            fillRule="evenodd"
          />
        </mask>
        <g mask="url(#mask0_1_116)">
          <path
            d="M0.00018692 36.4865C0.00018692 34.4714 1.63374 32.8378 3.64884 32.8378H91.2164C93.2315 32.8378 94.865 34.4714 94.865 36.4865V74.4324C94.865 76.4475 93.2315 78.0811 91.2164 78.0811H3.64884C1.63375 78.0811 0.00018692 76.4475 0.00018692 74.4324V36.4865Z"
            fill="#A3A3A3"
          />
          <path
            clipRule="evenodd"
            d="M3.64884 29.9189H91.2164C94.8436 29.9189 97.784 32.8593 97.784 36.4865V74.4324C97.784 78.0596 94.8436 81 91.2164 81H3.64884C0.0216737 81 -2.91873 78.0596 -2.91873 74.4324V36.4865C-2.91873 32.8593 0.0216694 29.9189 3.64884 29.9189ZM3.64884 32.8378C1.63374 32.8378 0.00018692 34.4714 0.00018692 36.4865V74.4324C0.00018692 76.4475 1.63375 78.0811 3.64884 78.0811H91.2164C93.2315 78.0811 94.865 76.4475 94.865 74.4324V36.4865C94.865 34.4714 93.2315 32.8378 91.2164 32.8378H3.64884Z"
            fill="#CCCCCC"
            fillRule="evenodd"
          />
          <path
            d="M0.00018692 51.8108C0.00018692 49.7957 1.63374 48.1622 3.64884 48.1622H91.2164C93.2315 48.1622 94.865 49.7957 94.865 51.8108V74.4324C94.865 76.4475 93.2315 78.0811 91.2164 78.0811H3.64884C1.63375 78.0811 0.00018692 76.4475 0.00018692 74.4324V51.8108Z"
            fill="#626262"
          />
          <path
            clipRule="evenodd"
            d="M3.64884 45.2432H91.2164C94.8436 45.2432 97.784 48.1836 97.784 51.8108V74.4324C97.784 78.0596 94.8436 81 91.2164 81H3.64884C0.0216737 81 -2.91873 78.0596 -2.91873 74.4324V51.8108C-2.91873 48.1836 0.0216684 45.2432 3.64884 45.2432ZM3.64884 48.1622C1.63374 48.1622 0.00018692 49.7957 0.00018692 51.8108V74.4324C0.00018692 76.4475 1.63375 78.0811 3.64884 78.0811H91.2164C93.2315 78.0811 94.865 76.4475 94.865 74.4324V51.8108C94.865 49.7957 93.2315 48.1622 91.2164 48.1622H3.64884Z"
            fill="#CCCCCC"
            fillRule="evenodd"
          />
          <path
            d="M0.00018692 67.1351C0.00018692 65.12 1.63374 63.4865 3.64884 63.4865H91.2164C93.2315 63.4865 94.865 65.12 94.865 67.1351V74.4324C94.865 76.4475 93.2315 78.0811 91.2164 78.0811H3.64884C1.63375 78.0811 0.00018692 76.4475 0.00018692 74.4324V67.1351Z"
            fill="#313131"
          />
          <path
            clipRule="evenodd"
            d="M3.64884 60.5676H91.2164C94.8436 60.5676 97.784 63.5079 97.784 67.1351V74.4324C97.784 78.0596 94.8436 81 91.2164 81H3.64884C0.0216737 81 -2.91873 78.0596 -2.91873 74.4324V67.1351C-2.91873 63.508 0.0216684 60.5676 3.64884 60.5676ZM3.64884 63.4865C1.63374 63.4865 0.00018692 65.12 0.00018692 67.1351V74.4324C0.00018692 76.4475 1.63375 78.0811 3.64884 78.0811H91.2164C93.2315 78.0811 94.865 76.4475 94.865 74.4324V67.1351C94.865 65.12 93.2315 63.4865 91.2164 63.4865H3.64884Z"
            fill="#CCCCCC"
            fillRule="evenodd"
          />
        </g>
      </g>
    </svg>
  )
}

function DemoIcon() {
  return (
    <svg
      fill="none"
      height="100%"
      viewBox="0 0 18 17"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Demo</title>
      <path
        d="M9 13.7499L6.0225 15.5349C5.7892 15.6751 5.52217 15.7492 5.25 15.7492C4.97783 15.7492 4.7108 15.6751 4.4775 15.5349L2.2275 14.1849C2.00607 14.0519 1.82275 13.8639 1.69529 13.6393C1.56783 13.4146 1.50057 13.1608 1.5 12.9024V10.4724C1.50057 10.2141 1.56783 9.96033 1.69529 9.73564C1.82275 9.51095 2.00607 9.32298 2.2275 9.18995L5.25 7.37495M9 13.7499V9.62495M9 13.7499L11.9775 15.5349C12.2108 15.6751 12.4778 15.7492 12.75 15.7492C13.0222 15.7492 13.2892 15.6751 13.5225 15.5349L15.7725 14.1849C15.9939 14.0519 16.1773 13.8639 16.3047 13.6393C16.4322 13.4146 16.4994 13.1608 16.5 12.9024V10.4724C16.4994 10.2141 16.4322 9.96033 16.3047 9.73564C16.1773 9.51095 15.9939 9.32298 15.7725 9.18995L12.75 7.37495M9 9.62495L5.25 7.37495M9 9.62495L5.25 11.8749M9 9.62495L12.75 7.37495M9 9.62495L12.75 11.8749M9 9.62495L9 5.49995M5.25 7.37495L5.25 4.09745C5.25057 3.83913 5.31783 3.58533 5.44529 3.36064C5.57275 3.13595 5.75607 2.94798 5.9775 2.81495L8.2275 1.46495C8.4608 1.32478 8.72783 1.25073 9 1.25073C9.27216 1.25073 9.5392 1.32478 9.7725 1.46495L12.0225 2.81495C12.2439 2.94798 12.4273 3.13595 12.5547 3.36064C12.6822 3.58533 12.7494 3.83913 12.75 4.09745L12.75 7.37495M5.25 11.8749L1.695 9.73745M5.25 11.8749V15.7524M12.75 11.8749L16.305 9.73745M12.75 11.8749L12.75 15.7524M9 5.49995L5.445 3.36245M9 5.49995L12.555 3.36245"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg
      height="100%"
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>GitHub</title>
      <path
        d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
        fill="currentColor"
      />
    </svg>
  )
}

function usePortoConnector() {
  const connectors = useConnectors()
  return connectors.find((connector) => connector.id === 'xyz.ithaca.porto')!
}
