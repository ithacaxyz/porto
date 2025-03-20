import { Button, IndeterminateLoader } from '@porto/apps/components'
import { cx } from 'cva'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { useAccount, useConnectors } from 'wagmi'
import SparkIcon from '~icons/lucide/sparkles'

import { PassphraseGenerator } from '~/lib/Phrase'
import { config } from '~/lib/Wagmi'

export function Landing() {
  const account = useAccount()
  const connect = Hooks.useConnect()
  const [connector] = useConnectors({ config })

  const [label, setLabel] = React.useState(
    new PassphraseGenerator().generatePhrase({
      count: 4,
    }),
  )

  return (
    <section
      className={cx(
        'flex flex-col items-center justify-center gap-y-4 rounded-3xl px-6 py-16 md:mr-6 lg:px-14',
      )}
    >
      {account.isConnecting ? (
        <IndeterminateLoader
          title="Signing in…"
          className="mx-auto mt-20 max-w-[60px] flex-col text-nowrap text-center"
        />
      ) : (
        <form className="mt-auto flex w-full max-w-[400px] flex-col gap-y-4">
          <p className="text-center text-3xl">Create account</p>
          <p className="text-center text-base text-gray10">
            Give your Ithaca account a simple,
            <br /> memorable nickname.
          </p>
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
              className="w-full text-[16.5px] text-gray12 focus:outline-none focus:ring-0"
            />
            <button
              type="button"
              onClick={() =>
                setLabel(
                  new PassphraseGenerator().generatePhrase({
                    count: 4,
                  }),
                )
              }
              className="rounded-full bg-violet-700/10 p-2 hover:bg-violet-700/20"
            >
              <SparkIcon className="size-5 text-indigo-700" />
            </button>
          </div>
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
          <div className="mb-2 h-3.5 border-gray7 border-b-1 text-center">
            <span className="my-auto bg-gray2 px-2 text-gray10">or</span>
          </div>
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
        </form>
      )}
      <div className="mt-auto hidden h-min items-center gap-x-3 md:flex">
        <p>Want to integrate Porto with your application?</p>
        <Button className="h-min w-min! px-2! py-1" asChild>
          <a href="https://porto.sh" target="_blank" rel="noreferrer">
            Learn more
          </a>
        </Button>
      </div>
    </section>
  )
}
