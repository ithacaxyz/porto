import * as Ariakit from '@ariakit/react'
import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import SecurityIcon from '~icons/ic/outline-security'
import ChevronDownIcon from '~icons/lucide/chevron-down'
import LockIcon from '~icons/lucide/lock'
import SettingsIcon from '~icons/lucide/settings'

import { Layout } from '~/components/AppLayout'
import { Button } from '~/components/Button'
import { Header } from '~/components/Header'
import { Pill } from '~/components/Pill'
import * as Constants from '~/lib/Constants'
import { cn } from '~/utils'

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
  head: (_context) => ({
    meta: [
      { name: 'title', content: 'Settings' },
      { name: 'description', content: 'Manage your wallet settings' },
    ],
  }),
})

function RouteComponent() {
  const account = useAccount()
  const [userEmoji, setUserEmoji] = React.useState<string>(
    localStorage.getItem('_porto_account_emoji') ?? Constants.emojisArray[0]!,
  )

  const permissions = Hooks.usePermissions()

  return (
    <Layout>
      <Header />
      <Ariakit.Separator
        orientation="horizontal"
        className="mx-auto my-2 w-full text-gray6"
      />
      <section className="px-1 sm:px-3">
        <div className="mb-4 flex items-center gap-x-3">
          <div className="w-min rounded-full bg-gray-200 p-2">
            <SettingsIcon className="size-5 text-gray-700" />
          </div>
          <p className="font-medium text-3xl">General</p>
        </div>
        <div className="flex items-center gap-x-3 pt-1">
          <div>
            <p className="text-2xl">Emoji</p>
            <p className="text-secondary ">A visual motif for your wallet.</p>
          </div>
          <Ariakit.MenuProvider>
            <Ariakit.MenuButton className="ml-auto flex items-center gap-x-3 rounded-3xl border-2 border-gray-300/60 px-1 py-0.5">
              <p className="ml-1 text-xl">{userEmoji}</p>
              <ChevronDownIcon className="size-6 rounded-full bg-gray-200 p-1 text-gray-700 hover:bg-gray-300" />
            </Ariakit.MenuButton>
            <Ariakit.Menu
              gutter={4}
              className="ml-2 space-y-1 rounded-sm bg-gray4 p-1"
            >
              {Constants.emojisArray.map((emoji) => (
                <Ariakit.MenuItem
                  key={emoji}
                  onClick={() => {
                    setUserEmoji(emoji)
                    localStorage.setItem('_porto_account_emoji', emoji)
                  }}
                  className={cn(
                    'flex items-center justify-between gap-x-2 rounded-sm px-3 py-2 hover:bg-gray2',
                    userEmoji === emoji && 'bg-gray2',
                  )}
                >
                  {emoji}
                </Ariakit.MenuItem>
              ))}
            </Ariakit.Menu>
          </Ariakit.MenuProvider>
        </div>
        <div className="mt-5 flex w-full flex-col gap-x-3 pt-1">
          <p className="text-2xl">Wallet address</p>
          <p className="text-secondary">
            This is where you will receive funds.
          </p>
          <div className="mt-2 flex w-full flex-col items-center justify-between gap-x-2 gap-y-3 sm:flex-row">
            <p
              className={cn(
                'no-scrollbar my-auto h-10 w-full overflow-auto rounded-default border border-gray6 bg-surface px-3 py-2 text-base text-gray11 tracking-normal',
                'sm:mr-2 sm:h-11 sm:w-auto sm:px-4 sm:text-lg sm:tracking-wide',
              )}
            >
              {account?.address}
            </p>
            <div className="flex w-full items-center gap-x-2.5 *:text-lg sm:w-auto">
              <Button
                variant="default"
                className="w-full sm:ml-auto"
                onClick={() =>
                  navigator.clipboard
                    .writeText(account?.address ?? '')
                    .then(() => toast.success('Copied to clipboard'))
                    .catch(() => toast.error('Failed to copy to clipboard'))
                }
              >
                Copy
              </Button>
              {navigator?.canShare && (
                <Button
                  variant="accent"
                  className="w-full sm:w-auto"
                  onClick={(_event) => {
                    if (!navigator.canShare) return
                    navigator.share({
                      text: account?.address,
                      url: import.meta.env.BASE_URL,
                      title: "Here's my Porto address:",
                    })
                  }}
                >
                  Share
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      <Ariakit.Separator
        orientation="horizontal"
        className="mx-auto my-3 w-full text-gray6"
      />
      <section className="px-1 sm:px-3">
        <div className="mb-3 flex items-center gap-x-3">
          <div className="w-min rounded-full bg-gray-200 p-2">
            <SecurityIcon className="size-5 font-bold text-black" />
          </div>
          <p className="font-medium text-3xl">Permissions</p>
        </div>
        <div className="grid h-[80px] grid-cols-4 grid-rows-2 gap-x-3 pt-1">
          <div className="col-span-3 col-start-1 col-end-4 row-start-1 row-end-1 flex flex-row items-center gap-x-3">
            <p className="text-2xl">Recovery methods</p>
            <Pill className="rounded-2xl bg-gray4 px-3 font-medium text-sm">
              {permissions.data?.length ?? 0}{' '}
              {permissions.data?.length === 1 ? 'app' : 'apps'}{' '}
            </Pill>
          </div>
          <p className="col-span-4 col-start-1 row-span-2 row-start-2 mt-2 w-full text-secondary">
            Manage spend permissions you have granted.
          </p>
          <Link
            to="/settings/permissions"
            className="col-start-4 col-end-4 row-start-1 mb-auto ml-auto h-9 w-full max-w-[105px] self-start rounded-default bg-gray4 px-3.5 text-center hover:bg-gray3"
          >
            <p className="mt-2 h-full font-medium">Manage</p>
          </Link>
        </div>
      </section>

      <Ariakit.Separator
        orientation="horizontal"
        className="mx-auto my-3 w-full text-gray6"
      />

      <section className="px-1 sm:px-3">
        <div className="mb-3 flex items-center gap-x-3">
          <div className="w-min rounded-full bg-gray-200 p-2">
            <LockIcon className="size-5 font-bold text-black" />
          </div>
          <p className="font-medium text-3xl">Security</p>
        </div>
        <div className="grid h-[80px] grid-cols-4 grid-rows-2 gap-x-3 pt-1">
          <div className="col-span-3 col-start-1 col-end-4 row-start-1 row-end-1 flex flex-row items-center gap-x-3">
            <p className="text-2xl">Recovery methods</p>
            <Pill className="rounded-2xl bg-gray4 px-3 font-medium text-sm">
              0 added
            </Pill>
          </div>

          <p className="col-span-4 col-start-1 row-span-2 row-start-2 mt-2 w-full text-secondary">
            These are used to restore access to your wallet.
          </p>

          <Link
            to="/settings/recovery"
            className="col-start-4 col-end-4 row-start-1 mb-auto ml-auto h-10 w-full max-w-[105px] self-start rounded-default bg-gray4 px-3.5 text-center hover:bg-gray3"
          >
            <p className="mt-2 h-full font-medium">Manage</p>
          </Link>
        </div>
      </section>
    </Layout>
  )
}
