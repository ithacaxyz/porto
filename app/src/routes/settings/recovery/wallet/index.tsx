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
import ChevronLeftIcon from '~icons/lucide/chevron-left'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import WalletCardsIcon from '~icons/lucide/wallet-cards'
import ThreeDotsIcon from '~icons/ph/dots-three-duotone'
import WalletConnectIcon from '~icons/simple-icons/walletconnect'

import { IndeterminateLoader } from '~/components/IndeterminateLoader'
import { Pill } from '~/components/Pill'
import { config } from '~/lib/Wagmi'
import { cn } from '~/utils'

const WalletConnect = React.lazy(() => import('./-components/wc'))

export const Route = createFileRoute('/settings/recovery/wallet/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { signMessageAsync, status: signMessageStatus } = useSignMessage()
  const account = useAccount()
  const connect = useConnect()
  const disconnect = useDisconnect()
  const connectors = useConnectors({ config })

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

  if (!connectors.length) return null

  return (
    <main
      className={cn(
        'mx-auto flex h-screen max-h-[940px] w-full max-w-[460px] flex-col content-between items-stretch space-y-6 rounded-xl bg-transparent py-4 text-center',
        'sm:my-32 sm:max-w-[400px] sm:bg-gray1 sm:shadow-sm sm:outline sm:outline-gray4',
        'sm:h-[710px]',
      )}
    >
      <header className="mt-4 flex justify-between px-3 sm:mt-1">
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

      <div className="mt-10 size-full sm:mt-1 sm:px-4">
        <div className="m-auto flex size-15 items-center justify-center rounded-full bg-purple-100 p-2">
          <WalletCardsIcon className="size-9 text-purple-600" />
        </div>
        <h1 className="mt-4 font-medium text-2xl">Link backup wallet</h1>
        <p className="mx-6 my-3 text-pretty text-primary">
          We will request a signature to confirm your ownership of it.
        </p>
        {isLoading && !isError && (
          <IndeterminateLoader
            className="mt-24 "
            title={
              connect.status === 'pending'
                ? 'Check your wallet for a confirmation'
                : signMessageStatus === 'pending'
                  ? 'Check your wallet for a message to sign'
                  : createAccount.status === 'pending'
                    ? 'Check your wallet for a confirmation'
                    : 'Loading...'
            }
          />
        )}
      </div>

      <div className={cn('mx-auto w-full')}>
        <ul
          className={cn('mb-2 w-full px-0.5', isLoading && 'invisible hidden')}
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
                  <span className="select-none text-xl">{connector.name}</span>
                  <ChevronRightIcon className="ml-auto size-6 text-gray9" />
                </button>
              </li>

              <Ariakit.Separator className="mx-auto w-[calc(100%-40px)] text-gray6" />
            </React.Fragment>
          ))}
          <li className="max-w-[90%] space-x-3 rounded-md border-none px-1 py-2 text-left hover:cursor-pointer">
            <WalletConnect>
              <WalletConnectIcon className={newFunction()} />
              <span className="mr-auto w-min select-none text-xl">
                WalletConnect
              </span>
              <Pill className="-ml-7 mr-auto">150+</Pill>
              <ChevronRightIcon className="ml-auto size-6 text-gray9" />
            </WalletConnect>
          </li>
        </ul>

        <div className="mx-auto mb-2 flex h-11 w-full max-w-[90%] items-center justify-center rounded-md bg-gray3 hover:bg-gray4 sm:mb-1 sm:h-12">
          <Link
            to="/settings/recovery/wallet/phrase"
            className="my-auto flex size-full min-w-full items-center justify-center rounded-md bg-gray3 font-medium text-lg text-md hover:bg-gray4"
          >
            <ThreeDotsIcon className="mt-0.25 mr-2 size-8 text-gray11" />
            <span>Use recovery phrase / private key</span>
          </Link>
        </div>
      </div>
    </main>
  )

  function newFunction(): string | undefined {
    return 'size-9 ml-1 text-accent'
  }
}
