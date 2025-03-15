import * as Ariakit from '@ariakit/react'
import { Link, Navigate, useLocation } from '@tanstack/react-router'
import { cx } from 'cva'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import ChevronDownIcon from '~icons/lucide/chevron-down'
import ChevronLeftIcon from '~icons/lucide/chevron-left'
import CopyIcon from '~icons/lucide/copy'
import LogoutIcon from '~icons/lucide/log-out'
import SettingsIcon from '~icons/lucide/settings'
import ThemeIcon from '~icons/mdi/theme-light-dark'

import { useThemeMode } from '~/hooks/use-theme-mode'
import { StringFormatter } from '~/utils'
import { DevOnly } from './DevOnly'

export function Header() {
  const { theme, setTheme } = useThemeMode()

  const account = useAccount()

  const disconnect = Hooks.useDisconnect()

  const location = useLocation()
  const currentFullPath = location.pathname
  const currentPathSegment = currentFullPath.split('/').pop()

  if (account.isDisconnected) return <Navigate to="/" />

  return (
    <React.Fragment>
      <DevOnly />
      <header className="flex items-center justify-between tabular-nums sm:mt-3 sm:px-2">
        {currentFullPath === '/' ? (
          <Link
            to="/"
            className="flex items-center gap-x-2 font-medium text-2xl"
          >
            {theme === 'light' ? (
              <img
                alt="Porto wallet icon"
                src="/icon-light.png"
                className="my-auto size-9"
              />
            ) : (
              <img
                alt="Porto wallet icon"
                src="/icon-dark.png"
                className="my-auto size-9"
              />
            )}
            <span>Porto</span>
          </Link>
        ) : (
          <>
            <Link
              to={
                currentFullPath.split('/').length > 2
                  ? currentFullPath.split('/').slice(0, -1).join('/')
                  : '/'
              }
              className="mr-3"
            >
              <ChevronLeftIcon className="mt-0.5 size-6 rounded-full bg-gray3 p-1 text-gray11 hover:bg-gray4" />
            </Link>
            <span className="mr-auto font-medium text-2xl capitalize">
              {currentPathSegment}
            </span>
          </>
        )}
        <div className="flex flex-row items-center gap-x-2">
          <span className="rounded-full bg-blue9/20 px-3 py-2 text-md">
            {localStorage.getItem('_porto_account_emoji') ?? '🌀'}
          </span>
          <Ariakit.MenuProvider>
            <Ariakit.MenuButton className="flex items-center gap-x-2">
              <p className="mr-1 font-semibold text-lg">
                {StringFormatter.truncate(account?.address ?? '', {
                  start: 6,
                  end: 4,
                })}
              </p>
              <ChevronDownIcon className="size-7 rounded-full bg-gray3 p-1 text-gray11 hover:bg-gray4" />
            </Ariakit.MenuButton>

            <Ariakit.Menu
              gutter={8}
              backdrop={<div className="fixed inset-0 bg-black/10" />}
              className={cx(
                'w-full rounded-lg bg-gray2 p-1 shadow-sm outline-[1.5px] outline-gray4',
                '*:tracking-wide',
              )}
            >
              <Ariakit.MenuItem
                className="flex items-center justify-between gap-x-2 rounded-sm px-3 py-3 hover:bg-gray3"
                onClick={() =>
                  navigator.clipboard
                    .writeText(account?.address ?? '')
                    .then(() => toast.success('Address copied to clipboard'))
                    .catch(() => toast.error('Failed to copy address'))
                }
              >
                <CopyIcon className="size-5" />
                <span className="mr-auto text-left">Copy</span>
              </Ariakit.MenuItem>
              <Ariakit.MenuSeparator className="mx-auto my-1 w-[85%] text-secondary/40" />
              <Ariakit.MenuItem
                render={(props) => (
                  <Link
                    {...props}
                    to="/settings"
                    className={cx(
                      'text-left',
                      'flex items-center justify-between gap-x-2 rounded-sm px-3 py-2 hover:bg-gray3',
                      currentFullPath === '/settings' && 'bg-gray3',
                    )}
                  >
                    <SettingsIcon className="size-5" />
                    <span className="mr-auto">Settings</span>
                  </Link>
                )}
              />
              <Ariakit.MenuSeparator
                className="mx-auto my-1 w-[85%] text-secondary/40"
                hidden={true}
              />
              <Ariakit.MenuItem
                hidden={true}
                data-theme={theme}
                className="flex cursor-default items-center justify-between gap-x-2 rounded-sm px-3 py-2 hover:bg-gray3"
                onClick={(event) => {
                  const theme = event.currentTarget.dataset.theme
                  if (theme === 'light') setTheme('dark')
                  else setTheme('light')

                  console.info(theme)
                }}
              >
                <span>{theme === 'light' ? 'Dark' : 'Light'} mode</span>
                <ThemeIcon className="size-5" />
              </Ariakit.MenuItem>
              <Ariakit.MenuSeparator className="mx-auto my-1 w-[85%] text-secondary/40" />
              <Ariakit.MenuItem
                className="ml-0.5 flex cursor-default items-center justify-between gap-x-2 rounded-sm px-3 py-2 hover:bg-gray3"
                onClick={() => disconnect.mutate({})}
              >
                <LogoutIcon className="size-4.5 text-red9" />
                Disconnect
              </Ariakit.MenuItem>
            </Ariakit.Menu>
          </Ariakit.MenuProvider>
        </div>
      </header>
    </React.Fragment>
  )
}
