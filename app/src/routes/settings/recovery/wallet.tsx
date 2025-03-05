import * as Ariakit from '@ariakit/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import MetamaskIcon from '~icons/logos/metamask-icon'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import WalletCardsIcon from '~icons/lucide/wallet-cards'
import ThreeDotsIcon from '~icons/ph/dots-three-duotone'
import WalletConnectIcon from '~icons/simple-icons/walletconnect'
import CoinbaseIcon from '~icons/token-branded/coinbase'
import PhantomIcon from '~icons/token-branded/phantom'

import { Button } from '~/components/Button'
import { cn } from '~/utils'

export const Route = createFileRoute('/settings/recovery/wallet')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main
      className={cn(
        'mx-auto flex h-screen max-h-[1200px] w-full max-w-[460px] flex-col content-between items-stretch space-y-6 rounded-xl bg-transparent py-4 text-center',
        'sm:my-32 sm:h-[620px] sm:max-w-[400px] sm:bg-white sm:shadow-sm sm:outline sm:outline-gray4',
      )}
    >
      <header className="mt-4 flex justify-between px-5 sm:mt-1">
        <img src="/icons/wallet.svg" alt="Porto" className="my-auto size-11" />
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
          <li className="mr-2 text-center *:w-full *:max-w-[92%]">
            <button
              type="button"
              className="mx-5 flex h-12 max-w-full items-center justify-between space-x-3 rounded-md border-none px-1 py-2"
            >
              <MetamaskIcon className="ml-1.5 size-6" />
              <span className="ml-1 select-none text-xl">MetaMask</span>
              <ChevronRightIcon className="-mr-1.5 ml-auto size-6 text-gray9" />
            </button>
          </li>
          <Ariakit.Separator className="mx-auto my-2 w-[calc(100%-40px)] text-gray6" />
          <li className="text-center *:w-full *:max-w-[92%]">
            <button
              type="button"
              className="mx-5 flex h-12 max-w-full items-center justify-between space-x-3 rounded-md border-none px-1 py-2"
            >
              <PhantomIcon className="size-9" />
              <span className="select-none text-xl">Phantom</span>
              <ChevronRightIcon className="ml-auto size-6 text-gray9" />
            </button>
          </li>
          <Ariakit.Separator className="mx-auto my-2 w-[calc(100%-40px)] text-gray6" />
          <li className="text-center *:w-full *:max-w-[92%]">
            <button
              type="button"
              className="mx-5 flex h-12 max-w-full items-center justify-between space-x-3 rounded-md border-none px-1 py-2"
            >
              <CoinbaseIcon className="size-9" />
              <span className="-ml-0.75 select-none text-xl">
                Coinbase Wallet
              </span>
              <ChevronRightIcon className="ml-auto size-6 text-gray9" />
            </button>
          </li>
          <Ariakit.Separator className="mx-auto my-2 w-[calc(100%-40px)] text-gray6" />
          <li className="text-center *:w-full *:max-w-[92%]">
            <button
              type="button"
              className="mx-5 flex h-12 max-w-full items-center justify-between space-x-3 rounded-md border-none px-1 py-2"
            >
              <WalletConnectIcon className="ml-1 size-7 text-accent" />
              <span className="select-none text-xl">WalletConnect</span>
              <ChevronRightIcon className="ml-auto size-6 text-gray9" />
            </button>
          </li>
        </ul>

        <div className="mx-auto mb-2 flex h-11 w-full max-w-[90%] items-center justify-center rounded-md sm:mb-1">
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
