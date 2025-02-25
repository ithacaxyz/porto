import { Hooks } from 'porto/wagmi'
import { useState } from 'react'
import { useConnectors } from 'wagmi'

import { Button } from '~/components/Button'
import { IndeterminateLoader } from '~/components/IndeterminateLoader'
import { IthacaMark } from '~/components/IthacaMark'

export function Landing() {
  const [signUp, setSignUp] = useState(false)
  const connect = Hooks.useConnect()
  const [connector] = useConnectors()

  return (
    <div className="mx-auto flex h-screen w-full max-w-[768px] flex-col">
      <div className="flex h-[100px] items-center px-4">
        <nav className="flex gap-6 font-medium text-gray11">
          <a href="https://ithaca.xyz">Home ↗</a>
          <a href="https://ithaca.xyz/contact">Careers ↗</a>
        </nav>
      </div>
      <div className="max-w-[300px] flex-grow content-end space-y-6 px-4 pb-[30dvh]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <img src="/icons/wallet.svg" alt="Porto" className="size-9" />
            <p className="font-medium text-[34px] leading-[24px]">Porto</p>
          </div>
          <p className="font-normal text-[19px] text-secondary leading-[22px]">
            A home for your digital assets,
            <br />
            powered by{' '}
            <a
              className="text-accent"
              href="https://ithaca.xyz"
              rel="noreferrer"
              target="_blank"
            >
              Ithaca
            </a>
            .
          </p>
        </div>
        <div className="h-[100px]">
          {connect.isPending ? (
            <div>
              <IndeterminateLoader
                title={signUp ? 'Signing up...' : 'Signing in...'}
                description=""
                hint=""
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
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
                  Create wallet
                </Button>
                <Button
                  onClick={() => connect.mutate({ connector: connector! })}
                  className="flex-grow"
                  variant="invert"
                >
                  Sign in
                </Button>
              </div>
              <Button asChild className="w-full">
                <a href="https://ithaca.xyz/updates/introducing-ithaca">
                  Learn more
                </a>
              </Button>
              <a
                className="mx-1 text-secondary"
                href="https://ithaca.xyz/recover"
                rel="noreferrer"
                target="_blank"
              >
                Recover my account →
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="fixed top-[10dvh] right-0 h-[80dvh] max-[768px]:hidden max-[1024px]:h-[70dvh]">
        <IthacaMark />
      </div>
    </div>
  )
}
