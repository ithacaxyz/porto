import { Link, createFileRoute } from '@tanstack/react-router'
import { Hex, Mnemonic, P256, PublicKey } from 'ox'
import * as React from 'react'
import { toast } from 'sonner'
import ChevronLeftIcon from '~icons/lucide/chevron-left'

import { cn } from '~/utils'

export const Route = createFileRoute('/settings/recovery/wallet/phrase')({
  component: RouteComponent,
})

function RouteComponent() {
  const [recoveryString, setRecoveryString] = React.useState('')

  const validInput = React.useCallback((input: string) => {
    try {
      let publicKey: Hex.Hex
      const sanitizedInput = input.trim()
      if (sanitizedInput.length === 0) return false

      if (sanitizedInput.includes(' ')) {
        const privateKey = Mnemonic.toPrivateKey(sanitizedInput)
        publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }))
        if (!Hex.validate(publicKey)) throw new Error('Invalid recovery phrase')
        return true
      }

      if (!Hex.validate(sanitizedInput)) throw new Error('Invalid private key')

      publicKey = PublicKey.toHex(
        P256.getPublicKey({ privateKey: sanitizedInput }),
      )
      console.info(publicKey)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error
      console.error(errorMessage)
      return false
    }
  }, [])

  return (
    <main
      className={cn(
        'mx-auto flex h-screen max-h-[1200px] w-full max-w-[460px] flex-col content-between items-stretch space-y-6 rounded-xl bg-transparent py-4 text-center',
        'sm:my-32 sm:h-[550px] sm:max-w-[400px] sm:bg-gray1 sm:shadow-sm sm:outline sm:outline-gray4',
      )}
    >
      <header className="mt-4 flex justify-between px-5 sm:mt-1">
        <Link
          to="/settings/recovery/wallet"
          from="/settings/recovery/wallet/phrase"
          className="rounded-full bg-gray4 p-1"
        >
          <ChevronLeftIcon className="my-auto size-7 text-gray-400 hover:text-gray-600" />
        </Link>
        <Link
          to="/create-account"
          className="my-auto flex h-9 w-[110px] items-center justify-center rounded-2xl bg-gray3 font-medium"
        >
          <p className="my-auto">
            Support <span className="ml-1">→</span>
          </p>
        </Link>
      </header>

      <div className="mt-10 size-full sm:mt-1 sm:px-4">
        <h1 className="mt-4 font-medium text-2xl">Import your wallet</h1>
        <p className="mx-6 my-3 text-pretty text-primary">
          This will import your existing wallet into Ithaca, allowing you to use
          it seamlessly.
        </p>
      </div>

      <div className="mx-auto w-full">
        <textarea
          name="phrase"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          value={recoveryString}
          onBlur={(_event) => {
            if (!validInput(recoveryString)) {
              toast.error('Invalid recovery phrase or key')
            }
          }}
          placeholder="Enter your recovery phrase or key here…"
          onChange={(event) => setRecoveryString(event.target.value)}
          className={cn(
            'h-[160px] w-full max-w-[90%] resize-none rounded-md border border-gray-400/20 p-3 text-gray12',
            'placeholder:text-gray9 focus:outline-none focus:ring-1 focus:ring-gray3',
          )}
        />
        <p className="mx-6 mt-1.5 mb-3 text-pretty text-gray11">
          Recovery phrases are typically 16 or 24 words, and private keys are 64
          characters.
        </p>
        <div className="mx-auto mb-2 flex h-11 w-full max-w-[90%] items-center justify-center space-x-2.5 rounded-md">
          <Link
            to="/settings/recovery/wallet"
            from="/settings/recovery/wallet/phrase"
            className="my-auto mt-2 flex size-full max-w-[50%] items-center justify-center rounded-md bg-gray3 font-medium text-md hover:bg-gray4"
          >
            Go back
          </Link>
          <Link
            to="/"
            from="/settings/recovery/wallet/phrase"
            className="my-auto mt-2 flex size-full max-w-[50%] items-center justify-center rounded-md bg-gray3 font-medium text-md hover:bg-gray4"
          >
            I'll do this later
          </Link>
        </div>
      </div>
    </main>
  )
}
