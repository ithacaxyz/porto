import * as Ariakit from '@ariakit/react'
import { Link, useRouter } from '@tanstack/react-router'
import { Hooks } from 'porto/wagmi'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import ChevronDownIcon from '~icons/lucide/chevron-down'
import ChevronLeftIcon from '~icons/lucide/chevron-left'
import CopyIcon from '~icons/lucide/copy'
import LogoutIcon from '~icons/lucide/log-out'
import SettingsIcon from '~icons/lucide/settings'

import { StringFormatter, cn } from '~/utils'

export function Header() {
  const account = useAccount()
  const disconnect = Hooks.useDisconnect()

  const router = useRouter()
  const currentPath = router.latestLocation.pathname

  return (
    <header className="mt-3 flex items-center justify-between px-2">
      {currentPath === '/' ? (
        <Link to="/" className="font-medium text-2xl">
          Porto
        </Link>
      ) : (
        <>
          <Link to="/" className="mr-3">
            <ChevronLeftIcon className="mt-0.5 size-6 rounded-full bg-gray-200 p-1 text-gray-700 hover:bg-gray-300" />
          </Link>
          <span className="mr-auto font-medium text-2xl">Settings</span>
        </>
      )}
      <div className="flex flex-row items-center gap-x-2">
        <span className="rounded-full bg-accent/20 px-2 py-1">
          {localStorage.getItem('_porto_emoji') ?? '🌀'}
        </span>
        <Ariakit.MenuProvider>
          <Ariakit.MenuButton className="flex items-center gap-x-2">
            <p className="mr-1 font-semibold text-gray-800 text-lg dark:text-gray-100">
              {StringFormatter.truncate(account?.address ?? '', {
                start: 6,
                end: 4,
              })}
            </p>
            <ChevronDownIcon className="size-6 rounded-full bg-gray-200 p-1 text-gray-700 hover:bg-gray-300" />
          </Ariakit.MenuButton>
          <Ariakit.Menu
            gutter={8}
            className={cn('w-full rounded-sm bg-gray6 p-1', '*:tracking-wide')}
          >
            <Ariakit.MenuItem
              className="flex items-center justify-between gap-x-2 rounded-sm px-3 py-2 hover:bg-gray2"
              onClick={() =>
                navigator.clipboard
                  .writeText(account?.address ?? '')
                  .then(() => toast.success('Address copied to clipboard'))
                  .catch(() => toast.error('Failed to copy address'))
              }
            >
              Copy
              <CopyIcon className="ml-3 size-3.5" />
            </Ariakit.MenuItem>
            <Ariakit.MenuSeparator className="my-1 text-secondary/60" />
            <Ariakit.MenuItem
              render={
                <Link
                  to="/settings"
                  className={cn(
                    'flex items-center justify-between gap-x-2 rounded-sm px-3 py-2 hover:bg-gray2',
                    currentPath === '/settings' && 'bg-gray2',
                  )}
                >
                  Settings
                  <SettingsIcon className="ml-3 size-4" />
                </Link>
              }
            />
            <Ariakit.MenuSeparator className="my-1 text-secondary/60" />
            <Ariakit.MenuItem
              className="flex items-center justify-between gap-x-2 rounded-sm px-3 py-2 hover:bg-gray2"
              onClick={() => disconnect.mutate({})}
            >
              Disconnect
              <LogoutIcon className="ml-3 size-3.5" />
            </Ariakit.MenuItem>
          </Ariakit.Menu>
        </Ariakit.MenuProvider>
      </div>
    </header>
  )
}
