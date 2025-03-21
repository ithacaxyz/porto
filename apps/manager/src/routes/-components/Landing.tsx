import { Button, IndeterminateLoader, LogoMark } from '@porto/apps/components'
import { humanId } from 'human-id'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { useAccount, useConnectors } from 'wagmi'

import { config } from '~/lib/Wagmi'
import SparkIcon from '~icons/lucide/sparkles'
import { Layout } from './Layout'

const id = () => humanId({ capitalize: true, separator: ' ' })

export function Landing() {
  const account = useAccount()
  const connect = Hooks.useConnect()
  const [connector] = useConnectors({ config })

  const [label, setLabel] = React.useState(id())

  return (
    <>
      <Layout.Header />

      <div className="flex h-full flex-col items-center justify-between gap-y-4 rounded-3xl">
        <form className="flex h-full w-full max-w-[328px] flex-col justify-center gap-y-6 max-lg:gap-y-20">
          {account.isConnecting ? (
            <IndeterminateLoader
              align="vertical"
              title="Signing in"
              description="Please check for a system prompt."
              hint="You can choose any of your existing Porto passkeys to sign in."
            />
          ) : (
            <>
              <div className="flex flex-col items-center">
                <div className="h-[43px]">
                  <LogoMark />
                </div>
                <div className="h-4" />
                <p className="text-center font-[500] text-[31px]">
                  Sail the seas
                </p>
                <div className="h-2" />
                <p className="max-w-[24ch] text-center text-[18px] text-base text-gray11 tracking-[-2.8%]">
                  Porto is a seamless, friendly way to use digital assets
                  on-the-go.
                </p>
              </div>
              <div>
                <div className="flex h-12.5 items-center rounded-4xl border border-gray7 bg-gray1 py-2 pr-2 pl-4">
                  <input
                    type="text"
                    maxLength={32}
                    spellCheck={false}
                    autoCorrect="off"
                    autoComplete="off"
                    autoCapitalize="off"
                    placeholder="Enter a name…"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full font-[500] text-[19px] focus:outline-none focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setLabel(id())}
                    className="rounded-full bg-accentTint p-2 transition-all duration-200 hover:bg-accentTintHover active:scale-90"
                  >
                    <SparkIcon className="size-5 text-accent" />
                  </button>
                </div>

                <div className="h-3" />

                <p className="text-center text-[15px] text-gray10">
                  You can't change this name later.
                </p>

                <div className="h-4" />

                <Button
                  type="button"
                  variant="default"
                  className="h-12.5! w-full bg-gray12! text-gray1! text-lg! hover:bg-gray12/90!"
                  onClick={() =>
                    connect.mutate({
                      connector: connector!,
                      createAccount: { label },
                    })
                  }
                >
                  Create
                </Button>

                <div className="h-3" />

                <div className="h-3.5 border-gray7 border-b-1 text-center">
                  <span className="my-auto bg-gray2 px-2 font-[500] text-gray10">
                    or
                  </span>
                </div>

                <div className="h-6" />

                <Button
                  type="button"
                  variant="accent"
                  className="h-12.5! w-full text-lg!"
                  onClick={() =>
                    connect.mutate({
                      connector: connector!,
                    })
                  }
                >
                  Sign in
                </Button>
              </div>
            </>
          )}
        </form>
      </div>

      <Layout.IntegrateFooter />
    </>
  )
}
