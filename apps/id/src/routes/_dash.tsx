import { LogoLockup, LogoMark } from '@porto/apps/components'
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import * as React from 'react'
import { useAccount, useAccountEffect, useDisconnect } from 'wagmi'
import { StringFormatter } from '~/utils'
import LucideChevronUp from '~icons/lucide/chevron-up'
import LucideCircleDollarSign from '~icons/lucide/circle-dollar-sign'
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
      navigate({ to: '/auth' })
    },
  })

  const links = React.useMemo(() => {
    return [
      { Icon: LucideSendHorizontal, name: 'Send', to: '/' },
      { Icon: LucideQrCode, name: 'Receive', to: '/receive' },
      { Icon: LucideCoins, name: 'Assets', to: '/assets' },
      { Icon: LucideCircleDollarSign, name: 'Savings', to: '/savings' },
      { Icon: LucideClock, name: 'Activity', to: '/activity' },
      { Icon: LucideCog, name: 'Settings', to: '/settings' },
    ]
  }, [])

  return (
    <div className="mx-auto flex h-full max-w-384 flex-col gap-4 px-7.5 py-6 pb-7.5 md:flex-row">
      <div className="flex w-full items-center justify-between md:h-full md:min-w-72.75 md:max-w-72.75 md:flex-col md:items-stretch md:justify-start md:gap-6 md:rounded-2xl md:bg-gray3">
        <header className="flex h-fit justify-between md:px-9 md:pt-8">
          <div>
            <div className="hidden h-7.5 w-fit md:block">
              <LogoLockup />
            </div>
            <div className="block h-7.5 w-9 md:hidden">
              <LogoMark />
            </div>
          </div>
          <div className="hidden size-6.5 rounded-full border border-gray6 text-gray10 md:block">
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>help</title>
              <path
                d="M9.08984 9.00008C9.32495 8.33175 9.789 7.76819 10.3998 7.40921C11.0106 7.05024 11.7287 6.91902 12.427 7.03879C13.1253 7.15857 13.7587 7.52161 14.2149 8.06361C14.6712 8.60561 14.9209 9.2916 14.9198 10.0001C14.9198 12.0001 11.9198 13.0001 11.9198 13.0001"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
              <path
                d="M12 17H12.01"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </div>
        </header>

        <nav className="-translate-x-1/2 fixed inset-x-auto bottom-5 left-1/2 flex h-15.5 flex-row items-center rounded-full border border-gray4 bg-gray1 px-2 md:relative md:inset-x-0 md:bottom-0 md:left-auto md:h-auto md:translate-x-0 md:flex-col md:rounded-none md:border-none md:bg-transparent md:px-5">
          {links.map((link) => (
            <Link
              activeProps={{
                className: 'bg-gray1 text-gray12',
              }}
              className="flex h-12 w-full items-center gap-2.25 rounded-full px-4"
              inactiveProps={{
                className: 'text-gray10 dark:text-gray11',
              }}
              key={link.to}
              to={link.to}
            >
              <link.Icon className="size-6 in-data-[status=active]:text-accent! text-gray8 dark:text-gray9" />
              <span className="sr-only font-medium text-[17px] md:not-sr-only">
                {link.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="md:mt-auto md:px-5 md:pb-5">
          <button
            className="flex h-11 items-center justify-between gap-2.25 rounded-full bg-gray1 px-4 text-gray12 md:w-full"
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
      <Outlet />
    </div>
  )
}
