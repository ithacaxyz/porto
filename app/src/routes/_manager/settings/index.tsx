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

import { cx } from 'cva'
import { Layout } from '~/components/AppLayout'
import { Button } from '~/components/Button'
import { Header } from '~/components/Header'
import { Pill } from '~/components/Pill'
import * as Constants from '~/lib/Constants'

export const Route = createFileRoute('/_manager/settings/')({
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
      <section className="px-3">
        <div className="mb-4 flex items-center gap-x-3">
          <div className="w-min rounded-full bg-gray3 p-2">
            <SettingsIcon className="size-5 text-gray11" />
          </div>
          <p className="font-medium text-xl">General</p>
        </div>
        <div className="flex items-center gap-x-3 pt-1">
          <div>
            <p className="text-lg">Emoji</p>
            <p className="text-gray10 ">A visual motif for your wallet.</p>
          </div>
          <Ariakit.MenuProvider>
            <Ariakit.MenuButton className="ml-auto flex items-center gap-x-3 rounded-3xl border-[1.5px] border-gray6 px-1 py-0.5">
              <p className="ml-1 text-xl">{userEmoji}</p>
              <ChevronDownIcon className="size-6 rounded-full bg-gray3 p-1 text-gray11 hover:bg-gray4" />
            </Ariakit.MenuButton>
            <Ariakit.Menu
              gutter={4}
              className="ml-2 max-h-[225px] space-y-1 overflow-y-auto rounded-sm bg-gray4 p-1"
            >
              {Constants.emojisArray.map((emoji) => (
                <Ariakit.MenuItem
                  key={emoji}
                  onClick={() => {
                    setUserEmoji(emoji)
                    localStorage.setItem('_porto_account_emoji', emoji)
                  }}
                  className={cx(
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
          <p className="text-lg">Wallet address</p>
          <p className="text-gray10 ">This is where you will receive funds.</p>
          <div className="mt-2 flex w-full flex-col items-center justify-between gap-x-2 gap-y-3.5 sm:flex-row">
            <p
              className={cx(
                'sm:mr-2 sm:text-[15.5px] md:tracking-wide',
                'no-scrollbar my-auto h-10 w-full overflow-auto rounded-default border border-gray6 px-3.5 pt-1.75 pb-1 text-[16.5px] text-gray11 tracking-normal',
              )}
            >
              {account?.address}
            </p>
            <div className="flex w-full items-center gap-x-2 *:text-lg sm:w-auto">
              <Button
                variant="default"
                className="w-full rounded-full sm:ml-auto"
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
                  className="w-full rounded-full sm:w-auto"
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
        className="mx-auto my-2 w-full text-gray6"
      />
      <section className="px-3">
        <div className="mb-4 flex items-center gap-x-3">
          <div className="w-min rounded-full bg-gray3 p-2">
            <SecurityIcon className="size-5 font-bold text-gray11" />
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
            <p className="text-gray10 ">
              Manage spend permissions you have granted.
            </p>
          </div>
          <Link
            to="/settings/permissions"
            className="h-10 rounded-full bg-gray4 px-3.5 hover:bg-gray3"
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
          <div className="w-min rounded-full bg-gray3 p-2">
            <LockIcon className="size-5 font-bold text-gray11" />
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
            <p className="text-gray10 ">
              These are used to restore access to your wallet.
            </p>
          </div>
          <Link
            to="/settings/recovery"
            className="h-10 rounded-full bg-gray4 px-3.5 hover:bg-gray3"
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
    </Layout>
  )
}
