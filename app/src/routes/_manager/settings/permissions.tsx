import * as Ariakit from '@ariakit/react'
// import { useFloating } from '@floating-ui/react'
import { Navigate, createFileRoute } from '@tanstack/react-router'
// import { Json } from 'ox'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { Drawer } from 'vaul'
import { useAccount } from 'wagmi'
import ChevronDownIcon from '~icons/lucide/chevron-down'
import HandCoinsIcon from '~icons/lucide/hand-coins'
import XIcon from '~icons/lucide/x'
import TimeIcon from '~icons/mingcute/time-line'
// import WebIcon from '~icons/streamline/web'
// import UniswapIcon from '~icons/token/uniswap'

// import { Hex, Value } from 'ox'
import { Layout } from '~/components/AppLayout'
import { Button } from '~/components/Button'
import { ExpIcon } from '~/components/Exp'
// import { Button } from '~/components/Button'
import { Header } from '~/components/Header'
import { Pill } from '~/components/Pill'
import { StringFormatter, cn } from '~/utils'

export const Route = createFileRoute('/_manager/settings/permissions')({
  component: RouteComponent,
  head: (_context) => ({
    meta: [
      { name: 'title', content: 'Permissions' },
      { name: 'description', content: 'Manage your wallet permissions' },
    ],
  }),
})

const permissions = {
  data: [
    {
      address: '0xb4054fb59d4ca93684600926e32b16384552d4b5',
      expiry: 1741312590,
      id: '0x252296603e9c8e9fed4aca61ee0d94dd0bb77147cf1b1b3a3d4644ea0e1330bfa14b0ef601e7a85181ce469a8dd82ca55175f5a399b469485e2447078b167405',
      key: {
        publicKey:
          '0x252296603e9c8e9fed4aca61ee0d94dd0bb77147cf1b1b3a3d4644ea0e1330bfa14b0ef601e7a85181ce469a8dd82ca55175f5a399b469485e2447078b167405',
        type: 'p256',
      },
      permissions: {
        calls: [
          {
            to: '0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c',
          },
        ],
        spend: [
          {
            limit: '0x2b5e3af16b1880000',
            period: 'minute',
            token: '0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c',
          },
        ],
      },
    },
    {
      address: '0xb4054fb59d4ca93684600926e32b16384552d4b5',
      expiry: 1741313176,
      id: '0xf3c6c407260f8b5e685630af06a2bf583971736c8e7c38befe5ecfb6bdf1d002a07a61cc427370c540f30b95398bcb76aeed2ce1d8966cd56a5ac448229855c2',
      key: {
        publicKey:
          '0xf3c6c407260f8b5e685630af06a2bf583971736c8e7c38befe5ecfb6bdf1d002a07a61cc427370c540f30b95398bcb76aeed2ce1d8966cd56a5ac448229855c2',
        type: 'p256',
      },
      permissions: {
        calls: [
          {
            to: '0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c',
          },
        ],
        spend: [
          {
            limit: '0x2b5e3af16b1880000',
            period: 'minute',
            token: '0x706aa5c8e5cc2c67da21ee220718f6f6b154e75c',
          },
        ],
      },
    },
  ],
}

function RouteComponent() {
  const account = useAccount()
  // const permissions = Hooks.usePermissions()
  const revokePermissions = Hooks.useRevokePermissions()

  if (!account.isConnected) return <Navigate to="/" />

  return (
    <Layout>
      <Header />
      <Ariakit.Separator
        orientation="horizontal"
        className="mx-auto my-2 w-full text-gray6"
      />

      {/* header */}
      <section className="mb-3 flex items-center gap-x-3 sm:px-3">
        <div className="w-min rounded-full bg-gray-200 p-2">
          <HandCoinsIcon className="size-6 text-gray-700" />
        </div>
        <div>
          <p className="font-medium text-xl">Spending</p>
          <p className="text-secondary">
            Control how apps can use your money, or revoke their ability.
          </p>
        </div>
      </section>

      {/* permissions */}
      <section className="sm:px-3">
        <ul className="space-y-4">
          {permissions.data?.map((permission) => (
            <li
              key={permission.id}
              className="flex w-full items-center gap-x-3 px-2 pt-1 sm:px-0"
            >
              <Permission permission={permission} />
            </li>
          ))}
        </ul>
      </section>

      {/* footer */}
      <div className="mt-3 flex h-10 justify-between rounded-2xl bg-gray3 pl-5">
        <p className="my-auto text-gray11">
          {permissions?.data?.length ?? 0} app
          {permissions?.data?.length === 1 ? '' : 's'} authorized
        </p>
        <button
          type="button"
          disabled={!permissions.data?.length}
          onClick={async (_event) => {
            if (!permissions.data) return
            await Promise.all(
              permissions.data?.map((permission) =>
                revokePermissions.mutateAsync({
                  id: permission.id as `0x${string}`,
                }),
              ),
            )
          }}
          className={cn(
            'select-none rounded-tr-2xl rounded-br-2xl px-5 py-2 text-red-500 hover:bg-destructive',
            permissions?.data && 'hover:bg-destructive',
            !permissions?.data?.length && 'invisible',
          )}
        >
          Revoke all
        </button>
      </div>
    </Layout>
  )
}

function Permission({
  permission,
}: {
  permission: {
    address: string
    expiry: number
    id: string
    key: { publicKey: string; type: string }
    permissions: {
      calls: { to: string }[]
      spend: { limit: string; period: string; token: string }[]
    }
  }
}) {
  const revokePermissions = Hooks.useRevokePermissions()
  // const grantPermissions = Hooks.useGrantPermissions()

  return (
    <React.Fragment>
      {/* <div className="mb-0.5 w-fit rounded-lg bg-pink-500 p-1">
                <UniswapIcon className="size-10 text-white" />
              </div> */}
      <div className="mb-0.5 hidden w-fit rounded-lg bg-[#0688F1] p-1 sm:block">
        <ExpIcon className="size-7 text-white sm:size-10" />
      </div>
      {/* <div className="mb-0.5 w-fit rounded-3xl bg-gray9 p-1">
                <WebIcon className="size-9 text-white" />
              </div> */}
      <div>
        <p className="text-base sm:text-lg">
          {/* TODO: replace with name */}
          {StringFormatter.truncate(permission.address)}
        </p>
        <div className="flex items-center gap-x-2 text-sm sm:text-md">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://ithaca.xyz"
            className="text-gray11 text-sm hover:text-gray11 sm:text-md"
          >
            ithaca.xyz
          </a>
          <Ariakit.TooltipProvider>
            <Ariakit.TooltipAnchor className="">
              <Pill className="cursor-default text-xs sm:text-sm">
                <TimeIcon className="mr-0.5 size-4" />
                {permission.permissions.spend[0]?.period}
              </Pill>
            </Ariakit.TooltipAnchor>
            <Ariakit.Tooltip className="max-w-[210px] text-pretty rounded-xl border border-gray6 bg-gray1 px-3.5 py-2 text-gray9 shadow-xs">
              This permission expires on{' '}
              <span className="text-gray12">
                {new Date(permission.expiry * 1000).toLocaleString()}
              </span>{' '}
              local time.
              <br />
              <Button
                variant="default"
                className="mt-1.5 mb-1 w-full rounded-full! text-center"
              >
                Change expiry
              </Button>
            </Ariakit.Tooltip>
          </Ariakit.TooltipProvider>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <div className="flex h-9 w-min min-w-[70px] items-center rounded-full border-2 border-gray-300/60 py-1 pr-3 pl-3 text-center text-gray9 text-md sm:text-lg">
          <span className="-mr-0.5 text-gray9">$</span>
          <input
            size={200}
            type="number"
            placeholder="100"
            className="ml-1 h-full w-[3ch] bg-transparent text-gray11 text-md tabular-nums placeholder:text-gray8 focus:outline-none sm:text-lg"
            onInput={(event) => {
              const input = event.currentTarget.value
              const newWidth = input.length >= 3 ? `${input.length}ch` : '3ch'
              event.currentTarget.style.width = newWidth
              if (input.includes('.')) {
                event.currentTarget.style.marginRight = '-0.85ch'
              }
            }}
          />
        </div>
        <span className="text-base text-gray9 sm:text-lg">per</span>
        <Ariakit.MenuProvider>
          <Ariakit.MenuButton className="ml-auto flex items-center gap-x-2 rounded-3xl border-2 border-gray-300/60 px-1 py-0.5">
            <span className="mb-0.5 ml-2 text-gray11 text-md sm:text-lg">
              day
            </span>
            <ChevronDownIcon className="size-6 rounded-full bg-gray-200 p-1 text-gray-700 hover:bg-gray-300" />
          </Ariakit.MenuButton>
          <Ariakit.Menu
            gutter={5}
            className="space-y-1 rounded-sm border border-gray6 bg-gray4 p-1 shadow-lg"
          >
            {['minute', 'hour', 'day', 'week', 'month', 'year'].map((unit) => (
              <Ariakit.MenuItem
                key={unit}
                className={cn(
                  'select-none rounded-sm bg-gray4 px-3 py-1 text-gray12 hover:bg-gray2',
                  unit === 'day' && 'bg-gray2',
                )}
              >
                {unit}
              </Ariakit.MenuItem>
            ))}
          </Ariakit.Menu>
        </Ariakit.MenuProvider>
      </div>
      {/* <Ariakit.Separator
        orientation="horizontal"
        className="min-h-[30px] min-w-0.25 bg-gray9 p-0 text-gray6"
      /> */}
      <div className="-ml-0.5 -mr-1.5 min-h-[30px] min-w-0.5 bg-gray6 text-gray6 sm:mr-0 sm:ml-1" />
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <button
            type="button"
            className="rounded-2xl rounded-br-2xl text-gray8 hover:text-red-500"
          >
            <XIcon className="size-5 sm:size-6" />
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Handle />
          <Drawer.Content className="fixed right-0 bottom-0 left-0 mx-auto h-fit w-full rounded-t-3xl bg-gray1 px-6 py-4 outline-none sm:w-[330px]">
            <Drawer.Title className="mb-2 font-medium text-lg sm:text-2xl">
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
    </React.Fragment>
  )
}
