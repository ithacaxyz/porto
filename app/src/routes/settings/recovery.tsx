import * as Ariakit from '@ariakit/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import InboxIcon from '~icons/ic/outline-inbox'
import SecurityIcon from '~icons/ic/outline-security'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import WalletCardsIcon from '~icons/lucide/wallet-cards'

import { cn } from '~/utils'

export const Route = createFileRoute('/settings/recovery')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main
      className={cn(
        'mx-auto flex h-screen max-h-[940px] w-full max-w-[460px] flex-col content-between items-stretch space-y-6 rounded-xl bg-white py-4 text-center',
        'sm:my-52 sm:h-[500px] sm:max-w-[400px] sm:shadow-sm sm:outline sm:outline-gray4',
      )}
    >
      <header className="mt-4 flex justify-between sm:mt-1 sm:px-5">
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
        <div className="m-auto flex size-14 items-center justify-center rounded-full bg-purple-200 p-2">
          <SecurityIcon className="size-9 text-purple-600" />
        </div>
        <h1 className="mt-4 font-medium text-2xl">Add a recovery method</h1>
        <p className="mx-6 my-3 text-pretty text-primary">
          If you lose access, recover your wallet with an email or another
          wallet.
        </p>
      </div>

      <div className="">
        <div className="mb-3 w-full px-0.5">
          <Link
            to="/"
            from="/settings/recovery"
            className="mx-5 flex h-14 items-center justify-between space-x-3 rounded-md px-1 py-2 hover:bg-gray2"
          >
            <div className="rounded-full p-2 outline outline-gray5">
              <WalletCardsIcon className="size-6" />
            </div>
            <span className="font-medium text-xl">Backup wallet</span>
            <ChevronRightIcon className="ml-auto size-6 text-gray9" />
          </Link>
          <Ariakit.Separator className="mx-auto my-2 w-[calc(100%-40px)] text-gray6" />
          <Link
            to="/"
            from="/settings/recovery"
            className="mx-5 flex h-14 items-center justify-between space-x-3 rounded-md px-1 py-2 hover:bg-gray2"
          >
            <div className="rounded-full p-2 outline outline-gray5">
              <InboxIcon className="size-6" />
            </div>
            <span className="font-medium text-xl">Email address</span>
            <ChevronRightIcon className="ml-auto size-6 text-gray9" />
          </Link>
        </div>

        <div className="mx-auto mb-2 flex h-11 w-full max-w-[90%] items-center justify-center rounded-md bg-gray3 hover:bg-gray4 sm:mb-1">
          <Link
            to="/settings"
            from="/settings/recovery"
            className="my-auto mt-2 size-full min-w-full rounded-md font-medium text-lg"
          >
            I'll do this later
          </Link>
        </div>
      </div>
    </main>
  )
}
