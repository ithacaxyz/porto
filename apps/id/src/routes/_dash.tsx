import * as Ariakit from '@ariakit/react'
import { LogoLockup, LogoMark } from '@porto/apps/components'
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { cx } from 'cva'
import * as React from 'react'
import { useAccount, useAccountEffect, useDisconnect } from 'wagmi'
import { StringFormatter } from '~/utils'
import QuestionMarkIcon from '~icons/ic/baseline-question-mark'
import LucideChevronUp from '~icons/lucide/chevron-up'
import LucideClock from '~icons/lucide/clock'
import LucideCog from '~icons/lucide/cog'
import LucideCoins from '~icons/lucide/coins'
import LucideQrCode from '~icons/lucide/qr-code'
import LucideSendHorizontal from '~icons/lucide/send-horizontal'

export const Route = createFileRoute('/_dash')({
  beforeLoad(opts) {
    const { context } = opts
    if (!context.account.address) throw redirect({ to: '/auth' })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { address } = useAccount()
  const disconnect = useDisconnect()

  const navigate = useNavigate()
  useAccountEffect({
    onDisconnect() {
      void navigate({ to: '/auth' })
    },
  })
  React.useEffect(() => {
    if (!address) void navigate({ to: '/auth' })
  }, [address, navigate])

  const links = React.useMemo(() => {
    return [
      { Icon: LucideSendHorizontal, name: 'Send', to: '/' },
      { Icon: LucideQrCode, name: 'Receive', to: '/receive' },
      { Icon: LucideCoins, name: 'Assets', to: '/assets' },
      // { Icon: LucideCircleDollarSign, name: 'Savings', to: '/savings' },
      { Icon: LucideClock, name: 'Activity', to: '/activity' },
      { Icon: LucideCog, name: 'Settings', to: '/settings' },
    ]
  }, [])

  return (
    <div className="mx-auto flex h-full max-w-384 flex-col gap-4 bg-gray2 px-7.5 py-6 pb-7.5 md:flex-row">
      <div className="flex w-full items-center justify-between md:fixed md:inset-y-6 md:bottom-6 md:min-w-72.75 md:max-w-72.75 md:flex-col md:items-stretch md:justify-start md:gap-6 md:rounded-2xl md:bg-gray3">
        <header className="flex h-fit w-full justify-between md:px-9 md:pt-8">
          <div>
            <div className="hidden h-7.5 w-fit md:block">
              <LogoLockup />
            </div>
            <div className="ml-2 block h-7.5 w-9 md:hidden">
              <LogoMark />
            </div>
          </div>
          <Ariakit.Button
            className="hidden size-7 rounded-full md:block"
            render={
              <a
                className=""
                href="https://t.me/porto_devs"
                rel="noreferrer"
                target="_blank"
              >
                <QuestionMarkIcon className="mx-auto inline-block size-6 rounded-full p-1 align-middle text-gray10 outline outline-gray6" />
              </a>
            }
          />
        </header>
        <div className="absolute right-0.5 bottom-0 block h-[15%] w-full min-w-full backdrop-blur-[1px] md:bottom-0 md:hidden" />

        <nav
          className={cx(
            '-translate-x-1/2 fixed inset-x-auto bottom-5 left-1/2 flex h-16 w-full max-w-[90%] flex-row items-center rounded-full border border-gray4 bg-gray1 px-2 md:relative md:inset-x-0 md:bottom-0 md:left-auto md:h-auto md:max-w-full md:translate-x-0 md:flex-col md:gap-px md:rounded-none md:border-none md:bg-transparent md:px-5',
          )}
        >
          {links.map((link) => (
            <Link
              activeProps={{
                className: 'bg-gray1 text-gray12 md:border-none',
              }}
              className="flex h-full max-h-[55px]! w-full items-center justify-start gap-2.25 rounded-none px-4 font-medium text-base first:rounded-l-full last:rounded-r-full last:border-r-0 last:border-l-full hover:bg-accentTint/20 md:h-14 md:justify-stretch md:rounded-full"
              inactiveProps={{
                className: 'text-gray10 dark:text-gray11',
              }}
              key={link.to}
              to={link.to}
            >
              <link.Icon className="size-7 in-data-[status=active]:text-accent! text-gray8 dark:text-gray9" />
              <span className="sr-only font-medium text-[17px] md:not-sr-only">
                {link.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="w-full md:mt-auto md:px-5 md:pb-5">
          <button
            className="ml-auto flex h-11 items-center justify-between gap-2.25 rounded-full bg-gray1 px-4 text-gray12 md:w-full"
            onClick={() => disconnect.disconnect()}
            type="button"
          >
            <span className="font-medium text-[17px]" title={address}>
              {StringFormatter.truncate(address ?? '')}
            </span>
            <LucideChevronUp className="rotate-180 text-gray8 md:rotate-0 dark:text-gray9" />
          </button>
        </div>
      </div>

      <div className="h-full w-full md:ms-72.75 md:ps-4">
        <Outlet />
      </div>
    </div>
  )
}
