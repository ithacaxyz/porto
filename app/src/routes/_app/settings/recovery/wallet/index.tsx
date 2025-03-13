import * as Ariakit from '@ariakit/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import {
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
  useSignMessage,
} from 'wagmi'
import CheckMarkIcon from '~icons/lucide/check'
import ChevronLeftIcon from '~icons/lucide/chevron-left'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import WalletCardsIcon from '~icons/lucide/wallet-cards'
import ThreeDotsIcon from '~icons/ph/dots-three-duotone'

import { IndeterminateLoader } from '~/components/IndeterminateLoader'
import { cn } from '~/utils'
import { mipdConfig as config } from './-MipdWagmi'

export const Route = createFileRoute('/_app/settings/recovery/wallet/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { signMessageAsync, status: signMessageStatus } = useSignMessage()
  const account = useAccount()
  const connect = useConnect()
  const disconnect = useDisconnect()
  const _connectors = useConnectors({ config })
  const connectors = React.useMemo(() => {
    return _connectors.filter(
      (connector) => connector.id !== 'xyz.ithaca.porto',
    )
  }, [_connectors])
  const createAccount = Hooks.useCreateAccount()

  const isLoading =
    connect.status === 'pending' ||
    disconnect.status === 'pending' ||
    signMessageStatus === 'pending' ||
    createAccount.status === 'pending'

  const isError =
    connect.status === 'error' ||
    disconnect.status === 'error' ||
    signMessageStatus === 'error' ||
    createAccount.status === 'error'

  const success = signMessageStatus === 'success'

  if (!connectors.length) return null

  return (
    <main
      className={cn(
        'mx-auto flex w-full flex-col items-center justify-center bg-transparent',
        'pt-32',
      )}
    >
      <div
        className={cn([
          'sm:max-h-full',
          'content-between items-stretch space-y-6 rounded-xl',
          'max-w-[460px] pt-2 pb-4 text-center sm:max-w-[400px] sm:bg-gray1 sm:pt-3 sm:shadow-sm sm:outline sm:outline-gray4',
        ])}
      >
        <header className="mt-4 flex justify-between px-4 sm:mt-1 sm:px-3">
          <Link
            to="/settings/recovery"
            from="/settings/recovery/wallet"
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

        <div className="size-full sm:px-4">
          {!isLoading && (
            <React.Fragment>
              {!success ? (
                <React.Fragment>
                  <div className="m-auto flex size-15 items-center justify-center rounded-full bg-purple-100 p-2">
                    <WalletCardsIcon className="size-9 text-purple-600" />
                  </div>
                  <h1 className="mt-4 font-medium text-2xl">
                    Link backup wallet
                  </h1>
                  <p className="mx-6 mt-3 text-pretty text-primary">
                    We will request a signature to confirm your ownership of it.
                  </p>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="m-auto mt-24 flex size-15 items-center justify-center rounded-full bg-green4">
                    <CheckMarkIcon className="mx-auto size-9 text-green-600" />
                  </div>
                  <h1 className="mt-4 font-medium text-2xl">
                    Added backup wallet
                  </h1>
                  <p className="mx-6 my-3 text-pretty text-primary">
                    You can now use this wallet to recover your passkey if you
                    ever lose access to it.
                  </p>
                </React.Fragment>
              )}
            </React.Fragment>
          )}

          {isLoading && !isError && (
            <div className="">
              <IndeterminateLoader
                spinnerSize={16}
                className="mt-14 flex flex-col"
                title="Pending signature"
                description="Please check your wallet for a signature confirmation"
                hint="This will verify ownership of the wallet, and allow it to recover this passkey"
              />
            </div>
          )}
        </div>

        <div className={cn('mx-auto w-full')}>
          <ul
            className={cn(
              'mb-5 w-full px-0.5',
              'max-h-[350px] overflow-y-scroll',
              (isLoading || success) && 'invisible hidden',
            )}
          >
            {connectors.map((connector) => (
              <React.Fragment key={connector.id}>
                <li
                  data-connector={connector.id}
                  className="max-w-[90%] space-x-3 rounded-md border-none px-1 py-2 hover:cursor-pointer"
                >
                  <button
                    type="button"
                    onClick={async (event) => {
                      event.preventDefault()
                      event.stopPropagation()

                      const address = account.address

                      disconnect
                        .disconnectAsync()
                        .then(() => connect.connectAsync({ connector }))
                        .then(() =>
                          signMessageAsync({
                            account: address,
                            message: `${new Date().toISOString()}\nI'm the owner of this wallet\nSigning a message to confirm my ownership`,
                          }),
                        )
                        .then((signature) =>
                          toast.success(`Signed\n${signature}`),
                        )
                        .catch((error) => toast.error(error.message))
                    }}
                    className="mx-5 flex h-12 w-full max-w-full items-center justify-between space-x-4 rounded-md border-none p-1 hover:cursor-pointer hover:bg-gray3"
                  >
                    <img
                      src={connector.icon}
                      alt={connector.name}
                      className="ml-1 size-9"
                    />
                    <span className="select-none text-xl">
                      {connector.name}
                    </span>
                    <ChevronRightIcon className="ml-auto size-6 text-gray9" />
                  </button>
                </li>

                <Ariakit.Separator className="mx-auto w-[calc(100%-40px)] text-gray6" />
              </React.Fragment>
            ))}
          </ul>
          {success ? (
            <div className="mx-auto mb-2 flex h-11 w-full max-w-[90%] items-center justify-center space-x-2.5 rounded-md">
              <Link
                reloadDocument
                to="/settings/recovery/wallet"
                from="/settings/recovery/wallet"
                className="my-auto mt-2 flex size-full max-w-[50%] items-center justify-center rounded-md bg-gray3 font-medium text-md hover:bg-gray4"
              >
                Add another
              </Link>
              <Link
                to="/"
                from="/settings/recovery/wallet"
                className="my-auto mt-2 flex size-full max-w-[50%] items-center justify-center rounded-md bg-accent font-medium text-md text-white hover:bg-accentHover"
              >
                Continue
              </Link>
            </div>
          ) : (
            <div className="mx-auto mb-2 flex h-11 w-full max-w-[90%] items-center justify-center rounded-md bg-gray3 hover:bg-gray4 sm:mb-1 sm:h-12">
              <Link
                to="/settings/recovery/wallet/phrase"
                className="my-auto flex size-full min-w-full items-center justify-center rounded-md bg-gray3 font-medium text-lg text-md hover:bg-gray4"
              >
                <ThreeDotsIcon className="mt-0.25 mr-2 size-8 text-gray11" />
                <span>Use recovery phrase / private key</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
