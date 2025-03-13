import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Hex, Mnemonic, P256, PublicKey, Signature } from 'ox'
import * as React from 'react'
import { toast } from 'sonner'
import CheckIcon from '~icons/lucide/check'
import CheckMarkIcon from '~icons/lucide/check'
import ChevronLeftIcon from '~icons/lucide/chevron-left'
import XIcon from '~icons/lucide/x'

import { Button } from '~/components/Button'
import { cn } from '~/utils'

export const Route = createFileRoute('/_app/settings/recovery/wallet/phrase')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const [recoveryString, setRecoveryString] = React.useState('')
  const [status, setStatus] = React.useState<'VALID' | 'INVALID' | 'IDLE'>(
    'IDLE',
  )

  const [privateKey, setPrivateKey] = React.useState<Hex.Hex | null>(null)
  const [signature, setSignature] = React.useState<Hex.Hex | null>(null)

  const validInput = React.useCallback((input: string) => {
    try {
      let publicKey: Hex.Hex
      const sanitizedInput = input.trim()
      if (sanitizedInput.length === 0) {
        setPrivateKey(null)
        return
      }

      if (sanitizedInput.includes(' ')) {
        const valid = Mnemonic.validate(sanitizedInput, Mnemonic.english)
        if (!valid) throw new Error('Invalid recovery phrase')
        const privateKey = Mnemonic.toPrivateKey(sanitizedInput, { as: 'Hex' })
        setPrivateKey(privateKey)
        publicKey = PublicKey.toHex(P256.getPublicKey({ privateKey }))
        if (!Hex.validate(publicKey)) throw new Error('Invalid recovery phrase')
        return true
      }

      if (!Hex.validate(sanitizedInput)) throw new Error('Invalid key')

      setPrivateKey(sanitizedInput)
      publicKey = PublicKey.toHex(
        P256.getPublicKey({ privateKey: sanitizedInput }),
      )

      return true
    } catch (error) {
      console.error(error)
      setPrivateKey(null)
      return false
    }
  }, [])

  const signMessage = (message: string) => {
    if (!privateKey) return
    const signed = P256.sign({
      privateKey,
      payload: Hex.fromString(message),
    })
    const signature = Signature.toHex(signed)
    return signature
  }

  return (
    <main
      className={cn(
        'mx-auto flex h-full w-full max-w-[460px] flex-col content-between items-stretch space-y-6 rounded-xl bg-transparent pt-2 pb-4 text-center',
        'sm:my-32 sm:h-[580px] sm:max-w-[400px] sm:bg-gray1 sm:pt-3 sm:shadow-sm sm:outline sm:outline-gray4',
      )}
    >
      <header className="mt-4 flex justify-between px-4 sm:mt-1 sm:px-3">
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

      <div className="mb-auto w-full sm:px-4">
        {signature ? (
          <React.Fragment>
            <div className="m-auto mt-4 flex size-15 items-center justify-center rounded-full bg-green4">
              <CheckMarkIcon className="mx-auto size-9 text-green-600" />
            </div>
            <h1 className="mt-4 font-medium text-2xl">Added backup wallet</h1>
            <p className="mx-6 my-3 text-pretty text-primary">
              You can now use this wallet to recover your passkey if you ever
              lose access to it.
            </p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h1 className="mt-4 font-medium text-2xl">Import your wallet</h1>
            <p className="mx-6 my-3 text-pretty text-primary">
              This will import your existing wallet into Ithaca, allowing you to
              use it seamlessly.
            </p>
          </React.Fragment>
        )}
      </div>

      <div className="mx-auto w-full">
        <textarea
          name="phrase"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          value={recoveryString}
          disabled={Hex.validate(signature)}
          placeholder="Enter your recovery phrase or key here…"
          onBlur={(event) => {
            const value = event.target.value
            if (value.length === 0) return setStatus('IDLE')
            setStatus(validInput(value) ? 'VALID' : 'INVALID')
          }}
          onChange={(event) => {
            const value = event.target.value
            setRecoveryString(value)
            if (value.length === 0) return setStatus('IDLE')
            setStatus(validInput(value) ? 'VALID' : 'INVALID')
          }}
          className={cn(
            'h-[160px] w-full max-w-[90%] resize-none rounded-md border-[1.5px] p-3 text-gray12',
            'placeholder:text-gray9 focus:outline-none focus:ring-1 focus:ring-gray3',
            status === 'VALID'
              ? 'border-green6'
              : status === 'INVALID'
                ? 'border-red-400'
                : 'border-gray4',
            Hex.validate(signature) && 'opacity-50',
          )}
        />
        <div className="mx-auto flex h-[60px] flex-col">
          {status === 'IDLE' ? (
            <p className="mx-6 mt-1.5 mb-3 text-pretty text-gray11">
              Recovery phrases are typically 16 or 24 words, and private keys
              are 64 characters.
            </p>
          ) : status === 'VALID' ? (
            <div className="my-auto flex flex-row items-center justify-center space-x-3">
              <div className="rounded-full bg-green4 p-1">
                <CheckIcon className="size-5 text-green11" />
              </div>
              <span className="text-gray11 text-lg">This looks valid!</span>
            </div>
          ) : (
            <div className="my-auto flex flex-row items-center justify-center space-x-3">
              <div className="rounded-full bg-red4 p-1">
                <XIcon className="size-5 text-red9" />
              </div>
              <span className="text-gray11 text-lg">
                This one does is not valid.
              </span>
            </div>
          )}
        </div>

        <div className="mx-auto mb-3 flex h-11 w-full max-w-[90%] items-center justify-center space-x-2.5 rounded-md">
          {status === 'VALID' ? (
            <Button
              variant="accent"
              onClick={(event) => {
                event.preventDefault()
                if (Hex.validate(signature))
                  return navigate({ to: '/settings' })

                const signed = signMessage(
                  `${new Date().toISOString()}\nI'm the owner of this wallet\nSigning a message to confirm my ownership`,
                )
                if (!signed) return
                setSignature(signed)
                toast.success(`Signed\n${signed}`)
              }}
              className="my-auto mt-2 flex size-full items-center justify-center rounded-md bg-accent font-medium text-md text-white hover:bg-gray4"
            >
              Continue
            </Button>
          ) : (
            <React.Fragment>
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
            </React.Fragment>
          )}
        </div>
      </div>
    </main>
  )
}
