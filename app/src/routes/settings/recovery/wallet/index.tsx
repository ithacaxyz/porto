import * as Ariakit from '@ariakit/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { useConnect, useConnectors } from 'wagmi'
import ChevronLeftIcon from '~icons/lucide/chevron-left'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import WalletCardsIcon from '~icons/lucide/wallet-cards'
import ThreeDotsIcon from '~icons/ph/dots-three-duotone'

// import { Pill } from '~/components/Pill'
import { cn } from '~/utils'

export const Route = createFileRoute('/settings/recovery/wallet/')({
  component: RouteComponent,
})

function RouteComponent() {
  const connect = useConnect()
  const connectors = useConnectors()

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
          {connectors.map((connector, index) => (
            <React.Fragment key={connector.id}>
              <li className="max-w-[90%] space-x-3 rounded-md border-none px-1 py-2 hover:cursor-pointer">
                <button
                  type="button"
                  onClick={() => connect.connectAsync({ connector })}
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
              {index !== connectors.length - 1 && (
                <Ariakit.Separator className="mx-auto w-[calc(100%-40px)] text-gray6" />
              )}
            </React.Fragment>
          ))}
        </ul>

        <div className="mx-auto mb-2 flex h-11 w-full max-w-[90%] items-center justify-center rounded-md">
          <Link
            to="/settings/recovery/wallet/phrase"
            className="my-auto mt-2 flex size-full min-w-full items-center justify-center rounded-md bg-gray3 font-medium text-md hover:bg-gray4"
          >
            <ThreeDotsIcon className="mt-0.25 mr-2 size-8 text-gray11" />
            Use recovery phrase / private key
          </Link>
        </div>
      </div>
    </main>
  )
}
