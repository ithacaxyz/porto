import * as Ariakit from '@ariakit/react'
import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Hooks } from 'porto/wagmi'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import PermissionIcon from '~icons/arcticons/permissionsmanager'
import LockIcon from '~icons/lucide/lock'
import SettingsIcon from '~icons/lucide/settings'
// import WarningIcon from '~icons/ph/warning-octagon'

import { Layout } from '~/components/AppLayout'
import { Button } from '~/components/Button'
import { Header } from '~/components/Header'
import { Pill } from '~/components/Pill'

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
  head: (_context) => ({
    meta: [
      { name: 'title', content: 'Settings' },
      { name: 'description', content: 'Manage your wallet settings' },
    ],
  }),
})

const emojis = ['🌀', '🚀', '🌟', '🌈', '🌸']

function RouteComponent() {
  const account = useAccount()

  const permissions = Hooks.usePermissions()

  return (
    <Layout>
      <Header />
      <Ariakit.Separator
        orientation="horizontal"
        className="mx-auto my-2 w-full text-gray6"
      />
      <section className="px-3">
        <div className="mb-4 flex items-center gap-x-3">
          <div className="w-min rounded-full bg-gray-200 p-2">
            <SettingsIcon className="size-5 text-gray-700" />
          </div>
          <p className="font-medium text-xl">General</p>
        </div>
        {/* <div className="flex items-center gap-x-3 pt-1">
          <div>
            <p className="text-lg">Emoji</p>
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
              {emojis.map((emoji) => (
                <Ariakit.MenuItem
                  key={emoji}
                  onClick={() => {
                    setUserEmoji(emoji)
                    localStorage.setItem('_porto_emoji', emoji)
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
        </div> */}
        <div className="mt-5 flex w-full flex-col gap-x-3 pt-1">
          <p className="text-lg">Wallet address</p>
          <p className="text-secondary ">
            This is where you will receive funds.
          </p>
          <div className="mt-2 flex w-full flex-row items-center justify-between gap-x-2">
            <p className="mr-2 w-full overflow-auto rounded-default border border-gray6 px-3.5 py-1 text-secondary tracking-normal md:tracking-wide ">
              {account?.address}
            </p>
            <Button
              variant="default"
              className="ml-auto"
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
                onClick={(_event) => {
                  if (!navigator.canShare) return
                  navigator.share({
                    text: account?.address,
                    title: "Here's my Porto address:",
                  })
                }}
              >
                Share
              </Button>
            )}
          </div>
        </div>
      </section>
      <Ariakit.Separator
        orientation="horizontal"
        className="mx-auto my-2 w-full text-gray6"
      />
      <section className="px-3">
        <div className="mb-4 flex items-center gap-x-3">
          <div className="w-min rounded-full bg-gray-200 p-2">
            <PermissionIcon className="size-5 font-bold text-black" />
          </div>
          <p className="font-medium text-xl">Permissions</p>
        </div>
        <div className="flex items-center justify-between gap-x-3 pt-1">
          <div>
            <div className="flex items-center gap-x-2">
              <p className="text-lg">Spending</p>
              <Pill className="rounded-2xl bg-gray4 px-2 font-medium">
                {permissions.data?.length ?? 0}{' '}
                {permissions.data?.length === 1 ? 'app' : 'apps'}
              </Pill>
            </div>
            <p className="text-secondary ">
              Manage spend permissions you have granted.
            </p>
          </div>
          <Link
            to="/settings/permissions"
            className="h-10 rounded-default bg-gray4 px-3.5 hover:bg-gray3"
          >
            <p className="mt-2 h-full font-medium">Manage</p>
          </Link>
        </div>
      </section>
      <Ariakit.Separator
        orientation="horizontal"
        className="mx-auto my-3 w-full text-gray6"
      />
      <section className="px-3">
        <div className="mb-4 flex items-center gap-x-3">
          <div className="w-min rounded-full bg-gray-200 p-2">
            <LockIcon className="size-5 font-bold text-black" />
          </div>
          <p className="font-medium text-xl">Security</p>
        </div>
        <div className="flex items-center justify-between gap-x-3 pt-1">
          <div>
            <div className="flex items-center gap-x-2">
              <p className="text-lg">Recovery methods</p>
              <Pill className="rounded-2xl bg-gray4 px-2 font-medium">
                0 added
              </Pill>
            </div>
            <p className="text-secondary ">
              These are used to restore access to your wallet.
            </p>
          </div>
          <Link
            to="/settings/recovery"
            className="h-10 rounded-default bg-gray4 px-3.5 hover:bg-gray3"
          >
            <p className="mt-2 h-full font-medium">Manage</p>
          </Link>
        </div>
        {/* <div className="mt-5 flex items-center justify-between gap-x-3 pt-1">
          <div>
            <div className="flex items-center gap-x-2">
              <p className="text-lg">Export wallet</p>
            </div>
            <p className="text-secondary ">
              Use your wallet in another application.
            </p>
          </div>
          <Button
            variant="destructive"
            className="rounded-default bg-red9 font-medium text-white hover:text-red11 active:text-white"
          >
            Reveal phrase
          </Button>
        </div>
        <div className="mx-2 mt-5 flex flex-col items-center justify-center gap-x-2 rounded-3xl bg-red3 px-2 py-1.5 sm:flex-row sm:px-6 sm:py-2">
          <p className="flex gap-x-1 font-semibold text-red9">
            <img
              src="/icons/warning.svg"
              className="size-6"
              alt="Warning"
              aria-label="Warning"
            />
            Be careful!
          </p>
          <p className="text-secondary ">
            This phrase will grant access to all your funds.
          </p>
        </div> */}
      </section>
      <Ariakit.Separator
        orientation="horizontal"
        className="mx-auto my-3 w-full text-gray6"
      />
    </Layout>
  )
}
