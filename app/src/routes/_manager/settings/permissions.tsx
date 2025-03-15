import * as Ariakit from '@ariakit/react'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { cx } from 'cva'
import type { Hex } from 'ox'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import ChevronDownIcon from '~icons/lucide/chevron-down'
import HandCoinsIcon from '~icons/lucide/hand-coins'
import XIcon from '~icons/lucide/x'
import TimeIcon from '~icons/mingcute/time-line'
import WebIcon from '~icons/streamline/web'

import { Layout } from '~/components/AppLayout'
import { Button } from '~/components/Button'
import { Header } from '~/components/Header'
import { IndeterminateLoader } from '~/components/IndeterminateLoader'
import { Pill } from '~/components/Pill'
import { DateFormatter, StringFormatter } from '~/utils'

export const Route = createFileRoute('/_manager/settings/permissions')({
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
              <Permission permission={permission as any} />
            </li>
          ))}
        </ul>
      </section>

      {/* footer */}
      <div className="mt-3 flex h-10 justify-between rounded-2xl bg-gray3 pl-5">
        <p className="my-auto text-gray11">
          {permissions.data?.length ?? 0} app
          {permissions.data?.length === 1 ? '' : 's'} authorized
        </p>
        <button
          type="button"
          disabled={!permissions.data?.length}
          onClick={async (_event) => {
            if (!permissions.data) return
            await Promise.all(
              permissions.data.map((permission) =>
                revokePermissions.mutateAsync({
                  id: permission.id as `0x${string}`,
                }),
              ),
            )
          }}
          className={cx(
            'select-none rounded-tr-2xl rounded-br-2xl px-5 py-2 text-red-500 hover:bg-destructive',
            permissions.data && 'hover:bg-destructive',
            !permissions.data?.length && 'invisible',
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
  const revokePermissions = Hooks.useRevokePermissions({
    mutation: {
      onSuccess: (_) => toast.success('Permission revoked'),
    },
  })

  const [limit, setLimit] = React.useState(
    permission.permissions.spend[0]?.limit,
  )
  const [period, setPeriod] = React.useState<string | undefined>(
    permission.permissions.spend[0]?.period,
  )

  return (
    <React.Fragment>
      <div className="mb-0.5 hidden w-fit rounded-lg bg-secondary p-1 sm:block">
        <WebIcon className="text size-7 sm:size-9" />
      </div>
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
              <Pill className="cursor-default rounded-full text-xs sm:text-sm">
                <TimeIcon className="mr-0.5 size-4" />
                {DateFormatter.timeToDuration(permission.expiry * 1000)}
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
            value={limit}
            className="ml-1 h-full w-[3ch] bg-transparent text-gray11 text-md tabular-nums placeholder:text-gray8 focus:outline-none sm:text-lg"
            onInput={(event) => {
              const input = event.currentTarget.value
              setLimit(input)
              const newWidth = input.length >= 3 ? `${input.length}ch` : '3ch'
              event.currentTarget.style.width = newWidth
              if (input.includes('.')) {
                event.currentTarget.style.marginRight = '-0.85ch'
              }
            }}
          />
        </div>
        <span className="text-base text-gray9 sm:text-lg">per</span>
        <Ariakit.SelectProvider
          defaultValue={period}
          setValue={(v) => setPeriod(v as string)}
        >
          <Ariakit.Select className="ml-auto flex items-center gap-x-2 rounded-3xl border-2 border-gray-300/60 px-1 py-0.5">
            <div className="mb-0.5 ml-2 text-gray11 text-md sm:text-lg">
              <Ariakit.SelectValue />
            </div>
            <ChevronDownIcon className="size-6 rounded-full bg-gray-200 p-1 text-gray-700 hover:bg-gray-300" />
          </Ariakit.Select>
          <Ariakit.SelectPopover
            gutter={5}
            className="popover ml-2 space-y-1 rounded-md border-1 border-gray5 bg-gray1 p-1 shadow-lg"
          >
            {['minute', 'hour', 'day', 'week', 'month', 'year'].map((unit) => (
              <Ariakit.SelectItem
                key={unit}
                className={cx(
                  'select-none rounded-sm px-3.5 py-1 text-gray12 hover:bg-gray3',
                  unit === period && 'bg-gray4',
                )}
                value={unit}
              />
            ))}
          </Ariakit.SelectPopover>
        </Ariakit.SelectProvider>
      </div>
      <div className="-ml-0.5 -mr-1.5 min-h-[30px] min-w-0.5 bg-gray6 text-gray6 sm:mr-0 sm:ml-1" />
      <Ariakit.PopoverProvider>
        <Ariakit.PopoverDisclosure className="">
          <XIcon className="size-5 text-secondary hover:text-red9 sm:size-6" />
        </Ariakit.PopoverDisclosure>
        <Ariakit.Popover
          className="popover flex max-w-[250px] flex-col items-center justify-center gap-y-2 rounded-xl border border-gray6 bg-gray1 px-4.5 py-3.5 text-gray9 shadow-sm"
          backdrop={<div className="fixed inset-0 bg-black/10" />}
        >
          {revokePermissions.isPending ? (
            <IndeterminateLoader
              title="Revoking permission"
              className="mx-auto text-pretty"
              description=""
              hint=""
            />
          ) : (
            <div>
              <Ariakit.PopoverHeading className="mr-auto font-semibold text-gray12 text-xl">
                Revoke permission?
              </Ariakit.PopoverHeading>
              <Ariakit.PopoverDescription className="w-full text-balance text-md text-secondary">
                <strong>
                  {StringFormatter.truncate(permission.address, {
                    start: 5,
                    end: 5,
                  })}
                </strong>{' '}
                will no longer be able to spend without your explicit
                permission.
              </Ariakit.PopoverDescription>
              <div className="mt-auto flex w-full gap-x-3 pt-3 *:h-9 *:text-lg">
                <Ariakit.PopoverDismiss className="w-[50%]! rounded-3xl bg-gray5 px-2 py-1 hover:bg-gray6">
                  Cancel
                </Ariakit.PopoverDismiss>
                <Ariakit.Button
                  className="w-[50%]! rounded-3xl bg-red9 px-2 py-1 text-gray1 hover:bg-red8"
                  onClick={() =>
                    revokePermissions.mutate({ id: permission.id as Hex.Hex })
                  }
                >
                  Revoke
                </Ariakit.Button>
              </div>
            </div>
          )}
        </Ariakit.Popover>
      </Ariakit.PopoverProvider>
    </React.Fragment>
  )
}
