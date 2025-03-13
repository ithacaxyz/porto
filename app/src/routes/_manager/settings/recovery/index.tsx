import * as Ariakit from '@ariakit/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import MailIcon from '~icons/ic/outline-mail'
import SecurityIcon from '~icons/ic/outline-security'
import ChevronRightIcon from '~icons/lucide/chevron-right'
import WalletCardsIcon from '~icons/lucide/wallet-cards'

import { Pill } from '~/components/Pill'
import { useThemeMode } from '~/hooks/use-theme-mode'
import { cn } from '~/utils'

export const Route = createFileRoute('/_manager/settings/recovery/')({
  component: RouteComponent,
})

const recoveryMethods = [
  {
    icon: <WalletCardsIcon className="size-6" />,
    title: 'Backup wallet',
    disabled: false,
    description: 'Backup your wallet to a file',
    path: '/settings/recovery/wallet',
  },
  {
    icon: <MailIcon className="size-6" />,
    title: 'Email address',
    disabled: true,
    description: 'Add an email address to your wallet',
    path: '/settings/recovery/email',
  },
] satisfies ReadonlyArray<{
  icon: React.ReactNode
  title: string
  disabled: boolean
  description: string
  path: string
}>

function RouteComponent() {
  const { theme } = useThemeMode()

  return (
    <main
      className={cn(
        'mx-auto flex h-full w-full max-w-[460px] flex-col content-between items-stretch space-y-6 rounded-xl pt-2 pb-4 text-center',
        'sm:my-52 sm:h-[500px] sm:max-w-[400px] sm:bg-gray1 sm:pt-3 sm:shadow-sm sm:outline sm:outline-gray4',
      )}
    >
      <header className="mt-4 flex justify-between px-4 sm:mt-1 sm:px-3">
        <Link to="/">
          <img
            alt="Porto wallet icon"
            className="my-auto size-11"
            src={theme === 'light' ? '/icon-light.png' : '/icon-dark.png'}
          />
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
        <div className="m-auto flex size-14 items-center justify-center rounded-full bg-purple-100 p-2">
          <SecurityIcon className="size-9 text-purple-600" />
        </div>
        <h1 className="mt-4 font-medium text-2xl">Add a recovery method</h1>
        <p className="mx-6 my-3 text-pretty text-primary">
          If you lose access, recover your wallet with an email or another
          wallet.
        </p>
      </div>

      <div className="mb-auto">
        <ul className="mb-3 w-full px-0.5">
          {recoveryMethods.map((recoveryMethod, index) => (
            <li key={recoveryMethod.title}>
              <Link
                to={recoveryMethod.path}
                className="mx-5 flex h-14 items-center justify-between space-x-3 rounded-md px-1 py-2"
              >
                <div
                  className={cn(
                    'rounded-full p-2 outline outline-gray5',
                    recoveryMethod.disabled && 'text-gray9',
                  )}
                >
                  {recoveryMethod.icon}
                </div>
                <span
                  className={cn(
                    'select-none font-medium text-xl',
                    recoveryMethod.disabled && 'text-gray9',
                  )}
                >
                  {recoveryMethod.title}
                </span>
                {recoveryMethod.disabled && <Pill>coming soon</Pill>}
                <ChevronRightIcon className="ml-auto size-6 text-gray9" />
              </Link>
              {index % 2 === 0 && (
                <Ariakit.Separator className="mx-auto my-2 w-[calc(100%-40px)] text-gray6" />
              )}
            </li>
          ))}
        </ul>

        <div className="mx-auto mb-2 flex h-11 w-full max-w-[90%] items-center justify-center rounded-md bg-gray3 hover:bg-gray4 sm:mb-1 sm:h-12">
          <Link
            to="/settings"
            className="my-auto mt-2 size-full min-w-full rounded-md font-medium text-lg"
          >
            I'll do this later
          </Link>
        </div>
      </div>
    </main>
  )
}
