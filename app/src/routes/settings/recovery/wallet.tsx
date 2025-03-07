import * as Ariakit from '@ariakit/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { toast } from 'sonner'
import { useConnect, useConnectors } from 'wagmi'
import MetamaskIcon from '~icons/logos/metamask-icon'
import ChevronLeftIcon from '~icons/lucide/chevron-left'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import WalletCardsIcon from '~icons/lucide/wallet-cards'
import ThreeDotsIcon from '~icons/ph/dots-three-duotone'
import WalletConnectIcon from '~icons/simple-icons/walletconnect'
import CoinbaseIcon from '~icons/token-branded/coinbase'
import PhantomIcon from '~icons/token-branded/phantom'

import { Button } from '~/components/Button'
import { Pill } from '~/components/Pill'
import { cn } from '~/utils'

export const Route = createFileRoute('/settings/recovery/wallet')({
  component: RouteComponent,
})

function RouteComponent() {
  const connect = useConnect()
  const connectors = useConnectors()

  const metamaskConnector = React.useMemo(
    () => connectors.find((connector) => connector.id === 'io.metamask'),
    [connectors],
  )

  const phantomConnector = React.useMemo(
    () => connectors.find((connector) => connector.id === 'app.phantom'),
    [connectors],
  )

  const coinbaseConnector = React.useMemo(
    () => connectors.find((connector) => connector.id === 'coinbase'),
    [connectors],
  )

  const walletConnectConnector = React.useMemo(
    () => connectors.find((connector) => connector.id === 'walletconnect'),
    [connectors],
  )

  return (
    <main
      className={cn(
        'mx-auto flex h-screen max-h-[1200px] w-full max-w-[460px] flex-col content-between items-stretch space-y-6 rounded-xl bg-transparent py-4 text-center',
        'sm:my-32 sm:h-[625px] sm:max-w-[400px] sm:bg-gray1 sm:shadow-sm sm:outline sm:outline-gray4',
      )}
    >
      <header className="mt-4 flex justify-between px-5 sm:mt-1">
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
      </div>

      <div className="mx-auto w-full">
        <ul className="mb-2 w-full px-0.5">
          <li
            className={cn(
              'mr-2 text-center *:w-full *:max-w-[92%]',
              !metamaskConnector && 'opacity-50',
            )}
          >
            <button
              type="button"
              onClick={() =>
                connect
                  .connectAsync({ connector: metamaskConnector! })
                  .then(() => toast.success('Connected to MetaMask'))
                  .catch((error) => toast.error(error.message))
              }
              className="mx-5 flex h-12 max-w-full items-center justify-between space-x-3 rounded-md border-none px-1 py-2 hover:cursor-pointer"
            >
              <MetamaskIcon className="ml-1.5 size-6" />
              <span className="ml-1 select-none text-xl">MetaMask</span>
              <ChevronRightIcon className="-mr-1.5 ml-auto size-6 text-gray9" />
            </button>
          </li>
          <Ariakit.Separator className="mx-auto my-2 w-[calc(100%-40px)] text-gray6" />
          <li
            className={cn(
              'text-center *:w-full *:max-w-[92%]',
              !phantomConnector && 'opacity-50',
            )}
          >
            <button
              type="button"
              onClick={() =>
                connect
                  .connectAsync({ connector: phantomConnector! })
                  .then(() => toast.success('Connected to Phantom'))
                  .catch((error) => toast.error(error.message))
              }
              className="mx-5 flex h-12 max-w-full items-center justify-between space-x-3 rounded-md border-none px-1 py-2 hover:cursor-pointer"
            >
              <PhantomIcon className="size-9" />
              <span className="select-none text-xl">Phantom</span>
              <ChevronRightIcon className="ml-auto size-6 text-gray9" />
            </button>
          </li>
          <Ariakit.Separator className="mx-auto my-2 w-[calc(100%-40px)] text-gray6" />
          <li
            className={cn(
              'text-center *:w-full *:max-w-[92%]',
              !coinbaseConnector && 'opacity-50',
            )}
          >
            <button
              type="button"
              onClick={() =>
                connect
                  .connectAsync({ connector: coinbaseConnector! })
                  .then(() => toast.success('Connected to Coinbase'))
                  .catch((error) => toast.error(error.message))
              }
              className="mx-5 flex h-12 max-w-full items-center justify-between space-x-3 rounded-md border-none px-1 py-2 hover:cursor-pointer"
            >
              <CoinbaseIcon className="size-9" />
              <span className="-ml-0.75 select-none text-xl">
                Coinbase Wallet
              </span>
              <ChevronRightIcon className="ml-auto size-6 text-gray9" />
            </button>
          </li>
          <Ariakit.Separator className="mx-auto my-2 w-[calc(100%-40px)] text-gray6" />
          <li
            className={cn(
              'text-center *:w-full *:max-w-[92%]',
              !walletConnectConnector && 'opacity-50',
            )}
          >
            <button
              type="button"
              onClick={() =>
                connect
                  .connectAsync({ connector: walletConnectConnector! })
                  .then(() => toast.success('Connected to WalletConnect'))
                  .catch((error) => toast.error(error.message))
              }
              className="mx-5 flex h-12 max-w-full items-center justify-between space-x-3 rounded-md border-none px-1 py-2 hover:cursor-pointer"
            >
              <WalletConnectIcon className="ml-1 size-7 text-accent" />
              <span className="select-none text-xl">WalletConnect</span>
              <Pill className="text-[10px]">150+</Pill>
              <ChevronRightIcon className="ml-auto size-6 text-gray9" />
            </button>
          </li>
        </ul>

        <div className="mx-auto mb-2 flex h-11 w-full max-w-[90%] items-center justify-center rounded-md">
          <Button
            variant="default"
            className="my-auto mt-2 size-full min-w-full rounded-md bg-gray3! font-medium text-lg hover:bg-gray4!"
          >
            <ThreeDotsIcon className="mt-0.25 mr-2 size-8 text-gray11" />
            Use recovery phrase
          </Button>
        </div>
      </div>
    </main>
  )
}
