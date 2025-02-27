import * as Ariakit from '@ariakit/react'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { Hooks } from 'porto/wagmi'
import { Drawer } from 'vaul'
import { useAccount } from 'wagmi'
import ChevronDownIcon from '~icons/lucide/chevron-down'
import HandCoinsIcon from '~icons/lucide/hand-coins'
import XIcon from '~icons/lucide/x'
import UniswapIcon from '~icons/token/uniswap'

import { Json } from 'ox'
import { Layout } from '~/components/AppLayout'
import { Header } from '~/components/Header'
import { cn } from '~/utils'

export const Route = createFileRoute('/settings/permissions')({
  component: RouteComponent,
  head: (_context) => ({
    meta: [
      { name: 'title', content: 'Permissions' },
      { name: 'description', content: 'Manage your wallet permissions' },
    ],
  }),
})

function RouteComponent() {
  const account = useAccount()
  const permissions = Hooks.usePermissions()

  const revokePermissions = Hooks.useRevokePermissions()

  if (!account.isConnected) return <Navigate to="/" />

  return (
    <Layout>
      <Header />
      <Ariakit.Separator
        orientation="horizontal"
        className="mx-auto my-2 w-full text-gray6"
      />
      <section className="px-3">
        <div className="mb-6 flex items-center gap-x-3">
          <div className="w-min rounded-full bg-gray-200 p-2">
            <HandCoinsIcon className="size-6 text-gray-700" />
          </div>
          <div>
            <p className="font-medium text-xl">Spending</p>
            <p className="text-secondary dark:text-gray-200">
              Control how apps can use your money, or revoke their ability.
            </p>
          </div>
        </div>
        <div className="flex w-full items-center gap-x-3 pt-1">
          <div className="mb-2 w-fit rounded-lg bg-pink-500 p-1">
            <UniswapIcon className="size-6 text-white" />
          </div>
          <div>
            <p className="text-lg">Uniswap</p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://app.uniswap.org"
              className="text-secondary dark:text-gray-200"
            >
              app.uniswap.org
            </a>
          </div>
          <div className="ml-auto flex items-center gap-x-2">
            <div className="flex h-9 w-min min-w-[70px] items-center rounded-full border-2 border-gray-300/60 py-1 pr-3 pl-3 text-center text-gray9 text-lg">
              <span className="-mr-0.5 text-gray9">$</span>
              <input
                type="number"
                size={200}
                placeholder="100"
                className="ml-1 h-full w-[3ch] bg-transparent text-gray9 text-lg tabular-nums focus:outline-none"
                onInput={(event) => {
                  const input = event.currentTarget.value
                  const newWidth =
                    input.length >= 3 ? `${input.length}ch` : '3ch'
                  event.currentTarget.style.width = newWidth
                  if (input.includes('.')) {
                    event.currentTarget.style.marginRight = '-0.85ch'
                  }
                }}
              />
            </div>
            <span className="text-gray9 text-lg">per</span>
            <Ariakit.MenuProvider>
              <Ariakit.MenuButton className="ml-auto flex items-center gap-x-2 rounded-3xl border-2 border-gray-300/60 px-1 py-0.5">
                <span className="mb-0.5 ml-2 text-gray9 text-lg">day</span>
                <ChevronDownIcon className="size-6 rounded-full bg-gray-200 p-1 text-gray-700 hover:bg-gray-300" />
              </Ariakit.MenuButton>
              <Ariakit.Menu
                gutter={5}
                className="space-y-1 rounded-sm border border-gray6 bg-gray4 p-1 shadow-lg"
              >
                {['minute', 'hour', 'day', 'week', 'month', 'year'].map(
                  (unit) => (
                    <Ariakit.MenuItem
                      key={unit}
                      className={cn(
                        'select-none rounded-sm bg-gray4 px-3 py-1 text-gray12 hover:bg-gray2',
                        unit === 'day' && 'bg-gray2',
                      )}
                    >
                      {unit}
                    </Ariakit.MenuItem>
                  ),
                )}
              </Ariakit.Menu>
            </Ariakit.MenuProvider>
          </div>
          <Ariakit.Separator
            orientation="horizontal"
            className="h-[30px] min-h-full w-0.5 bg-gray6 text-gray6"
          />

          <Drawer.Root>
            <Drawer.Trigger asChild>
              <button
                type="button"
                className=" rounded-2xl rounded-br-2xl text-gray8 hover:text-red-500"
              >
                <XIcon className="size-6" />
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Handle />
              <Drawer.Content className="fixed right-0 bottom-0 left-0 mx-auto h-fit w-full rounded-t-3xl bg-gray1 px-6 py-4 outline-none sm:w-[330px]">
                <Drawer.Title className="mb-2 font-medium text-2xl">
                  Revoke permissions?
                </Drawer.Title>
                <Drawer.Close className="absolute top-5 right-5">
                  <XIcon className="size-6 text-secondary" />
                </Drawer.Close>
                <Drawer.Description className="text-lg text-secondary">
                  Uniswap will no longer be able to spend without your explicit
                  permission.
                </Drawer.Description>
                <div className="mt-4 flex justify-around gap-x-2">
                  <Drawer.Close className="rounded-3xl bg-gray4 px-6 py-2 font-medium text-gray12 text-xl hover:bg-gray5">
                    Cancel
                  </Drawer.Close>
                  <button
                    type="button"
                    className="rounded-3xl bg-red-500 px-6 py-2 font-medium text-white text-xl hover:bg-red-600"
                    onClick={(_event) => {
                      revokePermissions.mutate({
                        /* TODO: replace with the actual id once I figure out why permissions not working */
                        id: '0x00',
                      })
                    }}
                  >
                    Revoke
                  </button>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
      </section>
      <div className="mt-3 flex justify-between rounded-2xl bg-gray3 pl-5">
        <p className="my-auto text-gray10 dark:text-gray-200">
          {permissions?.data?.length} app
          {permissions?.data?.length === 1 ? '' : 's'} authorized
        </p>
        <button
          type="button"
          className="select-none rounded-tr-2xl rounded-br-2xl px-5 py-2 text-red-500 hover:bg-destructive"
        >
          Revoke all
        </button>
      </div>
      <pre>{Json.stringify(permissions?.data, null, 2)}</pre>
    </Layout>
  )
}
